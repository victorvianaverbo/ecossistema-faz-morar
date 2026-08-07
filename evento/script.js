// Específico da LP do evento. Duas funções, e nenhuma delas mexe em
// /_shared/modal.js, que é usado por outras 19 páginas.
//
// 1. Modalidade do ingresso: cada botão carrega data-modalidade="presencial|online".
//    Ao abrir o modal, o valor vai para o campo escondido que o forms.js envia
//    junto para a planilha. Sem isso não dá para saber se o lead queria a cadeira
//    ou a transmissão, que é o que separa o público de BH do resto do país.
//
// 2. Barra fixa no mobile: aparece depois que o visitante passa do bloco que
//    explica de onde vem o desconto, e some enquanto a seção de ingressos está
//    na tela, para não tapar os cards que ele foi ler.

(function () {
  var TEXTOS = {
    presencial: {
      titulo: 'Garanta sua cadeira em BH',
      texto: 'Preencha seus dados e siga para a compra do ingresso presencial do Leilão & Prosa, dia 25 de agosto, no Okay Hub.'
    },
    online: {
      titulo: 'Garanta seu acesso ao vivo',
      texto: 'Preencha seus dados e siga para a compra do acesso à transmissão ao vivo do Leilão & Prosa, dia 25 de agosto.'
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var campo = document.getElementById('ev-modalidade');
    var titulo = document.getElementById('modal-evento-titulo');
    var texto = document.getElementById('modal-evento-texto');

    if (campo) {
      document.querySelectorAll('[data-modal-open][data-modalidade]').forEach(function (botao) {
        botao.addEventListener('click', function () {
          var escolha = botao.getAttribute('data-modalidade') === 'online' ? 'online' : 'presencial';
          campo.value = escolha;
          if (titulo) titulo.textContent = TEXTOS[escolha].titulo;
          if (texto) texto.textContent = TEXTOS[escolha].texto;
        });
      });
    }

    // A barra só existe para o polegar: no desktop os pares de botões da página
    // já aparecem quatro vezes ao longo do scroll.
    var barra = document.getElementById('ev-bar');
    var gatilho = document.getElementById('cta-duplo-1');
    var oferta = document.getElementById('ingressos');
    var fecho = document.getElementById('inscricao');
    if (!barra || !gatilho) return;

    var ativa = window.matchMedia('(max-width: 860px)');

    // As duas condições medidas na mesma passada. Com IntersectionObserver
    // separados eles se sobrescreviam e a barra ficava por cima dos cards.
    function atualizar() {
      if (!ativa.matches) {
        barra.classList.remove('is-up');
        barra.setAttribute('inert', '');
        return;
      }
      var altura = window.innerHeight;
      var passou = gatilho.getBoundingClientRect().top < altura * 0.6;
      var tapando = [oferta, fecho].some(function (secao) {
        if (!secao) return false;
        var c = secao.getBoundingClientRect();
        return c.top < altura && c.bottom > 0;
      });

      if (passou && !tapando) {
        barra.classList.add('is-up');
        barra.removeAttribute('inert');
      } else {
        barra.classList.remove('is-up');
        // inert tira os botões escondidos da ordem de tabulação e do leitor de
        // tela: barra invisível não pode receber foco.
        barra.setAttribute('inert', '');
      }
    }

    window.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar, { passive: true });
    atualizar();
  });
})();
