/**
 * Leilao & Prosa · paginas do evento 25/11 (Metodo Zero v20)
 * O envio do formulario fica com /_shared/forms.js (planilha, Pixel e Sympla).
 */

const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initTopbar();
  initRevelar();
  initContadores();
  initLinhaTempo();
  initFinal();
  initFaq();
  initModal();
  initBarra();
  initYear();
});

/* ==========================================
   AOS
   ========================================== */

function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic',
      disableMutationObserver: true
    });
  }
}

/* Executa fn a cada frame de scroll, no maximo uma vez por frame */
function aoRolar(fn) {
  let pendente = false;
  const tick = () => { pendente = false; fn(); };
  window.addEventListener('scroll', () => {
    if (!pendente) { pendente = true; requestAnimationFrame(tick); }
  }, { passive: true });
  window.addEventListener('resize', fn, { passive: true });
  fn();
}

/* Chama fn uma vez quando o elemento entra na tela */
function quandoVisivel(seletor, threshold, fn) {
  const els = document.querySelectorAll(seletor);
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(fn); return; }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { obs.unobserve(entry.target); fn(entry.target); }
    });
  }, { threshold });
  els.forEach(el => obs.observe(el));
}

/* ==========================================
   TOPO
   ========================================== */

function initTopbar() {
  const topbar = document.getElementById('topbar');
  if (!topbar) return;
  aoRolar(() => topbar.classList.toggle('is-scrolled', window.scrollY > 80));
}

/* ==========================================
   REGUA, EQUACAO E TEXTO REVELADO
   ========================================== */

function initRevelar() {
  const marcar = el => el.classList.add('is-visible');
  quandoVisivel('[data-regua]', 0.3, marcar);
  quandoVisivel('[data-linha]', 0.4, marcar);
  // O clip-path zera a area visivel do proprio elemento, entao observa o pai
  document.querySelectorAll('[data-reveal]').forEach(el => el.parentElement.setAttribute('data-reveal-pai', ''));
  quandoVisivel('[data-reveal-pai]', 0.2, pai => pai.querySelectorAll('[data-reveal]').forEach(marcar));
}

/* ==========================================
   CONTADORES (secao Jacque)
   ========================================== */

