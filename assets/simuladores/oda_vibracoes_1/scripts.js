// scripts.js

let unityInstance = null;
let isSoundEnabled = false;
let currentPosition, controlsOffset, separationSpace;
let urlGuardaChuva = "https://www.google.com/";
let urlQuestionario = "https://www.google.com/";

const controlsContainer = document.querySelector(".controls-container");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const soundBtn = document.getElementById("sound-btn");
const menuButton = document.getElementById("menu");
const menuPanel = document.getElementById("menu-panel");

let panelWidth, focusableEls, firstFocusableEl, lastFocusableEl;

document.addEventListener("DOMContentLoaded", async () => {
  // 1) Carrega config.json
  try {
    const res = await fetch("config.json");
    const cfg = await res.json();

    // VLibras
    if (cfg.enableVLibras) setupVLibras();

    // Controles (posição, offset, espaçamento)
    currentPosition = cfg.controls?.position ?? "SD";
    controlsOffset = cfg.controls?.offset ?? 16;
    separationSpace = cfg.controls?.separation_space_button ?? 12;

    // Cores via variáveis CSS
    const cols = cfg.controls?.colors || {};
    if (cols.fullscreen)
      document.documentElement.style.setProperty(
        "--color-fullscreen",
        cols.fullscreen,
      );
    if (cols.sound)
      document.documentElement.style.setProperty("--color-sound", cols.sound);
    if (cols.menu)
      document.documentElement.style.setProperty("--color-menu", cols.menu);
    if (cols.panel)
      document.documentElement.style.setProperty("--color-panel", cols.panel);
  } catch (err) {
    console.warn("Erro ao ler config.json:", err);
    currentPosition = "SD";
    controlsOffset = 16;
    separationSpace = 12;
  }

  // 2) Posiciona controles
  positionControls({
    position: currentPosition,
    offset: controlsOffset,
    separation_space_button: separationSpace,
  });

  // 3) Inicializa menu e filtros
  initMenu();
  initFilters();

  // 4) Pré-carrega ativos críticos
  preloadAssets();

  // 5) Som de clique em botões (exceto sound-btn)
  attachClickSound();

  // 6) Ícones iniciais
  updateSoundIcon();

  updateFullscreenIcon();

  // 7) Desabilita F11
  document.addEventListener("keydown", disableF11);

  // 8) Atualiza ícone fullscreen ao mudar
  document.addEventListener("fullscreenchange", updateFullscreenIcon);

  // 9) Resize do canvas com debounce
  window.addEventListener("resize", debounce(resizeCanvas, 100));

  // 10) Carrega Unity WebGL
  loadUnity();
});

// ——— VLibras ———
function setupVLibras() {
  const container = document.getElementById("vlibras-container");
  container.setAttribute("vw", "");
  container.classList.add("enabled");

  const accessBtn = document.createElement("div");
  accessBtn.setAttribute("vw-access-button", "");
  accessBtn.classList.add("active");
  container.appendChild(accessBtn);

  const pluginWrap = document.createElement("div");
  pluginWrap.setAttribute("vw-plugin-wrapper", "");
  const topWrap = document.createElement("div");
  topWrap.classList.add("vw-plugin-top-wrapper");
  pluginWrap.appendChild(topWrap);
  container.appendChild(pluginWrap);

  const vlScript = document.createElement("script");
  vlScript.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
  vlScript.onload = () =>
    new window.VLibras.Widget("https://vlibras.gov.br/app");
  document.body.appendChild(vlScript);
}

// ——— Pré-carrega imagens críticas ———
function preloadAssets() {
  [
    "image/rotate-device.gif",
    "image/fullscreen-enter.svg",
    "image/fullscreen-exit.svg",
    "image/sound-on.svg",
    "image/sound-off.svg",
  ].forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// ——— Som de clique ———
function attachClickSound() {
  const clickSound = document.getElementById("click-sound");
  document.querySelectorAll("button:not(.sound-btn)").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isSoundEnabled) {
        clickSound.currentTime = 0;
        clickSound.play();
      }
    });
  });
}

