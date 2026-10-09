/**
 * 3D Modal Module
 * Modal com o <model-viewer>. O elemento é criado uma única vez e só tem
 * o "src" trocado; a biblioteca (~850 KB) é carregada sob demanda na
 * primeira abertura, e não mais no carregamento inicial da página.
 */

import { AddPan } from "./viewer-3d/pan.js";
import { equipmentMedia } from "./ui.js";
import { ICON_ARROW_RIGHT, ICON_FS_EXPAND, ICON_FS_CLOSE } from "./icons.js";

const CAROUSEL_CATEGORY = "quimico"; // categoria que exibe "Outros equipamentos"
const CAMERA_ORBIT = "45deg 55deg 2.5m";
const SCROLL_STEP = 280;

let modal, title, canvas, carouselSection, track;
let viewer = null;
let viewerLoader = null;
let currentCategory = null;
let onSelectEquipment = null;

const loadViewerLib = () =>
  (viewerLoader ??= import("./viewer-3d/model-viewer.min.js"));

/**
 * Liga os eventos do modal uma única vez.
 * @param {{ onSelect: Function }} options - chamado ao escolher outro equipamento
 */
export const initModal3d = ({ onSelect }) => {
  modal = document.getElementById("modal-3d");
  if (!modal) return;

  onSelectEquipment = onSelect;
  title = modal.querySelector(".modal-3d-title");
  canvas = document.getElementById("canvas-3d-container");
  carouselSection = modal.querySelector("#modal-3d-carousel-section");
  track = carouselSection?.querySelector(".modal-3d-carousel-track");

  modal
    .querySelectorAll(".modal-3d-close, .btn-modal-close, .modal-3d-overlay")
    .forEach((el) => el.addEventListener("click", closeModal));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isModalOpen()) closeModal();
  });

  track?.addEventListener("click", (e) => {
    const card = e.target.closest(".modal-carousel-card");
    if (!card || !currentCategory) return;
    const chosen = currentCategory.equipments.find((eq) => eq.id === card.dataset.id);
    if (chosen) onSelectEquipment?.(chosen);
  });

  carouselSection
    ?.querySelector(".btn-modal-carousel-prev")
    ?.addEventListener("click", () => track.scrollBy({ left: -SCROLL_STEP, behavior: "smooth" }));
  carouselSection
    ?.querySelector(".btn-modal-carousel-next")
    ?.addEventListener("click", () => track.scrollBy({ left: SCROLL_STEP, behavior: "smooth" }));
};

export const isModalOpen = () => !!modal?.classList.contains("active");

/** Cria o <model-viewer> (uma vez) com os botões de tela cheia */
const ensureViewer = () => {
  if (viewer) return viewer;

  viewer = document.createElement("model-viewer");
  const attrs = {
    alt: "Modelo 3D do equipamento",
    reveal: "auto",
    "camera-orbit": CAMERA_ORBIT,
    ar: "",
    "ar-scale": "auto",
    "ar-modes": "webxr scene-viewer quick-look",
    "shadow-intensity": "1",
    "camera-controls": "",
  };
  Object.entries(attrs).forEach(([k, v]) => viewer.setAttribute(k, v));

  viewer.innerHTML = `
    <button class="btFullScreen" title="Tela cheia">${ICON_FS_EXPAND}</button>
    <button class="btExitFullScreen" title="Sair da tela cheia">${ICON_FS_CLOSE}</button>
  `;

  const btnEnter = viewer.querySelector(".btFullScreen");
  const btnExit = viewer.querySelector(".btExitFullScreen");
  btnEnter.addEventListener("click", () => viewer.requestFullscreen?.());
  btnExit.addEventListener("click", () => document.exitFullscreen?.());
  document.addEventListener("fullscreenchange", () => {
    const isFull = document.fullscreenElement === viewer;
    btnEnter.style.visibility = isFull ? "hidden" : "visible";
    btnExit.style.visibility = isFull ? "visible" : "hidden";
  });

  canvas.appendChild(viewer);
  AddPan(viewer);
  return viewer;
};

/** Carrossel "Outros equipamentos desta categoria" */
const renderModalCarousel = (category, equipment) => {
  if (!carouselSection || !track) return;

  const others =
    category?.id === CAROUSEL_CATEGORY
      ? (category.equipments || []).filter((e) => e.id !== equipment?.id)
      : [];

  carouselSection.style.display = others.length ? "flex" : "none";
  if (!others.length) return;

  track.innerHTML = others
    .map(
      (item) => `
      <div class="modal-carousel-card" data-id="${item.id}" title="Selecionar ${item.name}">
        <div class="modal-carousel-card-img">${equipmentMedia(item)}</div>
        <div class="modal-carousel-card-info">
          <span class="modal-carousel-card-title">${item.name}</span>
          <span class="modal-carousel-card-action">Selecionar ${ICON_ARROW_RIGHT}</span>
        </div>
      </div>`,
    )
    .join("");
};

/**
 * Atualiza título, modelo e carrossel conforme o estado.
 * Fecha o modal se o equipamento não tiver modelo 3D.
 * @param {Object} state
 */
export const updateModal = (state) => {
  const equipment = state.selectedEquipment;
  if (!modal || !equipment?.model) {
    closeModal();
    return;
  }

  currentCategory = state.selectedCategory;
  if (title) title.textContent = `Visualizador 3D - ${equipment.name}`;

  const src = `assets/models/${equipment.model}.glb`;
  const mv = ensureViewer();
  if (mv.getAttribute("src") !== src) {
    mv.setAttribute("camera-orbit", CAMERA_ORBIT);
    mv.setAttribute("camera-target", "auto auto auto");
    mv.setAttribute("src", src);
  }

  renderModalCarousel(currentCategory, equipment);
};

/** Abre o modal para o equipamento selecionado no estado */
export const openModal = (state) => {
  if (!modal || !state.selectedEquipment?.model) return;
  loadViewerLib();
  updateModal(state);
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
};

export const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
};
