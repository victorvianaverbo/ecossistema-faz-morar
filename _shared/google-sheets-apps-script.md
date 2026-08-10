# Planilha de leads · Apps Script

Como os leads da landing page chegam no Google Sheets, como a planilha é organizada e como republicar o script sem derrubar a captura do site.

---

## A planilha

- Nome: **Leads Leilão e Prosa**
- URL: https://docs.google.com/spreadsheets/d/1MPa3yfvFr3v6B5P_tYh6cflh-iRX1LAhhnJGUxZ30MY/edit
- ID: `1MPa3yfvFr3v6B5P_tYh6cflh-iRX1LAhhnJGUxZ30MY`

### Estrutura de abas

| Aba | O que é |
|---|---|
| `Resumo` | Painel. Um seletor em `B1` escolhe a edição e todos os números acompanham. |
| `Edicao 26-08-2026` | Uma aba por edição do evento, criada automaticamente pelo script. |
| `Historico 28-07-2026` | A aba original, com os 36 leads de julho e as anotações de ligação. Congelada. |
| `_Falhas` | Criada só se algum envio der erro, guardando o payload cru. |

### Colunas de uma aba de edição

`Data · Nome · WhatsApp · E-mail · Modalidade · Status · Observação da ligação · utm_source · utm_medium · utm_campaign · utm_content · utm_term · fbclid · gclid · Referrer · Origem · Evento`

A ordem é a de quem trabalha a lista: contato e modalidade primeiro (quem escolhe online costuma morar fora de BH, e isso muda a conversa), as duas colunas da equipe em seguida, e o rastro de mídia no fim.

---

## Regras que este script respeita

**1. Nunca escrever na aba histórica.** A aba de destino é resolvida exclusivamente por nome derivado do campo `evento`. Não existe `getSheets()[0]` nem índice numérico em lugar nenhum do código, então uma aba chamada `Historico 28-07-2026` jamais é alvo de escrita, aconteça o que acontecer com o payload.

**2. Nunca inserir ou mover coluna em aba existente.** A versão anterior deste documento mandava acrescentar duas colunas na aba de julho para acomodar `evento` e `modalidade`. Isso desalinharia as 36 linhas e deslocaria a coluna manual `OBSERVAÇÃO DA LIGAÇÃO`. A solução passou a ser aba nova por edição, com o layout certo desde o começo.

**3. Telefone é texto.** O `appendRow` grava com semântica de fórmula: um número começando com `+55` vira `#ERROR!`. Foi o que aconteceu com dois leads reais de julho (Gibran Silva e Alan Santos, dia 21), cujos telefones se perderam. Agora a coluna nasce formatada como texto e o script remove o `+` inicial.

**4. IDs de campanha são texto.** Os `utm_campaign` do Meta têm 18 dígitos e o Sheets só garante 15 de precisão. Todas as colunas de tracking nascem como texto puro.

---

## O script

Cole no editor (Extensões > Apps Script), substituindo todo o conteúdo de `Código.gs`.

