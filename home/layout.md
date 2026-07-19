# Layout - Home (Ecossistema Faz Morar)

Especificação de diretor de arte para construção da página completa em `/desenvolver`.

**Regra mestra deste projeto:** fidelidade ao design aprovado no kit (`design-kit/project/Ecossistema/Home.dc.html`) e à linguagem já implementada no Hero + Pilares (`home/index.html` + `home/style.css`). Os elementos encantadores adicionados aqui refinam, nunca substituem, o design aprovado.

**Tokens (fonte única: `/_shared/design-tokens.md`):**
- `--accent #16A88E` · `--accent-deep #0E7A67` · `--accent-soft #2FB8A0` · `--mint #E7F4F0`
- `--ink #23282A` · `--ink-72 rgba(35,40,42,.72)` · `--ink-60 rgba(35,40,42,.62)` · `--ink-50 rgba(35,40,42,.5)`
- `--line rgba(31,36,37,.1)` · `--paper #FFFFFF` · `--mist #F5F6F6`
- Fontes: DM Serif Display 400 (+itálico) para títulos · Figtree 400/600/700 para o resto
- Easing padrão: `cubic-bezier(.2,.6,.2,1)` (var `--ease`)
- Container: max-width 1280px, padding lateral 40px (24px ≤640px)
- Breakpoints: 1024px e 640px
- AOS: `fade-up`, duration 650ms, ease-out-cubic, once: true, disableMutationObserver: true — NUNCA no hero

**Ordem das seções:**
1. Nav (sticky, já construída)
2. Hero (já construído)
3. Faixa de confiança (já construída)
4. Pilares (já construído)
5. Como funciona (nova)
6. Imóveis em destaque (nova)
7. Teaser Cursos + Marketplace (nova)
8. Banda do evento (nova)
9. Footer (novo)

As seções 1-4 permanecem EXATAMENTE como estão em `home/index.html`/`style.css`. Este documento especifica as seções 5-9 e um refinamento pontual nas existentes (ver Seção 10).

---

## Seção 5: Como funciona (Do leilão à chave na mão)

### Arquetipo e Constraints
- Arquetipo: Rhythmic (Baseado em Movimento) — 4 passos com cadência visual idêntica, lidos como uma linha do tempo horizontal
- Constraints: Color Blocking invertido (Cor — bloco full-width `--ink` quebrando a página clara), Stagger animation (Movimento — passos revelam em sequência), Draw SVG / linha que cresce (Movimento — border-top dos passos anima de 0 a 100%)
- Justificativa: o conteúdo é um método em 4 etapas; o ritmo repetido + stagger comunica progressão. O bloco escuro é o momento de maior autoridade da página — mesma lógica do painel escuro do hero, criando alternância clara/escura elegante.

### Conteúdo (exato da copy)
- Eyebrow: `DO LEILÃO À CHAVE NA MÃO`
- Título: `Um caminho claro, do primeiro lance à escritura.`
- Passo 01 — `Aprenda e escolha` — `Curso, mentoria e a calculadora para achar a oportunidade certa.`
- Passo 02 — `Arremate com segurança` — `Análise jurídica e mapa real do imóvel antes de dar o lance.`
- Passo 03 — `Financie e regularize` — `Crédito na Caixa, despachante e toda a documentação resolvida.`
- Passo 04 — `Receba a chave` — `Posse, escritura e o imóvel pronto para morar ou investir.`

### Layout
- Wrapper full-width: `background: var(--ink); color: #FFFFFF;`
- Container interno: max-width 1280px, `padding: 84px 40px`
- Eyebrow no topo; título abaixo com `margin: 12px 0 48px; max-width: 620px;`
- Grid dos passos: `display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;`
- Cada passo: `border-top: 2px solid var(--accent-soft); padding-top: 22px;` sem fundo, sem card — apenas a linha e o texto (fiel ao kit)

### Tipografia
- Eyebrow: Figtree 600, 13px, letter-spacing .24em, cor `--accent-soft`
- Título: DM Serif Display 400, `clamp(32px, 3.6vw, 46px)`, line-height 1.05, branco
- "Passo 0N": DM Serif Display 400, 22px, cor `--accent-soft`
- Título do passo: Figtree 700, 18px, branco, margin-top 12px
- Descrição: Figtree 400, 14px, line-height 1.55, `rgba(255,255,255,.6)`, margin-top 8px

