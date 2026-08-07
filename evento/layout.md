# Layout — `/evento/` · Leilão & Prosa, edição de 25 de agosto de 2026 (v2)

Especificação de direção de arte para o `/desenvolver` construir a página inteira. Substitui a v1 que está no ar. Onde este documento e o HTML atual divergirem, **este documento vence**.

**Regra mestra da v2:** a página deixa de parecer uma LP de tráfego e passa a parecer um convite. Isso se resolve em três decisões, e não em enfeite: hero tipográfico sem foto, coluna única centralizada em toda a página (a correção obrigatória, detalhada abaixo) e os dois ingressos com o mesmo peso de botão em todos os pontos.

---

## 0. Tokens (fonte única: `/_shared/design-tokens.md`)

A página inteira roda dentro de `<body class="brand-lp">`. Todos os tokens abaixo já existem em `/_shared/base.css` sob `.brand-lp` — **não redeclarar nenhum deles em `evento/style.css`**.

| Token | Valor |
|---|---|
| `--accent` | `#16A88E` |
| `--accent-deep` | `#0E7A67` |
| `--accent-soft` | `#2FB8A0` |
| `--accent-lift` / `--accent-sink` | `#1DB79A` / `#0F9A83` |
| `--accent-rgb` / `--accent-deep-rgb` / `--accent-soft-rgb` | `22,168,142` / `14,122,103` / `47,184,160` |
| `--mint` / `--mint-line` | `#E7F4F0` / `rgba(22,168,142,.25)` |
| `--ink` / `--ink-lift` / `--ink-panel` / `--ink-rgb` | `#23282A` / `#2C3234` / `#3A4042` / `35,40,42` |
| `--ink-72` / `--ink-60` / `--ink-50` / `--ink-45` | `rgba(35,40,42,.72 / .62 / .5 / .45)` |
| `--line` | `rgba(31,36,37,.1)` |
| `--paper` / `--mist` | `#FFFFFF` / `#F5F6F6` |
| `--cta-from/mid/to` | `#1DB79A` / `#16A88E` / `#0F9A83` |
| `--cta-hover-from/to` | `#16A88E` / `#0E7A67` |
| `--serif` / `--sans` | `'DM Serif Display', serif` / `'Figtree', sans-serif` |
| `--ease` | `cubic-bezier(.2,.6,.2,1)` |

**Verde é a cor desta página.** Nenhum dourado no corpo. O dourado da marca-mãe `#B08D57` aparece em exatamente **dois lugares**, escrito como hex literal com comentário (não dá para usar `var(--accent)`, que aqui é verde):

1. `.nav__brands-sep` — o filete que separa Faz Morar de Leilão & Prosa vira `background: linear-gradient(180deg, rgba(176,141,87,0) 0%, rgba(176,141,87,.6) 50%, rgba(176,141,87,0) 100%); width: 1px; height: 28px;`
2. `.footer-c__brand`, no rodapé, ganha `border-left: 2px solid #B08D57; padding-left: 14px;` na assinatura da marca-mãe.

Só isso. É a assinatura da casa, não a paleta da página.

**Tokens novos, declarados em `evento/style.css` dentro de `.brand-lp` (escopo da página):**

```
--col:        1040px;   /* coluna mestra de TODA seção */
--col-read:    720px;   /* medida de linha para texto corrido */
--col-tight:   620px;   /* leads e subtítulos */
--col-fine:    880px;   /* letra miúda e nota metodológica */
--col-hero:    900px;   /* hero e CTA final, centrados */
--sec-y:       104px;   /* respiro vertical de seção, desktop */
--r-btn:        12px;   /* raio de botão */
--r-card:       18px;   /* raio de card */
--r-panel:      24px;   /* raio de painel/banda */
```

---

## 1. A CORREÇÃO DE LAYOUT (obrigatória, vale para a página inteira)

**O defeito medido no navegador:** `.ev-mech__head` (720px), `.ev-learn__head` (680px), `.ev-table-wrap` (860px) e `.ev-why` (860px) têm `max-width` mas **não têm `margin-inline: auto`**. Dentro de um container de 1280px com 40px de padding (1200px úteis), esses blocos encostam na borda esquerda e deixam de 340px a 640px de vazio à direita. Cada seção fica torta em relação à anterior, porque cada bloco tem uma largura diferente. Somado, o efeito é o de uma página desalinhada.

**A regra, aplicada seção por seção, sem exceção:**

1. Toda seção tem `.__inner { max-width: 1280px; margin-inline: auto; padding: var(--sec-y) 40px; }`.
2. **Dentro do inner existe UM único wrapper `.ev-col { max-width: var(--col); margin-inline: auto; }`** que envolve *todos* os blocos da seção — cabeçalho, corpo, tabela, painel e CTA. Assim os blocos compartilham a mesma borda esquerda e a mesma borda direita. Nenhum bloco filho recebe `max-width` próprio para efeito de posição.
3. **Encurtar linha de texto se faz com `max-width` + `margin-inline: 0`**, nunca `auto`, e nunca no wrapper. Um parágrafo de 720px dentro de uma coluna de 1040px começa na mesma vertical da tabela de 1040px que vem depois.
4. **`text-align: left` em tudo.** As duas únicas exceções centradas na página são o Hero (§3) e o CTA final (§14), e elas são centradas de propósito, como abertura e fecho.
5. Todo bloco que hoje tem `max-width` sem `margin-inline: auto` recebe `margin-inline: auto` **ou** passa a herdar a largura de `.ev-col`. A lista completa dos culpados: `.ev-mech__head`, `.ev-mech__block`, `.ev-learn__head`, `.ev-table-wrap`, `.ev-why`, `.ev-math__head`, `.ev-math__big`, `.ev-math__text`, `.ev-warn`, `.ev-shift__head`, `.ev-shift__note`, `.ev-offer__head`, `.ev-lots__note`, `.ev-agenda`, `.faq__list`, `.ev-cta__content`, `.bio__text`, `.ev-fine__text`.

**Conferência visual obrigatória no fim do `/desenvolver`:** em 1280px de viewport, medir a borda esquerda do H2 de cada seção. Todas têm de dar o mesmo número (120px da borda da janela: 40 de padding + 80 de folga da coluna). Se alguma der diferente, o bloco está fora da `.ev-col`.

```
.ev-col        { max-width: var(--col); margin-inline: auto; }
.ev-col--fine  { max-width: var(--col-fine); margin-inline: auto; }
.ev-read       { max-width: var(--col-read); margin-inline: 0; }   /* nunca auto */
.ev-tight      { max-width: var(--col-tight); margin-inline: 0; }
```

---

## 2. Componentes globais

### 2.1 Componente A — O par de botões (`.ev-duo`)

É a peça central da v2. O online **nunca** aparece como link de texto. Some `.linkish` de toda a página.

```
.ev-duo {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  max-width: 760px;
  margin-inline: auto;   /* centrado dentro da coluna */
  margin-top: 36px;
}

.btn-duo {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 66px;
  padding: 18px 24px;
  border-radius: var(--r-btn);
  font-family: var(--sans);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: .005em;
  border: 2px solid transparent;   /* iguala a caixa dos dois */
  cursor: pointer;
  transition: background .25s var(--ease), border-color .25s var(--ease),
              color .25s var(--ease), transform .25s var(--ease),
              box-shadow .25s var(--ease);
}
```

O `border: 2px solid transparent` no preenchido é o que garante altura idêntica ao contornado. Sem ele, os dois botões diferem 4px e o olho percebe.

**Primário (presencial), sobre claro e sobre escuro, igual:**
```
.btn-duo--fill {
  background: linear-gradient(180deg, #1DB79A 0%, #16A88E 52%, #0F9A83 100%);
  color: #FFFFFF;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.24),
              0 1px 2px rgba(11,90,76,.25),
              0 14px 28px -14px rgba(22,168,142,.6);
}
.btn-duo--fill:hover {
  background: linear-gradient(180deg, #16A88E 0%, #0E7A67 100%);
  transform: translateY(-2px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.18),
              0 2px 4px rgba(11,90,76,.22),
              0 18px 34px -14px rgba(22,168,142,.55);
}
.btn-duo--fill:active { transform: translateY(0); box-shadow: inset 0 2px 5px rgba(11,90,76,.3); }
```

**Secundário (online), sobre fundo claro:**
```
.btn-duo--out {
  background: transparent;
  border-color: #16A88E;
  color: #0E7A67;
}
.btn-duo--out:hover {
  background: rgba(22,168,142,.08);
  border-color: #0E7A67;
  color: #0E7A67;
  transform: translateY(-2px);
  box-shadow: 0 12px 26px -16px rgba(22,168,142,.55);
}
.btn-duo--out:active { transform: translateY(0); background: rgba(22,168,142,.14); }
```

**Secundário sobre fundo escuro (`.on-ink .btn-duo--out`, usado no hero e no CTA final):**
```
border-color: rgba(47,184,160,.85);
color: #FFFFFF;
hover: background rgba(47,184,160,.14); border-color #2FB8A0;
```
`#2FB8A0` sobre `#23282A` dá 6,2:1 — passa AA inclusive para texto pequeno.

**Foco:** `outline: 2px solid var(--accent); outline-offset: 3px;` no claro. Sobre `--ink`, `outline-color: #2FB8A0` para não sumir.

**Mobile (≤640px):** `grid-template-columns: 1fr;` gap 12px, presencial em cima, os dois em largura total, `min-height: 60px; font-size: 15px; padding: 16px 18px;`.

**Textos exatos, por ponto da página** (os pares foram equalizados em caracteres para quebrar igual no celular — não reescrever):

| Onde | `.btn-duo--fill` | `.btn-duo--out` |
|---|---|---|
| Hero (§3) | `Quero minha cadeira em Belo Horizonte · R$ 157` | `Quero meu acesso à transmissão ao vivo · R$ 67` |
| CTA duplo 1, fim da §6 | `Garantir minha cadeira em BH · R$ 157` | `Garantir meu acesso ao vivo · R$ 67` |
| CTA duplo 2, fim da §9 | `Garantir minha cadeira em BH · R$ 157` | `Garantir meu acesso ao vivo · R$ 67` |
| Dentro do card presencial (§12) | `Quero a cadeira em BH · R$ 157` | — |
| Dentro do card online (§12) | — | `Quero o acesso ao vivo · R$ 67` |
| CTA duplo da oferta (§12) | `Quero a cadeira em BH · R$ 157` | `Quero o acesso ao vivo · R$ 67` |
| CTA final (§14) | `Quero minha cadeira em Belo Horizonte · R$ 157` | `Quero meu acesso à transmissão ao vivo · R$ 67` |
| Barra fixa mobile | `Cadeira em BH · R$ 157` | `Ao vivo · R$ 67` |

Todos são `<button type="button" data-modal-open="modal-evento" data-modalidade="presencial|online">`. O `data-modalidade` já é lido por `evento/script.js` e viaja para a planilha — manter.

**Rotina de virada de lote (obrigatória, escrever no topo do `index.html` como comentário HTML):** em 12/08 trocar todos os `157` por `187` e todos os `67` por `87`; em 21/08 trocar para `217` e `97`. Trocar junto: a microcopy do hero, a tabela de lotes (`.ev-table__now` muda de linha), os preços dos cards e o texto "até 11 de agosto". Com preço dentro do botão e sem essa rotina, a página vende preço vencido.

### 2.2 Componente B — Barra fixa no mobile (`.ev-bar`)

Aparece a partir do fim da §6 e some quando a seção de ingressos está na tela. Contém os **dois** botões.

```
.ev-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 60;
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  background: rgba(255,255,255,.96);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid var(--line);
  box-shadow: 0 -12px 32px -20px rgba(35,40,42,.6);
  transform: translateY(120%); opacity: 0; visibility: hidden;
  transition: transform .3s var(--ease), opacity .3s var(--ease), visibility 0s linear .3s;
}
.ev-bar.is-up { transform: none; opacity: 1; visibility: visible; transition-delay: 0s; }
.ev-bar .btn-duo { min-height: 50px; padding: 12px 10px; font-size: 13.5px; border-radius: 10px; line-height: 1.2; }
```

Botões dentro dela mantêm a mesma hierarquia: preenchido à esquerda, contornado à direita.

**JS (estender `evento/script.js`, sem biblioteca):** um único handler de scroll `{ passive: true }` com throttle por `requestAnimationFrame`. Só roda se `window.matchMedia('(max-width: 860px)').matches`. Mostra quando `#cta-duplo-1` (a `.ev-duo` do fim da §6) tem `getBoundingClientRect().top < innerHeight * .5`. Esconde quando `#ingressos` **ou** `#inscricao` intersecta a viewport (`top < innerHeight && bottom > 0`) — o CTA final repete os dois botões e a barra por cima dele é redundância. Alterna a classe `.is-up` e o atributo `inert` (com fallback `aria-hidden="true"` + `tabindex="-1"` nos botões) para que os botões escondidos não sejam focáveis pelo teclado.

`@media (max-width: 860px) { body { padding-bottom: 78px; } }` para a barra não cobrir o rodapé.

**Não existe contador regressivo de tempo em lugar nenhum da página.** O único elemento temporal é a data pública do lote.

### 2.3 Componente C — Tabela que rola dentro do próprio container

Três tabelas na página (§7 a conta, §8 o que muda, §12 lotes). Todas usam a mesma casca:

