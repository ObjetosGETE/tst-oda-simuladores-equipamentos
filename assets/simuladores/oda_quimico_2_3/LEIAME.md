# Simulador – Agentes Químicos (ODA) – Situação 2.3

**Avaliar exposição à substância com LT-MPT ou TLV-TWA → Particulado com fração inalável**
Fumos de níquel na soldagem (amostrador IOM, NIOSH 7303).

Mesma lógica/código da Situação 5; muda o arquivo de dados
(`assets/js/data/situacao2_3.js`), o conjunto de renders (`assets/img/renders`) e alguns ajustes
pequenos de código (ver "Diferenças").

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
      situacao2_3.js         TODO o conteúdo da situação (textos, imagens, passos)
    core/
      Simulador.js           fluxo: introdução -> passos -> finalização
      Passo.js               executa um passo (lista de quadros)
    components/              peças reutilizáveis
      Botao.js  Caixas.js  Modal.js  Hotspot.js  Cena.js
      Lcd.js  Painel.js  Manual.js  Ajuste.js  Leituras.js  Espera.js  Mobile.js  Preloader.js
    utils/
      dom.js  caminhos.js    (PASTA_RENDERS = 'renders')
  img/renders/               01.png … 32.png e 14_1 … 14_4 (adaptador de calibração)
  img/renders/telas_equi/    close-ups dos visores (Bomba, Aferidor, Termo_higro – PNG transparente)
  img/personagem_sem/com.png soldador sem e com os equipamentos (passos 13, 14, 16 e 18)
  video/Soldagem.mp4         animação do trabalho (passo 16, campo `video` do quadro)
  referencias_textos/        Decupagem Situação 2.3_rev.pdf
```

## Diferenças em relação à Situação 5

- Substância: fumos de níquel (TLV-TWA 0,2 mg/m³ – inalável), amostradores IOM SRX 2550 e SRX 2551.
- 22 passos + finalização (passo 23 do PDF = primeiro modal da finalização).
- Vazão 2,0 l/min ajustada **pela bomba** (passo 9: tela AJUSTAR VAZÃO, botões ▲ Aumentar / ▼ Diminuir),
  com o visor do calibrador menor ao lado (`visor: 'lateral'` no quadro de ajuste).
  Valores: 2,5059 · 2,4658 · **2,3960 (início)** · 2,2364 · 2,1045 · **2,0181 (alvo)**; mensagem "Diminua a vazão.".
- Bomba: 475 min ao ligar (passo 6) → configurada para 480 min (passo 7); 457 min ao pausar (passo 11).
- Leituras sequenciais a cada 1,8 s (passos 10 e 22). Variação final −0,57%.
- Termo-higro-barômetro: 28.4 °C / 69.9 %RH / 1002.2 hPa (passo 15) e 31.6 °C / 50.1 %RH / 1007.3 hPa (passo 17).
- Passo 13: bomba na cintura e amostrador **dentro da máscara de solda**.
- Código (só neste projeto):
  - `Ajuste.js`: opções `rotulos` (texto dos botões) e `visor: 'lateral'` (+ classe em `_telas.css`);
  - `Painel.js`: miniaturas recortadas do render 13;
  - `_lcd.css`: "PAUSA" piscando no visor da bomba (pedido no PDF).

## Criar outra situação

1. Duplique `assets/js/data/situacao2_3.js`.
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

- Passo 9: o PDF não diz como voltar da tela de tempo para a de vazão. Fiz ✱ → AJUSTE DE ATRASO → ✱ →
  AJUSTAR VAZÃO (sequência do manual da bomba). Confirmar.
- Passo 11: o texto do PDF diz "Na tela da bomba, desligue o aferidor de vazão pressionando ▼ e ▲" –
  mantido como está; na simulação o ▲+▼ pausa a bomba (457 min).
- Passo 12: o PDF pede só "repetir o passo 3"; o amostrador de coleta já aparece sem suporte/tampa.
- Passo 22: tela inicial "TEMPO RESTANTE 0 min" (rotina de tempo decorrido) → 480 min PAUSA → OPERANDO 480 min.
- "Mais detalhes": o nome da opção "Avaliar exposição à substância com TLV-STEL" estava com fundo amarelo
  e foi mantido para a frase fazer sentido. Correções de digitação: "Retire-o amostrador" → "Retire o
  amostrador"; "por ser calculado" → "pode ser calculado".
- Final: o PDF prevê os botões Voltar e Quiz (Quiz marcado em verde) – a tela final segue igual à Situação 5.
- Renders 15/17/19/32 (bomba), 16/31 (calibrador) e 21 (termo) não são usados: os close-ups vêm de `telas_equi`.
  Os arquivos "05 - Copia.png" … "11 - Copia.png" também não são usados.

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
