import { el } from '../utils/dom.js';
import { img, resolverImagem } from '../utils/caminhos.js';
import { imagensPainel } from './Painel.js';

/**
 * Preloader: carrega TODAS as imagens e fontes antes de o simulador começar.
 *
 * O que entra na lista (automático, não precisa manter nada à mão):
 *  - imagens do arquivo de dados: campos img / fundo / frente / botao / imagens[]
 *    e qualquer texto terminado em .png/.jpg/.gif/.webp/.svg (menu, manuais...);
 *  - imagens usadas nos CSS (url(...) em todos os partials: bolinhas, setas, ícones...);
 *  - miniaturas do painel de itens (Painel.js);
 *  - fontes: Roboto, Lexend e as fontes dos visores (DSDigi, PixelOperator);
 *  - vídeos (campo video) – baixados antes para o cache do navegador.
 *
 * Uso (main.js):
 *   await preCarregarTudo(document.getElementById('app'), situacao);
 */

/** Fontes usadas no projeto (peso + família) – ver _variaveis.css e main.css. */
const FONTES = [
  '400 16px Roboto',
  '500 16px Roboto',
  '700 16px Roboto',
  '600 16px Lexend',
  '700 16px Lexend',
  '16px DSDigi',
  '16px PixelOperator',
];

const EXT_IMAGEM = /\.(png|jpe?g|gif|webp|svg)$/i;
const CAMPOS_IMAGEM = ['img', 'fundo', 'frente', 'botao'];
const TEMPO_MAXIMO = 20000; // ms por arquivo – se travar, segue em frente

/** Guarda as imagens carregadas para o navegador mantê-las prontas na memória. */
const cache = [];

export async function preCarregarTudo(raiz, dados) {
  const imagens = new Set([...imagensDosDados(dados), ...imagensDosCss(), ...imagensPainel()]);
  const videos = new Set(videosDosDados(dados));

  const tarefas = [
    ...[...imagens].map((src) => () => carregarImagem(src)),
    ...FONTES.map((f) => () => document.fonts.load(f, 'Aá0')),
    ...[...videos].map((src) => () => carregarVideo(src)),
  ];

  const tela = telaCarregando();
  raiz.append(tela.node);

  let feitas = 0;
  await Promise.all(
    tarefas.map((tarefa) =>
      comLimite(tarefa())
        .catch(() => {}) // arquivo com erro não impede o simulador de abrir
        .finally(() => tela.progresso(++feitas / tarefas.length)),
    ),
  );
  await document.fonts.ready;

  await tela.fechar();
}

/* ---------- coleta de arquivos ---------- */

function imagensDosDados(dados) {
  const lista = [];
  const visitar = (valor, chave) => {
    if (typeof valor === 'string') {
      if (CAMPOS_IMAGEM.includes(chave) || EXT_IMAGEM.test(valor)) lista.push(resolverImagem(valor));
    } else if (Array.isArray(valor)) {
      valor.forEach((v) => visitar(v, chave === 'imagens' ? 'img' : chave));
    } else if (valor && typeof valor === 'object') {
      Object.entries(valor).forEach(([k, v]) => visitar(v, k));
    }
  };
  visitar(dados);
  return lista.filter(Boolean);
}

function videosDosDados(dados) {
  const lista = [];
  const visitar = (valor) => {
    if (Array.isArray(valor)) valor.forEach(visitar);
    else if (valor && typeof valor === 'object') {
      if (typeof valor.video === 'string') lista.push(valor.video);
      Object.values(valor).forEach(visitar);
    }
  };
  visitar(dados);
  return lista;
}

/** Lê todas as url(...) dos CSS do próprio projeto (inclui partials importados). */
function imagensDosCss() {
  const lista = [];
  const lerRegras = (folha) => {
    let regras;
    try {
      regras = folha.cssRules; // CSS de outro domínio (Google Fonts) não pode ser lido – ignora
    } catch {
      return;
    }
    for (const regra of regras) {
      if (regra.styleSheet) lerRegras(regra.styleSheet); // @import
      if (regra.type === CSSRule.FONT_FACE_RULE) continue; // fontes são carregadas à parte
      for (const [, url] of (regra.cssText || '').matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        if (EXT_IMAGEM.test(url.split('?')[0])) lista.push(new URL(url, folha.href || location.href).href);
      }
    }
  };
  [...document.styleSheets].forEach(lerRegras);
  return lista;
}

/* ---------- carregamento ---------- */

function carregarImagem(src) {
  return new Promise((ok, erro) => {
    const i = new Image();
    i.onload = () => (i.decode ? i.decode().catch(() => {}) : Promise.resolve()).then(ok);
    i.onerror = erro;
    i.src = src;
    cache.push(i);
  });
}

function carregarVideo(src) {
  return fetch(src).then((r) => r.blob());
}

function comLimite(promessa) {
  return Promise.race([promessa, new Promise((ok) => setTimeout(ok, TEMPO_MAXIMO))]);
}

/* ---------- tela de carregamento ---------- */

function telaCarregando() {
  const barra = el('span', { class: 'preloader__barra-progresso' });
  const porcentagem = el('span', { class: 'preloader__porcentagem' }, '0%');
  const node = el(
    'div',
    { class: 'preloader', role: 'progressbar', 'aria-label': 'Carregando o simulador' },
    el('img', { class: 'preloader__logo', src: img('logo_simulador_branco.png'), alt: 'Simulador' }),
    el('p', { class: 'preloader__texto' }, 'Carregando o simulador…'),
    el('div', { class: 'preloader__barra' }, barra),
    porcentagem,
  );

  return {
    node,
    progresso(p) {
      const valor = Math.round(p * 100);
      barra.style.width = `${valor}%`;
      porcentagem.textContent = `${valor}%`;
      node.setAttribute('aria-valuenow', valor);
    },
    fechar() {
      return new Promise((ok) => {
        node.classList.add('preloader--saindo');
        setTimeout(() => {
          node.remove();
          ok();
        }, 400);
      });
    },
  };
}
