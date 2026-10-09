# Simulador – Agentes Químicos (ODA) – Situação 2.2

**Avaliar exposição à substância com LT-MPT ou TLV-TWA → Particulado com fração respirável**
Fumos de ferro (óxido de ferro) na soldagem (cassete + ciclone de alumínio, NIOSH 7303).

Mesmo código da Situação 2.3 (que veio da Situação 5); muda o arquivo de dados
(`assets/js/data/situacao2_2.js`), o conjunto de renders e as miniaturas do painel (`Painel.js`, render 36).

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
      situacao2_2.js         TODO o conteúdo da situação (textos, imagens, passos)
    core/
      Simulador.js           fluxo: introdução -> passos -> finalização
      Passo.js               executa um passo (lista de quadros)
    components/              peças reutilizáveis
      Botao.js  Caixas.js  Modal.js  Hotspot.js  Cena.js
      Lcd.js  Painel.js  Manual.js  Ajuste.js  Leituras.js  Espera.js  Mobile.js  Preloader.js
    utils/
      dom.js  caminhos.js    (PASTA_RENDERS = 'renders')
  img/renders/               01.png … 54.png, 46_1 e 46_2 (caixa de isopor)
  img/renders/telas_equi/    close-ups dos visores (Bomba, Aferidor, Termo_higro – PNG transparente)
  img/personagem_sem/com.png soldador sem e com os equipamentos (passos 19, 20, 22 e 24)
  video/Soldagem.mp4         animação do trabalho (passo 22, campo `video` do quadro)
  referencias_textos/        Decupagem Situação 2.2_rev.pdf
```

## Diferenças em relação à Situação 2.3

- Substância: fumos de ferro / óxido de ferro (TLV-TWA 5 mg/m³ – respirável); cassetes SRX 50897 e SRX 50898.
- 33 passos + finalização. Montagem: girar a tampa do cassete (renders 04–08 / 25–29 em sequência),
  destacar a 3ª seção, ciclone, suporte do cassete, conector metálico, tubo, adaptador e calibrador.
- Vazão 2,5 l/min ajustada pela bomba (passo 12): 2,4614 · 2,4756 · **2,4869 (início)** · **2,4989 (alvo)**;
  mensagem "Aumente a vazão.".
- Bomba: 500 min ao ligar (passo 9) → 480 min com ▼ vinte vezes (passo 10); pausa em 480 min (passo 14).
- Leituras a cada 1,5 s (passos 13 e 33). Variação final 0,05%.
- Termo-higro-barômetro: 28.4 °C / 65.9 %RH / 999.2 hPa e 30.5 °C / 52.7 %RH / 1000.2 hPa.
- Passo 19: amostrador no peitoral (por fora da máscara).

## Criar outra situação

1. Duplique `assets/js/data/situacao2_2.js`.
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

- **Personagem:** `personagem_com.png` é o mesmo da Situação 2.3 – mostra o amostrador entrando na máscara.
  Nesta situação o PDF pede o conjunto no peitoral, por fora da máscara. O ponto de clique ficou no peito;
  se vier um render novo, é só trocar o arquivo e conferir `PEITO` no arquivo de dados.
- Passo 3: o texto do PDF ("Conecte o tubo flexível com suporte para amostrador na entrada de ar da bomba")
  não combina com a ação (encaixar o ciclone). Usei o texto dos passos 16 e 27.
- Finalização: o PDF diz "fumos de cobre"; troquei por "fumos de ferro".
- O PDF tem dois "Passo 32" e chama o último de "Passo 28"; aqui ficaram 33 passos + finalização.
- Passo 10: o ajuste de 500 para 480 min exige 20 cliques no ▼ (como no manual). Se ficar cansativo,
  dá para reduzir.
- Passo 12: da tela de tempo para a de vazão fiz ✱ → AJUSTE DE ATRASO → ✱ → AJUSTAR VAZÃO.
- Passo 14: o texto do PDF diz "desligue o aferidor… pressionando ▼ e ▲" – mantido; na simulação pausa a bomba.
- Passos 26–31 repetem os renders do cassete 1 (04–21). Renders 48–53 (cassete "SRX 89756" ligado direto
  no tubo) não aparecem no fluxo do PDF e não foram usados.
- "Mais detalhes": nome da opção "Avaliar exposição à substância com TLV-STEL" (fundo amarelo) mantido;
  "por ser calculado" → "pode ser calculado".
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
