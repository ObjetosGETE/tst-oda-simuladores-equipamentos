import { el } from '../utils/dom.js';

/**
 * Área do visor de cada equipamento, em % do palco.
 * Vale para os close-ups de assets/img/renders/telas_equi (Bomba, Aferidor, Termo_higro).
 * O tamanho do texto acompanha a área pela variável CSS --k (ver _lcd.css).
 */
const AREAS = {
  bomba: { x: 32, y: 33.1, w: 37.9, h: 31.7 },
  calibrador: { x: 22.7, y: 34.3, w: 25.6, h: 27 },
  termo: { x: 36.4, y: 36.2, w: 26.2, h: 24.4 },
};

/** Menu inferior com a opção selecionada destacada. */
function menu(opcoes, selecionada) {
  return el(
    'div',
    { class: 'lcd__menu' },
    opcoes.map((op, i) => [i > 0 ? ' | ' : '', op === selecionada ? el('b', {}, op) : op]),
  );
}

/* ---------- Bomba de amostragem ---------- */
function telaBomba(d) {
  return [
    d.bateria !== false && el('div', { class: 'lcd__bateria' }),
    d.titulo && el('div', { class: 'lcd__titulo' }, d.titulo),
    d.valor !== undefined &&
      el('div', { class: `lcd__valor ${d.centro ? 'lcd__valor--centro' : ''}` }, String(d.valor)),
    d.unidade && el('div', { class: 'lcd__unidade' }, d.unidade),
    d.pausa && el('div', { class: 'lcd__rodape' }, 'PAUSA'),
    d.legenda && el('div', { class: 'lcd__legenda' }, d.legenda),
  ];
}

/* ---------- Calibrador de vazão ---------- */
const OPCOES_MEDIR = ['ÚNICA', 'CONT.', 'SEQUENCIAL', 'CONFIG.'];

function telaCalibrador(d) {
  switch (d.tela) {
    case 'inicio':
      return [
        el('div', { class: 'lcd__centro' }, 'Calibrador de vazão'),
        el('div', { class: 'lcd__centro' }, 'Faixa: 0,05 - 5 l/min'),
        menu(['MEDIR', 'CONFIGURAÇÃO'], 'MEDIR'),
      ];
    case 'menu':
      return [
        el('div', { class: 'lcd__centro' }, 'Realizar uma única medição'),
        el('div', { class: 'lcd__centro' }, '(010 consecutivas)'),
        menu(OPCOES_MEDIR, d.sel || 'ÚNICA'),
      ];
    case 'medicao':
      return [
        el('div', { class: 'lcd__cab' }, 'Medição única l/min'),
        el('div', { class: 'lcd__grande' }, `Vazão: ${d.vazao ?? ''}`),
        el('div', { class: 'lcd__grande' }, `Média: ${d.media ?? ''}`),
        el('div', { class: 'lcd__de' }, d.contador || 'de'),
        menu(d.opcoes || ['PAUSA', 'SAIR'], d.sel || (d.opcoes ? d.opcoes[0] : 'PAUSA')),
      ];
    default:
      return [];
  }
}

/* ---------- Termo-higro-barômetro ---------- */
function telaTermo(d) {
  if (d.texto) return [el('div', { class: 'lcd__centro' }, d.texto)];
  return [
    el('div', { class: 'lcd__linha' }, d.temp, ' ', el('small', {}, '°C')),
    el('div', { class: 'lcd__linha' }, d.umid, ' ', el('small', {}, '%RH')),
    el('div', { class: 'lcd__linha' }, d.press, ' ', el('small', {}, 'hPa')),
  ];
}

const TELAS = { bomba: telaBomba, calibrador: telaCalibrador, termo: telaTermo };

/**
 * Componente LCD.
 * @param {object} dados { tipo: 'bomba'|'calibrador'|'termo', ...campos da tela }
 */
export function Lcd(dados) {
  const area = dados.area || AREAS[dados.tipo];
  return el(
    'div',
    {
      class: `lcd lcd--${dados.tipo}`,
      style: { left: `${area.x}%`, top: `${area.y}%`, width: `${area.w}%`, height: `${area.h}%` },
    },
    TELAS[dados.tipo](dados),
  );
}
