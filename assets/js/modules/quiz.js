/**
 * Quiz Modal Module ("Questionário" — página 5)
 *
 * Um único modal com três telas:
 *   1. Seletor de situação (check verde no canto superior direito das concluídas)
 *   2. Perguntas (uma por vez, com correção imediata)
 *   3. Resultado (acertos, refazer, voltar às situações)
 *
 * Perguntas em ../quizzes.js; cada situação aponta para o quiz pelo campo
 * "quiz" no data.js. O progresso fica no localStorage (progress.js).
 */

import { quizzes } from "../quizzes.js";
import {
  quizKey,
  getQuizStatus,
  getQuizResult,
  markQuizCompleted,
} from "./progress.js";
import { ICON_BACK, ICON_NEXT } from "./icons.js";

const LETTERS = ["A", "B", "C", "D", "E"];

const ICON_CHECK = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const ICON_X = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
const ICON_RETRY = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>`;

let modal = null;
let titleEl = null;
let body = null;

// Sessão atual
let equipment = null;
let modalTitle = "Questionário"; // "Questionário - <categoria>"
let situation = null;
let quiz = null;
let index = 0;
let score = 0;
let answered = false;

/** Situações do equipamento que têm quiz cadastrado */
const quizSituations = (eq) =>
  (eq?.situations || []).filter(
    (s) => s.quiz && quizzes[s.quiz]?.questions?.length,
  );

/** O equipamento tem algum quiz? (decide se o botão aparece) */
export const hasQuiz = (eq) => quizSituations(eq).length > 0;

export const isQuizOpen = () => !!modal?.classList.contains("active");

/** Cria o modal (uma vez) dentro do palco do ODA. */
export const initQuiz = () => {
  const viewport = document.querySelector(".simulator-viewport");
  if (!viewport || modal) return;

  modal = document.createElement("div");
  modal.className = "modal-quiz";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-quiz-overlay"></div>
    <div class="modal-quiz-container" role="dialog" aria-modal="true" aria-labelledby="modal-quiz-title">
      <div class="modal-quiz-header">
        <h3 class="modal-quiz-title" id="modal-quiz-title">Questionário</h3>
        <button class="modal-quiz-close" aria-label="Fechar">&times;</button>
      </div>
      <div class="modal-quiz-body"></div>
    </div>
  `;

  titleEl = modal.querySelector(".modal-quiz-title");
  body = modal.querySelector(".modal-quiz-body");

  modal
    .querySelectorAll(".modal-quiz-close, .modal-quiz-overlay")
    .forEach((el) => el.addEventListener("click", closeQuiz));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isQuizOpen()) closeQuiz();
  });

  body.addEventListener("click", onBodyClick);
  viewport.appendChild(modal);
};

/* ---------- Eventos (delegação) ---------- */
const onBodyClick = (e) => {
  const sitCard = e.target.closest(".quiz-situation-card");
  if (sitCard) {
    const sit = quizSituations(equipment).find(
      (s) => String(s.number) === sitCard.dataset.number,
    );
    if (sit) startQuiz(sit);
    return;
  }

  const option = e.target.closest(".quiz-option");
  if (option && !answered) {
    answer(Number(option.dataset.index));
    return;
  }

  if (e.target.closest(".quiz-btn-next")) {
    index += 1;
    if (index < quiz.questions.length) renderQuestion();
    else finishQuiz();
  } else if (e.target.closest(".quiz-btn-retry")) {
    startQuiz(situation);
  } else if (e.target.closest(".quiz-btn-situations")) {
    renderSelector();
  }
};

/* ---------- Telas ---------- */
const setView = (html, view) => {
  body.dataset.view = view;
  body.innerHTML = html;
  body.scrollTop = 0;
  // Foco no primeiro elemento útil (teclado / leitor de tela)
  body.querySelector("[data-autofocus]")?.focus({ preventScroll: true });
};

const renderSelector = () => {
  titleEl.textContent = modalTitle;
  const situations = quizSituations(equipment);

  const cards = situations
    .map((sit) => {
      const key = quizKey(equipment, sit);
      const status = getQuizStatus(key); // null | "wrong" | "done"
      const result = getQuizResult(key);
      const mark =
        status === "done"
          ? `<span class="quiz-situation-check" title="Quiz concluído">${ICON_CHECK}<span class="sr-only">Concluído</span></span>`
          : status === "wrong"
            ? `<span class="quiz-situation-check is-wrong" title="Há respostas erradas: refaça o quiz">${ICON_X}<span class="sr-only">Com erros</span></span>`
            : "";
      return `
        <button class="quiz-situation-card${status ? ` is-${status}` : ""}" data-number="${sit.number}">
          ${mark}
          <span class="quiz-situation-badge">${sit.number}</span>
          <span class="quiz-situation-label">Situação ${sit.number}</span>
          <span class="quiz-situation-title">${sit.title}</span>
          ${sit.subTitle ? `<span class="quiz-situation-subtitle">${sit.subTitle}</span>` : ""}
          ${
            result
              ? `<span class="quiz-situation-score">${
                  status === "done" ? "Concluído" : "Refaça o quiz"
                } · melhor resultado: ${result.score}/${result.total}</span>`
              : ""
          }
        </button>`;
    })
    .join("");

  setView(
    `
    <p class="quiz-intro">Selecione uma situação para responder ao quiz.</p>
    <div class="quiz-situations${situations.length > 4 ? " quiz-situations--many" : ""}">${cards}</div>
  `,
    "selector",
  );
};

