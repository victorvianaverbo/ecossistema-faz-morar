// Gera o marketplace de imóveis a partir dos JSONs em imoveis/_dados/. No build
// da Netlify, esses JSONs (e as fotos) descem do Netlify Blobs pelo plugin
// plugins/imoveis-blobs, que guarda o que o painel /admin grava. Local, dá para
// testar com JSONs à mão: `node scripts/gerar-imoveis.mjs`. Node puro.
//
// Saída:
//   imoveis/index.html            vitrine com filtro por tipo e cidade
//   imoveis/<slug>/index.html     ficha de cada imóvel publicado ou vendido
//   home/index.html               bloco entre <!-- IMOVEIS:INICIO/FIM -->
//
// Toda pasta dentro de imoveis/ que não seja _dados/ ou fotos/ é gerada aqui e
// apagada a cada rodada, para que imóvel excluído no painel saia do ar.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR_IMOVEIS = path.join(RAIZ, 'imoveis');
const DIR_DADOS = path.join(DIR_IMOVEIS, '_dados');
const PASTAS_FIXAS = new Set(['_dados', 'fotos']);
const SITE = 'https://fazmorar.com.br';
const WHATSAPP_PADRAO = '5531996951660';
const VERSAO_CSS = '20260928';
const MAX_DESTAQUES = 3;

// ---------- utilidades ----------

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const brl = (n) => 'R$ ' + Math.round(n).toLocaleString('pt-BR');

const slugify = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const soDigitos = (s) => String(s ?? '').replace(/\D/g, '');

// Netlify Image CDN. Sem fm= o PNG passa inteiro, então o formato é sempre explícito.
function img(src, w, extra = '') {
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&fm=webp&q=72${extra}`;
}

function srcset(src, larguras, extra = '') {
  return larguras.map((w) => `${img(src, w, extra)} ${w}w`).join(', ');
}

function youtubeId(url) {
  const m = String(url || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

// Descrição é texto simples: parágrafo por linha em branco, "- " vira lista.
function textoParaHtml(texto) {
  return String(texto || '').trim().split(/\n\s*\n/).map((bloco) => {
    const linhas = bloco.split('\n').map((l) => l.trim()).filter(Boolean);
    if (linhas.length && linhas.every((l) => /^[-•*]\s+/.test(l))) {
      return '<ul>' + linhas.map((l) => `<li>${esc(l.replace(/^[-•*]\s+/, ''))}</li>`).join('') + '</ul>';
    }
    return `<p>${linhas.map(esc).join('<br>')}</p>`;
  }).join('\n');
}

// ---------- dados ----------

function carregarImoveis() {
  if (!fs.existsSync(DIR_DADOS)) return [];
  const lista = [];
  for (const arq of fs.readdirSync(DIR_DADOS)) {
    if (!arq.endsWith('.json')) continue;
    let d;
    try {
      d = JSON.parse(fs.readFileSync(path.join(DIR_DADOS, arq), 'utf8'));
    } catch (e) {
      console.warn(`[imoveis] ignorado, JSON inválido: ${arq} (${e.message})`);
      continue;
    }
    const slug = slugify(arq.replace(/\.json$/, ''));
    if (!slug || PASTAS_FIXAS.has(slug) || !d.titulo) {
      console.warn(`[imoveis] ignorado, sem título ou slug: ${arq}`);
      continue;
    }
    const fotos = (Array.isArray(d.fotos) ? d.fotos : [])
      .map((f) => (typeof f === 'string' ? f : f && f.imagem))
      .filter(Boolean);
    lista.push({
      ...d,
      slug,
      fotos,
      status: d.status || 'rascunho',
      tipo: d.tipo === 'leilao' ? 'leilao' : 'venda',
      preco: Number(d.preco) || 0,
      ordem: Number(d.ordem) || 0,
      whatsapp: soDigitos(d.whatsapp) || WHATSAPP_PADRAO,
      url: `/imoveis/${slug}/`,
    });
  }
  // publicados antes dos vendidos; depois pela ordem do painel e pelo título
  const peso = { publicado: 0, vendido: 1 };
  return lista
    .filter((i) => i.status in peso)
    .sort((a, b) => peso[a.status] - peso[b.status] || a.ordem - b.ordem || a.titulo.localeCompare(b.titulo, 'pt-BR'));
}

// ---------- pedaços do site (lidos de /servicos/ para o menu nunca divergir) ----------

function pedacosDoSite() {
  const base = fs.readFileSync(path.join(RAIZ, 'servicos', 'index.html'), 'utf8');
  const pegar = (ini, fim) => {
    const a = base.indexOf(ini);
    const b = base.indexOf(fim, a);
    if (a < 0 || b < 0) throw new Error(`[imoveis] não achei ${ini} em servicos/index.html`);
    return base.slice(a, b + fim.length);
  };
  let header = pegar('<header class="nav">', '</header>')
    .replace(/ class="is-active"/g, '')
    .replace('<a href="/imoveis/">Imóveis</a>', '<a href="/imoveis/" class="is-active">Imóveis</a>');
  return {
    header,
    footer: pegar('<footer class="footer-c">', '</footer>'),
    pixel: pegar('<!-- Meta Pixel Code -->', '<!-- End Meta Pixel Code -->'),
  };
}

function pagina({ titulo, descricao, url, ogImage, conteudo, extraHead = '', pedacos }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(titulo)}</title>
  <meta name="description" content="${esc(descricao)}">
  <link rel="canonical" href="${SITE}${url}">
  <meta property="og:title" content="${esc(titulo)}">
  <meta property="og:description" content="${esc(descricao)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${SITE}${url}">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta property="og:locale" content="pt_BR">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="preload" as="font" type="font/woff2" href="/_shared/fonts/figtree-400-700.woff2" crossorigin>
  <link rel="preload" as="font" type="font/woff2" href="/_shared/fonts/dm-serif-display-400.woff2" crossorigin>
  <link rel="stylesheet" href="/_shared/fonts.css?v=20260719b">
  <link rel="stylesheet" href="/_shared/reveal.css?v=20260719b">
  <link rel="stylesheet" href="/_shared/base.css?v=20260928">
  <link rel="stylesheet" href="/imoveis/style.css?v=${VERSAO_CSS}">
${extraHead}  <link rel="preconnect" href="https://connect.facebook.net">
  ${pedacos.pixel}
</head>
<body>

  ${pedacos.header}

  <main>
${conteudo}
  </main>

  ${pedacos.footer}

  <script src="/_shared/reveal.js?v=20260719b" defer></script>
  <script src="/_shared/nav.js?v=20260719b" defer></script>
  <script src="/imoveis/imoveis.js?v=${VERSAO_CSS}" defer></script>
</body>
</html>
`;
}

