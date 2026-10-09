# Simulador – Agentes Químicos (ODA) – Situação 2

**Avaliar exposição à substância com LT-MPT ou TLV-TWA → Gás ou vapor**
Vapores de ácido acético na aplicação de selante de silicone (tubo de carvão ativado, NIOSH 1603).

Mesmo código da Situação 2.1 (que veio da 2.2 / 2.3 / Situação 5); muda o arquivo de dados
(`assets/js/data/situacao2.js`), o conjunto de renders e as miniaturas do painel (`Painel.js`, render 35).
O fluxo é o mesmo da Situação 4 (tubo de carvão + parafuso regulador), com tempos de jornada inteira.

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
      situacao2.js         TODO o conteúdo da situação (textos, imagens, passos)
    core/
      Simulador.js           fluxo: introdução -> passos -> finalização
      Passo.js               executa um passo (lista de quadros)
    components/              peças reutilizáveis
      Botao.js  Caixas.js  Modal.js  Hotspot.js  Cena.js
      Lcd.js  Painel.js  Manual.js  Ajuste.js  Leituras.js  Espera.js  Mobile.js  Preloader.js
    utils/
      dom.js  caminhos.js    (PASTA_RENDERS = 'renders')
  img/renders/               01 … 36 (+ 01_1)
  img/renders/telas_equi/    close-ups dos visores (Bomba, Aferidor, Termo_higro – PNG transparente)
  img/personagem_sem/com.png soldador sem e com os equipamentos (passos 18, 19, 21 e 23)
  video/Vedacao.mp4          animação do trabalho (passo 21, campo `video` do quadro)
  referencias_textos/        Decupagem Situação 2_rev.pdf
```

## Diferenças em relação à Situação 2.1

- Substância: vapores de ácido acético (LT-MPT 8 ppm – NR-15); tubos TCA 205/14R e TCA 206/14R.
- 30 passos + finalização (o passo 31 do PDF é o modal ilustrado da finalização).
- Rompimento das pontas do tubo com o dispositivo de quebra (passos 2 e 15) e tampa do suporte (passo 17).
- Vazão 0,1 l/min ajustada pelo **parafuso regulador** (passo 10, renders 15–18):
  **0,0782 (início)** → **0,0959 (alvo)**; mensagem "Aumente a vazão.".
- Bomba: 460 min ao ligar (passo 7); pausa em 457 min (passo 12); configuração 460 → 480 min com ▲ vinte
  vezes e saída com ▲▼ (passo 13).
- Leituras a cada 1,5 s (passos 11 e 30). Variação final +0,69%.
- Termo-higro-barômetro: 25.4 °C / 73.4 %RH / 998.9 hPa e 29.4 °C / 60.1 %RH / 1001.2 hPa.
- Passo 18: amostrador na gola da camisa (o `personagem_com.png` já mostra assim).
- Finalização com a lista "Outros comentários".

## Pendências / pontos para conferir com o conteúdo

- Os renders mostram a etiqueta "TCA 207/14R"; o PDF fala em TCA 205/14R e TCA 206/14R (usei o PDF).
- Passo 16: o PDF repete o texto do passo 4 ("amostrador representativo"); troquei por "amostrador de coleta".
- Passo 13: o PDF pede para a tela de configuração mostrar "1" (sobra da Situação 1); usei o fluxo
  460 → 480 min. São 20 cliques no ▲ – se ficar cansativo, dá para reduzir.
- Passos 11 e 30: o PDF pede atualização a cada 14 s; ficou 1,5 s como nas outras situações.
- "Mais detalhes": nome da opção "Avaliar pico de exposição para substância com LT-MPT ou TLV-TWA → Gás ou vapor"
  (fundo amarelo) mantido; "não é possível saber de existiu" → "se existiu".
- Renders não usados: 14, 19, 26, 28 e 36 (close-ups antigos – os visores usam `telas_equi`).
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
