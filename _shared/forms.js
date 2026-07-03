// Formulários Netlify com redirecionamento pós-envio.
// Uso: <form name="..." method="POST" data-netlify="true" data-redirect="URL_DESTINO">
// O lead é registrado no Netlify Forms e o visitante segue para o destino
// (grupo do WhatsApp, checkout ou conversa no WhatsApp).
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('form[data-redirect]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var button = form.querySelector('[type="submit"]');
      if (button) {
        button.disabled = true;
        button.textContent = 'Enviando...';
      }

      var body = new URLSearchParams(new FormData(form)).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      }).catch(function () {
        // Mesmo se o registro falhar, não bloqueia o destino do visitante.
      }).finally(function () {
        window.location.href = form.getAttribute('data-redirect');
      });
    });
  });
});
