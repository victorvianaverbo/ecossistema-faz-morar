// Revela os elementos [data-aos] quando entram na viewport.
// Substitui a biblioteca AOS: mesmo efeito, sem travar a thread principal.
(function () {
  function iniciar() {
    var alvos = document.querySelectorAll('[data-aos]');
    if (!alvos.length) return;

    var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (semMovimento || !('IntersectionObserver' in window)) {
      alvos.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;

        var el = entrada.target;
        var atraso = parseInt(el.getAttribute('data-aos-delay'), 10);
        if (atraso) el.style.transitionDelay = atraso + 'ms';

        el.classList.add('is-in');
        observador.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    alvos.forEach(function (el) { observador.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
