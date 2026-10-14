/**
 * UI Utilities Module
 * Tela cheia, toasts e pequenos templates compartilhados.
 */

/**
 * Alterna a tela cheia da PÁGINA INTEIRA (<html>).
 *
 * Importante: não colocar o palco (.simulator-viewport) em tela cheia.
 * O navegador aplica ao elemento em tela cheia regras próprias com
 * !important (width/height: 100% e transform: none) que o CSS do projeto
 * não consegue sobrescrever. Isso desligava a escala do palco 1920×1080
 * (resizeWindow.js) e o conteúdo era diagramado no tamanho real da tela,
 * deixando textos e imagens "estourados". Com o <html> em tela cheia o
 * palco continua sendo escalado normalmente.
 *
 * @returns {Promise<void>} resolve quando a troca termina
 */
export const toggleFullscreen = () => {
  const request = document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen();

  return Promise.resolve(request).catch((err) => {
    console.error(`Erro ao alternar tela cheia: ${err.message} (${err.name})`);
  });
};

/* ---------- Toast ---------- */
let toastEl = null;
let toastTimers = [];

/**
 * Mostra uma notificação temporária no topo.
 * Reaproveita um único elemento em vez de criar/remover vários.
 * @param {string} message
 * @param {"info"|"success"} type
 */
export const showToast = (message, type = "info") => {
  toastTimers.forEach(clearTimeout);

  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.setAttribute("role", "status");
    document.body.appendChild(toastEl);
  }

  toastEl.className = `simulator-toast toast-${type}`;
  toastEl.textContent = message;

  toastTimers = [
    setTimeout(() => toastEl.classList.add("visible"), 50),
    setTimeout(() => toastEl.classList.remove("visible"), 3000),
  ];
};

/* ---------- Templates ---------- */
const CATEGORY_ICONS = new Set([
  "ruido",
  "calor",
  "iluminancia",
  "vibracao",
  "multigases",
  "quimico",
]);

/** Imagem do card de categoria (página 3) */
export const getCategoryIcon = (iconName) =>
  CATEGORY_ICONS.has(iconName)
    ? `<img src="assets/img/icons/${iconName}.jpg" alt="" />`
    : "";

/** Imagem do equipamento: SVG inline quando houver, senão a imagem */
export const equipmentMedia = (equipment) =>
  equipment.iconSvg || `<img class="equip-img" src="${equipment.image}" alt="${equipment.name}" />`;
