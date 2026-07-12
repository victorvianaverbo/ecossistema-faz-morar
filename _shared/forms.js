// Formulários Netlify com tracking de Lead, cópia para Google Sheets e
// sucesso inline ou redirecionamento.
//
// Atributos suportados no <form data-netlify="true">:
//   data-redirect="URL"        -> após o envio, leva o visitante para a URL
//   data-success-title="..."   -> sem redirect: título da mensagem de sucesso
//   data-success-text="..."    -> sem redirect: texto da mensagem de sucesso
//   data-sheets="URL"          -> URL do Apps Script que grava o lead no Google Sheets
//
// No envio, dispara fbq('track', 'Lead') (Meta Pixel) e
// dataLayer.push({ event: 'generate_lead' }) (GTM), quando presentes.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('form[data-netlify]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var button = form.querySelector('[type="submit"]');
      if (button) {
        button.disabled = true;
        button.textContent = 'Enviando...';
      }

      var body = new URLSearchParams(new FormData(form)).toString();

      // Registro do lead no Netlify Forms
      var save = fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      }).catch(function () {
        // Não bloqueia o fluxo do visitante se o registro falhar.
      });

      // Cópia do lead para o Google Sheets (Apps Script), se configurado
      var sheets = form.getAttribute('data-sheets');
      if (sheets) {
        fetch(sheets, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body + '&pagina=' + encodeURIComponent(window.location.pathname)
        }).catch(function () {});
      }

      // Eventos de conversão (Lead) no momento do submit
      try {
        var formName = form.getAttribute('name') || 'form';
        if (typeof fbq === 'function') {
          fbq('track', 'Lead', { content_name: formName });
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'generate_lead', form_name: formName, method: 'netlify_form' });
      } catch (e) {}

      save.finally(function () {
        var redirect = form.getAttribute('data-redirect');
        if (redirect) {
          // Pequena espera para o beacon do Lead sair antes da navegação
          setTimeout(function () { window.location.href = redirect; }, 300);
          return;
        }

        var title = form.getAttribute('data-success-title') || 'Cadastro confirmado!';
        var text = form.getAttribute('data-success-text') || 'Recebemos seus dados. Em breve entraremos em contato.';
        form.innerHTML = '<div class="form-success">' +
          '<div class="form-success__ico" aria-hidden="true">✓</div>' +
          '<h3 class="form-success__title"></h3>' +
          '<p class="form-success__text"></p>' +
          '</div>';
        form.querySelector('.form-success__title').textContent = title;
        form.querySelector('.form-success__text').textContent = text;
      });
    });
  });
});
