/**
 * Pan para o <model-viewer>: arrastar com botão direito / Ctrl / Shift / Cmd,
 * ou com dois dedos no touch. Um toque simples recentraliza no ponto tocado.
 * Deve ser chamado UMA vez por elemento (os ouvintes de janela são globais).
 * @param {HTMLElement|string} target - elemento ou seletor do model-viewer
 */
export const AddPan = (target) => {
  const modelViewer =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!modelViewer) return;

  const tapDistance = 2;
  let panning = false;
  let panX, panY;
  let startX, startY;
  let lastX, lastY;
  let metersPerPixel;

  const startPan = () => {
    const { theta, phi, radius } = modelViewer.getCameraOrbit();
    const psi = theta - modelViewer.turntableRotation;
    metersPerPixel = (0.75 * radius) / modelViewer.getBoundingClientRect().height;
    panX = [-Math.cos(psi), 0, Math.sin(psi)];
    panY = [
      -Math.cos(phi) * Math.sin(psi),
      Math.sin(phi),
      -Math.cos(phi) * Math.cos(psi),
    ];
    modelViewer.interactionPrompt = "none";
  };

  const movePan = (thisX, thisY) => {
    const dx = (thisX - lastX) * metersPerPixel;
    const dy = (thisY - lastY) * metersPerPixel;
    lastX = thisX;
    lastY = thisY;

    const t = modelViewer.getCameraTarget();
    t.x += dx * panX[0] + dy * panY[0];
    t.y += dx * panX[1] + dy * panY[1];
    t.z += dx * panX[2] + dy * panY[2];
    modelViewer.cameraTarget = `${t.x}m ${t.y}m ${t.z}m`;

    // Pausa a rotação automática
    modelViewer.dispatchEvent(
      new CustomEvent("camera-change", { detail: { source: "user-interaction" } }),
    );
  };

  const recenter = (pointer) => {
    panning = false;
    if (
      Math.abs(pointer.clientX - startX) > tapDistance ||
      Math.abs(pointer.clientY - startY) > tapDistance
    )
      return;
    const hit = modelViewer.positionAndNormalFromPoint(pointer.clientX, pointer.clientY);
    modelViewer.cameraTarget = hit == null ? "auto auto auto" : hit.position.toString();
  };

  const midpoint = (touches) => [
    0.5 * (touches[0].clientX + touches[1].clientX),
    0.5 * (touches[0].clientY + touches[1].clientY),
  ];

  modelViewer.addEventListener(
    "mousedown",
    (event) => {
      startX = event.clientX;
      startY = event.clientY;
      panning = event.button === 2 || event.ctrlKey || event.metaKey || event.shiftKey;
      if (!panning) return;
      lastX = startX;
      lastY = startY;
      startPan();
      event.stopPropagation();
    },
    true,
  );

  modelViewer.addEventListener(
    "touchstart",
    (event) => {
      const { targetTouches, touches } = event;
      startX = targetTouches[0].clientX;
      startY = targetTouches[0].clientY;
      panning = targetTouches.length === 2 && targetTouches.length === touches.length;
      if (!panning) return;
      [lastX, lastY] = midpoint(targetTouches);
      startPan();
    },
    true,
  );

  window.addEventListener(
    "mousemove",
    (event) => {
      if (!panning) return;
      movePan(event.clientX, event.clientY);
      event.stopPropagation();
    },
    true,
  );

  modelViewer.addEventListener(
    "touchmove",
    (event) => {
      if (!panning || event.targetTouches.length !== 2) return;
      movePan(...midpoint(event.targetTouches));
    },
    true,
  );

  window.addEventListener(
    "mouseup",
    (event) => {
      // Só recentraliza se o clique começou no próprio model-viewer
      if (event.target === modelViewer || modelViewer.contains(event.target) || panning) {
        recenter(event);
      }
    },
    true,
  );

  modelViewer.addEventListener(
    "touchend",
    (event) => {
      if (event.targetTouches.length !== 0) return;
      recenter(event.changedTouches[0]);
      if (event.cancelable && event.target === modelViewer) event.preventDefault();
    },
    true,
  );
};
