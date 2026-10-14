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
  quizCache = {};
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(QUIZ_KEY);
  } catch {
    /* ignora */
  }
};

/* ---------- Quizzes ("Teste seu conhecimento") ---------- */
const QUIZ_KEY = "oda-tst:quizzes-concluidos";

const readQuiz = () => {
  try {
    const data = JSON.parse(localStorage.getItem(QUIZ_KEY) || "{}");
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
};

let quizCache = readQuiz();

/**
 * Chave da situação no progresso dos quizzes: a pasta do simulador
 * (compartilhada pelos equipamentos de Químico), ou equipamento + número.
 */
export const quizKey = (equipment, situation) =>
  situation?.simulador || `${equipment?.id}:${situation?.number}`;

/** @returns {{score:number,total:number,date:string}|null} */
export const getQuizResult = (key) => quizCache[key] ?? null;

/**
 * Situação do quiz:
 *   null    - nunca respondido
 *   "wrong" - respondido, mas sem acertar todas (marcado como errado)
 *   "done"  - acertou todas as perguntas em alguma tentativa (concluído)
 * Como guardamos a melhor pontuação, depois de "done" ele não volta a "wrong".
 */
export const getQuizStatus = (key) => {
  const r = quizCache[key];
  if (!r) return null;
  return r.score >= r.total ? "done" : "wrong";
};

export const isQuizCompleted = (key) => getQuizStatus(key) === "done";

/** Registra uma tentativa do quiz (guarda a melhor pontuação). */
export const markQuizCompleted = (key, score, total) => {
  const prev = readQuiz()[key] ?? quizCache[key];
  const best = prev && prev.score > score ? prev.score : score;
  quizCache = { ...readQuiz(), ...quizCache, [key]: { score: best, total, date: new Date().toISOString() } };
  try {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(quizCache));
  } catch {
    /* storage bloqueado: vale só nesta sessão */
  }
};

// Mantém abas abertas ao mesmo tempo em sincronia
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) cache = read();
  if (e.key === QUIZ_KEY) quizCache = readQuiz();
});
