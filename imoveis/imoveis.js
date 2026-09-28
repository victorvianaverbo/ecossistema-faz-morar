// Marketplace de imóveis: filtro da vitrine, galeria da ficha e evento de
// contato no Pixel. O HTML vem de scripts/gerar-imoveis.mjs.
document.addEventListener('DOMContentLoaded', function () {

  // ---------- filtro da vitrine ----------
  var grade = document.querySelector('[data-grade]');
  if (grade) {
    var cards = grade.querySelectorAll('.listing');
    var chips = document.querySelectorAll('[data-filtro-tipo]');
    var select = document.querySelector('[data-filtro-cidade]');
    var vazio = document.querySelector('[data-vazio]');
    var tipo = '';

    function aplicar() {
      var cidade = select ? select.value : '';
      var visiveis = 0;
      cards.forEach(function (c) {
        var ok = (!tipo || c.dataset.tipo === tipo) && (!cidade || c.dataset.cidade === cidade);
        c.hidden = !ok;
        if (ok) visiveis++;
      });
      if (vazio) vazio.hidden = visiveis > 0;
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        tipo = chip.dataset.filtroTipo;
        chips.forEach(function (c) { c.classList.toggle('is-on', c === chip); });
        aplicar();
      });
    });
    if (select) select.addEventListener('change', aplicar);

    var limpar = document.querySelector('[data-limpar]');
    if (limpar) limpar.addEventListener('click', function () {
      tipo = '';
      chips.forEach(function (c, n) { c.classList.toggle('is-on', n === 0); });
      if (select) select.value = '';
      aplicar();
    });
  }

  // ---------- galeria da ficha ----------
  var trilho = document.querySelector('[data-trilho]');
  if (trilho) {
    var slides = trilho.children;
    var conta = document.querySelector('[data-conta]');
    var minis = document.querySelectorAll('[data-ir]');
    var atual = 0;

    function ir(n) {
      n = (n + slides.length) % slides.length;
      trilho.scrollTo({ left: slides[n].offsetLeft, behavior: 'smooth' });
    }

    function marcar() {
      var n = Math.round(trilho.scrollLeft / trilho.clientWidth);
      if (n === atual) return;
      atual = n;
      if (conta) conta.textContent = (n + 1) + ' / ' + slides.length;
      minis.forEach(function (m, i) { m.classList.toggle('is-on', i === n); });
    }

    var ticking = false;
    trilho.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { marcar(); ticking = false; });
    }, { passive: true });

    var ant = document.querySelector('[data-ant]');
    var prox = document.querySelector('[data-prox]');
    if (ant) ant.addEventListener('click', function () { ir(atual - 1); });
    if (prox) prox.addEventListener('click', function () { ir(atual + 1); });
    minis.forEach(function (m) {
      m.addEventListener('click', function () { ir(Number(m.dataset.ir)); });
    });
    trilho.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); ir(atual - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); ir(atual + 1); }
    });
  }

  // ---------- contato ----------
  document.querySelectorAll('[data-contato]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (typeof fbq === 'function') fbq('track', 'Contact', { content_name: document.title });
    });
  });
});
