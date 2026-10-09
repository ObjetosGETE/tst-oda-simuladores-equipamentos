import { el } from '../utils/dom.js';
import { img } from '../utils/caminhos.js';
import { Botao } from './Botao.js';

/**
 * Abre um modal dentro do palco.
 * @param {HTMLElement} palco
 * @param {object} op {
 *   titulo, icone (png da pasta img), html (conteúdo),
 *   textoBotao (se informado mostra botão no rodapé),
 *   fechavel (mostra X), pequeno, onFechar
 * }
 * @returns {Function} fechar()
 */
export function abrirModal(palco, { titulo, icone, html, textoBotao, fechavel = true, pequeno = false, onFechar }) {
  const fechar = () => {
    fundo.remove();
    onFechar && onFechar();
  };

  const modal = el(
    'div',
    { class: `modal ${pequeno ? 'modal--pequeno' : ''}`, role: 'dialog' },
    fechavel && el('button', { class: 'modal__fechar', type: 'button', 'aria-label': 'Fechar', onClick: fechar }),
    titulo && el('h2', { class: 'modal__titulo' }, icone && el('img', { src: img(icone), alt: '' }), titulo),
    el('div', { class: 'modal__corpo', html }),
    textoBotao && el('div', { class: 'modal__rodape' }, Botao({ texto: textoBotao, onClick: fechar })),
  );

  const fundo = el('div', { class: 'modal-fundo' }, modal);
  palco.append(fundo);
  return fechar;
}
