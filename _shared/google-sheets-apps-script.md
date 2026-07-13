# Leads no Google Sheets (Apps Script)

Cada inscrição vira uma linha na planilha, na hora. Gratuito, sem Zapier e sem mensalidade.
Leva uns 3 minutos para configurar.

## Passo 1: criar a planilha

1. Acesse https://sheets.new e dê um nome (ex.: "Leads Clube do Leilão").
2. Na primeira linha, crie os cabeçalhos, um por coluna:

```
Data | Nome | E-mail | WhatsApp | Origem
```

## Passo 2: colar o script

Na planilha, vá em **Extensões > Apps Script**, apague o que estiver lá e cole:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var dados = e.parameter;

  sheet.appendRow([
    new Date(),
    dados.nome || '',
    dados.email || '',
    dados.telefone || '',
    dados.pagina || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Salve (ícone do disquete).

## Passo 3: publicar

1. Clique em **Implantar > Nova implantação**.
2. No ícone de engrenagem, escolha **App da Web**.
3. Configure:
   - Executar como: **Eu** (sua conta)
   - Quem pode acessar: **Qualquer pessoa**
4. Clique em **Implantar** e autorize o acesso (vai pedir login e mostrar um aviso do Google: clique em "Avançado" e depois em "Acessar projeto sem título").
5. Copie a **URL do app da Web** (começa com `https://script.google.com/macros/s/...`).

## Passo 4: ativar no site

Me mande a URL copiada. Eu coloco no atributo `data-sheets` dos formulários e faço o deploy.

No HTML, o campo fica assim:

```html
<form name="evento" data-netlify="true" data-sheets="https://script.google.com/macros/s/SUA_URL/exec" ...>
```

## Como funciona

Ao enviar o formulário, o lead vai para dois lugares ao mesmo tempo:

1. **Netlify Forms** (painel do site, com exportação em CSV e notificação por e-mail)
2. **Google Sheets** (a planilha, atualizada na hora)

Se a planilha ficar fora do ar, o lead continua salvo no Netlify. Nenhum cadastro se perde.

## Notificação por e-mail (opcional)

Para receber um e-mail a cada novo lead, no painel do Netlify:
**Forms > Form notifications > Add notification > Email notification**.
