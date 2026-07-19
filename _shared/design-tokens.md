# Design Tokens - Ecossistema Faz Morar

Fonte da identidade: `design-kit/project/Ecossistema/Home.dc.html` e `ServicoLayout.dc.html` (handoff Claude Design, aprovado pelo cliente). Todas as páginas do ecossistema usam estes tokens.

## Cores — marca-mãe Faz Morar

Charcoal da logo com destaque em dourado champanhe. Definidos em
`/_shared/base.css` e duplicados em `/home/style.css` (a home não carrega o
base.css — os dois blocos precisam ser mantidos em sincronia).

| Token | Valor | Uso |
|---|---|---|
| --accent | #B08D57 | Filetes, selos, detalhes gráficos. **Não usar em texto pequeno** (3,09:1 sobre branco) |
| --accent-deep | #8A6B3E | Eyebrows e qualquer texto dourado abaixo de 18px (4,94:1, passa AA) |
| --accent-soft | #D4B98A | Acentos sobre fundo escuro (7,17:1 sobre charcoal) |
| --accent-lift / --accent-sink | #C9A874 / #96763F | Topo e base de gradientes dourados |
| --accent-rgb e derivados | 176,141,87 | Compor `rgba(var(--accent-rgb), .25)` em bordas e sombras |
| --mint | #F3EDE3 | Fundos de badge e cards claros (era o verde-menta) |
| --ink | #2E2E30 | Texto principal e fundos escuros |
| --ink-lift / --ink-panel | #3A3A3C / #414144 | Topo de gradientes escuros (o `--ink-lift` é a cor exata da logo) |
| --ink-72/60/50/45 | alphas .75/.64/.52/.47 | Texto secundário. Alphas recalibrados: o charcoal novo é mais claro que o antigo, e os alphas originais teriam baixado o contraste |
| --line | rgba(46,46,48,.12) | Bordas e divisores |
| --paper | #FFFFFF | Fundo padrão |
| --mist | #F6F3EE | Fundos alternados — cinza quente, para casar com o dourado |
| --cta-* | charcoal + filete dourado | CTA primário. Fundo dourado com texto branco daria 4,38:1 e reprovaria |
| --mono-bg / --mono-fg | #2E2E30 / #FFF | Quadrado e glifo do monograma |

## Cores — sub-marca Leilão & Prosa

O verde deixou de ser a cor do ecossistema e passou a identificar só a vertical
de leilões: evento, comunidade, livro e o clube de assinatura.

Aplicado pela classe **`.brand-lp`**, nunca por um `:root` próprio — a home
mistura as duas marcas no mesmo documento (a seção `.club` e o card do hero são
da sub-marca), e custom properties herdam pela árvore do DOM. Não aplicar em
`<html>`: teria a mesma especificidade de `:root` e o vencedor passaria a
depender da ordem no arquivo.

| Token | Valor |
|---|---|
| --accent / --accent-deep / --accent-soft | #16A88E / #0E7A67 / #2FB8A0 |
| --mint | #E7F4F0 |
| --ink | #23282A |

Os valores são os originais do site, para que `/evento/`, `/comunidade/` e
`/livro/` fiquem pixel-idênticas ao que o cliente aprovou.

## Monograma

Quadrado sólido (sem cantos arredondados) com o glifo em branco vazado.
Geometria em `/favicon.svg`, que é a fonte única — os SVGs inline derivam dela.
Dois nós (`.mono__bg` e `.mono__fg`) para que quadrado e glifo sejam recoloridos
separadamente. A marca d'água usa `.mono--mark`, que esconde o quadrado e deixa
só o glifo.

## Tipografia

- Títulos: DM Serif Display, weight 400 (itálico para destaques dentro do H1)
- Texto/UI: Figtree — 400 (texto), 600 (links, botões secundários), 700 (botões primários, títulos de card)
- H1 hero: 68px desktop (clamp até ~40px mobile), line-height 1.02, letter-spacing -.015em
- H2 seção: 42-46px, line-height 1.05
- Eyebrow: 13px, weight 600, letter-spacing .24em, uppercase, cor --accent-deep (ou --accent-soft no escuro)
- Corpo: 15-18px, line-height 1.55-1.6

## Raios e espaçamento

- Botões: 9-11px · Cards: 16px · Painéis grandes/bandas: 20-22px · Pills: 999px
- Container: max-width 1280px (home) / 1240px (internas), padding lateral 40px (24px mobile)
- Respiro vertical de seção: 80-84px

## Componentes recorrentes

- Nav sticky: fundo rgba(255,255,255,.88) + backdrop-blur 12px + borda inferior --line
- Monograma: quadrado --ink raio 14, traço do símbolo em --accent (SVG inline)
- Grid de cards com moldura: gap 1px sobre fundo --line, borda externa --line, raio 16px
- Card de fato/painel escuro: fundo --ink, raio 20px, marca d'água do monograma a ~12-16% de opacidade
- Card glass (sobre escuro): rgba(255,255,255,.07) + blur 8px + borda rgba(47,184,160,.4)

## Movimento

- Hero: SEM animação de entrada (regra do framework). Ambient float sutil no card glass pós-carregamento.
- Scroll: AOS fade-up somente fora do hero, com disableMutationObserver: true.
- Hover: lift de 4-6px + sombra suave em cards clicáveis; transições 200-300ms cubic-bezier(.2,.6,.2,1).
