/**
 * Equipment Detail Module (Página 5)
 * Imagem + botão 3D à esquerda; descrição e situações de uso à direita.
 * Acessível direto pela URL: index.html?equipamento=<id> (ver router.js).
 */

import { getState, setState, selectEquipment } from "./state.js";
import { findSituation } from "./router.js";
import { showToast, equipmentMedia } from "./ui.js";
import { ICON_BACK, ICON_3D } from "./icons.js";
import { isCompleted } from "./progress.js";
import { initQuiz, openQuiz, closeQuiz, hasQuiz } from "./quiz.js";

const ICON_QUIZ = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5"/><path d="M12 17.5h.01"/></svg>`;

const ICON_CHECK = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;

/**
 * Marca (borda verde + check no canto superior esquerdo) as situações cujo
 * simulador já foi concluído. Roda a cada renderização da página 5.
 */
const applyCompletion = (container, equipment) => {
  container.querySelectorAll(".situation-card").forEach((card) => {
    const sit = findSituation(equipment, card.dataset.number);
    const done = isCompleted(sit?.simulador);
    card.classList.toggle("situation-card--done", done);

    let check = card.querySelector(".situation-check");
    if (done && !check) {
      check = document.createElement("span");
      check.className = "situation-check";
      check.title = "Simulação concluída";
      check.innerHTML = `${ICON_CHECK}<span class="sr-only">Concluída</span>`;
      card.prepend(check);
    } else if (!done && check) {
      check.remove();
    }
  });
};
import {
  initModal3d,
  openModal,
  closeModal,
  updateModal,
  isModalOpen,
} from "./modal3d.js";

let renderedId = null; // evita re-renderizar o mesmo equipamento

/**
 * Liga os eventos uma única vez (delegação nas colunas).
 * @param {HTMLElement} container - section da página 5
 */
export const initDetail = (container) => {
  initModal3d({ onSelect: selectEquipment });
  initQuiz();

  container.querySelector(".detail-left-col")?.addEventListener("click", (e) => {
    if (e.target.closest(".btn-page-back")) {
      closeModal();
      closeQuiz();
      setState({ currentPage: 4, activeSituation: null });
    } else if (e.target.closest(".btn-3d-toggle")) {
      openModal(getState());
    } else if (e.target.closest(".btn-quiz-toggle")) {
      const { selectedEquipment, selectedCategory } = getState();
      openQuiz(selectedEquipment, selectedCategory);
    }
  });

  container.querySelector(".detail-right-col")?.addEventListener("click", (e) => {
    const card = e.target.closest(".situation-card");
    if (!card) return;

    const sit = findSituation(getState().selectedEquipment, card.dataset.number);
    if (!sit) return;

    if (sit.simulador) {
      setState({ activeSituation: String(sit.number) }); // abre o simulador (main.js)
    } else {
      showToast(`Simulação da Situação ${sit.number} ainda não disponível.`, "info");
    }
  });
};

/**
 * Renderiza os detalhes do equipamento selecionado.
 * @param {HTMLElement} container
 * @param {Object} state
 */
export const renderDetail = (container, state) => {
  const equipment = state.selectedEquipment;
  if (!equipment) {
    setState({ currentPage: 4 });
    return;
  }

  // Modal aberto acompanha a troca de equipamento (carrossel do modal)
  if (isModalOpen()) updateModal(state);

  if (equipment.id === renderedId) {
    applyCompletion(container, equipment); // ex.: acabou de concluir um simulador
    return;
  }
  renderedId = equipment.id;

  const leftCol = container.querySelector(".detail-left-col");
  const rightCol = container.querySelector(".detail-right-col");

  if (leftCol) {
    leftCol.innerHTML = `
      <div class="detail-preview-card">
        <div class="detail-preview-content">${equipmentMedia(equipment)}</div>
      </div>
      ${
        equipment.model
          ? `<button class="btn btn-outline btn-3d-toggle">${ICON_3D}<span>Visualizar em 3D</span></button>`
          : ""
      }
      ${
        hasQuiz(equipment)
          ? `<button class="btn btn-outline btn-quiz-toggle">${ICON_QUIZ}<span>Teste seu conhecimento</span></button>`
          : ""
      }
      <div class="detail-back-container">
        <button class="btn btn-page-back">${ICON_BACK} Voltar</button>
      </div>
    `;
  }

  if (rightCol) {
    const situations = (equipment.situations || [])
      .map(
        (sit) => `
        <div class="situation-card" data-number="${sit.number}">
          <div class="situation-badge">${sit.number}</div>
          <div class="situation-info">
            <span class="situation-label">Situação ${sit.number}</span>
            <span class="situation-title">(${sit.title})</span>
            ${sit.subTitle ? `<span class="situation-subtitle">${sit.subTitle}</span>` : ""}
          </div>
        </div>`,
      )
      .join("");

    rightCol.innerHTML = `
      <h1 class="detail-equipment-name">${equipment.name}</h1>
      <p class="detail-equipment-description">${equipment.description}</p>
      <hr class="detail-divider">
      <div class="situations-section">
        <h3 class="situations-heading">SITUAÇÕES DE USO</h3>
        <p class="situations-subheading">Selecione uma das situações e acesse o simulador.</p>
        <div class="situations-container${
          (equipment.situations || []).length > 4 ? " situations-container--many" : ""
        }">
          ${situations || '<p class="no-situations">Nenhuma situação cadastrada para este equipamento.</p>'}
        </div>
      </div>
    `;
  }

  applyCompletion(container, equipment);
};
