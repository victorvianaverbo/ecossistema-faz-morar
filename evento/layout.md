# LAYOUT.MD · LEILÃO & PROSA · EVENTO 23/09/2026 · v3 "PREMIUM NOTURNO"

> **Revisão de 01/09/2026 (edição de setembro):** a data virou quarta, 23 de setembro. **Acabou a transmissão online**: todos os CTAs vendem a vaga presencial, e saíram o card dark, a coluna Online da tabela, a linha Ao vivo da ficha e as regras `.ticket--dark`. **A seção 10 (A Oferta) foi removida inteira**, junto com a tabela de lotes e o bloco "Por que a cadeira custa mais", que só existia para comparar com a transmissão; o que inclui e o que não inclui virou o bloco `.inclui` dentro da seção da programação, que herdou o `id="ingressos"` para o link da topbar continuar válido. A página não exibe mais preço de ingresso. O Clube do Leilão passou a aparecer na bio e no fecho dos públicos.


> Especificação completa da página, seção a seção, baseada na copy v4 (`copy.md`) e no design aprovado do hero + faixa + mecanismo (`index.html` + `style.css` na raiz da pasta). Este documento é a bíblia do `/desenvolver`: nada aqui é sugestão, tudo é valor exato.
> A versão anterior da página vive em `_backup_v1/` e deve ser IGNORADA. Onde este documento e o HTML atual divergirem, este documento vence.

---

# FUNDAMENTOS GLOBAIS

## Regras inegociáveis (decisões do cliente)

1. **PROIBIDO eyebrow/kicker/overline em qualquer seção.** Nenhum rótulo pequeno em caixa alta com letter-spacing acima de títulos. Toda seção começa direto na headline. O selo de data do hero foi excluído por decisão do Victor em 09/08.
2. **Nenhum botão carrega preço.** Preço existe apenas na tabela de lotes (seção 10) e no exemplo ilustrativo (seção 5). Urgência só por data absoluta.
3. **Sem emojis, sem exclamações, sem travessão (— –)** em qualquer texto renderizado.
4. Padrões proibidos: 3 cards com ícones, grid simétrico de features, depoimento com foto circular, bullets com checkmark, pricing table de SaaS, FAQ accordion básico sem tratamento, hero centralizado genérico.
5. Textos vêm EXATAMENTE da `copy.md` v4. Marcadores **[CONFIRMAR]** não sobem para produção (ver pendências no fim da copy).

## Ritmo de zonas claras e escuras (revisão de 09/08)

A página alterna sete blocos, e a lógica não é decorativa: o que é documento e estudo vai para papel; o que é noite, palco e oferta fica no escuro.

```
ESCURO  hero + credibilidade + mecanismo
CLARO   currículo + a conta
ESCURO  dois públicos + a professora
CLARO   programação hora a hora
ESCURO  a oferta
CLARO   FAQ
ESCURO  CTA final + rodapé
```

A implementação é uma classe de escopo `.zona-clara` no `<section>`, que **redefine os tokens** em vez de reescrever regra por regra. Tudo que já usa `var()` vira papel sozinho:

```css
.zona-clara {
  --bg-0: #F1EDE4;  --bg-1: #E6E0D3;  --paper: #FBF9F4;
  --text: #0E211C;  --text-muted: #4A5F58;
  --mint: #0E7A67;  --accent: #0E7A67;  --accent-deep: #0A5F50;
  --line: rgba(14,33,28,0.14);  --line-strong: rgba(14,33,28,0.30);
}
```

Regras invioláveis do bloco:
- **Nunca** declarar `transform`, `filter`, `perspective`, `will-change` ou `contain` na `.zona-clara`: qualquer uma cria contexto de empilhamento e quebra o `position: sticky` do currículo e o `animation-timeline: view()` dos descendentes.
- O bloco vive **depois** de todas as regras de seção no arquivo, para vencer por ordem de origem sem `!important`.
- Onze overrides acompanham os tokens, para hardcodes que não sobrevivem ao remapeamento: chip do currículo (menta some no papel), `.curr__privacy`, `.btn--fill` (texto `#04110D` sobre verde reprova AA, vira `--paper` a 6,9:1), `.btn--ghost::before`, `.faq__q:hover`, `.faq__num`, `.faq__mark`, `mark.confirmar`, `.ast` e `::selection`.
- `.curr` e `.faq` tiveram o `max-width` movido da section para o wrapper interno; sem isso o papel vira uma laje centralizada com calhas escuras nas laterais.
- Transição entre zonas: filete de 2px em `--accent-deep` só nas bordas externas do bloco claro, via `:not(.zona-clara) + .zona-clara` e `:has()`. Sem suporte a `:has()`, o filete simplesmente não aparece.
- O grain global permanece como está: o alfa efetivo é 0,12 e a oscilação sobre o papel fica em ±0,75%, o que produz dente de papel em vez de sujeira.

## Tokens (já implementados no style.css)

```css
--bg-0: #071310;          /* verde-preto profundo, base */
--bg-1: #0B1B16;          /* bandas e superfícies elevadas */
--ink-inverse: #0E211C;   /* texto sobre papel */
--paper: #F1EDE4;         /* material documental */
--text: #F1EDE4;          /* off-white quente */
--text-muted: #9FB3AB;    /* sálvia acinzentada (>= 0.75 de alpha em corpo pequeno) */
--accent: #16A88E;        /* verde da marca */
--accent-deep: #0E7A67;   /* verde profundo (tinta sobre papel) */
--mint: #8CEFD3;          /* menta luminosa, cor seletiva de destaque */
--line: rgba(241,237,228,0.13);        /* hairlines */
--line-strong: rgba(241,237,228,0.25); /* bordas de contorno */
```

Nota: esta página NÃO usa os tokens `.brand-lp` de `/_shared/base.css`; a identidade evoluída vive inteira em `evento/style.css`. Nenhum dourado da marca-mãe no corpo da página.

## Tipografia

- **Display: Fraunces** (Google Fonts, variável `ital,opsz,wght 0/1, 9..144, 300..900`). Pesos usados: 300 (light), 450 (títulos de seção), 500, 600, 650, 750 (o 42% e numerais). Itálico como voz de ênfase.
- **Corpo/UI: DM Sans** (variável `opsz,wght 9..40, 300..700`). Corpo 300, UI/botões 500, rótulos documentais 700.
- Corpo base 17px / lh 1.7 (16px em <=680px). Parágrafos longos sempre com `max-width` entre 56ch e 68ch.
- Link Google Fonts (único, no `<head>`): `https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=DM+Sans:opsz,wght@9..40,300..700&display=swap` com preconnect para `fonts.googleapis.com` e `fonts.gstatic.com`.

## Dispositivos da identidade (vocabulário visual recorrente)

1. **Stroke gigante em menta**: numerais/aspas em Fraunces com `color: rgba(140,239,211,0.02)` e `-webkit-text-stroke: 1.5px rgba(140,239,211,0.22–0.4)`. Usado no "25" do hero, nos 01–03 do mecanismo, na aspa do refrão (e na segunda aparição do refrão no CTA final).
2. **Material papel**: `--paper` com texto `--ink-inverse`, raio 6px, rotação sutil (-1 a -1.4deg), sombra `0 30px 70px rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.35)`, separadores `1px dashed rgba(14,33,28,0.22)`, rótulos DM Sans 700 10.5–11px tracking 0.12–0.16em em `rgba(14,33,28,0.7)`. Usado na ficha do hero, no documento da conta (seção 5), no ingresso presencial (seção 10) e no modal.
3. **Hairlines** `--line` como divisor universal; nunca box com borda nos 4 lados em conteúdo editorial.
4. **Grain global**: `body::after` fixo, SVG feTurbulence inline, `opacity: 0.35`, `mix-blend-mode: overlay`, `z-index: 60`, `pointer-events: none`.
5. **Glow ambiente**: um único radial `rgba(22,168,142,0.17)` blur 10px por tela (hero e CTA final). Nunca sombra colorida em botão ou texto.

## Botões (sistema fechado)

- **Primário `.btn--fill`**: fundo sólido `#16A88E`, texto `#04110D`, DM Sans 500 15.5px, padding 19px 20px, raio 6px, sombra `0 4px 18px rgba(0,0,0,0.35)`. Hover: fundo `#2FD4AF` (sem lift, sem glow).
- **Secundário `.btn--ghost`**: transparente, borda `1px solid var(--line-strong)`, texto `--text`. Hover: borda e texto `--mint` + preenchimento `rgba(140,239,211,0.1)` subindo de baixo via `::before` com `transform: scaleY(0→1)`, 320ms `cubic-bezier(0.22,1,0.36,1)`.
- Pares sempre com a mesma largura (grid `repeat(2, minmax(0,1fr))`, máx 660px; empilham em <=680px, presencial em cima).
- Textos exatos por posição: anexo (b) da `copy.md`. Todos abrem o modal de captura (seção 13) com `data-modal-open` e `data-modalidade` presencial/online.

## Grid, espaçamento e âncoras

- Container `--w-page: 1240px`; padding lateral `--pad-x: clamp(20px, 4.5vw, 56px)`.
- Respiro vertical de seção: `clamp(90px, 13vh, 150px)` no topo, `clamp(80px, 11vh, 130px)` na base (seções dark); bandas têm padding próprio menor.
- Âncoras: `#topo` (hero), `#nota-42` (nota do hero), `#ingressos` (seção 10), `#inscricao` (CTA final), `#metodologia` (rodapé). O topbar linka `#ingressos`.
- Ordem: 1 Hero → 2 Faixa → 3 Mecanismo → 4 Currículo → 5 Conta → 6 Públicos → 7 Professora → (8 Prova social, condicional) → 9 Hora a hora → 10 Oferta → 11 FAQ → 12 CTA final → 14 Rodapé. Modal (13) e barra mobile (15) são globais.

## Animação e acessibilidade (regras globais)

- Reveal de scroll: `@supports (animation-timeline: view())` com keyframe `rise` (opacity 0 + translateY(34px) → 1/0), `animation-range: entry 0% entry 42%`. Sem JavaScript para reveals; fallback é conteúdo visível.
- Hero NÃO tem animação de entrada; só ambient motion (drift do numeral, 26s ease-in-out alternate).
- `prefers-reduced-motion: reduce` desliga: drift, reveals, transitions de botões e `scroll-behavior` (vira `auto`).
- Foco visível global: `outline: 2px solid var(--mint); outline-offset: 3px`.
- Contraste mínimo AA: texto pequeno sobre `--bg-0/--bg-1` nunca abaixo de `rgba(159,179,171,0.75)`; sobre papel nunca abaixo de `rgba(14,33,28,0.7)`.
- `::selection { background: var(--accent); color: #04110D; }`.

## Breakpoints

- **1060px**: hero em coluna única (ficha desce, máx 460px); grids largos colapsam conforme cada seção.
- **680px**: tipografia mobile, CTAs empilham, barra fixa inferior entra (bloco 15), grids em coluna única.

---

# SEÇÃO 1: HERO (id="topo") — CONSTRUÍDO E APROVADO

### Arquétipo e Constraints
- Arquétipo: **Type Hero assimétrico** (tipografia protagonista + contraponto documental).
- Constraints: Mixed Weights/Fonts extremos (Tipografia) · Grain Overlay (Efeitos) · Selective Color menta (Cor) · Ambient Motion no numeral (Movimento) · Hover Fill nos CTAs (Interação).
- Justificativa: a promessa "Aprenda a arrematar" é verbal por natureza; tipografia em escala dramática vende sozinha, e a ficha em papel ancora o universo documental do leilão sem foto de banco de imagem.

### Conteúdo
Exato da copy seção 1 (sem selo/kicker): H1 "Aprenda a arrematar imóveis em leilão em média 42% abaixo da avaliação", subheadline completa, botões `Garantir minha vaga presencial` / `Assistir à transmissão ao vivo`, microcopy completa, nota dos 42%.

### Layout
- `position: relative; min-height: 100svh; overflow: hidden; display: flex; flex-direction: column; justify-content: center;` padding `clamp(120px,16vh,170px) var(--pad-x) 34px`.
- Topbar absoluto: wordmark "Leilão & Prosa" (Fraunces 500 19px, & itálico 300 em `--mint`) à esquerda; "Edição 23.09" (11.5px 500 tracking 0.22em uppercase `--text-muted`) + pill "Ingressos" (13px 500 tracking 0.14em uppercase, borda `--line-strong`, raio 999px, padding 10px 22px, hover `--mint`) à direita; padding 26px var(--pad-x).
- `.hero__inner`: grid `minmax(0,1.55fr) minmax(300px,0.45fr)`, gap `clamp(40px,5vw,84px)`, align center, máx 1240px.
- Fundo: numeral "25" absoluto (top -0.15em, right -0.12em, `font-size: clamp(340px,46vw,760px)`, Fraunces 700, stroke 1.5px rgba(140,239,211,0.22), fill rgba(140,239,211,0.02), lh 0.8, drift `translate(0,0) → translate(-1.6vw,3vh)` 26s ease-in-out infinite alternate) + glow radial (left -18vw, bottom -34vh, 62vw x 62vw, `radial-gradient(circle, rgba(22,168,142,0.17) 0%, transparent 62%)`, blur 10px).
- Nota dos 42% abaixo do grid: `border-left: 2px solid var(--accent)`, padding-left 18px, `column-width: 38ch; column-gap: 48px`, 12.5px lh 1.7, rgba(159,179,171,0.85), margem-top `clamp(34px,5vh,54px)`, id `nota-42`.

### Tipografia (headline escalonada, 3 linhas)
- `.t-1` "Aprenda a *arrematar*": Fraunces 300, `clamp(36px,4.6vw,66px)`, cor `--text-muted`; "arrematar" itálico 600 cor `--text`.
- `.t-2` "imóveis em leilão": Fraunces 650, `clamp(46px,6.4vw,96px)`, cor `--text`, margem `0.04em 0 0.08em`; em <=680px `clamp(36px,12vw,46px)`.
- `.t-3` "em média **42%** abaixo da avaliação": flex baseline com wrap, column-gap 0.35em; base Fraunces 300 itálico `clamp(30px,3.6vw,52px)` `--text-muted`; `42%` Fraunces 750 romano `clamp(58px,8vw,122px)` lh 0.9 `--mint` letter-spacing -0.03em, sem text-shadow. Sem asterisco no H1 (decisão do cliente); a nota logo abaixo cumpre o papel. Bloco "abaixo<br>da avaliação" com lh 1.06.
- Headline geral: lh 1.02, letter-spacing -0.015em, margem-bottom `clamp(26px,3.6vh,40px)`.
- Sub: DM Sans 300 `clamp(16px,1.35vw,18.5px)`, máx 58ch, `--text-muted`, margem-bottom `clamp(28px,4vh,42px)`. Microcopy: 12.5px lh 1.65, rgba(159,179,171,0.75), máx 62ch.

### Ficha do evento (aside, material papel)
Dispositivo 2 completo: raio 6px, rotação -1.4deg, sombra funda, furo de arquivo (pill 44x5px rgba(14,33,28,0.14) centrado, top 16px), padding 26px 26px 30px. Cabeçalho: rótulo "FICHA DO EVENTO" (11px 700 tracking 0.24em `--accent-deep`) + carimbo circular 64px (borda 1.5px `--accent-deep`, rotação 8deg, opacity 0.85, "L&P" Fraunces 600 15px + "23.09" DM Sans 700 9.5px tracking 0.12em). Linhas `<dl>`: grid `104px 1fr` gap 12px, padding 10px 0, `border-top: 1px dashed rgba(14,33,28,0.22)`; dt 10.5px 700 tracking 0.16em rgba(14,33,28,0.7) uppercase; dd 13.5px lh 1.5. Conteúdo exato: Data "Quarta, 23 de setembro de 2026" / Presencial "19h às 22h · Okay Hub, Bairro Castelo, BH" / Ao vivo "Transmissão das 19h30 às 21h40" / Formato "Edital real projetado e conta aberta na tela" / Investimento "Valor do lote vigente, na tabela de lotes desta página". Linha fina: "Ingresso pessoal e intransferível · Arrependimento em 7 dias" (11px, rgba(14,33,28,0.7), border-top dashed). SEM barcode.

### Animações e interatividade
Sem animação de entrada. Drift do numeral apenas. Botões conforme sistema global. Focus visible global.

### Responsividade
- 1060px: grid 1 coluna, gap 54px, ficha máx 460px rotação -1deg.
- 680px: padding-top 110px, min-height auto; numeral 300px top -30px right -60px stroke rgba(140,239,211,0.14); `.t-2` `clamp(36px,12vw,46px)`; CTAs 1 coluna; ficha sem rotação largura 100%; "Edição 23.09" some.

---

# SEÇÃO 2: FAIXA DE CREDIBILIDADE — CONSTRUÍDA E APROVADA

### Arquétipo e Constraints
- Arquétipo: banda mínima de transição (hardware de confiança, não seção editorial).
- Constraints: hairlines superior e inferior (Layout) + separadores em ponto médio verde (Tipografia).

### Conteúdo
Exato da copy seção 2: "Perita judicial em imóveis, com laudo assinado na Justiça · Credenciada da Caixa desde 2007 · +2.400 alunos nas formações **[CONFIRMAR: pendência 5]** · 5,0 no Google em 39 avaliações" + disclaimer "O credenciamento é profissional e individual. A Caixa Econômica Federal não organiza, não patrocina e não endossa este evento." (1ª de 3 aparições).