```
.ev-table-wrap {
  max-width: var(--col);
  margin-inline: auto;              /* a correção */
  position: relative;
  overflow-x: auto;
  overscroll-behavior-x: contain;   /* não puxa a navegação do browser */
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--paper);
  scrollbar-width: thin;
  scrollbar-color: rgba(22,168,142,.5) transparent;
}
.ev-table-wrap::-webkit-scrollbar { height: 8px; }
.ev-table-wrap::-webkit-scrollbar-thumb { background: rgba(22,168,142,.45); border-radius: 999px; }
.ev-table { width: 100%; border-collapse: collapse; font-size: 15px; min-width: 520px; }
```

`min-width: 520px` na tabela de dinheiro e `min-width: 640px` na de 4 colunas (§12) e na comparativa (§8). É esse `min-width` que faz a rolagem acontecer **dentro** do wrapper e não na página.

**Acessibilidade e afordância, obrigatórias:**
- O wrapper recebe `tabindex="0"`, `role="region"` e `aria-label` descritivo (ex.: `aria-label="Tabela do custo total de um arremate, role para o lado"`), senão quem navega por teclado não consegue rolar.
- Sombra de borda indicando que há mais conteúdo: `.ev-table-wrap::after { content:""; position: sticky; right: 0; top: 0; display: block; width: 34px; height: 100%; background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.95)); pointer-events: none; }` — some quando `scrollLeft + clientWidth >= scrollWidth - 2`, via classe `.is-end` aplicada no listener de scroll do próprio wrapper.
- Dica visível só em ≤640px, acima da tabela: `Role a tabela para o lado`, Figtree 600 12px, `letter-spacing: .12em`, `text-transform: uppercase`, `color: var(--ink-45)`, `margin-bottom: 10px`.

**A página nunca rola na horizontal.** Se em 375px o `<body>` tiver `scrollWidth > clientWidth`, o build está errado.

### 2.4 Componente D — Caixa de aviso (`.ev-warn`)

```
max-width: var(--col); margin-inline: auto; margin-bottom: 24px;
padding: 18px 22px; border-radius: 14px;
background: var(--mint); border: 1px solid rgba(22,168,142,.4);
border-left: 4px solid var(--accent);
font-size: 14.5px; line-height: 1.65; color: var(--ink); text-align: left;
```
O `strong` de abertura em Figtree 700 `--accent-deep`, caixa alta, `letter-spacing: .04em`.

### 2.5 Componente E — Asterisco dos 42% (`.ev-ref`)

```
.ev-ref { font-size: .58em; vertical-align: super; margin-left: 2px;
          color: var(--accent); text-decoration: none; }
.ev-ref:hover { color: var(--accent-deep); text-decoration: underline; }
.on-ink .ev-ref { color: var(--accent-soft); }
```
Sempre `href="#metodologia"` e `aria-label="Ver a metodologia dos 42%"`. Aparece em: hero (§3), nota do hero, §8 (grade de números da bio) e §13 (FAQ dos 42%). Sempre que o número 42% aparecer no corpo, o asterisco vai junto.

Complemento de craft: `#metodologia:target { background: var(--mint); animation: alvo 1.4s var(--ease) 1 forwards; }`, com `@keyframes alvo { from { background: var(--mint); } to { background: transparent; } }`, desligado em `prefers-reduced-motion`. Quem clica no asterisco vê onde caiu.

### 2.6 Movimento — regras globais

- Sistema de revelação: `/_shared/reveal.css` + `reveal.js` (`data-aos="fade-up"`, `data-aos-delay` em ms). Transição de 600ms `cubic-bezier(.2,.6,.2,1)`, `translateY(22px)`, threshold 0.08, `rootMargin 0px 0px -6% 0px`, dispara uma vez.
- **O hero não tem `data-aos` em nenhum elemento.** Regra do framework, sem exceção.
- `prefers-reduced-motion: reduce` já neutraliza `[data-aos]` no `reveal.css` e zera `animation-duration`/`transition-duration` no `base.css`. Além disso, desligar explicitamente: float da marca d'água, glow pulsante do CTA final, contagem do número da §7 e o crescimento das barras de lugares da §12.

---

## 3. Seção 1 — HERO (tipográfico, centralizado, sem foto)

### Arquétipo e Constraints
- **Arquétipo:** Type Hero (Baseado em Tipografia) — a tipografia é o único protagonista; nenhuma imagem de pessoa, nenhum card, nenhum selo pulsante.
- **Constraints:** White Space Hero (Densidade — respiro vertical dobrado em relação à v1), Container Narrow (Layout — coluna de 900px centrada dentro de 1200px úteis), Noise Texture (Efeitos Especiais — grain a 3% para dar textura de papel), Mixed Fonts (Tipografia — serif no título com um trecho em itálico verde, sans em tudo mais).
- **Justificativa:** o cliente pediu convite, não anúncio. Convite se faz com respiro, filete e tipografia gravada. Tirar a foto do topo esvazia o hero de "cara de página de tráfego" e joga toda a força para a frase e para os dois botões. O grain e o glow radial estático dão profundidade sem movimento — e sem movimento é obrigação, porque o hero não anima.

### Conteúdo (exato da copy)

Selo (caixa alta, acima do título):
`Terça, 25 de agosto de 2026 · Belo Horizonte ou ao vivo`

H1:
`Dá para comprar apartamento em leilão bem abaixo do preço da rua. Dia 25 eu abro essa conta na sua frente.`

Subheadline:
`Eu montei essa noite para quem nunca deu um lance na vida. Nas compras que eu já fechei em leilão, o lance vencedor ficou 42% abaixo do valor de avaliação do imóvel, em média.*  A conta que vem depois do lance eu abro também, porque é ela que decide se o negócio prestou.`

Botões: par `.ev-duo` com os textos do hero (ver §2.1).

Microcopy sob os botões:
`Compra pela Sympla. Presencial R$ 157 à vista ou 12x de R$ [XX,XX], total de R$ [XXX,XX] com juros e taxa da plataforma. Online R$ 67 à vista ou 12x de R$ [XX,XX], total de R$ [XX,XX]. Esses preços valem até 11 de agosto. Na sala, das 19h às 22h, e a sala tem [XX] cadeiras. A transmissão ao vivo vai das 19h30 às 21h40 e não tem limite de lugares.`

**[CONFIRMAR]** — nenhum colchete sobe para a tela. Enquanto os valores de parcela não vierem, o build usa a versão sem parcelamento: `Compra pela Sympla. Presencial R$ 157, online R$ 67, preços válidos até 11 de agosto. Na sala, das 19h às 22h. A transmissão ao vivo vai das 19h30 às 21h40 e não tem limite de lugares.` Anunciar "12x" sem parcela, total e taxa contraria o art. 52 do CDC e o Decreto 5.903/2006.

Nota dos 42%, dentro do hero, abaixo de um filete (texto integral da copy, versão "visível abaixo do hero", em primeira pessoa), terminando em `Metodologia completa no rodapé desta página.` com "rodapé desta página" como link para `#metodologia`.

### Layout

```
.ev-hero { position: relative; background: var(--ink); color: #FFFFFF; overflow: hidden; }
.ev-hero__inner {
  position: relative; z-index: 1;
  max-width: 1280px; margin-inline: auto;
  padding: 104px 40px 84px;
  text-align: center;                 /* exceção declarada à regra da coluna */
}
.ev-hero__col { max-width: var(--col-hero); margin-inline: auto; }
```

Ordem vertical, com as margens exatas:
1. Filete superior: `<span aria-hidden="true">` de `width: 56px; height: 1px; background: rgba(47,184,160,.55); margin: 0 auto 26px;`
2. Selo da data — `margin-bottom: 30px`
3. H1 — `max-width: 900px; margin-inline: auto;`
4. Subheadline — `max-width: 700px; margin: 26px auto 0;`
5. `.ev-duo` — `margin-top: 40px`
6. Microcopy — `max-width: 640px; margin: 20px auto 0; text-align: center;`
7. Bloco da nota dos 42% — `margin-top: 56px; padding-top: 26px; border-top: 1px solid rgba(255,255,255,.12); max-width: var(--col-fine); margin-inline: auto; text-align: left;` (a única coisa alinhada à esquerda no hero, e é o que faz a letra miúda parecer gravada em vez de esquecida)

Sem grade de DATA/HORÁRIO/ONDE — a informação já está no selo e na microcopy, e a grade era resto da versão de tráfego.

**Nenhum elemento de urgência acima da dobra.** Sai o badge com bolinha pulsante da v1.

### Tipografia

| Elemento | Especificação |
|---|---|
| Selo | Figtree 600, 12px, `letter-spacing: .26em`, `text-transform: uppercase`, `color: var(--accent-soft)`. Marcado como `display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 0 10px;` com o `·` num `<span aria-hidden="true">` próprio, para a quebra no celular cair no separador e nunca no meio de "agosto" |
| H1 | DM Serif Display 400, `clamp(34px, 4.4vw, 56px)`, `line-height: 1.1`, `letter-spacing: -.015em`, `color: #FFFFFF` |
| H1 `<em>` (a segunda frase, `Dia 25 eu abro essa conta na sua frente.`) | mesmo tamanho, `font-style: italic`, `color: var(--accent-soft)` |
| Subheadline | Figtree 400, `clamp(17px, 1.5vw, 20px)`, `line-height: 1.6`, `color: rgba(255,255,255,.76)` |
| `42%` dentro da subheadline | Figtree 700, `color: #FFFFFF` (sem caixa, sem destaque de fundo) |
| Microcopy | Figtree 400, 13.5px, `line-height: 1.6`, `color: rgba(255,255,255,.5)` |
| Nota dos 42% | Figtree 400, 13px, `line-height: 1.7`, `color: rgba(255,255,255,.62)`; o `*` inicial em `--accent-soft`; o link do rodapé em `#FFFFFF` com `text-decoration: underline; text-underline-offset: 3px; text-decoration-color: rgba(47,184,160,.6)` |

### Cores
- Fundo `#23282A`. Título `#FFFFFF`. Itálico `#2FB8A0`.
- Glow: `radial-gradient(60% 55% at 50% 22%, rgba(22,168,142,.16) 0%, rgba(22,168,142,0) 70%)`, `position: absolute; inset: 0; pointer-events: none;` — **estático**, sem animação.
- Vinheta inferior para o hero não cortar seco na faixa seguinte: `linear-gradient(180deg, rgba(35,40,42,0) 70%, rgba(20,24,25,.5) 100%)`.
- Filetes: `rgba(47,184,160,.55)` no superior, `rgba(255,255,255,.12)` no da nota.

### Elementos Visuais
- **Grain:** camada `.ev-hero__grain` com `position:absolute; inset:0; opacity:.035; mix-blend-mode: overlay; pointer-events:none;` e `background-image` de um SVG `feTurbulence` inline em `data:` URI (`baseFrequency=".9"`, `numOctaves="4"`), `background-size: 180px 180px`. Sem requisição externa.
- **Sem foto. Sem monograma grande. Sem card de vidro.** A marca já está assinada no nav.
- Marca d'água opcional, discreta: o glifo do símbolo Leilão & Prosa (`M31 72 V30 H70 V68 H46 V46 H60`, `fill: none; stroke: #16A88E; stroke-width: 9; stroke-linecap: square`), 420x420px, `position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); opacity: .045; pointer-events: none;` atrás do H1. Estático.

### Animações
**Nenhuma.** Sem `data-aos`, sem `opacity: 0` inicial, sem fade, sem float, sem pulse. Regra do framework. As únicas transições permitidas no hero são as de `:hover` dos dois botões.

### Interatividade
- Botões: hover, active e focus conforme §2.1, variante `.on-ink` para o contornado.
- Asterisco `*` e "rodapé desta página": links âncora, `scroll-behavior: smooth` já é global.
- Nada segue o mouse, nada reage ao scroll.

### Responsividade
- **≤1024px:** `padding: 88px 40px 72px`; H1 `clamp(32px, 5vw, 46px)`; `.ev-duo` mantém 2 colunas até 720px de viewport.
- **≤720px:** `.ev-duo { grid-template-columns: 1fr; gap: 12px; }`
- **≤640px:** `padding: 72px 24px 56px`; selo 11px com `letter-spacing: .16em` e `max-width: 320px; margin-inline: auto` (quebra em 2 linhas, nunca 3); H1 `clamp(30px, 8vw, 38px)`, `line-height: 1.14`; sub 16.5px; microcopy 13px; bloco da nota `margin-top: 44px`.
- **≤375px:** H1 30px; botões `font-size: 14.5px; padding: 15px 14px`.

---

## 4. Seção 2 — FAIXA DE CREDIBILIDADE

### Arquétipo e Constraints
- **Arquétipo:** Rhythmic (Baseado em Movimento) — quatro provas em cadência idêntica, lidas como um só compasso horizontal.
- **Constraints:** Color Blocking (Cor — banda `--mint` isolando a faixa entre o hero escuro e a página branca), Bleed Both (Layout — a cor sangra as duas margens, o conteúdo não), Hover Underline (Interação — só o item do Google, que é o único clicável).
- **Justificativa:** depois de um hero escuro e vazio, uma banda verde-clara fina funciona como respiro e como carimbo. É a única seção da página sem título — é assinatura, não argumento.

### Conteúdo
`Perita judicial em imóveis` · `Credenciada da Caixa desde 2007` · `+2.400 alunos nas minhas formações` · `5,0 no Google em 39 avaliações` (este último é link para o perfil Jacque Leilões — **[CONFIRMAR a URL]**; sem URL real, o item vira texto simples, sem afordância de link)

