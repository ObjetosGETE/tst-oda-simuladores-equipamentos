/**
 * UI Utilities Module
 * Tela cheia, toasts e pequenos templates compartilhados.
 */

/**
 * Alterna tela cheia para um elemento.
 * @param {HTMLElement} element
 */
export const toggleFullscreen = (element = document.documentElement) => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    return;
  }
  element.requestFullscreen().catch((err) => {
    console.error(`Erro ao ativar tela cheia: ${err.message} (${err.name})`);
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