### Especificação
- Banda `--bg-1`, `border-top/bottom: 1px solid var(--line)`, padding 26px var(--pad-x); conteúdo máx 1240px.
- Lista flex wrap, gap 10px 18px; itens DM Sans 400 13.5px `--text` letter-spacing 0.01em; separador `li:not(:last-child)::after` conteúdo "·" margin-left 18px `--accent` 700 (linha quebrada termina com ponto, nunca começa).
- Item do Google vira link (URL real, `target="_blank" rel="noopener"`) QUANDO confirmada; até lá, texto puro.
- Disclaimer: 11.5px, rgba(159,179,171,0.85), margem-top 10px.
- 680px: lista em coluna, gap 8px, separadores somem (`content: ""`).

---

# SEÇÃO 3: O MECANISMO — CONSTRUÍDO E APROVADO

### Arquétipo e Constraints
- Arquétipo: **Editorial** (linhas largas de revista, hairlines, numerais).
- Constraints: Texto com Stroke nos numerais 01–03 (Tipografia) · Scroll Reveal via view-timeline (Movimento).
- Justificativa: os três pagadores do desconto são um argumento em sequência; linhas empilhadas com numerais dão peso de tese, não de feature list.

### Conteúdo
Exato da copy seção 3: título "De onde vem o desconto que você vai aprender a capturar" ("capturar" em itálico 650 `--mint`), os 3 parágrafos com subtítulos "O banco com pressa" / "A multidão do lado de fora" / "Quem entra sem a conta", e o refrão (1ª de 2 aparições): "Quem não entende o jogo<br>não arremata. Assiste." + ponte "No dia 23, você aprende o jogo."

### Especificação
- Container máx 1240px + pad-x, padding vertical padrão. SEM overline acima do título (regra 1).
- Título: Fraunces 450 `clamp(32px,4.2vw,60px)` lh 1.12 letter-spacing -0.01em, máx 880px, margem-bottom `clamp(50px,7vh,84px)`.
- Linhas: bloco com `border-top: 1px solid var(--line)`; cada `article` grid `clamp(120px,16vw,220px) 1fr`, gap `clamp(20px,4vw,60px)`, padding vertical `clamp(36px,5.5vh,62px)`, `border-bottom: 1px solid var(--line)`, align start.
- Numeral: Fraunces 650 `clamp(64px,9vw,132px)` lh 0.85, stroke 1.5px rgba(140,239,211,0.4), fill transparent, user-select none.
- Subtítulo: Fraunces 600 `clamp(22px,2.2vw,30px)` letter-spacing -0.01em, margem-bottom 14px; parágrafo DM Sans `clamp(15.5px,1.25vw,17.5px)` `--text-muted` máx 68ch.
- Refrão: grid nas mesmas colunas das linhas; `::before` aspa `\201C` Fraunces 650 `clamp(90px,10vw,150px)` lh 0.6 stroke 1.5px rgba(140,239,211,0.4); citação Fraunces itálico 450 `clamp(30px,4.4vw,62px)` lh 1.18 máx 24ch, quebra controlada com `<br>`; "Assiste." em `--mint` 700 romano; ponte DM Sans 500 13px tracking 0.22em uppercase `--text-muted`, `grid-column: 2`, margem-top 22px (fecho de citação abaixo dela, não eyebrow). Margem-top do bloco `clamp(70px,10vh,110px)`.
- Reveal: `rise` nas linhas (`animation-range: entry 0% entry 42%`) e no refrão (`entry 0% entry 50%`); reduced-motion desliga.
- 680px: linhas em 1 coluna (numeral 74px, margem-bottom 4px); refrão 1 coluna com row-gap 10px, aspa 72px lh 0.8, ponte `grid-column: 1`.

---

## Seção 4: O Currículo da Noite

### Arquétipo e Constraints
**Arquétipo:** Split Assimétrico (divisão 38/62) com coluna esquerda fixa durante o scroll.
**Constraints:** Sticky Element (Layout) + View Timeline com stagger natural de entrada (Movimento) + numerais 01 a 07 em chip sólido de menta pequeno, tratamento invertido em relação ao stroke gigante do mecanismo (Tipografia/Cor).
**Justificativa:** o mecanismo usa numerais ocos e monumentais para narrar; o currículo responde com numerais pequenos, cheios e densos, sinalizando que a promessa virou item executável. A coluna sticky mantém a promessa "o que você vai dominar" e o CTA na tela durante toda a leitura dos 7 itens, encurtando o caminho até o clique.

### Conteúdo
Título (H2): `O que você vai dominar quando a noite acabar`
Parágrafo de abertura: `A noite inteira acontece com documento aberto e conta rodando na tela, na mesma ordem em que eu trabalho desde 2007, para que você saia sabendo fazer, e não apenas sabendo que existe. Quando ela acabar, você vai ser capaz de:`

Itens (numeral + sentença única, sem cortar uma palavra):
- `01.` `Ler um edital sem travar, porque eu abro um documento completo em voz alta com você, mostrando por onde começo, o que cada trecho muda no seu bolso e em que ponto eu descartaria o imóvel sem gastar um real com ele.`
- `02.` `Conferir a vida do imóvel no cartório, já que a certidão registra os donos antigos, as disputas e quem ainda pode ter direito sobre o bem, e é ali que costuma se esconder o detalhe que derruba um negócio de aparência boa.`
- `03.` `Fechar a conta do lance até a chave, somando comissão do leiloeiro, imposto de transferência, cartório, dívidas assumidas, desocupação e obra, linha por linha, até o total que sai do seu bolso.`
- `04.` `Distinguir leilão de banco de leilão de Justiça, entendendo quem vende em cada um, o que muda no prazo e no risco, e por que essa diferença define a sua estratégia de pagamento.`
- `05.` `Avaliar imóvel com morador dentro, conhecendo o leque de saídas possíveis, do acordo à ação na Justiça, com uma noção honesta de custo e de tempo para cada caminho.`
- `06.` `Entender a janela de agora, com o que encheu os leilões nos últimos anos e o que a história diz sobre quanto tempo uma fase assim costuma ficar aberta.`
- `07.` `Aprender com os meus números reais, porque eu mostro as minhas próprias compras com a planilha aberta, dando tempo extra às que doeram, já que errar com a minha conta na sua frente é o jeito mais barato de você acertar na sua.`

Nota de privacidade: `Todo documento passa por limpeza antes do telão, então nome, CPF e endereço de terceiros não aparecem.`
CTA duplo 1: botão primário `Garantir minha vaga presencial` · botão secundário `Assistir à transmissão ao vivo`

### Layout
```html
<section class="curr" id="curriculo">
  <div class="curr__grid">
    <div class="curr__left">                <!-- sticky no desktop -->
      <h2 class="curr__title">O que você vai <em>dominar</em> quando a noite acabar</h2>
      <p class="curr__intro">A noite inteira acontece com documento aberto e conta rodando na tela, na mesma ordem em que eu trabalho desde 2007, para que você saia sabendo fazer, e não apenas sabendo que existe. Quando ela acabar, você vai ser capaz de:</p>
      <div class="curr__ctas">
        <button type="button" class="btn btn--fill">Garantir minha vaga presencial na sala</button>
        <button type="button" class="btn btn--ghost">Garantir meu acesso ao vivo</button>
      </div>
    </div>
    <ol class="curr__list">
      <li class="curr__item">
        <span class="curr__num" aria-hidden="true">01.</span>
        <p class="curr__text"><strong class="curr__lead">Ler um edital sem travar</strong>, porque eu abro um documento completo em voz alta com você, mostrando por onde começo, o que cada trecho muda no seu bolso e em que ponto eu descartaria o imóvel sem gastar um real com ele.</p>
      </li>
      <!-- itens 02 a 07 na mesma estrutura; o <strong class="curr__lead"> envolve exatamente
           o trecho antes da primeira vírgula de cada item:
           02 "Conferir a vida do imóvel no cartório" · 03 "Fechar a conta do lance até a chave"
           04 "Distinguir leilão de banco de leilão de Justiça" · 05 "Avaliar imóvel com morador dentro"
           06 "Entender a janela de agora" · 07 "Aprender com os meus números reais" -->
      <li class="curr__privacy">Todo documento passa por limpeza antes do telão, então nome, CPF e endereço de terceiros não aparecem.</li>
    </ol>
  </div>
</section>
```
- `.curr`: `padding: clamp(90px, 13vh, 150px) var(--pad-x) clamp(80px, 11vh, 130px); max-width: calc(var(--w-page) + 2 * 56px); margin: 0 auto; position: relative;` fundo herdado `var(--bg-0)`, sem borda.
- `.curr__grid`: `display: grid; grid-template-columns: minmax(320px, 440px) minmax(0, 1fr); gap: clamp(48px, 6.5vw, 110px); align-items: start;`
- `.curr__left`: `position: sticky; top: clamp(96px, 14vh, 140px); align-self: start;`
- `.curr__intro`: `margin-top: 22px; max-width: 42ch;`
- `.curr__ctas`: `margin-top: clamp(28px, 4vh, 40px); display: grid; grid-template-columns: 1fr; gap: 12px; max-width: 360px;` (na coluna estreita os dois botões empilham por padrão, primário em cima, mesma largura).
- `.curr__list`: `list-style: none; margin: 0; padding: 0; border-bottom: 1px solid var(--line);`
- `.curr__item`: `display: grid; grid-template-columns: 64px 1fr; gap: clamp(18px, 2.4vw, 34px); padding: clamp(28px, 4.2vh, 46px) 0; border-top: 1px solid var(--line); align-items: start;`
- `.curr__num`: chip `width: 46px; height: 46px; display: grid; place-content: center; border-radius: 6px; background: var(--mint); box-shadow: 0 6px 18px rgba(140, 239, 211, 0.15); user-select: none; transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);` (justifica-se: eco invertido do `.mec__num`, que é gigante e vazado; aqui pequeno e preenchido).
- `.curr__text`: `max-width: 62ch; margin: 0;` com padding-top de 8px para alinhar a primeira linha ao centro óptico do chip.
- `.curr__privacy`: `margin-top: 26px; padding: 0 0 0 18px; border-left: 2px solid var(--accent); max-width: 58ch;` (mesmo dispositivo da `.hero__note`). Fica dentro do `<ol>` como `<li>` sem numeral, `list-style: none`.

### Tipografia
- `.curr__title`: Fraunces, weight 450, `font-size: clamp(30px, 3.6vw, 52px)`, `line-height: 1.12`, `letter-spacing: -0.01em`, cor `var(--text)`. O `<em>` de "dominar": `font-style: italic; font-weight: 650; color: var(--mint);` (idêntico ao `.mec__title em`).
- `.curr__intro`: DM Sans, weight 300, `font-size: clamp(15.5px, 1.25vw, 17.5px)`, `line-height: 1.7`, `letter-spacing: 0`, cor `var(--text-muted)`.
- `.curr__num`: Fraunces, weight 600, `font-size: 17px` (680px: 15px), `line-height: 1`, `letter-spacing: 0`, cor `#04110D`.
- `.curr__text`: DM Sans, weight 300, `font-size: clamp(15.5px, 1.25vw, 17.5px)`, `line-height: 1.68`, cor `var(--text-muted)`.
- `.curr__lead` (trecho antes da primeira vírgula): Fraunces, weight 600, `font-size: clamp(19px, 1.6vw, 23px)`, `line-height: inherit`, `letter-spacing: -0.01em`, cor `var(--text)`, `font-style: normal`, `transition: color 0.25s ease`.
- `.curr__privacy`: DM Sans, weight 400, `font-size: 13px`, `line-height: 1.65`, cor `rgba(159, 179, 171, 0.85)`.
- Botões: DM Sans, weight 500, `font-size: 15.5px`, `letter-spacing: 0.01em` (herdado de `.btn`).

### Cores
- Fundo da seção: `var(--bg-0)` `#071310`. Hairlines dos itens: `var(--line)` `rgba(241,237,228,0.13)`.
- Chip numeral: fundo `#8CEFD3`, texto `#04110D`, sombra `rgba(140,239,211,0.15)`. Hover do item: chip mantém fundo, título do item vai a `#8CEFD3`.
- Título: `#F1EDE4`; em itálico: `#8CEFD3`. Corpo: `#9FB3AB`. Lead: `#F1EDE4`.
- Nota de privacidade: texto `rgba(159,179,171,0.85)`, borda esquerda `#16A88E`.
- Botão primário: fundo `#16A88E`, texto `#04110D`, sombra `0 4px 18px rgba(0,0,0,0.35)`; hover fundo `#2FD4AF`. Botão secundário: borda `1px solid rgba(241,237,228,0.25)`, texto `#F1EDE4`; hover borda e texto `#8CEFD3` com preenchimento `rgba(140,239,211,0.1)` subindo de baixo. Focus visível: outline `2px solid #8CEFD3`, offset 3px.

### Elementos Visuais
- Chip de numeral 46x46px, raio 6px, menta sólida, texto `01.` a `07.` com ponto, Fraunces 600 17px, sombra `0 6px 18px rgba(140,239,211,0.15)`. Nenhum outro ícone ou ornamento.
- Hairlines horizontais de 1px `var(--line)` no topo de cada item e na base da lista.
- Barra vertical de 2px `#16A88E` na nota de privacidade, `padding-left: 18px` (eco da nota dos 42% do hero).
- Sem numeral de fundo gigante nesta seção: o dispositivo de stroke pertence ao mecanismo e ao refrão; repetir aqui diluiria os dois.

### Animações
```css
@supports (animation-timeline: view()) {
  .curr__left {
    animation: rise linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 38%;
  }
  .curr__item, .curr__privacy {
    animation: rise linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 42%;
  }
}
```
- Keyframe: o `rise` já existente (`opacity 0 + translateY(34px)` até `opacity 1 + translateY(0)`).
- Stagger: emergente do próprio scroll, cada `.curr__item` cumpre seu range ao entrar no viewport, sem delay artificial.
- Trigger: entrada no viewport via `view()`. Duração: proporcional ao scroll dentro do range declarado.
- Fallback: fora do `@supports`, nada anima e tudo fica visível.
- `prefers-reduced-motion: reduce`: dentro do bloco existente, adicionar `.curr__left, .curr__item, .curr__privacy { animation: none; }` e `.curr__num, .curr__lead { transition: none; }`.

### Interatividade
- Hover no `.curr__item`: `.curr__lead` transiciona para `color: #8CEFD3` em 0.25s ease; `.curr__num` aplica `transform: rotate(-4deg) scale(1.06)` em 0.25s `cubic-bezier(0.22, 1, 0.36, 1)`. Sem mudança de fundo na linha.
- Botões: comportamentos idênticos aos do hero (`.btn--fill:hover` fundo `#2FD4AF`; `.btn--ghost::before` com `transform: scaleY(0)` para `scaleY(1)` em 0.32s `cubic-bezier(0.22, 1, 0.36, 1)`, origem bottom). Clique abre o modal de captura com `data-modalidade="presencial"` no primário e `data-modalidade="online"` no secundário.
- Focus: `:focus-visible` global, outline `2px solid var(--mint)`, offset 3px, raio 2px.
- A coluna sticky nunca cobre conteúdo: `top` de `clamp(96px, 14vh, 140px)` garante folga sob o topbar.

### Responsividade
**1060px:**
- `.curr__grid { grid-template-columns: 1fr; gap: 0; }`
- `.curr__left { display: contents; }` (os filhos viram itens diretos do grid; sticky deixa de existir).
- Ordem via grid: `.curr__title { order: 1; }` `.curr__intro { order: 2; margin-bottom: clamp(36px, 5vh, 50px); max-width: 62ch; }` `.curr__list { order: 3; }` `.curr__ctas { order: 4; margin-top: clamp(32px, 5vh, 44px); max-width: 660px; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }` (CTA passa para depois da lista, lado a lado como no hero).
**680px:**
- `.curr__item { grid-template-columns: 40px 1fr; gap: 14px; padding: 24px 0; }`
- `.curr__num { width: 36px; height: 36px; font-size: 15px; border-radius: 5px; }`
- `.curr__lead { font-size: 18px; }` `.curr__text { padding-top: 4px; }`
- `.curr__ctas { grid-template-columns: 1fr; gap: 12px; max-width: none; }` primário em cima, largura total.
- `.curr__privacy { margin-top: 20px; font-size: 12.5px; }`

---

## Seção 5: A Conta

### Arquétipo e Constraints
**Arquétipo:** Editorial em zona clara, com um quadro de três números-chave no lugar da planilha.
**Constraints:** Counter Animation nos três valores ao entrar no viewport (Movimento) + faixa tracejada de EXEMPLO ILUSTRATIVO herdada do material documental (Cor/Layout) + hairlines verticais separando as células (Tipografia documental).
**Justificativa:** a versão anterior trazia a planilha inteira em papel rotacionado, com 11 linhas, e o cliente reprovou por tamanho. O quadro preserva o argumento (lance, custo total, folga real) e a proteção jurídica ocupando um terço do espaço. Como a seção agora é zona clara, repetir uma folha de papel sobre papel produziria uma caixa flutuante sem função: por isso nenhum card, só filetes.

### Conteúdo
Título (H2): `A conta que você vai sair sabendo fazer`
Parágrafo 1: o apartamento de R$ 350 mil na imobiliária contra R$ 320 mil de avaliação.
Parágrafo 2: o lance em R$ 185.600, 42%\* abaixo da avaliação.
Aviso, na faixa do quadro: texto integral do EXEMPLO ILUSTRATIVO da copy, sem corte.
Trio de números: **R$ 185.600** (lance vencedor, 42%\* abaixo da avaliação) · **R$ 254.448** (total que sai do seu bolso, já com comissão do leiloeiro, imposto de transferência, cartório, dívidas assumidas, desocupação e obra) · **R$ 95.552** (de folga neste exemplo inventado, contra os R$ 350.000 do preço de imobiliária).
Linha de tempo: `Tempo estimado entre o lance e a chave, neste exemplo: cerca de 14 meses.`
Depois do quadro: os três parágrafos de honestidade (a régua dos 27,3%, o custo da revenda, o fecho) e o CTA duplo 2.

