// Específico da LP do evento. Duas funções, e nenhuma delas mexe em
// /_shared/modal.js, que é usado por outras 15 páginas.
//
// 1. Modalidade do ingresso: cada CTA carrega data-modalidade="presencial|online".
//    Ao abrir o modal, o valor vai para o campo escondido que o forms.js envia
//    junto para a planilha. Sem isso não dá para saber se o lead queria a cadeira
//    ou a transmissão, que é justamente o que separa o público de BH do resto.
//
// 2. Barra fixa no mobile: aparece depois que o visitante passa do mecanismo,
//    porque antes disso ele ainda não tem motivo para comprar.

(function () {
  var TEXTOS = {
    presencial: {
      titulo: 'Garanta sua cadeira em BH',
      texto: 'Preencha seus dados e siga para a compra do ingresso presencial do Leilão & Prosa, dia 25 de agosto, no Okay Hub.'
    },
    online: {
      titulo: 'Garanta seu acesso ao vivo',
      texto: 'Preencha seus dados e siga para a compra do ingresso online do Leilão & Prosa, dia 25 de agosto, transmitido ao vivo.'
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

    // A barra só existe para o polegar: no desktop os CTAs da página já bastam.
    var barra = document.getElementById('ev-bar');
    var gatilho = document.querySelector('.ev-math');
    var oferta = document.getElementById('ingressos');
    if (!barra || !gatilho) return;
    if (!window.matchMedia('(max-width: 860px)').matches) return;

    // Duas condições, medidas na mesma passada. Com dois IntersectionObserver
    // separados eles se sobrescreviam e a barra continuava por cima dos cards
    // de ingresso, que é justamente o que ela não pode tapar.
    function atualizar() {
      var altura = window.innerHeight;
      var passouDoMecanismo = gatilho.getBoundingClientRect().top < altura * 0.5;
      var naOferta = false;
      if (oferta) {
        var o = oferta.getBoundingClientRect();
        naOferta = o.top < altura && o.bottom > 0;
      }
      barra.hidden = !passouDoMecanismo || naOferta;
    }

    window.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar, { passive: true });
    atualizar();
  });
})();
