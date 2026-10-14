import { el } from '../utils/dom.js';
import { Lcd } from './Lcd.js';

/**
 * Calibrador/aferidor de vazão interativo (close-up renders/telas_equi/Aferidor.png).
 *
 * Todos os botões do aparelho funcionam (sem bolinhas indicando onde clicar):
 *   ⏻        liga / desliga
 *   ◀ ▶ ▲ ▼  mudam a opção selecionada no menu do rodapé
 *   ENTER    confirma a opção selecionada
 * Menus sem conteúdo no simulador (CONFIGURAÇÃO, CONT., CONFIG.) mostram
 * o aviso MSG_NAO_CONTEMPLADO no visor.
 *
 * O quadro termina quando o estado do aparelho bate com "objetivo".
 *
 * config = {
 *   estado:   estado inicial (padrão: desligado). Ex.:
 *             { ligado: true, tela: 'medicao', modo: 'unica', medindo: true,
 *               vazao: '0,2024', media: '0,2261', contador: '01 de 010' }
 *   objetivo: campos que o estado precisa ter para concluir. Ex.:
 *             { tela: 'medicao', modo: 'unica', medindo: false }  // chegou na medição única
 *             { tela: 'medicao', modo: 'sequencial', medindo: true } // iniciou a sequencial
 *             { ligado: false }                                     // desligou
 *   medicoes: valores mostrados ao iniciar uma medição (opcional):
 *             { unica: { vazao, media, contador }, sequencial: {...} }
 * }
 *
 * Telas (ver assets/img/Manual - Calibrador-aferidor de vazao/relacao_telas.jpg):
 *   inicio  -> MEDIR | CONFIGURAÇÃO
 *   menu    -> ÚNICA | CONT. | SEQUENCIAL | CONFIG.
 *   medicao -> UNICA/SEQUENCIAL | SAIR   (antes de iniciar)
 *              PAUSA | SAIR              (medindo)
 */

export const MSG_NAO_CONTEMPLADO = 'Esse menu não será contemplado nesse simulador';

/** Posição/tamanho de cada botão, em % do palco (Aferidor.png). */
const BOTOES = {
  cima: { x: 63.5, y: 37, w: 8, h: 7.5, rotulo: 'Seta para cima' },
  baixo: { x: 63.5, y: 60.3, w: 8, h: 7.5, rotulo: 'Seta para baixo' },
  esq: { x: 56.4, y: 48.5, w: 4.2, h: 14, rotulo: 'Seta para a esquerda' },
  dir: { x: 70.6, y: 48.5, w: 4.2, h: 14, rotulo: 'Seta para a direita' },
  enter: { x: 63.4, y: 48.5, w: 7.6, h: 13.5, rotulo: 'ENTER' },
  power: { x: 73.9, y: 61.1, w: 3.4, h: 6, rotulo: 'Liga/desliga' },
};

const MENUS = {
  inicio: ['MEDIR', 'CONFIGURAÇÃO'],
  menu: ['ÚNICA', 'CONT.', 'SEQUENCIAL', 'CONFIG.'],
};

const ROTULO_MODO = { unica: 'UNICA', sequencial: 'SEQUENCIAL' };

/** Medições padrão quando a situação não informa valores. */
const MEDICAO_PADRAO = {
  unica: { vazao: '', media: '', contador: '00 de 01' },
  sequencial: { vazao: '', media: '', contador: '00 de 010' },
};

const DESLIGADO = { ligado: false };

export function Calibrador(camada, config, onConcluir) {
  let estado = { ...DESLIGADO, ...(config.estado || {}) };
  if (estado.ligado && estado.sel === undefined) estado.sel = 0;
  let travado = false;
  let lcd = null;
  let timerAviso = 0;

  const botoes = Object.entries(BOTOES).map(([nome, b]) =>
    el('button', {
      class: `calib-btn calib-btn--${nome}`,
      type: 'button',
      'aria-label': b.rotulo,
      style: { left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` },
      onClick: () => apertar(nome),
    }),
  );
  camada.append(...botoes);
  desenhar();

  /* ---------- regras do aparelho ---------- */
  function opcoes(e = estado) {
    if (e.tela === 'medicao') {
      return e.medindo ? [e.pausado ? 'CONTINUAR' : 'PAUSA', 'SAIR'] : [ROTULO_MODO[e.modo], 'SAIR'];
    }
    return MENUS[e.tela] || [];
  }

  function apertar(nome) {
    if (travado) return;

    if (nome === 'power') {
      estado = estado.ligado ? { ...DESLIGADO } : { ligado: true, tela: 'inicio', sel: 0 };
      return depois();
    }
    if (!estado.ligado) return; // desligado: só o ⏻ responde

    const tinhaAviso = !!estado.aviso;
    estado = { ...estado, aviso: null };

    const n = opcoes().length;
    if (nome === 'esq' || nome === 'cima') estado.sel = (estado.sel - 1 + n) % n;
    else if (nome === 'dir' || nome === 'baixo') estado.sel = (estado.sel + 1) % n;
    else if (nome === 'enter' && !tinhaAviso) confirmar(opcoes()[estado.sel]);

    depois();
  }

  function confirmar(opcao) {
    const { tela } = estado;

    if (tela === 'inicio') {
      if (opcao === 'MEDIR') estado = { ...estado, tela: 'menu', sel: 0 };
      else mostrarAviso();
      return;
    }

    if (tela === 'menu') {
      if (opcao === 'ÚNICA') abrirMedicao('unica');
      else if (opcao === 'SEQUENCIAL') abrirMedicao('sequencial');
      else mostrarAviso();
      return;
    }

    // tela de medição
    if (opcao === 'SAIR') {
      estado = { ligado: true, tela: 'menu', sel: MENUS.menu.indexOf(estado.modo === 'sequencial' ? 'SEQUENCIAL' : 'ÚNICA') };
    } else if (!estado.medindo) {
      const m = config.medicoes?.[estado.modo] || MEDICAO_PADRAO[estado.modo];
      estado = { ...estado, ...m, medindo: true, pausado: false, sel: 0 };
    } else {
      estado = { ...estado, pausado: !estado.pausado };
    }
  }

  function abrirMedicao(modo) {
    estado = { ligado: true, tela: 'medicao', modo, medindo: false, sel: 0, vazao: '', media: '', contador: 'de' };
  }

  function mostrarAviso() {
    estado.aviso = MSG_NAO_CONTEMPLADO;
    clearTimeout(timerAviso);
    timerAviso = setTimeout(() => {
      if (!estado.aviso) return;
      estado = { ...estado, aviso: null };
      desenhar();
    }, 2500);
  }

  /* ---------- tela e objetivo ---------- */
  function depois() {
    desenhar();
    if (cumpriu()) {
      travado = true;
      clearTimeout(timerAviso);
      botoes.forEach((b) => (b.disabled = true));
      onConcluir();
    }
  }

  function cumpriu() {
    const alvo = config.objetivo || {};
    if (estado.aviso) return false;
    return Object.entries(alvo).every(([k, v]) => (estado[k] ?? false) === v);
  }

  function desenhar() {
    const novo = estado.ligado
      ? Lcd({
          tipo: 'calibrador',
          tela: estado.tela,
          opcoes: opcoes(),
          sel: opcoes()[estado.sel],
          vazao: estado.vazao,
          media: estado.media,
          contador: estado.contador,
          aviso: estado.aviso,
        })
      : el('div', { class: 'lcd lcd--vazio' });
    lcd ? lcd.replaceWith(novo) : camada.append(novo);
    lcd = novo;
  }
}