```javascript
/**
 * Leads Leilão & Prosa — recebe as inscrições da LP e organiza por edição.
 *
 * O QUE ESTE SCRIPT NUNCA FAZ:
 *   - Nunca escreve na aba histórica. A aba de destino é resolvida SÓ pelo nome
 *     derivado do campo "evento". Não existe getSheets()[0] em lugar nenhum.
 *   - Nunca insere nem move coluna em aba existente.
 *
 * Publicação: Implantar > Gerenciar implantações > lápis > Versão: Nova versão.
 * NUNCA "Nova implantação": ela troca a URL /exec e derruba o formulário do site.
 */

var VERSAO = '2026-08-10';

// ---------------------------------------------------------------- configuração
var FUSO                   = 'America/Sao_Paulo';
var ABA_RESUMO             = 'Resumo';
var ABA_FALHAS             = '_Falhas';
var ABA_SEM_EDICAO         = 'Edicao sem data';
var EDICAO_ATUAL           = '2026-08-26';  // mesmo valor do input hidden "evento"
var JANELA_DUPLICIDADE_MIN = 10;

var COLUNAS = [
  'Data', 'Nome', 'WhatsApp', 'E-mail', 'Modalidade',
  'Status', 'Observação da ligação',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'fbclid', 'gclid', 'Referrer', 'Origem', 'Evento'
];
var LARGURAS = [140, 210, 145, 250, 105, 145, 420, 105, 105, 165, 165, 165, 220, 220, 200, 110, 105];

var COL_DATA = 1, COL_FONE = 3, COL_STATUS = 6, COL_TRACKING = 8;

// Status da lista suspensa: valor, fundo, cor do texto.
var STATUS = [
  ['Novo',             '#EFEFEF', '#3C4043'],
  ['Tentando contato', '#FFF2CC', '#7F6000'],
  ['Falei',            '#D9E7FD', '#1B4586'],
  ['Vai comprar',      '#FCE5CD', '#8B4000'],
  ['Comprou',          '#D9EAD3', '#274E13'],
  ['Não vai',          '#F4CCCC', '#7B1E1E'],
  ['Contato inválido', '#D9D9D9', '#666666']
];

// ---------------------------------------------------------------- entrada HTTP

function doPost(e) {
  try {
    var d = (e && e.parameter) ? e.parameter : {};

    // Honeypot. O campo "bot-field" fica escondido no modal: se veio preenchido,
    // quem preencheu foi robô. Responde ok para o bot não perceber e não grava.
    if (String(d['bot-field'] || '').trim() !== '') {
      return resposta({ ok: true, ignorado: 'bot' });
    }

    // Envio sem nenhum dado de contato não vira linha.
    if (!String(d.nome || '').trim() &&
        !String(d.email || '').trim() &&
        !String(d.telefone || '').trim()) {
      return resposta({ ok: false, erro: 'sem dados de contato' });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);  // dois envios ao mesmo tempo não brigam pela mesma linha
    try {
      var ss    = SpreadsheetApp.getActiveSpreadsheet();
      var aba   = obterAbaEdicao(ss, d.evento);
      var agora = new Date();

      if (ehDuplicado(aba, d, agora)) {
        return resposta({ ok: true, duplicado: true });
      }
      gravarLead(aba, d, agora);
    } finally {
      lock.releaseLock();
    }

    return resposta({ ok: true });

  } catch (err) {
    // O front usa mode:'no-cors' e não lê a resposta. Sem este registro, um lead
    // que falha some sem deixar rastro.
    registrarFalha(e, err);
    return resposta({ ok: false, erro: String(err) });
  }
}

function doGet() {
  // Serve para conferir no navegador se a implantação está de pé.
  return resposta({ ok: true, servico: 'Leads Leilao e Prosa', versao: VERSAO });
}

function resposta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------- gravação

function gravarLead(aba, d, agora) {
  var linha = aba.getLastRow() + 1;

  // A aba nasce com 1000 linhas. Antes de estourar, abre mais 500 e reformata.
  if (linha > aba.getMaxRows()) {
    aba.insertRowsAfter(aba.getMaxRows(), 500);
    formatarAbaEdicao(aba);
  }

  var valores = [
    agora,                                    // Date de verdade, não string
    texto(d.nome),
    telefone(d.telefone),
    String(d.email || '').trim().toLowerCase(),
    texto(d.modalidade),
    'Novo',                                   // Status inicial
    '',                                       // Observação: só a equipe escreve
    texto(d.utm_source), texto(d.utm_medium), texto(d.utm_campaign),
    texto(d.utm_content), texto(d.utm_term),
    texto(d.fbclid), texto(d.gclid),
    texto(d.referrer), texto(d.pagina), texto(d.evento)
  ];

  aba.getRange(linha, 1, 1, COLUNAS.length).setValues([valores]);
}

function texto(v) {
  return String(v == null ? '' : v).trim();
}

/**
 * O Sheets grava com semântica "user-entered": um telefone que começa com "+"
 * vira tentativa de fórmula e resulta em #ERROR!. Isso já apagou dois telefones
 * reais na aba de julho. A coluna nasce como texto puro, e aqui vai a segunda trava.
 */
function telefone(v) {
  var s = texto(v);
  if (/^\+\d/.test(s)) s = s.substring(1);      // "+5531..." vira "5531..."
  s = s.replace(/^[=\-@]+/, '');                // qualquer outro gatilho de fórmula
  return s;
}

function somenteDigitos(v) {
  return String(v == null ? '' : v).replace(/\D/g, '');
}

/**
 * Duplicidade: mesmo e-mail OU mesmo telefone dentro da janela, na mesma edição.
 * Lê no máximo 50 linhas e para assim que passa da janela. Não deduplica entre
 * edições: quem se inscreveu em julho e volta em agosto é lead novo.
 */
function ehDuplicado(aba, d, agora) {
  var ultima = aba.getLastRow();
  if (ultima < 2) return false;

  var inicio = Math.max(2, ultima - 49);
  var dados  = aba.getRange(inicio, 1, ultima - inicio + 1, 4).getValues();
  var email  = String(d.email || '').trim().toLowerCase();
  var fone   = somenteDigitos(d.telefone);
  var limite = JANELA_DUPLICIDADE_MIN * 60 * 1000;

  for (var i = dados.length - 1; i >= 0; i--) {
    var quando = dados[i][0];
    if (!(quando instanceof Date)) continue;
    if (agora.getTime() - quando.getTime() > limite) break;   // daqui para trás é antigo
    if (email && String(dados[i][3]).trim().toLowerCase() === email) return true;
    if (fone  && somenteDigitos(dados[i][2]) === fone)             return true;
  }
  return false;
}

function registrarFalha(e, err) {
  try {
    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName(ABA_FALHAS);
    if (!aba) {
      aba = ss.insertSheet(ABA_FALHAS, ss.getNumSheets());
      aba.appendRow(['Quando', 'Erro', 'Dados recebidos']);
      aba.setFrozenRows(1);
      aba.getRange(1, 1, 1, 3).setFontWeight('bold');
    }
    aba.appendRow([new Date(), String(err), JSON.stringify((e && e.parameter) || {})]);
  } catch (ignorado) {}
}

// ---------------------------------------------------------------- abas

/**
 * "2026-08-26" vira "Edicao 26-08-2026". Sem acento de propósito: o nome entra
 * dentro de fórmulas INDIRECT no Resumo, e nome simples não dá dor de cabeça.
 */
function nomeDaAba(evento) {
  var v = texto(evento);
  var m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return 'Edicao ' + m[3] + '-' + m[2] + '-' + m[1];
  if (v)  return 'Edicao ' + v.replace(/[\\\/\?\*\[\]:]/g, '-').substring(0, 60);
  return ABA_SEM_EDICAO;                       // formulário antigo em cache, por exemplo
}

function obterAbaEdicao(ss, evento) {
  var nome = nomeDaAba(evento);
  var aba  = ss.getSheetByName(nome);
  if (aba) return aba;
  return criarAbaEdicao(ss, nome);
}

function criarAbaEdicao(ss, nome) {
  // Entra logo depois do Resumo, para a edição mais nova ficar sempre à vista.
  var posicao = ss.getSheetByName(ABA_RESUMO) ? 1 : 0;
  var aba = ss.insertSheet(nome, posicao);
  formatarAbaEdicao(aba);
  apontarResumoPara(ss, nome);
  return aba;
}

/** Idempotente: pode rodar quantas vezes quiser na mesma aba. */
function formatarAbaEdicao(aba) {
  var n      = COLUNAS.length;
  var linhas = Math.max(1, aba.getMaxRows() - 1);

  aba.getRange(1, 1, 1, n)
     .setValues([COLUNAS])
     .setFontWeight('bold')
     .setBackground('#1F2A24')
     .setFontColor('#FFFFFF')
     .setVerticalAlignment('middle');
  aba.setFrozenRows(1);
  aba.setFrozenColumns(3);            // Data, Nome e WhatsApp ficam presos ao rolar
  aba.setRowHeight(1, 34);

  for (var i = 0; i < LARGURAS.length; i++) aba.setColumnWidth(i + 1, LARGURAS[i]);

  if (aba.getMaxColumns() > n) aba.deleteColumns(n + 1, aba.getMaxColumns() - n);

  // Formatos. Texto puro em tudo que pode ser confundido com fórmula ou número
  // grande: telefone, utm (IDs de 18 dígitos), fbclid, gclid, referrer, origem
  // e a data da edição, que senão o Sheets converteria em data.
  aba.getRange(2, COL_DATA, linhas, 1).setNumberFormat('dd/MM/yyyy HH:mm');
  aba.getRange(2, COL_FONE, linhas, 1).setNumberFormat('@');
  aba.getRange(2, COL_TRACKING, linhas, n - COL_TRACKING + 1).setNumberFormat('@');
  aba.getRange(2, 7, linhas, 1).setWrap(true);           // Observação quebra linha
  aba.getRange(1, 1, aba.getMaxRows(), n).setVerticalAlignment('top');

  aplicarStatus(aba, linhas, n);

  if (!aba.getFilter()) aba.getRange(1, 1, aba.getMaxRows(), n).createFilter();
}

function aplicarStatus(aba, linhas, n) {
  var alvo  = aba.getRange(2, COL_STATUS, linhas, 1);
  var lista = STATUS.map(function (s) { return s[0]; });

  alvo.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(lista, true)
      .setAllowInvalid(false)
      .setHelpText('Escolha um status da lista.')
      .build()
  );

  var regras = [];
  STATUS.forEach(function (s) {
    regras.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(s[0])
      .setBackground(s[1]).setFontColor(s[2]).setBold(true)
      .setRanges([alvo]).build());
  });
  // A linha inteira ganha fundo verde quando o lead comprou. Vem por último
  // porque a primeira regra que casa é a que vale, e as de cima só pegam a coluna F.
  regras.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$F2="Comprou"')
    .setBackground('#F2F8F0')
    .setRanges([aba.getRange(2, 1, linhas, n)]).build());

  aba.setConditionalFormatRules(regras);
}

// ---------------------------------------------------------------- Resumo

function abasDeEdicao(ss) {
  return ss.getSheets()
    .map(function (s) { return s.getName(); })
    .filter(function (nome) {
      return nome.indexOf('Edicao ') === 0 || nome === ABA_SEM_EDICAO;
    });
}

function apontarResumoPara(ss, nomeAba) {
  var r = ss.getSheetByName(ABA_RESUMO) || criarResumo(ss);
  r.getRange('B1').setValue(nomeAba);
  atualizarSeletor(ss, r);
}

function atualizarSeletor(ss, resumo) {
  var lista = abasDeEdicao(ss);
  if (!lista.length) return;
  resumo.getRange('B1').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(lista, true)
      .setAllowInvalid(false)
      .setHelpText('Escolha a edição que você quer analisar.')
      .build()
  );
}

/**
 * Painel único. Tudo aponta para a aba escolhida em B1 via INDIRECT, então
 * continua funcionando quando surgir a edição de setembro, outubro, etc.
 */
function criarResumo(ss) {
  var r = ss.getSheetByName(ABA_RESUMO);
  if (!r) r = ss.insertSheet(ABA_RESUMO, 0);
  ss.setActiveSheet(r);
  ss.moveActiveSheet(1);

  // atalho para "a aba escolhida em B1, intervalo X"
  function R(intervalo) {
    return 'INDIRECT("\'"&$B$1&"\'!' + intervalo + '")';
  }

  r.getRange('A1').setValue('Edição em análise:').setFontWeight('bold');
  r.getRange('C1').setValue('Troque a edição no seletor ao lado. Todos os números abaixo acompanham.')
                  .setFontColor('#777777').setFontStyle('italic');

  var rotulos = [
    ['A3', 'OS NÚMEROS'], ['A4', 'Total de leads'], ['A5', 'Presencial'],
    ['A6', 'Online'], ['A7', 'Já contatados'], ['A8', '% já contatados'],
    ['A9', 'Vão comprar'], ['A10', 'Compraram'],
    ['A12', 'POR STATUS'], ['D12', 'POR DIA'], ['G12', 'POR utm_source'],
    ['J12', 'POR CAMPANHA'], ['M12', 'POR REFERRER']
  ];
  rotulos.forEach(function (x) { r.getRange(x[0]).setValue(x[1]); });
  ['A3', 'A12', 'D12', 'G12', 'J12', 'M12'].forEach(function (c) {
    r.getRange(c).setFontWeight('bold').setFontColor('#1F2A24');
  });

  var formulas = [
    ['B4',  '=IFERROR(COUNTA(' + R('B2:B') + '),0)'],
    ['B5',  '=IFERROR(COUNTIF(' + R('E2:E') + ',"presencial"),0)'],
    ['B6',  '=IFERROR(COUNTIF(' + R('E2:E') + ',"online"),0)'],
    ['B7',  '=IFERROR(COUNTA(' + R('F2:F') + ')-COUNTIF(' + R('F2:F') + ',"Novo"),0)'],
    ['B8',  '=IFERROR(B7/B4,0)'],
    ['B9',  '=IFERROR(COUNTIF(' + R('F2:F') + ',"Vai comprar"),0)'],
    ['B10', '=IFERROR(COUNTIF(' + R('F2:F') + ',"Comprou"),0)'],

    ['A13', '=IFERROR(QUERY(' + R('F2:F') + ', "select Col1, count(Col1) where Col1 is not null group by Col1 order by count(Col1) desc label Col1 \'Status\', count(Col1) \'Leads\'", 0), "")'],
    ['D13', '=IFERROR(QUERY(' + R('A2:A') + ', "select toDate(Col1), count(Col1) where Col1 is not null group by toDate(Col1) order by toDate(Col1) label toDate(Col1) \'Dia\', count(Col1) \'Leads\'", 0), "")'],
    ['G13', '=IFERROR(QUERY(' + R('H2:H') + ', "select Col1, count(Col1) where Col1 is not null and Col1 != \'\' group by Col1 order by count(Col1) desc label Col1 \'utm_source\', count(Col1) \'Leads\'", 0), "")'],
    ['J13', '=IFERROR(QUERY(' + R('J2:J') + ', "select Col1, count(Col1) where Col1 is not null and Col1 != \'\' group by Col1 order by count(Col1) desc label Col1 \'Campanha\', count(Col1) \'Leads\'", 0), "")'],
    ['M13', '=IFERROR(QUERY(' + R('O2:O') + ', "select Col1, count(Col1) where Col1 is not null and Col1 != \'\' group by Col1 order by count(Col1) desc label Col1 \'Referrer\', count(Col1) \'Leads\'", 0), "")']
  ];
  formulas.forEach(function (f) { r.getRange(f[0]).setFormula(f[1]); });

  r.getRange('B8').setNumberFormat('0%');
  r.getRange('B4:B10').setFontSize(12).setFontWeight('bold').setHorizontalAlignment('left');
  r.setColumnWidth(1, 210); r.setColumnWidth(2, 110);
  r.setColumnWidth(4, 130); r.setColumnWidth(5, 80);
  r.setColumnWidth(7, 180); r.setColumnWidth(8, 80);
  r.setColumnWidth(10, 220); r.setColumnWidth(11, 80);
  r.setColumnWidth(13, 260); r.setColumnWidth(14, 80);
  r.setHiddenGridlines(true);

  return r;
}

// ---------------------------------------------------------------- utilitários

/**
 * Rode UMA VEZ no editor. Monta a estrutura inteira sem depender de lead chegando.
 * Não escreve célula nenhuma em aba que não seja Resumo ou Edicao *.
 */
function configurarPlanilha() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(FUSO);

  criarResumo(ss);

  var nome = nomeDaAba(EDICAO_ATUAL);
  var aba  = ss.getSheetByName(nome);
  if (!aba) { criarAbaEdicao(ss, nome); }
  else      { formatarAbaEdicao(aba); apontarResumoPara(ss, nome); }

  ss.setActiveSheet(ss.getSheetByName(ABA_RESUMO));
  Logger.log('Pronto. Abas de edição: ' + abasDeEdicao(ss).join(', '));
}

/**
 * OPCIONAL. Coloca proteção com aviso na aba histórica: quem for editar recebe
 * um "tem certeza?" antes. Não altera dado nenhum, e é reversível pelo menu
 * Dados > Proteger páginas e intervalos.
 */
function protegerHistorico() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.getSheets().forEach(function (aba) {
    var nome = aba.getName();
    if (nome === ABA_RESUMO || nome === ABA_FALHAS || nome.indexOf('Edicao ') === 0) return;
    var cabecalho = aba.getRange(1, 1, 1, Math.min(20, aba.getMaxColumns()))
                       .getValues()[0].join('|').toUpperCase();
    if (cabecalho.indexOf('OBSERVAÇÃO DA LIGAÇÃO') === -1) return;
    aba.protect().setWarningOnly(true)
        .setDescription('Aba histórica da edição de julho. Não editar.');
    Logger.log('Protegida: ' + nome);
  });
}

/** Grava uma linha falsa para conferir o layout. Apague a linha depois. */
function testeDeGravacao() {
  doPost({ parameter: {
    nome: 'TESTE - APAGAR', email: 'teste@exemplo.com', telefone: '+5531999999999',
    evento: EDICAO_ATUAL, modalidade: 'online',
    utm_source: 'teste', utm_medium: 'teste', utm_campaign: '120248713786420553',
    fbclid: 'PAtesteXYZ', gclid: 'CjTesteXYZ',
    referrer: 'https://instagram.com/', pagina: '/evento/'
  }});
}
```