### Layout
```
.ev-cred { background: var(--mint); border-bottom: 1px solid rgba(22,168,142,.22); }
.ev-cred__inner {
  max-width: 1280px; margin-inline: auto; padding: 20px 40px;
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: 10px 30px;
}
```
Separador entre itens via `span + span::before { content: "·"; margin-right: 30px; color: rgba(22,168,142,.7); }` — mantém o ponto médio pedido e some naturalmente na quebra de linha.

### Tipografia
Figtree 600, 14px, `letter-spacing: .01em`, `color: var(--ink-72)`. O item do Google em `--accent-deep`, 600.

### Cores
Fundo `#E7F4F0`. Texto `rgba(35,40,42,.72)`. Separador `rgba(22,168,142,.7)`. Link `#0E7A67`; hover `#16A88E`.

### Elementos Visuais
Nenhum ícone, nenhuma estrela desenhada. O "5,0 no Google" é texto — desenhar cinco estrelas aqui empurraria a faixa para a estética de e-commerce.

### Animações
`data-aos="fade-up"` no `.ev-cred__inner` inteiro, sem delay. Um único alvo, para a faixa entrar como bloco.

### Interatividade
Só o item do Google: sublinhado animado `::after { height: 1px; background: var(--accent-deep); transform: scaleX(0); transform-origin: left; transition: transform .3s var(--ease); }`, `scaleX(1)` no hover e no `:focus-visible`. `target="_blank" rel="noopener"` com `aria-label="Perfil Jacque Leilões no Google, 5,0 em 39 avaliações, abre em nova aba"`.

### Responsividade
- **≤1024px:** `gap: 10px 24px`, separador `margin-right: 24px`.
- **≤640px:** `padding: 16px 24px`, `font-size: 12.5px`, `gap: 8px 16px`, separador `margin-right: 16px`. Os quatro itens ocupam 2 a 3 linhas centradas — aceito.

---

## 5. Seção 3 — A DOR

### Arquétipo e Constraints
- **Arquétipo:** Editorial (Baseado em Tipografia) — coluna de leitura única, medida controlada, letra capitular, filete vertical marcando a narrativa.
- **Constraints:** Container Narrow (Layout — 720px de medida dentro da coluna de 1040px, alinhado à esquerda), Mixed Weights (Tipografia — capitular serif 72px contra corpo sans 17px), Clip Reveal (Movimento — o bloco do refrão entra com `clip-path` em vez de fade).
- **Justificativa:** cinco parágrafos de narrativa só funcionam com medida de revista. Centralizar esse volume de texto (o que a v1 faz) cansa o olho a cada quebra. A capitular e o filete dão à seção cara de crônica, que é exatamente a voz da Jacque.

### Conteúdo (exato)
Eyebrow: `O QUE CUSTA FICAR PARADO`
H2: `Eu já ouvi essa história umas quinhentas vezes`

P1 `Você viu um apartamento em leilão por um valor que parecia erro de digitação. Clicou. Abriu um arquivo de 58 páginas escrito em língua de cartório. Leu duas telas e fechou a aba.`
P2 `Três semanas depois esse apartamento foi vendido no leilão, e o preço final ficou perto daquele valor que tinha te assustado de tão baixo. Quem levou leu exatamente o mesmo arquivo que te fez desistir.`
P3 `Dinheiro você tinha, ou tinha como financiar. Faltou alguém sentar do seu lado e apontar onde olhar.`
P4 `Isso vale igual para os dois tipos de gente que aparecem na minha sala. Quem quer investir olha aquela diferença de preço e já pensa em revender ou alugar. Quem quer a casa própria olha a mesma diferença e enxerga um quarto a mais, ou o bairro que estava fora do orçamento. A conta que se faz antes de dar o lance é a mesma para os dois.`

H3: `O que custa ficar parado`
P5 `Eu não sei onde vai estar o preço do imóvel no ano que vem, e quem te prometer isso está chutando. O que eu sei é mais simples. Tem leilão de imóvel acontecendo em Belo Horizonte toda semana, e cada um deles termina com alguém levando o bem para casa. O aluguel que você paga esse mês não volta. E a cada leilão que passa, quem arremata é alguém que aprendeu a ler o documento que você fechou.`

Bloco do refrão (**primeira das duas aparições na página**):
`Quem não entende o jogo não arremata. Assiste.`
`Dia 25 eu sento do seu lado e a gente lê.`

### Layout
```
.ev-pain { background: var(--paper); }
.ev-pain__inner { max-width: 1280px; margin-inline: auto; padding: var(--sec-y) 40px; }
.ev-pain .ev-col { max-width: var(--col); margin-inline: auto; }   /* 1040, centrado */
```
Dentro da coluna, **tudo alinhado à esquerda**:
- Eyebrow, depois H2 com `max-width: 780px; margin: 14px 0 0;` (margin-inline 0 — o título encurta a linha sem deslocar o bloco)
- Parágrafos: `max-width: var(--col-read); margin: 22px 0 0; margin-inline: 0;`
- Filete vertical de narrativa: os parágrafos ficam dentro de `.ev-pain__story { border-left: 2px solid rgba(22,168,142,.22); padding-left: 30px; margin-top: 34px; }`
- H3 `O que custa ficar parado`: `margin: 44px 0 0;` dentro do mesmo filete
- Bloco do refrão: `max-width: 820px; margin: 56px auto 0;` (aqui `auto` é intencional — é um objeto, não um bloco de texto), `padding: 36px 40px; border-radius: var(--r-panel); background: var(--ink); color: #FFFFFF; position: relative; overflow: hidden;`

### Tipografia
| Elemento | Especificação |
|---|---|
| Eyebrow | Figtree 600, 12px, `.26em`, uppercase, `--accent-deep` |
| H2 | DM Serif Display 400, `clamp(30px, 3.4vw, 44px)`, `line-height: 1.08`, `letter-spacing: -.01em`, `--ink` |
| Capitular (primeira letra do P1) | `p:first-of-type::first-letter { font-family: var(--serif); font-size: 68px; line-height: .82; float: left; margin: 6px 12px 0 0; color: var(--accent-deep); }` |
| Corpo | Figtree 400, 17px, `line-height: 1.75`, `--ink-60` |
| H3 | Figtree 700, 20px, `line-height: 1.35`, `--ink` |
| Refrão | DM Serif Display 400, `clamp(24px, 3vw, 34px)`, `line-height: 1.18`, `#FFFFFF` |
| Linha de apoio do refrão | Figtree 400, 16px, `rgba(255,255,255,.7)`, `margin-top: 14px` |

### Cores
Fundo `#FFFFFF`. Texto `rgba(35,40,42,.62)`. Capitular `#0E7A67`. Filete `rgba(22,168,142,.22)`. Painel do refrão `#23282A` com filete esquerdo interno de 3px `#16A88E` (`padding-left: 22px` no `<p>` do refrão).

### Elementos Visuais
Aspas tipográficas decorativas no painel: `„` em DM Serif Display 140px, `position: absolute; right: 26px; top: -14px; color: rgba(47,184,160,.14); pointer-events: none;` — `aria-hidden="true"`.

### Animações
- Eyebrow + H2: `data-aos="fade-up"`.
- `.ev-pain__story`: `data-aos="fade-up" data-aos-delay="80"`.
- Painel do refrão: revelação por clip-path, não fade. Classe `.ev-reveal-clip` com `clip-path: inset(0 100% 0 0)` inicial e `.is-in { clip-path: inset(0 0 0 0); transition: clip-path 820ms cubic-bezier(.2,.6,.2,1); }`, disparada pelo mesmo IntersectionObserver do `reveal.js` (aceita qualquer elemento com `data-aos`; adicionar a variante no `reveal.css` como `[data-aos="clip-right"]`). Em `prefers-reduced-motion`, `clip-path: none` desde o início.

### Interatividade
Nenhum link, nenhum hover. Seleção de texto liberada. Cursor padrão. É a seção que o leitor só lê.

### Responsividade
- **≤1024px:** `padding: 88px 40px`; corpo 16.5px.
- **≤640px:** `padding: 68px 24px`; capitular 54px, `margin: 4px 10px 0 0`; `.ev-pain__story { padding-left: 18px; }`; painel do refrão `padding: 28px 24px`; aspas decorativas `display: none` (a 140px elas roubam a linha no celular).

---

## 6. Seção 4 — POR QUE EXISTE DESCONTO NO LEILÃO

### Arquétipo e Constraints
- **Arquétipo:** Split Assimétrico (Baseado em Divisão) — 34%/66%: coluna esquerda com o cabeçalho grudado (sticky) e coluna direita com os quatro blocos de argumento.
- **Constraints:** Sticky Element (Layout), Scroll Progress (Movimento — filete vertical que preenche conforme o leitor avança pelos quatro blocos), Selective Color (Cor — só a frase-chave em `--accent-deep`).
- **Justificativa:** são quatro argumentos encadeados; o cabeçalho fixo à esquerda segura o contexto enquanto o leitor desce, e o filete de progresso transforma leitura longa em percurso com fim visível. É o oposto estrutural da §3, que era coluna única.

### Conteúdo (exato)
Eyebrow: `DE ONDE VEM A DIFERENÇA`
H2: `Antes de tudo, o que é esse leilão de que eu falo`

Bloco 1 (sem H3 próprio, é a continuação do H2):
`Quando alguém financia um apartamento e para de pagar, o banco toma o imóvel de volta. Aí o banco coloca esse apartamento à venda num leilão, que é uma venda com data e hora marcadas onde quem oferece mais leva. Fechar essa compra é o que o mercado chama de arrematar, e essa é a palavra que você vai ver em todo site de leilão.`
`Existe também o leilão que sai de dentro de um processo na Justiça, quando um imóvel é vendido para pagar a dívida de alguém. Eu explico os dois na noite, com nome de gente.`

Bloco 2 — H3 `O que o banco quer é o dinheiro de volta`
`Assim que o banco retoma um imóvel, aquilo vira despesa na conta dele. IPTU correndo todo ano, condomínio entrando todo mês, apartamento fechado e síndico ligando para cobrar alguém. O banco quer tirar esse apartamento da mão dele rápido e recuperar o que ficou devendo do financiamento. E o que ficou devendo quase nunca é o preço que o apartamento faz na rua.`
`É daí que nasce a diferença. Ela sai da contabilidade de outra pessoa.` (frase-chave)

Bloco 3 — H3 `Por que essa diferença ainda existe`
`Se todo mundo disputasse leilão, o desconto sumia no primeiro mês.`
`O que segura a maioria do lado de fora é um documento chamado edital, que é o caderno com as regras daquela venda: o que você paga, em quanto tempo, o que vem junto com o imóvel e o que fica para trás. Esse edital é longo, é escrito em linguagem de cartório, dá prazo curto para pagar e às vezes traz dívida velha pendurada no imóvel. Junte a isso o medo de comprar um apartamento com gente morando dentro e você entende por que um imóvel bom acaba disputado por meia dúzia de pessoas, quando o mesmo apartamento num site de imobiliária teria fila na porta.`
`Boa parte do desconto do leilão é o preço do medo dos outros. Quem aprende a ler o edital entra numa disputa vazia.` (frase-chave)

Bloco 4 — H3 `Por que quase ninguém faz isso sozinho na primeira vez`
`Dar lance é a parte fácil. O trabalho está antes e está depois.`
`**Antes do lance,** eu leio o edital inteiro e leio também o histórico do imóvel no cartório, que é o documento onde fica registrado tudo que já aconteceu com aquele bem desde que ele existe, inclusive quem mais tem direito sobre ele. Confiro que tipo de leilão é aquele, porque leilão de banco e leilão que corre dentro de um processo na Justiça têm regras de prazo e de pagamento diferentes. Somo as dívidas que vêm penduradas no imóvel. Calculo quanto custa e quanto demora tirar um ocupante, quando tem ocupante.`
`**Depois do lance,** o prazo para pagar é curto, tem o imposto da prefeitura para transferir o imóvel, tem o registro no cartório, que é o ato que faz o apartamento ser seu no papel, e tem a conversa com o condomínio sobre o que ficou atrasado.`
`Errar num desses pontos transforma um desconto grande em prejuízo. Por isso a noite de 25 de agosto se resolve em edital e em conta. Motivação eu deixo para os outros.`

CTA duplo 1, com `id="cta-duplo-1"` (é o sentinela da barra fixa).

### Layout
```
.ev-mech { background: var(--mist); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.ev-mech__inner { max-width: 1280px; margin-inline: auto; padding: var(--sec-y) 40px; }
.ev-mech .ev-col { max-width: var(--col); margin-inline: auto; }   /* A CORREÇÃO: .ev-mech__head deixa de ter max-width solto */
.ev-mech__grid { display: grid; grid-template-columns: 340px 1fr; column-gap: 72px; align-items: start; }
.ev-mech__head { position: sticky; top: 96px; align-self: start; }  /* sem max-width próprio; a largura vem da coluna do grid */
.ev-mech__blocks { position: relative; padding-left: 34px; }
.ev-mech__block { padding: 30px 0; border-top: 1px solid var(--line); max-width: var(--col-read); margin-inline: 0; }
.ev-mech__block:first-child { border-top: 0; padding-top: 0; }
```
`top: 96px` no sticky = 60px de nav sticky + 36px de folga.

