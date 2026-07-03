// Linhas dos passos (seção Como funciona): crescem da esquerda para a
// direita quando a seção entra na viewport. O stagger é feito por
// transition-delay no CSS (.step:nth-child).
document.addEventListener('DOMContentLoaded', function () {
  var steps = document.querySelectorAll('.step');
  if (!steps.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    steps.forEach(function (step) { step.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  steps.forEach(function (step) { observer.observe(step); });
});
