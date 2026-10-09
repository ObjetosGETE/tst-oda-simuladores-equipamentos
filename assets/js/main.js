/**
 * Main Controller
 * Inicializa os módulos (eventos ligados uma única vez), troca a página
 * ativa conforme o estado e mantém a URL sincronizada.
 */

import { watchResize } from "./modules/resizeWindow.js";
import { getState, setState, subscribe, setPage } from "./modules/state.js";
import { getInitialRoute, syncUrl, findSituation } from "./modules/router.js";
import { initSimulatorOverlay, openSimulator, closeSimulator } from "./modules/simulator.js";
import { initIntro, renderIntro } from "./modules/intro.js";
import { initCategories } from "./modules/categories.js";
import { initCarousel, renderCarousel } from "./modules/carousel.js";
import { initDetail, renderDetail } from "./modules/detail.js";
import { toggleFullscreen, showToast } from "./modules/ui.js";

const init = () => {
  const viewport = document.querySelector(".simulator-viewport");
  const pages = {};
  for (let i = 1; i <= 5; i++) pages[i] = document.querySelector(`.page-${i}`);

  watchResize(".simulator-viewport");

  // Eventos fixos (uma única vez)
  document
    .querySelectorAll(".btn-fullscreen")
    .forEach((btn) => btn.addEventListener("click", () => toggleFullscreen(viewport)));
  document.querySelector(".btn-start")?.addEventListener("click", () => setPage(2));

  initIntro(pages[2]);
  initCategories(pages[3]);
  initCarousel(pages[4]);
  initDetail(pages[5]);
  initSimulatorOverlay({
    onClose: () => setState({ activeSituation: null }),
    // fim da simulação: fecha e volta para a página do equipamento
    onFinish: () => {
      setState({ activeSituation: null });
      showToast("Simulação concluída!", "success");
    },
  });

  // Página 3 é estática (montada no init) e a 1 é HTML puro
  const renderers = {
    2: renderIntro,
    4: renderCarousel,
    5: renderDetail,
  };

  const handleStateChange = (state, prev) => {
    if (!prev || prev.currentPage !== state.currentPage) {
      Object.entries(pages).forEach(([id, el]) => {
        const isActive = Number(id) === state.currentPage;
        el?.classList.toggle("active", isActive);
        // "no-page-fade" vale só para uma entrada (ver transição em carousel.js)
        if (!isActive) el?.classList.remove("no-page-fade");
      });
    }

    // Simulador da situação: só existe sobre a página de detalhes
    if (state.currentPage !== 5 && state.activeSituation) {
      setState({ activeSituation: null });
      return;
    }

    syncUrl(state);
    renderers[state.currentPage]?.(pages[state.currentPage], state, prev);

    const situation = findSituation(state.selectedEquipment, state.activeSituation);
    if (state.currentPage === 5 && situation?.simulador) openSimulator(situation);
    else closeSimulator();
  };

  subscribe(handleStateChange);

  // Acesso direto pela URL (?equipamento=<id>) abre a página de detalhes
  const route = getInitialRoute();
  if (route) setState(route);
  else handleStateChange(getState(), null);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
