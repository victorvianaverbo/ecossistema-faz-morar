// Menu mobile. Abaixo de 1024px a .nav__links some (base.css) e sem isto o
// site fica sem navegação nenhuma no celular — só o logo e o WhatsApp.
// Fecha no toque fora, no Esc, ao clicar num link e ao voltar para desktop.
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav__toggle');
  var drawer = document.querySelector('.nav__drawer');
  if (!toggle || !drawer) return;

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  function open() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    drawer.hidden = false;
    // hidden precisa cair antes da classe, senão não há transição
    requestAnimationFrame(function () { drawer.classList.add('is-open'); });
    document.body.classList.add('nav-open');
  }

  function close(returnFocus) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    drawer.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    // espera a transição para só então tirar da árvore de acessibilidade
    setTimeout(function () { if (!isOpen()) drawer.hidden = true; }, 260);
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) { close(false); } else { open(); }
  });

  drawer.addEventListener('click', function (event) {
    if (event.target.closest('a')) close(false);
  });

  document.addEventListener('click', function (event) {
    if (!isOpen()) return;
    if (event.target.closest('.nav__drawer, .nav__toggle')) return;
    close(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) close(true);
  });

  // Ao girar o aparelho ou voltar para desktop, o menu some do layout mas
  // ficaria aberto no estado — o body travado é o sintoma visível disso.
  window.addEventListener('resize', function () {
    if (isOpen() && window.innerWidth > 1024) close(false);
  });
});