// ---------- card (vitrine e home) ----------

function localDe(i) {
  return [i.cidade, i.uf].filter(Boolean).join(' · ').toUpperCase();
}

function nomeDoCard(i) {
  return i.bairro ? `${i.titulo} · ${i.bairro}` : i.titulo;
}

function card(i, n, { lazy = true } = {}) {
  const capa = i.fotos[0];
  const vendido = i.status === 'vendido';
  const tag = vendido ? 'Vendido' : (i.desconto ? `−${Math.round(i.desconto)}%` : '');
  const selo = vendido ? '' : (i.selo || (i.tipo === 'leilao' ? 'Leilão' : 'Venda direta'));
  const media = capa
    ? `<img class="listing__img" src="${img(capa, 640)}" srcset="${srcset(capa, [400, 640, 900])}" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" alt="${esc(i.titulo)}" width="640" height="400"${lazy ? ' loading="lazy"' : ''} decoding="async">`
    : `<div class="listing__media-bg listing__media-bg--${(n % 3) + 1}" aria-hidden="true"></div>`;
  return `        <a href="${i.url}" class="listing${vendido ? ' listing--vendido' : ''}" data-tipo="${i.tipo}" data-cidade="${esc(i.cidade || '')}" data-aos="fade-up" data-aos-delay="${(n % 3) * 100}">
          <div class="listing__media">
            ${media}
            ${tag ? `<span class="listing__tag${vendido ? ' listing__tag--vendido' : ''}">${esc(tag)}</span>` : ''}
          </div>
          <div class="listing__body">
            <div class="listing__city">${esc(localDe(i))}</div>
            <h3 class="listing__name">${esc(nomeDoCard(i))}</h3>
            <div class="listing__foot">
              <div>
                ${i.preco ? `<div class="listing__price-label">${esc(i.preco_rotulo || (i.tipo === 'leilao' ? 'Lance inicial' : 'Valor'))}</div>
                <div class="listing__price">${brl(i.preco)}</div>` : `<div class="listing__price-label">Valor</div>
                <div class="listing__price listing__price--consulte">Sob consulta</div>`}
              </div>
              ${selo ? `<span class="listing__status">${esc(selo)}</span>` : ''}
            </div>
          </div>
        </a>`;
}

// ---------- vitrine ----------

