// Evento 23/09 · interatividade da página (vanilla, sem dependências).
// O envio do formulário, as UTMs e os eventos de conversão ficam no /_shared/forms.js.
(function () {
  'use strict';

  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Modal de captura ---------- */

  var modal = document.getElementById('modal-evento');
  var card = modal ? modal.querySelector('.modal__card') : null;
  var campoModalidade = document.getElementById('ev-modalidade');
  var quemAbriu = null;

  function focaveis() {
    return card.querySelectorAll('button, input:not([tabindex="-1"]), a[href]');
  }

  function abrirModal(botao) {
    if (!modal) return;
    quemAbriu = botao;
    var modalidade = botao.getAttribute('data-modalidade') || 'presencial';
    if (campoModalidade) campoModalidade.value = modalidade;

    modal.hidden = false;
    document.body.classList.add('modal-aberta');
    // força o reflow para a transição de entrada rodar
    void modal.offsetWidth;
    modal.classList.add('is-open');

    var primeiro = modal.querySelector('input[name="nome"]');
    if (primeiro) primeiro.focus();
  }

  function fecharModal() {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-aberta');
    var espera = reduzido.matches ? 0 : 200;
    setTimeout(function () { modal.hidden = true; }, espera);
    if (quemAbriu) quemAbriu.focus();
  }

  document.querySelectorAll('button[data-modalidade]').forEach(function (botao) {
    botao.addEventListener('click', function () { abrirModal(botao); });
  });

  if (modal) {
    modal.querySelectorAll('[data-fecha]').forEach(function (el) {
      el.addEventListener('click', fecharModal);
    });

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') { fecharModal(); return; }
      if (e.key !== 'Tab') return;
      // focus trap: Tab circula só dentro do cartão
      var lista = focaveis();
      if (!lista.length) return;
      var primeiro = lista[0];
      var ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault(); ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault(); primeiro.focus();
      }
    });
  }

  /* ---------- FAQ: abertura animada com grid-template-rows ---------- */

  document.querySelectorAll('.faq__item').forEach(function (item) {
    var resumo = item.querySelector('summary');
    var wrap = item.querySelector('.faq__a-wrap');
    if (!resumo || !wrap) return;

    resumo.addEventListener('click', function (e) {
      if (reduzido.matches) {
        // sem animação: deixa o details nativo agir e só sincroniza a classe
        requestAnimationFrame(function () {
          item.classList.toggle('is-open', item.open);
        });
        return;
      }
      e.preventDefault();
      if (!item.open) {
        item.open = true;
        requestAnimationFrame(function () { item.classList.add('is-open'); });
      } else {
        item.classList.remove('is-open');
        var fechado = false;
        var fechar = function () {
          if (fechado) return;
          fechado = true;
          wrap.removeEventListener('transitionend', aoTerminar);
          item.open = false;
        };
        var aoTerminar = function (ev) {
          if (ev.propertyName !== 'grid-template-rows') return;
          fechar();
        };
        wrap.addEventListener('transitionend', aoTerminar);
        // rede de segurança: se a transição não disparar, fecha assim mesmo
        setTimeout(fechar, 500);
      }
    });
  });

})();
