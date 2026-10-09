/**
 * Escala o palco fixo (1920×1080) para caber na janela, mantendo a proporção.
 */

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

const getScale = () => {
  const vw = window.visualViewport?.width ?? window.innerWidth;
  const vh = window.visualViewport?.height ?? window.innerHeight;
  return Math.min(vw / BASE_WIDTH, vh / BASE_HEIGHT);
};

export const resizeWindow = (selector = ".simulator-viewport") => {
  const scale = getScale();
  document.querySelectorAll(selector).forEach((node) => {
    node.style.transform = `scale(${scale})`;
    node.style.transformOrigin = "center";
  });
};

/**
 * Aplica a escala agora e a cada redimensionamento (no máximo 1x por frame).
 */
export const watchResize = (selector = ".simulator-viewport") => {
  let frame = 0;
  const onResize = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => resizeWindow(selector));
  };

  resizeWindow(selector);
  window.addEventListener("resize", onResize);
  window.visualViewport?.addEventListener("resize", onResize);
};
