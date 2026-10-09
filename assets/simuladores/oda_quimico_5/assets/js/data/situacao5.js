/**
 * ============================================================
 *  SITUAÇÃO 5 – Vapores de n-butanol (pintura de estruturas metálicas)
 *  Avaliar exposição à substância com LT-VT ou TLV-C → Gás ou vapor
 * ============================================================
 *  Este arquivo contém SOMENTE conteúdo. Para criar outra situação,
 *  duplique este arquivo, altere textos/imagens/passos e troque o
 *  import em assets/js/main.js.
 *
 *  Textos: assets/referencias_textos/Decupagem Situação 5_rev.pdf
 *  (trechos com fundo amarelo foram ignorados).
 *
 *  Imagens:
 *    '07'                      -> assets/img/renders/07.png
 *    'cenario_introducao.png'  -> assets/img/cenario_introducao.png
 *    video: 'assets/video/x.mp4' -> vídeo no lugar da imagem de fundo
 *    frente: 'x.png'           -> camada transparente por cima da imagem
 *    caminho com '/'           -> usado como está
 *
 *  Os renders seguem a ordem do fluxo (alguns são repetidos com outro número):
 *    01–04 caixa e amostradores      05–06 amostrador + dispositivo de quebra
 *    07–16 montagem, cena geral (15) e close da bomba (16)
 *    17–20 parafuso regulador        21 close da bomba   22 cena geral
 *    23–27 desmontagem/montagem      28–29 tampa do suporte
 *    30–31 termo-higro-barômetro     32–39 retirada da capa e caixa de isopor
 *    40–48 nova montagem             49 close do calibrador
 *
 *  Posições (x, y) sempre em % da tela (0–100).
 *  Estrutura de um passo: ver assets/js/core/Passo.js
 * ============================================================
 */

/* ---------- atalhos de posição (botões dos equipamentos) ---------- */
// Close-ups dos equipamentos (assets/img/renders/telas_equi – PNG com fundo transparente;
// "fundo" = render desfocado que aparece atrás)
const BOMBA_CLOSE = { img: "renders/telas_equi/Bomba.png", fundo: "15" };
const AFERIDOR_CLOSE = { img: "renders/telas_equi/Aferidor.png", fundo: "15" };
const TERMO_CLOSE = { img: "renders/telas_equi/Termo_higro.png", fundo: "30" };

// Bomba (Bomba.png)
const B_CIMA = { x: 38, y: 81 };
const B_ASTER = { x: 50.5, y: 81 };
const B_BAIXO = { x: 63, y: 81 };
const B_COMBO = { x: 50.5, y: 70.5, combo: { largura: 25 } }; // ▲ + ▼ juntos

// Calibrador (Aferidor.png)
const C_ENTER = { x: 63.5, y: 48.5 };
const C_DIR = { x: 71, y: 48.5 };
const C_POWER = { x: 73.5, y: 61 };

// Cena geral com calibrador + bomba (renders 15 / 22 / 47)
const CENA_CALIBRADOR = { x: 27, y: 31 };
const CENA_BOMBA = { x: 74, y: 47 };

// Cenário da introdução/finalização + camada da frente (vidro, PNG transparente)
const CENARIO = "cenario_introducao.png";
const CENARIO_FRENTE = "cenario_introducao_2.png";

// Cena do trabalhador: sem e com os equipamentos (assets/img/personagem_*.png)
const TRAB = "personagem_sem.png";
const TRAB_COM = "personagem_com.png";
const CINTURA = { x: 38.2, y: 64.5 }; // posição da bomba na cintura (personagem_com.png)
const OMBRO = { x: 41.7, y: 37.5 }; // posição do amostrador no peito – zona respiratória
const PAINEL_BOMBA = { x: 10.5, y: 79 };
const PAINEL_AMOSTRADOR = { x: 22.8, y: 79 };

