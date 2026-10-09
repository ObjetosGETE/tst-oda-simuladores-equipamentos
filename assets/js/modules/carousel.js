/**
 * Equipment Carousel Module (Página 4)
 * Mostra os equipamentos da categoria e anima a transição do card
 * até a posição da imagem na página 5.
 */

import { getState, setPage, setCarouselIndex } from "./state.js";
import { renderDetail } from "./detail.js";
import { equipmentMedia } from "./ui.js";
import { ICON_DOUBLE_PREV, ICON_DOUBLE_NEXT } from "./icons.js";

const TRANSITION_MS = 650;
const EASE = "cubic-bezier(0.25, 1, 0.5, 1)";

/**
 * Liga os eventos uma única vez (delegação na área do carrossel).
 * @param {HTMLElement} container - section da página 4
 */
export const initCarousel = (container) => {
  const displayArea = container.querySelector(".carousel-display-area");

  displayArea?.addEventListener("click", (e) => {
    if (container.classList.contains("is-transitioning")) return;

    if (e.target.closest(".btn-carousel-prev")) {
      setCarouselIndex(getState().carouselIndex - 1);
    } else if (e.target.closest(".btn-carousel-next")) {
      setCarouselIndex(getState().carouselIndex + 1);
    } else {
      const card = e.target.closest(".carousel-card");
      if (card) transitionToDetail(container, card);
    }
  });

  container.querySelector(".btn-page-back")?.addEventListener("click", () => {
    if (!container.classList.contains("is-transitioning")) setPage(3);
  });
};

/**
 * Renderiza o card do equipamento atual.
 * @param {HTMLElement} container
 * @param {Object} state
 */
export const renderCarousel = (container, state) => {
  const category = state.selectedCategory;
  if (!category) {
    setPage(3);
    return;
  }

  container.classList.remove("is-transitioning");

  const equipments = category.equipments || [];
  const currentEquip = state.selectedEquipment || equipments[0];
  const displayArea = container.querySelector(".carousel-display-area");
  const title = container.querySelector(".carousel-category-title");

  if (title) title.textContent = `Categoria: ${category.title}`;
  if (!displayArea) return;

  if (!currentEquip) {
    displayArea.innerHTML = `<div class="no-equipments">Nenhum equipamento cadastrado nesta categoria.</div>`;
    return;
  }

  // Setas só aparecem quando há mais de um equipamento
  const arrowStyle = equipments.length <= 1 ? ' style="visibility: hidden"' : "";

  displayArea.innerHTML = `
    <button class="btn-carousel btn-carousel-prev" aria-label="Equipamento anterior"${arrowStyle}>${ICON_DOUBLE_PREV}</button>
    <div class="carousel-card" title="Clique para selecionar este equipamento">
      <div class="carousel-card-image-wrapper">${equipmentMedia(currentEquip)}</div>
      <h2 class="carousel-card-title">${currentEquip.name}</h2>
    </div>
    <button class="btn-carousel btn-carousel-next" aria-label="Próximo equipamento"${arrowStyle}>${ICON_DOUBLE_NEXT}</button>
  `;
};

/* ---------- Transição página 4 → página 5 ---------- */
/*
 * Técnica FLIP com "fantasmas": medimos o box da imagem no carrossel (origem)
 * e o box de detalhe da página 5 (destino) e animamos cópias posicionadas
 * por cima de tudo. Assim o box termina EXATAMENTE onde o card de detalhe
 * está, independente de layout, escala da tela ou equipamento.
 */

/**
 * Converte um DOMRect da tela para coordenadas internas do viewport
 * (1920×1080), descontando a escala aplicada pelo resizeWindow.
 */
const toViewportRect = (rect, vpRect, scale) => ({
  left: (rect.left - vpRect.left) / scale.x,
  top: (rect.top - vpRect.top) / scale.y,
  width: rect.width / scale.x,
  height: rect.height / scale.y,
});

