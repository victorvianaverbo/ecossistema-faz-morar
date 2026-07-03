# Variantes de Layout - Páginas de Serviço

Especificação compartilhada (substitui layout.md individual das 10 páginas de serviço). Todas usam os mesmos tokens (`/_shared/design-tokens.md`), nav, breadcrumb, footer compacto e a mesma ordem de conteúdo (Hero → O que está incluído → Como funciona → CTA final), mas variam a COMPOSIÇÃO para não parecerem clones. CSS das variantes: `/_shared/base.css`.

## Variante A — Clássica do kit
- Hero: split 1.1fr/.9fr, texto à esquerda, card de fato ESCURO à direita (marca d'água do monograma)
- Incluído: grade 2x2 com moldura de 1px (gap 1px sobre --line)
- Como funciona: bloco escuro, 3 colunas, linha superior verde
- CTA final: grid 1.4fr/1fr com card verde-menta
- Arquetipo: Split Assimétrico + Card de dado · Constraints: Shadow Depth, Hover Lift

## Variante B — Editorial escura
- Hero: bloco escuro full-width, conteúdo em coluna única (max 760px), fato inline como faixa de estatística sob a descrição (borda superior)
- Incluído: linhas editoriais numeradas (01-04), título à esquerda, descrição à direita, divisores horizontais
- Como funciona: timeline VERTICAL clara (linha à esquerda, pontos verdes, max 720px)
- CTA final: banda escura full-width (mesma família da banda de evento da home)
- Arquetipo: Type Hero escuro + Editorial rows · Constraints: Color Blocking invertido, linha timeline

## Variante C — Menta & split
- Hero: split claro, card de fato VERDE-MENTA à direita (texto verde profundo)
- Incluído: seção fundo --mist, grade 2 colunas SEM moldura, chips de check menta, respiro maior
- Como funciona: fundo claro, 3 colunas com números serifados gigantes e divisores verticais
- CTA final: grid com card verde-menta (igual A — o hero e o incluído já diferenciam)
- Arquetipo: Split suave + Sparse · Constraints: Color Blocking menta, tipografia como número

## Variante D — Fato tipográfico
- Hero: split, à direita o fato como BLOCO TIPOGRÁFICO gigante (valor serif ~clamp 64-96px verde profundo, moldura hairline, sem card)
- Incluído: bento 2x2 — primeiro card destacado em menta, demais brancos com moldura
- Como funciona: bloco escuro, 3 colunas com borda ESQUERDA verde (vertical)
- CTA final: banda verde-menta full-width (como CTA do hub)
- Arquetipo: Type as Image + Bento Box · Constraints: Headline gigante, Color Blocking

## Distribuição (remix por componente — cada página tem combinação ÚNICA)

Os heros seguem as variantes A-D acima, mas as seções internas são remixadas de forma que nenhuma das 10 páginas repita a combinação completa de outra, e páginas vizinhas na ordem do hub nunca repitam nenhum componente.

| # | Página | Hero | Incluído | Como funciona | CTA final |
|---|---|---|---|---|---|
| 01 | clube-do-leilao | A (card escuro) | grid 2x2 | escuro linha superior | card menta |
| 02 | cursos | B (editorial escuro) | linhas numeradas | timeline vertical | banda escura |
| 03 | financiamento | C (card menta) | chips soltos | claro números gigantes | card menta |
| 04 | despachante | D (fato tipográfico) | bento | escuro borda esquerda | banda menta |
| 05 | assessoria-habitacional | B | grid 2x2 | claro números gigantes | card menta |
| 06 | corretagem | C | bento | timeline vertical | banda escura |
| 07 | consultoria-sem-corretor | D | linhas numeradas | claro números gigantes | card menta |
| 08 | consorcio | A | chips soltos | timeline vertical | banda menta |
| 09 | seguros | B | bento | escuro borda esquerda | card menta |
| 10 | conta-caixa | C | linhas numeradas | escuro linha superior | banda escura |

## Regras fixas (todas as variantes)
- Nav com link ativo (`.is-active`) coerente com a página (Leilões/Cursos/Financiamento/Serviços)
- Hero SEM animação de entrada; AOS fade-up (650ms, once, disableMutationObserver) apenas nas seções seguintes
- Títulos fixos: "Cada detalhe resolvido por nós." (incluído) e "Simples, do primeiro contato ao resultado." (passos) e "Pronto para dar o próximo passo?" (CTA)
- CTAs: primário conforme copy.md da página; secundário sempre WhatsApp
- Footer compacto (logo + copyright + WhatsApp)
- prefers-reduced-motion respeitado; focus-visible verde