Trilho de progresso: `.ev-mech__blocks::before { content:""; position:absolute; left:0; top:6px; bottom:6px; width:2px; background: rgba(22,168,142,.16); }` e `.ev-mech__blocks::after` com `height: var(--prog, 0%)`, `background: var(--accent)`, `transition: height 120ms linear`, atualizado por scroll no JS (0% a 100% conforme o topo do primeiro e o fim do último bloco cruzam 55% da viewport). Desligado em `prefers-reduced-motion` (fica cheio, estático).

CTA duplo 1: `.ev-duo` com `margin: 52px auto 0;` dentro da `.ev-col` (ocupa as duas colunas do grid: `grid-column: 1 / -1`).

### Tipografia
| Elemento | Especificação |
|---|---|
| Eyebrow | Figtree 600, 12px, `.26em`, `--accent-deep` |
| H2 (na coluna sticky) | DM Serif Display 400, `clamp(28px, 2.9vw, 38px)`, `line-height: 1.1`, `--ink` |
| H3 dos blocos | Figtree 700, 20px, `line-height: 1.35`, `--ink`, `margin-bottom: 14px` |
| Corpo | Figtree 400, 17px, `line-height: 1.75`, `--ink-60` |
| `<strong>` ("Antes do lance," / "Depois do lance,") | Figtree 700, `--ink` |
| Frase-chave | DM Serif Display 400, `clamp(20px, 2.1vw, 26px)`, `line-height: 1.32`, `--accent-deep`, `margin-top: 20px` |

### Cores
Fundo `#F5F6F6`. Hairlines `rgba(31,36,37,.1)`. Trilho `rgba(22,168,142,.16)`; preenchimento `#16A88E`. Frase-chave `#0E7A67`.

### Elementos Visuais
Numeração discreta dos blocos: `01` a `04` em DM Serif Display 18px `rgba(22,168,142,.55)`, `position: absolute; left: -34px;` alinhada ao topo de cada H3, sobre o trilho. `aria-hidden="true"`.

### Animações
- `.ev-mech__head`: `data-aos="fade-up"`.
- Blocos: `data-aos="fade-up"` com `data-aos-delay` 0 / 80 / 160 / 240ms.
- `.ev-duo`: `data-aos="fade-up" data-aos-delay="120"`.
- Trilho: scroll-linked (acima). Sem `will-change`, o handler só escreve uma custom property.

### Interatividade
Hover só nos dois botões. O sticky do cabeçalho é desativado abaixo de 1024px (vira fluxo normal), senão ele ocuparia meia tela no tablet.

### Responsividade
- **≤1024px:** `.ev-mech__grid { grid-template-columns: 1fr; row-gap: 40px; }`; `.ev-mech__head { position: static; max-width: var(--col-read); margin-inline: 0; }`; H2 volta para `clamp(30px,3.4vw,44px)`; `padding: 88px 40px`.
- **≤640px:** `padding: 68px 24px`; `.ev-mech__blocks { padding-left: 22px; }`; numeração `left: -22px; font-size: 15px`; corpo 16.5px; blocos `padding: 26px 0`; `.ev-duo` `margin-top: 40px`.

---

## 7. Seção 5 — A CONTA DE UM ARREMATE

### Arquétipo e Constraints
- **Arquétipo:** Data Dense (Baseado em Densidade) — a tabela é a seção; tudo em volta serve para ela ser lida direito.
- **Constraints:** Color Blocking (Cor — linha de total em `--mint`, aviso em `--mint` com filete `--accent`), Scroll Horizontal contido (Layout — a rolagem acontece dentro do wrapper, nunca na página), Counter Animation (Movimento — o número R$ 102.968 conta de 0 até o valor ao entrar na tela).
- **Justificativa:** é o momento em que a página prova o que promete. Densidade aqui é honestidade: 11 linhas com nomes longos e sem jargão. O contador é o único momento de espetáculo da página, e ele é permitido porque o número é o argumento.

### Conteúdo (exato)
Eyebrow: `A CONTA ABERTA`
H2: `Vou te contar como essa conta se monta, linha por linha`

Aviso (`.ev-warn`, precisa estar na mesma tela da tabela):
`**EXEMPLO ILUSTRATIVO.** Os valores abaixo são inventados e foram escolhidos redondos por mim, só para você enxergar a mecânica. Não representam caso real, não citam cliente nenhum e não são previsão do que você vai conseguir. Cada imóvel tem edital, dívida e disputa próprios.`

Lead:
`Imagina um apartamento de dois quartos, num prédio comum, em bairro que já tem padaria e ponto de ônibus na esquina. Na rua, hoje, esse apartamento é anunciado por R$ 400 mil. Dentro do leilão ele tem um valor de avaliação, que é quanto um técnico disse que ele vale: R$ 380 mil. Repara que os dois números já são diferentes, e essa confusão é o primeiro erro de quem está começando.`
`O lance vence em R$ 220.400, que é 42% abaixo da avaliação. Aí começa a segunda metade da conta, que é a parte que ninguém mostra no Instagram.`

Tabela, cabeçalho `O que entra na conta` / `Valor`, 11 linhas exatamente como na copy, da linha `Preço que o apartamento faz na rua hoje · R$ 400.000` até `Tempo entre o lance e a chave na mão, neste exemplo · cerca de 12 meses`, com `Total que sai do seu bolso · R$ 297.032` em negrito.

Destaque: `R$ 102.968 de diferença neste exemplo inventado.` — a ressalva "neste exemplo inventado" fica **na mesma linha e no mesmo corpo de texto** do destaque, sem parênteses, sem corpo menor.

Fechamento (quatro parágrafos, exatos da copy, de `Agora presta atenção no que eu comparei...` até `No dia 25 essa tabela vai estar na tela, com um edital de verdade projetado do lado.`).

### Layout
```
.ev-math { background: var(--paper); }
.ev-math__inner { max-width: 1280px; margin-inline: auto; padding: var(--sec-y) 40px; }
.ev-math .ev-col { max-width: var(--col); margin-inline: auto; }
```
Ordem e margens dentro da coluna, tudo à esquerda:
1. Eyebrow + H2 (`max-width: 780px; margin-inline: 0`) — `margin-bottom: 26px`
2. `.ev-warn` — largura cheia da coluna, `margin-bottom: 26px`
3. Lead — `max-width: var(--col-read); margin-inline: 0;` dois parágrafos, `margin-top: 16px`
4. `.ev-table-wrap` — **`max-width: var(--col); margin-inline: auto;`** (a correção), `margin-top: 32px`
5. Destaque — `max-width: 840px; margin: 34px 0 0; margin-inline: 0;`
6. Parágrafos de fechamento — `max-width: var(--col-read); margin-inline: 0; margin-top: 18px`

### Tipografia
| Elemento | Especificação |
|---|---|
| H2 | DM Serif Display 400, `clamp(30px, 3.4vw, 44px)`, lh 1.08 |
| Lead | Figtree 400, 17px/1.75, `--ink-60` |
| `th` | Figtree 700, 12px, `.09em`, uppercase, `--ink-60` |
| `td` primeira coluna | Figtree 400, 15px/1.5, `--ink-60` |
| `td` segunda coluna | Figtree 600, 15px, `font-variant-numeric: tabular-nums`, `white-space: nowrap`, `--ink` |
| Linha de total | Figtree 700, 16px, `--ink`, fundo `--mint` |
| Linha do lance vencedor | Figtree 700, `--accent-deep` na coluna de valor (é a linha que a nota dos 42% referencia) |
| Destaque | DM Serif Display 400, `clamp(26px, 3.4vw, 42px)`, lh 1.12, `--accent-deep` |
| Fechamento | Figtree 400, 17px/1.75, `--ink-60`; o último parágrafo em 600 `--ink` |

### Cores
Fundo `#FFFFFF`. Tabela: `th` sobre `--mist`, `td` com `border-bottom: 1px solid var(--line)`, linha de total `#E7F4F0`. Aviso `#E7F4F0` com borda `rgba(22,168,142,.4)` e filete esquerdo `#16A88E`. Destaque `#0E7A67`. Linha "Tempo entre o lance e a chave" com `td` em itálico `--ink-50` (é tempo, não dinheiro — a diferença tipográfica evita que o leitor some meses com reais).

### Elementos Visuais
Nenhuma ilustração. A régua da leitura é a própria tabela. Sombra de rolagem e dica "Role a tabela para o lado" conforme §2.3.

### Animações
- Cabeçalho, aviso e lead: `data-aos="fade-up"` com delays 0 / 60 / 120ms.
- Tabela: `data-aos="fade-up" data-aos-delay="60"`. Linhas **não** entram em stagger — 11 linhas piscando em sequência viraria ruído.
- Destaque: `data-aos="fade-up"` + **contador**. `<span data-count-to="102968" data-count-prefix="R$ ">`, 1100ms, easing `easeOutCubic`, formatação `pt-BR` com ponto de milhar, `requestAnimationFrame`, dispara uma vez ao entrar. Enquanto não dispara, o span já contém o valor final no HTML (nunca "0" no DOM inicial — se o JS falhar, o número está lá). Com `prefers-reduced-motion`, o contador não roda.

### Interatividade
- `.ev-table-wrap` focável e rolável por teclado (§2.3).
- `tr:hover td { background: rgba(22,168,142,.045); }` com `transition: background .2s var(--ease)` — ajuda a seguir a linha na horizontal. Não aplicar na linha de total nem no `thead`.

### Responsividade
- **≤1024px:** `padding: 88px 40px`; tabela `font-size: 14.5px`; `td { padding: 12px 16px; }`
- **≤640px:** `padding: 68px 24px`; `.ev-table { min-width: 520px; }` (rola dentro do wrapper); `th/td padding: 11px 14px`; destaque `clamp(24px, 7vw, 30px)`; aviso `padding: 15px 16px`, corpo 13.5px.

---

## 8. Seção 6 — O QUE MUDA PARA QUEM VAI

### Arquétipo e Constraints
- **Arquétipo:** Before/After (Baseado em Mídia) — comparação de dois estados da mesma pessoa, lado a lado.
- **Constraints:** Dark Mode (Cor — a única seção escura do miolo, e é o pivô emocional da página), Duocromático (Cor — coluna "como você chega" em branco a 55%, coluna "quando a noite acabar" em branco cheio com filete `--accent-soft`), Stagger (Movimento — as seis linhas entram em sequência).
- **Justificativa:** o miolo da página é todo claro; um bloco escuro no meio marca a virada e dá a ela peso de cena. E resolve o problema estético de "mais uma tabela": esta não parece tabela, parece um antes e depois.

### Conteúdo (exato)
Eyebrow: `A TRANSFORMAÇÃO`
H2: `A pessoa que começa a noite e a pessoa que termina`

Cabeçalhos: `Como você chega` / `Quando a noite acabar`

As seis duplas exatamente como na copy, de `Você abre o edital de um leilão e não sabe qual parte importa.` até `Você sai sabendo qual é o seu próximo passo e em que prazo ele acontece.`

Nota final:
`Ninguém vira especialista numa terça-feira, e eu não vou fingir o contrário. O que uma terça-feira resolve é o medo do documento. A prática vem depois, e sai bem mais barata quando você já sabe onde não pisar.`

### Layout
```
.ev-shift { background: var(--ink); color: #FFFFFF; position: relative; overflow: hidden; }
.ev-shift__inner { max-width: 1280px; margin-inline: auto; padding: var(--sec-y) 40px; position: relative; z-index: 1; }
.ev-shift .ev-col { max-width: var(--col); margin-inline: auto; }
```
Marcação semântica: `<table>` de verdade (é dado comparado), com `scope="col"` nos dois `th`, dentro de `.ev-table-wrap.ev-table-wrap--ink`. No desktop ela é estilizada como duas colunas com calha central:

```
.ev-table--shift { min-width: 640px; }
.ev-table--shift th { background: transparent; border-bottom: 1px solid rgba(255,255,255,.16); }
.ev-table--shift td { width: 50%; vertical-align: top; padding: 20px 26px; border-bottom: 1px solid rgba(255,255,255,.1); }
.ev-table--shift td:first-child  { color: rgba(255,255,255,.55); }
.ev-table--shift td:last-child   { color: #FFFFFF; font-weight: 600; border-left: 2px solid rgba(47,184,160,.55); position: relative; }
```
Seta na calha: `td:last-child::before { content: "→"; position: absolute; left: -13px; top: 22px; width: 24px; height: 24px; display: grid; place-items: center; border-radius: 999px; background: var(--ink); color: var(--accent-soft); font-size: 13px; }`, `aria-hidden` via `speak: none` (o caractere é decorativo; a semântica está nas colunas).

Wrapper escuro: `.ev-table-wrap--ink { background: rgba(255,255,255,.03); border-color: rgba(255,255,255,.14); }`, com o gradiente de fim de rolagem trocado para `linear-gradient(90deg, rgba(35,40,42,0), rgba(35,40,42,.95))`.

Nota final: `max-width: var(--col-read); margin: 30px 0 0; margin-inline: 0;`

### Tipografia
| Elemento | Especificação |
|---|---|
| Eyebrow | Figtree 600, 12px, `.26em`, `--accent-soft` |
| H2 | DM Serif Display 400, `clamp(30px, 3.4vw, 44px)`, lh 1.08, `#FFFFFF`, `max-width: 760px; margin: 14px 0 32px;` |
| `th` | Figtree 700, 12px, `.1em`, uppercase; o da esquerda `rgba(255,255,255,.45)`, o da direita `--accent-soft` |
| `td` esquerda | Figtree 400, 15.5px/1.6, `rgba(255,255,255,.55)` |
| `td` direita | Figtree 600, 15.5px/1.6, `#FFFFFF` |
| Nota final | Figtree 400, 17px/1.75, `rgba(255,255,255,.65)` |

