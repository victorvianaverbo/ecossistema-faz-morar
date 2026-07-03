---
name: tracking
description: Use when the user wants to add tracking, analytics, pixels, GTM, Google Tag Manager, Meta Pixel, Facebook Pixel, conversion tracking, or event tracking to their landing page.
---

# Skill: Tracking

Google Tag Manager (GTM) e Meta Pixel (Facebook/Instagram) para landing pages.

---

## Cenarios de Uso

| Cenario | Solucao |
|---------|---------|
| Apenas anuncios Meta (Facebook/Instagram) | Meta Pixel direto |
| Apenas Google Ads / GA4 | GTM |
| Meta + Google Ads / GA4 | GTM + Meta Pixel direto |
| Multi-plataforma (Meta, Google, TikTok, etc.) | GTM gerenciando tudo |

**Recomendacao padrao:** GTM + Meta Pixel direto. GTM cuida de GA4 e Google Ads. Pixel direto e mais simples e confiavel para Meta.

---

## 1. Google Tag Manager (GTM)

### Snippet no HTML

Adicionar em TODAS as paginas (index.html e obrigado.html):

```html
<head>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
  <!-- End Google Tag Manager -->

  <!-- ... resto do head ... -->
</head>
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

  <!-- ... resto do body ... -->
```

**IMPORTANTE:**
- Substituir `GTM-XXXXXXX` pelo ID real do container
- O snippet do `<head>` deve ficar o MAIS ALTO possivel (antes de qualquer outro script)
- O `<noscript>` deve ficar IMEDIATAMENTE apos abrir `<body>`

### dataLayer - Eventos Customizados

O `script.js` do template ja envia `generate_lead` no submit do formulario. Para eventos adicionais:

```javascript
// Evento customizado generico
dataLayer.push({
  event: 'nome_do_evento',
  parametro1: 'valor1',
  parametro2: 'valor2'
});
```

### Eventos ja enviados automaticamente pelo template

| Evento | Quando | Dados |
|--------|--------|-------|
| `generate_lead` | Form submit com sucesso | `form_name`, `method: 'netlify_form'` |

### Eventos recomendados para configurar no GTM Dashboard

**Triggers (Acionadores):**

| Trigger | Tipo | Configuracao |
|---------|------|-------------|
| Page View - Todas | Page View | Disparar em todas as paginas |
| Page View - Obrigado | Page View | URL contem `/obrigado` |
| Form Submit | Custom Event | Event name = `generate_lead` |
| Scroll 50% | Scroll Depth | Vertical, 50% |
| Scroll 90% | Scroll Depth | Vertical, 90% |
| CTA Click | Click - All Elements | Click Classes contem `btn` |

**Tags sugeridas:**

| Tag | Tipo | Trigger | Uso |
|-----|------|---------|-----|
| GA4 - Config | Google Analytics: GA4 Configuration | All Pages | Tracking basico |
| GA4 - Conversao Lead | GA4 Event | Form Submit | Marcar conversao |
| GA4 - Scroll Depth | GA4 Event | Scroll 50%, 90% | Engajamento |
| Google Ads - Conversao | Google Ads Conversion Tracking | Page View - Obrigado | Conversao de anuncio |
| Google Ads - Remarketing | Google Ads Remarketing | All Pages | Listas de remarketing |

---

## 2. Meta Pixel (Facebook/Instagram)

### Codigo Base

Adicionar no `<head>` de TODAS as paginas:

```html
<head>
  <!-- Meta Pixel Code -->
  <script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'PIXEL_ID_AQUI');
  fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=PIXEL_ID_AQUI&ev=PageView&noscript=1"/></noscript>
  <!-- End Meta Pixel Code -->
</head>
```

**IMPORTANTE:** Substituir `PIXEL_ID_AQUI` pelo ID numerico do Pixel.

### Onde encontrar o Pixel ID

1. Abrir **Meta Events Manager**: https://business.facebook.com/events_manager
2. Selecionar o Pixel
3. O ID numerico aparece abaixo do nome (ex: `123456789012345`)

### Eventos Padrao do Meta Pixel

O template ja dispara `Lead` automaticamente no submit do formulario.

| Evento | Quando | Quem dispara |
|--------|--------|-------------|
| `PageView` | Carregamento da pagina | Codigo base (automatico) |
| `Lead` | Form submit com sucesso | `script.js` (automatico) |

### Eventos adicionais (se necessario)

```javascript
// Na pagina de obrigado
fbq('track', 'CompleteRegistration');

// Clique em botao de WhatsApp
fbq('track', 'Contact');

// Visualizacao de video
fbq('track', 'ViewContent', {
  content_name: 'Video depoimento',
  content_type: 'video'
});
```

### Pagina de Obrigado

A pagina de obrigado deve ter o **mesmo Pixel com PageView**, mas NAO precisa de `Lead` (ja foi disparado no submit):

```html
<head>
  <!-- Meta Pixel Code (MESMO codigo base, MESMO Pixel ID) -->
  <script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'PIXEL_ID_AQUI');
  fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=PIXEL_ID_AQUI&ev=PageView&noscript=1"/></noscript>
  <!-- End Meta Pixel Code -->
</head>
```

### Conversions API (CAPI) - Opcional Avancado

Para tracking server-side (mais preciso com bloqueadores):
- Configurar no Meta Events Manager
- Requer backend (Netlify Functions ou Zapier/Make)
- Fora do escopo deste template (HTML estatico)

---

## 3. Ordem dos Scripts no `<head>`