function paginaVitrine(imoveis, pedacos) {
  const cidades = [...new Set(imoveis.map((i) => i.cidade).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const tipos = new Set(imoveis.map((i) => i.tipo));
  const temFiltro = imoveis.length > 3 && (cidades.length > 1 || tipos.size > 1);

  const filtros = temFiltro ? `
      <div class="im-filtros" data-aos="fade-up">
        ${tipos.size > 1 ? `<div class="im-filtros__tipos" role="group" aria-label="Tipo de oportunidade">
          <button type="button" class="im-chip is-on" data-filtro-tipo="">Todos</button>
          <button type="button" class="im-chip" data-filtro-tipo="venda">Venda direta</button>
          <button type="button" class="im-chip" data-filtro-tipo="leilao">Leilão</button>
        </div>` : ''}
        ${cidades.length > 1 ? `<label class="im-filtros__cidade">
          <span class="sr-only">Cidade</span>
          <select data-filtro-cidade>
            <option value="">Todas as cidades</option>
            ${cidades.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('\n            ')}
          </select>
        </label>` : ''}
      </div>` : '';

  const grade = imoveis.length ? `
      <div class="listings__grid" data-grade>
${imoveis.map((i, n) => card(i, n, { lazy: n > 2 })).join('\n')}
      </div>
      <p class="im-vazio-filtro" data-vazio hidden>Nenhum imóvel com esse filtro agora. <button type="button" class="im-link" data-limpar>Ver todos</button></p>` : `
      <div class="im-vazio" data-aos="fade-up">
        <h2 class="im-vazio__title">Novas oportunidades chegando.</h2>
        <p class="im-vazio__text">Estamos selecionando os próximos imóveis. Fale com a gente e avisamos primeiro quando entrar algo no seu perfil.</p>
        <a href="https://wa.me/${WHATSAPP_PADRAO}?text=${encodeURIComponent('Olá! Quero ser avisado dos próximos imóveis do marketplace da Faz Morar.')}" class="btn btn--primary" data-contato>Quero ser avisado</a>
      </div>`;

  const conteudo = `
    <section class="im-head">
      <h1 class="im-head__title">Imóveis selecionados, prontos para morar ou investir.</h1>
      <p class="im-head__sub">Venda direta e oportunidades de leilão com curadoria da Faz Morar e toda a documentação cuidada por nós.</p>
    </section>

    <section class="listings im-listings" aria-label="Imóveis disponíveis">
${filtros}
${grade}
    </section>

    <section class="im-cta">
      <div class="im-cta__band" data-aos="fade-up">
        <div>
          <h2 class="im-cta__title">Quer vender seu imóvel?</h2>
          <p class="im-cta__text">Anunciamos imóveis particulares com fotos, ficha completa e atendimento da nossa equipe. Chame no WhatsApp e avaliamos o seu.</p>
        </div>
        <a href="https://wa.me/${WHATSAPP_PADRAO}?text=${encodeURIComponent('Olá! Quero anunciar meu imóvel no marketplace da Faz Morar.')}" class="btn btn--primary" data-contato>Anunciar meu imóvel</a>
      </div>
    </section>
`;
  const primeiraCapa = imoveis.find((i) => i.fotos[0]);
  return pagina({
    titulo: 'Imóveis à venda | Faz Morar · Marketplace de imóveis em BH',
    descricao: 'Imóveis selecionados pela Faz Morar em Belo Horizonte e região: venda direta e oportunidades de leilão, com consultoria e documentação cuidada por nós.',
    url: '/imoveis/',
    ogImage: primeiraCapa ? SITE + img(primeiraCapa.fotos[0], 1200, '&h=630&fit=cover').replace('fm=webp', 'fm=jpg') : `${SITE}/images/og-faz-morar.jpg`,
    conteudo,
    pedacos,
  });
}

// ---------- ficha ----------

function paginaFicha(i, pedacos) {
  const vendido = i.status === 'vendido';
  const urlAbs = SITE + i.url;
  const msg = vendido
    ? `Olá! Vi o imóvel "${i.titulo}" (já vendido) e quero algo parecido: ${urlAbs}`
    : `Olá! Tenho interesse no imóvel "${i.titulo}": ${urlAbs}`;
  const wa = `https://wa.me/${i.whatsapp}?text=${encodeURIComponent(msg)}`;
  const rotulo = i.preco_rotulo || (i.tipo === 'leilao' ? 'Lance inicial' : 'Valor');

  const fatos = [
    i.area && [`${String(i.area).replace('.', ',')} m²`, 'Área'],
    i.quartos && [i.quartos, Number(i.quartos) === 1 ? 'Quarto' : 'Quartos'],
    i.banheiros && [i.banheiros, Number(i.banheiros) === 1 ? 'Banheiro' : 'Banheiros'],
    i.vagas && [i.vagas, Number(i.vagas) === 1 ? 'Vaga' : 'Vagas'],
  ].filter(Boolean);

  const galeria = i.fotos.length ? `
      <div class="im-galeria" data-galeria>
        <div class="im-galeria__trilho" data-trilho tabindex="0" aria-label="Fotos do imóvel">
${i.fotos.map((f, n) => `          <figure class="im-galeria__slide">
            <img src="${img(f, 1200)}" srcset="${srcset(f, [640, 960, 1200, 1600])}" sizes="(max-width: 1024px) 100vw, 780px" alt="${esc(i.titulo)}, foto ${n + 1}" width="1200" height="800"${n ? ' loading="lazy"' : ' fetchpriority="high"'} decoding="async">
          </figure>`).join('\n')}
        </div>
        ${i.fotos.length > 1 ? `<button type="button" class="im-galeria__seta im-galeria__seta--ant" data-ant aria-label="Foto anterior">‹</button>
        <button type="button" class="im-galeria__seta im-galeria__seta--prox" data-prox aria-label="Próxima foto">›</button>
        <span class="im-galeria__conta" data-conta aria-live="polite">1 / ${i.fotos.length}</span>` : ''}
        ${vendido ? '<span class="listing__tag listing__tag--vendido">Vendido</span>' : (i.desconto ? `<span class="listing__tag">−${Math.round(i.desconto)}%</span>` : '')}
      </div>
      ${i.fotos.length > 1 ? `<div class="im-miniaturas" role="group" aria-label="Escolher foto">
${i.fotos.map((f, n) => `        <button type="button" class="im-miniatura${n ? '' : ' is-on'}" data-ir="${n}" aria-label="Foto ${n + 1}"><img src="${img(f, 160, '&h=110&fit=cover')}" alt="" width="160" height="110" loading="lazy" decoding="async"></button>`).join('\n')}
      </div>` : ''}` : `
      <div class="im-galeria im-galeria--vazia"><div class="listing__media-bg listing__media-bg--1" aria-hidden="true"></div></div>`;

  const vid = youtubeId(i.video);
  const video = vid ? `
        <div class="im-bloco">
          <h2 class="im-bloco__title">Vídeo</h2>
          <div class="im-video"><iframe src="https://www.youtube-nocookie.com/embed/${vid}" title="Vídeo do imóvel ${esc(i.titulo)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
        </div>` : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: i.titulo,
    url: urlAbs,
    description: String(i.descricao || '').slice(0, 500),
    image: i.fotos.map((f) => SITE + f),
    ...(i.preco && !vendido ? { offers: { '@type': 'Offer', price: i.preco, priceCurrency: 'BRL', availability: 'https://schema.org/InStock' } } : {}),
    address: { '@type': 'PostalAddress', addressLocality: i.cidade || undefined, addressRegion: i.uf || undefined, addressCountry: 'BR' },
  };

  const conteudo = `
    <article class="im-ficha">
      <nav class="im-voltar" aria-label="Voltar"><a href="/imoveis/">← Todos os imóveis</a></nav>
${galeria}

      <div class="im-ficha__grid">
        <div class="im-ficha__main">
          <div class="listing__city">${esc([i.bairro, i.cidade, i.uf].filter(Boolean).join(' · ').toUpperCase())}</div>
          <h1 class="im-ficha__title">${esc(i.titulo)}</h1>
          ${fatos.length ? `<ul class="im-fatos">
${fatos.map(([v, l]) => `            <li><strong>${esc(v)}</strong><span>${esc(l)}</span></li>`).join('\n')}
          </ul>` : ''}
          ${i.descricao ? `<div class="im-bloco">
            <h2 class="im-bloco__title">Sobre o imóvel</h2>
            <div class="im-texto">
${textoParaHtml(i.descricao)}
            </div>
          </div>` : ''}${video}
        </div>

        <aside class="im-ficha__side">
          <div class="im-preco">
            ${vendido ? `<div class="im-preco__label">Situação</div>
            <div class="im-preco__valor">Vendido</div>
            <p class="im-preco__nota">Esse já foi, mas chegam oportunidades parecidas toda semana.</p>
            <a href="${esc(wa)}" class="btn btn--primary im-preco__btn" data-contato>Quero algo parecido</a>` : `<div class="im-preco__label">${esc(rotulo)}</div>
            <div class="im-preco__valor">${i.preco ? brl(i.preco) : 'Sob consulta'}</div>
            ${i.selo ? `<div class="im-preco__selo">${esc(i.selo)}</div>` : ''}
            <a href="${esc(wa)}" class="btn btn--primary im-preco__btn" data-contato>Tenho interesse</a>
            <p class="im-preco__nota">Atendimento pelo WhatsApp com a equipe da Faz Morar. Cuidamos da documentação do começo ao fim.</p>`}
          </div>
        </aside>
      </div>
    </article>

    <div class="im-barra" aria-hidden="false">
      <div>
        <div class="im-barra__label">${vendido ? 'Vendido' : esc(rotulo)}</div>
        <div class="im-barra__valor">${vendido ? 'Veja parecidos' : (i.preco ? brl(i.preco) : 'Sob consulta')}</div>
      </div>
      <a href="${esc(wa)}" class="btn btn--primary" data-contato>${vendido ? 'Chamar' : 'Tenho interesse'}</a>
    </div>
`;

  const partesDesc = [
    i.tipo === 'leilao' ? 'Oportunidade de leilão' : 'Imóvel à venda',
    [i.bairro, i.cidade].filter(Boolean).join(', '),
    i.preco && !vendido ? `${rotulo.toLowerCase()} ${brl(i.preco)}` : '',
  ].filter(Boolean).join(' · ');

  return pagina({
    titulo: `${i.titulo}${i.bairro ? ' · ' + i.bairro : ''} | Faz Morar`,
    descricao: `${partesDesc}. ${String(i.descricao || '').replace(/\s+/g, ' ').slice(0, 110)}`.trim(),
    url: i.url,
    ogImage: i.fotos[0] ? SITE + img(i.fotos[0], 1200, '&h=630&fit=cover').replace('fm=webp', 'fm=jpg') : `${SITE}/images/og-faz-morar.jpg`,
    extraHead: `  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>\n`,
    conteudo,
    pedacos,
  });
}

// ---------- home ----------

function blocoHome(imoveis) {
  const publicados = imoveis.filter((i) => i.status === 'publicado');
  // destaques primeiro; se forem menos de 3, completa com os outros publicados
  const escolhidos = [
    ...publicados.filter((i) => i.destaque),
    ...publicados.filter((i) => !i.destaque),
  ].slice(0, MAX_DESTAQUES);
  if (!escolhidos.length) return '';
  return `
    <section class="listings">
      <div class="listings__head" data-aos="fade-up">
        <div>
          <h2 class="listings__title">Oportunidades abertas agora</h2>
        </div>
        <a href="/imoveis/" class="btn btn--ghost btn--sm">Ver todos os imóveis</a>
      </div>
      <div class="listings__grid">
${escolhidos.map((i, n) => card(i, n)).join('\n')}
      </div>
    </section>
    `;
}

function atualizarHome(imoveis) {
  const arq = path.join(RAIZ, 'home', 'index.html');
  const html = fs.readFileSync(arq, 'utf8');
  const re = /(<!-- IMOVEIS:INICIO[^>]*-->)[\s\S]*?(<!-- IMOVEIS:FIM -->)/;
  if (!re.test(html)) throw new Error('[imoveis] marcadores IMOVEIS:INICIO/FIM não encontrados em home/index.html');
  const novo = html.replace(re, (_, a, b) => `${a}${blocoHome(imoveis)}${b}`);
  if (novo !== html) fs.writeFileSync(arq, novo);
}

// ---------- execução ----------

function limparGerados() {
  fs.mkdirSync(DIR_IMOVEIS, { recursive: true });
  for (const ent of fs.readdirSync(DIR_IMOVEIS, { withFileTypes: true })) {
    if (ent.isDirectory() && !PASTAS_FIXAS.has(ent.name)) {
      fs.rmSync(path.join(DIR_IMOVEIS, ent.name), { recursive: true, force: true });
    }
  }
}

const imoveis = carregarImoveis();
const pedacos = pedacosDoSite();
limparGerados();
fs.writeFileSync(path.join(DIR_IMOVEIS, 'index.html'), paginaVitrine(imoveis, pedacos));
for (const i of imoveis) {
  fs.mkdirSync(path.join(DIR_IMOVEIS, i.slug), { recursive: true });
  fs.writeFileSync(path.join(DIR_IMOVEIS, i.slug, 'index.html'), paginaFicha(i, pedacos));
}
atualizarHome(imoveis);
console.log(`[imoveis] ${imoveis.length} imóvel(is) no ar: ${imoveis.map((i) => i.slug).join(', ') || 'nenhum'}`);
