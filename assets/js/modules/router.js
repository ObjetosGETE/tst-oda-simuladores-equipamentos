/**
 * Router Module
 * Sincroniza a página de detalhes (página 5) com a URL.
 *
 *   index.html?equipamento=<id-do-equipamento>[&situacao=<número>]
 *
 * Ex.: index.html?equipamento=bomba_amostragem
 *      index.html?equipamento=bomba_amostragem&situacao=2.1  (abre o simulador)
 * Os ids estão em data.js (campo "id" de cada equipamento).
 */

import { categories } from "../data.js";

export const URL_PARAM = "equipamento";
export const URL_PARAM_SITUATION = "situacao";

/**
 * Procura uma situação do equipamento pelo número ("1", "2.1"...).
 * @returns {Object|null}
 */
export const findSituation = (equipment, number) =>
  number == null
    ? null
    : equipment?.situations?.find((s) => String(s.number) === String(number)) ?? null;

/**
 * Procura um equipamento pelo id em todas as categorias.
 * @param {string} id
 * @returns {{category: Object, equipment: Object, index: number} | null}
 */
export const findEquipment = (id) => {
  if (!id) return null;
  for (const category of categories) {
    const index = (category.equipments || []).findIndex((e) => e.id === id);
    if (index !== -1) {
      return { category, equipment: category.equipments[index], index };
    }
  }
  return null;
};

/**
 * Atualiza o parâmetro na URL sem recarregar e sem criar entradas
 * no histórico (seguro também quando o ODA roda dentro de um iframe/LMS).
 * @param {string|null} id
 */
const writeParam = (id, situation = null) => {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set(URL_PARAM, id);
  else url.searchParams.delete(URL_PARAM);
  if (id && situation) url.searchParams.set(URL_PARAM_SITUATION, situation);
  else url.searchParams.delete(URL_PARAM_SITUATION);

  if (url.href === window.location.href) return;
  try {
    window.history.replaceState(window.history.state, "", url);
  } catch {
    // Alguns contextos (ex.: file://) bloqueiam replaceState — ignora.
  }
};

/**
 * Lê a URL de entrada. Se o equipamento existir, devolve o estado inicial
 * para abrir direto na página de detalhes; se o id for inválido, limpa a URL.
 * @returns {Object|null} patch de estado
 */
export const getInitialRoute = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get(URL_PARAM);
  if (!id) {
    if (params.has(URL_PARAM_SITUATION)) writeParam(null);
    return null;
  }

  const found = findEquipment(id);
  if (!found) {
    writeParam(null);
    return null;
  }

  const situation = findSituation(found.equipment, params.get(URL_PARAM_SITUATION));

  return {
    selectedCategory: found.category,
    selectedEquipment: found.equipment,
    carouselIndex: found.index,
    currentPage: 5,
    activeSituation: situation?.simulador ? String(situation.number) : null,
  };
};

/**
 * Mantém a URL coerente com o estado: com o parâmetro na página 5,
 * sem ele nas demais.
 * @param {Object} state
 */
export const syncUrl = (state) => {
  const onDetail = state.currentPage === 5 && state.selectedEquipment;
  writeParam(
    onDetail ? state.selectedEquipment.id : null,
    onDetail ? state.activeSituation : null,
  );
};
