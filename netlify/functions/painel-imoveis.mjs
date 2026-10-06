// API do painel de imóveis (/admin). Guarda imóveis e fotos no Netlify Blobs
// (store "imoveis") e, a cada alteração, chama o build hook: o plugin
// plugins/imoveis-blobs traz os dados para o disco e scripts/gerar-imoveis.mjs
// gera as páginas.
//
// Variáveis de ambiente (Netlify → Site configuration → Environment variables):
//   PAINEL_SENHA       senha do painel
//   PAINEL_SEGREDO     chave aleatória que assina o cookie de sessão
//   PAINEL_BUILD_HOOK  URL do build hook que republica o site
//
// Chaves no store:
//   dados/<slug>   JSON do imóvel (mesmos campos que o gerador lê)
//   fotos/<nome>   binário da foto; metadata { tipo }

import { getStore } from '@netlify/blobs';
import crypto from 'node:crypto';

export const config = { path: '/api/painel/*' };

const COOKIE = 'fm_painel';
const SESSAO_DIAS = 30;
const FOTO_MAX = 5 * 1024 * 1024;
const TIPOS_FOTO = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const RE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RE_FOTO = /^[a-f0-9]{24}\.(jpg|png|webp)$/;

const store = () => getStore({ name: 'imoveis', consistency: 'strong' });

// ---------- respostas ----------

const json = (dados, status = 200, headers = {}) => new Response(JSON.stringify(dados), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
});

const erro = (msg, status = 400) => json({ erro: msg }, status);

// ---------- sessão ----------

function assinar(valor) {
  return crypto.createHmac('sha256', process.env.PAINEL_SEGREDO).update(valor).digest('base64url');
}

function criarSessao() {
  const exp = String(Date.now() + SESSAO_DIAS * 864e5);
  return `${exp}.${assinar(exp)}`;
}