### Cores
Fundo `#23282A`. Filete divisor `rgba(47,184,160,.55)`. Hairlines `rgba(255,255,255,.1)`. Glow radial no canto superior direito: `radial-gradient(50% 60% at 82% 0%, rgba(22,168,142,.16), rgba(22,168,142,0) 70%)`, estático.

### Elementos Visuais
Marca d'água do símbolo Leilão & Prosa: 300x300px, `stroke: #16A88E; stroke-width: 9; fill: none`, `position: absolute; left: -70px; bottom: -70px; opacity: .07; pointer-events: none;` com `animation: float 9s ease-in-out infinite` (amplitude `translateY(-10px)`), desligada em `prefers-reduced-motion`.

### Animações
- Cabeçalho: `data-aos="fade-up"`.
- Wrapper da tabela: `data-aos="fade-up" data-aos-delay="60"`.
- Stagger das linhas: `tbody tr` recebe `data-aos="fade-up"` com delays 0/70/140/210/280/350ms. Aqui o stagger é permitido (6 linhas curtas, ritmo de "vira a chave"), ao contrário da tabela da §5.
- Nota: `data-aos="fade-up"`.

### Interatividade
`tr:hover td:first-child { color: rgba(255,255,255,.72); }` e `tr:hover td:last-child::before { background: var(--accent); color: #FFFFFF; }`, 220ms. Wrapper focável para rolagem por teclado.

### Responsividade
- **≤1024px:** `padding: 88px 40px`; `td { padding: 18px 20px; }`
- **≤640px:** `padding: 68px 24px`; a tabela **rola dentro do wrapper** com `min-width: 620px`, mantendo a leitura em par (empilhar antes/depois em duas linhas separadas destrói a comparação, que é o ponto da seção); dica "Role a tabela para o lado" visível; nota final 16.5px; marca d'água `display: none`.

---

## 9. Seção 7 — O QUE EU VOU MOSTRAR NA NOITE

### Arquétipo e Constraints
- **Arquétipo:** Bento Box (Baseado em Grid) — sete células de tamanhos diferentes, com a sétima ocupando a linha inteira.
- **Constraints:** Headline oversized nos números (Tipografia — numeral serif de 42px como marca da célula), Asymmetric Padding (Layout), Hover Lift (Interação).
- **Justificativa:** sete itens em lista simples viram parede de texto; em grade uniforme, viram o "grid de features" que o framework proíbe. O bento dá hierarquia (o item 7, que é a prova social da própria Jacque, ganha a linha inteira) e mantém a página com cara de peça editorial.

### Conteúdo (exato)
Eyebrow: `O QUE VAI PARA A TELA`
H2: `O que eu vou mostrar na noite`

1. `Eu abro um edital de verdade na tela e leio em voz alta, com você, as páginas que decidem se aquele imóvel presta.`
2. `Eu abro o histórico do imóvel no cartório e aponto as anotações que fazem um bom negócio virar dor de cabeça.`
3. `Eu abro a planilha de custo e refaço a conta do lance até a chave na mão, com você acompanhando linha por linha.`
4. `Eu explico a diferença entre o leilão de banco e o leilão que vem de processo na Justiça, e o que isso muda no seu prazo para pagar.`
5. `Eu mostro o que fazer com imóvel que tem gente morando dentro: quais caminhos existem, quanto custa cada um e quanto tempo cada um leva.`
6. `Eu explico por que tem tanto imóvel indo a leilão nos últimos anos, depois de tanta gente parar de pagar financiamento, e por quanto tempo esse tipo de janela costuma durar.`
7. `Eu mostro arremates meus, com número na tela, incluindo o que deu errado no meio do caminho.`

Nota: `Eu apago os dados pessoais de terceiros antes de levar qualquer documento para a tela.`

Programação (título `Programação`):
`19h credenciamento e café · 19h30 abertura · 20h a conversa comigo · 21h suas perguntas · 21h20 próximos passos · 21h40 networking (só na sala) · 22h encerramento` **[CONFIRMAR com a produção]**

Onde (título `Onde`):
`Okay Hub de Negócios e Coworking · Rua Castelo de Alcázar, 125 · Bairro Castelo · Belo Horizonte/MG`

CTA duplo 2.

### Layout
```
.ev-learn { background: var(--paper); }
.ev-learn__inner { max-width: 1280px; margin-inline: auto; padding: var(--sec-y) 40px; }
.ev-learn .ev-col { max-width: var(--col); margin-inline: auto; }   /* A CORREÇÃO: .ev-learn__head perde o max-width solto */
.ev-learn__head { max-width: 780px; margin: 0 0 40px; margin-inline: 0; }
.learn-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; list-style: none; }
```
Distribuição das células (bento):
- item 1 → `grid-column: span 3`
- item 2 → `span 3`
- item 3 → `span 2`
- item 4 → `span 2`
- item 5 → `span 2`
- item 6 → `span 3`
- item 7 → `span 3`
Resultado: linha 1 com dois cards largos, linha 2 com três médios, linha 3 com dois largos. Ritmo irregular sem virar bagunça.

```
.learn {
  background: var(--paper); border: 1px solid var(--line); border-radius: var(--r-card);
  padding: 26px 28px 28px; display: flex; flex-direction: column; gap: 14px;
  transition: transform .3s var(--ease), border-color .3s var(--ease), box-shadow .3s var(--ease);
}
```
Item 7 recebe `.learn--hi { background: var(--mint); border-color: var(--mint-line); }`.

Programação: `.ev-agenda { margin-top: 44px; padding: 30px 32px; border-radius: var(--r-card); background: var(--mist); border: 1px solid var(--line); max-width: var(--col); margin-inline: auto; }` — a lista é `display: flex; flex-wrap: wrap; gap: 12px 28px; list-style: none;` com o horário em Figtree 700 `--ink` `tabular-nums` e a atividade em `--ink-60`. O item das 21h20 (`próximos passos`) recebe `.ev-agenda__item--comercial` com `color: var(--accent-deep)` e o título `title="Bloco comercial, declarado na programação"` — declarar a oferta na própria agenda é o que sustenta a resposta do FAQ.

Endereço: `.ev-agenda__place { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--line); }`

CTA duplo 2: `.ev-duo { margin: 48px auto 0; }`

### Tipografia
| Elemento | Especificação |
|---|---|
| Eyebrow | Figtree 600, 12px, `.26em`, `--accent-deep` |
| H2 | DM Serif Display 400, `clamp(30px, 3.4vw, 44px)`, lh 1.08 |
| Numeral da célula (`01`–`07`) | DM Serif Display 400, 42px, lh 1, `color: rgba(22,168,142,.42)`; no card `--hi`, `color: var(--accent-deep)` |
| Texto da célula | Figtree 400, 16px/1.6, `--ink-72` (não 700 como na v1 — texto em bold dentro de card cheio pesa demais) |
| Nota dos dados pessoais | Figtree 400, 14px/1.6, `--ink-50`, `margin-top: 22px` |
| Título "Programação" / "Onde" | Figtree 700, 12px, `.12em`, uppercase, `--ink-60` |
| Itens da programação | Figtree 400, 15px, `--ink-60`; horário 700 `--ink` |
| Endereço | Figtree 400, 14.5px/1.6, `--ink-60` |

### Cores
Fundo `#FFFFFF`. Cards brancos com borda `rgba(31,36,37,.1)`. Card 7 `#E7F4F0` com borda `rgba(22,168,142,.25)`. Numerais `rgba(22,168,142,.42)`. Painel da programação `#F5F6F6`.

### Elementos Visuais
Nenhum ícone. O numeral serif gigante **é** o elemento gráfico da célula. Filete de 28px `--accent` no topo do card 7, `position: absolute; top: -1px; left: 28px; height: 3px;`.

### Animações
- Cabeçalho: `data-aos="fade-up"`.
- Células: `data-aos="fade-up"` com stagger em onda por linha: 0/60 · 120/180/240 · 300/360ms.
- Nota, programação e `.ev-duo`: `data-aos="fade-up"` com 0 / 80 / 140ms.

### Interatividade
`.learn:hover { transform: translateY(-4px); border-color: rgba(22,168,142,.42); box-shadow: 0 18px 34px -22px rgba(35,40,42,.4); }`. Os cards **não** são links (não há destino) — por isso hover sutil e `cursor: default`. Nenhum `:focus-visible` neles, já que não são focáveis.

### Responsividade
- **≤1024px:** `.learn-grid { grid-template-columns: repeat(4, 1fr); }` — itens 1,2 em `span 2`; 3,4 em `span 2`; 5 em `span 2`; 6 em `span 2`; 7 em `span 4`. `padding: 88px 40px`.
- **≤640px:** `grid-template-columns: 1fr;` todos em `span 1`; `padding: 68px 24px`; card `padding: 22px 20px 24px`; numeral 34px; programação `padding: 24px 22px`, lista vira `flex-direction: column; gap: 10px;` com cada linha `display: grid; grid-template-columns: 62px 1fr;` para os horários alinharem.

---

## 10. Seção 8 — QUEM ESTÁ FALANDO COM VOCÊ (a foto entra aqui)

### Arquétipo e Constraints
- **Arquétipo:** Documentary (Baseado em Mídia) — retrato sóbrio com legenda de crédito, texto em primeira pessoa, sem pose de palco.
- **Constraints:** Imagem Dessaturada leve (Mídia — `filter: saturate(.94) contrast(1.02)`, para o retrato casar com a paleta sem virar preto e branco), Golden Ratio (Layout — colunas .62fr/1fr), Selective Color (Cor — só os cinco números em `--accent-deep`, o resto em cinza).
- **Justificativa:** a foto saiu do hero justamente para não vender pessoa; aqui ela prova pessoa. Tratamento documental (moldura discreta, legenda) é o oposto de "foto de infoprodutor", e é o que o cliente pediu ao chamar de sóbrio.

### Conteúdo (exato)
Eyebrow: `QUEM ESTÁ FALANDO COM VOCÊ`
H2: `Eu sou a Jacque Costa`

`Eu resolvia leilão muito antes de subir em qualquer palco. O palco veio depois, e veio porque as pessoas começaram a me perguntar as mesmas coisas.`
`Sou perita judicial. Quando um juiz precisa saber quanto vale um imóvel dentro de um processo, alguém tem que ir lá, examinar o imóvel, colocar um valor no papel e assinar embaixo, respondendo por aquilo na Justiça. Esse alguém, em muitos processos, sou eu.`
`Sou despachante credenciada da Caixa desde 2007. Na prática, isso quer dizer que o banco me autoriza a tocar a papelada dos imóveis que ele retoma e coloca à venda. São quase duas décadas vendo por dentro como um banco grande trata esses imóveis, o que ele quer receber e com que pressa.`
`Também sou corretora e administradora, e toco a minha própria empresa. Mais de 15 anos no mercado imobiliário, quase todos na parte que ninguém posta na internet: cartório, processo, vistoria em apartamento vazio, conversa difícil com síndico.`
`A marca se chama Leilão & Prosa porque o que acontece na sala é conversa, com pergunta interrompendo no meio. O que eu levo é edital para mostrar e conta para abrir.`

Título da grade: `Os meus números`
- `42%` — `de desconto médio nas compras que eu já fechei em leilão, medido entre o valor de avaliação e o lance vencedor` + asterisco `.ev-ref`
- `+2.400` — `alunos já passaram pelas minhas formações` **[CONFIRMAR o que conta como aluno]**
- `5,0` — `no Google, em 39 avaliações do perfil Jacque Leilões, apurado em agosto de 2026`
- `Desde 2007` — `credenciada da Caixa`
- `Perita judicial` — `com laudo assinado dentro de processo`

Disclaimer: `O meu credenciamento é profissional e individual. A Caixa Econômica Federal não organiza, não patrocina e não endossa este evento.`

### Layout
```
.bio { background: var(--mist); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.bio__inner { max-width: 1280px; margin-inline: auto; padding: var(--sec-y) 40px; }
.bio .ev-col { max-width: var(--col); margin-inline: auto; }
.bio__grid { display: grid; grid-template-columns: .62fr 1fr; column-gap: 64px; align-items: start; }
```
Mídia (coluna esquerda), `position: sticky; top: 96px;`:
```
.bio__media {
  position: relative; border-radius: var(--r-card); overflow: hidden;
  aspect-ratio: 4 / 5; background: linear-gradient(150deg, var(--ink-panel), var(--ink));
  border: 1px solid var(--line);
}
```
Sem selo flutuante de "42%" sobre a foto (a v1 tinha; sai — é enfeite de LP). Em vez disso, legenda documental abaixo da imagem:
`.bio__caption { margin-top: 12px; font-size: 12.5px; line-height: 1.5; color: var(--ink-45); }` com o texto `Jacque Costa, perita judicial e despachante credenciada da Caixa desde 2007.`

Texto (coluna direita), todos os parágrafos `max-width: 620px; margin-inline: 0;`.

Grade de números: `.bio__facts { margin-top: 32px; display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; list-style: none; }` — cada `li` com `background: var(--paper); padding: 20px 22px;`. O quinto item (`Perita judicial`) ocupa `grid-column: span 2`. Grade com moldura de 1px é vocabulário já existente do ecossistema.

