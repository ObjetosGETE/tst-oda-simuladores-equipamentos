import { el } from '../utils/dom.js';
import { Botao } from './Botao.js';

/**
 * Ajustes para celular e tablet.
 *  - Aviso "Gire o aparelho" (aparece só por CSS, com o celular em pé – ver _mobile.css).
 *  - Convite para tela cheia em aparelhos de toque que suportam a Fullscreen API
 *    (no iPhone o Safari não permite; o convite simplesmente não aparece).
 */
export function prepararMobile(raiz) {
  raiz.append(
    el(
      'div',
      { class: 'aviso-girar', role: 'alert' },
      el('div', { class: 'aviso-girar__icone' }),
      el('p', {}, 'Gire o aparelho para a horizontal'),
      el('small', {}, 'O simulador funciona melhor com a tela deitada.'),
    ),
  );

  const toque = window.matchMedia('(pointer: coarse)').matches;
  const podeTelaCheia = document.fullscreenEnabled && !document.fullscreenElement;
  if (toque && podeTelaCheia) raiz.append(conviteTelaCheia());
}

function conviteTelaCheia() {
  const fechar = () => convite.remove();

  const entrar = async () => {
    fechar();
    try {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      await screen.orientation?.lock?.('landscape');
    } catch {
      /* navegador recusou – segue sem tela cheia */
    }
  };

  const convite = el(
    'div',
    { class: 'tela-cheia' },
    el(
      'div',
      { class: 'tela-cheia__caixa' },
      el('p', {}, 'Para uma melhor experiência, use o simulador em tela cheia.'),
      el(
        'div',
        { class: 'tela-cheia__botoes' },
        Botao({ texto: 'Tela cheia', onClick: entrar }),
        Botao({ texto: 'Continuar assim', classe: 'btn--secundario', onClick: fechar }),
      ),
    ),
  );
  return convite;
}