### Por que `getActiveSpreadsheet()` e não `openById()`

`openById()` exige um escopo OAuth mais amplo. Trocar o escopo de um Web App já implantado **suspende a execução até alguém reautorizar**, e nesse intervalo o formulário do site grava nada. Nenhuma função usada aqui (`LockService`, `DataValidation`, `ConditionalFormatRule`, `insertSheet`) adiciona escopo novo, então a republicação não tem janela de indisponibilidade.

---

## Passo a passo (uma vez só)

**0. Backup, antes de qualquer outra coisa.** Na planilha: **Arquivo > Fazer uma cópia**, nome `Leads Leilão e Prosa | BACKUP antes do script 10-08`. Confirme que a cópia abriu com as 36 linhas e a coluna de observação preenchida.

**1. Fuso da planilha.** **Arquivo > Configurações** > aba *Geral* > **Fuso horário: (GMT-03:00) São Paulo** > Salvar.

**2. Renomear a aba de julho.** Duplo clique na aba atual, digite `Historico 28-07-2026`, Enter. É a única alteração manual nela.

**3. Colar o script.** **Extensões > Apps Script**, clique no editor, Ctrl+A, Delete, cole o código acima, Ctrl+S.

**4. Fuso do projeto.** Engrenagem à esquerda (*Configurações do projeto*) > **Fuso horário** > `(GMT-03:00) São Paulo`.

