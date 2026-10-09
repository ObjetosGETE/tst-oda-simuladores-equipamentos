/**
 * ============================================================
 *  SITUAÇÃO 1 – Vapores de ácido acético (aplicação de selante de silicone)
 *  Avaliar pico de exposição para substância com LT-MPT ou TLV-TWA → Gás ou vapor
 * ============================================================
 *  Este arquivo contém SOMENTE conteúdo. Para criar outra situação,
 *  duplique este arquivo, altere textos/imagens/passos e troque o
 *  import em assets/js/main.js.
 *
 *  Textos: assets/referencias_textos/Decupagem Situação 1_rev.pdf
 *  (trechos com fundo amarelo e comentários em vermelho foram ignorados).
 *
 *  Imagens:
 *    '07'                      -> assets/img/renders/07.png
 *    'cenario_introducao.png'  -> assets/img/cenario_introducao.png
 *    video: 'assets/video/x.mp4' -> vídeo no lugar da imagem de fundo
 *    caminho com '/'           -> usado como está
 *
 *  Renders (vários são repetidos com outro número):
 *    01, 01_1, 02 caixa de isopor     02_1 tubos etiquetados
 *    03–04 dispositivo de quebra (= 22–23)       05–06 tubo na bomba (06 = 21 = 36)
 *    07–08 amostrador no suporte (= 24–25 = 37–38)   09–10 segundo tubo (= 39–40)
 *    11–13 calibrador conectado (= 41–43; 13 = 20 = 43 cena geral)
 *    15–18 parafuso regulador (¼ de volta por clique)
 *    29–30 tampa do suporte     31 termo-higro-barômetro     34–35 tampas do amostrador
 *    (14, 19, 32, 33, 44 e 45 não são usados – os visores usam renders/telas_equi)
 *
 *  Posições (x, y) sempre em % da tela (0–100).
 *  Estrutura de um passo: ver assets/js/core/Passo.js
 * ============================================================
 */

/* ---------- atalhos de posição (botões dos equipamentos) ---------- */
// Close-ups dos equipamentos (assets/img/renders/telas_equi – PNG com fundo transparente;
// "fundo" = render desfocado que aparece atrás)
const BOMBA_CLOSE = { img: "renders/telas_equi/Bomba.png", fundo: "13" };
const AFERIDOR_CLOSE = { img: "renders/telas_equi/Aferidor.png", fundo: "13" };
const TERMO_CLOSE = { img: "renders/telas_equi/Termo_higro.png", fundo: "31" };

// Bomba (Bomba.png)
const B_CIMA = { x: 38, y: 81 };
const B_ASTER = { x: 50.5, y: 81 };
const B_BAIXO = { x: 63, y: 81 };
const B_COMBO = { x: 50.5, y: 70.5, combo: { largura: 25 } }; // ▲ + ▼ juntos

// Calibrador (Aferidor.png)
const C_ENTER = { x: 63.5, y: 48.5 };
const C_DIR = { x: 71, y: 48.5 };
const C_POWER = { x: 73.5, y: 61 };

// Cena geral com calibrador + bomba (render 13)
const CENA_CALIBRADOR = { x: 39.6, y: 34 };
const CENA_BOMBA = { x: 74, y: 46 };

// Cenário da introdução/finalização
const CENARIO = "cenario_introducao.png";

// Cena do trabalhador: sem e com os equipamentos (assets/img/personagem_*.png)
const TRAB = "personagem_sem.png";
const TRAB_COM = "personagem_com.png";
const CINTURA = { x: 44.5, y: 68.5 }; // bomba na cintura (personagem_com.png)
const GOLA = { x: 49.3, y: 42 }; // amostrador na gola da camisa – zona respiratória
const PAINEL_BOMBA = { x: 10.5, y: 79 };
const PAINEL_AMOSTRADOR = { x: 22.8, y: 79 };

/* ---------- telas do visor ---------- */
const bomba = (d) => ({ tipo: "bomba", ...d });
const calib = (d) => ({ tipo: "calibrador", ...d });

// ▼ uma vez por clique no ajuste de tempo da bomba (de -> ate)
const descerTempo = (de, ate) =>
  Array.from({ length: de - ate }, (_, i) => ({
    ...BOMBA_CLOSE,
    lcd: bomba({
      titulo: "AJUSTE DE TEMPO",
      valor: String(de - i),
      unidade: "min",
    }),
    hs: B_BAIXO,
  }));

// Rompe as duas pontas do tubo de vidro (render com o dispositivo de quebra -> render final)
const ROMPER = (img, fim) => [
  { img, hs: { x: 70, y: 70 } }, // dispositivo de quebra
  { img, hs: { x: 64, y: 52.5 } }, // extremidade direita
  { img, hs: { x: 23, y: 53 } }, // extremidade esquerda
  { img: fim },
];

// Termo-higro-barômetro: liga e mostra as leituras
const TERMO = (temp, umid, press) => [
  { img: "31", hs: { x: 48, y: 62 } },
  { ...TERMO_CLOSE, hs: { x: 38.5, y: 74 } },
  { ...TERMO_CLOSE, lcd: { tipo: "termo", texto: "LIGANDO..." }, auto: 1500 },
  { ...TERMO_CLOSE, lcd: { tipo: "termo", temp, umid, press } },
];