A ordem importa. Seguir esta sequencia:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO -->
  <title>...</title>
  <meta name="description" content="...">

  <!-- 1. GTM (PRIMEIRO - precisa capturar tudo) -->
  <script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

  <!-- 2. Meta Pixel (SEGUNDO - precisa do PageView cedo) -->
  <script>!function(f,b,e,v,n,t,s){...}; fbq('init','PIXEL_ID'); fbq('track','PageView');</script>
  <noscript>...</noscript>

  <!-- 3. Open Graph -->
  <meta property="og:title" content="...">

  <!-- 4. Favicon, Fonts, CSS -->
  <link rel="icon" ...>
  <link rel="preconnect" ...>
  <link rel="stylesheet" ...>

  <!-- 5. Scripts da pagina -->
  <script src="..." defer></script>
</head>
```

---

## 4. Performance

### Impacto no PageSpeed

GTM e Meta Pixel sao scripts terceiros. Impacto tipico:
- **TBT:** +50-150ms (execucao do JS)
- **Score:** -3 a -8 pontos (aceitavel para tracking)

### Otimizacao (se score for critico)

Se o PageSpeed Score for prioridade maxima, usar carregamento adiado:

```html
<script>
// Adia GTM e Pixel para apos idle do browser
function loadTracking() {
  // GTM
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');

  // Meta Pixel
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window,document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'PIXEL_ID_AQUI');
  fbq('track', 'PageView');
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(loadTracking);
} else {
  setTimeout(loadTracking, 2000);
}
</script>
```

**ATENCAO:** O carregamento adiado pode:
- Perder PageViews de usuarios que saem muito rapido (<2s)
- Causar discrepancia nos dados de analytics
- **Recomendacao:** SO usar se a nota do PageSpeed for realmente critica. Na maioria dos casos, o carregamento normal e preferivel.

---

## 5. Verificacao e Debug

### Meta Pixel

1. **Meta Pixel Helper** (extensao Chrome): https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc
   - Mostra quais eventos foram disparados
   - Verifica se o Pixel esta ativo

2. **Events Manager**: https://business.facebook.com/events_manager
   - Aba "Test Events" > digitar URL > clicar "Open Website"
   - Navegar no site e verificar eventos em tempo real

3. **Console do browser:**
   ```javascript
   // Verificar se fbq existe
   typeof fbq // deve retornar "function"
   ```

### GTM

1. **GTM Preview Mode**: No dashboard GTM > clicar "Preview"
   - Abre o site com painel de debug
   - Mostra quais tags dispararam e quais nao
   - Mostra eventos do dataLayer

2. **Google Tag Assistant** (extensao Chrome): Verifica todas as tags Google

3. **Console do browser:**
   ```javascript
   // Ver todos os eventos do dataLayer
   dataLayer
   ```

### Checklist de Verificacao

- [ ] Pixel Helper mostra PageView no carregamento
- [ ] Pixel Helper mostra Lead apos submit do form
- [ ] GTM Preview mostra tags disparando corretamente
- [ ] Events Manager recebe eventos em Test Events
- [ ] Pagina de obrigado tem o mesmo Pixel/GTM instalado
- [ ] Nao ha erros no console relacionados a tracking
- [ ] PageSpeed Score nao caiu mais que 10 pontos

---

## 6. Erros Comuns

### Pixel/GTM nao dispara

1. Verificar se o ID esta correto
2. Verificar se o snippet esta no `<head>` (nao no body)
3. Verificar se nao ha bloqueador de anuncios ativo
4. Testar em aba anonima

### Lead nao e registrado

1. Verificar console apos submit do form
2. Verificar se `typeof fbq === 'function'` retorna true
3. Verificar se o form submit esta funcionando (Network tab)
4. O evento Lead e disparado ANTES do redirect - se o redirect for muito rapido, pode nao completar. O template ja cuida disso (dispara Lead, depois faz redirect).

### Eventos duplicados

1. Verificar se o Pixel NAO esta no GTM E no HTML ao mesmo tempo (exceto se intencional)
2. Verificar se Lead NAO esta sendo disparado na pagina de obrigado (ja foi no submit)
3. Verificar se nao ha dois snippets do mesmo Pixel na pagina

### GTM nao aparece no preview

1. Verificar se o container foi publicado (GTM exige publicar apos fazer alteracoes)
2. Verificar se o ID do container esta correto
3. Limpar cache do browser

---

## 7. Mapeamento de Eventos para Anuncios

### Meta Ads (Facebook/Instagram)

| Objetivo do Anuncio | Evento para Otimizar | Onde Disparar |
|---------------------|---------------------|--------------|
| Gerar leads | Lead | Submit do form |
| Trafego | PageView | Automatico |
| Conversoes | CompleteRegistration | Pagina obrigado |
| Engajamento | ViewContent | Automatico |

### Google Ads

| Objetivo | Conversao no Google Ads | Trigger no GTM |
|----------|------------------------|----------------|
| Gerar leads | Conversao "Lead" | Custom Event: `generate_lead` |
| Trafego qualificado | Conversao "Page View Obrigado" | Page View com URL `/obrigado` |
| Engajamento | Conversao "Scroll 90%" | Scroll Depth 90% |

---

## 8. Template de Configuracao

Ao configurar tracking, colete do usuario:

```
TRACKING CONFIGURATION
======================
GTM Container ID: GTM-_______
Meta Pixel ID: _______________

Eventos desejados:
[ ] PageView (automatico)
[ ] Lead no form submit (automatico)
[ ] Scroll depth
[ ] Click em CTAs
[ ] Conversao na pagina de obrigado

Plataformas de anuncio:
[ ] Meta Ads (Facebook/Instagram)
[ ] Google Ads
[ ] GA4
[ ] TikTok Ads
[ ] Outro: _______________
```
