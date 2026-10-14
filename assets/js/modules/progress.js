/**
 * Progress Module
 * Guarda no localStorage quais simuladores o aluno já concluiu, para que
 * o progresso continue lá quando ele sair e voltar ao ODA.
 *
 * A chave é a pasta do simulador (campo "simulador" no data.js). Assim, um
 * simulador usado por mais de um equipamento (ex.: as situações de Químicos)
 * aparece concluído em todos eles.
 *
 * Formato salvo:
 *   localStorage["oda-tst:simuladores-concluidos"] =
 *     '{"oda_quimico_1":"2026-10-14T15:30:00.000Z", ...}'
 */

const STORAGE_KEY = "oda-tst:simuladores-concluidos";

/** Lê o progresso salvo. Nunca falha: sem acesso ao storage, devolve vazio. */
const read = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
};

const write = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Navegação privada / storage bloqueado: o progresso vale só nesta sessão.
  }
};

// Cópia em memória: garante o visual correto mesmo se o storage falhar
let cache = read();

/** @param {string} simulador - pasta do simulador (ex.: "oda_quimico_1") */
export const isCompleted = (simulador) => !!(simulador && cache[simulador]);

/** Marca o simulador como concluído e salva. */
export const markCompleted = (simulador) => {
  if (!simulador) return;
  cache = { ...read(), ...cache, [simulador]: new Date().toISOString() };
  write(cache);
};

/** Apaga todo o progresso (útil para testes: no console, importar e chamar). */
export const resetProgress = () => {
  cache = {};
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignora */
  }
};

// Mantém abas abertas ao mesmo tempo em sincronia
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) cache = read();
});