**5. Montar a estrutura.** Volte ao *Editor*, no seletor de função escolha **`configurarPlanilha`** e clique em **Executar**. Vai pedir autorização: *Revisar permissões* > sua conta > *Avançado* > *Acessar Projeto sem título (não seguro)* > **Permitir**. O log deve mostrar `Pronto. Abas de edição: Edicao 26-08-2026`.

**6. Conferir.** Na planilha devem existir, nesta ordem: `Resumo`, `Edicao 26-08-2026`, `Historico 28-07-2026`. Abra a de julho e confirme as 36 linhas com a coluna de observação intacta na 13ª posição.

**7. Testar a gravação.** No editor, função **`testeDeGravacao`** > **Executar**. Na aba da edição deve aparecer a linha `TESTE - APAGAR` com o telefone `5531999999999` como texto (sem `#ERROR!`) e a campanha de 18 dígitos íntegra. Confira o `Resumo`: total 1, online 1. Depois apague a linha.

**8. Republicar sem trocar a URL.** **Implantar > Gerenciar implantações**, clique no **lápis** da implantação ativa, em **Versão** escolha **Nova versão**, descrição `abas por edicao, status e resumo`, **Implantar**. Confirme que a URL continua terminando em `...t-7B_b87/exec`.

> **Nunca** use *Implantar > Nova implantação*. Ela gera outra URL, reseta o acesso para restrito e derruba a captura do site sem aviso nenhum.