### Layout

```html
<section class="conta zona-clara" id="conta">
  <div class="conta__inner">
    <h2 class="conta__title">A conta que você vai sair sabendo <em>fazer</em></h2>
    <p class="conta__p conta__p--first">...</p>
    <p class="conta__p">... 42%<a class="ast" href="#metodologia">*</a> ...</p>
    <figure class="quadro">
      <h3 class="sr-only">O exemplo em três números</h3>
      <figcaption class="quadro__aviso"><strong>Exemplo ilustrativo.</strong> ...</figcaption>
      <div class="quadro__trio">
        <div class="quadro__cel">
          <span class="quadro__num count" data-target="185600">R$ 185.600</span>
          <span class="quadro__rot">...</span>
        </div>
        <div class="quadro__cel">
          <span class="quadro__num count" data-target="254448" data-delay="200">R$ 254.448</span>
          <span class="quadro__rot">...</span>
        </div>
        <div class="quadro__cel quadro__cel--folga">
          <span class="quadro__num count" data-target="95552" data-delay="460" data-duracao="1200">R$ 95.552</span>
          <span class="quadro__rot">...</span>
        </div>
      </div>
      <p class="quadro__tempo">...</p>
    </figure>
    <p class="conta__p conta__p--honest">... (três parágrafos)</p>
    <div class="conta__ctas">... CTA duplo 2 ...</div>
  </div>
</section>
```

Valores exatos:
- `.conta`: zona clara, `padding: clamp(90px, 13vh, 150px) var(--pad-x)`; `.conta__inner` com `max-width: 880px; margin: 0 auto`.
- `.quadro`: `margin: clamp(40px, 6vh, 62px) 0 clamp(28px, 4vh, 42px)`.
- `.quadro__aviso`: `padding: 14px 18px`, fundo `rgba(14, 122, 103, 0.07)`, tracejados `1px dashed rgba(14, 33, 28, 0.28)` no topo e na base.
- `.quadro__trio`: `display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-bottom: 1px solid var(--line)`.
- `.quadro__cel`: `padding: clamp(20px, 3vh, 30px) clamp(16px, 2vw, 26px) clamp(20px, 3vh, 30px) 0`; a partir da segunda célula, `padding-left: clamp(16px, 2vw, 26px); border-left: 1px solid var(--line)`.
- `.quadro__cel--folga`: `background: rgba(14, 122, 103, 0.05)`.

### Tipografia
- `.quadro__num`: Fraunces 700, `clamp(26px, 3.4vw, 42px)`, `line-height: 1`, `letter-spacing: -0.02em`, `font-variant-numeric: lining-nums tabular-nums`, cor `var(--text)`; na célula da folga, `var(--accent-deep)`.
- `.quadro__rot`: DM Sans 400, 12.5px, `line-height: 1.5`, `max-width: 34ch`, `text-wrap: pretty`, cor `var(--text-muted)`.
- `.quadro__aviso`: DM Sans 400, 12.5px, `line-height: 1.6`; o `<strong>` inicial em 700, `letter-spacing: 0.14em`, uppercase, `var(--accent-deep)`.
- `.quadro__tempo`: DM Sans 400, 12.5px, cor `var(--text-muted)`.

### Cores
Tudo resolvido pelos tokens da zona clara: papel `#F1EDE4`, tinta `#0E211C`, sálvia escurecida `#4A5F58`, verde `#0A5F50`. Nenhum hardcode de tema escuro sobrevive nesta seção; os dois únicos valores fixos são os lavados de verde do aviso e da célula da folga.

### Elementos Visuais
Faixa tracejada do aviso e hairlines verticais entre as células. Sem papel rotacionado, sem carimbo, sem sombra: numa zona que já é papel, esses dispositivos perderiam a função que tinham no fundo escuro.

### Animações
Reveal `rise` no `.quadro` (`animation-range: entry 0% entry 45%`). Contadores por IntersectionObserver em `.quadro__trio` (threshold 0.35, dispara uma vez), escalonados pelos `data-delay` de 0, 200 e 460ms, com easing easeOutCubic. Sem JS ou sob `prefers-reduced-motion`, os três valores finais já estão escritos no HTML.

### Interatividade
Apenas o asterisco dos 42%, que leva a `#metodologia`. Nenhum hover nas células: é documento, não interface.

### Responsividade
- **1060px:** sem mudança estrutural, a coluna de 880px cabe.
- **680px:** o trio vira coluna única com `border-top` entre as células (a primeira sem borda), `.quadro__num` em 30px, a célula da folga sangrando 14px para as laterais, aviso com `padding: 14px` e corpo 12px, `.quadro__rot` sem `max-width`.

## Seção 6: Os Dois Públicos

### Arquétipo e Constraints
**Arquétipo:** Split Vertical espelhado (dois painéis 50/50 divididos por hairline central), com faixa full-width de anti-persona abaixo.
**Constraints:** Hover Reveal (Interação) + Color Blocking discreto (Cor) + Texto com Stroke como marca d'água tipográfica (Tipografia).
**Justificativa:** o espelhamento traduz a simetria do argumento (a mesma leitura de edital serve aos dois públicos) e o Hover Reveal transforma a escolha de identidade do leitor em gesto físico. O Color Blocking em opacidades baixíssimas diferencia os painéis sem ícone e sem card, mantendo o vocabulário tipográfico do sistema.

### Conteúdo
H2: `Para quem eu desenhei essa noite`

Painel esquerdo, lead: `Para quem quer investir.`
Corpo: `Você nunca deu um lance, mas já entendeu que a distância entre o lance e o preço de rua é margem, e quer aprender a separar imóvel disputável de armadilha para sair do leilão com um bem abaixo do preço de mercado, pronto para revender ou alugar.`

Painel direito, lead: `Para quem quer morar.`
Corpo: `Metade da minha sala é gente buscando a casa própria, e para essa pessoa o desconto tem outro nome: um endereço melhor com uma prestação que finalmente cabe no salário. A leitura de edital que ela precisa dominar é exatamente a mesma do investidor, e a noite serve às duas na mesma medida.`

Faixa abaixo, lead: `Uma honestidade antes de você comprar.`
Corpo: `Se o que você procura é dica quente de imóvel ou promessa de renda garantida, essa noite vai te frustrar, porque o que eu entrego é método: você aprende a ler e a calcular, e a decisão, com o risco dela, continua sendo sua.`

### Layout
```
section.pub
├─ div.pub__inner            (max-width: 1240px; margin: 0 auto; padding: clamp(90px,13vh,150px) var(--pad-x) 0)
│  ├─ h2.pub__title          (max-width: 880px; margin-bottom: clamp(50px,7vh,84px))
│  └─ div.pub__split         (display: grid; grid-template-columns: 1fr 1fr; gap: 0;
│     │                       border-top: 1px solid var(--line); border-bottom: 1px solid var(--line))
│     ├─ article.pub__panel.pub__panel--investir
│     │  ├─ span.pub__ghost aria-hidden="true"  → "investir"
│     │  ├─ h3.pub__lead     → "Para quem quer investir."
│     │  └─ p.pub__body
│     └─ article.pub__panel.pub__panel--morar   (border-left: 1px solid var(--line)  ← hairline central)
│        ├─ span.pub__ghost aria-hidden="true"  → "morar"
│        ├─ h3.pub__lead     → "Para quem quer morar."
│        └─ p.pub__body
└─ aside.pub__honest         (full-width, fora do container; background: var(--bg-1);
   │                          border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
   │                          padding: clamp(44px,6vh,64px) var(--pad-x); margin-top: clamp(70px,9vh,100px))
   └─ div.pub__honest-inner  (max-width: 1240px; margin: 0 auto; display: grid;
      │                       grid-template-columns: clamp(120px,16vw,220px) 1fr; column-gap: clamp(20px,4vw,60px))
      ├─ span.pub__honest-mark aria-hidden="true"  (coluna 1, vazio de texto: hairline vertical decorativa)
      └─ div (coluna 2)
         ├─ h3.pub__honest-lead  → "Uma honestidade antes de você comprar."
         └─ p.pub__honest-body
```
Painéis: `padding: clamp(36px, 4.5vw, 64px) clamp(28px, 4vw, 56px) clamp(44px, 5vw, 72px); position: relative; overflow: hidden`. O painel esquerdo sem padding-left extra (alinha com o container); o direito espelha.

### Tipografia
| Elemento | Fonte | Peso | Tamanho | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| .pub__title | Fraunces | 450 | clamp(32px, 4.2vw, 60px) | 1.12 | -0.01em |
| .pub__ghost | Fraunces itálico | 620 | clamp(72px, 8.5vw, 128px) | 0.85 | -0.02em |
| .pub__lead | Fraunces | 600 | clamp(23px, 2.3vw, 32px) | 1.2 | -0.01em |
| .pub__body | DM Sans | 300 | clamp(15.5px, 1.25vw, 17.5px) | 1.7 | 0 |
| .pub__honest-lead | Fraunces itálico | 550 | clamp(22px, 2.2vw, 30px) | 1.25 | -0.01em |
| .pub__honest-body | DM Sans | 300 | clamp(15.5px, 1.25vw, 17.5px) | 1.7 | 0 |

`.pub__body` e `.pub__honest-body` com `max-width: 52ch`. `.pub__lead` com `margin: clamp(56px,6vw,84px) 0 14px` (o espaço acima acomoda o ghost). `.pub__honest-lead` com `margin-bottom: 12px`.

### Cores
- Fundo da seção: `var(--bg-0)` #071310. Faixa honest: `var(--bg-1)` #0B1B16.
- .pub__title: #F1EDE4. .pub__lead: #F1EDE4. .pub__body: #9FB3AB.
- .pub__ghost: `color: transparent; -webkit-text-stroke: 1.5px rgba(140,239,211,0.22)`.
- Color blocking discreto: painel investir `background: rgba(140,239,211,0.028)`; painel morar `background: rgba(22,168,142,0.05)`. Cada painel recebe um filete superior interno: `::before` com `content:""; position:absolute; top:0; left: clamp(28px,4vw,56px); width:56px; height:2px`; investir `background: var(--mint)` #8CEFD3; morar `background: var(--accent)` #16A88E.
- Hairline central: `1px solid rgba(241,237,228,0.13)`.
- .pub__honest-lead: #F1EDE4. .pub__honest-body: #9FB3AB. .pub__honest-mark: `width: 2px; height: 100%; background: var(--accent); justify-self: end` (ecoa a borda da nota dos 42% do hero).
- Estado hover (ver Interatividade): painel apagado `opacity: 0.45` + `filter: saturate(0.6)`.

### Elementos Visuais
- `.pub__ghost`: palavra em stroke posicionada `position:absolute; top: clamp(18px,2.5vw,30px); left: clamp(24px,3.5vw,48px); user-select:none; pointer-events:none; white-space:nowrap`, cortada pelo `overflow:hidden` do painel na borda direita quando exceder. É o mesmo dispositivo dos numerais 01/02/03 do mecanismo, aqui em palavra.
- Sem ícones, sem cards flutuantes, sem sombras nos painéis: a divisão é feita só por hairlines e blocos de cor a 3 a 5% de opacidade.
- Grain global do body cobre a seção; nenhum grain adicional.

### Animações
- Reveal de entrada: dentro de `@supports (animation-timeline: view())`, `.pub__panel { animation: rise linear both; animation-timeline: view(); animation-range: entry 0% entry 42%; }` e `.pub__honest-inner { animation: rise linear both; animation-timeline: view(); animation-range: entry 0% entry 50%; }`. Keyframe `rise` idêntico ao aprovado (opacity 0 + translateY(34px) → opacity 1 + translateY(0)).
- Fallback: sem suporte a view(), tudo visível estaticamente (nenhuma classe esconde conteúdo fora do @supports).
- `prefers-reduced-motion: reduce`: dentro do bloco já existente, adicionar `.pub__panel, .pub__honest-inner { animation: none; }` e `.pub__panel, .pub__panel::before { transition: none; }`.

### Interatividade
- Hover Reveal no split (somente ponteiros finos: envolver em `@media (hover: hover) and (pointer: fine)`):
  - `.pub__split:hover .pub__panel { opacity: 0.45; filter: saturate(0.6); }`
  - `.pub__split .pub__panel:hover { opacity: 1; filter: none; }`
  - Painel sob o cursor intensifica o bloco de cor: investir para `rgba(140,239,211,0.05)`, morar para `rgba(22,168,142,0.08)`.
  - Transições: `transition: opacity 0.35s ease, filter 0.35s ease, background 0.35s ease` em `.pub__panel`.
- Sem hover, sem clique e sem link em nenhum outro elemento da seção. Nenhum CTA aqui (a copy não prevê).
- Foco: não há elementos focáveis; nada a definir além do `:focus-visible` global.

### Responsividade
- **1060px:** `.pub__split { grid-template-columns: 1fr; }`; o painel morar troca `border-left` por `border-top: 1px solid var(--line)`; `.pub__ghost` cai para `font-size: clamp(64px, 11vw, 96px)`; `.pub__honest-inner { grid-template-columns: 1fr; row-gap: 16px; }` e `.pub__honest-mark` vira horizontal: `width: 56px; height: 2px; justify-self: start`.
- **680px:** padding dos painéis `28px 0 36px` (hairlines internas somem nas laterais, painéis alinham ao container); `.pub__ghost { font-size: 64px; top: 10px; left: 0; -webkit-text-stroke-color: rgba(140,239,211,0.14); }`; `.pub__lead { margin-top: 48px; font-size: 22px; }`; faixa honest com `padding: 40px var(--pad-x)`; Hover Reveal inerte (já excluído pela media query de hover).

---

## Seção 7: A Professora

### Arquétipo e Constraints
**Arquétipo:** Split Assimétrico com Overlap: coluna de retrato à esquerda sangrando a margem, headline do texto invadindo a foto.
**Constraints:** Imagem Dessaturada + Duotone verde (Mídia) + Bleed Left (Layout) + linha documental de carimbos para "Os meus números" (Tipografia/Estrutura, anti grid de stats).
**Justificativa:** o retrato tratado como documento de arquivo (dessaturado, duotone da paleta, grain global por cima) mantém a página no universo "papel e processo" em vez de "palestrante de palco". O overlap da headline sobre a foto cria a tensão assimétrica do sistema aprovado, e os números como carimbos em linha ecoam o `ficha__stamp` do hero, fechando a identidade.

### Conteúdo
H2: `Quem vai te ensinar`

Parágrafo 1: `Meu nome é Jacque Costa, e o que eu vou te ensinar no dia 23 é o que eu faço profissionalmente há mais de quinze anos, muito antes de existir palco.`

Parágrafo 2: `Sou perita judicial em imóveis, o que significa que, quando um processo precisa de um valor confiável para um bem, o laudo sai com a minha assinatura e eu respondo por ele diante do juiz. Sou também despachante credenciada da Caixa desde 2007, e a papelada de imóvel retomado passa pela minha mesa antes de virar anúncio, o que me deu quase vinte anos vendo por dentro o que o banco aceita e onde o processo costuma emperrar.`

Parágrafo 3: `Completo o quadro como corretora e administradora, com empresa própria construída no lado do mercado que não rende vitrine: balcão de cartório, prazo de juiz, vistoria de manhã cedo e acerto de dívida com condomínio. O nome Leilão & Prosa é literal, porque a noite funciona como uma conversa com documento aberto, onde a sua dúvida não precisa esperar o bloco de perguntas.`

Título da linha documental: `Os meus números`

Itens, texto exato:
1. `42%* de desconto médio nas compras que eu fechei em leilão, entre o valor de avaliação e o lance vencedor (metodologia no fim da página)`
2. `+2.400 alunos nas minhas formações [CONFIRMAR o que conta como aluno: matriculado, concluinte ou certificado]`
3. `5,0 no Google, em 39 avaliações do perfil Jacque Leilões, apurado em agosto de 2026`
4. `Desde 2007 credenciada da Caixa`
5. `Perita judicial, com laudo assinado dentro de processo`

Disclaimer visível: `O credenciamento é profissional e individual. A Caixa Econômica Federal não organiza, não patrocina e não endossa este evento.`

### Layout
```
section.prof                (padding: clamp(90px,13vh,150px) 0 clamp(80px,11vh,130px); overflow: clip)
└─ div.prof__inner          (max-width: 1240px; margin: 0 auto; padding: 0 var(--pad-x))
   ├─ div.prof__split       (display: grid; grid-template-columns: clamp(320px,38vw,500px) 1fr;
   │  │                      column-gap: clamp(36px,5vw,84px); align-items: start)
   │  ├─ figure.prof__media (grid-column: 1; margin-left: calc(-1 * var(--pad-x));  ← BLEED LEFT
   │  │  │                   position: relative; z-index: 1)
   │  │  └─ img src="/images/jacque-leilao.png" alt="Jacque Costa de perfil, com microfone headset, durante uma apresentação à noite"
   │  │      (display:block; width:100%; height:auto; aspect-ratio: 4/5; object-fit: cover)
   │  └─ div.prof__body     (grid-column: 2; position: relative; z-index: 2; padding-top: clamp(8px,2vh,24px))
   │     ├─ h2.prof__title  → "Quem vai te ensinar"
   │     │   (margin-left: calc(-1 * clamp(70px, 9vw, 160px));  ← OVERLAP sobre a foto
   │     │    margin-bottom: clamp(30px,4vh,44px))
   │     └─ p.prof__p  × 3  (margin-bottom: 1.35em; max-width: 62ch)
   ├─ div.prof__numeros     (margin-top: clamp(60px,8vh,96px); border-top: 1px solid var(--line);
   │  │                      border-bottom: 1px solid var(--line); display: flex; flex-wrap: wrap;
   │  │                      align-items: stretch)
   │  ├─ h3.prof__numeros-title → "Os meus números"
   │  │   (flex: 0 0 auto; align-self: center; padding: 22px clamp(24px,3vw,44px) 22px 0;
   │  │    border-right: 1px solid var(--line))
   │  └─ p.prof__stamp × 5  (flex: 1 1 200px; min-width: 200px; padding: 22px clamp(20px,2.4vw,36px);
   │      border-right: 1px solid var(--line); último sem border-right)
   │      dentro de cada um: <strong class="prof__stamp-num"> com o dado
   │      (42%*, +2.400, 5,0, Desde 2007, Perita judicial) e o restante do texto corrido
   └─ p.prof__disclaimer    (margin-top: 26px; max-width: 66ch)
```
No item 1, `42%*` renderiza como `<strong class="prof__stamp-num">42%<a class="stat__ast" href="#metodologia">*</a></strong>` (asterisco clicável, mesmo componente do hero). Os trechos `[CONFIRMAR ...]` renderizam em `<mark class="confirmar">` com o texto exato, colchetes inclusos.

