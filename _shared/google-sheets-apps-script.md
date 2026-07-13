# Leads na planilha (Google Sheets + Apps Script) — ATIVO

Cada inscrição vira uma linha na planilha, na hora, com nome, e-mail, WhatsApp e as UTMs da campanha.

## Planilha

**Leads Leilão e Prosa | 28/07**
https://docs.google.com/spreadsheets/d/1MPa3yfvFr3v6B5P_tYh6cflh-iRX1LAhhnJGUxZ30MY/edit

Colunas: Data · Nome · E-mail · WhatsApp · utm_source · utm_medium · utm_campaign · utm_content · utm_term · fbclid · Origem · Referrer

## Endpoint em uso (testado e gravando)

```
https://script.google.com/macros/s/AKfycbyLtO5zEO-FP-Scak6uOIL69bMyN7x0dszD-KDd37xqQqEtjOP30gZy6o86t-7B_b87/exec
```

Configurado no atributo `data-sheets` do formulário em `evento/index.html`.

Configuração da implantação (App da Web):
- Executar como: **Eu** (dono da planilha)
- Quem pode acessar: **Qualquer pessoa**

ATENÇÃO: ao criar uma implantação NOVA, o Google reseta "Quem pode acessar" para o padrão restrito e a URL muda.
Para atualizar o código sem quebrar o site, use **Gerenciar implantações > lápis > Versão: Nova versão**.

## Código do script (referência)

Abra a planilha, vá em **Extensões > Apps Script**, apague o que estiver lá e cole:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var d = e.parameter;

  sheet.appendRow([
    new Date(),
    d.nome || '',
    d.email || '',
    d.telefone || '',
    d.utm_source || '',
    d.utm_medium || '',
    d.utm_campaign || '',
    d.utm_content || '',
    d.utm_term || '',
    d.fbclid || '',
    d.pagina || '',
    d.referrer || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Salve (ícone do disquete).

## Passo 2: publicar

1. Clique em **Implantar > Nova implantação**
2. No ícone de engrenagem, escolha **App da Web**
3. Configure:
   - Executar como: **Eu** (sua conta)
   - Quem pode acessar: **Qualquer pessoa**
4. Clique em **Implantar** e autorize (o Google mostra um aviso: clique em "Avançado" e depois em "Acessar projeto sem título")
5. Copie a **URL do app da Web** (começa com `https://script.google.com/macros/s/.../exec`)

## Passo 3: me mande a URL

Eu colo no atributo `data-sheets` do formulário do evento e faço o deploy. Fica assim:

```html
<form name="evento" data-sheets="https://script.google.com/macros/s/SUA_URL/exec" data-redirect="/evento/obrigado/">
```

## Como as UTMs são capturadas

O `forms.js` lê as UTMs da URL na **primeira visita** e guarda na sessão do navegador. Assim, se a pessoa
chega por um anúncio (`?utm_source=facebook&utm_campaign=leilao-prosa`), navega pelo site e só depois se
cadastra, a origem continua junto do lead.

Campos capturados automaticamente: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`,
`fbclid` (clique do Facebook), `gclid` (clique do Google), o `referrer` e a página onde o cadastro aconteceu.

## Exemplo de link para os anúncios

```
https://SEU-DOMINIO/evento/?utm_source=facebook&utm_medium=cpc&utm_campaign=leilao-prosa-28-07&utm_content=video-01
```

## Teste depois de publicar

1. Abra a página do evento com UTMs na URL (o exemplo acima)
2. Preencha o modal com dados de teste
3. Confira se a linha apareceu na planilha, com as UTMs preenchidas
