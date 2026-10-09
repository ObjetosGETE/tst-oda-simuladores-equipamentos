import { Lcd } from './Lcd.js';
import { Mensagem } from './Caixas.js';

/**
 * Sequência automática de leituras no visor do calibrador (1 de 10 ... 10 de 10).
 *
 * config = {
 *   leituras: [['0,3026','0,3026'], ...],  // [vazão, média]
 *   intervalo: 1500,                        // ms entre leituras
 *   msgFinal: 'Essa é a vazão média da bomba!'
 * }
 */
export function Leituras(camada, config, onConcluir) {
  const total = config.leituras.length;
  let i = 0;
  let lcd = null;

  function mostrar() {
    const [vazao, media] = config.leituras[i];
    const novo = Lcd({
      tipo: 'calibrador',
      tela: 'medicao',
      vazao,
      media,
      contador: `${String(i + 1).padStart(2, '0')} de ${String(total).padStart(3, '0')}`,
    });
    lcd ? lcd.replaceWith(novo) : camada.append(novo);
    lcd = novo;

    i += 1;
    if (i < total) {
      setTimeout(mostrar, config.intervalo);
    } else {
      camada.append(Mensagem({ texto: config.msgFinal, posicao: 'rodape-esq', sucesso: true }));
      onConcluir();
    }
  }

  mostrar();
}
