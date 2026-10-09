import { el, limpar } from '../utils/dom.js';
import { img } from '../utils/caminhos.js';
import { BotaoImagem, BotaoAvancar } from '../components/Botao.js';
import { Cena, preCarregar } from '../components/Cena.js';
import { Dialogo, Balao } from '../components/Caixas.js';
import { abrirModal } from '../components/Modal.js';
import { abrirManuais } from '../components/Manual.js';
import { prepararMobile } from '../components/Mobile.js';
import { executarPasso } from './Passo.js';

/**
 * Orquestra a simulação: telas de introdução -> passos -> finalização.
 * Todo o conteúdo vem do arquivo de dados (ex.: data/situacao1.js).
 */
export class Simulador {
  constructor(raiz, dados) {
    this.dados = dados;

    this.palco = el('div', { class: 'palco' });
    this.camada = el('div', { class: 'camada' });
    this.menu = this.criarMenu();
    this.palco.append(this.camada, this.menu);
    raiz.append(el('div', { class: 'palco-wrap' }, this.palco));
    prepararMobile(raiz);

    this.ajustarEscala();
    window.addEventListener('resize', () => this.ajustarEscala());
    document.addEventListener('fullscreenchange', () => this.ajustarEscala());
  }

  /* ---------- palco responsivo ---------- */
  ajustarEscala() {
    const escala = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    document.documentElement.style.setProperty('--escala', escala);
    // telas pequenas (celular / tablet em pé): textos e áreas de toque maiores – ver _mobile.css
    document.documentElement.classList.toggle('compacto', escala < 0.45);
  }

  /* ---------- menu lateral (Manuais / Mais detalhes / Parâmetros) ---------- */
  criarMenu() {
    const { menu } = this.dados;
    this.botoesMenu = {
      manuais: BotaoImagem({ src: img(menu.manuais), alt: 'Manuais', onClick: () => this.abrirManuais() }),
      maisDetalhes: BotaoImagem({ src: img(menu.maisDetalhes), alt: 'Mais detalhes', onClick: () => this.abrirMaisDetalhes() }),
      parametros: BotaoImagem({ src: img(menu.parametros), alt: 'Parâmetros', onClick: () => this.abrirParametros() }),
    };
    return el('nav', { class: 'menu-lateral oculto' }, Object.values(this.botoesMenu));
  }

  mostrarMenu(visivel) {
    this.menu.classList.toggle('oculto', !visivel);
  }

  abrirManuais(op = {}) {
    abrirManuais(this.palco, this.dados.manuais, op);
  }

  abrirMaisDetalhes() {
    const d = this.dados.maisDetalhes;
    abrirModal(this.palco, { titulo: d.titulo, icone: d.icone, html: d.html });
  }

  abrirParametros() {
    const d = this.dados.parametros;
    const lista = `<ul>${d.itens.map((i) => `<li>${i}</li>`).join('')}</ul>`;
    abrirModal(this.palco, { titulo: d.titulo, icone: d.icone, html: lista });
  }

  /* ---------- telas genéricas (retornam Promise) ---------- */
  telaDialogo({ img: imagem, frente, texto }) {
    return new Promise((ok) => {
      limpar(this.camada);
      this.camada.append(Cena({ imagem, frente }), Dialogo(texto), BotaoAvancar(ok));
    });
  }

  telaModal({ img: imagem, frente, zoom, titulo, html, textoBotao }) {
    return new Promise((ok) => {
      limpar(this.camada);
      if (imagem) this.camada.append(Cena({ imagem, frente, zoom }));
      abrirModal(this.palco, { titulo, html, textoBotao, onFechar: ok });
    });
  }

  telaManuais({ textoSair = 'Pular' }) {
    return new Promise((ok) => this.abrirManuais({ textoSair, onSair: ok }));
  }

  telaTutorial({ img: imagem, frente, alvo, texto }) {
    return new Promise((ok) => {
      limpar(this.camada);
      if (imagem) this.camada.append(Cena({ imagem, frente }));
      this.mostrarMenu(true);
      const botao = this.botoesMenu[alvo];
      botao.classList.add('destaque');
      const balao = Balao({
        texto,
        top: this.menu.offsetTop + botao.offsetTop - 6,
        onContinuar: () => {
          botao.classList.remove('destaque');
          balao.remove();
          ok();
        },
      });
      this.palco.append(balao);
    });
  }

  /* ---------- fluxo principal ---------- */
  async iniciar() {
    const { intro, passos, fim } = this.dados;
    preCarregar(passos.flatMap((p) => p.quadros.map((q) => q.img).filter(Boolean)));

    const telas = {
      dialogo: (t) => this.telaDialogo(t),
      modal: (t) => this.telaModal(t),
      manuais: (t) => this.telaManuais(t),
      tutorial: (t) => this.telaTutorial(t),
    };

    // atalho para testes: index.html?passo=10 pula a introdução e começa no passo 10
    const inicio = Number(new URLSearchParams(location.search).get('passo')) || 0;

    this.mostrarMenu(false);
    if (!inicio) for (const t of intro) await telas[t.tipo](t);

    this.mostrarMenu(true);
    for (const passo of passos.slice(Math.max(inicio - 1, 0))) await executarPasso(this.camada, passo);

    for (const t of fim) await telas[t.tipo](t);

    // fim da simulação dentro do ODA (iframe): avisa a página principal,
    // que fecha o simulador e volta para a página do equipamento
    if (window.parent !== window) {
      window.parent.postMessage({ tipo: 'simulacao-concluida' }, '*');
      return;
    }

    // aberto sozinho (fora do ODA): reinicia ao terminar
    location.search ? (location.search = '') : this.iniciar();
  }
}
