# Simulador – Agentes Químicos (ODA) – Situação 1

**Avaliar pico de exposição para substância com LT-MPT ou TLV-TWA → Gás ou vapor**
Picos de vapores de ácido acético na aplicação de selante de silicone (tubo de carvão ativo, NIOSH 1603).

Mesmo código da Situação 2; muda o arquivo de dados (`assets/js/data/situacao1.js`), o conjunto de
renders e as miniaturas do painel (`Painel.js`, render 36).

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
      situacao1.js         TODO o conteúdo da situação (textos, imagens, passos)
    core/
      Simulador.js           fluxo: introdução -> passos -> finalização
      Passo.js               executa um passo (lista de quadros)
    components/              peças reutilizáveis
      Botao.js  Caixas.js  Modal.js  Hotspot.js  Cena.js
      Lcd.js  Painel.js  Manual.js  Ajuste.js  Leituras.js  Espera.js  Mobile.js  Preloader.js
    utils/
      dom.js  caminhos.js    (PASTA_RENDERS = 'renders')
  img/renders/               01 … 45 (+ 01_1 e 02_1; sem 26–28)
  img/renders/telas_equi/    close-ups dos visores (Bomba, Aferidor, Termo_higro – PNG transparente)
  img/personagem_sem/com.png soldador sem e com os equipamentos (passos 18, 19, 21 e 22)
  video/Vedacao.mp4          animação do trabalho (passo 21, campo `video` do quadro)
  referencias_textos/        Decupagem Situação 1_rev.pdf
```

## Diferenças em relação à Situação 2

- Avaliação de **pico** (1 minuto de coleta); tubos TCA 207/14R e TCA 208/14R.
- 29 passos + finalização (o passo 30 do PDF é o modal ilustrado). Só uma medição no termo-higro-barômetro
  (25.4 °C / 73.4 %RH / 998.9 hPa); "Após um minuto..." usa o mesmo vídeo `Vedacao.mp4`.
- Passo 1: depois de tirar os tubos da caixa, um clique coloca as etiquetas (render 02_1).
- Vazão 0,3 l/min pelo parafuso regulador (passo 10): **0,3495 (início)** → **0,3025 (alvo)**;
  mensagem "Reduza a vazão.".
- Bomba: 5 min ao ligar; pausa em 2 min (passo 12); configuração 5 → 1 min com ▼ quatro vezes (passo 13).
- Leituras a cada 1,5 s (passos 11 e 29). Variação final +0,95%.
- Passo 19 com o aviso sobre configurar atraso na bomba.
- Parâmetros e "Mais detalhes" de pico (volume mínimo 0,17 litro, fórmula do V<sub>mín</sub>).

## Pendências / pontos para conferir com o conteúdo

- Passo 16: o PDF repete o texto do passo 4 ("amostrador representativo"); troquei por "amostrador de coleta".
- Passos 11 e 29: o PDF pede atualização a cada 5 s; ficou 1,5 s como nas outras situações.
- Passo 21 ("Após um minuto..."): usei o vídeo `Vedacao.mp4` (22,9 s) com a barra de espera.
- Passo 23: depois de tampar o amostrador, a caixa de isopor usa os renders 01_1 → 01 (não há render do tubo
  entrando na caixa).
- "Mais detalhes": nome da opção "Avaliar exposição à substância com LT-MPT ou TLV-TWA → Gás ou vapor"
  (fundo amarelo) mantido. A fórmula do volume mínimo foi refeita em HTML.
- Renders não usados: 14, 19, 32, 44 e 45 (close-ups antigos – os visores usam `telas_equi`) e 33.
- Há um arquivo "19 - Copia.png" na pasta de renders (não é usado).
- Final: o PDF prevê os botões Voltar e Quiz – a tela final segue igual às outras situações.

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
