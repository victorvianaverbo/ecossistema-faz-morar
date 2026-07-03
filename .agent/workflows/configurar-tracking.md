---
description: configurar-tracking
---

# Instrucoes

O usuario quer configurar tracking (GTM e/ou Meta Pixel) na landing page. Use a skill `tracking` como referencia tecnica.

---

## REGRA DE OURO: Autonomia Total

**VOCE DEVE implementar tudo sozinho.** O usuario so precisa fornecer os IDs e dizer quais eventos quer rastrear.

---

## Etapa 1: Coletar Informacoes

### Identificar a Pasta da Pagina

Identifique em qual pasta da pagina voce esta trabalhando. Os arquivos devem estar dentro da pasta da pagina (ex: `pagina-vendas/`).

### Perguntar ao Usuario

Faca TODAS estas perguntas de uma vez:

**1. Quais plataformas de anuncio voce usa?**
- Meta Ads (Facebook/Instagram)
- Google Ads
- Ambos
- Outro

**2. IDs de tracking:**
- Se Meta Ads: "Qual o ID do seu Pixel do Meta? (numero com ~15 digitos, encontrado em Meta Events Manager > Data Sources)"
- Se Google Ads/GA4: "Qual o ID do seu container GTM? (formato GTM-XXXXXXX, encontrado em tagmanager.google.com)"

**3. Alem do basico (PageView + Lead no form), quer rastrear mais alguma acao?**
- Scroll depth (quanto o usuario rolou)
- Cliques em botoes CTA
- Conversao na pagina de obrigado
- Outro

**4. Ja existe uma pagina de obrigado?** (se sim, qual o caminho)

---

## Etapa 2: Ler a Skill de Referencia

Leia `.agent/skills/tracking/SKILL.md` para ter acesso a todos os snippets e melhores praticas.

---

## Etapa 3: Implementar

### 3.1 Instalar os Snippets

Leia o `index.html` da pasta da pagina.

**Ordem de insercao no `<head>` (respeitar):**

1. **GTM** (se houver) - PRIMEIRO, logo apos as metas iniciais
2. **Meta Pixel** (se houver) - SEGUNDO, apos GTM
3. Open Graph, Favicon, Fonts, CSS - DEPOIS
4. Scripts da pagina - POR ULTIMO

**Para GTM:**
- Adicionar snippet do `<head>` na posicao correta
- Adicionar `<noscript>` imediatamente apos abrir `<body>`
- Substituir `GTM-XXXXXXX` pelo ID real

**Para Meta Pixel:**
- Adicionar codigo base no `<head>` (apos GTM se houver)
- Substituir `PIXEL_ID_AQUI` pelo ID real
- Incluir `<noscript>` img tag

### 3.2 Verificar o script.js

O template ja envia automaticamente:
- `fbq('track', 'Lead')` - Meta Pixel
- `dataLayer.push({ event: 'generate_lead' })` - GTM

Verificar se ambos estao presentes no `handleFormSubmit`. Se nao estiverem, adicionar.

### 3.3 Pagina de Obrigado

Se existir uma pagina de obrigado (ex: `obrigado.html`):
- Adicionar os MESMOS snippets de GTM e Pixel (com os mesmos IDs)
- NAO adicionar evento Lead aqui (ja foi disparado no submit)
- Se quiser marcar conversao especifica, adicionar:

```html
<script>
  // Meta Pixel - conversao na pagina de obrigado (OPCIONAL)
  if (typeof fbq === 'function') fbq('track', 'CompleteRegistration');

  // GTM dataLayer - conversao (OPCIONAL)
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({ event: 'conversion_complete' });
</script>
```

### 3.4 Eventos Adicionais (se solicitados)

**Scroll Depth:**
- Se GTM: configurar no dashboard do GTM (Trigger tipo "Scroll Depth")
- Se sem GTM: adicionar IntersectionObserver no script.js:

```javascript
// Scroll depth tracking
function trackScrollDepth() {
  const thresholds = [25, 50, 75, 90];
  const tracked = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = parseInt(entry.target.dataset.scrollDepth);
        if (!tracked.has(pct)) {
          tracked.add(pct);
          if (typeof fbq === 'function') {
            fbq('trackCustom', 'ScrollDepth', { percentage: pct });
          }
          if (typeof dataLayer !== 'undefined') {
            dataLayer.push({ event: 'scroll_depth', percentage: pct });
          }
        }
      }
    });
  });

  // Criar marcadores invisiveis no HTML
  thresholds.forEach(pct => {
    const marker = document.createElement('div');
    marker.dataset.scrollDepth = pct;
    marker.style.cssText = 'position:absolute;height:1px;width:1px;opacity:0;pointer-events:none;';
    marker.style.top = pct + '%';
    document.body.style.position = 'relative';
    document.body.appendChild(marker);
    observer.observe(marker);
  });
}
trackScrollDepth();
```

**Click em CTAs:**
- Se GTM: configurar no dashboard do GTM (Trigger tipo "Click" com filtro CSS)
- Se sem GTM: adicionar no script.js:

```javascript
// CTA click tracking
document.querySelectorAll('.btn, [data-track-click]').forEach(btn => {
  btn.addEventListener('click', () => {
    const label = btn.textContent.trim() || btn.getAttribute('aria-label') || 'CTA';
    if (typeof fbq === 'function') fbq('trackCustom', 'CTAClick', { label });
    if (typeof dataLayer !== 'undefined') dataLayer.push({ event: 'cta_click', click_label: label });
  });
});
```

---

## Etapa 4: Apresentar Resumo

Apos implementar, informe ao usuario:

### O que foi instalado

```
TRACKING CONFIGURADO
====================
GTM: [Sim/Nao] - Container: GTM-XXXXXXX
Meta Pixel: [Sim/Nao] - ID: XXXXXXXXXXXXXXX

EVENTOS ATIVOS
==============
Pagina principal (index.html):
  - PageView (automatico ao carregar)
  - Lead (automatico no submit do form)
  [- Scroll Depth (se configurado)]
  [- CTA Click (se configurado)]

Pagina de obrigado (obrigado.html):
  - PageView (automatico ao carregar)
  [- CompleteRegistration (se configurado)]

PROXIMOS PASSOS NO DASHBOARD
=============================
[Se GTM]: Configurar tags no dashboard do GTM (tagmanager.google.com)
  - GA4 Configuration tag
  - Google Ads Conversion tag (se usar Google Ads)
  - Publicar o container

[Se Meta]: Verificar eventos no Events Manager (business.facebook.com/events_manager)
  - Usar "Test Events" para validar
  - Configurar conversoes nos conjuntos de anuncios
```

### Como testar

1. **Meta Pixel Helper** (extensao Chrome) - verificar se PageView e Lead disparam
2. **GTM Preview** - clicar "Preview" no dashboard GTM e navegar no site
3. **Events Manager > Test Events** - digitar URL do site e testar

---

## Etapa 5: Testar

Faca voce mesmo as verificacoes possiveis:
- Abra o site localmente (use skill `local-server`)
- Verifique o console por erros
- Verifique se os snippets estao na posicao correta no HTML
- Verifique se os IDs foram substituidos corretamente

**IMPORTANTE:** O teste completo (verificar se eventos chegam nos dashboards) so funciona com o site publicado. Informe ao usuario que apos o `/publicar`, ele deve testar com as ferramentas acima.

---

## Ao Finalizar

1. Informe o que foi configurado (resumo acima)
2. Liste os proximos passos no dashboard (GTM/Meta)
3. Explique como testar
4. Sugira: "Use `/publicar` para colocar o site no ar e depois teste o tracking com as ferramentas indicadas."
5. **PARE COMPLETAMENTE E AGUARDE**

## IMPORTANTE: Regras de Comportamento

- NUNCA continue para outras etapas automaticamente
- NUNCA faca deploy automaticamente
- AGUARDE o usuario digitar o proximo comando