**9. Teste de ponta a ponta** (depois do deploy do site). Abra `https://fazmorar.com.br/evento/?utm_source=teste&utm_medium=teste&gclid=CjTeste123`, clique em *Vaga em BH*, preencha com nome `TESTE PUBLICACAO` e telefone `+5531988887777`. Confira a linha nova com `Modalidade = presencial` e `gclid = CjTeste123`. Envie de novo em seguida: não pode criar segunda linha. Apague a linha de teste.

**10. Opcional.** Função **`protegerHistorico`** > Executar, para a aba de julho pedir confirmação antes de qualquer edição.

---

## Endpoint publicado

```
https://script.google.com/macros/s/AKfycbyLtO5zEO-FP-Scak6uOIL69bMyN7x0dszD-KDd37xqQqEtjOP30gZy6o86t-7B_b87/exec
```

Implantação como **App da Web**, "Executar como: Eu (dono da planilha)", "Quem pode acessar: Qualquer pessoa". É o valor do atributo `data-sheets` no formulário de `evento/index.html`.

---

## O que o site envia

O `_shared/forms.js` monta o POST com todos os campos `name=` do formulário mais os automáticos:

| Origem | Campos |
|---|---|
| Formulário | `nome`, `email`, `telefone`, `evento`, `modalidade`, `bot-field` |
| UTMs da sessão | `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid` |
| Automáticos | `referrer`, `pagina` |

As UTMs são lidas da query string na primeira visita e guardadas em `sessionStorage` (`clube_utms`), sobrevivendo à navegação entre páginas até o cadastro. Numa visita direta, sem UTM na URL, nada é salvo e o `referrer` cai no `document.referrer` do momento.

O envio usa `mode: 'no-cors'`, então **a página nunca sabe se a gravação deu certo**. É por isso que existe a aba `_Falhas`: sem ela, um erro no script faz o lead sumir em silêncio.