### Tipografia
| Elemento | Fonte | Peso | Tamanho | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| .prof__title | Fraunces | 450 | clamp(32px, 4.2vw, 60px) | 1.12 | -0.01em |
| .prof__p | DM Sans | 300 | clamp(15.5px, 1.25vw, 17.5px) | 1.7 | 0 |
| .prof__numeros-title | Fraunces itálico | 550 | clamp(18px, 1.6vw, 22px) | 1.2 | -0.01em |
| .prof__stamp-num | Fraunces | 650 | clamp(26px, 2.4vw, 36px) | 1 | -0.02em |
| .prof__stamp (texto) | DM Sans | 300 | 13.5px | 1.55 | 0.01em |
| .prof__disclaimer | DM Sans itálico | 300 | 13px | 1.65 | 0.02em |
| mark.confirmar | DM Sans | 500 | 0.85em | herdado | 0.02em |

`.prof__stamp-num` em display block com `margin-bottom: 6px; font-variant-numeric: tabular-nums`. Em "Desde 2007" e "Perita judicial" o strong usa `font-size: clamp(20px, 1.8vw, 26px)` (texto, não numeral puro).

### Cores
- Fundo: `var(--bg-0)` #071310. Títulos: #F1EDE4. Parágrafos: #9FB3AB.
- Retrato, tratamento duotone verde:
  - `figure.prof__media { background: linear-gradient(165deg, #0E7A67 0%, #071310 80%); border-radius: 6px; overflow: hidden; box-shadow: 0 30px 70px rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.35); }`
  - `img { filter: saturate(0.45) contrast(1.06) brightness(1.05); object-position: 55% 50%; }` (sem mix-blend-mode e sem opacity: a foto nova já é noturna, e o blend luminosity achatava o bokeh do fundo)
  - `figure::after { content:""; position:absolute; inset:0; background: linear-gradient(to top, rgba(7,19,16,0.55) 0%, transparent 42%); pointer-events:none; }` (ancora a base da foto no fundo da página)
- .prof__numeros-title: #8CEFD3. .prof__stamp-num: #F1EDE4; o asterisco `a.stat__ast` em #16A88E, hover #8CEFD3. Texto dos stamps: #9FB3AB.
- Hairlines da linha documental: `rgba(241,237,228,0.13)`.
- .prof__disclaimer: `rgba(159,179,171,0.85)`.
- mark.confirmar: `background: rgba(140,239,211,0.12); color: #8CEFD3; padding: 2px 6px; border-radius: 4px;` (marcador de pendência, some na publicação junto com o colchete).

### Elementos Visuais
- O grain global do body já cobre o retrato (body::after é fixed por cima de tudo); nenhum noise extra na figura.
- Carimbos: os itens 2 e 4 da linha recebem `transform: rotate(-1.2deg)` e o item 3 `transform: rotate(0.8deg)` aplicados apenas ao `.prof__stamp-num` interno, nunca ao bloco, evocando carimbo sem quebrar o alinhamento das hairlines.
- Nenhum card, nenhuma caixa com fundo nos números: só hairlines verticais de 1px separando os itens, dentro das duas hairlines horizontais.
- A headline sobre a foto cria o overlap; garantir `text-shadow: 0 2px 24px rgba(7,19,16,0.65)` em `.prof__title` para legibilidade no trecho que cruza o retrato.

### Animações
- `@supports (animation-timeline: view())`:
  - `.prof__media { animation: rise linear both; animation-timeline: view(); animation-range: entry 0% entry 40%; }`
  - `.prof__body { animation: rise linear both; animation-timeline: view(); animation-range: entry 0% entry 48%; }`
  - `.prof__numeros { animation: rise linear both; animation-timeline: view(); animation-range: entry 0% entry 45%; }`
- Fallback: tudo visível sem o @supports. Reduced-motion: `animation: none` nos três seletores dentro do bloco `prefers-reduced-motion` existente.
- Sem contadores animados nos números (Counter Animation proibido pelo tom documental desta página).

### Interatividade
- Único elemento interativo: `a.stat__ast` (asterisco dos 42%), `href="#metodologia"`, cor #16A88E, hover #8CEFD3, `transition: color 0.25s ease`, foco pelo `:focus-visible` global (outline 2px #8CEFD3, offset 3px).
- Retrato sem hover, sem zoom, sem parallax de mouse.

### Responsividade
- **1060px:** `.prof__split { grid-template-columns: 1fr; row-gap: 40px; }`; a foto sobe para antes do texto (ordem natural do DOM já atende: figure primeiro); `figure.prof__media { margin-left: calc(-1 * var(--pad-x)); margin-right: clamp(40px, 12vw, 120px); max-width: 520px; }` (mantém o bleed esquerdo e a assimetria); `.prof__title { margin-left: 0; text-shadow: none; }` (overlap desligado); linha documental mantém flex-wrap, itens `flex: 1 1 45%`.
- **680px:** `figure.prof__media { margin-right: 0; max-width: none; aspect-ratio: 3/4; }`; `.prof__numeros { flex-direction: column; }`; `.prof__numeros-title { border-right: none; border-bottom: 1px solid var(--line); padding: 18px 0; width: 100%; }`; `.prof__stamp { border-right: none; border-bottom: 1px solid var(--line); padding: 16px 0; min-width: 0; }`; último item sem border-bottom; rotações dos carimbos mantidas; `.prof__stamp-num { font-size: 24px; }`.

---

## Seção 8: Prova Social

### Arquétipo e Constraints
**Arquétipo (para quando houver material):** Editorial em coluna única, falas como citações de revista com hairlines, e o print do Google como documento em moldura de papel (o mesmo material do `ficha` do hero).
**Constraints:** Container Narrow (Layout) + Mixed Type com atribuição em Fraunces itálico (Tipografia).
**Justificativa:** depoimento nesta página só sobrevive se parecer documento verificável, não vitrine; a coluna editorial estreita com atribuição serifada itálica trata cada fala como registro, e o print em papel rotacionado reaproveita o dispositivo documental já aprovado no hero. Foto circular com texto ao lado está proibida.

### Conteúdo
**Estado atual: SLOT RESERVADO, NÃO PUBLICÁVEL.** A seção não renderiza nenhum pixel. No build, existe apenas este comentário HTML no lugar dela, com o bloco de instrução da copy transcrito na íntegra:

```html
<!-- SEÇÃO 8 · PROVA SOCIAL · SLOT RESERVADO, NÃO RENDERIZAR SEM MATERIAL REAL.
[BLOCO A PREENCHER COM MATERIAL REAL. NÃO PUBLICAR ASSIM.] Aqui entram três ou quatro
falas curtas de quem esteve numa edição anterior, com nome, cidade e o resultado
concreto: arrematou, descartou um imóvel ruim a tempo ou leu um edital inteiro sem
ajuda. Não moldar as falas em três itens. Print de avaliação do Google vale mais que
texto digitado. É proibido inventar depoimento. A página inteira se sustenta em número
verificável, e uma fala fabricada derruba os 42%* junto. Se não houver material real
até a publicação, remover a seção inteira e reforçar o link do perfil do Google na
faixa de credibilidade.
-->
```

Regra de publicação: enquanto este comentário existir sem material real aprovado, a Seção 9 encosta diretamente na Seção 7. Nenhum placeholder visual, nenhum "em breve", nenhum depoimento de exemplo, nem em ambiente de homologação.

### Layout
Especificação para QUANDO houver material real (e somente então):
```
section.prova              (padding: clamp(90px,13vh,150px) var(--pad-x))
└─ div.prova__inner        (max-width: 820px; margin: 0 auto)   ← Container Narrow
   ├─ h2.prova__title      (headline a definir com o material real; entra na revisão de copy, nunca inventada aqui)
   ├─ figure.prova__fala × 3 ou 4   (sequência vertical; separadas por border-top: 1px solid var(--line);
   │  │                              padding: clamp(36px,5vh,56px) 0; sem grid, sem colunas múltiplas)
   │  ├─ blockquote > p.prova__quote   (a fala, texto real)
   │  └─ figcaption.prova__attr        (nome e cidade reais)
   └─ figure.prova__print   (print do Google como imagem)
       (background: var(--paper) #F1EDE4; padding: 14px; border-radius: 6px;
        transform: rotate(-1.4deg); box-shadow: 0 30px 70px rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.35);
        max-width: 560px; margin: clamp(44px,6vh,64px) auto 0)
       └─ img (display:block; width:100%; border-radius: 3px)
```
Quantidade de falas: 3 ou 4, nunca moldadas em grade de três colunas. PROIBIDO: foto circular do autor, avatar, estrelas decorativas desenhadas em CSS, carrossel.

### Tipografia
| Elemento | Fonte | Peso | Tamanho | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| .prova__title | Fraunces | 450 | clamp(32px, 4.2vw, 60px) | 1.12 | -0.01em |
| .prova__quote | Fraunces | 400 | clamp(20px, 2.2vw, 28px) | 1.45 | -0.005em |
| .prova__attr | Fraunces itálico | 550 | clamp(15px, 1.4vw, 17px) | 1.4 | 0.01em |

`.prova__attr` com `margin-top: 14px` e um traço tipográfico de 24px x 1px em `background: var(--accent)` como `::before` inline-block com `margin-right: 12px; vertical-align: middle` (assinatura, não bullet).

### Cores
- Fundo: `var(--bg-0)`. .prova__quote: #F1EDE4. .prova__attr: #8CEFD3. Hairlines: `rgba(241,237,228,0.13)`. Papel do print: #F1EDE4 com sombras exatas acima.

### Elementos Visuais
- Aspas de abertura em stroke antes da primeira fala: mesmo dispositivo do `.refrao::before` aprovado (`content: "\201C"`, Fraunces 650, `font-size: clamp(90px,10vw,150px)`, `line-height: 0.6`, `color: transparent`, `-webkit-text-stroke: 1.5px rgba(140,239,211,0.4)`), uma única vez na seção.
- O print entra como imagem estática dentro da moldura de papel; nada de iframe ou embed do Google.

### Animações
- Quando existir: `@supports (animation-timeline: view())` com `.prova__fala, .prova__print { animation: rise linear both; animation-timeline: view(); animation-range: entry 0% entry 45%; }`. Fallback visível, reduced-motion desliga.

### Interatividade
- Opcional e único: o print pode ser um link `<a>` para o perfil Jacque Leilões no Google (mesmo destino do link da faixa de credibilidade), com `:hover { transform: rotate(-1.4deg) translateY(-4px); }` e `transition: transform 0.3s ease`. Nenhuma outra interação.

### Responsividade
- **1060px:** sem mudança estrutural (coluna única já cabe).
- **680px:** `.prova__quote { font-size: 19px; }`; `.prova__print { transform: none; max-width: 100%; }`; aspas de abertura em `font-size: 72px; line-height: 0.8`.

---

## Seção 9: A Noite, Hora a Hora

### Arquétipo e Constraints
**Arquétipo:** Timeline vertical com linha, nós e horas à esquerda.
**Constraints:** Scroll Progress na linha via animation-timeline (Movimento) + horas em Fraunces com numerais tabulares como protagonista tipográfico (Tipografia) + bloco das 21h10 em banda `--bg-1` (Cor, tratamento honesto sem tom de alerta).
**Justificativa:** a programação é o argumento de transparência da página, e a timeline que se desenha conforme o leitor desce transforma "programação pública de ponta a ponta" em experiência física de percorrer a noite. O destaque do pitch em banda escura elevada, com a mesma paleta de todo o resto, declara o bloco comercial sem criminalizá-lo.

### Conteúdo
H2: `A noite, hora a hora`

Intro: `A programação é pública de ponta a ponta, incluindo os trinta minutos em que eu apresento o Clube do Leilão, para você saber exatamente o que está comprando.`

Itens da timeline, texto exato:
- `19h` · `Credenciamento, na sala`
- `19h30` · `Abertura do Leilão & Prosa`
- `20h` · `Palestra comigo: edital, cartório e planilha na tela`
- `21h` · `Perguntas e respostas: microfone na sala, chat no online`
- `21h10` · `Apresentação do Clube do Leilão, Imóveis: trinta minutos meus para mostrar como continuar comigo depois da noite, com hora marcada e sem surpresa`
- `21h40` · `Networking entre os participantes, só na sala`
- `22h` · `Encerramento`

Janela do online: `A transmissão ao vivo cobre das 19h30 às 21h40.`

Título do endereço: `Onde`
Endereço: `Okay Hub de Negócios e Coworking · Rua Castelo de Alcázar, 125 · Bairro Castelo · Belo Horizonte/MG · CEP 31330-310`

### Layout
```
section.agenda             (padding: clamp(90px,13vh,150px) var(--pad-x) clamp(80px,11vh,130px);
│                           background: var(--bg-0))
└─ div.agenda__inner       (max-width: 940px; margin: 0 auto)
   ├─ h2.agenda__title     (margin-bottom: 18px)
   ├─ p.agenda__intro      (max-width: 62ch; margin-bottom: clamp(50px,7vh,80px))
   ├─ ol.tl                (list-style: none; position: relative; padding: 0)
   │  │  linha trilho:  .tl::before { content:""; position:absolute; top:8px; bottom:8px;
   │  │                  left: calc(clamp(84px,10vw,132px) + 11px); width:1px; background: var(--line); }
   │  │  linha progresso: .tl::after  { mesma posição/dimensões; background: var(--accent);
   │  │                  transform-origin: top; transform: scaleY(1);  ← fallback já desenhada }
   │  └─ li.tl__item × 7   (display: grid; grid-template-columns: clamp(84px,10vw,132px) 24px 1fr;
   │      │                 column-gap: clamp(16px,2.5vw,28px); padding: clamp(20px,3vh,30px) 0;
   │      │                 align-items: start)
   │      ├─ span.tl__hora     (coluna 1; text-align: right)
   │      ├─ span.tl__node aria-hidden="true"
   │      │    (coluna 2; width:9px; height:9px; border-radius:50%; margin-top: 0.55em;
   │      │     justify-self: center; background: var(--bg-0); border: 1px solid var(--line-strong);
   │      │     position: relative; z-index: 2)
   │      └─ p.tl__desc        (coluna 3; max-width: 58ch)
   │      · item 5 (21h10) recebe classe .tl__item--pitch:
   │        background: var(--bg-1); border: 1px solid var(--line); border-radius: 6px;
   │        margin: 8px calc(-1 * clamp(18px,2.5vw,28px));
   │        padding: clamp(20px,3vh,30px) clamp(18px,2.5vw,28px);
   │        (a linha vertical atravessa por trás; o nó fica sólido: background: var(--accent),
   │         border-color: var(--accent))
   ├─ p.agenda__confirmar  (margin-top: 22px)  → todo o texto dentro de mark.confirmar (spec da Seção 7)
   ├─ p.agenda__online     (margin-top: 18px; padding-left: 18px; border-left: 2px solid var(--accent))
   └─ div.agenda__onde     (margin-top: clamp(44px,6vh,64px); border-top: 1px solid var(--line);
      │                     padding-top: 26px; display: grid;
      │                     grid-template-columns: clamp(84px,10vw,132px) 1fr; column-gap: clamp(40px,5vw,52px))
      ├─ h3.agenda__onde-title → "Onde"   (coluna 1; text-align: right)
      └─ p.agenda__endereco     (coluna 2)
```

### Tipografia
| Elemento | Fonte | Peso | Tamanho | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| .agenda__title | Fraunces | 450 | clamp(32px, 4.2vw, 60px) | 1.12 | -0.01em |
| .agenda__intro | DM Sans | 300 | clamp(15.5px, 1.25vw, 17.5px) | 1.7 | 0 |
| .tl__hora | Fraunces | 650 | clamp(22px, 2.6vw, 34px) | 1.1 | -0.02em |
| .tl__desc | DM Sans | 300 | clamp(15.5px, 1.25vw, 17.5px) | 1.65 | 0 |
| .tl__item--pitch .tl__desc | DM Sans | 400 | clamp(15.5px, 1.25vw, 17.5px) | 1.65 | 0 |
| .agenda__confirmar | DM Sans | 500 | 13px | 1.5 | 0.02em |
| .agenda__online | DM Sans | 400 | clamp(14.5px, 1.15vw, 16px) | 1.65 | 0.01em |
| .agenda__onde-title | Fraunces itálico | 550 | clamp(18px, 1.6vw, 22px) | 1.2 | -0.01em |
| .agenda__endereco | DM Sans | 400 | clamp(15px, 1.2vw, 17px) | 1.7 | 0.01em |

