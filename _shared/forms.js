// Captura de leads: grava no Google Sheets (Apps Script), dispara os eventos de
// conversão (Meta Pixel / GTM) e leva o visitante ao destino.
//
// Atributos no <form>:
//   data-sheets="URL"          -> Apps Script que grava o lead na planilha (obrigatório)
//   data-redirect="URL"        -> destino após o envio
//   data-success-title="..."   -> sem redirect: título da mensagem de sucesso
//   data-success-text="..."    -> sem redirect: texto da mensagem de sucesso
//
// As UTMs são lidas da URL na primeira visita e guardadas na sessão, para
// sobreviverem à navegação entre páginas até o momento do cadastro.

(function () {
  var CHAVE = 'clube_utms';
  var CAMPOS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];

  function guardarUtms() {
    try {
      var url = new URLSearchParams(window.location.search);
      var achou = false;
      var dados = {};

      CAMPOS.forEach(function (campo) {
        var valor = url.get(campo);
        if (valor) {
          dados[campo] = valor;
          achou = true;
        }
      });

      if (!achou) return;

      dados.referrer = document.referrer || '';
      dados.landing = window.location.pathname;
      sessionStorage.setItem(CHAVE, JSON.stringify(dados));
    } catch (e) {}
  }

  function lerUtms() {
    try {
      return JSON.parse(sessionStorage.getItem(CHAVE)) || {};
    } catch (e) {
      return {};
    }
  }

  guardarUtms();

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-sheets], form[data-netlify]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();

        var botao = form.querySelector('[type="submit"]');
        if (botao) {
          botao.disabled = true;
          botao.textContent = 'Enviando...';
        }

        var dados = new URLSearchParams(new FormData(form));
        var utms = lerUtms();

        CAMPOS.forEach(function (campo) {
          dados.set(campo, utms[campo] || '');
        });
        dados.set('referrer', utms.referrer || document.referrer || '');
        dados.set('pagina', window.location.pathname);

        var sheets = form.getAttribute('data-sheets');
        var envio;

        if (sheets) {
          // Grava na planilha (Google Sheets via Apps Script)
          envio = fetch(sheets, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: dados.toString()
          }).catch(function () {});
        } else {
          // Registra no Netlify Forms
          envio = fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: dados.toString()
          }).catch(function () {});
        }

        // Eventos de conversão no momento do envio
        try {
          var nomeForm = form.getAttribute('name') || 'form';
          if (typeof fbq === 'function') {
            fbq('track', 'Lead', { content_name: nomeForm });
            // Quando o destino é um checkout externo, marca também a ida para a compra
            if (form.hasAttribute('data-checkout')) {
              fbq('track', 'InitiateCheckout', { content_name: nomeForm });
            }
          }
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'generate_lead', form_name: nomeForm });
        } catch (e) {}

        envio.finally(function () {
          var redirect = form.getAttribute('data-redirect');
          if (redirect) {
            // Espera curta para o beacon do Lead sair antes de navegar
            setTimeout(function () { window.location.href = redirect; }, 350);
            return;
          }

          var titulo = form.getAttribute('data-success-title') || 'Cadastro confirmado!';
          var texto = form.getAttribute('data-success-text') || 'Recebemos seus dados. Em breve entraremos em contato.';
          form.innerHTML = '<div class="form-success">' +
            '<div class="form-success__ico" aria-hidden="true">✓</div>' +
            '<h3 class="form-success__title"></h3>' +
            '<p class="form-success__text"></p>' +
            '</div>';
          form.querySelector('.form-success__title').textContent = titulo;
          form.querySelector('.form-success__text').textContent = texto;
        });
      });
    });
  });
})();
