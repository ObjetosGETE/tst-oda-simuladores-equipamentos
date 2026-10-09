import { limpar } from '../utils/dom.js';
import { Cena } from '../components/Cena.js';
import { Instrucao, Aviso, Mensagem } from '../components/Caixas.js';
import { Hotspot, MarcaOk } from '../components/Hotspot.js';
import { Lcd } from '../components/Lcd.js';
import { Painel } from '../components/Painel.js';
import { BotaoAvancar } from '../components/Botao.js';
import { Ajuste } from '../components/Ajuste.js';
import { Leituras } from '../components/Leituras.js';
import { Espera } from '../components/Espera.js';

/** Interações especiais disponíveis para um quadro (quadro.tipo). */
const INTERACOES = { ajuste: Ajuste, leituras: Leituras, espera: Espera };

/**
 * Executa um passo da simulação.
 *
 * Um passo é uma lista de "quadros". Cada quadro é uma imagem com, no máximo,
 * um ponto de clique (hs). Clicar leva ao próximo quadro. O último quadro
 * mostra o botão Avançar.
 *
 * Campos do passo:
 *   instrucao, aviso, avisoNoFinal, quadros[]
 * Campos do quadro:
 *   img            render/imagem de fundo (herda do quadro anterior se vazio)
 *   placeholder    texto de área tracejada (render ainda não existe)
 *   video          caminho de um .mp4 tocado no lugar da imagem
 *   frente         imagem transparente por cima (primeiro plano)
 *   fundo          render desfocado atrás da imagem (close-ups com fundo transparente)
 *   hs: {x,y}      ponto de clique -> próximo quadro   (hs.combo = setas p/ 2 botões)
 *   auto: ms       avança sozinho após o tempo (mostra "ok" em quadro.ok)
 *   lcd: {...}     conteúdo do visor (ver components/Lcd.js)
 *   painel: []     itens no painel inferior esquerdo
 *   marcas: [{x,y}] bolinhas verdes de "feito"
 *   info / sucesso texto em caixa azul / verde
 *   instrucaoPosicao 'rodape' move a instrução para baixo (quando cobre o visor)
 *   tipo           'ajuste' | 'leituras' | 'espera'  (+ config no próprio quadro)
 */
export function executarPasso(camada, passo) {
  return new Promise((resolver) => {
    let imagemAtual = null;

    function mostrar(i) {
      const q = passo.quadros[i];
      const ultimo = i === passo.quadros.length - 1;
      imagemAtual = q.img || imagemAtual;

      limpar(camada);
      camada.append(Cena({ imagem: imagemAtual, placeholder: q.placeholder, zoom: q.zoom, video: q.video, fundo: q.fundo, frente: q.frente }));
      camada.append(Instrucao(passo.instrucao, q.instrucaoPosicao));

      if (passo.aviso && (!passo.avisoNoFinal || ultimo)) camada.append(Aviso(passo.aviso));
      if (q.painel) camada.append(Painel(q.painel));
      if (q.lcd) camada.append(Lcd(q.lcd));
      (q.marcas || []).forEach((m) => camada.append(MarcaOk(m)));
      if (q.info) camada.append(Mensagem({ texto: q.info, posicao: q.infoPosicao || 'topo', fechavel: true }));
      if (q.sucesso) camada.append(Mensagem({ texto: q.sucesso, posicao: 'rodape-esq', sucesso: true }));

      const proximo = () => mostrar(i + 1);
      const liberarAvancar = () => camada.append(BotaoAvancar(() => resolver()));

      if (q.tipo) {
        INTERACOES[q.tipo](camada, q, ultimo ? liberarAvancar : proximo);
        return;
      }
      if (q.hs) {
        camada.append(Hotspot({ ...q.hs, onClick: proximo }));
        return;
      }
      if (q.auto && !ultimo) {
        if (q.ok) camada.append(MarcaOk(q.ok));
        setTimeout(proximo, q.auto);
        return;
      }
      if (ultimo) liberarAvancar();
    }

    mostrar(0);
  });
}
