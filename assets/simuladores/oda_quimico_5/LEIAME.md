# Simulador – Agentes Químicos (ODA) – Situação 5

**Avaliar exposição à substância com LT-VT ou TLV-C → Gás ou vapor**
Vapores de n-butanol na pintura de estruturas metálicas.

Mesma lógica/código da Situação 1; muda apenas o arquivo de dados
(`assets/js/data/situacao5.js`) e o conjunto de renders (`assets/img/renders`).

Abra `index.html` por um servidor local (módulos ES não funcionam via `file://`).
Ex.: extensão **Live Server** do VS Code, ou `python -m http.server` na pasta do projeto.

Atalho para testes: `index.html?passo=10` pula a introdução e começa no passo 10.

## Estrutura

```
index.html
assets/
  css/
    main.css                 -> só importa os partials
    partials/
      _variaveis.css         cores, fontes, medidas
      _base.css              reset
      _palco.css             palco 1920x1080 escalado + moldura + cena
      _botoes.css            botões e menu lateral
      _caixas.css            instrução, aviso, mensagem, diálogo, balão
      _modal.css             modal (+ estilo da fórmula do "Mais detalhes")
      _hotspot.css           bolinha clicável, setas "dois botões", painel de itens
      _lcd.css               visores (bomba, calibrador, termo)
      _telas.css             telas de manual, ajuste, barra de espera
      _mobile.css            celular/tablet: aviso de girar, tela cheia, modo compacto
      _preloader.css         tela de carregamento
  js/
    main.js                  ponto de entrada: preloader -> simulador
    data/
      situacao5.js           TODO o conteúdo da situação (textos, imagens, passos)
    core/
      Simulador.js           fluxo: introdução -> passos -> finalização
      Passo.js               executa um passo (lista de quadros)
    components/              peças reutilizáveis
      Botao.js  Caixas.js  Modal.js  Hotspot.js  Cena.js
      Lcd.js  Painel.js  Manual.js  Ajuste.js  Leituras.js  Espera.js  Mobile.js  Preloader.js
    utils/
      dom.js  caminhos.js    (PASTA_RENDERS = 'renders')
  img/renders/               01.png … 49.png (na ordem do fluxo)
  img/renders/telas_equi/    close-ups dos visores (Bomba, Aferidor, Termo_higro – PNG transparente)
  img/personagem.png         trabalhador (passos 18, 19 e 22)
  video/Vedacao.mp4          animação do trabalho (passo 21, campo `video` do quadro)
  referencias_textos/        Decupagem Situação 5_rev.pdf
```

## Diferenças em relação à Situação 1

- Substância: n-butanol (LT-VT = 40 ppm), amostradores TCA 220/14R e TCA 221/14R.
- Vazão alvo 0,2 l/min (ajuste: 0,2436 → 0,2024; início em 0,2261).
- Tempo de amostra: 2 min (bomba configurada para 2 min no passo 13).
- Termo-higro-barômetro: 25.4 °C / 73.8 %RH / 999.9 hPa.
- Passo 28 só navega até a função SEQUENCIAL; o **passo 29** (novo) liga a bomba
  com ▲+▼ duas vezes e depois mostra as 10 leituras finais no calibrador.

## Criar outra situação

1. Duplique `assets/js/data/situacao5.js`.
2. Troque textos, imagens e passos.
3. Em `assets/js/main.js`, troque o import para o novo arquivo.

### Como um passo é descrito

```js
{
  instrucao: 'Texto da caixa no topo',
  aviso: 'Texto opcional do Aviso!',
  quadros: [
    { img: '07', hs: { x: 55, y: 50 } },   // render 07 + bolinha em 55% x 50%
    { img: '07', hs: { x: 80, y: 31 } },   // clicou -> próximo quadro
    { img: '08' },                          // último quadro: aparece "Avançar"
  ],
}
```

Outros campos do quadro: `fundo` (render desfocado atrás de PNG transparente), `video` (mp4 no lugar da imagem), `lcd` (visor), `auto` (avança sozinho em ms), `painel`,
`marcas`, `info`, `tipo: 'ajuste' | 'leituras' | 'espera'` – ver comentários em `core/Passo.js`.

## Pendências / pontos para conferir com o conteúdo

- Introdução: o 2º parágrafo (selante de silicone acético) está no PDF sem fundo
  amarelo, mas parece ser da Situação 1. Está marcado com comentário no código.
- Passo 16: o PDF diz "amostrador representativo", mas nesse momento é o amostrador de coleta.
- Passo 29: a mensagem final fala em variação de +0,95% (texto do PDF); pelas médias
  (0,2004 → 0,1997) a variação é de cerca de −0,35%.
- Fórmula do "Mais detalhes": reproduzida como está no PDF.
- Valores de tempo no visor da bomba que o PDF não define fora das notas amarelas:
  5 min ao ligar (passo 7) e 3 min ao desligar a operação (passos 12–13).

## Visores (close-ups)

Os close-ups dos equipamentos usam `assets/img/renders/telas_equi`. A posição de cada visor fica em
`AREAS` (`components/Lcd.js`) e o tamanho do texto acompanha pela variável `--k` em `_lcd.css`
(bomba 0.585, calibrador 0.7, termo 0.61; 1 = visor grande do ajuste de vazão).

## Celular e tablet

- O palco 1920x1080 é escalado para caber na tela.
- Celular em pé (até 600px de largura): aparece o aviso "Gire o aparelho".
- Aparelhos de toque com suporte a tela cheia (Android, tablets): convite para tela cheia ao abrir.
  No iPhone o Safari não permite tela cheia em páginas, então o convite não aparece.
- Quando o palco fica abaixo de 45% do tamanho (celular deitado, tablet em pé), o `<html>` recebe a
  classe `compacto` e os textos, botões e pontos de clique aumentam (regras em `_mobile.css`).

## Preloader (carregamento antes de começar)

Antes do simulador abrir, `components/Preloader.js` mostra uma tela de carregamento e baixa:
- todas as imagens citadas no arquivo de dados (campos `img`, `fundo`, `frente`, `botao`, `imagens`
  e qualquer texto terminado em .png/.jpg – menu, manuais etc.);
- todas as imagens usadas nos CSS (`url(...)` de todos os partials);
- as miniaturas do painel de itens;
- as fontes (Roboto, Lexend, DSDigi, PixelOperator) e os vídeos.

A lista é montada automaticamente: ao trocar imagens ou criar outra situação, não precisa mexer
no preloader. Se aparecer uma fonte nova, adicione em `FONTES` no `Preloader.js`.
