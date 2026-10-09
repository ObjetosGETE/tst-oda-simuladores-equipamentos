import { el } from '../utils/dom.js';
import { render } from '../utils/caminhos.js';

/**
 * Recortes de renders usados como miniaturas no painel de itens.
 * recorte = [x0, y0, x1, y1] em % da imagem.
 */
const ITENS = {
  bomba: { img: '21', recorte: [50, 28, 70, 90] },
  amostrador: { img: '21', recorte: [26, 60, 39, 82] },
};

/** Imagens usadas pelas miniaturas (para o preloader). */
export const imagensPainel = () => Object.values(ITENS).map((i) => render(i.img));

function estiloRecorte({ img, recorte: [x0, y0, x1, y1] }) {
  const w = x1 - x0;
  const h = y1 - y0;
  return {
    backgroundImage: `url("${render(img)}")`,
    backgroundSize: `${(100 / w) * 100}% ${(100 / h) * 100}%`,
    backgroundPosition: `${(x0 / (100 - w)) * 100}% ${(y0 / (100 - h)) * 100}%`,
  };
}

/**
 * Painel (caixa branca no canto inferior esquerdo) com os itens disponíveis.
 * @param {(string|null)[]} itens ex.: ['bomba', 'amostrador'] ; null = espaço vazio
 */
export function Painel(itens = []) {
  return el(
    'div',
    { class: 'painel' },
    itens.map((nome) =>
      nome
        ? el('div', { class: 'painel__item', title: nome, style: estiloRecorte(ITENS[nome]) })
        : el('div', { class: 'painel__item' }),
    ),
  );
}