/* ---------- telas do visor ---------- */
const bomba = (d) => ({ tipo: "bomba", ...d });
const calib = (d) => ({ tipo: "calibrador", ...d });

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
      frente: CENARIO_FRENTE,
      texto:
        "O objetivo deste simulador é familiarizar você com a avaliação de agentes químicos dispersos no ar, utilizando bomba de amostragem e amostradores. Embora o simulador contemple diversos cenários, não é possível cobrir todas as combinações de avaliações e amostradores. No entanto, o procedimento geral de avaliação é semelhante a algum dos casos apresentados.",
    },
    {
      tipo: "dialogo",
      img: CENARIO,
      frente: CENARIO_FRENTE,
      texto:
        "Existem outras formas de avaliar agentes químicos dispersos no ar ambiente além do uso de bombas de amostragem e amostradores. Todos os métodos e equipamentos disponíveis apresentam vantagens e desvantagens. Este simulador foi construído considerando os limites de tolerância preventivos válidos para o ano de 2025.",
    },
    {
      tipo: "dialogo",
      img: CENARIO,
      frente: CENARIO_FRENTE,
      texto:
        "Embora os valores e tipos de limites possam sofrer alterações ao longo do tempo, a estrutura geral de avaliação permanece válida, alterando-se apenas o enquadramento metodológico do agente.",
    },
    {
      tipo: "modal",
      img: CENARIO,
      frente: CENARIO_FRENTE,
      titulo: "Introdução",
      textoBotao: "OK",
      html: `
        <p>Você avaliará a exposição de um trabalhador que está executando a pintura de estruturas metálicas com o auxílio de uma pistola de pintura. Nessa atividade, há a exposição a diversos componentes da tinta na forma de névoas e vapores.</p>
        <!-- ATENÇÃO: parágrafo abaixo está no PDF sem marcação amarela, mas fala do selante de silicone (Situação 1). Confirmar se deve ficar. -->
        <p>A exposição decorre da aplicação de selante de silicone acético. O selante não contém ácido acético em sua composição, mas possui duas substâncias químicas (metiltriacetoxisilano e etiltriacetoxisilano) que, em contato com a umidade do ar ambiente, sofrem uma reação de reticulação. Essa reação confere ao silicone as suas características de resistência mecânica, flexibilidade, entre outros.</p>
        <p>Uma das substâncias de interesse são os vapores de n-butanol (álcool n-butílico) [CAS 71-36-3] oriundos do solvente da tinta. A substância tem limite do tipo valor-teto, LT-VT = 40 ppm.</p>`,
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
        { img: "01", hs: { x: 47, y: 45 } },
        { img: "02", hs: { x: 50, y: 50 } },
        { img: "03", hs: { x: 58, y: 70 } },
        {
          img: "04",
          infoPosicao: "rodape",
          info: "Considere os seguintes amostradores e suas funções:<br><b>TCA 220/14R</b> – Amostrador representativo usado para ajuste da vazão<br><b>TCA 221/14R</b> – Amostrador usado para coleta",
        },
      ],
    },

    /* ---------- Passo 2 ---------- */
    {
      instrucao:
        "Rompa ambas as extremidades do tubo de vidro do amostrador representativo utilizando o dispositivo de quebra.",
      quadros: [
        { img: "06", hs: { x: 52, y: 73 } }, // dispositivo de quebra
        { img: "06", hs: { x: 72.5, y: 50 } }, // extremidade direita da ampola
        { img: "06", hs: { x: 28.5, y: 51.5 } }, // extremidade esquerda da ampola
        { img: "05" },
      ],
    },

    /* ---------- Passo 3 ---------- */
    {
      instrucao:
        "Conecte o tubo flexível com suporte para amostrador na entrada de ar da bomba.",
      quadros: [
        { img: "07", hs: { x: 55, y: 50 } },
        { img: "07", hs: { x: 80, y: 31 } },
        { img: "08" },
      ],
    },

    /* ---------- Passo 4 ---------- */
    {
      instrucao:
        "Conecte o amostrador representativo na outra extremidade do tubo. A seta desenhada no tubo amostrador deve ser conectada apontando na direção do fluxo de ar.",
      quadros: [
        { img: "09", hs: { x: 36, y: 66 } },
        { img: "09", hs: { x: 49, y: 43 } },
        { img: "10" },
      ],
    },

    /* ---------- Passo 5 ---------- */
    {
      instrucao:
        "Conecte a outra extremidade do amostrador ao outro tubo flexível na extremidade que contém o adaptador.",
      quadros: [
        { img: "11", hs: { x: 36, y: 70 } },
        { img: "11", hs: { x: 30, y: 54 } },
        { img: "12" },
      ],
    },

    /* ---------- Passo 6 ---------- */
    {
      instrucao:
        "Conecte a extremidade do tubo à porta de sucção do calibrador de vazão.",
      quadros: [
        { img: "13", hs: { x: 56, y: 69 } },
        { img: "13", hs: { x: 72, y: 41 } },
        { img: "14", auto: 1200 },
        { img: "15" },
      ],
    },

    /* ---------- Passo 7 ---------- */
    {
      instrucao: "Ligue a bomba pressionando o botão por meio segundo.",
      quadros: [
        { img: "15", hs: CENA_BOMBA },
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
        { img: "15", hs: CENA_CALIBRADOR },
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
            vazao: "0,2261",
            media: "0,2261",
            contador: "01 de 01",
          }),
        },
      ],
    },

    /* ---------- Passo 10 ---------- */
    {
      instrucao:
        'Utilize o parafuso regulador para ajustar a vazão até que ela esteja próxima ao valor de <b style="color:#e5461d">0,2 l/min</b>.',
      quadros: [
        {
          img: "17",
          tipo: "ajuste",
          valores: ["0,2436", "0,2352", "0,2261", "0,2133", "0,2024"],
          inicio: 2,
          alvo: 4,
          media: "0,2261",
          msgAjustar: "Reduza a vazão.",
          msgSucesso:
            "Você ajustou a vazão para um valor próximo ao desejado. Agora, avance para a função de medição de vazão sequencial.",
          botoes: { diminuir: { x: 36.5, y: 30 }, aumentar: { x: 61, y: 30 } },
          imagens: ["17", "18", "19", "20"], // parafuso girando ¼ de volta por clique
        },
      ],
    },

    /* ---------- Passo 11 ---------- */
    {
      instrucao:
        "Acesse a função de medição de vazão sequencial e realize um conjunto de 10 leituras.",
      quadros: [
        { img: "15", hs: CENA_CALIBRADOR },
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({
            tela: "medicao",
            vazao: "0,2024",
            media: "0,2261",
            contador: "01 de 010",
            sel: "PAUSA",
          }),
          hs: C_DIR,
        },
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({
            tela: "medicao",
            vazao: "0,2024",
            media: "0,2261",
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
          intervalo: 1500,
          msgFinal: "Essa é a vazão média da bomba!",
          leituras: [
            ["0,2015", "0,2015"],
            ["0,2013", "0,2014"],
            ["0,1999", "0,2009"],
            ["0,2010", "0,2009"],
            ["0,1969", "0,2001"],
            ["0,2019", "0,2004"],
            ["0,1987", "0,2002"],
            ["0,1976", "0,1999"],
            ["0,2015", "0,2000"],
            ["0,2032", "0,2004"],
          ],
        },
      ],
    },

    /* ---------- Passo 12 ---------- */
    {
      instrucao: `Na bomba, clique simultaneamente nos botões ${T("▲")} e ${T("▼")} para desligar a operação.`,
      quadros: [
        { img: "15", hs: CENA_BOMBA },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "OPERANDO TEMPO RESTANTE",
            valor: "3",
            unidade: "min",
          }),
          hs: B_COMBO,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "3",
            unidade: "min",
            pausa: true,
          }),
        },
      ],
    },

    /* ---------- Passo 13 ---------- */
    {
      instrucao:
        "Acesse a configuração da bomba e ajuste o tempo para 2 min. Depois disso, saia da função de configuração.",
      quadros: [
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "3",
            unidade: "min",
            pausa: true,
          }),
          hs: B_ASTER,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "3",
            unidade: "min",
            pausa: true,
          }),
          hs: B_CIMA,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "3",
            unidade: "min",
            pausa: true,
          }),
          hs: B_BAIXO,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "3",
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
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ titulo: "AJUSTE DE TEMPO", valor: "3", unidade: "min" }),
          hs: B_BAIXO,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ titulo: "AJUSTE DE TEMPO", valor: "2", unidade: "min" }),
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

    /* ---------- Passo 14 ---------- */
    {
      instrucao:
        "Desligue o aferidor de vazão, retire o amostrador representativo e tampe suas extremidades.",
      quadros: [
        { img: "22", hs: CENA_CALIBRADOR },
        {
          ...AFERIDOR_CLOSE,
          lcd: calib({ tela: "medicao", vazao: "0,2032", media: "0,2004" }),
          hs: C_POWER,
        },
        { ...AFERIDOR_CLOSE, auto: 800 },
        { img: "22", hs: { x: 23, y: 66 } }, // suporte do amostrador
        // retira o amostrador da capa de proteção e tampa as extremidades
        { img: "32", hs: { x: 50, y: 43 } },
        { img: "33", hs: { x: 52, y: 44 } },
        { img: "34", hs: { x: 64, y: 41 } },
        { img: "35", hs: { x: 19, y: 40 } },
        { img: "35", hs: { x: 73, y: 43 } },
        { img: "36" },
      ],
    },

    /* ---------- Passo 15 ---------- */
    {
      instrucao:
        "Rompa ambas as extremidades do tubo de vidro do amostrador que será usado na coleta utilizando o dispositivo de quebra. Depois, conecte o amostrador.",
      aviso:
        "Se forem utilizados amostradores branco de campo, suas extremidades também deverão ser rompidas neste momento. Em seguida, tampe as extremidades e mantenha os amostradores em ambiente próximo ao ponto de coleta.",
      quadros: [
        // retira o amostrador de coleta da caixa de isopor
        { img: "38", hs: { x: 37, y: 48 } }, // amostrador dentro da caixa
        { img: "37", hs: { x: 66, y: 53 } }, // amostrador fora da caixa
        { img: "25", hs: { x: 52, y: 73 } }, // dispositivo de quebra
        { img: "25", hs: { x: 72.5, y: 50 } }, // extremidade direita da ampola
        { img: "25", hs: { x: 28.5, y: 51.5 } }, // extremidade esquerda da ampola
        { img: "24" },
      ],
    },

    /* ---------- Passo 16 ---------- */
    {
      instrucao:
        "Conecte o amostrador representativo na outra extremidade do tubo. A seta desenhada no tubo amostrador deve ser conectada apontando na direção do fluxo de ar.",
      quadros: [
        { img: "26", hs: { x: 36, y: 66 } },
        { img: "26", hs: { x: 49, y: 43 } },
        { img: "27" },
      ],
    },

    /* ---------- Passo 17 ---------- */
    {
      instrucao: "Conecte a tampa do suporte sobre o amostrador.",
      aviso:
        "Essa tampa de proteção protege o amostrador e o empregado. A tampa conta com um orifício para entrada de ar próximo à garra de fixação.",
      quadros: [
        { img: "28", hs: { x: 60, y: 72 } }, // amostrador (esquerda)
        { img: "28", hs: { x: 69, y: 60 } }, // tampa do suporte (direita)
        { img: "29" },
      ],
    },

    /* ---------- Passo 18 ---------- */
    {
      instrucao:
        "Fixe a bomba de amostragem na cintura do trabalhador e posicione o amostrador, especificamente o ponto de ingresso de ar, na zona respiratória do empregado.",
      aviso:
        "O tubo (mangueira) deve ser posicionado de modo a reduzir a interferência na atividade do empregado. Normalmente, as bombas são colocadas em cases específicos para seu acondicionamento durante a avaliação.",
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
        { img: TRAB, painel: [null, null], marcas: [CINTURA], hs: OMBRO },
        { img: TRAB_COM },
      ],
    },

    /* ---------- Passo 19 ---------- */
    {
      instrucao: "Na tela da bomba, inicie a operação.",
      aviso:
        "Nesse tipo de avaliação, pode ser necessário configurar um atraso na bomba para início da medição.",
      quadros: [
        { img: TRAB_COM, hs: CINTURA },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "TEMPO RESTANTE",
            valor: "2",
            unidade: "min",
            pausa: true,
          }),
          hs: B_COMBO,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "OPERANDO TEMPO RESTANTE",
            valor: "2",
            unidade: "min",
          }),
        },
      ],
    },

    /* ---------- Passo 20 ---------- */
    {
      instrucao:
        "Ligue o termo-higro-barômetro e aguarde as leituras estabilizarem. Meça a temperatura, a umidade relativa e a pressão atmosférica. Anote os valores e desligue o aparelho.",
      quadros: [
        { img: "30", hs: { x: 48, y: 62 } },
        { ...TERMO_CLOSE, hs: { x: 38.5, y: 74 } },
        {
          ...TERMO_CLOSE,
          lcd: { tipo: "termo", texto: "LIGANDO..." },
          auto: 1500,
        },
        {
          ...TERMO_CLOSE,
          lcd: { tipo: "termo", temp: "25.4", umid: "73.8", press: "999.9" },
        },
      ],
    },

    /* ---------- Passo 21 ---------- */
    {
      instrucao: "Aguarde dois minutos...",
      quadros: [
        {
          img: TRAB_COM,
          video: "assets/video/Pintura.mp4", // animação do trabalho (toca uma vez)
          tipo: "espera",
          duracao: 11250, // duração do vídeo em ms (Pintura.mp4 = 11,25 s)
          texto: "Coletando amostra... (tempo acelerado)",
        },
      ],
    },

    /* ---------- Passo 22 ---------- */
    {
      instrucao:
        "Agora que o tempo de avaliação foi concluído, retire o conjunto do empregado.",
      quadros: [
        { img: TRAB_COM, painel: [null, null], hs: OMBRO },
        { img: TRAB, painel: [null, "amostrador"], hs: CINTURA },
        { img: TRAB, painel: ["bomba", "amostrador"] },
      ],
    },

    /* ---------- Passo 23 ---------- */
    {
      instrucao:
        "Retire a capa de proteção; retire o amostrador de coleta, tampe-o e insira-o na caixa de isopor.",
      quadros: [
        { img: "32", hs: { x: 50, y: 43 } },
        { img: "33", hs: { x: 52, y: 44 } },
        { img: "34", hs: { x: 64, y: 41 } },
        { img: "35", hs: { x: 19, y: 40 } },
        { img: "35", hs: { x: 73, y: 43 } },
        { img: "36", hs: { x: 50, y: 48 } },
        { img: "37", hs: { x: 72, y: 52 } },
        { img: "38", hs: { x: 12, y: 60 } },
        { img: "39" },
      ],
    },

    /* ---------- Passo 24 ---------- */
    {
      instrucao:
        "Agora, retire novamente as tampas de proteção do amostrador representativo.",
      quadros: [
        { img: "36", hs: { x: 35, y: 45 } },
        { img: "36", hs: { x: 65, y: 54 } },
        { img: "35" },
      ],
    },

    /* ---------- Passo 25 ---------- */
    {
      instrucao:
        "Conecte o amostrador representativo na outra extremidade do tubo. A seta desenhada no tubo amostrador deve ser conectada apontando na direção do fluxo de ar.",
      quadros: [
        { img: "41", hs: { x: 36, y: 66 } },
        { img: "41", hs: { x: 49, y: 43 } },
        { img: "42" },
      ],
    },

    /* ---------- Passo 26 ---------- */
    {
      instrucao:
        "Conecte a outra extremidade do amostrador ao outro tubo flexível na extremidade que contém o adaptador.",
      quadros: [
        { img: "43", hs: { x: 36, y: 70 } },
        { img: "43", hs: { x: 30, y: 54 } },
        { img: "44" },
      ],
    },

    /* ---------- Passo 27 ---------- */
    {
      instrucao:
        "Conecte a extremidade do tubo à porta de sucção do calibrador de vazão.",
      quadros: [
        { img: "45", hs: { x: 56, y: 69 } },
        { img: "45", hs: { x: 72, y: 41 } },
        { img: "46", auto: 1200 },
        { img: "47" },
      ],
    },

    /* ---------- Passo 28 ---------- */
    {
      instrucao:
        "Ligue o aferidor de vazão. Navegue até a função MEDIR e depois selecione a função SEQUENCIAL.",
      quadros: [
        { img: "47", hs: CENA_CALIBRADOR },
        { ...AFERIDOR_CLOSE, hs: C_POWER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: "inicio" }), hs: C_ENTER },
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
        },
      ],
    },

    /* ---------- Passo 29 ---------- */
    {
      instrucao: `Na tela da bomba, pressione duas vezes simultaneamente os botões ${T("▲")} e ${T("▼")}.`,
      quadros: [
        { img: "47", hs: CENA_BOMBA },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ titulo: "TEMPO RESTANTE", valor: "2", unidade: "min" }),
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
          hs: B_COMBO,
        },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({
            titulo: "OPERANDO TEMPO RESTANTE",
            valor: "2",
            unidade: "min",
          }),
          auto: 1500,
        },
        {
          ...AFERIDOR_CLOSE,
          tipo: "leituras",
          intervalo: 1500,
          msgFinal:
            "Essa é a vazão média final da bomba! A variação com relação à vazão inicial foi de +0,95%, o que está dentro da tolerância máxima de ±5%.",
          leituras: [
            ["0,1996", "0,1996"],
            ["0,1956", "0,1976"],
            ["0,2030", "0,1994"],
            ["0,1956", "0,1985"],
            ["0,2012", "0,1990"],
            ["0,2017", "0,1995"],
            ["0,1988", "0,1994"],
            ["0,1984", "0,1992"],
            ["0,2013", "0,1995"],
            ["0,2019", "0,1997"],
          ],
        },
      ],
    },
  ],

  /* ============================================================
   *  FINALIZAÇÃO
   * ============================================================ */
  fim: [
    {
      tipo: "modal",
      img: CENARIO,
      frente: CENARIO_FRENTE,
      textoBotao: "OK",
      html: '<p style="text-align:center">Desligue os equipamentos, desmonte o sistema de coleta, tampe o amostrador representativo e guarde-o. Anote todos os dados de coleta em uma planilha e envie esses dados e os amostradores ao laboratório de análises químicas para que ele indique a concentração da substância química.</p>',
    },
    {
      tipo: "modal",
      img: CENARIO,
      frente: CENARIO_FRENTE,
      titulo: "Finalização",
      textoBotao: "OK",
      html: `
        <p>Você chegou ao final da coleta da substância química vapores de n-butanol. Agora, o laboratório analisará as amostras e enviará um documento com a concentração da substância na amostra.</p>
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
      "Substância a ser avaliada: vapores n-butanol [CAS 71-36-3].",
      "Tipo de limite de tolerância e valor: LT-VT = 40 ppm (NR-15).",
      "Método de coleta: NIOSH 1401.",
      "Relação ppm → mg/m³: 1 ppm = 3,03 mg/m³.",
      "Estabilidade da amostra: desconhecida, manter refrigerada.",
      "Limite de quantificação: 20 µg (fornecido pelo laboratório de análises).",
      "Tipo de amostrador: tubo com carvão ativo 100 mg/50 mg.",
      "Faixa de volume de coleta: 2 a 10 litros.",
      "Faixa de vazão de coleta: 0,01 a 0,2 l/min.",
      "Volume mínimo para identificar exposições além da metade do LT-VT = 0,330 litro.",
      "Vazão escolhida: 0,2 l/min.",
      "Tempo de uma amostra: 2 min.",
    ],
  },

  maisDetalhes: {
    titulo: "Mais detalhes",
    html: `
      <p>Nesta avaliação, você estimará se a exposição pode ser maior do que o LT-VT para a concentração do n-butanol.</p>
      <p>As avaliações para comparação com o LT-VT (ou com TLV-C) são conduzidas quando há suspeita de superexposição. Se esses momentos não puderem ser definidos, então é conduzido um sorteio aleatório para escolher os pontos no quais as avaliações ocorrerão. Nesta simulação, será realizada apenas uma avaliação, porém o processo para a coleta de mais de uma amostra é o mesmo.</p>
      <p>Quando amostras são coletadas com amostradores, há dois parâmetros de interesse: o limite de detecção e o limite de quantificação. O limite de detecção é a massa da substância que deve ser coletada para que o laboratório consiga identificar a presença da substância, embora não consiga indicar nada sobre a concentração. Já o limite de quantificação é a menor massa que deve ser coletada para que o laboratório estime a concentração da substância. Para o caso do n-butanol, o limite de quantificação é de 20 µg.</p>
      <p>O LT-VT (ou o TLV-C) é um limite do tipo instantâneo. Portanto, a amostragem deve ser executada o mais rápido possível, mantendo um tempo suficiente para coletar uma massa mínima de 20 µg. O volume mínimo de amostragem é determinado pela expressão a seguir:</p>
      <div class="formula">
        <div>V<sub>min</sub>[litro] = ${F("LQ[mg]", "Limite[mg/m³]")} × ${F("1", "1000")} [${F("m³", "litro")}] × F</div>
        <div>= ${F("0,02[mg]", "121,2[mg/m³]")} × ${F("1", "1000")} [${F("m³", "litro")}] × 0,5 = 0,33 litro</div>
      </div>
      <p>“LQ” é o limite de quantificação, “Limite” é o valor do parâmetro de interesse (no caso, 40 ppm ou 121,2 mg/m³) e “F” é um fator para ajuste. A substância tem um limite que não pode ser ultrapassado em momento algum. Dessa forma, para esse caso, é interessante monitorar se a concentração tem potencial para superar metade desse LT, assim o fator “F” é escolhido como 0,5. Monitorar essa condição permite estimar se medidas preventivas devem ser iniciadas. Evidentemente, concentrações maiores do que a metade do limite também serão detectadas.</p>
      <p>Assim, coletar pelo menos um volume de 0,33 litro garante que, se a concentração for da ordem de 20 ppm (metade do LT-VT), ela será detectada. Como o método admite vazões na faixa de 0,01 a 0,2 l/min, opta-se por uma vazão de 0,2 l/min com a bomba operando por um tempo de 2 minutos, o que garante um volume de coleta de 0,4 litro, um valor 21% maior do que o valor mínimo.</p>
      <p>Quando o laboratório retornar a concentração do amostrador, esse valor deverá ser comparado diretamente com o LT-VT (40 ppm). Se mais amostras forem coletadas, cada uma delas é comparada com o valor máximo individualmente; se uma delas for superior, isso é considerado que a exposição está acima do limite.</p>
      <p>As questões abordadas aqui são válidas também para avaliação de LT-VT ou TLV-C de particulados, névoas e neblinas.</p>`,
  },

  /* ============================================================
   *  MANUAIS (iguais aos da Situação 1 – mesmos equipamentos)
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
