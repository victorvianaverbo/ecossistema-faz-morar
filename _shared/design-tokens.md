# Design Tokens - Ecossistema Clube do Leilão

Fonte da identidade: `design-kit/project/Ecossistema/Home.dc.html` e `ServicoLayout.dc.html` (handoff Claude Design, aprovado pelo cliente). Todas as páginas do ecossistema usam estes tokens.

## Cores

| Token | Valor | Uso |
|---|---|---|
| --accent | #16A88E | CTAs primários, selos, monograma, detalhes |
| --accent-deep | #0E7A67 | Eyebrows, números de destaque, hover de CTA, textos de apoio verdes |
| --accent-soft | #2FB8A0 | Acentos sobre fundo escuro (eyebrows, números de passo) |
| --mint | #E7F4F0 | Fundos de badge, cards claros de CTA |
| --ink | #23282A | Texto principal, fundos escuros (nav dark, painéis, seções) |
| --ink-60 | rgba(35,40,42,.62) | Texto secundário |
| --ink-45 | rgba(35,40,42,.45) | Breadcrumb, legendas |
| --line | rgba(31,36,37,.1) | Bordas e divisores |
| --paper | #FFFFFF | Fundo padrão |
| --mist | #F5F6F6 | Fundos alternados (faixa de confiança, footer, seção incluído) |

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
