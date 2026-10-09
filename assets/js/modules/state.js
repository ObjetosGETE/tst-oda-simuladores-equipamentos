/**
 * Simulator State Management Module
 * Estado global simples (pub/sub). Cada alteração notifica os ouvintes
 * UMA única vez, mesmo quando vários campos mudam juntos.
 */

const state = {
  currentPage: 1, // 1 a 5
  introIndex: 0,
  selectedCategory: null, // objeto da categoria
  selectedEquipment: null, // objeto do equipamento
  carouselIndex: 0, // índice do equipamento na categoria ativa
  activeSituation: null, // número da situação com simulador aberto ("2.1"), ou null
};

const listeners = new Set();

export const getState = () => ({ ...state });

/**
 * Registra um ouvinte. Ele recebe (estadoAtual, estadoAnterior).
 * @returns {Function} função para cancelar a inscrição
 */
export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/**
 * Aplica um patch ao estado e notifica apenas se algo mudou.
 * @param {Object} patch
 */
export const setState = (patch) => {
  const prev = { ...state };
  let changed = false;

  for (const key of Object.keys(patch)) {
    if (key in state && state[key] !== patch[key]) {
      state[key] = patch[key];
      changed = true;
    }
  }

  if (!changed) return;
  const snapshot = { ...state };
  listeners.forEach((listener) => listener(snapshot, prev));
};

export const setPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= 5) setState({ currentPage: pageNumber });
};

export const setIntroIndex = (introIndex) => setState({ introIndex });

/**
 * Seleciona uma categoria (e seu primeiro equipamento).
 * @param {Object} category
 * @param {number} [page] página para navegar na mesma atualização
 */
export const selectCategory = (category, page) => {
  setState({
    selectedCategory: category,
    selectedEquipment: category?.equipments?.[0] ?? null,
    carouselIndex: 0,
    ...(page && { currentPage: page }),
  });
};

export const setCarouselIndex = (index) => {
  const equipments = state.selectedCategory?.equipments;
  if (!equipments?.length) return;

  const normalizedIndex = (index + equipments.length) % equipments.length; // circular
  setState({
    carouselIndex: normalizedIndex,
    selectedEquipment: equipments[normalizedIndex],
  });
};

export const selectEquipment = (equipment) => {
  const idx =
    state.selectedCategory?.equipments?.findIndex((e) => e.id === equipment.id) ?? -1;

  setState({
    selectedEquipment: equipment,
    ...(idx !== -1 && { carouselIndex: idx }),
  });
};