const MANUAL = "assets/img/Manual - Bomba de amostragem de ar/";
const MANUAL_CAL = "assets/img/Manual - Calibrador-aferidor de vazao/MANUAL/";
const MANUAL_TER = "assets/img/Manual -  Termo-higro-barometro/MANUAL/";
const T = (s) => `<span class="tecla">${s}</span>`; // tecla desenhada no texto
const F = (num, den) =>
  `<span class="frac"><span>${num}</span><span>${den}</span></span>`; // fração

export default {
  /* ============================================================
   *  MENU LATERAL (imagens dos botões)
   * ============================================================ */
  menu: {
    manuais: "export img oda/bto-manuais.png",
    maisDetalhes: "export img oda/bto-mais-detalhes.png",
    parametros: "export img oda/bto-parametros.png",
  },

  /* ============================================================
   *  INTRODUÇÃO
   *  tipos: dialogo | modal | manuais | tutorial
   * ============================================================ */
  intro: [
    {
      tipo: "dialogo",
      img: CENARIO,
      texto:
        "O objetivo deste simulador é familiarizar você com a avaliação de agentes químicos dispersos no ar, utilizando bomba de amostragem e amostradores. Embora o simulador contemple diversos cenários, não é possível cobrir todas as combinações de avaliações e amostradores. No entanto, o procedimento geral de avaliação é semelhante a algum dos casos apresentados.",
    },
    {
      tipo: "dialogo",
      img: CENARIO,
      texto:
        "Existem outras formas de avaliar agentes químicos dispersos no ar ambiente além do uso de bombas de amostragem e amostradores. Todos os métodos e equipamentos disponíveis apresentam vantagens e desvantagens. Este simulador foi construído considerando os limites de tolerância preventivos válidos para o ano de 2025.",
    },
    {
      tipo: "dialogo",
      img: CENARIO,
      texto:
        "Embora os valores e tipos de limites possam sofrer alterações ao longo do tempo, a estrutura geral de avaliação permanece válida, alterando-se apenas o enquadramento metodológico do agente.",
    },
    {
      tipo: "modal",
      img: CENARIO,
      titulo: "Introdução",
      textoBotao: "OK",
      html: `
        <p>Você avaliará a exposição de um trabalhador da construção civil encarregado da vedação de esquadrias e boxes de banheiros.</p>
        <p>A exposição decorre da aplicação de selante de silicone acético. O selante não contém ácido acético em sua composição, mas possui duas substâncias químicas (metiltriacetoxisilano e etiltriacetoxisilano) que, em contato com a umidade do ar ambiente, sofrem uma reação de reticulação. Essa reação confere ao silicone as suas características de resistência mecânica, flexibilidade, entre outros.</p>
        <p>Como subproduto dessa reação de reticulação, o ácido acético é liberado, resultando na exposição do trabalhador aos vapores dessa substância química. Nesta avaliação, será conduzida a análise apenas dos picos de exposição.</p>`,
    },
    { tipo: "manuais", textoSair: "Pular" },
    {
      tipo: "tutorial",
      img: "01",
      alvo: "manuais",
      texto:
        "A qualquer momento, você pode acessar os três manuais clicando ou tocando neste botão.",
    },
    {
      tipo: "tutorial",
      img: "01",
      alvo: "maisDetalhes",
      texto:
        "Aqui você encontra mais detalhes sobre o tipo de avaliação que será realizada.",
    },
    {
      tipo: "tutorial",
      img: "01",
      alvo: "parametros",
      texto:
        "A avaliação contará com alguns parâmetros. Para conferi-los a qualquer momento, clique aqui.",
    },
    {
      tipo: "dialogo",
      img: "01",
      texto:
        "Para realizar a avaliação dessa substância química, confira os passos a seguir:",
    },
  ],

  /* ============================================================
   *  PASSOS DA SIMULAÇÃO
   * ============================================================ */
  passos: [
    /* ---------- Passo 1 ---------- */
    {
      instrucao:
        "Retire da caixa de isopor os amostradores fornecidos pelo laboratório de análises químicas.",
      quadros: [
        { img: "01", hs: { x: 48, y: 28 } }, // tampa da caixa
        { img: "01_1", hs: { x: 49, y: 52 } }, // amostradores dentro da caixa
        {
          img: "02",
          hs: { x: 74, y: 65 },
          infoPosicao: "rodape",
          info: "Clique para colocar as etiquetas nos tubos.",
        },
        {
          img: "02_1",
          infoPosicao: "rodape",
          info: "Considere os seguintes amostradores e suas funções:<br><b>TCA 207/14R</b> – Amostrador representativo usado para ajuste da vazão<br><b>TCA 208/14R</b> – Amostrador usado para coleta",
        },
      ],
    },

    /* ---------- Passo 2 ---------- */
    {
      instrucao:
        "Rompa ambas as extremidades do tubo de vidro do amostrador representativo com o dispositivo de quebra.",
      quadros: ROMPER("03", "04"),
    },

    /* ---------- Passo 3 ---------- */
    {
      instrucao:
        "Conecte o tubo flexível com suporte para amostrador à tubulação de entrada de ar da bomba de amostragem.",
      quadros: [
        { img: "05", hs: { x: 55.5, y: 75 } }, // ponta do tubo
        { img: "05", hs: { x: 81, y: 32 } }, // entrada de ar da bomba
        { img: "06" },
      ],
    },

    /* ---------- Passo 4 ---------- */
    {
      instrucao:
        "Conecte o amostrador representativo na outra extremidade do tubo. A seta desenhada no tubo amostrador deve ser conectada apontando na direção do fluxo de ar.",
      quadros: [
        { img: "07", hs: { x: 37, y: 66.5 } }, // amostrador
        { img: "07", hs: { x: 49.4, y: 44 } }, // suporte
        { img: "08" },
      ],
    },

    /* ---------- Passo 5 ---------- */
    {
      instrucao:
        "Conecte a outra extremidade do amostrador ao outro tubo flexível na extremidade que contém o adaptador.",
      quadros: [
        { img: "09", hs: { x: 36.5, y: 70 } }, // adaptador do outro tubo
        { img: "09", hs: { x: 30.7, y: 56 } }, // ponta do amostrador
        { img: "10" },
      ],
    },

    /* ---------- Passo 6 ---------- */
    {
      instrucao:
        "Conecte a extremidade do tubo à porta de sucção do calibrador de vazão.",
      quadros: [
        { img: "11", hs: { x: 57, y: 70 } }, // ponta do tubo
        { img: "11", hs: { x: 72.8, y: 42.4 } }, // porta de sucção do calibrador
        { img: "12", auto: 1200 },
        { img: "13" },
      ],
    },

    /* ---------- Passo 7 ---------- */
    {
      instrucao: "Ligue a bomba pressionando o botão por meio segundo.",
      quadros: [
        { img: "13", hs: CENA_BOMBA },
        // segurar 0,5 s no botão ✱ para ligar
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ bateria: false }),
          hs: { ...B_ASTER, segurar: 500 },
        },
        { ...BOMBA_CLOSE, lcd: bomba({}), auto: 700, ok: B_ASTER },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ valor: "On", centro: true }),
          auto: 1000,
          ok: B_ASTER,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "5",
            unidade: "min",
            pausa: true,
          }),
          marcas: [B_ASTER],
        },
      ],
    },

    /* ---------- Passo 8 ---------- */
    {
      instrucao:
        "Ligue o calibrador/aferidor de vazão, navegue até a função MEDIR e, em seguida, selecione a opção ÚNICA.",
      quadros: [
        { img: "13", hs: CENA_CALIBRADOR },
        { ...AFERIDOR_CLOSE, hs: C_POWER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: "inicio" }), hs: C_ENTER },
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({ tela: "menu", sel: "ÚNICA" }),
          hs: C_ENTER,
        },
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({ tela: "medicao", opcoes: ["UNICA", "SAIR"] }),
        },
      ],
    },

    /* ---------- Passo 9 ---------- */
    {
      instrucao: "Inicie o processo de medição para fins de ajuste de vazão.",
      quadros: [
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({ tela: "medicao", opcoes: ["UNICA", "SAIR"] }),
          hs: C_ENTER,
        },
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({
            tela: "medicao",
            vazao: "0,3495",
            media: "0,3495",
            contador: "01 de 01",
          }),
        },
      ],
    },

    /* ---------- Passo 10 ---------- */
    {
      instrucao:
        'Utilize o parafuso regulador para ajustar a vazão até que ela esteja próxima ao valor de <b style="color:#e5461d">0,3 l/min</b>.',
      quadros: [
        {
          img: "15",
          tipo: "ajuste",
          valores: ["0,4058", "0,3815", "0,3495", "0,3269", "0,3025"], // do maior para o menor
          inicio: 2,
          alvo: 4,
          media: "0,3495",
          msgAjustar: "Reduza a vazão.",
          msgSucesso:
            "Você ajustou a vazão para um valor próximo ao desejado. Agora, avance para a função de medição de vazão sequencial.",
          botoes: { diminuir: { x: 36.5, y: 30 }, aumentar: { x: 61, y: 30 } },
          imagens: ["15", "16", "17", "18"], // parafuso girando ¼ de volta por clique
        },
      ],
    },

    /* ---------- Passo 11 ---------- */
    {
      instrucao:
        "Acesse a função de medição de vazão sequencial e realize um conjunto de 10 leituras.",
      quadros: [
        { img: "13", hs: CENA_CALIBRADOR },
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({
            tela: "medicao",
            vazao: "0,3025",
            media: "0,3495",
            contador: "01 de 010",
            sel: "PAUSA",
          }),
          hs: C_DIR,
        },
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({
            tela: "medicao",
            vazao: "0,3025",
            media: "0,3495",
            contador: "01 de 010",
            sel: "SAIR",
          }),
          hs: C_ENTER,
        },
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({ tela: "menu", sel: "ÚNICA" }),
          hs: C_DIR,
        },
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({ tela: "menu", sel: "CONT." }),
          hs: C_DIR,
        },
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({ tela: "menu", sel: "SEQUENCIAL" }),
          hs: C_ENTER,
        },
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({ tela: "medicao", opcoes: ["SEQUENCIAL", "SAIR"] }),
          hs: C_ENTER,
        },
        {
          ...AFERIDOR_CLOSE,
          tipo: "leituras",
          intervalo: 1500, // no PDF são 5 s – acelerado para a simulação
          msgFinal: "Essa é a vazão média da bomba!",
          leituras: [
            ["0,3026", "0,3026"],
            ["0,3019", "0,3023"],
            ["0,2952", "0,2999"],
            ["0,2921", "0,2980"],
            ["0,3025", "0,2989"],
            ["0,2891", "0,2972"],
            ["0,2795", "0,2947"],
            ["0,3069", "0,2962"],
            ["0,3021", "0,2969"],
            ["0,3014", "0,2973"],
          ],
        },
      ],
    },

    /* ---------- Passo 12 ---------- */
    {
      instrucao: `Na bomba, pressione ao mesmo tempo os botões ${T("▲")} e ${T("▼")} para desligar a operação.`,
      quadros: [
        { img: "13", hs: CENA_BOMBA },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "OPERANDO TEMPO RESTANTE",
            valor: "2",
            unidade: "min",
          }),
          hs: B_COMBO,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "2",
            unidade: "min",
            pausa: true,
          }),
        },
      ],
    },

    /* ---------- Passo 13 ---------- */
    {
      instrucao:
        "Acesse a configuração da bomba e ajuste o tempo para 1 min. Depois disso, saia da função de configuração.",
      quadros: [
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "2",
            unidade: "min",
            pausa: true,
          }),
          hs: B_ASTER,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "2",
            unidade: "min",
            pausa: true,
          }),
          hs: B_CIMA,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "2",
            unidade: "min",
            pausa: true,
          }),
          hs: B_BAIXO,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "2",
            unidade: "min",
            pausa: true,
          }),
          hs: B_ASTER,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ valor: "CLr", centro: true }),
          hs: B_ASTER,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ valor: "- -", centro: true, legenda: "AJUSTAR VAZÃO" }),
          hs: B_ASTER,
        },
        ...descerTempo(5, 1), // ▼ quatro vezes: 5 (tempo programado) -> 1 min
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ titulo: "AJUSTE DE TEMPO", valor: "1", unidade: "min" }),
          hs: B_COMBO,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "1",
            unidade: "min",
            pausa: true,
          }),
        },
      ],
    },

    /* ---------- Passo 14 ---------- */
    {
      instrucao:
        "Desligue o aferidor de vazão, retire o amostrador representativo e tampe suas extremidades.",
      quadros: [
        { img: "13", hs: CENA_CALIBRADOR },
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({ tela: "medicao", vazao: "0,3014", media: "0,2973" }),
          hs: C_POWER,
        },
        { ...AFERIDOR_CLOSE, auto: 800 },
        { img: "25", hs: { x: 49.4, y: 58 } }, // amostrador no suporte
        { img: "34", hs: { x: 40, y: 55.5 } }, // tampa da esquerda
        { img: "34", hs: { x: 57.5, y: 54.5 } }, // tampa da direita
        { img: "35" },
      ],
    },

    /* ---------- Passo 15 ---------- */
    {
      instrucao:
        "Rompa ambas as extremidades do duto de vidro do amostrador que será usado na coleta, utilizando o dispositivo de quebra.",
      aviso:
        "Se forem utilizados amostradores branco de campo, suas extremidades também deverão ser quebradas neste momento. Em seguida, tampe as extremidades e mantenha os amostradores em ambiente próximo ao ponto de coleta.",
      avisoNoFinal: true,
      quadros: ROMPER("22", "23"),
    },

    /* ---------- Passo 16 ---------- */
    {
      // O PDF repete aqui o texto do passo 4 ("amostrador representativo"); ajustado para o amostrador de coleta.
      instrucao:
        "Conecte o amostrador de coleta na outra extremidade do tubo. A seta desenhada no tubo amostrador deve ser conectada apontando na direção do fluxo de ar.",
      quadros: [
        { img: "24", hs: { x: 37, y: 66.5 } }, // amostrador
        { img: "24", hs: { x: 49.4, y: 44 } }, // suporte
        { img: "25" },
      ],
    },

    /* ---------- Passo 17 ---------- */
    {
      instrucao: "Conecte a tampa do suporte sobre o amostrador.",
      aviso:
        "A tampa de proteção protege o amostrador e o trabalhador. Ela conta com um orifício para entrada de ar próximo à garra de fixação.",
      avisoNoFinal: true,
      quadros: [
        { img: "29", hs: { x: 68.5, y: 55 } }, // tampa do suporte
        { img: "29", hs: { x: 61, y: 68 } }, // amostrador no suporte
        { img: "30" },
      ],
    },

    /* ---------- Passo 18 ---------- */
    {
      instrucao:
        "Fixe a bomba de amostragem na cintura do trabalhador e posicione o amostrador, especificamente o ponto de ingresso de ar, na zona respiratória do empregado.",
      aviso:
        "O tubo (mangueira) deve ser posicionado de modo a reduzir a interferência na atividade do empregado. Normalmente, as bombas de amostragem são colocadas em cases específicos para seu acondicionamento durante a avaliação.",
      avisoNoFinal: true,
      quadros: [
        { img: TRAB, painel: ["bomba", "amostrador"], hs: PAINEL_BOMBA },
        { img: TRAB, painel: [null, "amostrador"], hs: CINTURA },
        {
          img: TRAB,
          painel: [null, "amostrador"],
          marcas: [CINTURA],
          hs: PAINEL_AMOSTRADOR,
        },
        { img: TRAB, painel: [null, null], marcas: [CINTURA], hs: GOLA },
        { img: TRAB_COM },
      ],
    },

    /* ---------- Passo 19 ---------- */
    {
      instrucao: "Na tela da bomba, inicie a operação.",
      aviso:
        "Neste tipo de avaliação, pode ser necessário configurar um atraso na bomba para início da medição.",
      avisoNoFinal: true,
      quadros: [
        { img: TRAB_COM, hs: CINTURA },
        {
          ...BOMBA_CLOSE,
          fundo: TRAB_COM,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "1",
            unidade: "min",
            pausa: true,
          }),
          hs: B_COMBO,
        },
        {
          ...BOMBA_CLOSE,
          fundo: TRAB_COM,
          lcd: bomba({
            titulo: "OPERANDO TEMPO RESTANTE",
            valor: "1",
            unidade: "min",
          }),
        },
      ],
    },

    /* ---------- Passo 20 ---------- */
    {
      instrucao:
        "Ligue o termo-higro-barômetro e aguarde as leituras estabilizarem. Depois, meça a temperatura, a umidade relativa e a pressão atmosférica. Anote esses valores e desligue o aparelho.",
      quadros: TERMO("25.4", "73.4", "998.9"),
    },

    /* ---------- Passo 21 ---------- */
    {
      instrucao: "Após um minuto...",
      quadros: [
        {
          img: TRAB_COM,
          video: "assets/video/Vedacao.mp4", // animação do trabalho (toca uma vez)
          tipo: "espera",
          duracao: 22950, // duração do vídeo em ms (Vedacao.mp4 = 22,9 s)
          texto: "Coletando amostra... (tempo acelerado)",
        },
      ],
    },

    /* ---------- Passo 22 ---------- */
    {
      instrucao:
        "Agora que o tempo de avaliação foi concluído, retire o conjunto do trabalhador.",
      quadros: [
        { img: TRAB_COM, painel: [null, null], hs: GOLA },
        { img: TRAB, painel: [null, "amostrador"], hs: CINTURA },
        { img: TRAB, painel: ["bomba", "amostrador"] },
      ],
    },

    /* ---------- Passo 23 ---------- */
    {
      instrucao:
        "Retire a capa de proteção; retire o amostrador de coleta, tampe-o e insira-o na caixa de isopor.",
      quadros: [
        { img: "30", hs: { x: 68.5, y: 60 } }, // capa de proteção
        { img: "29", hs: { x: 61, y: 75 } }, // amostrador no suporte
        { img: "36", auto: 1500 }, // a bomba fica assim
        { img: "34", hs: { x: 40, y: 55.5 } }, // tampa da esquerda
        { img: "34", hs: { x: 57.5, y: 54.5 } }, // tampa da direita
        { img: "35", hs: { x: 48, y: 70 } }, // amostrador tampado
        { img: "01_1", hs: { x: 33, y: 60 } }, // tampa da caixa
        { img: "01" },
      ],
    },

    /* ---------- Passo 24 ---------- */
    {
      instrucao:
        "Agora, retire novamente as tampas de proteção do amostrador representativo.",
      quadros: [
        { img: "35", hs: { x: 40.5, y: 70 } }, // tampa da esquerda
        { img: "35", hs: { x: 57.5, y: 70 } }, // tampa da direita
        { img: "34" },
      ],
    },

    /* ---------- Passo 25 ---------- */
    {
      instrucao:
        "Conecte o amostrador representativo na outra extremidade do tubo. A seta desenhada no tubo amostrador deve ser conectada apontando na direção do fluxo de ar.",
      quadros: [
        { img: "37", hs: { x: 37, y: 66.5 } }, // amostrador
        { img: "37", hs: { x: 49.4, y: 45 } }, // suporte
        { img: "38" },
      ],
    },

    /* ---------- Passo 26 ---------- */
    {
      instrucao:
        "Conecte a outra extremidade do amostrador ao outro tubo flexível na extremidade que contém o adaptador.",
      quadros: [
        { img: "39", hs: { x: 36.5, y: 70 } },
        { img: "39", hs: { x: 30.7, y: 56 } },
        { img: "40" },
      ],
    },

    /* ---------- Passo 27 ---------- */
    {
      instrucao:
        "Conecte a extremidade do tubo à porta de sucção do calibrador de vazão.",
      quadros: [
        { img: "41", hs: { x: 57, y: 70 } },
        { img: "41", hs: { x: 72.8, y: 42.4 } },
        { img: "42", auto: 1200 },
        { img: "43" },
      ],
    },

    /* ---------- Passo 28 ---------- */
    {
      instrucao:
        "Ligue o aferidor de vazão. Navegue até a função MEDIR e depois selecione a função SEQUENCIAL.",
      quadros: [
        { img: "43", hs: CENA_CALIBRADOR },
        { ...AFERIDOR_CLOSE, fundo: "43", hs: C_POWER },
        {
          ...AFERIDOR_CLOSE,
          fundo: "43",
          lcd: calib({ tela: "inicio" }),
          hs: C_ENTER,
        },
        {
          ...AFERIDOR_CLOSE,
          fundo: "43",
          lcd: calib({ tela: "menu", sel: "ÚNICA" }),
          hs: C_DIR,
        },
        {
          ...AFERIDOR_CLOSE,
          fundo: "43",
          lcd: calib({ tela: "menu", sel: "CONT." }),
          hs: C_DIR,
        },
        {
          ...AFERIDOR_CLOSE,
          fundo: "43",
          lcd: calib({ tela: "menu", sel: "SEQUENCIAL" }),
          hs: C_ENTER,
        },
        {
          ...AFERIDOR_CLOSE,
          fundo: "43",
          lcd: calib({ tela: "medicao", opcoes: ["SEQUENCIAL", "SAIR"] }),
        },
      ],
    },

    /* ---------- Passo 29 ---------- */
    {
      instrucao: `Na tela da bomba, pressione duas vezes simultaneamente os botões ${T("▲")} e ${T("▼")}.`,
      quadros: [
        { img: "43", hs: CENA_BOMBA },
        {
          ...BOMBA_CLOSE,
          fundo: "43",
          lcd: bomba({ titulo: "TEMPO RESTANTE", valor: "0", unidade: "min" }),
          hs: B_COMBO,
        },
        {
          ...BOMBA_CLOSE,
          fundo: "43",
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "1",
            unidade: "min",
            pausa: true,
          }),
          hs: B_COMBO,
        },
        {
          ...BOMBA_CLOSE,
          fundo: "43",
          lcd: bomba({
            titulo: "OPERANDO TEMPO RESTANTE",
            valor: "1",
            unidade: "min",
          }),
          auto: 1500,
        },
        {
          ...AFERIDOR_CLOSE,
          fundo: "43",
          tipo: "leituras",
          intervalo: 1500, // no PDF são 5 s – acelerado para a simulação
          msgFinal:
            "Essa é a vazão média final da bomba. A variação com relação à vazão inicial foi de +0,95%, o que está dentro da tolerância máxima de ±5%.",
          leituras: [
            ["0,3006", "0,3006"],
            ["0,3016", "0,3011"],
            ["0,2985", "0,3002"],
            ["0,2989", "0,2999"],
            ["0,2981", "0,2995"],
            ["0,3068", "0,3008"],
            ["0,2896", "0,2992"],
            ["0,3001", "0,2993"],
            ["0,3020", "0,2996"],
            ["0,3050", "0,3001"],
          ],
        },
      ],
    },
  ],

  /* ============================================================
   *  FINALIZAÇÃO
   * ============================================================ */
  fim: [
    /* ---------- Passo 30 (ilustrado) ---------- */
    {
      tipo: "modal",
      img: CENARIO,
      textoBotao: "OK",
      html: '<p style="text-align:center">Desligue os equipamentos, desmonte o sistema de coleta, tampe o amostrador representativo e guarde-o. Anote todos os dados de coleta em uma planilha e envie esses dados e os amostradores ao laboratório de análises químicas para que ele indique a concentração da substância química.</p>',
    },
    {
      tipo: "modal",
      img: CENARIO,
      titulo: "Finalização",
      textoBotao: "Fechar simulação",
      html: `
        <p>Você chegou ao final da coleta da substância química vapores de ácido acético. Agora, o laboratório analisará as amostras e enviará um documento com a concentração da substância na amostra.</p>
        <p>Outros comentários:</p>
        <ol>
          <li>Quando for necessário coletar mais de uma amostra, o processo descrito será o mesmo, mas é preciso repetir todos os passos para cada uma delas.</li>
          <li>Converse com o laboratório de análises químicas sobre quais dos parâmetros (pressão atmosférica, umidade e temperatura ambiente) precisam ser coletados.</li>
          <li>Converse com o laboratório de análises químicas sobre a necessidade de brancos de campo. No simulador, eles não foram utilizados.</li>
          <li>Há uma variedade de métodos de coleta e amostradores, portanto nem todas as avaliações serão iguais a esta.</li>
          <li>Sempre leia o manual dos equipamentos envolvidos. O simulador é focado na avaliação e não na configuração de equipamentos além do necessário.</li>
        </ol>`,
    },
  ],

  /* ============================================================
   *  MODAIS DO MENU
   * ============================================================ */
  parametros: {
    titulo: "Parâmetros",
    itens: [
      "Tempo de jornada diária = 8 h (480 min).",
      "Substância a ser avaliada: vapores de ácido acético [CAS 64-19-7].",
      "Tipo de limite de tolerância e valor: LT-MPT = 8 ppm (NR-15).",
      "Valor máximo de exposição (pico de exposição) = 16 ppm (NR-15).",
      "Relação ppm → mg/m³: 1 ppm = 2,46 mg/m³.",
      "Método de coleta: NIOSH 1603.",
      "Estabilidade da amostra: 7 dias a 25 °C.",
      "Limite de quantificação: 6,6 µg (fornecido pelo laboratório de análises).",
      "Tipo de amostrador: tubo com carvão ativo 100 mg/50 mg.",
      "Faixa de volume de coleta: 20 a 300 litros.",
      "Faixa de vazão de coleta: 0,01 a 1,0 l/min.",
      "Volume mínimo para identificar exposições além do pico = 0,17 litro.",
      "Vazão escolhida: 0,3 l/min.",
      "Tempo de uma amostra: 1 min.",
    ],
  },

  maisDetalhes: {
    titulo: "Mais detalhes",
    html: `
      <p>Nesta avaliação, você estimará se a exposição pode ser maior do que o valor de pico admitido para a concentração do ácido acético. Esse tipo de avaliação deve ser conduzido para substâncias que não tenham LT-VT ou TLV-C ou TLV-STEL, ou seja, que tenham apenas LT-MPT ou TLV-TWA. Algumas substâncias têm mais de um tipo de LT.</p>
      <p>As avaliações de pico são conduzidas quando há suspeita de superexposição. Se esses momentos não puderem ser definidos, então é conduzido um sorteio aleatório para escolher os pontos no quais as avaliações ocorrerão. Nesta simulação, será realizada apenas uma avaliação, porém o processo para a coleta de mais de uma amostra é o mesmo.</p>
      <p>Quando amostras são coletadas com amostradores, há dois parâmetros de interesse: o limite de detecção e o limite de quantificação. O limite de detecção é a massa da substância que deve ser coletada para que o laboratório consiga identificar a presença da substância, embora não consiga indicar nada sobre a concentração. Já o limite de quantificação é a menor massa que deve ser coletada para que o laboratório estime a concentração da substância. Para o caso do ácido acético, o limite de quantificação é de 6,6 µg.</p>
      <p>O valor máximo é um limite do tipo instantâneo. Portanto, a amostragem deve ser executada o mais rápido possível, mantendo um tempo suficiente para coletar uma massa mínima de 6,6 µg. O volume mínimo de amostragem é determinado pela expressão a seguir:</p>
      <div class="formula">
        <div>V<sub>mín</sub> [litro] = ${F("LQ [mg]", "Limite [mg/m³] × (1/1000) [m³/litro] × F")}</div>
        <div>= ${F("0,0066 [mg]", "39,36 [mg/m³] × (1/1000) [m³/litro] × 1")} = 0,17 litro</div>
      </div>
      <p>“LQ” é o limite de quantificação, “Limite” é o valor do parâmetro de interesse (no caso, 16 ppm ou 39,36 mg/m³) e “F” é um fator para ajuste. Como o interesse está diretamente sobre o valor de 16 ppm, utiliza-se F = 1.</p>
      <p>Assim, coletar pelo menos um volume de 0,17 litro garante que, se a concentração de pico for da ordem de 16 ppm, ela será detectada. Como o método admite vazões na faixa de 0,01 a 1 l/min, opta-se por uma vazão de 0,3 l/min com a bomba operando por um tempo de 1 minuto, o que garante um volume de coleta de 0,3 litro, quase o dobro do mínimo.</p>
      <p>Quando o laboratório retornar a concentração do amostrador, esse valor deverá ser comparado diretamente com o valor máximo (16 ppm). Se mais amostras forem coletadas, cada uma delas será comparada com o valor máximo individualmente; se uma delas for superior, a condição é considerada como de grave e iminente risco.</p>
      <!-- O nome da opção abaixo estava com fundo amarelo no PDF; foi mantido para a frase fazer sentido. -->
      <p>O ácido acético tem um limite de tolerância do tipo média ponderada no tempo (LT-MPT), desta forma, avaliar apenas picos de exposição é apenas parte da avaliação. Para verificar como analisar a concentração média ponderada com bombas de amostragem de ar, acesse a opção de simulação <b>Avaliar exposição à substância com LT-MPT ou TLV-TWA → Gás ou vapor</b>.</p>
      <p>As questões abordadas aqui são válidas também para avaliação de picos de exposição de particulados, névoas e neblinas.</p>`,
  },

  /* ============================================================
   *  MANUAIS (iguais aos da Situação 5)
   * ============================================================ */
  manuais: {
    titulo: "Seleção de manuais",
    textoSelecao:
      "Para auxiliar na operação dos aparelhos necessários para esta simulação, disponibilizamos 3 manuais:",
    lista: [
      {
        titulo: "Bomba de amostragem",
        botao: "export img oda/bto-manual-bomba-amostragem.png",
        descricao:
          "Neste manual, você aprenderá como configurar a bomba de amostragem de ar para uma avaliação ocupacional.",
        rotinas: [
          {
            titulo: "Rotina de ligação da bomba",
            paginas: [
              {
                img: `${MANUAL}MANUAL/slide_1.png`,
              },
            ],
          },
          {
            titulo: "Rotina de configuração da bomba",
            paginas: [
              {
                img: `${MANUAL}MANUAL/slide_2.png`,
                texto: `Agora, com o aparelho já ligado, inicie a rotina de configuração. Primeiro pressione a seguinte sequência de teclas (em no máximo 4 segundos):<br><br><span style="font-size:70px">${T("✱")} ${T("▲")} ${T("▼")} ${T("✱")}</span>`,
              },
              {
                img: `${MANUAL}MANUAL/slide_3.png`,
                texto: `Na tela inicial, pressionar simultaneamente os botões ${T("▲")} ${T("▼")} apagará todas as configurações vigentes – exceto a de vazão – e retornará à tela final do processo de inicialização da bomba.`,
              },
              {
                img: `${MANUAL}MANUAL/slide_4.png`,
                texto: `O botão ${T("✱")} possibilita o movimento dos traços centrais. Para isso, basta clicar em ${T("▲")} para a vazão da bomba aumentar ou ${T("▼")} para a vazão da bomba diminuir.`,
              },
              {
                img: `${MANUAL}MANUAL/slide_5.png`,
                texto: `Clicando novamente no ${T("✱")} podemos ajustar o tempo. Utilize ${T("▲")} ou ${T("▼")} para aumentar ou diminuir de um em um.`,
              },
              {
                img: `${MANUAL}MANUAL/slide_6.png`,
                texto: `Clicando uma terceira vez em ${T("✱")}, é possível ajustar o atraso. Mas, para este simulador, não utilizaremos esta opção.`,
              },
              {
                texto: `Para sair do modo de configuração a qualquer momento, pressione simultaneamente os botões ${T("▲")} e ${T("▼")}. O sistema retornará para a tela final do processo de ligar a bomba.<br><br>Pressione o botão ${T("✱")} para concluir a configuração e avançar para a próxima função.`,
              },
            ],
          },
          {
            titulo: "Rotina de iniciar medição",
            paginas: [
              {
                img: `${MANUAL}MANUAL/slide_8.png`,
                texto: `Na tela TEMPO RESTANTE, pressione ao mesmo tempo ${T("▲")} e ${T("▼")} para iniciar a operação.`,
              },
            ],
          },
          {
            titulo: "Rotina de tempo decorrido",
            paginas: [
              {
                img: `${MANUAL}MANUAL/slide_9.png`,
                texto:
                  "Quando a contagem chega a 0 min, o tempo programado terminou e a bomba encerra a amostragem.",
              },
            ],
          },
          {
            titulo: "Rotina de desligar",
            paginas: [
              {
                img: `${MANUAL}MANUAL/slide_10.png`,
                texto: `Para desligar, mantenha pressionado o botão ${T("✱")}. A tela mostra OFF3, OFF2 e OFF1 até o aparelho desligar.`,
              },
            ],
          },
        ],
      },
      {
        titulo: "Calibrador / Aferidor de vazão",
        botao: "export img oda/bto-manual-calibrador.png",
        descricao:
          "Neste manual, você aprenderá como configurar o calibrador/aferidor de vazão para uma avaliação ocupacional.",
        rotinas: [
          {
            titulo: "Rotina de ligação do aparelho",
            paginas: [
              {
                img: `${MANUAL_CAL}slide_1.png`,
                texto: "Pressione o botão ⏻ para ligar o calibrador.",
              },
            ],
          },
          {
            titulo: "Rotina do menu MEDIR",
            paginas: [
              {
                img: `${MANUAL_CAL}slide_2.png`,
                texto:
                  "No menu MEDIR, use ◄ e ► para escolher entre ÚNICA, CONT., SEQUENCIAL e CONFIG. Pressione ENTER para confirmar.",
              },
            ],
          },
          {
            titulo: "Rotina da função ÚNICA",
            paginas: [
              {
                img: `${MANUAL_CAL}slide_3.png`,
                texto:
                  "Na função ÚNICA, pressione ENTER para iniciar. O aparelho mostra a vazão de cada leitura e a média.",
              },
              {
                img: `${MANUAL_CAL}slide_4.png`,
                texto:
                  "Na função ÚNICA, pressione ENTER para iniciar. O aparelho mostra a vazão de cada leitura e a média.",
              },
              {
                img: `${MANUAL_CAL}slide_5.png`,
                texto:
                  "Na função ÚNICA, pressione ENTER para iniciar. O aparelho mostra a vazão de cada leitura e a média.",
              },
            ],
          },
          {
            titulo: "Rotina da função SEQUENCIAL",
            paginas: [
              {
                img: `${MANUAL_CAL}slide_6.png`,
                texto: "Selecione SEQUENCIAL e pressione ENTER.",
              },
            ],
          },
        ],
      },
      {
        titulo: "Termo higro barômetro",
        botao: "export img oda/bto-manual-higro.png",
        descricao:
          "Neste manual, você aprenderá como configurar o termo-higro-barômetro para uma avaliação ocupacional.",
        rotinas: [
          {
            titulo: "Rotina de ligar",
            paginas: [
              {
                img: `${MANUAL_TER}slide_1.png`,
                texto: "Pressione o botão verde ⏻. A tela mostra LIGANDO...",
              },
            ],
          },
          {
            titulo: "Rotina de desligar",
            paginas: [
              {
                img: `${MANUAL_TER}slide_2.png`,
                texto:
                  "Pressione novamente o botão ⏻ para desligar o aparelho.",
              },
            ],
          },
        ],
      },
    ],
  },
};
