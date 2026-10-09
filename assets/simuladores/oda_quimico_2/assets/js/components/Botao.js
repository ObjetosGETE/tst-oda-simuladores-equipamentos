import { el } from '../utils/dom.js';
import { img } from '../utils/caminhos.js';

/**
 * Botão laranja padrão.
 * @param {object} op { texto, onClick, classe, icone: 'avancar' | 'voltar' }
 */
export function Botao({ texto, onClick, classe = '', icone }) {
  const iconeImg =
    icone && el('img', { class: 'btn__icone', src: img(`icone_bt_${icone}.png`), alt: '' });

  return el(
    'button',
    { class: `btn ${classe}`.trim(), type: 'button', onClick },
    icone === 'voltar' ? iconeImg : null,
    el('span', { html: texto }),
    icone === 'avancar' ? iconeImg : null,
  );
}

/**
 * Botão feito com um PNG exportado do layout (ex.: bto-manuais.png).
 */
export function BotaoImagem({ src, alt, onClick, classe = '' }) {
  return el(
    'button',
    { class: `btn-img ${classe}`.trim(), type: 'button', onClick, 'aria-label': alt },
    el('img', { src, alt }),
  );
}

/** Atalho: botão "Avançar >" no canto inferior direito. */
export function BotaoAvancar(onClick, texto = 'Avançar') {
  return Botao({ texto, onClick, classe: 'btn--avancar', icone: 'avancar' });
}