`.tl__hora` com `font-variant-numeric: tabular-nums` obrigatório (alinhamento vertical perfeito de 19h a 22h).

### Cores
- Fundo da seção: #071310. Título e horas: #F1EDE4. Hora do item pitch: #8CEFD3. Descrições: #9FB3AB; no item pitch: #F1EDE4.
- Trilho da linha: `rgba(241,237,228,0.13)`. Linha de progresso: #16A88E.
- Nós: fundo #071310, borda `rgba(241,237,228,0.25)`. Nó do pitch: fundo #16A88E, borda #16A88E.
- Banda do pitch: fundo #0B1B16, borda `rgba(241,237,228,0.13)`, raio 6px. Sem vermelho, sem âmbar, sem ícone de aviso: é programação, não alerta.
- .agenda__online: texto #F1EDE4, borda esquerda #16A88E (mesmo dispositivo da nota dos 42%).
- .agenda__onde-title: #8CEFD3. .agenda__endereco: #F1EDE4, com os pontos médios `·` em #16A88E via `<span class="dot">` (font-weight 700), igual ao padrão da faixa de credibilidade.
- mark.confirmar: mesma spec da Seção 7 (`background rgba(140,239,211,0.12); color #8CEFD3`).

### Elementos Visuais
- A linha vertical é o único ornamento: dois pseudo-elementos sobrepostos (trilho + progresso) de 1px, atravessando os 7 itens, inclusive por trás da banda do pitch (a banda tem `position: relative; z-index: 1`; a linha fica em z-index 0; o nó em z-index 2 por cima).
- Nós de 9px alinhados oticamente à primeira linha de texto (`margin-top: 0.55em`).
- Nenhum número gigante em stroke nesta seção (a tipografia das horas já é o protagonista; não competir com o dispositivo das seções vizinhas).

### Animações
- Scroll Progress da linha, dentro de `@supports (animation-timeline: view())`:
  ```css
  .tl::after {
    transform: scaleY(0);
    animation: draw-line linear both;
    animation-timeline: view();
    animation-range: entry 15% exit 80%;
  }
  @keyframes draw-line {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  ```
  (O `transform: scaleY(0)` inicial vive DENTRO do bloco @supports; fora dele a regra base mantém `scaleY(1)` e a linha aparece inteira. Fallback garantido por construção.)
- Reveal dos itens: `@supports (animation-timeline: view()) { .tl__item { animation: rise linear both; animation-timeline: view(); animation-range: entry 0% entry 40%; } }`, keyframe `rise` aprovado. O stagger é natural: cada item entra quando cruza a viewport.
- `prefers-reduced-motion: reduce`: `.tl::after { animation: none; transform: scaleY(1); }` e `.tl__item { animation: none; }` dentro do bloco reduced-motion existente.

### Interatividade
- Único elemento interativo: nenhum por padrão. Se a produção pedir mapa, o endereço pode virar link externo para o Google Maps com `target="_blank" rel="noopener"`, cor #8CEFD3, sublinhado 1px com `text-underline-offset: 3px`, hover sem sublinhado; decisão fora desta spec, o padrão é texto puro.
- Sem hover nos itens da timeline, sem tooltip, sem accordion.

### Responsividade
- **1060px:** `.agenda__inner { max-width: 760px; }`; colunas da timeline: `grid-template-columns: clamp(64px,9vw,96px) 20px 1fr`; linha em `left: calc(clamp(64px,9vw,96px) + 9px)`; `.tl__hora { font-size: clamp(20px,2.6vw,26px); }`.
- **680px:** colunas: `grid-template-columns: 56px 16px 1fr; column-gap: 12px`; linha em `left: 63px; width: 1px`; `.tl__hora { font-size: 18px; }`; banda do pitch: `margin: 8px -12px; padding: 18px 12px;`; `.agenda__onde { grid-template-columns: 1fr; row-gap: 8px; }` e `.agenda__onde-title { text-align: left; }`; `.tl__desc` sem max-width (ocupa a coluna inteira); `.agenda__endereco` pode quebrar os segmentos em linhas (os `·` permanecem no texto, exatamente como na copy).

---

## Seção 10: A Oferta

### Arquétipo e Constraints

**Arquétipo:** Floating Cards (Baseados em Camadas), tratados como ingressos físicos sobre a mesa.
**Constraints:** duas materialidades papel/dark (Cor: Selective Color + Inverted Colors dentro da mesma seção), Hover Lift discreto de 4px com aprofundamento de sombra (Interação), perfuração/serrilha de canhoto de ingresso via radial-gradient (Efeitos Especiais/Elemento Visual), tabela documental com hairlines (Tipografia: Monospace-like documental via tabular-nums).
**Justificativa:** a decisão de compra da página inteira acontece aqui, e a metáfora do ingresso físico materializa a diferença real entre os dois produtos: a cadeira existe no mundo físico, por isso vira papel #F1EDE4 com serrilha e rotação; a transmissão é imaterial, por isso vira dark com contorno. A tabela de lotes em tratamento de documento, e não de pricing SaaS, mantém a página no registro documental aprovado no hero e na ficha.

### Conteúdo

Todos os textos exatos da copy.md, seção 10, nesta ordem:

**H2:** `Escolha como você vai aprender: na sala ou ao vivo`

**Parágrafo de abertura:**
`A aula é a mesma nos dois ingressos, com o mesmo edital projetado e a mesma planilha rodando, e o que muda é o que acontece em volta dela: a sala acrescenta o intervalo no corredor, o networking e a conversa comigo fora do palco.`

**Card 1 (papel):**
- Título: `PRESENCIAL · Okay Hub, Belo Horizonte`
- Linha de valor: `Valor conforme o lote vigente, na tabela de lotes logo abaixo.`
- Label: `Para quem é` + parágrafo: `Para quem consegue estar no Bairro Castelo numa quarta à noite e quer levar da noite o que a transmissão não carrega: a pergunta feita de perto e contatos novos salvos no celular antes de ir embora.`
- Label: `Inclui` + 5 itens: `Sua cadeira na sala do Okay Hub, com credenciamento e café a partir das 19h` / `O edital projetado e a planilha rodando ao vivo, na sua frente` / `Microfone aberto no bloco de perguntas, das 21h às 21h10` / `Networking das 21h40 às 22h, comigo e com os apoiadores` / `O corredor do intervalo, onde os melhores contatos da noite costumam aparecer`
- Label: `Não inclui` + 4 itens: `Estacionamento no prédio` / `Gravação ou replay, que não existem para ninguém em nenhum formato` / `Acesso à transmissão online` / `Análise individual do seu imóvel ou de um edital específico`
- Botão: `Garantir minha vaga presencial`

**Card 2 (dark):**
- Título: `ONLINE · Transmissão ao vivo`
- Linha de valor: `Valor conforme o lote vigente, na tabela de lotes logo abaixo.`
- Label: `Para quem é` + parágrafo: `Para quem está em outra cidade ou prefere um primeiro encontro comigo sem sair de casa, com o caderno do lado e a mesma aula na tela.`
- Label: `Inclui` + 5 itens: `Transmissão ao vivo das 19h30 às 21h40, sendo 1h40 de conteúdo e 30 minutos de apresentação comercial declarada na programação` / `O mesmo edital e a mesma planilha, projetados na sua tela` / `Perguntas pelo chat, lidas por mim no bloco das 21h [CONFIRMAR com a produção]` / `Link individual de acesso, enviado por e-mail e WhatsApp no dia 23 [CONFIRMAR horário do envio]` / `Funciona no celular e no computador`
- Label: `Não inclui` + 3 itens: `Replay, porque a transmissão não fica gravada para ninguém` / `O networking e a conversa de corredor` / `Credenciamento e café`
- Botão: `Assistir à transmissão ao vivo`

**Bloco da cadeira, H3:** `Por que a cadeira custa mais`
Parágrafo: `Cadeira é o único item desta página com estoque: a sala existe, tem paredes e um número finito de lugares [CONFIRMAR capacidade]. A transmissão não esbarra em parede nenhuma, e por isso custa bem menos. O método vai inteiro para os dois formatos; as pessoas, só para a sala.`

**Tabela de lotes, H3:** `Os preços sobem em data marcada: 12 e 21 de agosto`
Cabeçalho: `Lote` · `Período` · `Presencial` · `Online`
Linhas: `Lote 1 / até 11/08 / R$ 157 / R$ 67`, `Lote 2 / de 12/08 a 20/08 / R$ 187 / R$ 87`, `Lote 3 / a partir de 21/08 / R$ 217 / R$ 97`

**Parágrafos legais:**
`O presencial acaba quando as cadeiras acabam, enquanto o online não tem limite de lugares e sobe de preço nas mesmas datas. Se a virada de lote atrasar, vale o que estiver publicado: ninguém paga mais do que a página anuncia.`
`O ingresso é pessoal e intransferível nos dois formatos, e a Sympla permite editar o participante uma única vez, até 24 horas antes do evento. O cancelamento com devolução integral é aceito em até 7 dias corridos da compra, desde que o pedido chegue até 48 horas antes do evento, conforme a política publicada na Sympla e o artigo 49 do Código de Defesa do Consumidor.`

**CTA duplo da oferta:** `Garantir minha vaga presencial` (cheio) · `Assistir à transmissão ao vivo` (contorno)

Nenhum botão carrega preço. Os preços aparecem exclusivamente nas células da tabela de lotes.

### Layout

```
<section class="oferta" id="ingressos">
  <header class="oferta__head">
    <h2 class="oferta__title">
    <p class="oferta__lead">
  </header>
  <div class="oferta__cards">
    <div class="ticket-wrap">          <!-- alvo da animação de scroll -->
      <article class="ticket ticket--paper">
        <span class="ticket__stub" aria-hidden="true">L&P<i>23.09</i></span>
        <h3 class="ticket__title"><span class="ticket__mode">PRESENCIAL</span> <span class="ticket__place">· Okay Hub, Belo Horizonte</span></h3>
        <p class="ticket__lote">
        <p class="ticket__label">Para quem é</p>
        <p class="ticket__who">
        <p class="ticket__label">Inclui</p>
        <ul class="ticket__list">5 <li></ul>
        <p class="ticket__label">Não inclui</p>
        <ul class="ticket__list ticket__list--out">4 <li></ul>
        <button type="button" class="btn btn--fill ticket__btn" data-modalidade="presencial">
      </article>
    </div>
    <div class="ticket-wrap">
      <article class="ticket ticket--dark"> (mesma estrutura, 3 itens no não inclui,
        botão .btn--ghost, data-modalidade="online")
      </article>
    </div>
  </div>
  <div class="oferta__cadeira">
    <h3 class="oferta__h3">Por que a cadeira custa mais</h3>
    <p class="oferta__cadeira-txt">
  </div>
  <div class="lotes" id="lotes">
    <h3 class="oferta__h3 lotes__h3">Os preços sobem em data marcada: 12 e 21 de agosto</h3>
    <div class="lotes__scroll">
      <table class="lotes__table"> thead + 3 <tr> </table>
    </div>
    <p class="lotes__nota">   <!-- parágrafo "O presencial acaba..." -->
    <p class="lotes__legal">  <!-- parágrafo "O ingresso é pessoal e intransferível..." -->
  </div>
  <div class="oferta__ctas">
    <button type="button" class="btn btn--fill" data-modalidade="presencial">
    <button type="button" class="btn btn--ghost" data-modalidade="online">
  </div>
</section>
```

Valores exatos:
- `.oferta`: `padding: clamp(90px, 13vh, 150px) var(--pad-x) clamp(80px, 11vh, 130px); max-width: calc(var(--w-page) + 2 * 56px); margin: 0 auto; border-top: 1px solid var(--line);`
- `.oferta__head`: `max-width: 880px; margin-bottom: clamp(46px, 6vh, 72px);` H2 e lead empilhados, lead com `margin-top: 20px; max-width: 62ch;`
- `.oferta__cards`: `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(24px, 3.2vw, 48px); align-items: start; max-width: 1080px; margin: 0 auto clamp(70px, 9vh, 110px);`
- `.ticket`: `position: relative; border-radius: 6px; padding: 34px 34px 36px calc(64px + 28px);` (64px é a largura do canhoto). `.ticket--paper`: `transform: rotate(-1deg);` `.ticket--dark`: `transform: none;`
- `.ticket__stub`: `position: absolute; top: 0; left: 0; bottom: 0; width: 64px; display: grid; place-content: center; writing-mode: vertical-rl; transform: rotate(180deg);` conteúdo idêntico ao carimbo da ficha aprovada (`L&P` + `23.09`).
- Serrilha do canhoto (em cada `.ticket`, via `.ticket__stub::after`): `content: ""; position: absolute; top: 10px; bottom: 10px; right: 0; width: 0; border-right: 1.5px dashed;` mais a coluna de furos via `.ticket::before`: `content: ""; position: absolute; top: 12px; bottom: 12px; left: 60px; width: 8px; background-image: radial-gradient(circle at 4px 9px, var(--bg-0) 3px, transparent 3.5px); background-size: 8px 18px; background-repeat: repeat-y; pointer-events: none;` e dois recortes de meia-lua nas pontas da serrilha via `.ticket::after`: `content: ""; position: absolute; left: 57px; top: -7px; width: 14px; height: 14px; border-radius: 50%; background: var(--bg-0);` duplicado na base com `box-shadow: 0 [altura-do-card] 0 var(--bg-0)` substituído na prática por um segundo pseudo-elemento no `.ticket-wrap::after` com `bottom: -7px; left: 57px; width: 14px; height: 14px; border-radius: 50%; background: var(--bg-0); position: absolute; z-index: 2;` (o `.ticket-wrap` recebe `position: relative`).
- `.ticket__title`: `margin: 4px 0 6px;` `.ticket__lote`: `margin-bottom: 24px; padding-bottom: 18px; border-bottom: 1px dashed;`
- `.ticket__label`: `margin: 22px 0 8px;` `.ticket__who`: `max-width: 52ch;`
- `.ticket__list`: `list-style: none;` cada `li`: `padding: 9px 0; border-top: 1px dashed; font-size: 14.5px; line-height: 1.55;` último `li` com `border-bottom: 1px dashed;`
- `.ticket__btn`: `display: block; width: 100%; margin-top: 28px;`
- `.oferta__cadeira`: `display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); gap: clamp(24px, 4vw, 64px); max-width: 1080px; margin: 0 auto clamp(60px, 8vh, 96px); padding-top: clamp(40px, 6vh, 64px); border-top: 1px solid var(--line); align-items: start;` título na coluna 1, parágrafo na coluna 2 com `max-width: 58ch;`
- `.lotes`: `max-width: 880px; margin: 0 auto clamp(56px, 8vh, 88px);` `.lotes__h3`: `margin-bottom: 28px;`
- `.lotes__scroll`: `overflow-x: auto;` `.lotes__table`: `width: 100%; min-width: 520px; border-collapse: collapse;`
- Células: `th` e `td` com `text-align: left; padding: 16px 18px 16px 0;` colunas 3 e 4 (valores) com `text-align: right; padding-right: 0; padding-left: 18px;` Cada `tr` do corpo com `border-top: 1px solid var(--line);` última linha com `border-bottom: 1px solid var(--line);` Sem zebra, sem coluna destacada, sem badge.
- Linha vigente: classe `.is-vigente` aplicada por JS conforme a data do sistema (até 11/08 inclusive: linha 1; de 12/08 a 20/08: linha 2; de 21/08 em diante: linha 3), com `aria-current="true"`. Sem JS, nenhuma linha é destacada e a tabela permanece correta.
- `.lotes__nota`: `margin-top: 24px; max-width: 68ch;` `.lotes__legal`: `margin-top: 14px; max-width: 68ch;`
- `.oferta__ctas`: `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; max-width: 660px; margin: 0 auto;` botões idênticos em altura, padding, tipografia e raio aos do hero.

### Tipografia

- `.oferta__title`: Fraunces, weight 450, `font-size: clamp(32px, 4.2vw, 60px); line-height: 1.12; letter-spacing: -0.01em;` A palavra `aprender` dentro do H2 em `<em>` itálico weight 650 (mesmo tratamento do título do mecanismo).
- `.oferta__lead`: DM Sans, weight 300, `font-size: clamp(15.5px, 1.25vw, 17.5px); line-height: 1.7;`
- `.ticket__mode`: Fraunces, weight 600, `font-size: clamp(24px, 2.3vw, 31px); line-height: 1.1; letter-spacing: 0.01em; display: block;`
- `.ticket__place`: DM Sans, weight 500, `font-size: 13.5px; letter-spacing: 0.04em; display: block; margin-top: 6px;`
- `.ticket__lote`: DM Sans, weight 500, `font-size: 13.5px; line-height: 1.55;`
- `.ticket__label`: DM Sans, weight 700, `font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;`
- `.ticket__who`: DM Sans, weight 400 no papel e 300 no dark, `font-size: 14.5px; line-height: 1.65;`
- `.ticket__list li`: DM Sans, weight 400 no papel e 300 no dark, `font-size: 14.5px; line-height: 1.55;`
- `.ticket__stub`: Fraunces, weight 600, `font-size: 14px; line-height: 1;` o `<i>` interno em DM Sans, weight 700, `font-size: 9px; letter-spacing: 0.12em; font-style: normal; margin-top: 4px;`
- `.oferta__h3`: Fraunces, weight 550, `font-size: clamp(24px, 2.6vw, 36px); line-height: 1.18; letter-spacing: -0.01em;`
- `.oferta__cadeira-txt`, `.lotes__nota`: DM Sans, weight 300, `font-size: clamp(15.5px, 1.25vw, 17.5px); line-height: 1.7;`
- Tabela de lotes: `th` em DM Sans, weight 700, `font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;` Células `Lote N` em DM Sans weight 500 `font-size: 14.5px;` células de período em DM Sans weight 300 `font-size: 14.5px;` células de valor em Fraunces, weight 550, `font-size: clamp(19px, 1.8vw, 24px); letter-spacing: -0.01em; font-variant-numeric: tabular-nums;`
- `.lotes__legal`: DM Sans, weight 300, `font-size: 13px; line-height: 1.65;`
- Botões: DM Sans, weight 500, `font-size: 15.5px; letter-spacing: 0.01em;` (idêntico ao hero).
- Mobile 680px: `.ticket__mode` 22px; valores da tabela 18px; `.oferta__h3` clamp já cobre.