### Cores
- Fundo `#23282A` · linha dos passos `#2FB8A0` · textos conforme tipografia acima
- Nenhum hover de cor nos passos (não são links)

### Elementos Visuais
- Marca d'água do monograma no canto inferior direito do bloco: SVG path `M28 75 V27 H73 V72 H45 V45 H61`, stroke `#16A88E` width 6, 280x280px, `position: absolute; right: -60px; bottom: -60px; opacity: .07; pointer-events: none;` (wrapper com `position: relative; overflow: hidden;`)

### Animações
- Bloco (eyebrow + título): `data-aos="fade-up"`
- Passos: stagger — cada passo com `data-aos="fade-up"` e `data-aos-delay` de 0 / 100 / 200 / 300ms respectivamente
- Linha superior dos passos: animação de crescimento — implementar o border-top como `::before` (`height: 2px; background: var(--accent-soft); width: 100%; transform: scaleX(0); transform-origin: left;`), com classe `.is-visible` via IntersectionObserver (threshold .3) aplicando `transform: scaleX(1); transition: transform 900ms var(--ease)` com delay igual ao do stagger do passo. Com `prefers-reduced-motion`, linha estática.

### Interatividade
- Nenhum link nesta seção. Seleção de texto permitida. Cursor padrão.

### Responsividade
- ≤1024px: grid `repeat(2, 1fr)`, gap 28px
- ≤640px: grid `1fr`, padding do container `64px 24px`; delays do stagger reduzidos para 0/60/120/180ms

---

## Seção 6: Imóveis em destaque

### Arquetipo e Constraints
- Arquetipo: Lookbook (Baseado em Mídia) — cards de catálogo imobiliário com foto dominante e dados essenciais
- Constraints: Hover Lift + zoom interno da imagem (Interação), Color Blocking nos selos de desconto (Cor), Shadow Depth progressivo (Camadas)
- Justificativa: imóveis são produto visual; o formato catálogo com selo de desconto verde é a prova tangível da promessa "pagando menos". Difere dos Pilares (grid com moldura 1px) por usar cards soltos com gap 24px e mídia.

### Conteúdo (exato da copy)
- Eyebrow: `EM DESTAQUE`
- Título: `Oportunidades abertas agora`
- CTA auxiliar: `Ver marketplace completo` → `/servicos/`
- Cards [PLACEHOLDER — dados de exemplo do design; substituir por imóveis reais antes de publicar]:
  1. `BELO HORIZONTE · MG` · `Apartamento 2 quartos · Buritis` · `Lance inicial` `R$ 198.000` · selo `−48%` · status `1ª praça`
  2. `CONTAGEM · MG` · `Casa 3 quartos · Eldorado` · `Lance inicial` `R$ 305.000` · selo `−35%` · status `Aberto`
  3. `NOVA LIMA · MG` · `Cobertura · Vila da Serra` · `Lance inicial` `R$ 690.000` · selo `−52%` · status `2ª praça`

### Layout
- Container: max-width 1280px, `padding: 84px 40px 64px`
- Header da seção: flex `align-items: flex-end; justify-content: space-between; margin-bottom: 32px;` — eyebrow+título à esquerda, botão ghost à direita
- Grid: `grid-template-columns: repeat(3, 1fr); gap: 24px;`
- Card (elemento `<a>`): `background: var(--paper); border: 1px solid rgba(31,36,37,.12); border-radius: 16px; overflow: hidden;`
- Área de mídia: `position: relative; height: 190px;` — enquanto não houver fotos reais, gradiente `linear-gradient(140deg, #3A4042, #23282A)` (card 1), `linear-gradient(140deg, #454B4D, #23282A)` (card 2), `linear-gradient(140deg, #2E3436, #23282A)` (card 3), com legenda `FOTO` (11px, letter-spacing .2em, `rgba(255,255,255,.5)`, absolute bottom 14px right 16px). Quando houver fotos: `<img>` via CDN `/.netlify/images?url=/images/NOME.jpg&w=800&q=80`, width/height numéricos, `loading="lazy"`, `object-fit: cover`
- Selo de desconto: absolute top 16px left 16px, `background: var(--accent); color: #FFF; font-weight: 700; font-size: 13px; padding: 7px 12px; border-radius: 7px;`
- Corpo do card: `padding: 22px;` — cidade (13px `--ink-50` → na verdade rgba(35,40,42,.55)), nome (Figtree 700 18px, margin-top 6px), rodapé flex `justify-content: space-between; align-items: flex-end; margin-top: 20px;` com label `Lance inicial` (12px, rgba(35,40,42,.5)) sobre o preço (DM Serif Display 28px `--ink`) à esquerda e status (Figtree 600 13px `--accent-deep`) à direita