Disclaimer: `margin-top: 22px; max-width: 620px;`.

### Tipografia
| Elemento | Especificação |
|---|---|
| Eyebrow | Figtree 600, 12px, `.26em`, `--accent-deep` |
| H2 | DM Serif Display 400, `clamp(30px, 3.2vw, 42px)`, lh 1.06 |
| Corpo | Figtree 400, 16.5px/1.75, `--ink-60`, `margin-top: 18px` |
| Título "Os meus números" | Figtree 700, 12px, `.12em`, uppercase, `--ink-50`, `margin-top: 34px` |
| Valor do número | DM Serif Display 400, 32px, lh 1, `--accent-deep` (`Perita judicial` e `Desde 2007` caem para 24px por serem palavras) |
| Legenda do número | Figtree 400, 13.5px/1.5, `--ink-60`, `margin-top: 8px` |
| Legenda da foto | Figtree 400, 12.5px/1.5, `--ink-45` |
| Disclaimer | Figtree 400, 13px/1.65, `--ink-50`, `font-style: italic` |

### Cores
Fundo `#F5F6F6`. Cards da grade `#FFFFFF` sobre malha `rgba(31,36,37,.1)`. Números `#0E7A67`. Sem verde no retrato.

### Elementos Visuais
```
<img src="/.netlify/images?url=/images/jacque.png&w=760&q=80"
     srcset="/.netlify/images?url=/images/jacque.png&w=480&q=78 480w,
             /.netlify/images?url=/images/jacque.png&w=760&q=80 760w,
             /.netlify/images?url=/images/jacque.png&w=1000&q=80 1000w"
     sizes="(max-width: 640px) 88vw, (max-width: 1024px) 420px, 34vw"
     alt="Jacque Costa, perita judicial e despachante credenciada da Caixa, sentada à mesa de trabalho"
     width="1000" height="1250" loading="lazy" decoding="async">
```
`position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center; filter: saturate(.94) contrast(1.02);`

**Pendência 9:** foto vertical em boa resolução. Enquanto não chegar, usar `/images/jacque.png` (a que já existe). **Deletar do `<head>` o `<link rel="preload" as="image">` do `jacque-leilao.png`** — não existe mais imagem no hero, e o preload passaria a competir com o LCP, que agora é o H1.

### Animações
- Mídia: `data-aos="fade-up"`.
- Bloco de texto: `data-aos="fade-up" data-aos-delay="100"`.
- Itens da grade: `data-aos="fade-up"` com delays 0/60/120/180/240ms.
- Sem parallax na foto, sem zoom no hover: é retrato, não produto.

### Interatividade
Nenhum hover na foto. `.bio__facts li:hover { background: rgba(22,168,142,.035); }` apenas. O asterisco dos 42% é o único link.

### Responsividade
- **≤1024px:** `.bio__grid { grid-template-columns: 1fr; row-gap: 36px; }`; `.bio__media { position: static; max-width: 420px; margin-inline: 0; }` — foto **acima** do texto, como o cliente pediu; `padding: 88px 40px`.
- **≤640px:** `padding: 68px 24px`; `.bio__media { max-width: 100%; }`; `.bio__facts { grid-template-columns: 1fr; }` com o quinto item voltando a `span 1`; valor do número 28px.

---

## 11. Seção 9 — PROVA SOCIAL (bloco a preencher)

### Arquétipo e Constraints
- **Arquétipo:** Masonry (Baseado em Grid) — três a quatro depoimentos de alturas naturais diferentes, sem forçar altura igual.
- **Constraints:** Duocromático (Cor — banda `--mint` com cards `--paper`), Aspas tipográficas (Tipografia), Lightbox (Estruturas Especiais — o print da avaliação do Google abre ampliado).
- **Justificativa:** depoimento em card de altura igual obriga a cortar fala, e fala cortada soa fabricada. Masonry deixa cada depoimento ter o tamanho que tem.

### Conteúdo
**Não existe conteúdo aprovado.** Precisa de três a quatro falas reais de quem foi a uma edição anterior, com nome, cidade e o que a pessoa destravou (arrematou, aprendeu a descartar imóvel ruim, perdeu o medo do edital). Print da avaliação do Google vale mais que texto digitado.

**Regra de publicação, obrigatória:** se não houver material real até a publicação, **a seção inteira sai do HTML** (não fica comentada com placeholder visível, não entra com depoimento inventado) e o link do perfil do Google na §4 ganha peso: `font-weight: 700` e um `::after` com `→`. A página inteira se sustenta em número verificável; um depoimento fabricado derruba a credibilidade dos 42% junto.

### Layout (quando houver material)
```
.depos { background: var(--mint); border-top: 1px solid rgba(22,168,142,.22); border-bottom: 1px solid rgba(22,168,142,.22); }
.depos__inner { max-width: 1280px; margin-inline: auto; padding: 88px 40px; }
.depos .ev-col { max-width: var(--col); margin-inline: auto; }
.depos__grid { columns: 3; column-gap: 20px; }        /* masonry por colunas CSS */
.depo { break-inside: avoid; margin-bottom: 20px; background: var(--paper);
        border: 1px solid rgba(22,168,142,.2); border-radius: var(--r-card); padding: 26px 28px; }
```

### Tipografia
Eyebrow `PROVA` (Figtree 600, 12px, `.26em`, `--accent-deep`). H2 `Quem já esteve numa noite dessas`, DM Serif Display `clamp(28px, 3vw, 40px)`. Fala: Figtree 400, 16px/1.7, `--ink-72`, sem itálico (itálico em depoimento longo cansa). Assinatura: Figtree 700, 13.5px, `--accent-deep`, `margin-top: 16px`, no formato `Nome · Cidade`.

### Cores
Fundo `#E7F4F0`. Cards `#FFFFFF` com borda `rgba(22,168,142,.2)`. Aspas decorativas `rgba(22,168,142,.16)`.

### Elementos Visuais
Aspa de abertura `„` em DM Serif Display 56px, `color: rgba(22,168,142,.2)`, `margin-bottom: -18px`, `aria-hidden="true"`. Print do Google, se houver: `<img>` via `/.netlify/images?url=/images/depoimento-google.png&w=640&q=80`, `width`/`height` numéricos, `loading="lazy"`, dentro de um `<button>` que abre lightbox (`.modal` já existente no shared, variante `.modal--img`), com `alt` descrevendo o conteúdo da avaliação.

### Animações
Cards com `data-aos="fade-up"` e delays 0/90/180/270ms.

### Interatividade
Card não é link. Só o print abre lightbox: `Esc` fecha, foco volta ao botão que abriu, `aria-modal="true"`.

### Responsividade
**≤1024px:** `columns: 2`. **≤640px:** `columns: 1`; `padding: 68px 24px`.

---

## 12. Seção 10 — A OFERTA

### Arquétipo e Constraints
- **Arquétipo:** Floating Cards (Baseado em Camadas) — dois cards com profundidade diferente: o presencial elevado, o online assentado.
- **Constraints:** Color Blocking (Cor — faixa `--mint` no topo do card presencial), Shadow Depth (Camadas — o presencial tem sombra de 44px, o online não tem sombra), Hover Lift (Interação).
- **Justificativa:** o cliente vende os dois, mas o presencial é o que tem teto físico. A diferença de elevação comunica isso sem precisar de selo "MAIS VENDIDO", que seria linguagem de tabela de preço genérica — proibida pelo framework.

### Conteúdo (exato)
Eyebrow: `INGRESSOS`
H2: `Escolha como você quer estar comigo no dia 25`
Lead: `O que eu vou mostrar é igual nos dois ingressos. A conversa é a mesma e o edital que vai para a tela é o mesmo. O que muda é a cadeira e o que acontece quando eu desço do palco.`

**Card 1 — PRESENCIAL · Okay Hub, Belo Horizonte**
Preço: `R$ 157 até 11 de agosto`, `à vista ou 12x de R$ [XX,XX] pela Sympla` **[CONFIRMAR]**
`Para quem é` — `Você mora na Grande BH, quer me perguntar olhando no olho e quer sair da sala com o telefone de gente que já arrematou. Serve também para quem sabe que, de casa, vai acabar atendendo o telefone no meio da noite.`
`Inclui` — os cinco itens exatos da copy, de `Sua cadeira na sala no dia 25...` a `A conversa de corredor no intervalo...`
`Não inclui` — os quatro itens exatos, de `Estacionamento no prédio` a `Análise individual do seu imóvel ou do edital de um leilão específico`
Botão: `Quero a cadeira em BH · R$ 157`

**Card 2 — ONLINE · Transmissão ao vivo**
Preço: `R$ 67 até 11 de agosto`, `à vista ou 12x de R$ [XX,XX] pela Sympla` **[CONFIRMAR]**
`Para quem é` — `Você está fora de Belo Horizonte, ou tem compromisso naquela terça, ou quer me conhecer antes de investir uma noite inteira fora de casa. Assiste do sofá, com o caderno do lado.`
`Inclui` — os seis itens exatos da copy, incluindo o de 1h50 de conteúdo + 20 minutos de apresentação comercial e o de devolução integral por 15 minutos somados fora do ar
`Não inclui` — os quatro itens exatos
Botão: `Quero o acesso ao vivo · R$ 67`

**Painel** `Por que a cadeira custa mais que a transmissão` — os três parágrafos exatos + `Como decidir em dez segundos.` em destaque.

**Tabela de lotes** — `Lote / Período / Presencial / Online`, três linhas (`Lote 1 · até 11/08 · R$ 157 · R$ 67`, `Lote 2 · de 12/08 a 20/08 · R$ 187 · R$ 87`, `Lote 3 · de 21/08 até esgotar · R$ 217 · R$ 97`).
Nota: `A sala tem [XX] cadeiras. Quando acabam, acabaram. O acesso ao vivo não tem limite de lugares, e o preço dele sobe nas mesmas datas do presencial. Se o lote não virar na data anunciada, a oferta continua valendo pelo preço veiculado.`

CTA duplo da oferta.

### Layout
```
.ev-offer { background: var(--paper); }
.ev-offer__inner { max-width: 1280px; margin-inline: auto; padding: var(--sec-y) 40px; }
.ev-offer .ev-col { max-width: var(--col); margin-inline: auto; }
.ev-offer__head { max-width: 780px; margin: 0 0 40px; margin-inline: 0; }
.tickets { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
.ticket { border: 1px solid var(--line); border-radius: 20px; padding: 0 0 32px;
          background: var(--paper); display: flex; flex-direction: column; height: 100%;
          overflow: hidden; }
.ticket__body { padding: 0 30px; }
```
Faixa de topo (o color blocking):
```
.ticket__tag { padding: 14px 30px; font-size: 11.5px; letter-spacing: .12em;
               text-transform: uppercase; font-weight: 700; }
.ticket--live .ticket__tag { background: var(--mint); color: var(--accent-deep);
                             border-bottom: 1px solid var(--mint-line); }
.ticket--online .ticket__tag { background: var(--mist); color: var(--ink-60);
                               border-bottom: 1px solid var(--line); }
.ticket--live { border-color: rgba(22,168,142,.45);
                box-shadow: 0 28px 56px -34px rgba(35,40,42,.5); }
```
O presencial vem primeiro no DOM e continua primeiro no mobile.

**Escassez, só no presencial** (`.ticket__seats`, dentro do card presencial, logo abaixo do preço):
```
margin-top: 20px; padding: 14px 16px; border-radius: 12px;
background: var(--mint); border: 1px solid var(--mint-line);
```
Linha superior em flex: `Cadeiras na sala` (Figtree 600 13px `--ink-60`) e `[YY] de [XX] disponíveis` (Figtree 700 13px `--accent-deep`). Barra: `height: 6px; border-radius: 999px; background: rgba(14,122,103,.16);` com preenchimento `background: var(--accent); width: var(--pct);` **valor real, escrito no HTML**.
**Regra:** este bloco só existe se houver número real e conferível (pendência 1). Sem número, o bloco inteiro sai do HTML — não entra com valor inventado nem com "últimas vagas".
**O card online recebe o contrário, e isso é de propósito:** `.ticket__nolimit` com o texto `Sem limite de lugares.` em Figtree 600 13px `--ink-60`, dentro de uma caixa `background: var(--mist); border: 1px solid var(--line);` na mesma posição do bloco de lugares. Contador no online derrubaria a credibilidade da página inteira, porque transmissão ao vivo não tem teto e o leitor sabe disso.

Painel "Por que a cadeira custa mais": `.ev-why { max-width: var(--col); margin: 44px auto 0; padding: 32px 34px; border-radius: var(--r-card); background: var(--mist); border: 1px solid var(--line); }` — **a correção: `margin-inline: auto`**. Parágrafos internos com `max-width: var(--col-read); margin-inline: 0;`.

Tabela de lotes: `.ev-lots { margin-top: 44px; }` com `.ev-table-wrap` centrado (`margin-inline: auto`), `min-width: 640px` na tabela, linha do lote vigente com `.ev-table__now` em `--mint` e negrito. Nota abaixo: `max-width: var(--col-read); margin-inline: 0; margin-top: 14px;`.

CTA duplo da oferta: `.ev-duo { margin: 48px auto 0; }`.

