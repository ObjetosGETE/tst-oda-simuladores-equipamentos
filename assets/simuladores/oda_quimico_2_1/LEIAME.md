# Simulador – Agentes Químicos (ODA) – Situação 2.1

**Avaliar exposição à substância com LT-MPT ou TLV-TWA → Particulado sem fração**
Fumos de cobre na soldagem (cassete fechado, sem ciclone – NIOSH 7303).

Mesmo código da Situação 2.2 (que veio da 2.3 / Situação 5); muda o arquivo de dados
(`assets/js/data/situacao2_1.js`), o conjunto de renders e as miniaturas do painel (`Painel.js`, render 21).

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
      situacao2_1.js         TODO o conteúdo da situação (textos, imagens, passos)
    core/
      Simulador.js           fluxo: introdução -> passos -> finalização
      Passo.js               executa um passo (lista de quadros)
    components/              peças reutilizáveis
      Botao.js  Caixas.js  Modal.js  Hotspot.js  Cena.js
      Lcd.js  Painel.js  Manual.js  Ajuste.js  Leituras.js  Espera.js  Mobile.js  Preloader.js
    utils/
      dom.js  caminhos.js    (PASTA_RENDERS = 'renders')
  img/renders/               01 … 34 (+ 3_x, 4_x, 17_x, 18_x e 25_x: animações das tampas/isopor)
  img/renders/telas_equi/    close-ups dos visores (Bomba, Aferidor, Termo_higro – PNG transparente)
  img/personagem_sem/com.png soldador sem e com os equipamentos (passos 15, 16, 18 e 20)
  video/Soldagem.mp4         animação do trabalho (passo 18, campo `video` do quadro)
  referencias_textos/        Decupagem Situação 2.1_rev.pdf
```

## Diferenças em relação à Situação 2.2

- Substância: fumos de cobre (TLV-TWA 0,2 mg/m³); cassetes SRX 89756 e SRX 89757; sem ciclone.
- 27 passos + finalização. Retirada das tampas animada (renders 3_1–3_7 e 4–4_5, quadros automáticos);
  na coleta, 17_x / 18_x.
- Bomba: 460 min ao ligar (passo 7) → 480 min com ▲ vinte vezes (passo 8); pausa em 480 min (passo 12).
- Vazão 2 l/min ajustada pela bomba (passo 10): **1,9596 (início)** → **2,026 (alvo)**; mensagem "Aumente a vazão.".
- Leituras a cada 1,8 s (passos 11 e 27). Variação final −0,77%.
- Termo-higro-barômetro: 29.4 °C / 76.4 %RH / 999.2 hPa e 31.5 °C / 50.1 %RH / 1000.2 hPa.
- Passo 15: amostrador dentro da máscara de solda (o `personagem_com.png` já mostra assim).

## Pendências / pontos para conferir com o conteúdo

- Finalização: o PDF não tem "Outros comentários"; ficou só o parágrafo dos fumos de cobre.
- Passo 12: o texto do PDF ("pressione simultaneamente ▼ ▲ para desligar o aferidor") foi mantido;
  na simulação pausa a bomba.
- Passo 8: o ajuste de 460 para 480 min exige 20 cliques no ▲. Se ficar cansativo, dá para reduzir.
- "Mais detalhes": nome da opção "Avaliar exposição à substância com TLV-STEL" mantido.
- Renders não usados no fluxo: 34 e os close-ups antigos 13, 16, 22_1, 32 e 33 (os visores usam `telas_equi`).
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
