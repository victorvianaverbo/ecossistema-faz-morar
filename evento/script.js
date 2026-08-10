// Evento 25/08 · interatividade da página (vanilla, sem dependências).
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

    // Cada modalidade tem um evento próprio na Sympla. O forms.js lê o
    // data-redirect na hora do envio, então basta trocá-lo aqui.
    var form = modal.querySelector('form');
    if (form) {
      var destino = form.getAttribute('data-redirect-' + modalidade);
      if (destino) form.setAttribute('data-redirect', destino);
    }

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

  /* ---------- Barra fixa mobile ---------- */

  var barra = document.querySelector('.barra');
  var sentinela = document.getElementById('sentinela-mec');

  if (barra && sentinela && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      barra.classList.toggle('barra--on', entries[0].boundingClientRect.top < 0);
    }).observe(sentinela);
  } else if (barra) {
    barra.classList.add('barra--on');
  }

  /* ---------- Contadores da planilha (progressive enhancement) ---------- */

  function formatar(valor) {
    return 'R$ ' + new Intl.NumberFormat('pt-BR').format(Math.round(valor));
  }

  function animarContador(el, atraso) {
    var alvo = parseInt(el.getAttribute('data-target'), 10);
    if (!alvo) return;
    var duracao = parseInt(el.getAttribute('data-duracao'), 10) || 900;
    var delay = parseInt(el.getAttribute('data-delay'), 10) || atraso || 0;
    var inicio = null;

    function passo(agora) {
      if (!inicio) inicio = agora;
      var t = Math.min((agora - inicio) / duracao, 1);
      var suave = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = formatar(alvo * suave);
      if (t < 1) requestAnimationFrame(passo);
      else el.textContent = formatar(alvo);
    }

    setTimeout(function () { requestAnimationFrame(passo); }, delay);
  }

  if (!reduzido.matches && 'IntersectionObserver' in window) {
    var alvosContador = [document.querySelector('.quadro__trio')];
    alvosContador.forEach(function (alvo) {
      if (!alvo) return;
      var obs = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        alvo.querySelectorAll('.count').forEach(function (el, i) {
          animarContador(el, i * 70);
        });
      }, { threshold: 0.35 });
      obs.observe(alvo);
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

  /* ---------- Lote vigente na tabela ---------- */

  var hoje = new Date();
  var lote = 1;
  if (hoje >= new Date(2026, 7, 21)) lote = 3;      // a partir de 21/08/2026
  else if (hoje >= new Date(2026, 7, 12)) lote = 2; // de 12/08 a 20/08/2026

  var linhaVigente = document.querySelector('.lotes__table tr[data-lote="' + lote + '"]');
  if (linhaVigente) {
    linhaVigente.classList.add('is-vigente');
    linhaVigente.setAttribute('aria-current', 'true');
  }
})();
