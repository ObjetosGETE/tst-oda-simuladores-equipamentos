import { el } from '../utils/dom.js';

/**
 * Bolinha clicável posicionada em % do palco.
 * @param {object} op { x, y, onClick, combo: {largura}, segurar: ms }
 *  - combo: desenha setas vermelhas para "pressionar dois botões ao mesmo tempo"
 *  - segurar: o usuário precisa manter pressionado por esse tempo (ex.: 500 = 0,5 s).
 *    Um anel mostra o progresso; se soltar antes, aparece "Mantenha pressionado".
 */
export function Hotspot({ x, y, onClick, combo, segurar }) {
  const frag = document.createDocumentFragment();

  if (combo) {
    const largura = combo.largura || 20; // em % do palco
    frag.append(
      el('div', {
        class: 'combo',
        style: { left: `${x - largura / 2}%`, top: `${y}%`, width: `${largura}%` },
      }),
    );
  }

  const botao = el('button', {
    class: `hotspot ${segurar ? 'hotspot--segurar' : ''}`.trim(),
    type: 'button',
    'aria-label': segurar ? 'Mantenha pressionado' : 'Clique aqui',
    style: { left: `${x}%`, top: `${y}%` },
    onClick: segurar ? undefined : onClick,
  });

  if (segurar) prepararSegurar(botao, segurar, onClick);

  frag.append(botao);
  return frag;
}

/** Comportamento "clique e segure" (mouse, toque e teclado). */
function prepararSegurar(botao, tempo, onConcluir) {
  let inicio = 0;
  let quadro = 0;
  let concluido = false;
  botao.append(el('span', { class: 'hotspot__dica' }, 'Mantenha pressionado'));
  botao.style.setProperty('--progresso', 0);

  const animar = () => {
    const p = Math.min((performance.now() - inicio) / tempo, 1);
    botao.style.setProperty('--progresso', p);
    if (p >= 1) {
      concluido = true;
      botao.classList.remove('hotspot--pressionando');
      onConcluir();
      return;
    }
    quadro = requestAnimationFrame(animar);
  };

  const pressionar = (e) => {
    if (concluido || inicio) return;
    e.preventDefault();
    if (e.pointerId !== undefined) botao.setPointerCapture?.(e.pointerId);
    botao.classList.remove('hotspot--soltou-cedo');
    botao.classList.add('hotspot--pressionando');
    inicio = performance.now();
    quadro = requestAnimationFrame(animar);
  };

  const soltar = () => {
    if (concluido || !inicio) return;
    cancelAnimationFrame(quadro);
    inicio = 0;
    botao.classList.remove('hotspot--pressionando');
    botao.style.setProperty('--progresso', 0);
    // mostra a dica (reinicia a animação se já estava visível)
    botao.classList.remove('hotspot--soltou-cedo');
    void botao.offsetWidth;
    botao.classList.add('hotspot--soltou-cedo');
  };

  botao.addEventListener('pointerdown', pressionar);
  botao.addEventListener('pointerup', soltar);
  botao.addEventListener('pointercancel', soltar);
  botao.addEventListener('contextmenu', (e) => e.preventDefault()); // toque longo no celular
  botao.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) pressionar(e);
  });
  botao.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === ' ') soltar();
  });
}

/** Marca de "feito" (bolinha verde) sem clique. */
export function MarcaOk({ x, y }) {
  return el('span', { class: 'hotspot hotspot--ok', style: { left: `${x}%`, top: `${y}%` } });
}