### Tipografia
- Eyebrow: Figtree 600 13px .24em `--accent-deep`
- Título: DM Serif Display 400, `clamp(30px, 3.3vw, 42px)`, `--ink`
- Botão ghost: Figtree 600 14px, `padding: 12px 22px; border: 1px solid rgba(35,40,42,.2); border-radius: 9px;`

### Cores
- Selo: `#16A88E` fundo, branco texto (estado único)
- Status: `#0E7A67`
- Hover do botão ghost: `border-color: var(--ink)` + `transform: translateY(-2px)` (mesmo padrão `.btn--ghost` do hero)

### Elementos Visuais
- Gradientes escuros nas mídias placeholder (acima); nenhum outro decorativo — os cards são o visual

### Animações
- Header: `data-aos="fade-up"`
- Cards: `data-aos="fade-up"` com delays 0/100/200ms
- Zoom da mídia no hover: a área de mídia contém um filho `.card-media__bg` com o gradiente/foto; no hover do card, `transform: scale(1.05)`, `transition: transform 700ms var(--ease)` (com `overflow: hidden` na área)

### Interatividade
- Card inteiro clicável (`<a href>`; destino provisório `/servicos/` até haver páginas de imóvel)
- Hover do card: `transform: translateY(-6px); box-shadow: 0 20px 40px rgba(31,36,37,.12); transition: 300ms var(--ease)` + zoom da mídia + selo ganha `box-shadow: 0 6px 14px rgba(22,168,142,.35)`
- Focus-visible: `outline: 2px solid var(--accent); outline-offset: 3px;` (aplicar globalmente a links/botões)

### Responsividade
- ≤1024px: grid `1fr 1fr` (3º card ocupa `grid-column: span 2`? NÃO — mantém fluxo normal, vira 2+1)
- ≤640px: grid `1fr`; header empilha (`flex-wrap: wrap; gap: 16px`); botão ghost vira full-width (`width: 100%; text-align: center;`)

---

## Seção 7: Teaser Cursos + Marketplace

### Arquetipo e Constraints
- Arquetipo: Split Vertical 50/50 (Baseado em Divisão) — dois painéis irmãos com pesos visuais opostos
- Constraints: Color Blocking (Cor — painel claro `--mist` vs painel verde profundo `--accent-deep`), Hover Lift nos CTAs (Interação), Noise/marca d'água sutil no painel verde (Efeitos Especiais)
- Justificativa: são as duas ofertas de conversão direta (curso e imóvel particular); a divisão em blocos de cor iguais em tamanho e opostos em tom dá a cada oferta identidade própria sem quebrar o sistema.

### Conteúdo (exato da copy)
Card 1 (claro):
- Eyebrow: `CURSOS & MENTORIAS`
- Título: `Aprenda a arrematar do zero — e acesse na hora.`
- Texto: `Pagou, acesso liberado automaticamente na área de membros. Sem espera, sem trabalho manual.`
- CTA: `Ver trilhas de curso` → `/cursos/`

Card 2 (verde escuro):
- Eyebrow: `MARKETPLACE`
- Título: `Imóveis particulares, sem corretor.`
- Texto: `Compre direto, com consultoria da Faz Morar e toda a parte documental cuidada por nós.`
- CTA: `Explorar imóveis` → `/consultoria-sem-corretor/`

### Layout
- Container: max-width 1280px, `padding: 24px 40px 84px`
- Grid: `grid-template-columns: 1fr 1fr; gap: 24px;`
- Card 1: `background: var(--mist); border: 1px solid var(--line); border-radius: 20px; padding: 44px;`
- Card 2: `background: var(--accent-deep); color: #FFFFFF; border-radius: 20px; padding: 44px; position: relative; overflow: hidden;`