const px = (r) => ({
  left: `${r.left}px`,
  top: `${r.top}px`,
  width: `${r.width}px`,
  height: `${r.height}px`,
});

/**
 * Renderiza a página 5 invisível, já no estado "active" (layout final),
 * e mede o box de detalhe e a imagem dentro dele.
 * @returns {{box: DOMRect, media: DOMRect} | null}
 */
const measureDetailTarget = (page5) => {
  renderDetail(page5, getState());

  const prevStyle = page5.getAttribute("style");
  const wasActive = page5.classList.contains("active");
  page5.classList.add("active");
  Object.assign(page5.style, { visibility: "hidden", animation: "none" });

  const box = page5.querySelector(".detail-preview-card");
  const media = page5.querySelector(".detail-preview-content img, .detail-preview-content svg");
  const result = box
    ? {
        box: box.getBoundingClientRect(),
        media: (media || box).getBoundingClientRect(),
      }
    : null;

  if (!wasActive) page5.classList.remove("active");
  if (prevStyle === null) page5.removeAttribute("style");
  else page5.setAttribute("style", prevStyle);

  return result;
};

/**
 * Anima o box da imagem do carrossel até a posição/tamanho do box de detalhe.
 * @param {HTMLElement} container - página 4
 * @param {HTMLElement} card - .carousel-card clicado
 */
const transitionToDetail = (container, card) => {
  const page5 = document.querySelector(".page-5");
  const viewport = document.querySelector(".simulator-viewport");
  const media = card.querySelector(".equip-img, .equip-svg, img, svg");
  const target = page5 && media && measureDetailTarget(page5);

  if (!target || !viewport) {
    setPage(5);
    return;
  }

  const vpRect = viewport.getBoundingClientRect();
  const scale = {
    x: viewport.offsetWidth ? vpRect.width / viewport.offsetWidth : 1,
    y: viewport.offsetHeight ? vpRect.height / viewport.offsetHeight : 1,
  };
  const local = (r) => toViewportRect(r, vpRect, scale);

  const from = { box: local(card.getBoundingClientRect()), media: local(media.getBoundingClientRect()) };
  const to = { box: local(target.box), media: local(target.media) };

  // Fantasma do box: começa como o card branco e vira o card pêssego
  const ghostBox = document.createElement("div");
  ghostBox.className = "transition-ghost transition-ghost-box";
  Object.assign(ghostBox.style, px(from.box));

  // Fantasma da imagem: cópia da mídia, independente do box
  const ghostMedia = media.cloneNode(true);
  ghostMedia.removeAttribute("style");
  ghostMedia.classList.add("transition-ghost", "transition-ghost-media");
  Object.assign(ghostMedia.style, px(from.media));

  viewport.append(ghostBox, ghostMedia);

  // Esconde o card original (título some junto com as setas via CSS)
  container.classList.add("is-transitioning");
  card.style.visibility = "hidden";

  const timing = { duration: TRANSITION_MS, easing: EASE, fill: "forwards" };
  const boxAnim = ghostBox.animate(
    [
      { ...px(from.box), backgroundColor: "#ffffff", borderColor: "rgba(243, 112, 33, 0)", borderRadius: "16px" },
      { ...px(to.box), backgroundColor: "#fedbbf", borderColor: "rgba(243, 112, 33, 1)", borderRadius: "12px" },
    ],
    timing,
  );
  ghostMedia.animate([px(from.media), px(to.media)], timing);

  boxAnim.onfinish = () => {
    // Página 5 entra sem o fade geral: cabeçalho fica parado e o card real
    // aparece exatamente sob os fantasmas (a coluna direita mantém sua animação).
    page5.classList.add("no-page-fade");
    setPage(5);
    container.classList.remove("is-transitioning");
    card.removeAttribute("style");

    // Remove os fantasmas depois que a página 5 foi pintada
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        ghostBox.remove();
        ghostMedia.remove();
      }),
    );
  };
};
