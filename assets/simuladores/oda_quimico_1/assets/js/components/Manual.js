import { el } from '../utils/dom.js';
import { img, resolverImagem } from '../utils/caminhos.js';
import { Botao, BotaoImagem } from './Botao.js';

/**
 * Visualizador de manuais (tela cheia, fundo creme).
 * Navegação: seleção -> manual -> rotina (páginas com setas).
 *
 * @param {HTMLElement} palco
 * @param {object} dados   data.manuais  { titulo, textoSelecao, lista: [...] }
 * @param {object} op      { textoSair: 'Voltar' | 'Pular', onSair }
 *
 * Regras da tela de seleção:
 *  - a mensagem de rodapé aparece só na primeira vez que a tela é exibida;
 *  - "Pular" vira "Continuar" depois que a pessoa abre algum manual.
 */
let mensagemJaExibida = false;

export function abrirManuais(palco, dados, { textoSair = 'Voltar', onSair } = {}) {
  const tela = el('div', { class: 'tela-branca' });
  palco.append(tela);
  let abriuManual = false;

  const sair = () => {
    tela.remove();
    onSair && onSair();
  };

  function cabecalho(titulo) {
    return [
      el('img', { class: 'tela-branca__logo-sim', src: img('logo_simulador_color.png'), alt: 'Simulador' }),
      el('img', { class: 'tela-branca__logo-senac', src: img('logo_senac_color.png'), alt: 'Senac' }),
      el('h1', { class: 'tela-branca__titulo' }, titulo),
    ];
  }

  function botaoCanto(texto, onClick) {
    return Botao({ texto, onClick, classe: 'btn--voltar-canto' });
  }

  /* 1) Seleção de manuais */
  function selecao() {
    tela.className = 'tela-branca';
    const mostrarMensagem = !mensagemJaExibida;
    mensagemJaExibida = true;
    const textoBotao = textoSair === 'Pular' && abriuManual ? 'Continuar' : textoSair;

    tela.replaceChildren(
      ...cabecalho(dados.titulo),
      el(
        'div',
        { class: 'tela-branca__grade', style: { marginTop: '120px' } },
        dados.lista.map((m) =>
          BotaoImagem({ src: resolverImagem(m.botao), alt: m.titulo, onClick: () => manual(m) }),
        ),
      ),
      mostrarMensagem ? el('div', { class: 'tela-branca__rodape-texto', html: dados.textoSelecao }) : '',
      botaoCanto(textoBotao, sair),
    );
  }

  /* 2) Página do manual com as rotinas */
  function manual(m) {
    abriuManual = true;
    tela.className = 'tela-branca';
    tela.replaceChildren(
      ...cabecalho(m.titulo),
      el('p', { class: 'tela-branca__texto', html: m.descricao }),
      el(
        'div',
        { class: 'tela-branca__grade' },
        m.rotinas.map((r) => Botao({ texto: r.titulo, classe: 'btn--rotina', onClick: () => rotina(m, r, 0) })),
      ),
      botaoCanto('Voltar', selecao),
    );
  }

  /* 3) Rotina – padrão dos manuais:
     - página com `img`: mostra só o slide, grande e centralizado (o slide já traz título e descrição);
     - página sem `img`: mostra o `texto` no centro da tela.
     Sem título por cima. */
  function rotina(m, r, n) {
    const pag = r.paginas[n];
    const itens = [
      el('img', { class: 'tela-branca__logo-sim', src: img('logo_simulador_color.png'), alt: 'Simulador' }),
      el('img', { class: 'tela-branca__logo-senac', src: img('logo_senac_color.png'), alt: 'Senac' }),
    ];
    if (pag.img) itens.push(el('img', { class: 'tela-branca__figura', src: resolverImagem(pag.img), alt: r.titulo }));
    else if (pag.texto) itens.push(el('p', { class: 'tela-branca__texto', html: pag.texto }));
    if (n > 0) {
      itens.push(
        el('button', {
          class: 'tela-branca__seta tela-branca__seta--ant',
          type: 'button',
          'aria-label': 'Anterior',
          onClick: () => rotina(m, r, n - 1),
        }),
      );
    }
    if (n < r.paginas.length - 1) {
      itens.push(
        el('button', {
          class: 'tela-branca__seta tela-branca__seta--prox',
          type: 'button',
          'aria-label': 'Próxima',
          onClick: () => rotina(m, r, n + 1),
        }),
      );
    }
    itens.push(botaoCanto('Voltar', () => manual(m)));

    tela.className = 'tela-branca tela-branca--rotina';
    tela.replaceChildren(...itens);
  }

  selecao();
}
