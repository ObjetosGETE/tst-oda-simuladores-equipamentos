import { el } from '../utils/dom.js';
import { Botao } from './Botao.js';

/** Caixa de diálogo de rodapé (telas iniciais). */
export function Dialogo(texto) {
  return el('div', { class: 'dialogo', html: texto });
}

/** Caixa de instrução do passo (topo direito). */
export function Instrucao(texto, posicao = 'topo') {
  return el('div', { class: `instrucao instrucao--${posicao}`, html: texto });
}

/** Aviso ("Aviso!" + texto) no rodapé esquerdo. */
export function Aviso(texto, titulo = 'Aviso!') {
  return el('div', { class: 'aviso' }, el('span', { class: 'aviso__titulo' }, titulo), el('span', { html: texto }));
}

/**
 * Mensagem informativa azul (ou verde se sucesso).
 * posicao: 'topo' | 'rodape' | 'esquerda'
 */
export function Mensagem({ texto, posicao = 'topo', sucesso = false, fechavel = false }) {
  const caixa = el(
    'div',
    { class: `mensagem mensagem--${posicao} ${sucesso ? 'mensagem--sucesso' : ''}` },
    el('span', { class: 'mensagem__icone' }, sucesso ? '✓' : 'i'),
    el('div', { html: texto }),
  );
  if (fechavel) {
    caixa.append(el('button', { class: 'mensagem__fechar', type: 'button', onClick: () => caixa.remove() }, '×'));
  }
  return caixa;
}

/** Balão de tutorial com botão "Continuar", posicionado ao lado de um alvo. */
export function Balao({ texto, top, onContinuar }) {
  return el(
    'div',
    { class: 'balao', style: { top: `${top}px` } },
    el('div', { html: texto }),
    Botao({ texto: 'Continuar', onClick: onContinuar }),
  );
}
