/**
 * Som de clique em todos os botões do simulador.
 * Arquivo: assets/sounds/click-sound.mp3
 *
 * Todos os elementos clicáveis do simulador são <button> (Botao, BotaoImagem,
 * Hotspot, fechar do modal...), então um único ouvinte no documento cobre tudo,
 * inclusive os criados depois. Basta importar este arquivo no main.js.
 */

const SOM = 'assets/sounds/click-sound.mp3';
const VOLUME = 0.6;

const audio = new Audio(SOM);
audio.preload = 'auto';
audio.volume = VOLUME;

function tocar() {
  try {
    audio.currentTime = 0;
    audio.play()?.catch(() => {}); // navegador pode bloquear antes da 1ª interação
  } catch {
    /* sem áudio: segue sem som */
  }
}

const botaoAtivo = (alvo) => {
  const botao = alvo?.closest?.('button');
  return botao && !botao.disabled ? botao : null;
};

// Mouse / toque: toca ao pressionar (inclui o "clique e segure" do Hotspot)
document.addEventListener(
  'pointerdown',
  (e) => {
    if (e.button === 0 && botaoAtivo(e.target)) tocar();
  },
  true,
);

// Teclado: Enter / Espaço em um botão focado
document.addEventListener(
  'keydown',
  (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !e.repeat && botaoAtivo(e.target)) tocar();
  },
  true,
);