### Tipografia
- Eyebrows: Figtree 600 13px .2em — card 1 em `--accent-deep`, card 2 em `rgba(255,255,255,.7)`
- Títulos: DM Serif Display 400 32px, line-height 1.1, margin `14px 0 0` — card 1 `--ink`, card 2 branco
- Textos: Figtree 400 15px, line-height 1.6, margin `14px 0 24px` — card 1 `--ink-60`, card 2 `rgba(255,255,255,.8)`
- CTA card 1: Figtree 600 15px, `background: var(--ink); color: #FFF; padding: 14px 26px; border-radius: 9px; display: inline-block;`
- CTA card 2: Figtree 700 15px, `background: #FFF; color: var(--accent-deep); padding: 14px 26px; border-radius: 9px; display: inline-block;`

### Cores
- Hover CTA card 1: `background: var(--accent-deep); transform: translateY(-2px); box-shadow: 0 10px 24px rgba(14,122,103,.25)`
- Hover CTA card 2: `background: var(--mint); transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,.18)`
- Transições 250ms var(--ease)

### Elementos Visuais
- Card 2: monograma marca d'água — SVG path padrão, stroke `rgba(255,255,255,.35)` width 5, 180x180px, `position: absolute; right: -36px; bottom: -36px; opacity: .18; pointer-events: none;`

### Animações
- Card 1: `data-aos="fade-up"` delay 0
- Card 2: `data-aos="fade-up"` delay 100ms

### Interatividade
- Apenas os CTAs são clicáveis (cards não são links — evita competição com o CTA interno)

### Responsividade
- ≤1024px: mantém 2 colunas se couber; ≤840px: `grid-template-columns: 1fr`
- ≤640px: padding dos cards `32px 24px`; container `24px 24px 64px`

---

## Seção 8: Banda do evento (Leilão & Prosa)

### Arquetipo e Constraints
- Arquetipo: Isolated Element (Baseado em Foco) — uma única banda escura flutuando entre seções claras, todo o foco no CTA
- Constraints: Glow pulsante no CTA (Efeitos Especiais — eco do badge do hero), Framed Content (Layout — raio 22px isola a banda como objeto), Ambient Motion na marca d'água (Movimento)
- Justificativa: é o convite final antes do footer e o destino do bônus da proposta; o isolamento visual + glow no botão fazem dela o "último gesto" da página sem precisar gritar.

### Conteúdo (exato da copy; data em placeholder)
- Eyebrow: `AO VIVO · BÔNUS DO ECOSSISTEMA`
- Título: `Leilão & Prosa — EM BREVE, Belo Horizonte` (TODO: substituir por `[DATA_EVENTO], [CIDADE_EVENTO]` reais)
- Texto: `Um encontro presencial e estratégico para arrematar sem cair em pegadinhas. Vagas limitadas.`
- CTA: `Garantir cadeira →` → `/evento/`

### Layout
- Container: max-width 1280px, `padding: 0 40px 84px`
- Banda: `border-radius: 22px; padding: 56px 52px; background: var(--ink); color: #FFF; display: flex; justify-content: space-between; align-items: center; gap: 40px; flex-wrap: wrap; position: relative; overflow: hidden;`
- Texto à esquerda (max-width 560px no parágrafo), CTA à direita (`white-space: nowrap`)

### Tipografia
- Eyebrow: Figtree 600 13px .22em `--accent-soft`
- Título: DM Serif Display 400 `clamp(30px, 3.4vw, 44px)`, line-height 1.05, margin-top 12px, branco
- Texto: Figtree 400 16px, `rgba(255,255,255,.7)`, margin-top 10px
- CTA: Figtree 700 16px, `background: var(--accent); color: #FFF; padding: 18px 34px; border-radius: 11px;`

### Cores
- Hover CTA: `background: var(--accent-soft); transform: translateY(-2px); box-shadow: 0 0 0 6px rgba(22,168,142,.15), 0 12px 28px rgba(22,168,142,.35)`
- Glow idle no CTA: `box-shadow: 0 0 24px rgba(22,168,142,.25)` com `animation: ctaGlow 3.2s ease-in-out infinite` alternando para `.45` de alpha — desligado em `prefers-reduced-motion`

### Elementos Visuais
- Marca d'água do monograma: stroke `#16A88E` width 6, 220x220px, `position: absolute; left: -50px; top: -50px; opacity: .08;` com `animation: float 8s ease-in-out infinite` (reutilizar keyframe `float` do hero, amplitude -8px)

### Animações
- Banda inteira: `data-aos="fade-up"`

### Interatividade
- Apenas o CTA clicável; focus-visible padrão

### Responsividade
- ≤840px: banda empilha (flex-wrap), CTA full-width `text-align: center`
- ≤640px: padding da banda `40px 28px`; container `0 24px 64px`; título 30px