### Cores

- Seção sobre `var(--bg-0)` #071310.
- `.oferta__title`: #F1EDE4; `em` em #8CEFD3. `.oferta__lead`: #9FB3AB.
- `.ticket--paper`: fundo #F1EDE4, texto #0E211C, sombra `0 30px 70px rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.35)`. Serrilha dashed `rgba(14,33,28,0.25)`; furos `var(--bg-0)` #071310; hairlines internas dashed `rgba(14,33,28,0.2)`; `.ticket__label` em `rgba(14,33,28,0.65)`; `.ticket__lote` em #0E7A67; `.ticket__place` em `rgba(14,33,28,0.7)`; `.ticket__stub` texto #0E7A67 com serrilha própria; lista `Não inclui` com `color: rgba(14,33,28,0.58)`.
- `.ticket--dark`: fundo #0B1B16, `border: 1px solid rgba(241,237,228,0.25)`, texto #F1EDE4, sombra `0 20px 50px rgba(0,0,0,0.4)`. Serrilha dashed `rgba(241,237,228,0.2)`; furos #071310; hairlines dashed `rgba(241,237,228,0.13)`; `.ticket__label` em #9FB3AB; `.ticket__lote` em #8CEFD3; `.ticket__place` em #9FB3AB; `.ticket__stub` texto `rgba(140,239,211,0.75)`; corpo das listas em #9FB3AB; `Não inclui` em `rgba(159,179,171,0.6)`.
- Botão cheio: fundo #16A88E, texto #04110D, hover #2FD4AF, sombra `0 4px 18px rgba(0,0,0,0.35)` (no papel: `0 4px 18px rgba(14,33,28,0.25)`). Botão contorno: `border: 1px solid rgba(241,237,228,0.25)`, texto #F1EDE4, hover borda e texto #8CEFD3 com preenchimento `rgba(140,239,211,0.1)`.
- `.oferta__h3`: #F1EDE4. Parágrafos: #9FB3AB. `[CONFIRMAR ...]`: mesmos estilos do texto corrente, sem cor especial (marcador de produção, não elemento de design).
- Tabela: `th` em `rgba(159,179,171,0.85)`; `Lote N` em #F1EDE4; períodos em #9FB3AB; valores em #F1EDE4; hairlines `rgba(241,237,228,0.13)`. Linha `.is-vigente`: `background: rgba(140,239,211,0.045); box-shadow: inset 2px 0 0 #16A88E;` valores da linha vigente em #8CEFD3. Nada mais.
- `.lotes__legal`: `rgba(159,179,171,0.85)`.
- Focus visible em qualquer botão: `outline: 2px solid #8CEFD3; outline-offset: 3px;`

### Elementos Visuais