### Tipografia
| Elemento | Especificação |
|---|---|
| H2 | DM Serif Display 400, `clamp(30px, 3.4vw, 44px)` |
| Lead | Figtree 400, 18px/1.7, `--ink-60`, `max-width: 720px`, `margin-inline: 0` |
| Preço | DM Serif Display 400, 54px, lh 1, `--ink`; cifrão em 24px; `até 11 de agosto` em Figtree 600 13px `--ink-60`, `margin-left: 8px` |
| Parcelamento | Figtree 400, 14px, `--ink-60`, `margin-top: 8px` |
| "Para quem é" / "Inclui" / "Não inclui" | Figtree 700, 11.5px, `.1em`, uppercase; os dois últimos com `border-top: 1px solid var(--line); padding-top: 18px; margin-top: 24px;` |
| Texto de "para quem é" | Figtree 400, 15px/1.6, `--ink-60` |
| Itens da lista | Figtree 400, 15px/1.6, `--ink-60`, `padding-left: 24px`, marcador `::before` |
| Título do painel | Figtree 700, 19px |
| Nota dos lotes | Figtree 400, 13px/1.65, `--ink-60` |

Marcadores: `.ticket__list li::before { content: "✓"; color: var(--accent-deep); font-weight: 700; }` e `.ticket__list--out li::before { content: "×"; color: var(--ink-45); }` — `list-style: none` no `<ul>` para não duplicar marcador.

### Cores
Fundo `#FFFFFF`. Card presencial com borda `rgba(22,168,142,.45)` e sombra `0 28px 56px -34px rgba(35,40,42,.5)`. Card online com borda `rgba(31,36,37,.1)` e **sem sombra**. Faixas de topo `#E7F4F0` e `#F5F6F6`. Painel `#F5F6F6`. Linha de lote vigente `#E7F4F0`.

### Elementos Visuais
Nenhuma ilustração, nenhum selo de "melhor escolha". A hierarquia é dada por sombra, borda e cor da faixa.

### Animações
- Cabeçalho: `data-aos="fade-up"`.
- Cards: `data-aos="fade-up"` com 0 e 90ms.
- Barra de lugares: `transform: scaleX(0)` → `scaleX(1)` em 900ms `var(--ease)` quando o card entra (`transform-origin: left`); estática em `prefers-reduced-motion`.
- Painel, tabela de lotes e `.ev-duo`: `data-aos="fade-up"` com 0/60/120ms.

### Interatividade
- `.ticket:hover { transform: translateY(-4px); }` só no presencial (`.ticket--live`), 300ms — o online sobe 2px, para a diferença de peso continuar legível no hover.
- Botões conforme §2.1: o do card presencial é `.btn-duo--fill` em largura total (`width: 100%; margin-top: auto;`), o do card online é `.btn-duo--out` em largura total. **Mesma altura, mesmo raio, mesma tipografia.**
- A seção tem `id="ingressos"` — é ela que esconde a barra fixa.

### Responsividade
- **≤1024px:** `.tickets { grid-template-columns: 1fr; }`; presencial em cima; `padding: 88px 40px`.
- **≤640px:** `padding: 68px 24px`; `.ticket__body { padding: 0 22px; }`; `.ticket__tag { padding: 12px 22px; }`; preço 44px; painel `padding: 26px 22px`; tabela de lotes rola dentro do wrapper com dica visível; `.ev-duo` em coluna.

---

## 13. Seção 11 — PERGUNTAS QUE EU SEMPRE OUÇO

### Arquétipo e Constraints
- **Arquétipo:** Reveal on Demand (Baseado em Interação) — 13 perguntas em `<details>`, agrupadas em três blocos temáticos com rótulo.
- **Constraints:** Mixed Fonts (Tipografia — pergunta em serif, resposta em sans), Grid rows animado (Movimento — `grid-template-rows: 0fr → 1fr`, que anima altura sem `max-height` chutado), Filete de estado (Cor — o item aberto ganha barra `--accent` de 2px à esquerda).
- **Justificativa:** o framework proíbe "FAQ com accordion básico". A diferença aqui está em três coisas: agrupamento com rótulo (13 perguntas seguidas viram muro), numeração serif que dá cara editorial, e abertura animada de verdade em vez de salto seco.

### Conteúdo (exato, 13 perguntas na ordem da copy)
Eyebrow: `ANTES DE COMPRAR`
H2: `Perguntas que eu sempre ouço`

**Grupo A — `SOBRE O RISCO E O CONTEÚDO`**
01 `"E se o imóvel vier com dívida, com processo em cima ou com gente morando dentro?"` (aberta por padrão)
02 `"Nunca participei de leilão nenhum. Eu vou entender alguma coisa?"`
03 `"Vale a pena o ingresso online?"`
04 `"Eu quero comprar para morar, não para investir. Serve para mim?"`

**Grupo B — `SOBRE DINHEIRO E PRAZO`**
05 `"De quanto dinheiro eu preciso para começar?"`
06 `"Em quanto tempo eu preciso pagar? Dá para financiar?"`
07 `"Como eu sei que esses 42% são verdade?"` (a resposta carrega o asterisco `.ev-ref`)

**Grupo C — `SOBRE O FORMATO E AS REGRAS`**
08 `"E se a transmissão cair no meio?"`
09 `"Vou levar oferta comercial na cara durante o evento?"`
10 `"Consigo cancelar se eu mudar de ideia?"`
11 `"Posso passar meu ingresso para outra pessoa?"`
12 `"Tem estacionamento no prédio?"`
13 `"Posso gravar a noite?"`

As respostas entram integrais, exatamente como na copy, sem corte e sem reescrita. As aspas fazem parte do texto da pergunta.

### Layout
```
.ev-faq { background: var(--mist); border-top: 1px solid var(--line); }
.ev-faq__inner { max-width: 1280px; margin-inline: auto; padding: var(--sec-y) 40px; }
.ev-faq .ev-col { max-width: var(--col); margin-inline: auto; }
.faq__group { margin-top: 40px; }
.faq__group-label { font-size: 11.5px; letter-spacing: .16em; text-transform: uppercase;
                    font-weight: 700; color: var(--accent-deep); margin-bottom: 12px; }
.faq__list { max-width: var(--col); margin-inline: auto; }   /* A CORREÇÃO */
.faq__item { border-top: 1px solid var(--line); background: var(--paper);
             border-left: 2px solid transparent; }
.faq__item:last-child { border-bottom: 1px solid var(--line); }
.faq__item[open] { border-left-color: var(--accent); background: var(--paper); }
.faq__item summary { display: grid; grid-template-columns: 46px 1fr 34px;
                     align-items: start; gap: 0 10px;
                     padding: 22px 24px; cursor: pointer; list-style: none; }
.faq__answer { display: grid; grid-template-rows: 0fr;
               transition: grid-template-rows 320ms var(--ease); }
.faq__item[open] .faq__answer { grid-template-rows: 1fr; }
.faq__answer > div { overflow: hidden; }
.faq__answer p { padding: 0 24px 24px 80px; max-width: 760px; }
```
O `summary::-webkit-details-marker { display: none; }` e o sinal de `+` vira o terceiro item da grade: `.faq__sign` com `+` que rotaciona 45° quando aberto (`transform: rotate(45deg)`, 300ms).

`<details>` nativo, com `name="faq"` **não** aplicado — abrir uma não deve fechar a outra (o leitor compara respostas).

### Tipografia
| Elemento | Especificação |
|---|---|
| H2 | DM Serif Display 400, `clamp(30px, 3.4vw, 44px)`, `max-width: 720px`, `margin-inline: 0` |
| Numeral (`01`–`13`) | DM Serif Display 400, 20px, `rgba(22,168,142,.5)`, `line-height: 1.5` |
| Pergunta | DM Serif Display 400, `clamp(18px, 1.7vw, 21px)`, lh 1.35, `--ink` |
| Sinal `+` | Figtree 400, 26px, `--accent`, lh 1 |
| Resposta | Figtree 400, 16px/1.75, `--ink-60` |

### Cores
Fundo da seção `#F5F6F6`. Itens `#FFFFFF`. Hairlines `rgba(31,36,37,.1)`. Item aberto: pergunta `#0E7A67`, filete esquerdo `#16A88E`. Hover da pergunta: `#0E7A67`.

### Elementos Visuais
Nenhum ícone. Numeral e sinal `+` são o vocabulário gráfico.

### Animações
- Cabeçalho e cada grupo: `data-aos="fade-up"` com delays 0/60/120/180ms.
- Abertura: `grid-template-rows` 320ms `var(--ease)` + rotação do `+` 300ms. Em `prefers-reduced-motion`, abertura instantânea.
- Sem stagger item a item dentro do grupo — 13 elementos entrando em sequência é ruído.

### Interatividade
- `summary` é focável por natureza; `:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }` (offset negativo porque o item tem borda esquerda e o outline externo seria cortado).
- Item 01 com atributo `open` no HTML: a página abre já respondendo o maior medo.
- Nada de "abrir todas" — botão extra aqui é ruído.

### Responsividade
- **≤1024px:** `padding: 88px 40px`.
- **≤640px:** `padding: 68px 24px`; `summary { grid-template-columns: 34px 1fr 26px; padding: 18px 18px; }`; pergunta 17px; `.faq__answer p { padding: 0 18px 20px 52px; }`; numeral 17px.

---

## 14. Seção 12 — CTA FINAL

### Arquétipo e Constraints
- **Arquétipo:** Spotlight (Baseado em Foco) — painel escuro isolado, tudo em volta apagado, glow radial atrás dos dois botões.
- **Constraints:** Gradiente Radial (Cor), Framed Content (Layout — raio 28px, o painel é um objeto sobre papel branco), Hover Glow (Efeitos Especiais — halo pulsante no botão primário, desligado em `prefers-reduced-motion`).
- **Justificativa:** é o fecho e o eco do hero. Centralizado de propósito, para a página abrir e fechar com a mesma respiração. O painel flutuando sobre branco encerra a leitura como um cartão-convite, e não como mais uma seção.

### Conteúdo (exato)
H2: `Terça-feira, 25 de agosto, 19h`
`Semana que vem alguém vai arrematar um apartamento que você viu e deixou passar. Vai ser alguém que leu o edital inteiro.`
`O que eu levo para a tela é papel e planilha. Você sai sabendo o que olhar primeiro, quanto custa além do lance, quando dar meia-volta e quando insistir.`
Refrão (**segunda e última aparição na página**): `Quem não entende o jogo não arremata. Assiste.`
Botões: par `.ev-duo` com os textos do CTA final.
Endereço: `Okay Hub de Negócios e Coworking · Rua Castelo de Alcázar, 125 · Bairro Castelo · Belo Horizonte/MG. Ou ao vivo, de onde você estiver.`
Letra miúda: `Preços do lote 1, válidos até 11 de agosto. Parcelamento em até 12x pela Sympla. Presencial limitado a [XX] cadeiras. Arrependimento em 7 dias corridos a partir da compra, com devolução integral.` **[CONFIRMAR a capacidade; sem o número, a frase vira "Presencial limitado à capacidade da sala."]**

### Layout
```
.ev-cta { background: var(--paper); }
.ev-cta__outer { max-width: 1280px; margin-inline: auto; padding: var(--sec-y) 40px; }
.ev-cta__inner {
  position: relative; overflow: hidden;
  max-width: var(--col); margin-inline: auto;
  border-radius: 28px; padding: 76px 56px 68px;
  background: var(--ink); color: #FFFFFF;
  text-align: center;                 /* segunda e última exceção declarada */
}
.ev-cta__content { max-width: var(--col-hero); margin-inline: auto; }
```
Ordem interna: filete de 56px (igual ao do hero, `rgba(47,184,160,.55)`, `margin: 0 auto 24px`) → H2 → dois parágrafos (`max-width: 660px; margin: 18px auto 0;`) → refrão (`margin-top: 34px`) → `.ev-duo` (`margin-top: 40px`) → endereço (`margin-top: 30px`) → letra miúda (`margin-top: 12px`).

Seção com `id="inscricao"` (a barra fixa também some aqui).

### Tipografia
| Elemento | Especificação |
|---|---|
| H2 | DM Serif Display 400, `clamp(28px, 3.2vw, 42px)`, lh 1.08, `#FFFFFF` |
| Parágrafos | Figtree 400, 17px/1.7, `rgba(255,255,255,.72)` |
| Refrão | DM Serif Display 400, `clamp(22px, 2.6vw, 32px)`, lh 1.2, `#FFFFFF`, `padding-top: 22px`, com filete superior de 3px `var(--accent)` e `width: 56px; margin: 0 auto` (no centro, porque o bloco é centrado — diferente do refrão da §5, que tem filete à esquerda; a repetição da frase não pode ser a repetição do enquadramento) |
| Endereço | Figtree 400, 14px/1.6, `rgba(255,255,255,.7)`, `max-width: 640px; margin-inline: auto` |
| Letra miúda | Figtree 400, 12.5px/1.6, `rgba(255,255,255,.48)`, `max-width: 640px; margin-inline: auto` |

### Cores
Painel `#23282A`. Glow atrás dos botões: `radial-gradient(46% 46% at 50% 76%, rgba(22,168,142,.22) 0%, rgba(22,168,142,0) 72%)`. Filetes `rgba(47,184,160,.55)` e `#16A88E`.

### Elementos Visuais
Marca d'água do símbolo: 260x260px, stroke `#16A88E` width 9, `position: absolute; right: -60px; top: -60px; opacity: .08;` com `animation: float 8s ease-in-out infinite` (amplitude -8px). Grain igual ao do hero, `opacity: .03`.