// ——— Posicionamento Dinâmico do Container de Controles ———
function positionControls({ position, offset, separation_space_button }) {
  const ctr = controlsContainer;
  ctr.style.position = "fixed";
  ctr.style.margin = "0";
  ctr.style.display = "flex";
  ctr.style.flexDirection = "column";
  ctr.style.gap = `${separation_space_button}px`;
  ctr.style.top = `${offset}px`;
  if (position === "SD") {
    ctr.style.right = `${offset}px`;
    ctr.style.left = "auto";
  } else {
    ctr.style.left = `${offset}px`;
    ctr.style.right = "auto";
  }
}

// ——— Inicialização do Menu ———
function initMenu() {
  panelWidth = menuPanel.offsetWidth;
  menuPanel.classList.remove("panel-right", "open-left", "open-right");
  menuButton.classList.remove("open-left", "open-right");

  if (currentPosition === "SD") {
    menuPanel.classList.add("panel-right");
  }

  // esconde para leitores de tela
  menuPanel.setAttribute("aria-hidden", "true");

  menuButton.addEventListener("click", () =>
    isPanelOpen() ? closeMenu() : openMenu(),
  );
}

function isPanelOpen() {
  return currentPosition === "SD"
    ? menuPanel.classList.contains("open-right")
    : menuPanel.classList.contains("open-left");
}

function openMenu() {
  if (currentPosition === "SD") {
    menuPanel.classList.add("open-right");
    menuButton.classList.add("open-right");
  } else {
    menuPanel.classList.add("open-left");
    menuButton.classList.add("open-left");
  }
  menuPanel.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");
  trapFocus();
}

function closeMenu() {
  if (currentPosition === "SD") {
    menuPanel.classList.remove("open-right");
    menuButton.classList.remove("open-right");
  } else {
    menuPanel.classList.remove("open-left");
    menuButton.classList.remove("open-left");
  }
  menuPanel.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
  releaseFocus();
  menuButton.focus();
}

// ——— Focus Trap ———
function trapFocus() {
  focusableEls = Array.from(
    menuPanel.querySelectorAll(
      'button, [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
  firstFocusableEl = focusableEls[0];
  lastFocusableEl = focusableEls[focusableEls.length - 1];
  firstFocusableEl.focus();
  document.addEventListener("keydown", handleMenuKeydown);
}

function releaseFocus() {
  document.removeEventListener("keydown", handleMenuKeydown);
}

function handleMenuKeydown(e) {
  if (e.key === "Escape") {
    e.preventDefault();
    closeMenu();
  } else if (e.key === "Tab") {
    if (e.shiftKey && document.activeElement === firstFocusableEl) {
      e.preventDefault();
      lastFocusableEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusableEl) {
      e.preventDefault();
      firstFocusableEl.focus();
    }
  }
}

// ——— Filtros de Daltonismo ———
function initFilters() {
  const map = {
    acromatopsia: "grayscale",
    protanomalia: "protanopia",
    deuteranomalia: "deuteranopia",
    tritanomalia: "tritanopia",
    normal: "normal",
  };
  Object.keys(map).forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        applyFilter(map[id]); // Aplica o filtro
        closeMenu(); // Adiciona esta linha para fechar o menu
      });
    }
  });
}

function applyFilter(filterType) {
  document.body.classList.remove(
    "grayscale",
    "deuteranopia",
    "protanopia",
    "tritanopia",
  );
  if (filterType !== "normal") {
    document.body.classList.add(filterType);
  }
}

// ——— Mutar / Desmutar Som ———
function toggleSound() {
  isSoundEnabled = !isSoundEnabled;
  updateSoundIcon();
  if (unityInstance) {
    unityInstance.SendMessage(
      "AudioManager",
      "SetMute",
      isSoundEnabled ? 0 : 1,
    );
  }
}

function updateSoundIcon() {
  if (isSoundEnabled) {
    soundBtn.style.maskImage = "url('image/sound-off.svg')";
    soundBtn.style.webkitMaskImage = "url('image/sound-off.svg')";
    soundBtn.setAttribute("aria-label", "Mutar som");
    soundBtn.setAttribute("aria-pressed", "true");
  } else {
    soundBtn.style.maskImage = "url('image/sound-on.svg')";
    soundBtn.style.webkitMaskImage = "url('image/sound-on.svg')";
    soundBtn.setAttribute("aria-label", "Ativar som");
    soundBtn.setAttribute("aria-pressed", "false");
  }
}

