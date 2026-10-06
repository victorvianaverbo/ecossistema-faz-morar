// Plugin de build: antes do comando de build, copia os imóveis e as fotos do
// Netlify Blobs (store "imoveis", gravado pelo painel /admin) para
// imoveis/_dados/ e imoveis/fotos/. Depois scripts/gerar-imoveis.mjs gera as
// páginas a partir desses arquivos. Só fotos usadas por algum imóvel descem.
//
// Se o Blobs falhar, o build falha de propósito: a Netlify mantém o site
// anterior no ar em vez de publicar a vitrine vazia.

import fs from 'node:fs';
import path from 'node:path';
import { getStore } from '@netlify/blobs';

export const onPreBuild = async ({ utils }) => {
  const dirDados = path.resolve('imoveis/_dados');
  const dirFotos = path.resolve('imoveis/fotos');
  fs.mkdirSync(dirDados, { recursive: true });
  fs.mkdirSync(dirFotos, { recursive: true });

  try {
    const store = getStore({ name: 'imoveis', consistency: 'strong' });
    const { blobs } = await store.list({ prefix: 'dados/' });
    const usadas = new Set();
    for (const { key } of blobs) {
      const dados = await store.get(key, { type: 'json' });
      if (!dados) continue;
      (dados.fotos || []).forEach((f) => usadas.add(path.basename(f)));
      fs.writeFileSync(path.join(dirDados, `${key.slice(6)}.json`), JSON.stringify(dados, null, 2));
    }
    for (const nome of usadas) {
      const foto = await store.get(`fotos/${nome}`, { type: 'arrayBuffer' });
      if (foto) fs.writeFileSync(path.join(dirFotos, nome), Buffer.from(foto));
      else console.warn(`[imoveis-blobs] foto sumiu do Blobs: ${nome}`);
    }
    console.log(`[imoveis-blobs] ${blobs.length} imóvel(is) e ${usadas.size} foto(s) baixados`);
  } catch (e) {
    utils.build.failBuild('[imoveis-blobs] não consegui ler o Netlify Blobs', { error: e });
  }
};