### Animações
- `.ev-cta__inner`: `data-aos="fade-up"`.
- Glow do botão primário, **só aqui**: `animation: ctaGlow 3.4s ease-in-out infinite` alternando `box-shadow` de `0 0 0 0 rgba(22,168,142,.28)` para `0 0 0 12px rgba(22,168,142,0)`. Não é urgência, é foco — e some inteiro em `prefers-reduced-motion`.
- Marca d'água: float 8s.

### Interatividade
Botões conforme §2.1, variante `.on-ink` no contornado. Nada mais é clicável.

### Responsividade
- **≤1024px:** `padding: 88px 40px`; painel `padding: 60px 40px 56px`.
- **≤640px:** `padding: 68px 24px`; painel `padding: 44px 24px 40px`, `border-radius: 20px`; H2 `clamp(26px, 7.4vw, 32px)`; `.ev-duo` em coluna; marca d'água `display: none`.

---

## 15. Seção 13 — RODAPÉ

### Arquétipo e Constraints
- **Arquétipo:** Sparse (Baseado em Densidade) — três blocos separados por hairlines, muito ar, nada competindo.
- **Constraints:** Low Contrast (Cor — cinza sobre `--mist`, o rodapé não disputa atenção), Hover Underline scaleX (Interação — mesmo vocabulário do nav, fechando a moldura da página).
- **Justificativa:** é uma LP de tráfego pago; o rodapé serve de saída e de responsabilidade legal, não de menu. Mas a nota dos 42% mora aqui, e ela precisa de corpo de leitura de verdade.

### Conteúdo (exato)
Bloco 1 — assinatura: monograma Leilão & Prosa + `Leilão & Prosa` (com `&` em itálico `--accent`), e a assinatura da marca-mãe `Faz Morar` com o filete dourado `#B08D57` descrito na §0.

Bloco 2 — `#metodologia`, título `Sobre os 42%` e a **versão longa integral** da nota, exatamente como na copy (de `os 42% são a média simples dos descontos que eu obtive nos arremates que eu conduzi...` até `...à disposição para conferência pelo e-mail [contato].`), em primeira pessoa. Segundo parágrafo com a nota da Caixa.

Bloco 3 — identificação do fornecedor (Decreto 7.962/2013):
`Realização: Jacque Leilões · [Razão social], CNPJ [XX.XXX.XXX/0001-XX] · [Endereço completo] · Atendimento: [e-mail] e [WhatsApp] · [Termos de uso] · [Política de privacidade]` **[CONFIRMAR — pendência 6; sem esses dados a página não pode ser publicada]**
`Apoio: 3BF · AVANTIK · CONEXÃO SV`
`© 2026 Leilão & Prosa · Jacque Leilões · CRECI 5314 PJ`

Navegação enxuta: `O Clube` → `/leilao-e-prosa/` · `Planos` → `/planos/` · `Comunidade grátis` → `/comunidade/` · `Livro` → `/livro/` · `Faz Morar` → `/`

### Layout
```
.footer-c { background: var(--mist); border-top: 1px solid var(--line); }
.footer-c__inner { max-width: 1280px; margin-inline: auto; padding: 48px 40px 24px;
                   display: flex; justify-content: space-between; flex-wrap: wrap;
                   gap: 24px; align-items: center; }
.footer-c__method { max-width: 1280px; margin-inline: auto; padding: 26px 40px;
                    border-top: 1px solid var(--line); }
.footer-c__method-col { max-width: var(--col-fine); margin-inline: auto; text-align: left; }
.footer-c__thin { max-width: 1280px; margin-inline: auto; padding: 0 40px 40px;
                  display: flex; flex-wrap: wrap; gap: 10px 24px; }
```

### Tipografia
- Assinatura: DM Serif Display 400, 18px.
- Título da metodologia: Figtree 700, 12px, `.1em`, uppercase, `--ink-60`.
- **Nota dos 42%: Figtree 400, 13px, `line-height: 1.7`, `--ink-60`.** 13px é piso, não meta — menor que isso, no celular, deixa de ser informação e vira letra escondida.
- Identificação do fornecedor: Figtree 400, 12.5px/1.6, `--ink-50`.
- Links enxutos: Figtree 600, 13px, `--ink-50`.

### Cores
Fundo `#F5F6F6`. Texto `rgba(35,40,42,.62)` e `rgba(35,40,42,.5)`. Links hover `#0E7A67`. Filete dourado `#B08D57` só na assinatura da marca-mãe.

### Elementos Visuais
Monograma SVG inline (o mesmo do nav, 26x28). Nada mais.

### Animações
Nenhuma. `data-aos` no rodapé atrapalha — ele chega junto com o fim da página.

### Interatividade
Links com sublinhado animado `scaleX` (mesmo `::after` do nav) e `:focus-visible` global. `#metodologia` com o realce `:target` da §2.5.

### Responsividade
**≤640px:** `.footer-c__inner { padding: 40px 24px 20px; }`; `.footer-c__method { padding: 22px 24px; }`; `.footer-c__thin { padding: 0 24px 32px; }`; nota dos 42% mantém 13px (nunca reduzir).

---

## 16. Nav (já construída — dois ajustes)

Mantém a estrutura de co-branding atual. Dois ajustes:
1. `.nav__brands-sep` recebe o gradiente dourado descrito na §0.
2. `.nav__cta` muda de texto para `Ingressos` (era `Garantir ingresso`) e passa a ser um link âncora `href="#ingressos"` com `data-modal-open` removido — no topo da página, mandar direto para o modal antes de a pessoa saber o preço é o gesto de LP de tráfego que a v2 está desfazendo. Estilo mantido (charcoal com hover verde).

---

## 17. `<head>` e SEO

```
<title>Nunca deu um lance? Leilão &amp; Prosa · 25/08, BH ou ao vivo</title>
<meta name="description" content="Nunca deu um lance? Dia 25 eu abro a conta inteira de uma compra de imóvel em leilão e explico cada palavra difícil na hora. Em BH ou ao vivo, 19h.">
<meta property="og:title" content="Quem não entende o jogo não arremata. Assiste.">
<meta property="og:description" content="Uma noite comigo sobre comprar imóvel em leilão, começando do começo. Edital de verdade na tela e a conta aberta. 25 de agosto, 19h, em BH ou ao vivo.">
```
Manter `og:type`, `og:url`, `og:image`, `og:locale`, `twitter:card`, favicon, apple-touch-icon, preload das duas fontes, Meta Pixel.

**Remover:** `<link rel="preload" as="image" media="(min-width: 1025px)" href=".../jacque-leilao.png...">`. Não existe mais imagem no hero; o LCP agora é o H1, servido por fonte já pré-carregada.

**JSON-LD `Event`** (schema.org) no fim do `<body>`, com `name`, `startDate 2026-08-25T19:00-03:00`, `endDate 2026-08-25T22:00-03:00`, `eventAttendanceMode` misto, `location` (Okay Hub + `VirtualLocation`), `performer` Jacque Costa, `organizer`, e dois `offers` com preço, moeda `BRL`, `validThrough 2026-08-11` e a URL da Sympla. **Só sobe quando a URL da Sympla existir** (pendência 5) — `offers` sem `url` real é marcação inválida.

---

## 18. Checklist técnico para o `/desenvolver`

**Layout**
- [ ] Toda seção: `.__inner` de 1280px com `margin-inline: auto` e `padding: 104px 40px`; dentro dele **uma** `.ev-col` de 1040px com `margin-inline: auto`.
- [ ] Nenhum `max-width` solto sem `margin-inline: auto`. Conferir nominalmente: `.ev-mech__head`, `.ev-learn__head`, `.ev-table-wrap`, `.ev-why`, `.faq__list`, `.ev-warn`, `.ev-agenda`, `.ev-shift__note`, `.ev-lots__note`, `.ev-cta__content`, `.ev-fine__text`.
- [ ] Encurtamento de linha só com `max-width` + `margin-inline: 0`.
- [ ] `text-align: left` em tudo, exceto §3 (hero) e §14 (CTA final).
- [ ] Em 1280px, a borda esquerda de todos os H2 dá o mesmo valor.
- [ ] Em 375px, `document.body.scrollWidth === document.body.clientWidth`.

**Botões**
- [ ] `.btn-duo` com `min-height: 66px` e `border: 2px solid transparent` no preenchido (altura idêntica ao contornado).
- [ ] Os sete pares com os textos exatos da tabela da §2.1.
- [ ] Zero ocorrências de `.linkish` na página. O online nunca é link de texto.
- [ ] Todos com `data-modalidade` correto.

**Tabelas**
- [ ] Três `.ev-table-wrap` com `margin-inline: auto`, `overflow-x: auto`, `overscroll-behavior-x: contain`, `tabindex="0"`, `role="region"` e `aria-label`.
- [ ] Sombra de fim de rolagem e dica "Role a tabela para o lado" ≤640px.

**Barra fixa**
- [ ] Dois botões dentro; sentinela `#cta-duplo-1`; some em `#ingressos` e em `#inscricao`; `inert` quando escondida; `body { padding-bottom: 78px }` ≤860px.

**Escassez**
- [ ] `.ticket__seats` só no card presencial e só com número real; `Sem limite de lugares.` no card online.
- [ ] Nenhum contador regressivo de tempo em lugar nenhum.

**Movimento**
- [ ] Hero sem `data-aos`, sem `opacity: 0`, sem animação de entrada.
- [ ] `prefers-reduced-motion` desliga float, glow, contador, barras de lugares, clip-reveal e o trilho de progresso da §6.

**Mídia**
- [ ] Única imagem da página: retrato da §10, via `/.netlify/images?url=/images/jacque.png&w=...&q=80`, com `width`/`height` numéricos, `srcset`, `sizes` e `loading="lazy"`.
- [ ] Preload de imagem do `<head>` removido.

**Marca e conteúdo**
- [ ] Verde em toda a página; `#B08D57` só no filete do nav e na assinatura do rodapé.
- [ ] Nenhum emoji.
- [ ] Refrão `Quem não entende o jogo não arremata. Assiste.` aparece exatamente duas vezes (§5 e §14), com enquadramentos diferentes.
- [ ] Asterisco dos 42% acompanha o número em todas as ocorrências e aponta para `#metodologia`.
- [ ] Nota dos 42% no rodapé com no mínimo 13px.
- [ ] `outline: 2px solid var(--accent); outline-offset: 3px` em todo focável (variante `#2FB8A0` sobre `--ink`).
- [ ] Validar em 1280 / 1024 / 860 / 640 / 375px.

**Nenhum `[CONFIRMAR]` sobe para a tela.** Onde o dado não existir, o texto usa a versão alternativa já escrita neste documento (parcelamento, capacidade da sala) ou o bloco inteiro não é renderizado (lugares, prova social, JSON-LD).

---

## 19. Pendências que bloqueiam a publicação

1. Capacidade real da sala do Okay Hub (afeta hero, `.ticket__seats`, nota dos lotes e letra miúda do CTA final).
2. Valor da parcela, total parcelado e taxa da Sympla nos dois ingressos. Sem isso, nenhum "12x" na tela.
3. Quantidade de arremates e período que compõem a média dos 42%.
4. O que conta como aluno nos +2.400.
5. Chat com leitura ao vivo, replay e garantia da transmissão. Recomendação forte, repetida: liberar replay de 48h no online — é a maior alavanca do ingresso barato e hoje está listado como não incluso.
6. Razão social, CNPJ, endereço e canais de atendimento para o rodapé.
7. Confirmar a programação (perguntas às 21h, próximos passos às 21h20).
8. Depoimentos reais para a §11 — sem eles, a seção não existe.
9. Foto vertical da Jacque em boa resolução para a §10.
10. Validar com o jurídico a regra de arrependimento para quem compra nas 48 horas antes do evento.
11. URL do evento na Sympla (destrava o `data-redirect` do modal e o JSON-LD) e URL do perfil no Google (destrava o link da faixa de credibilidade).

---

## 20. Resumo dos arquétipos

| Seção | Arquétipo | Constraints |
|---|---|---|
| 3 · Hero | Type Hero | White Space Hero · Container Narrow · Noise Texture · Mixed Fonts |
| 4 · Credibilidade | Rhythmic | Color Blocking · Bleed Both · Hover Underline |
| 5 · A dor | Editorial | Container Narrow · Mixed Weights · Clip Reveal |
| 6 · Por que existe desconto | Split Assimétrico | Sticky Element · Scroll Progress · Selective Color |
| 7 · A conta | Data Dense | Color Blocking · Scroll Horizontal contido · Counter Animation |
| 8 · O que muda | Before/After | Dark Mode · Duocromático · Stagger |
| 9 · O que eu vou mostrar | Bento Box | Headline oversized · Asymmetric Padding · Hover Lift |
| 10 · Quem está falando | Documentary | Imagem Dessaturada · Golden Ratio · Selective Color |
| 11 · Prova social | Masonry | Duocromático · Aspas tipográficas · Lightbox |
| 12 · A oferta | Floating Cards | Color Blocking · Shadow Depth · Hover Lift |
| 13 · Objeções | Reveal on Demand | Mixed Fonts · Grid rows animado · Filete de estado |
| 14 · CTA final | Spotlight | Gradiente Radial · Framed Content · Hover Glow |
| 15 · Rodapé | Sparse | Low Contrast · Hover Underline scaleX |

Nenhum arquétipo se repete em seções consecutivas.