/**
 * Click Sound Module
 * Toca um som de clique em todos os botões e cards clicáveis da etapa 1.
 * Som: assets/sounds/click-sound.mp3 (o mesmo dos simuladores de vibração).
 *
 * Usa um único ouvinte no documento (delegação), então funciona também para
 * elementos criados depois (cards, modais, quiz...).
 */

const SOUND_SRC = "assets/sounds/click-sound.mp3";
const VOLUME = 0.6;

/** O que conta como "clicável" na etapa 1 */
const CLICKABLE = [
  "button",
  ".category-card",
  ".carousel-card",
  ".situation-card",
  ".modal-carousel-card",
].join(",");

let audio = null;

const play = () => {
  try {
    audio.currentTime = 0;
    audio.play()?.catch(() => {}); // navegador pode bloquear antes da 1ª interação
  } catch {
    /* sem áudio: segue sem som */
  }
};

const isEnabled = (el) => el && !el.disabled && el.getAttribute("aria-disabled") !== "true";

export const initClickSound = () => {
  if (audio) return;
  audio = new Audio(SOUND_SRC);
  audio.preload = "auto";
  audio.volume = VOLUME;

  // Mouse / toque: toca ao pressionar (resposta imediata)
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (e.button !== 0) return; // só botão principal
      if (isEnabled(e.target.closest(CLICKABLE))) play();
    },
    true,
  );

  // Teclado: Enter / Espaço em um elemento clicável focado
  document.addEventListener(
    "keydown",
    (e) => {
      if ((e.key === "Enter" || e.key === " ") && !e.repeat && isEnabled(e.target.closest?.(CLICKABLE))) {
        play();
      }
    },
    true,
  );
};