- Serrilha de canhoto nos dois cards: coluna de furos circulares de 6px de diâmetro (radial-gradient de 3px de raio, passo vertical de 18px) na cor exata do fundo da página (#071310), simulando perfuração; linha dashed de 1.5px acompanhando; recortes de meia-lua de 14px nas duas extremidades da linha de perfuração, também em #071310.
- Carimbo vertical `L&P 23.09` no canhoto, rotacionado 180deg em writing-mode vertical, ecoando o carimbo circular da ficha do hero.
- Hairlines dashed internas nos cards, herdadas da linguagem da ficha (`border-top: 1px dashed`).
- Hairline sólida de 1px `var(--line)` abrindo a seção, o bloco da cadeira e cada linha da tabela.
- Nenhum ícone, nenhum checkmark, nenhum badge de lote, nenhuma coluna destacada.

### Animações

- Reveal de scroll nos `.ticket-wrap`, no `.oferta__cadeira`, no `.lotes` e no `.oferta__ctas`, somente dentro de `@supports (animation-timeline: view())`: `animation: rise linear both; animation-timeline: view(); animation-range: entry 0% entry 42%;` usando o keyframe `rise` já existente (opacity 0 + translateY(34px) até opacity 1). O segundo `.ticket-wrap` usa `animation-range: entry 0% entry 50%` para leve escalonamento natural.
- A rotação de -1deg vive no `.ticket` interno e a animação no `.ticket-wrap` externo, sem conflito de transform.
- Fallback: fora do `@supports`, tudo visível estaticamente.
- `prefers-reduced-motion: reduce`: `animation: none` em todos os alvos acima e `transition: none` nos tickets e botões.

### Interatividade

- Hover Lift nos cards: `.ticket { transition: transform 0.3s ease, box-shadow 0.3s ease; }` `.ticket--paper:hover { transform: rotate(-1deg) translateY(-4px); box-shadow: 0 38px 80px rgba(0,0,0,0.55), 0 6px 18px rgba(0,0,0,0.4); }` `.ticket--dark:hover { transform: translateY(-4px); box-shadow: 0 28px 62px rgba(0,0,0,0.48); border-color: rgba(241,237,228,0.35); }` Sem scale, sem glow.
- Botões: cheio com hover `background #2FD4AF` (transition 0.25s ease); contorno com Hover Fill subindo de baixo via `::before` com `transform: scaleY(0)` para `scaleY(1)` em `0.32s cubic-bezier(0.22, 1, 0.36, 1)`, borda e texto indo a #8CEFD3.
- Clique em qualquer botão da seção abre o modal de captura (seção 13) com o campo oculto `modalidade` preenchido a partir de `data-modalidade`.
- Foco por teclado: `:focus-visible` padrão do sistema (outline 2px #8CEFD3, offset 3px).
- A tabela não tem hover de linha: documento, não interface.

### Responsividade

**1060px:**
- `.oferta__cards`: `grid-template-columns: 1fr; max-width: 560px; gap: 40px;` `.ticket--paper` mantém `rotate(-1deg)`.
- `.oferta__cadeira`: `grid-template-columns: 1fr; gap: 16px;`
- Restante inalterado.

**680px:**
- `.ticket`: `padding: 28px 22px 30px calc(48px + 20px);` canhoto reduz para `width: 48px`; furos deslocam para `left: 44px`; meias-luas para `left: 41px`; carimbo interno reduz para `font-size: 12px`.
- `.ticket--paper`: `transform: none;` (mesma regra do demo aprovado para a ficha).
- `.ticket__mode`: `font-size: 22px;`
- `.lotes__scroll` ganha scroll horizontal (`min-width: 520px` na tabela preservado); células com `padding: 13px 14px 13px 0;` valores em `font-size: 18px;`
- `.oferta__ctas`: `grid-template-columns: 1fr;` presencial em cima, largura total; `.btn { padding: 18px 16px; }`

---

## Seção 11: FAQ

### Arquétipo e Constraints

**Arquétipo:** Índice de Edital (variação documental de Accordion dentro de Container Narrow), o FAQ como sumário numerado de documento oficial.
**Constraints:** numeração tipográfica documental 01. a 14. em Fraunces (Tipografia), Hover Fill sutil no item (Interação), animação de abertura com grid-template-rows (Movimento).
**Justificativa:** a página inteira ensina a ler um documento de dezenas de páginas, então o próprio FAQ vira um índice de edital: numerado, com hairlines, sem chevrons de interface genérica. O sinal + que rotaciona para x mantém o vocabulário de precisão documental e o details/summary nativo garante acessibilidade e funcionamento sem JS.

### Conteúdo

**H2:** `FAQ`

As 14 entradas, com pergunta e resposta exatas da copy:

**01.** `"Leilão de imóvel é legalizado? Isso não tem cara de golpe?"`
`Leilão de imóvel é uma venda pública prevista em lei, conduzida por leiloeiro oficial ou dentro de um processo na Justiça, sempre com edital publicado e regra escrita. O que circula de sobra na internet é anúncio falso imitando leilão, e a defesa contra isso é a mesma habilidade que eu ensino a noite inteira: ler o documento e conferir quem está vendendo antes de qualquer pagamento. O risco real está em outro lugar, que é comprar sem ler.`

**02.** `"Dívida, processo, morador dentro: e quando o imóvel vem com tudo isso?"`
`Cada um desses problemas tem preço e endereço, e a noite ensina a encontrar os dois: a dívida aparece no edital, o direito de terceiro aparece na certidão do cartório, e a ocupação tem custo e prazo que dá para estimar antes do lance. Quando alguma dessas respostas não aparece em lugar nenhum, você também vai saber o que fazer, porque imóvel sem resposta é imóvel descartado. A análise serve para pendurar no risco uma etiqueta de preço antes de o lance sair da sua mão.`

**03.** `"Nunca dei um lance na vida. Vou conseguir acompanhar?"`
`Sim, e você é exatamente o público para quem eu desenhei a noite: nenhum termo de cartório entra sem tradução na mesma respiração, nenhuma etapa supõe experiência anterior, e o ritmo é o de quem está vendo um edital pela primeira vez. Quem já arremata também sai com lição, porque é na conta dos custos que a experiência mais escorrega.`

**04.** `"Quero comprar para morar, não para investir. Serve?"`
`Serve, e você vai estar bem acompanhado, porque quem busca a casa própria é metade da minha sala. O edital que você precisa aprender a ler é o mesmo do investidor, e muda apenas o destino do desconto: ele transforma a folga em margem de revenda, enquanto você a transforma em endereço melhor e prestação menor.`

**05.** `"De quanto dinheiro eu preciso para começar?"`
`Existem imóveis em leilão em faixas de preço muito diferentes, e uma parte deles aceita financiamento, o que muda completamente a resposta para quem tem renda estável sem ter o valor guardado. Por isso o dia 23 não te dá um número mágico e sim o mapa completo de custos, para você mesmo calcular o teto que cabe no seu bolso antes que um anúncio bonito decida por você.`

**06.** `"Qual o prazo para pagar depois do lance? Dá para financiar?"`
`O prazo vem escrito no edital de cada leilão e costuma ser contado em dias, o que torna o planejamento do pagamento parte da própria decisão de dar o lance. Uma parte dos leilões aceita financiamento, e no dia 23 eu mostro onde essa regra vive dentro do documento e o que conferir antes de disputar, porque ela muda de leilão para leilão.`

**07.** `"Esses 42%* são reais?"`
`São a média entre o valor de avaliação e o lance vencedor em todas as compras que eu conduzi, sem seleção dos melhores casos, e a metodologia completa está no fim desta página, com a documentação à disposição de quem quiser conferir. Na noite eu mostro esses números na tela, junto com os custos que entram depois do lance e que todo comprador precisa somar.`

**08.** `"Vale a pena assistir de casa?"`
`Depende do que você quer levar da noite, porque o método viaja inteiro pelo cabo, com o mesmo documento na tela e a sua pergunta lida no chat, enquanto o aperto de mão não viaja. Se o que te falta é a leitura, assista de onde estiver; se o que te falta é rede de contatos, só a sala entrega.`

**09.** `"Vou levar um pitch de vendas no meio?"`
`Vai ter oferta, com hora e duração publicadas: às 21h10 eu uso trinta minutos para apresentar o Clube do Leilão, o caminho de quem quiser continuar comigo, e quando esse bloco começar a aula prometida já terá sido entregue inteira. Ficar para ouvir é escolha sua.`

**10.** `"Cliquei no botão e não caí num pagamento. Como funciona a inscrição?"`
`O botão abre um formulário rápido de nome, e-mail e WhatsApp, e logo depois você recebe no seu WhatsApp o link oficial da inscrição na Sympla, que é onde o pagamento acontece, no valor do lote vigente. Todo pagamento roda dentro da Sympla, nunca por transferência direta, e pelo WhatsApp você pode perguntar o que quiser antes de pagar.`

**11.** `"Perdi o horário. Tem replay?"`
`Não existe replay em nenhum dos dois ingressos, e o motivo é o material que sobe no telão: documento de processo não circula gravado, nem para quem esteve na sala nem para quem assistiu de casa. É por isso que a data aparece em todo canto desta página, porque a única forma de ver essa leitura é ao vivo, no dia 23.`

**12.** `"Posso cancelar se eu mudar de ideia?"`
`Pode, e o prazo é generoso: são 7 dias corridos a partir da compra para desistir com devolução integral, sem justificar nada, como garante o artigo 49 do Código de Defesa do Consumidor. Quem compra perto da data mantém esse direito até as 19h do dia 23, quando o serviço começa a ser entregue, e fora da janela dos 7 dias a produção aceita cancelamento com devolução integral até 48 horas antes do evento. [CONFIRMAR com o jurídico e com a Sympla]`

**13.** `"Posso transferir meu ingresso para outra pessoa?"`
`Não. O ingresso é pessoal e intransferível nos dois formatos, com o credenciamento conferindo documento na sala e o link individual valendo no online. O que existe é a edição de participante dentro da Sympla, permitida uma única vez e até 24 horas antes do evento, então confira o nome com calma na hora de comprar.`

**14.** `"Tem estacionamento?"`
`No prédio, não, mas o entorno costuma ter vaga na rua à noite, e quem vem de aplicativo desce na porta do Okay Hub.`

Na pergunta 07, o asterisco de `42%*` é um link `<a href="#metodologia">` (padrão da página: toda ocorrência do número carrega o asterisco clicável).

### Layout

```
<section class="faq" id="faq">
  <h2 class="faq__title">FAQ</h2>
  <div class="faq__list">
    <details class="faq__item" id="faq-01">
      <summary class="faq__q">
        <span class="faq__num" aria-hidden="true">01.</span>
        <span class="faq__question">"Leilão de imóvel é legalizado? ..."</span>
        <span class="faq__mark" aria-hidden="true"></span>
      </summary>
      <div class="faq__a-wrap"><div class="faq__a"><p>resposta</p></div></div>
    </details>
    <!-- ... até faq-14, mesma estrutura -->
  </div>
</section>
```

Valores exatos:
- `.faq`: `max-width: 880px; margin: 0 auto; padding: clamp(90px, 13vh, 150px) var(--pad-x) clamp(80px, 11vh, 130px); border-top: 1px solid var(--line);`
- `.faq__title`: `margin-bottom: clamp(40px, 6vh, 64px);`
- `.faq__list`: `border-bottom: 1px solid var(--line);`
- `.faq__item`: `border-top: 1px solid var(--line);`
- `.faq__q`: `display: grid; grid-template-columns: 56px 1fr 32px; gap: 18px; align-items: baseline; padding: 24px 10px; cursor: pointer; list-style: none;` e `summary::-webkit-details-marker { display: none; }` `summary::marker { content: none; }` O `.faq__mark` alinha via `align-self: center;`
- `.faq__mark`: `width: 22px; height: 22px; position: relative; justify-self: end;` barras via `::before` e `::after`: `content: ""; position: absolute; top: 50%; left: 50%; width: 16px; height: 1.5px; translate: -50% -50%; background: currentColor;` o `::after` adicionalmente com `rotate: 90deg;`
- `.faq__a-wrap`: `display: grid; grid-template-rows: 1fr;` `.faq__a`: `overflow: hidden; min-height: 0;`
- Parágrafo da resposta: `max-width: 68ch; padding: 0 32px 30px 74px;` (74px = 56px da coluna do número + 18px do gap, alinhando resposta sob a pergunta).
- A resposta 07 contém o link do asterisco; as respostas 12 e 13 terminam com os marcadores `[CONFIRMAR ...]` no próprio parágrafo, sem estilo adicional.

### Tipografia

- `.faq__title`: Fraunces, weight 450, `font-size: clamp(40px, 5vw, 72px); line-height: 1; letter-spacing: -0.015em;`
- `.faq__num`: Fraunces, weight 550, `font-size: clamp(15px, 1.4vw, 18px); line-height: 1.4; font-variant-numeric: tabular-nums; letter-spacing: 0.02em;`
- `.faq__question`: Fraunces, weight 500, `font-size: clamp(17px, 1.7vw, 21px); line-height: 1.35; letter-spacing: -0.005em;`
- `.faq__a p`: DM Sans, weight 300, `font-size: clamp(15px, 1.25vw, 16.5px); line-height: 1.7;`
- Link do asterisco na 07: mesmo corpo do texto, `text-decoration-thickness: 1px; text-underline-offset: 3px;`

### Cores

- Seção sobre `var(--bg-0)` #071310.
- `.faq__title`: #F1EDE4.
- `.faq__num`: `rgba(140,239,211,0.7)`; no hover do item e no estado aberto: #8CEFD3.
- `.faq__question`: #F1EDE4 em todos os estados.
- `.faq__mark`: `color: rgba(140,239,211,0.65)`; hover e aberto: #8CEFD3.
- `.faq__a p`: #9FB3AB. Link do asterisco: #8CEFD3.
- Hairlines: `rgba(241,237,228,0.13)`.
- Hover Fill do item: `background: rgba(140,239,211,0.04)` no `.faq__q`.
- `:focus-visible` no summary: `outline: 2px solid #8CEFD3; outline-offset: -2px; border-radius: 2px;` (offset negativo para o outline não vazar as hairlines).

### Elementos Visuais

- Numeração documental 01. a 14. com ponto, em Fraunces, coluna fixa de 56px, ecoando os numerais em stroke do mecanismo em escala de índice.
- Marcador + desenhado em CSS (duas barras de 16px x 1.5px), nunca chevron, nunca caractere de fonte; rotaciona 45deg para formar x no estado aberto.
- Hairlines de 1px entre todos os itens e fechando a lista.
- Nenhum card, nenhum fundo por item além do Hover Fill, nenhum ícone.

### Animações

- Abertura (com JS): `.faq__a-wrap { transition: grid-template-rows 0.42s cubic-bezier(0.22, 1, 0.36, 1); }` fechado: `grid-template-rows: 0fr;` aberto: `grid-template-rows: 1fr;` O conteúdo interno `.faq__a` também transiciona `opacity 0.3s ease 0.08s` (0 fechado, 1 aberto). JS intercepta o clique no summary com `preventDefault`: ao abrir, aplica o atributo `open` e no frame seguinte troca a classe `.is-open` (que leva a `1fr`); ao fechar, remove `.is-open`, espera o `transitionend` de grid-template-rows e então remove `open`.
- Marcador: `transition: rotate 0.35s cubic-bezier(0.22, 1, 0.36, 1);` aberto: `rotate: 45deg;` no container `.faq__mark`.
- Reveal de scroll nos `.faq__item` e no `.faq__title`, somente dentro de `@supports (animation-timeline: view())`: `animation: rise linear both; animation-timeline: view(); animation-range: entry 0% entry 35%;` keyframe `rise` compartilhado.
- Fallback sem JS: details/summary nativo abre e fecha instantaneamente, com `.faq__a-wrap` em `grid-template-rows: 1fr` por padrão dentro de um bloco `.no-js` (classe removida pelo JS no load), garantindo conteúdo sempre acessível.
- `prefers-reduced-motion: reduce`: todas as transitions e animations acima em `none`; abertura instantânea.

### Interatividade

- Hover no `.faq__q`: `background: rgba(140,239,211,0.04)` com `transition: background 0.25s ease;` número e marcador vão a #8CEFD3.
- Clique/Enter/Espaço no summary alterna o item (comportamento nativo de details preservado na semântica; o JS apenas coordena a animação). Vários itens podem ficar abertos ao mesmo tempo; não fechar os demais automaticamente.
- Link do asterisco na pergunta 07 rola para `#metodologia` (scroll-behavior smooth global; auto sob reduced-motion).
- `aria-expanded` não é necessário: details/summary nativo já expõe o estado correto para leitores de tela.

### Responsividade

**1060px:**
- Sem mudanças estruturais; os clamps de tipografia absorvem a redução.

**680px:**
- `.faq__q`: `grid-template-columns: 34px 1fr 22px; gap: 12px; padding: 20px 4px;`
- `.faq__num`: `font-size: 14px;`
- `.faq__question`: `font-size: 16.5px;`
- `.faq__mark`: `width: 18px; height: 18px;` barras de 14px x 1.5px.
- `.faq__a p`: `padding: 0 4px 26px 46px;` (46px = 34px + 12px, mantendo o alinhamento sob a pergunta).
- `.faq__title`: o clamp resolve (40px no mínimo).

---

## Seção 12: CTA Final (id="inscricao")

### Arquétipo e Constraints
**Arquétipo:** Poster (Baseados em Tipografia).
**Constraints:** Headline em escala poster, até 108px (Tipografia) + Gradiente Radial reaproveitando o `hero__glow` (Cor) + Full Height (Layout, min-height 92svh).
**Justificativa:** a página abre com um Type Hero assimétrico e fecha com um poster centralizado: mesmo DNA tipográfico, composição espelhada, o que dá sensação de "capa e contracapa". O glow radial reaparece uma única vez desde o hero, fechando o arco de luz da página, e a aspa em stroke retorna aqui como segunda e última aparição do refrão, encerrando o sistema. Urgência apenas por data absoluta, sem contador.

### Conteúdo
Título: `Quarta, 23 de setembro, 19h. A noite em que você aprende o jogo.`

Parágrafo 1: `Dá para continuar colecionando abas de leilão que você nunca lê até o fim, ou dá para investir uma quarta-feira e atravessar um edital inteiro ao lado de quem faz isso desde 2007.`

Parágrafo 2: `Depois dessa noite, anúncio de leilão vira um documento que você sabe abrir e uma conta que você sabe fazer, e a decisão passa a ser totalmente sua, inclusive a de ficar de fora.`

Refrão (aparição 2 de 2): `Quem não entende o jogo não arremata. Assiste.`

Botões: `Garantir minha vaga presencial` (primário) · `Assistir à transmissão ao vivo` (secundário)

Endereço: `Okay Hub de Negócios e Coworking · Rua Castelo de Alcázar, 125 · Bairro Castelo · Belo Horizonte/MG · CEP 31330-310. Ou ao vivo, de onde você estiver.`

Letra miúda: `Inscrição pela Sympla, no valor do lote vigente indicado na tabela de lotes desta página, com parcelamento em até 12x e as taxas da plataforma exibidas no checkout. Ingresso pessoal e intransferível, com arrependimento em 7 dias corridos e devolução integral, desde que o pedido chegue até 48 horas antes do evento.`

### Layout
```html
<section class="cta-final" id="inscricao">
  <div class="cta-final__bg" aria-hidden="true">
    <span class="cta-final__glow"></span>
  </div>
  <div class="cta-final__inner">
    <h2 class="cta-final__title">
      <span class="cta-final__quando">Quarta, 23 de setembro, 19h.</span>
      <span class="cta-final__frase">A noite em que você <em>aprende o jogo.</em></span>
    </h2>
    <p class="cta-final__p">Dá para continuar colecionando abas de leilão que você nunca lê até o fim, ou dá para investir uma quarta-feira e atravessar um edital inteiro ao lado de quem faz isso desde 2007.</p>
    <p class="cta-final__p">Depois dessa noite, anúncio de leilão vira um documento que você sabe abrir e uma conta que você sabe fazer, e a decisão passa a ser totalmente sua, inclusive a de ficar de fora.</p>
    <figure class="cta-final__refrao">
      <blockquote>
        <p class="cta-final__quote">Quem não entende o jogo não arremata. <span class="hl">Assiste.</span></p>
      </blockquote>
    </figure>
    <div class="cta-final__ctas">
      <button type="button" class="btn btn--fill" data-modalidade="presencial">Garantir minha vaga presencial</button>
      <button type="button" class="btn btn--ghost" data-modalidade="online">Assistir à transmissão ao vivo</button>
    </div>
    <p class="cta-final__end">Okay Hub de Negócios e Coworking · Rua Castelo de Alcázar, 125 · Bairro Castelo · Belo Horizonte/MG · CEP 31330-310. Ou ao vivo, de onde você estiver.</p>
    <p class="cta-final__fine">Inscrição pela Sympla, no valor do lote vigente indicado na tabela de lotes desta página, com parcelamento em até 12x e as taxas da plataforma exibidas no checkout. Ingresso pessoal e intransferível, com arrependimento em 7 dias corridos e devolução integral, desde que o pedido chegue até 48 horas antes do evento.</p>
  </div>
</section>
```
- `.cta-final`: `position: relative; overflow: hidden; border-top: 1px solid var(--line); min-height: 92svh; display: flex; flex-direction: column; justify-content: center; padding: clamp(100px, 14vh, 160px) var(--pad-x) clamp(80px, 10vh, 120px);`
- `.cta-final__inner`: `position: relative; z-index: 2; width: 100%; max-width: 980px; margin: 0 auto; text-align: center;`
- `.cta-final__title`: as duas linhas em `display: block`; margem inferior `clamp(28px, 4vh, 44px)`.
- `.cta-final__p`: `max-width: 62ch; margin: 0 auto 18px;` (o segundo com `margin-bottom: 0`).
- `.cta-final__refrao`: `margin: clamp(48px, 7vh, 76px) auto clamp(40px, 6vh, 64px); max-width: 700px;` A aspa entra por `::before` (ver Elementos Visuais) como bloco centralizado acima da frase, `display: block; margin: 0 auto 6px;`.
- `.cta-final__ctas`: `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; max-width: 660px; margin: 0 auto 26px;`
- `.cta-final__end`: `margin: 0 auto 12px; max-width: 68ch;`
- `.cta-final__fine`: `margin: 0 auto; max-width: 68ch;`

### Tipografia
| Elemento | Fonte | Peso | Tamanho | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| `.cta-final__quando` | Fraunces itálico | 300 | `clamp(22px, 3vw, 42px)` | 1.15 | 0 |
| `.cta-final__frase` | Fraunces | 650 | `clamp(42px, 7.2vw, 108px)` | 1.04 | -0.02em |
| `.cta-final__frase em` | Fraunces itálico | 700 | herda | herda | herda |
| `.cta-final__p` | DM Sans | 300 | `clamp(16px, 1.3vw, 18px)` | 1.7 | 0 |
| `.cta-final__quote` | Fraunces itálico | 450 | `clamp(26px, 3.4vw, 46px)` | 1.2 | -0.01em |
| `.cta-final__quote .hl` | Fraunces normal | 700 | herda | herda | herda |
| Botões | DM Sans | 500 | 15.5px | nativo | 0.01em |
| `.cta-final__end` | DM Sans | 400 | 14px | 1.6 | 0.01em |
| `.cta-final__fine` | DM Sans | 300 | 12.5px | 1.65 | 0 |

### Cores
- Fundo: `var(--bg-0)` #071310. Hairline superior: `var(--line)` rgba(241,237,228,0.13).
- `.cta-final__quando`: `var(--text-muted)` #9FB3AB. `.cta-final__frase`: `var(--text)` #F1EDE4. `.cta-final__frase em`: `var(--mint)` #8CEFD3.
- Parágrafos: `var(--text-muted)`. `.cta-final__quote`: `var(--text)`. `.hl`: `var(--mint)`.
- Glow: `radial-gradient(circle, rgba(22, 168, 142, 0.17) 0%, transparent 62%)`.
- Aspa: `color: transparent; -webkit-text-stroke: 1.5px rgba(140, 239, 211, 0.4)`.
- Botão primário: fundo #16A88E, texto #04110D, hover #2FD4AF, sombra `0 4px 18px rgba(0,0,0,0.35)`. Botão contorno: borda `var(--line-strong)`, texto `var(--text)`; hover borda e texto `var(--mint)` com preenchimento `rgba(140, 239, 211, 0.1)`.
- Endereço: `var(--text-muted)`. Letra miúda: `rgba(159, 179, 171, 0.75)`.

### Elementos Visuais
- `.cta-final__glow`: `position: absolute; right: -20vw; top: -28vh; width: 58vw; height: 58vw; border-radius: 50%; filter: blur(10px);` gradiente acima. Mesmo dispositivo do `hero__glow`, espelhado (hero: esquerda embaixo; final: direita em cima).
- `.cta-final__refrao::before`: `content: "\201C"; display: block; font-family: var(--font-display); font-weight: 650; font-size: clamp(90px, 10vw, 150px); line-height: 0.6; color: transparent; -webkit-text-stroke: 1.5px rgba(140, 239, 211, 0.4); user-select: none; margin: 0 auto 6px;` Idêntico em traço e cor ao `.refrao::before` da seção do mecanismo.
- Nenhum outro decorativo. O grain global `body::after` cobre a seção.

### Animações
Dentro de `@supports (animation-timeline: view())`, todas com `animation: rise linear both; animation-timeline: view();` e keyframe `rise` já existente (opacity 0 + translateY(34px) para 1 e 0):
- `.cta-final__title`: `animation-range: entry 0% entry 38%;`
- `.cta-final__p`: `animation-range: entry 0% entry 45%;`
- `.cta-final__refrao`: `animation-range: entry 0% entry 50%;`
- `.cta-final__ctas`, `.cta-final__end`, `.cta-final__fine`: `animation-range: entry 0% entry 45%;`
Fallback: sem suporte, tudo 100% visível (nenhum estado inicial oculto fora do `@supports`). `prefers-reduced-motion: reduce`: `animation: none` em todos.

### Interatividade
- Ambos os botões abrem o modal da Seção 13 e gravam `data-modalidade` no campo oculto `modalidade` ("presencial" ou "online").
- Hover: idêntico ao hero (fill muda para #2FD4AF em 0.25s ease; ghost sobe preenchimento `scaleY(0)` para `scaleY(1)` em 0.32s `cubic-bezier(0.22, 1, 0.36, 1)`, transform-origin bottom).
- Active: `transform: translateY(1px)`.
- Focus: outline global 2px `var(--mint)` offset 3px.

### Responsividade
- **1060px:** nenhuma mudança estrutural; os clamps reduzem a escala. `.cta-final__ctas` mantém 2 colunas.
- **680px:** `min-height: auto; padding: 80px var(--pad-x) 64px;` `.cta-final__ctas { grid-template-columns: 1fr; max-width: none; }` (primário em cima, largura total). `.cta-final__frase { font-size: clamp(38px, 11vw, 46px); }` `.cta-final__refrao::before { font-size: 72px; line-height: 0.8; }` Glow: `right: -40vw; top: -14vh; width: 110vw; height: 110vw;` Letra miúda 12px.

---

## Seção 13: Modal de Captura

### Arquétipo e Constraints
**Arquétipo:** Floating Cards (Baseados em Camadas).
**Constraints:** Modal (Estruturas Especiais) + Transparent Background com blur no overlay (Cor) + Fade Up na entrada do cartão (Movimento).
**Justificativa:** o cartão de papel #F1EDE4 flutuando sobre o verde-preto repete o material documental da ficha do hero, com o mesmo furo de arquivo e a mesma sombra funda: o lead preenche "a mesma ficha" que viu na primeira dobra. Underline no lugar de caixa mantém o formulário com cara de documento, não de SaaS.

### Conteúdo
Título: `Me deixa seu contato`

Texto: `Deixa seu nome, e-mail e WhatsApp, e eu te levo direto para a inscrição oficial na Sympla, no valor do lote vigente.`

Rótulos dos campos: `NOME` · `E-MAIL` · `WHATSAPP`

Botão: `Ir para a inscrição`

Nota sob o botão: `Seus dados não vão para mais ninguém.`

Sucesso, título: `Recebi seus dados`

Sucesso, texto: `O link oficial da Sympla chega no seu WhatsApp em instantes, e a inscrição termina lá, no valor do lote vigente.`

### Layout
```html
<div class="modal" hidden>
  <div class="modal__overlay" data-fecha></div>
  <div class="modal__card" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
    <button type="button" class="modal__close" aria-label="Fechar" data-fecha>(SVG X 14px)</button>
    <h3 class="modal__title" id="modal-titulo">Me deixa seu contato</h3>
    <p class="modal__text">Deixa seu nome, e-mail e WhatsApp, e eu te levo direto para a inscrição oficial na Sympla, no valor do lote vigente.</p>
    <form class="modal__form" data-sheets="(URL do Apps Script existente, manter)"
          data-redirect="https://www.sympla.com.br/evento/leilao-prosa-edicao-bairro-castelo-bh/3515691">
      <div class="modal__campo">
        <label for="f-nome">NOME</label>
        <input id="f-nome" name="nome" type="text" autocomplete="name" required>
      </div>
      <div class="modal__campo">
        <label for="f-email">E-MAIL</label>
        <input id="f-email" name="email" type="email" autocomplete="email" required>
      </div>
      <div class="modal__campo">
        <label for="f-tel">WHATSAPP</label>
        <input id="f-tel" name="telefone" type="tel" inputmode="tel" autocomplete="tel" required>
      </div>
      <input type="hidden" name="evento" value="2026-09-23"> <!-- manter o valor do form existente -->

      <input type="hidden" name="modalidade" value="">
      <!-- honeypot: manter o campo e o nome já usados pelo form existente -->
      <div class="modal__hp" aria-hidden="true"><input name="bot-field" type="text" tabindex="-1" autocomplete="off"></div> <!-- honeypot: manter o name="bot-field" do form existente, que o forms.js já confere -->
      <button type="submit" class="btn btn--fill modal__submit">Quero receber o link</button>
      <p class="modal__nota">Seus dados não vão para mais ninguém.</p>
    </form>
    <div class="modal__sucesso" hidden>
      <span class="modal__stamp" aria-hidden="true">L&amp;P<i>23.09</i></span>
      <h3 class="modal__title">Recebi seus dados</h3>
      <p class="modal__text">O link oficial da Sympla chega no seu WhatsApp em instantes, e a inscrição termina lá, no valor do lote vigente.</p>
    </div>
  </div>
</div>
```
- `.modal`: `position: fixed; inset: 0; z-index: 57; display: grid; place-items: center; padding: 20px;`
- `.modal__overlay`: `position: absolute; inset: 0; background: rgba(7, 19, 16, 0.8); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);`
- `.modal__card`: `position: relative; z-index: 1; width: min(480px, 100%); max-height: 90svh; overflow-y: auto; background: var(--paper); color: var(--ink-inverse); border-radius: 6px; padding: 40px 32px 30px; box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5), 0 4px 14px rgba(0, 0, 0, 0.35);` Sem rotação (formulário fica reto; o eco da ficha vem do papel, do furo e da sombra).
- `.modal__campo`: `margin-top: 18px;` label `display: block; margin-bottom: 2px;` input `display: block; width: 100%;`
- `.modal__submit`: `width: 100%; margin-top: 26px;`
- `.modal__nota`: `margin-top: 12px; text-align: center;`
- `.modal__hp`: `position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;`
- `.modal__sucesso`: `text-align: center; padding: 8px 0 6px;` `.modal__stamp` centralizado com `margin: 0 auto 18px;`
- Z-index do sistema: overlay/cartão em 57, abaixo do grain global (60), para o papel receber o mesmo grain da ficha do hero; acima do topbar (20) e da barra mobile (55). `body.modal-aberta { overflow: hidden; }`

### Tipografia
| Elemento | Fonte | Peso | Tamanho | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| `.modal__title` | Fraunces | 600 | `clamp(24px, 5vw, 30px)` | 1.15 | -0.01em |
| `.modal__text` | DM Sans | 400 | 14.5px | 1.6 | 0 |
| `label` | DM Sans | 700 | 10.5px | 1.4 | 0.16em, uppercase |
| `input` | DM Sans | 400 | 16px | 1.4 | 0.01em |
| `.modal__submit` | DM Sans | 500 | 15.5px | nativo | 0.01em |
| `.modal__nota` | DM Sans | 400 | 12px | 1.5 | 0.02em |

### Cores
- Cartão: fundo #F1EDE4, texto #0E211C. Título #0E211C. Texto de apoio `rgba(14, 33, 28, 0.75)`.
- Labels: `rgba(14, 33, 28, 0.7)`; com o campo em foco, o label do campo vira `var(--accent-deep)` #0E7A67.
- Inputs: `background: transparent; border: none; border-radius: 0; border-bottom: 1px solid rgba(14, 33, 28, 0.35); padding: 10px 2px 8px; caret-color: var(--accent-deep);`
- Foco do input: `border-bottom: 2px solid var(--accent-deep); margin-bottom: -1px; outline: none;` (indicador de foco próprio, visível, no lugar do outline global).
- Erro: validação nativa do navegador (`required`, `type="email"`), sem microcopy inventada; estado visual via `input:user-invalid { border-bottom: 2px solid #A23B2B; margin-bottom: -1px; }` e `.modal__campo:has(input:user-invalid) label { color: #A23B2B; }`
- Botão: mesmos estados do `.btn--fill` (fundo #16A88E, texto #04110D, hover #2FD4AF). Nota: `rgba(14, 33, 28, 0.6)`.
- Fechar: `color: rgba(14, 33, 28, 0.55)`; hover `color: #0E211C; background: rgba(14, 33, 28, 0.07); border-radius: 50%;`
- Overlay: `rgba(7, 19, 16, 0.8)` + blur 8px.
- Stamp do sucesso: idêntico ao `.ficha__stamp` (64px, borda 1.5px `var(--accent-deep)`, rotate 8deg, opacity 0.85).

### Elementos Visuais
- Furo de arquivo: `.modal__card::before { content: ""; position: absolute; top: 16px; left: 50%; transform: translateX(-50%); width: 44px; height: 5px; border-radius: 999px; background: rgba(14, 33, 28, 0.14); }` Idêntico ao da ficha.
- Botão fechar: 36px por 36px, `position: absolute; top: 14px; right: 14px;` com X em SVG inline 14px, stroke 1.5px currentColor.
- Stamp circular no estado de sucesso, reaproveitando o dispositivo da ficha do hero.

### Animações
- Abertura: overlay `opacity 0` para `1` em 0.25s ease; cartão `opacity: 0; transform: translateY(18px) scale(0.985)` para `opacity: 1; transform: none` em 0.3s `cubic-bezier(0.22, 1, 0.36, 1)`.
- Fechamento: reverso em 0.2s ease.
- Troca form/sucesso: form recebe `hidden`, `.modal__sucesso` perde `hidden` e entra com o mesmo rise de 0.3s.
- `prefers-reduced-motion: reduce`: sem transição nenhuma, estados trocam instantaneamente.

### Interatividade
- Abertura: qualquer botão de CTA da página (hero, CTAs duplos, cards da oferta, CTA final, barra mobile) abre o modal, preenche o campo oculto `modalidade` com "presencial" ou "online" conforme o botão, adiciona `body.modal-aberta` e move o foco para o input `nome`.
- Fechamento: clique no overlay, no botão fechar ou tecla Esc; o foco volta ao botão que abriu.
- Focus trap: Tab circula apenas entre os focáveis do cartão (fechar, 3 inputs, submit).
- Envio: POST ao endpoint do `data-sheets` do form existente; enquanto envia, submit recebe `disabled` e `opacity: 0.7; cursor: wait;`. No sucesso, exibe `data-success-title` e `data-success-text`. Com `data-redirect` para a página oficial do evento na Sympla: o envio grava o lead, dispara Lead e InitiateCheckout e navega 350ms depois.
- Hover e focus dos botões: mesmos valores globais.

### Responsividade
- **1060px:** nenhuma mudança; o cartão já é fluido.
- **680px:** `.modal { padding: 16px; }` mantendo `place-items: center` (nunca ancorar o cartão no rodapé da tela). `.modal__card { width: 100%; padding: 34px 22px 26px; }` Título 24px. Inputs mantêm 16px (evita zoom do iOS). `max-height: 88svh` com rolagem interna.

---

## Seção 14: Rodapé (inclui id="metodologia")

### Arquétipo e Constraints
**Arquétipo:** Editorial (Baseados em Tipografia).
**Constraints:** Container Narrow, 76ch para o bloco de metodologia (Layout) + Low Contrast, corpo 13px em `--text-muted` sobre `--bg-0` (Cor).
**Justificativa:** o rodapé é o colofão do documento: texto corrido, fino e honesto, sem colunas de sitemap. O contraste baixo tira o peso visual sem esconder nada, e a borda esquerda em `--accent` repete o dispositivo da nota dos 42% do hero, amarrando as duas pontas da página no mesmo aparato de nota de rodapé.

### Conteúdo
Bloco `#metodologia`:

> **\* Sobre os 42%:** os 42% são a média simples dos descontos que eu obtive nos arremates que eu conduzi, calculada entre o valor de avaliação do imóvel e o lance vencedor. A média cobre [N] arremates conduzidos entre [ano] e [ano] e considera todos os arremates do período, sem seleção de melhores casos **[CONFIRMAR com a Jacque]**. Valor de avaliação e preço de mercado são bases diferentes: a avaliação feita dentro do processo pode ficar acima ou abaixo do que o imóvel faz na rua. O percentual se refere ao valor do lance. Comissão do leiloeiro, imposto de transferência, taxas de cartório, dívidas assumidas, desocupação e reforma entram depois e reduzem a diferença final. Essa média mede trabalho que eu já realizei e não garante o resultado individual de quem assiste ao evento. Cada leilão depende do edital daquele imóvel, da disputa do dia, do estado de conservação do bem e do histórico dele no cartório. Existem arremates com desconto bem maior, arremates com desconto pequeno, arremates que não saem, e casos de prejuízo para quem compra sem analisar a documentação. Os valores usados nos exemplos desta página são inventados e não representam operação real. Eu tenho interesse comercial no assunto, porque conduzo arremates e vendo formação sobre leilão. Esta página não indica nenhum imóvel específico. Este evento é educativo, não constitui recomendação de investimento e não substitui a análise jurídica do caso concreto por profissional habilitado. A documentação que sustenta a média fica à disposição para conferência pelo e-mail [contato **CONFIRMAR**].

Identificação: `Realização: Leilão & Prosa · Faz Morar Imóveis · CRECI 5314 PJ · CNAI 19244 · [Razão social e CNPJ CONFIRMAR: exigido pelo Decreto 7.962/2013] · Atendimento: WhatsApp (31) 99695-1660 e [e-mail CONFIRMAR] · Belo Horizonte · MG · [Termos de uso] · [Política de privacidade]`

Disclaimer (terceira aparição): `A Caixa Econômica Federal não organiza, não patrocina e não endossa este evento.`

Apoios: `Apoio: AVANTIK`

Copyright: `© 2026 Faz Morar Imóveis · Todos os direitos reservados.`

### Layout
```html
<footer class="rodape">
  <div class="rodape__inner">
    <h2 class="sr-only">Metodologia e informações legais</h2>
    <div class="rodape__metodologia" id="metodologia">
      <p>(texto integral do bloco, com <strong>* Sobre os 42%:</strong> em strong e os marcadores [N], [ano] e [CONFIRMAR] mantidos na tela)</p>
    </div>
    <div class="rodape__id">
      <p class="rodape__linha">(identificação completa, com [Termos de uso] e [Política de privacidade] como links quando as URLs existirem; até lá, texto entre colchetes)</p>
      <p class="rodape__caixa">A Caixa Econômica Federal não organiza, não patrocina e não endossa este evento.</p>
      <p class="rodape__apoio">Apoio: AVANTIK <span class="dot">·</span> Vértice Labs</p>
      <p class="rodape__copy">© 2026 Faz Morar Imóveis · Todos os direitos reservados.</p>
    </div>
  </div>
</footer>
```
- `.rodape`: `border-top: 1px solid var(--line); background: var(--bg-0);`
- `.rodape__inner`: `max-width: var(--w-page); margin: 0 auto; padding: clamp(56px, 8vh, 88px) var(--pad-x) 44px;`
- `.rodape__metodologia`: `max-width: 76ch; padding-left: 18px; border-left: 2px solid var(--accent); scroll-margin-top: 28px;`
- `.rodape__id`: `margin-top: 40px; padding-top: 28px; border-top: 1px solid var(--line); max-width: 76ch;` Parágrafos com `margin-top: 14px` a partir do segundo.
- `.sr-only`: padrão (position absolute, clip, 1px). Nada de colunas, nada de grid de links.

### Tipografia
| Elemento | Fonte | Peso | Tamanho | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| `#metodologia p` | DM Sans | 300 | 13px | 1.75 | 0.005em |
| `#metodologia strong` | DM Sans | 700 | 13px | herda | herda |
| `.rodape__linha` | DM Sans | 400 | 13px | 1.7 | 0.005em |
| `.rodape__caixa` | DM Sans | 400 | 12.5px | 1.6 | 0.01em |
| `.rodape__apoio` | DM Sans | 500 | 12px | 1.6 | 0.14em |
| `.rodape__copy` | DM Sans | 300 | 12px | 1.6 | 0.02em |

### Cores
- Fundo `var(--bg-0)`. Hairline superior e divisória interna: `var(--line)` rgba(241,237,228,0.13).
- Texto da metodologia e identificação: `var(--text-muted)` #9FB3AB. `strong`: `var(--text)` #F1EDE4.
- Borda esquerda do `#metodologia`: `var(--accent)` #16A88E; com `:target` (chegada por âncora do asterisco), `var(--mint)` #8CEFD3.
- Links (Termos, Política, e-mail quando existirem): `var(--mint)`, sublinhado 1px, offset 3px; hover `text-decoration-thickness: 2px`.
- `.rodape__caixa`: `rgba(159, 179, 171, 0.85)`. `.rodape__apoio`: `var(--text)`, com os pontos médios em `var(--accent)`. `.rodape__copy`: `rgba(159, 179, 171, 0.6)`.

### Elementos Visuais
- Apenas hairlines e a borda esquerda accent do bloco de metodologia. Sem logotipos de apoiadores (apoios em texto puro, como manda a copy), sem ícones, sem colunas.

### Animações
- Nenhum reveal de scroll no rodapé (texto legal aparece sempre, imediatamente).
- Única transição: `border-left-color 0.4s ease` no `#metodologia:target`. `prefers-reduced-motion: reduce`: `transition: none`.

### Interatividade
- Todo asterisco de 42% da página é `<a href="#metodologia">` e aterrissa aqui com `scroll-margin-top: 28px`.
- Links de Termos e Política só viram `<a>` quando as URLs existirem (pendência 13 da copy); até lá permanecem texto entre colchetes.
- Focus dos links: outline global.

### Responsividade
- **1060px:** nenhuma mudança.
- **680px:** `padding: 48px var(--pad-x) calc(36px + 84px);` (o acréscimo de 84px reserva espaço para a barra fixa mobile não cobrir o copyright). `#metodologia` mantém 13px (mínimo da copy). `.rodape__linha` quebra livre; pontos médios permanecem.

---

## Bloco 15: Barra fixa mobile e regras globais

### Arquétipo e Constraints
**Arquétipo:** Reactive (Baseados em Movimento).
**Constraints:** Fixed Element (Layout) + Glassmorphism, fundo translúcido com blur (Efeitos Especiais).
**Justificativa:** a barra só existe onde o dedo precisa dela: em telas até 680px e só depois que o leitor atravessou o mecanismo, quando a promessa já foi entendida. O vidro escuro com hairline superior repete o material do overlay do modal, sem preço em botão nenhum, como em toda a página.

### Conteúdo
Botões: `Garantir minha vaga presencial` (primário) · `Assistir à transmissão ao vivo` (contorno). Sem preço, sem texto adicional.

### Layout
```html
<!-- imediatamente após o </section> da seção do mecanismo -->
<div id="sentinela-mec" aria-hidden="true"></div>
...
<div class="barra" role="region" aria-label="Inscrição">
  <button type="button" class="btn btn--fill barra__btn" data-modalidade="presencial">Sala em BH</button>
  <button type="button" class="btn btn--ghost barra__btn" data-modalidade="online">Ao vivo</button>
</div>
```
- `.barra`: `position: fixed; left: 0; right: 0; bottom: 0; z-index: 55; display: none; grid-template-columns: 1fr 1fr; gap: 10px; padding: 10px 16px calc(10px + env(safe-area-inset-bottom)); background: rgba(7, 19, 16, 0.92); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-top: 1px solid var(--line); transform: translateY(110%);`
- Em `max-width: 680px`: `display: grid;`
- Estado visível: `.barra--on { transform: translateY(0); }`
- `#sentinela-mec`: `height: 1px;` invisível, sem margem.
- JS (única lógica):
```js
const sent = document.querySelector('#sentinela-mec');
const barra = document.querySelector('.barra');
new IntersectionObserver(function (entries) {
  barra.classList.toggle('barra--on', entries[0].boundingClientRect.top < 0);
}).observe(sent);
```
- `body.modal-aberta .barra { transform: translateY(110%); }` (a barra sai enquanto o modal está aberto).

### Tipografia
- `.barra__btn`: DM Sans, peso 500, 14px, letter-spacing 0.01em, `padding: 14px 12px;` raio 6px. Mesma família de estados dos botões globais.

### Cores
- Fundo `rgba(7, 19, 16, 0.92)` com blur 10px. Hairline `var(--line)` rgba(241,237,228,0.13).
- Primário: #16A88E com texto #04110D, hover/active #2FD4AF. Contorno: borda 1px `var(--line-strong)`, texto `var(--text)`; active com preenchimento `rgba(140, 239, 211, 0.1)`.

### Elementos Visuais
- Nenhum decorativo além do vidro e da hairline. O grain global (z-index 60) passa por cima da barra, mantendo o material da página.

### Animações
- Entrada e saída: `transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);`
- Fallback sem IntersectionObserver (navegador antigo): a barra fica sempre visível em mobile (`transform: none` dentro de `@supports not (selector(:has(*)))` não cobre isso; usar verificação em JS: se `!('IntersectionObserver' in window)`, adicionar `.barra--on` direto).
- `prefers-reduced-motion: reduce`: `transition: none`, aparece e some instantaneamente.

### Interatividade
- Cada botão abre o modal da Seção 13 e grava a `modalidade` correspondente.
- Focus: outline global 2px `var(--mint)` offset 3px (visível sobre o vidro escuro).

### Responsividade
- **Acima de 680px:** `display: none`, sempre, sem exceção.
- **680px:** grid 2 colunas iguais, botões com os rótulos curtos `Garantir minha vaga presencial` e `Assistir à transmissão ao vivo`, que não quebram linha (`white-space: nowrap`).

### Regras globais da página
- **Foco:** `:focus-visible { outline: 2px solid var(--mint); outline-offset: 3px; border-radius: 2px; }` em todos os elementos interativos. Exceção única: inputs do modal, que trocam o outline pelo underline de 2px `var(--accent-deep)`.
- **Seleção de texto:** `::selection { background: var(--accent); color: #04110D; }`
- **Scroll:** `html { scroll-behavior: smooth; }` e `[id] { scroll-margin-top: 28px; }` para todas as âncoras.
- **Reduced motion (bloco único):**
```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .hero__numeral { animation: none; }
  .btn, .btn--ghost::before, .topbar__link, .barra,
  .modal__overlay, .modal__card, #metodologia { transition: none; animation: none; }
  @supports (animation-timeline: view()) {
    .mec__row, .refrao, .cta-final__title, .cta-final__p,
    .cta-final__refrao, .cta-final__ctas, .cta-final__end, .cta-final__fine { animation: none; }
  }
}
```
- **Fontes (Google Fonts, um único link, o mesmo já aprovado no index.html):**
`https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=DM+Sans:opsz,wght@9..40,300..700&display=swap` com os dois preconnects (`fonts.googleapis.com` e `fonts.gstatic.com` com crossorigin). Pesos efetivamente usados: Fraunces 300, 400, 450, 500, 600, 650, 700, 750, romano e itálico; DM Sans 300, 400, 500, 700.
- **Z-index (escala fechada):** topbar 20; overlay e cartão do modal 57 e 58; barra mobile 55; grain `body::after` 60, sempre no topo, pointer-events none.
- **Âncoras, na ordem do DOM:**
  1. `#topo` na `<section class="hero">` (destino do logo do topbar)
  2. `#nota-42` no `.hero__note` (destino alternativo do asterisco quando o leitor está no topo; o asterisco padrão aponta para `#metodologia`)
  3. `#ingressos` na seção 10, A Oferta (destino do link "Ingressos" do topbar)
  4. `#inscricao` na seção 12, CTA Final
  5. `#metodologia` no bloco de metodologia do rodapé (destino de todos os asteriscos de 42% da página)
  6. `#sentinela-mec` existe no DOM logo após a seção do mecanismo, mas é sentinela de scroll, nunca destino de navegação.