function initContadores() {
  quandoVisivel('[data-contadores]', 0.4, bloco => {
    if (reduzMovimento) return;
    bloco.querySelectorAll('[data-conta]').forEach(el => {
      const fim = parseFloat(el.dataset.conta);
      const inicio = parseFloat(el.dataset.de || '0');
      const casas = parseInt(el.dataset.casas || '0', 10);
      const prefixo = el.dataset.prefixo || '';
      const ano = fim > 1900 && inicio > 1900;
      const duracao = fim > 100 && !ano ? 1600 : 1200;
      // Ano sem separador de milhar; demais no formato pt-BR
      const formata = v => ano
        ? String(Math.round(v))
        : prefixo + v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
      const t0 = performance.now();
      const passo = agora => {
        const p = Math.min(1, (agora - t0) / duracao);
        const suave = 1 - Math.pow(1 - p, 3);
        el.textContent = formata(inicio + (fim - inicio) * suave);
        if (p < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    });
  });
}

/* ==========================================
   LINHA DO TEMPO (programacao)
   ========================================== */

function initLinhaTempo() {
  const linha = document.querySelector('[data-linha-tempo]');
  if (!linha) return;
  const itens = [...linha.querySelectorAll('.horario')];
  if (reduzMovimento) {
    linha.style.setProperty('--progresso', 1);
    itens.forEach(i => i.classList.add('is-active'));
    return;
  }
  aoRolar(() => {
    const r = linha.getBoundingClientRect();
    const alvo = window.innerHeight * 0.6;
    const p = Math.max(0, Math.min(1, (alvo - r.top) / r.height));
    linha.style.setProperty('--progresso', p.toFixed(3));
    const corte = r.top + r.height * p;
    itens.forEach(item => {
      const m = item.querySelector('.horario__marca').getBoundingClientRect();
      item.classList.toggle('is-active', m.top + m.height / 2 <= corte + 1);
    });
  });
}

/* ==========================================
   CTA FINAL: data em contorno desliza com o scroll
   ========================================== */

function initFinal() {
  const secao = document.getElementById('final');
  const data = secao && secao.querySelector('.final__data');
  if (!data || reduzMovimento) return;
  const desktop = window.matchMedia('(min-width: 900px)');
  aoRolar(() => {
    if (!desktop.matches) { data.style.removeProperty('--final-x'); return; }
    const r = secao.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
    data.style.setProperty('--final-x', (-46 - 8 * p).toFixed(2) + '%');
  });
}

/* ==========================================
   PERGUNTAS: modo indice no desktop
   ========================================== */

function initFaq() {
  const secao = document.getElementById('perguntas');
  const painel = secao && secao.querySelector('[data-faq-painel]');
  if (!painel) return;
  const itens = [...secao.querySelectorAll('.faq__item')];
  const desktop = window.matchMedia('(min-width: 900px)');

  const mostrar = (item, foco) => {
    itens.forEach(i => {
      const ativa = i === item;
      i.classList.toggle('is-ativa', ativa);
      i.querySelector('summary').setAttribute('aria-selected', ativa ? 'true' : 'false');
    });
    const h3 = document.createElement('h3');
    h3.textContent = item.querySelector('.faq__q').textContent;
    const p = document.createElement('p');
    p.textContent = item.querySelector('.faq__resposta').textContent;
    painel.replaceChildren(h3, p);
    painel.classList.remove('is-trocando');
    void painel.offsetWidth;
    painel.classList.add('is-trocando');
    if (foco) item.querySelector('summary').focus();
  };

  const aplicar = () => {
    const indice = desktop.matches;
    secao.classList.toggle('faq--indice', indice);
    painel.hidden = !indice;
    itens.forEach(i => {
      const s = i.querySelector('summary');
      if (indice) {
        i.open = false;
        s.setAttribute('role', 'tab');
      } else {
        s.removeAttribute('role');
        s.removeAttribute('aria-selected');
        i.classList.remove('is-ativa');
      }
    });
    if (indice) mostrar(itens.find(i => i.classList.contains('is-ativa')) || itens[0]);
  };

  itens.forEach((item, idx) => {
    const s = item.querySelector('summary');
    s.addEventListener('click', e => {
      if (!desktop.matches) return;
      e.preventDefault();
      mostrar(item);
    });
    s.addEventListener('keydown', e => {
      if (!desktop.matches) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prox = itens[(idx + (e.key === 'ArrowDown' ? 1 : itens.length - 1)) % itens.length];
        mostrar(prox, true);
      }
    });
  });

  desktop.addEventListener('change', aplicar);
  aplicar();
}

/* ==========================================
   MODAL DE INSCRICAO
   ========================================== */

function initModal() {
  const modal = document.getElementById('inscricao');
  if (!modal) return;
  let origem = null;

  const abrir = (btn) => {
    origem = btn;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('is-open'));
    const campo = modal.querySelector('input:not([type="hidden"]):not([name="bot-field"])');
    if (campo) setTimeout(() => campo.focus(), 50);
  };

  const fechar = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { modal.hidden = true; }, 150);
    if (origem) origem.focus();
  };

  document.querySelectorAll('[data-modal="inscricao"]').forEach(btn => {
    btn.addEventListener('click', () => abrir(btn));
  });
  modal.querySelector('.modal__fechar').addEventListener('click', fechar);
  modal.addEventListener('click', e => { if (e.target === modal) fechar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) fechar(); });
}

/* ==========================================
   BARRA FIXA NO CELULAR
   ========================================== */

function initBarra() {
  const barra = document.getElementById('barra');
  const acoes = document.getElementById('hero-acoes');
  const final = document.getElementById('final');
  if (!barra || !acoes || !('IntersectionObserver' in window)) return;
  let heroVisivel = true;
  let finalVisivel = false;
  const atualiza = () => {
    const mostra = !heroVisivel && !finalVisivel;
    barra.classList.toggle('is-visible', mostra);
    barra.setAttribute('aria-hidden', mostra ? 'false' : 'true');
    barra.querySelector('button').tabIndex = mostra ? 0 : -1;
  };
  new IntersectionObserver(([e]) => { heroVisivel = e.isIntersecting; atualiza(); }).observe(acoes);
  if (final) new IntersectionObserver(([e]) => { finalVisivel = e.isIntersecting; atualiza(); }).observe(final);
}

/* ==========================================
   UTILS
   ========================================== */

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
