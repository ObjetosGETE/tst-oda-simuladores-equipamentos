/**
 * Ícones SVG compartilhados (antes duplicados em vários módulos).
 */

const CHEVRON_PATH =
  "M14.4508 11.6888C15.1831 12.414 15.1831 13.5918 14.4508 14.317L3.20299 25.4561C2.47071 26.1813 1.28149 26.1813 0.549209 25.4561C-0.18307 24.7309 -0.18307 23.5532 0.549209 22.828L10.4731 13L0.555067 3.17204C-0.177212 2.44684 -0.177212 1.26911 0.555067 0.543903C1.28735 -0.181301 2.47657 -0.181301 3.20885 0.543903L14.4566 11.683L14.4508 11.6888Z";

const chevron = (flip = false) =>
  `<svg width="15" height="26" viewBox="0 0 15 26"${
    flip ? ' style="transform: scale(-1)"' : ""
  } fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="${CHEVRON_PATH}" fill="currentColor"/></svg>`;

/** Seta "Voltar" (aponta para a esquerda) */
export const ICON_BACK = chevron(true);

/** Seta "Avançar" (aponta para a direita) */
export const ICON_NEXT = chevron(false);

/** Chevrons duplos do carrossel da página 4 */
export const ICON_DOUBLE_PREV = `<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M17 18l-6-6 6-6M11 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const ICON_DOUBLE_NEXT = `<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M7 6l6 6-6 6M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** Ícone de camadas/cubo do botão "Visualizar em 3D" */
export const ICON_3D = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" class="icon-3d" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`;

/** Seta simples usada nos cards do carrossel do modal */
export const ICON_ARROW_RIGHT = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** Tela cheia (expandir / recolher) do visualizador 3D */
export const ICON_FS_EXPAND = `<svg width="22" height="22" viewBox="0 0 26 26" fill="currentColor" aria-hidden="true"><path d="M0 7.43C0 8.45.83 9.29 1.86 9.29s1.86-.84 1.86-1.86V3.71h3.71c1.03 0 1.86-.83 1.86-1.85C9.29.83 8.45 0 7.43 0H1.86C.83 0 0 .83 0 1.86v5.57ZM26 7.43c0 1.02-.83 1.86-1.86 1.86s-1.86-.84-1.86-1.86V3.71h-3.71c-1.03 0-1.86-.83-1.86-1.85C16.71.83 17.55 0 18.57 0h5.57C25.17 0 26 .83 26 1.86v5.57ZM0 18.57c0-1.02.83-1.86 1.86-1.86s1.86.84 1.86 1.86v3.72h3.71c1.03 0 1.86.83 1.86 1.85 0 1.03-.84 1.86-1.86 1.86H1.86C.83 26 0 25.17 0 24.14v-5.57ZM26 18.57c0-1.02-.83-1.86-1.86-1.86s-1.86.84-1.86 1.86v3.72h-3.71c-1.03 0-1.86.83-1.86 1.85 0 1.03.84 1.86 1.86 1.86h5.57c1.03 0 1.86-.83 1.86-1.86v-5.57Z"/></svg>`;
export const ICON_FS_CLOSE = `<svg width="22" height="22" viewBox="0 0 26 26" fill="currentColor" aria-hidden="true"><path d="M9.29 1.86C9.29.83 8.45 0 7.43 0S5.57.83 5.57 1.86v3.71H1.86C.83 5.57 0 6.4 0 7.43s.83 1.86 1.86 1.86h5.57c1.02 0 1.86-.84 1.86-1.86V1.86ZM16.71 1.86c0-1.03.84-1.86 1.86-1.86s1.86.83 1.86 1.86v3.71h3.71c1.03 0 1.86.83 1.86 1.86s-.83 1.86-1.86 1.86h-5.57c-1.02 0-1.86-.84-1.86-1.86V1.86ZM9.29 24.14c0 1.03-.84 1.86-1.86 1.86s-1.86-.83-1.86-1.86v-3.71H1.86C.83 20.43 0 19.6 0 18.57s.83-1.86 1.86-1.86h5.57c1.02 0 1.86.84 1.86 1.86v5.57ZM16.71 24.14c0 1.03.84 1.86 1.86 1.86s1.86-.83 1.86-1.86v-3.71h3.71c1.03 0 1.86-.83 1.86-1.86s-.83-1.86-1.86-1.86h-5.57c-1.02 0-1.86.84-1.86 1.86v5.57Z"/></svg>`;