function sessaoValida(req) {
  const m = (req.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return false;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const esperado = Buffer.from(assinar(exp));
  const recebido = Buffer.from(sig);
  return esperado.length === recebido.length && crypto.timingSafeEqual(esperado, recebido);
}

function cookie(valor, maxAge) {
  return `${COOKIE}=${valor}; Path=/api/painel; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

function senhaConfere(tentativa) {
  const h = (s) => crypto.createHash('sha256').update(String(s)).digest();
  return crypto.timingSafeEqual(h(tentativa), h(process.env.PAINEL_SENHA));
}

// ---------- imóvel ----------

const slugify = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const texto = (v, max = 200) => String(v ?? '').trim().slice(0, max);

function inteiro(v, min = 0, max = 1e9) {
  if (v === '' || v == null) return null;
  const n = Math.round(Number(String(v).replace(/[^\d.,-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')));
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

function decimal(v) {
  if (v === '' || v == null) return null;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) && n >= 0 && n < 1e6 ? Math.round(n * 100) / 100 : null;
}

// Aceita só os campos que o gerador conhece, já no formato certo.
function limpar(d) {
  const fotos = (Array.isArray(d.fotos) ? d.fotos : [])
    .map((f) => String(f).replace(/^\/imoveis\/fotos\//, ''))
    .filter((f) => RE_FOTO.test(f))
    .slice(0, 40)
    .map((f) => `/imoveis/fotos/${f}`);
  const imovel = {
    titulo: texto(d.titulo, 120),
    status: ['rascunho', 'publicado', 'vendido'].includes(d.status) ? d.status : 'rascunho',
    destaque: Boolean(d.destaque),
    tipo: d.tipo === 'leilao' ? 'leilao' : 'venda',
    cidade: texto(d.cidade, 60),
    uf: texto(d.uf, 2).toUpperCase(),
    bairro: texto(d.bairro, 60),
    preco: inteiro(d.preco, 0, 1e10),
    preco_rotulo: texto(d.preco_rotulo, 40),
    desconto: inteiro(d.desconto, 0, 99),
    selo: texto(d.selo, 40),
    quartos: inteiro(d.quartos, 0, 99),
    banheiros: inteiro(d.banheiros, 0, 99),
    vagas: inteiro(d.vagas, 0, 99),
    area: decimal(d.area),
    descricao: texto(d.descricao, 5000),
    fotos,
    video: texto(d.video, 200),
    whatsapp: String(d.whatsapp ?? '').replace(/\D/g, '').slice(0, 15),
    ordem: inteiro(d.ordem, -999, 999) ?? 0,
  };
  // campos vazios saem do JSON para o gerador usar os padrões
  for (const k of Object.keys(imovel)) {
    if (imovel[k] === null || imovel[k] === '') delete imovel[k];
  }
  return imovel;
}

async function lerImovel(slug) {
  return store().get(`dados/${slug}`, { type: 'json' });
}

async function slugLivre(base) {
  const s = store();
  let slug = base || 'imovel';
  for (let n = 2; await s.getMetadata(`dados/${slug}`); n++) slug = `${base}-${n}`;
  return slug;
}

async function apagarFotos(caminhos) {
  const s = store();
  await Promise.all(caminhos.map((c) => s.delete(`fotos/${c.replace('/imoveis/fotos/', '')}`)));
}

// Republica o site. Falha aqui não perde o dado: fica salvo e sai no próximo build.
async function republicar() {
  const hook = process.env.PAINEL_BUILD_HOOK;
  if (!hook) return false;
  try {
    const r = await fetch(`${hook}?trigger_title=${encodeURIComponent('Painel de imóveis')}`, { method: 'POST' });
    return r.ok;
  } catch {
    return false;
  }
}

// ---------- rotas ----------

export default async (req) => {
  if (!process.env.PAINEL_SENHA || !process.env.PAINEL_SEGREDO) {
    return erro('Painel sem configuração (PAINEL_SENHA / PAINEL_SEGREDO).', 500);
  }

  const url = new URL(req.url);
  const partes = url.pathname.replace(/^\/api\/painel\/?/, '').split('/').filter(Boolean);
  const [recurso, id] = partes;
  const metodo = req.method;

  // mutações só com JSON (ou imagem) e da própria origem: barra CSRF junto com o SameSite
  if (metodo !== 'GET') {
    const origem = req.headers.get('origin');
    if (origem && origem !== url.origin) return erro('Origem não permitida.', 403);
  }

  if (recurso === 'login' && metodo === 'POST') {
    const { senha } = await req.json().catch(() => ({}));
    if (!senha || !senhaConfere(senha)) {
      await new Promise((r) => setTimeout(r, 900));
      return erro('Senha incorreta.', 401);
    }
    return json({ ok: true }, 200, { 'Set-Cookie': cookie(criarSessao(), SESSAO_DIAS * 86400) });
  }

  if (recurso === 'sair' && metodo === 'POST') {
    return json({ ok: true }, 200, { 'Set-Cookie': cookie('', 0) });
  }

  if (!sessaoValida(req)) return erro('Sessão expirada. Entre de novo.', 401);

  if (recurso === 'sessao') return json({ ok: true });

  // ----- imóveis -----
  if (recurso === 'imoveis') {
    const s = store();

    if (!id && metodo === 'GET') {
      const { blobs } = await s.list({ prefix: 'dados/' });
      const lista = await Promise.all(blobs.map(async ({ key }) => {
        const d = await s.get(key, { type: 'json' });
        return d && { slug: key.slice(6), titulo: d.titulo, bairro: d.bairro, cidade: d.cidade, status: d.status, destaque: d.destaque, preco: d.preco, capa: d.fotos?.[0], ordem: d.ordem ?? 0, atualizado: d.atualizado };
      }));
      return json(lista.filter(Boolean));
    }

    if (!id && metodo === 'POST') {
      const dados = limpar(await req.json().catch(() => ({})));
      if (!dados.titulo) return erro('Dê um título ao imóvel.');
      const slug = await slugLivre(slugify(`${dados.titulo} ${dados.bairro || ''}`));
      dados.atualizado = new Date().toISOString();
      await s.setJSON(`dados/${slug}`, dados);
      return json({ slug, republicando: await republicar() }, 201);
    }

    if (!id || !RE_SLUG.test(id)) return erro('Imóvel inválido.', 404);
    const atual = await lerImovel(id);
    if (!atual) return erro('Imóvel não encontrado.', 404);

    if (metodo === 'GET') return json({ slug: id, ...atual });

    if (metodo === 'PUT') {
      const dados = limpar(await req.json().catch(() => ({})));
      if (!dados.titulo) return erro('Dê um título ao imóvel.');
      dados.atualizado = new Date().toISOString();
      await s.setJSON(`dados/${id}`, dados);
      const removidas = (atual.fotos || []).filter((f) => !(dados.fotos || []).includes(f));
      await apagarFotos(removidas);
      return json({ slug: id, republicando: await republicar() });
    }

    if (metodo === 'DELETE') {
      await s.delete(`dados/${id}`);
      await apagarFotos(atual.fotos || []);
      return json({ ok: true, republicando: await republicar() });
    }
  }

  // ----- fotos -----
  if (recurso === 'fotos') {
    const s = store();

    if (!id && metodo === 'POST') {
      const tipo = (req.headers.get('content-type') || '').split(';')[0];
      const ext = TIPOS_FOTO[tipo];
      if (!ext) return erro('Envie JPG, PNG ou WebP.');
      const corpo = await req.arrayBuffer();
      if (!corpo.byteLength) return erro('Foto vazia.');
      if (corpo.byteLength > FOTO_MAX) return erro('Foto acima de 5 MB.');
      const nome = `${crypto.randomBytes(12).toString('hex')}.${ext}`;
      await s.set(`fotos/${nome}`, corpo, { metadata: { tipo } });
      return json({ caminho: `/imoveis/fotos/${nome}` }, 201);
    }

    // prévia no painel antes do build copiar a foto para o site
    if (id && metodo === 'GET' && RE_FOTO.test(id)) {
      const r = await s.getWithMetadata(`fotos/${id}`, { type: 'arrayBuffer' });
      if (!r) return erro('Foto não encontrada.', 404);
      return new Response(r.data, { headers: { 'Content-Type': r.metadata?.tipo || 'image/jpeg', 'Cache-Control': 'private, max-age=31536000, immutable' } });
    }
  }

  if (recurso === 'republicar' && metodo === 'POST') {
    return json({ republicando: await republicar() });
  }

  return erro('Rota não encontrada.', 404);
};