const startQuiz = (sit) => {
  situation = sit;
  quiz = quizzes[sit.quiz];
  index = 0;
  score = 0;
  renderQuestion();
};

const progressBar = () => {
  const total = quiz.questions.length;
  const pct = Math.round((index / total) * 100);
  return `
    <div class="quiz-topbar">
      <button class="btn btn-outline quiz-btn-situations">${ICON_BACK} Situações</button>
      <span class="quiz-step">Situação ${situation.number} · Pergunta ${index + 1} de ${total}</span>
    </div>
    <div class="quiz-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${index}">
      <div class="quiz-progress-fill" style="width:${pct}%"></div>
    </div>`;
};

const renderQuestion = () => {
  answered = false;
  titleEl.textContent = modalTitle;
  const q = quiz.questions[index];

  const options = q.options
    .map(
      (opt, i) => `
      <button class="quiz-option" data-index="${i}"${i === 0 ? " data-autofocus" : ""}>
        <span class="quiz-option-letter">${LETTERS[i]}</span>
        <span class="quiz-option-text">${opt}</span>
      </button>`,
    )
    .join("");

  setView(
    `
    ${progressBar()}
    <h4 class="quiz-question">${q.text}</h4>
    <div class="quiz-options">${options}</div>
    <div class="quiz-footer">
      <p class="quiz-feedback" aria-live="polite"></p>
      <button class="btn btn-primary quiz-btn-next" hidden></button>
    </div>
  `,
    "question",
  );
};

const answer = (chosen) => {
  answered = true;
  const q = quiz.questions[index];
  const isRight = chosen === q.correct;
  if (isRight) score += 1;

  body.querySelectorAll(".quiz-option").forEach((btn) => {
    const i = Number(btn.dataset.index);
    btn.disabled = true;
    if (i === q.correct) {
      btn.classList.add("is-correct");
      btn.querySelector(".quiz-option-letter").innerHTML = ICON_CHECK;
    } else if (i === chosen) {
      btn.classList.add("is-wrong");
      btn.querySelector(".quiz-option-letter").innerHTML = ICON_X;
    } else {
      btn.classList.add("is-dimmed");
    }
  });

  const feedback = body.querySelector(".quiz-feedback");
  feedback.className = `quiz-feedback ${isRight ? "is-correct" : "is-wrong"}`;
  feedback.textContent = isRight
    ? "Resposta correta!"
    : `Resposta incorreta. A alternativa correta é a ${LETTERS[q.correct]}.`;

  const isLast = index === quiz.questions.length - 1;
  const next = body.querySelector(".quiz-btn-next");
  next.innerHTML = isLast ? "Ver resultado" : `Próxima pergunta ${ICON_NEXT}`;
  next.hidden = false;
  next.focus({ preventScroll: true });

  body.querySelector(".quiz-progress-fill").style.width =
    `${Math.round(((index + 1) / quiz.questions.length) * 100)}%`;
};

const finishQuiz = () => {
  const total = quiz.questions.length;
  markQuizCompleted(quizKey(equipment, situation), score, total);

  const all = score === total;
  // Já tinha acertado tudo antes? A situação continua concluída.
  const done = getQuizStatus(quizKey(equipment, situation)) === "done";
  const title = all ? "Quiz concluído!" : "Quiz com respostas erradas";
  const message = all
    ? "Parabéns! Você acertou todas as perguntas."
    : done
      ? "Você já havia concluído este quiz antes, então ele continua marcado como concluído."
      : "Para concluir, é preciso acertar todas as perguntas. Revise o conteúdo e refaça o quiz.";

  setView(
    `
    <div class="quiz-result">
      <span class="quiz-result-icon${all ? "" : " is-wrong"}">${all ? ICON_CHECK : ICON_X}</span>
      <h4 class="quiz-result-title">${title}</h4>
      <p class="quiz-result-score">Você acertou <strong>${score}</strong> de <strong>${total}</strong> perguntas.</p>
      <p class="quiz-result-message">${message}</p>
      <div class="quiz-result-actions">
        ${
          all
            ? `<button class="btn btn-outline quiz-btn-retry">${ICON_RETRY} Refazer quiz</button>
        <button class="btn btn-primary quiz-btn-situations" data-autofocus>${ICON_BACK} Voltar às situações</button>`
            : `<button class="btn btn-outline quiz-btn-situations">${ICON_BACK} Voltar às situações</button>
        <button class="btn btn-primary quiz-btn-retry" data-autofocus>${ICON_RETRY} Refazer quiz</button>`
        }
      </div>
    </div>
  `,
    "result",
  );
};

/* ---------- Abrir / fechar ---------- */
/** Abre o modal no seletor de situações do equipamento */
/**
 * @param {Object} eq - equipamento
 * @param {Object} [category] - categoria (o título do modal usa o nome dela)
 */
export const openQuiz = (eq, category) => {
  if (!modal || !hasQuiz(eq)) return;
  equipment = eq;
  modalTitle = category?.title ? `Questionário - ${category.title}` : "Questionário";
  renderSelector();
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
};

export const closeQuiz = () => {
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
};