// ——— Tela Cheia ———
function toggleFullscreen() {
  const docElm = document.documentElement;
  if (!document.fullscreenElement) {
    docElm.requestFullscreen?.() || docElm.webkitRequestFullscreen?.();
  } else {
    document.exitFullscreen?.() || document.webkitExitFullscreen?.();
  }
  updateFullscreenIcon();
}

function updateFullscreenIcon() {
  if (window.parent !== window) {
    fullscreenBtn.style.display = "none"; // Oculta o botão de tela cheia se estiver em um iframe
    return;
  }
  if (document.fullscreenElement) {
    fullscreenBtn.style.maskImage = "url('image/fullscreen-exit.svg')";
    fullscreenBtn.style.webkitMaskImage = "url('image/fullscreen-exit.svg')";
    fullscreenBtn.setAttribute("aria-label", "Sair da tela cheia");
    fullscreenBtn.setAttribute("aria-pressed", "true");
  } else {
    fullscreenBtn.style.maskImage = "url('image/fullscreen-enter.svg')";
    fullscreenBtn.style.webkitMaskImage = "url('image/fullscreen-enter.svg')";
    fullscreenBtn.setAttribute("aria-label", "Entrar em tela cheia");
    fullscreenBtn.setAttribute("aria-pressed", "false");
  }
}

// ——— Desabilita F11 ———
function disableF11(event) {
  if (event.key === "F11") {
    event.preventDefault();
    alert("Use o botão de ZOOM para zoom in e zoom out");
  }
}

// ——— Barra de Progresso ———
function updateProgressBar(value) {
  const filler = document.getElementById("progressFiller");
  filler.style.width = `${Math.min(value * 100, 100)}%`;
  if (value >= 1) {
    filler.style.animation = "none";
    filler.style.backgroundColor = "#00ff00";
  }
}

// ——— Redimensiona Canvas ———
function resizeCanvas() {
  const canvas = document.getElementById("unityCanvas");
  const container = document.getElementById("unityContainer");
  const cAR = container.clientWidth / container.clientHeight;
  const pAR = 16 / 9;
  if (cAR > pAR) {
    canvas.style.width = `${container.clientHeight * pAR}px`;
    canvas.style.height = `${container.clientHeight}px`;
  } else {
    canvas.style.width = `${container.clientWidth}px`;
    canvas.style.height = `${container.clientWidth / pAR}px`;
  }
  if (unityInstance) {
    unityInstance.SendMessage(
      "CanvasResizeHandler",
      "OnResize",
      `${canvas.clientWidth},${canvas.clientHeight}`,
    );
  }
}

// ——— Debounce ———
function debounce(func, wait = 100) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ——— Carrega Unity WebGL ———
function loadUnity() {
  const loaderScript = document.createElement("script");
  loaderScript.src = "Build/Build.loader.js";
  loaderScript.async = true;
  loaderScript.onload = () => {
    createUnityInstance(
      document.querySelector("#unityCanvas"),
      {
        dataUrl: "Build/Build.data.unityweb",
        frameworkUrl: "Build/Build.framework.js.unityweb",
        codeUrl: "Build/Build.wasm.unityweb",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "SenacRS",
        productName: "UnityTemplate2024",
        productVersion: "0.1.0",
      },
      (progress) => updateProgressBar(progress),
    )
      .then((instance) => {
        unityInstance = instance;
        if (!isSoundEnabled) {
          unityInstance.SendMessage("AudioManager", "SetMute", 1);
        }
        const loadingBar = document.getElementById("loadingBar");
        if (loadingBar) loadingBar.style.display = "none";
        resizeCanvas();
      })
      .catch(alert);
  };
  document.body.appendChild(loaderScript);
}

function AbrirGuardaChuva() {
  // Dentro do ODA (iframe): avisa a página principal, que fecha o simulador
  // e volta para a página do equipamento.
  if (window.parent !== window) {
    window.parent.postMessage({ tipo: "simulacao-concluida" }, "*");
    return;
  }
  // Aberto sozinho: comportamento original
  window.open(urlGuardaChuva, "_blank").focus();
}

function AbrirQuestionario() {
  // Dentro do ODA (iframe): avisa a página principal, que fecha o simulador
  // e volta para a página do equipamento.

  // Aberto sozinho: comportamento original
  window.open(urlQuestionario, "_blank").focus();
}
