/**
 * Introduction Module (Página 2)
 * Slides de texto com botões Voltar / Avançar.
 */

import { intros } from "../data.js";
import { getState, setState, setPage, setIntroIndex } from "./state.js";
import { ICON_BACK, ICON_NEXT } from "./icons.js";

/**
 * Liga os eventos uma única vez (delegação no card).
 * @param {HTMLElement} container - section da página 2
 */
export const initIntro = (container) => {
  const introCard = container.querySelector(".intro-card");
  if (!introCard) return;

  introCard.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const { introIndex } = getState();
    const isFirst = introIndex === 0;
    const isLast = introIndex === intros.length - 1;

    if (btn.classList.contains("btn-intro-back")) {
      if (isFirst) setPage(1); // volta para a capa
      else setIntroIndex(introIndex - 1);
    } else if (btn.classList.contains("btn-intro-next")) {
      if (isLast) setState({ introIndex: 0, currentPage: 3 }); // grade de categorias
      else setIntroIndex(introIndex + 1);
    }
  });
};

/**
 * Renderiza o slide atual.
 * @param {HTMLElement} container
 * @param {Object} state
 */
export const renderIntro = (container, state) => {
  const introCard = container.querySelector(".intro-card");
  if (!introCard) return;

  const currentText = intros[state.introIndex] || "";
  const isFirst = state.introIndex === 0;
  const isLast = state.introIndex === intros.length - 1;

  const textHtml = currentText
    .split("\n\n")
    .map((para) => `<p class="intro-paragraph">${para}</p>`)
    .join("");

  introCard.innerHTML = `
    <div class="intro-text-content">${textHtml}</div>
    <div class="intro-actions">
      <button class="btn btn-outline btn-intro-back">${ICON_BACK} ${
        isFirst ? "Voltar para Capa" : "Voltar"
      }</button>
      <button class="btn btn-primary btn-intro-next">${
        isLast ? "Iniciar Simulação" : `Avançar ${ICON_NEXT}`
      }</button>
    </div>
  `;
};
