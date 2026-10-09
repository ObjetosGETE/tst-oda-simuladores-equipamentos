import { el } from '../utils/dom.js';

/**
 * Barra de espera (ex.: "Aguarde um minuto").
 * Libera o Avançar só quando termina.
 * config = { duracao: 8000, texto: 'Coletando amostra...' }
 */
export function Espera(camada, config, onConcluir) {
  const barra = el('span');
  camada.append(el('div', { class: 'espera' }, el('div', {}, config.texto), el('div', { class: 'espera__barra' }, barra)));

  const inicio = Date.now();
  const timer = setInterval(() => {
    const p = Math.min((Date.now() - inicio) / config.duracao, 1);
    barra.style.width = `${p * 100}%`;
    if (p >= 1) {
      clearInterval(timer);
      onConcluir();
    }
  }, 200);
}
