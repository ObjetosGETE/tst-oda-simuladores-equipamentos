/**
 * Som da bomba (assets/sounds/pump.mp3) enquanto o calibrador mede.
 * Compartilhado entre components/Calibrador.js e components/Leituras.js,
 * assim a passagem do aparelho para a sequência de leituras não corta o som.
 *
 * Quem toca é o "dono": um objeto com continuar() -> boolean.
 * Ao fim de cada trecho, o som repete enquanto o dono disser que continua
 * (medindo e ainda na tela).
 */

const SOM = 'assets/sounds/pump.mp3';
const VOLUME = 0.7;

let audio = null;
let dono = null;

function obterAudio() {
  if (!audio) {
    audio = new Audio(SOM);
    audio.preload = 'auto';
    audio.volume = VOLUME;
    audio.addEventListener('ended', () => {
      if (dono?.continuar()) reproduzir(true);
      else dono = null;
    });
  }
  return audio;
}

function reproduzir(doInicio) {
  const a = obterAudio();
  try {
    if (doInicio) a.currentTime = 0;
    a.play()?.catch(() => {}); // navegador pode bloquear: segue sem som
  } catch {
    /* sem áudio */
  }
}

/** Começa (ou continua, se já estiver tocando) o som para este dono. */
export function tocarBomba(novoDono) {
  const a = obterAudio();
  const tocando = !a.paused && !a.ended;
  dono = novoDono;
  if (!tocando) reproduzir(true);
}

/** Para o som, se ele pertencer a este dono. */
export function pararBomba(quem) {
  if (!audio || dono !== quem) return;
  dono = null;
  audio.pause();
}

/** Este dono está com o som? */
export const ehDonoBomba = (quem) => dono === quem;

// Pré-carrega para o primeiro play sair sem atraso
obterAudio();
