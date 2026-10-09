/**
 * Ponto de entrada.
 * 1) O preloader carrega todas as imagens, fontes e vídeos (components/Preloader.js);
 * 2) depois o simulador começa.
 * Para criar outra situação: duplique data/situacao5.js, altere o conteúdo
 * e troque o import abaixo.
 */
import { Simulador } from './core/Simulador.js';
import { preCarregarTudo } from './components/Preloader.js';
import situacao from './data/situacao5.js';

const raiz = document.getElementById('app');

await preCarregarTudo(raiz, situacao);

const simulador = new Simulador(raiz, situacao);
simulador.iniciar();
