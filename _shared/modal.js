// Modal de captura de leads.
// Qualquer elemento com data-modal-open="ID" abre o <div class="modal" id="ID">.
// Fecha no X, no clique fora da caixa e na tecla Esc.
document.addEventListener('DOMContentLoaded', function () {
  var openers = document.querySelectorAll('[data-modal-open]');
  if (!openers.length) return;

  var lastFocused = null;

  function open(modal) {
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    var field = modal.querySelector('input:not([type="hidden"])');
    if (field) setTimeout(function () { field.focus(); }, 120);
  }

  function close(modal) {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus();
  }

  openers.forEach(function (opener) {
    opener.addEventListener('click', function (event) {
      var modal = document.getElementById(opener.getAttribute('data-modal-open'));
      if (!modal) return;
      event.preventDefault();
      open(modal);
    });
  });

  document.querySelectorAll('.modal').forEach(function (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.closest('[data-modal-close]')) {
        close(modal);
      }
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var openModal = document.querySelector('.modal.is-open');
    if (openModal) close(openModal);
  });
});