---

## Seção 9: Footer

### Arquetipo e Constraints
- Arquetipo: Balanced (Baseado em Densidade) — bloco institucional calmo, 4 colunas asimétricas (marca larga + 3 listas)
- Constraints: Linha decorativa animada nos links (Tipografia/Movimento — underline scaleX, mesmo padrão do nav), Sparse spacing (Densidade)
- Justificativa: fechamento sóbrio e premium; repete o vocabulário do nav (underline animado) criando moldura consistente no topo e na base da página.

### Conteúdo (exato da copy global — `/_shared/copy-global.md`)
- Coluna marca: logo monograma 30px + `Leilão & Prosa` (DM Serif 18px) + texto `O ecossistema que leva você do leilão à chave na mão, com segurança jurídica.`
- Coluna `Plataforma`: `Leilões` → `/leilao-e-prosa/` · `Cursos` → `/cursos/` · `Financiamento` → `/financiamento/` · `Imóveis` → `/servicos/`
- Coluna `Serviços`: `Despachante` → `/despachante/` · `Consórcio` → `/consorcio/` · `Seguros` → `/seguros/` · `Conta Caixa` → `/conta-caixa/`
- Coluna `Contato`: `WhatsApp (31) 99695-1660` → `https://wa.me/5531996951660` · `Área de membros` → `https://wa.me/5531996951660` (TODO: [URL_MEMBERKIT_AREA]) · `Belo Horizonte · MG` (texto)
- Base: `© 2026 Faz Morar Imóveis · Todos os direitos reservados.`

### Layout
- Wrapper: `border-top: 1px solid var(--line); background: var(--mist);`
- Container superior: max-width 1280px, `padding: 56px 40px 40px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 40px;`
- Coluna marca: `max-width: 320px;` — logo+nome em flex gap 11px; parágrafo 14px `rgba(35,40,42,.55)` line-height 1.6 margin-top 16px
- Grupo de listas: `display: flex; gap: 64px; flex-wrap: wrap;` — cada lista: título Figtree 700 14px `--ink` margin-bottom 14px; links Figtree 400 14px `--ink-60` line-height 2.1
- Base: container `padding: 18px 40px 40px; border-top: 1px solid rgba(31,36,37,.08); font-size: 12px; color: rgba(35,40,42,.45);`

### Tipografia / Cores
- Conforme acima; hover dos links: cor `--accent-deep` + underline scaleX (mesmo `::after` do nav, 1px, `--accent`)

### Elementos Visuais
- Nenhum decorativo além do logo — o footer é respiro

### Animações
- Sem AOS no footer (chega junto do fim da página; animar atrapalha)

### Interatividade
- Links com hover/focus-visible padrão

### Responsividade
- ≤640px: padding `48px 24px 32px`; colunas empilham naturalmente (flex-wrap); gap do grupo de listas 40px

---

## Seção 10: Refinamentos nas seções já construídas (não reconstruir)

1. **Pilares — stagger:** adicionar `data-aos-delay` progressivo aos 6 cards (0/60/120/180/240/300ms). Hoje o grid inteiro anima junto; o stagger dá o ritmo premium. Implementar movendo o `data-aos` do wrapper para cada `.pillar`.
2. **Âncora:** o CTA ghost do hero já aponta para `#ecossistema` — manter.
3. **Smooth scroll:** já ativo (`scroll-behavior: smooth`) — manter.
4. Nenhuma outra alteração nas seções 1-4.

---

## Checklist técnico para /desenvolver

- Estender `home/index.html`/`home/style.css` existentes — NÃO recriar hero/pilares
- Hero: sem animação de entrada (regra do framework); AOS apenas das seções 5+ para baixo
- AOS init já existente: manter `once: true, disableMutationObserver: true`
- IntersectionObserver próprio (leve, inline em `script.js` da pasta) para as linhas `scaleX` da Seção 5 — sem bibliotecas novas
- Imagens futuras: sempre `/.netlify/images?url=/images/...&w=...&q=80`, width/height numéricos, `loading="lazy"` (nunca no hero)
- Caminhos absolutos começando com `/`
- Sem emojis em nenhum texto
- `prefers-reduced-motion`: desligar float, pulse, glow e transições de transform
- Focus-visible global: `outline: 2px solid var(--accent); outline-offset: 3px`
- Validar responsivo em 1280 / 1024 / 840 / 640 / 375px
