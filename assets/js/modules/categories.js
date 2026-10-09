/**
 * Categories Grid Module (Página 3)
 * A grade é estática: é montada uma única vez no init.
 */

import { categories, intros } from "../data.js";
import { selectCategory, setState } from "./state.js";
import { getCategoryIcon } from "./ui.js";

/**
 * @param {HTMLElement} container - section da página 3
 */
export const initCategories = (container) => {
  const grid = container.querySelector(".categories-grid");

  if (grid) {
    grid.innerHTML = categories
      .map(
        (category) => `
        <div class="category-card" data-id="${category.id}">
          <div class="category-card-icon-wrapper">${getCategoryIcon(category.icon)}</div>
          <div class="category-card-footer"><h3>${category.title}</h3></div>
        </div>`,
      )
      .join("");

    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".category-card");
      if (!card) return;
      const category = categories.find((c) => c.id === card.dataset.id);
      if (category) selectCategory(category, 4); // seleciona e vai ao carrossel
    });
  }

  // Voltar → último slide da introdução
  container.querySelector(".btn-page-back")?.addEventListener("click", () => {
    setState({ introIndex: intros.length - 1, currentPage: 2 });
  });
};
