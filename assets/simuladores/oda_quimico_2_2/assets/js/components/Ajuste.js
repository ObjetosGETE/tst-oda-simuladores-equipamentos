import { el } from '../utils/dom.js';
import { Botao } from './Botao.js';
import { Lcd } from './Lcd.js';
import { Mensagem } from './Caixas.js';
import { resolverImagem } from '../utils/caminhos.js';

/**
 * Ajuste de valor por cliques (Diminuir / Aumentar), com visor do calibrador.
 * Ex.: parafuso regulador de vazão.
 *
 * config = {
 *   valores: ['0,4058', ...],   // do maior para o menor
 *   inicio: 2,                  // índice inicial
 *   alvo: 4,                    // índice correto
 *   media: '1.5273',            // valor fixo de "Média"
 *   msgAjustar: 'Reduza a vazão.',
 *   msgSucesso: '...',
 *   botoes: { diminuir: {x,y}, aumentar: {x,y} }, // posição em %
 *   imagens: ['17','18','19','20'] // opcional: ¼ de volta do parafuso por clique
 *                                  // (Diminuir = horário avança, Aumentar = anti-horário volta)
 *   rotulos: { diminuir: 'html', aumentar: 'html' } // opcional: texto dos botões
 *   visor: 'lateral'               // opcional: visor do calibrador menor, no lado direito
 * }
 */
export function Ajuste(camada, config, onConcluir) {
  let indice = config.inicio;
  const visor = el('div', { class: `ajuste__visor${config.visor ? ` ajuste__visor--${config.visor}` : ''}` });
  const rotulos = config.rotulos || {};
  let mensagem = null;

  const btnMenos = Botao({ texto: rotulos.diminuir || 'Diminuir<br>Vazão', classe: 'ajuste__btn', onClick: () => mudar(+1) });
  const btnMais = Botao({ texto: rotulos.aumentar || 'Aumentar<br>Vazão', classe: 'ajuste__btn', onClick: () => mudar(-1) });
  posicionar(btnMenos, config.botoes.diminuir);
  posicionar(btnMais, config.botoes.aumentar);

  camada.append(btnMenos, btnMais, visor);

  // imagens do parafuso girando (troca a imagem de fundo da cena a cada clique)
  const imagens = config.imagens || [];
  const fundo = camada.querySelector('.cena__img');
  imagens.forEach((i) => (new Image().src = resolverImagem(i))); // pré-carrega

  atualizar();

  function posicionar(botao, { x, y }) {
    Object.assign(botao.style, { left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' });
  }

  function mudar(delta) {
    indice = Math.min(Math.max(indice + delta, 0), config.valores.length - 1);
    atualizar();
  }

  function atualizar() {
    if (imagens.length && fundo) {
      const n = imagens.length;
      fundo.src = resolverImagem(imagens[(((indice - config.inicio) % n) + n) % n]);
    }

    visor.replaceChildren(
      Lcd({
        tipo: 'calibrador',
        area: { x: 0, y: 0, w: 100, h: 100 },
        tela: 'medicao',
        vazao: config.valores[indice],
        media: config.media,
        contador: '01 de 010',
      }),
    );

    mensagem && mensagem.remove();
    const acertou = indice === config.alvo;
    btnMenos.disabled = acertou || indice === config.valores.length - 1;
    btnMais.disabled = acertou || indice === 0;

    if (acertou) {
      mensagem = Mensagem({ texto: config.msgSucesso, posicao: 'rodape-esq', sucesso: true });
      camada.append(mensagem);
      onConcluir();
    } else {
      mensagem = Mensagem({ texto: config.msgAjustar, posicao: 'esquerda' });
      camada.append(mensagem);
    }
  }
}
