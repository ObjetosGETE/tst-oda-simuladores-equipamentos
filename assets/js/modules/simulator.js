/**
 * Simulator Overlay Module
 * Abre o simulador de uma situação NA PRÓPRIA PÁGINA, num iframe que ocupa
 * todo o palco (1920×1080). Cada simulador fica em:
 *   assets/simuladores/<situation.simulador>/index.html
 *
 * Os quatro cantos do simulador já são usados por ele (menu, instrução,
 * avançar, mensagens), então os controles do ODA ficam numa aba no topo central.
 *
 * Fim da simulação: o simulador (core/Simulador.js) envia
 *   window.parent.postMessage({ tipo: "simulacao-concluida" }, "*")
 * e o ODA fecha a camada, voltando para a página do equipamento.
 */

import { toggleFullscreen } from "./ui.js";

export const MSG_SIMULACAO_CONCLUIDA = "simulacao-concluida";

const SIM_BASE = "assets/simuladores";

let overlay = null;
let frame = null;
let titleEl = null;
let currentSrc = null;

/** Caminho do index.html do simulador de uma situação */
export const simulatorUrl = (situation) =>
  situation?.simulador ? `${SIM_BASE}/${situation.simulador}/index.html` : null;

/**
 * Cria a camada (uma vez) dentro do viewport do ODA.
 * @param {{ onClose: Function, onFinish?: Function }} options
 *   onClose  - usuário clicou em "Sair da simulação"
 *   onFinish - o simulador avisou que a simulação terminou
 */
export const initSimulatorOverlay = ({ onClose, onFinish = onClose }) => {
  const viewport = document.querySelector(".simulator-viewport");
  if (!viewport || overlay) return;

  overlay = document.createElement("div");
  overlay.className = "sim-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <iframe class="sim-frame" title="Simulador" allow="fullscreen; autoplay" allowfullscreen></iframe>
    <div class="sim-tab">
      <span class="sim-tab-title"></span>
      <button class="sim-tab-btn sim-tab-fullscreen" title="Tela cheia" aria-label="Alternar tela cheia">
        <svg width="20" height="20" viewBox="0 0 26 26" fill="currentColor" aria-hidden="true"><path d="M0 7.43C0 8.45.83 9.29 1.86 9.29s1.86-.84 1.86-1.86V3.71h3.71c1.03 0 1.86-.83 1.86-1.85C9.29.83 8.45 0 7.43 0H1.86C.83 0 0 .83 0 1.86v5.57ZM26 7.43c0 1.02-.83 1.86-1.86 1.86s-1.86-.84-1.86-1.86V3.71h-3.71c-1.03 0-1.86-.83-1.86-1.85C16.71.83 17.55 0 18.57 0h5.57C25.17 0 26 .83 26 1.86v5.57ZM0 18.57c0-1.02.83-1.86 1.86-1.86s1.86.84 1.86 1.86v3.72h3.71c1.03 0 1.86.83 1.86 1.85 0 1.03-.84 1.86-1.86 1.86H1.86C.83 26 0 25.17 0 24.14v-5.57ZM26 18.57c0-1.02-.83-1.86-1.86-1.86s-1.86.84-1.86 1.86v3.72h-3.71c-1.03 0-1.86.83-1.86 1.85 0 1.03.84 1.86 1.86 1.86h5.57c1.03 0 1.86-.83 1.86-1.86v-5.57Z"/></svg>
      </button>
      <button class="sim-tab-btn sim-tab-close" title="Sair da simulação">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        <span>Sair da simulação</span>
      </button>
    </div>
  `;

  frame = overlay.querySelector(".sim-frame");
  titleEl = overlay.querySelector(".sim-tab-title");

  overlay.querySelector(".sim-tab-close").addEventListener("click", () => onClose?.());
  overlay
    .querySelector(".sim-tab-fullscreen")
    .addEventListener("click", () => toggleFullscreen(viewport));

  // Aviso de fim vindo do simulador (só aceita mensagens do próprio iframe)
  window.addEventListener("message", (e) => {
    if (!currentSrc || e.source !== frame.contentWindow) return;
    if (e.data?.tipo === MSG_SIMULACAO_CONCLUIDA) onFinish?.();
  });

  viewport.appendChild(overlay);
};

/**
 * Abre (ou mantém aberto) o simulador da situação.
 * @param {Object} situation - item de "situations" no data.js
 */
export const openSimulator = (situation) => {
  const src = simulatorUrl(situation);
  if (!overlay || !src) return;

  if (src !== currentSrc) {
    frame.src = src;
    currentSrc = src;
  }
  titleEl.textContent = `Situação ${situation.number}`;
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
  frame.focus();
};

/** Fecha e descarrega o simulador (para áudio/vídeo e libera memória) */
export const closeSimulator = () => {
  if (!overlay || !currentSrc) return;
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
  frame.src = "about:blank";
  currentSrc = null;
};
