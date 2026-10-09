/**
 * ============================================================
 *  SITUAÇÃO 2.1 – Fumos de cobre (soldagem)
 *  Avaliar exposição à substância com LT-MPT ou TLV-TWA → Particulado sem fração
 * ============================================================
 *  Este arquivo contém SOMENTE conteúdo. Para criar outra situação,
 *  duplique este arquivo, altere textos/imagens/passos e troque o
 *  import em assets/js/main.js.
 *
 *  Textos: assets/referencias_textos/Decupagem Situação 2.1_rev.pdf
 *  (trechos com fundo amarelo e comentários em vermelho foram ignorados).
 *
 *  Imagens:
 *    '07'                      -> assets/img/renders/07.png
 *    '3_1'                     -> assets/img/renders/3_1.png
 *    'cenario_introducao.png'  -> assets/img/cenario_introducao.png
 *    video: 'assets/video/x.mp4' -> vídeo no lugar da imagem de fundo
 *    caminho com '/'           -> usado como está
 *
 *  Renders (alguns são repetidos com outro número):
 *    01, 01_1, 02 caixa de isopor        3_1–3_7 / 4–4_5 cassete SRX 89756: tampas de cima e de baixo
 *    5–6 tubo na bomba                    7–10 cassete no tubo e segundo tubo
 *    11–12 calibrador conectado (cena)    14–15 retirada do representativo
 *    17–19 cassete de coleta SRX 89757: tampas        20–21 cassete de coleta no tubo
 *    22 termo-higro-barômetro             23–25_2 tampas de volta e caixa de isopor
 *    26–31 nova montagem com o representativo
 *    (13, 16, 22_1, 32 e 33 são close-ups antigos – usamos renders/telas_equi; 34 não é usado)
 *
 *  Posições (x, y) sempre em % da tela (0–100).
 *  Estrutura de um passo: ver assets/js/core/Passo.js
 * ============================================================
 */

/* ---------- atalhos de posição (botões dos equipamentos) ---------- */
// Close-ups dos equipamentos (assets/img/renders/telas_equi – PNG com fundo transparente;
// "fundo" = render desfocado que aparece atrás)
const BOMBA_CLOSE = { img: 'renders/telas_equi/Bomba.png', fundo: '12' };
const AFERIDOR_CLOSE = { img: 'renders/telas_equi/Aferidor.png', fundo: '12' };
const TERMO_CLOSE = { img: 'renders/telas_equi/Termo_higro.png', fundo: '22' };

// Bomba (Bomba.png)
const B_CIMA = { x: 38, y: 81 };
const B_ASTER = { x: 50.5, y: 81 };
const B_BAIXO = { x: 63, y: 81 };
const B_COMBO = { x: 50.5, y: 70.5, combo: { largura: 25 } }; // ▲ + ▼ juntos

// Calibrador (Aferidor.png)
const C_ENTER = { x: 63.5, y: 48.5 };
const C_DIR = { x: 71, y: 48.5 };
const C_POWER = { x: 73.5, y: 61 };

// Cena geral com calibrador + bomba (render 12)
const CENA_CALIBRADOR = { x: 25, y: 55 };
const CENA_BOMBA = { x: 67, y: 38 };

// Cenário da introdução/finalização
const CENARIO = 'cenario_introducao.png';

// Cena do trabalhador: sem e com os equipamentos (assets/img/personagem_*.png)
const TRAB = 'personagem_sem.png';
const TRAB_COM = 'personagem_com.png';
const CINTURA = { x: 42, y: 80 }; // bomba na cintura (personagem_com.png)
const MASCARA = { x: 47.3, y: 13 }; // amostrador dentro da máscara de solda – zona respiratória
const PAINEL_BOMBA = { x: 10.5, y: 79 };
const PAINEL_AMOSTRADOR = { x: 22.8, y: 79 };

/* ---------- telas do visor ---------- */
const bomba = (d) => ({ tipo: 'bomba', ...d });
const calib = (d) => ({ tipo: 'calibrador', ...d });

// ▲ uma vez por clique no ajuste de tempo da bomba (de -> ate)
const subirTempo = (de, ate) =>
  Array.from({ length: ate - de }, (_, i) => ({
    ...BOMBA_CLOSE,
    lcd: bomba({ titulo: 'AJUSTE DE TEMPO', valor: String(de + i), unidade: 'min' }),
    hs: B_CIMA,
  }));

// Cassete representativo (SRX 89756): tampa de cima girando, vira o cassete, tampa de baixo girando
const TAMPAS_REPRESENTATIVO = [
  { img: '3_1', hs: { x: 48, y: 38 } }, // tampa de cima
  { img: '3_2', auto: 250 },
  { img: '3_3', auto: 250 },
  { img: '3_4', auto: 250 },
  { img: '3_5', auto: 250 },
  { img: '3_6', auto: 250 },
  { img: '3_7', hs: { x: 46, y: 52 } }, // vira o cassete
  { img: '4', hs: { x: 49, y: 40 } }, // tampa de baixo
  { img: '4_1', auto: 250 },
  { img: '4_2', auto: 250 },
  { img: '4_3', auto: 250 },
  { img: '4_4', auto: 250 },
  { img: '4_5' },
];

const MANUAL = 'assets/img/Manual - Bomba de amostragem de ar/';
const MANUAL_CAL = 'assets/img/Manual - Calibrador-aferidor de vazao/MANUAL/';
const MANUAL_TER = 'assets/img/Manual -  Termo-higro-barometro/MANUAL/';
const T = (s) => `<span class="tecla">${s}</span>`; // tecla desenhada no texto
const F = (num, den) => `<span class="frac"><span>${num}</span><span>${den}</span></span>`; // fração

export default {
  /* ============================================================
   *  MENU LATERAL (imagens dos botões)
   * ============================================================ */
  menu: {
    manuais: 'export img oda/bto-manuais.png',
    maisDetalhes: 'export img oda/bto-mais-detalhes.png',
    parametros: 'export img oda/bto-parametros.png',
  },

  /* ============================================================
   *  INTRODUÇÃO
   *  tipos: dialogo | modal | manuais | tutorial
   * ============================================================ */
  intro: [
    {
      tipo: 'dialogo',
      img: CENARIO,
      texto:
        'O objetivo deste simulador é familiarizar você com a avaliação de agentes químicos dispersos no ar, utilizando bomba de amostragem e amostradores. Embora o simulador contemple diversos cenários, não é possível cobrir todas as combinações de avaliações e amostradores. No entanto, o procedimento geral de avaliação é semelhante a algum dos casos apresentados.',
    },
    {
      tipo: 'dialogo',
      img: CENARIO,
      texto:
        'Existem outras formas de avaliar agentes químicos dispersos no ar ambiente além do uso de bombas de amostragem e amostradores. Todos os métodos e equipamentos disponíveis apresentam vantagens e desvantagens. Este simulador foi construído considerando os limites de tolerância, para fins preventivos, válidos para o ano de 2025.',
    },
    {
      tipo: 'dialogo',
      img: CENARIO,
      texto:
        'Embora os valores e tipos de limites possam sofrer alterações ao longo do tempo, a estrutura geral de avaliação permanece válida, alterando-se apenas o enquadramento metodológico do agente.',
    },
    {
      tipo: 'modal',
      img: CENARIO,
      titulo: 'Introdução',
      textoBotao: 'OK',
      html: `
        <p>As atividades de solda expõem os trabalhadores a uma série de fumos metálicos, gases e, eventualmente, vapores. Nesta etapa, você avaliará a exposição de um soldador a fumos de cobre.</p>
        <p>O cobre [CAS 7440-50-8] tem um limite do tipo TLV-TWA de 0,2 mg/m³.</p>`,
    },
    { tipo: 'manuais', textoSair: 'Pular' },
    {
      tipo: 'tutorial',
      img: '01',
      alvo: 'manuais',
      texto: 'A qualquer momento, você pode acessar os três manuais clicando ou tocando neste botão.',
    },
    {
      tipo: 'tutorial',
      img: '01',
      alvo: 'maisDetalhes',
      texto: 'Aqui você encontra mais detalhes sobre o tipo de avaliação que será realizada.',
    },
    {
      tipo: 'tutorial',
      img: '01',
      alvo: 'parametros',
      texto: 'A avaliação contará com alguns parâmetros. Para conferi-los a qualquer momento, clique aqui.',
    },
    {
      tipo: 'dialogo',
      img: '01',
      texto: 'Para realizar a avaliação dessa substância química, confira os passos a seguir:',
    },
  ],

  /* ============================================================
   *  PASSOS DA SIMULAÇÃO
   * ============================================================ */
  passos: [
    /* ---------- Passo 1 ---------- */
    {
      instrucao: 'Retire da caixa de isopor os amostradores fornecidos pelo laboratório de análises químicas.',
      quadros: [
        { img: '01', hs: { x: 50, y: 45 } }, // tampa da caixa
        { img: '01_1', hs: { x: 51, y: 42 } }, // cassete dentro da caixa
        {
          img: '02',
          infoPosicao: 'rodape',
          info: 'Considere os seguintes amostradores e suas funções:<br><b>SRX 89756</b> – Amostrador representativo usado para ajuste da vazão<br><b>SRX 89757</b> – Amostrador usado para coleta',
        },
      ],
    },

    /* ---------- Passo 2 ---------- */
    {
      instrucao: 'Retire ambas as tampas das conexões do amostrador representativo.',
      quadros: TAMPAS_REPRESENTATIVO,
    },

    /* ---------- Passo 3 ---------- */
    {
      instrucao: 'Conecte o tubo flexível com suporte para amostrador na entrada de ar da bomba.',
      quadros: [
        { img: '5', hs: { x: 32, y: 68 } }, // ponta do tubo
        { img: '5', hs: { x: 68, y: 24 }, instrucaoPosicao: 'rodape' }, // entrada de ar da bomba
        { img: '6' },
      ],
    },

    /* ---------- Passo 4 ---------- */
    {
      instrucao: 'Conecte a saída de ar do amostrador representativo na outra extremidade do tubo.',
      quadros: [
        { img: '7', hs: { x: 47, y: 80 } }, // cassete
        { img: '8' },
      ],
    },

    /* ---------- Passo 5 ---------- */
    {
      instrucao: 'Conecte a outra extremidade do amostrador ao outro tubo flexível.',
      quadros: [
        { img: '9', hs: { x: 22, y: 38 } }, // ponta do outro tubo
        { img: '10' },
      ],
    },

    /* ---------- Passo 6 ---------- */
    {
      instrucao: 'Conecte a extremidade do tubo à porta de sucção do calibrador de vazão.',
      quadros: [
        { img: '11', hs: { x: 42, y: 61 } }, // ponta do tubo
        { img: '11', hs: { x: 39, y: 38 } }, // porta de sucção do calibrador
        { img: '12' },
      ],
    },

    /* ---------- Passo 7 ---------- */
    {
      instrucao: 'Ligue a bomba pressionando o botão por meio segundo.',
      quadros: [
        { img: '12', hs: CENA_BOMBA },
        // segurar 0,5 s no botão ✱ para ligar
        { ...BOMBA_CLOSE, lcd: bomba({ bateria: false }), hs: { ...B_ASTER, segurar: 500 } },
        { ...BOMBA_CLOSE, lcd: bomba({}), auto: 700, ok: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ valor: 'On', centro: true }), auto: 1000, ok: B_ASTER },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '460', unidade: 'min', pausa: true }),
          marcas: [B_ASTER],
        },
      ],
    },

    /* ---------- Passo 8 ---------- */
    // A bomba fica na tela de configuração (será usada no passo 10).
    {
      instrucao: 'Acesse a configuração da bomba e ajuste o tempo para 480 min.',
      quadros: [
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '460', unidade: 'min', pausa: true }), hs: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '460', unidade: 'min', pausa: true }), hs: B_CIMA },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '460', unidade: 'min', pausa: true }), hs: B_BAIXO },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '460', unidade: 'min', pausa: true }), hs: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ valor: 'CLr', centro: true }), hs: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ valor: '- -', centro: true, legenda: 'AJUSTAR VAZÃO' }), hs: B_ASTER },
        ...subirTempo(460, 480), // ▲ vinte vezes: 460 -> 480 min
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'AJUSTE DE TEMPO', valor: '480', unidade: 'min' }) },
      ],
    },

    /* ---------- Passo 9 ---------- */
    {
      instrucao: 'Ligue o calibrador/aferidor de vazão, acesse a função MEDIR e depois selecione a opção ÚNICA.',
      quadros: [
        { img: '12', hs: CENA_CALIBRADOR },
        { ...AFERIDOR_CLOSE, hs: C_POWER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'inicio' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'ÚNICA' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', opcoes: ['UNICA', 'SAIR'] }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', vazao: '1,9596', media: '1,9596', contador: '01 de 01' }) },
      ],
    },

    /* ---------- Passo 10 ---------- */
    // Da tela AJUSTE DE TEMPO, o ✱ passa por ATRASO e volta para a vazão (traços centrais).
    {
      instrucao: 'Volte para a tela de configuração da vazão da bomba. Ajuste a vazão para <b style="color:#e5461d">2 l/min</b>.',
      quadros: [
        { img: '12', hs: CENA_BOMBA },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'AJUSTE DE TEMPO', valor: '480', unidade: 'min' }), hs: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'AJUSTE DE ATRASO', valor: '0', unidade: 'min' }), hs: B_ASTER },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ valor: '- -', centro: true, legenda: 'AJUSTAR VAZÃO' }),
          tipo: 'ajuste',
          valores: ['2,026', '1,9758', '1,9596', '1,9321', '1,9198'],
          inicio: 2,
          alvo: 0,
          media: '1,9596',
          msgAjustar: 'Aumente a vazão.',
          msgSucesso:
            'Você ajustou a vazão para um valor próximo ao desejado. Agora, avance para a função de medição de vazão sequencial.',
          botoes: { aumentar: { x: 76, y: 63 }, diminuir: { x: 90, y: 63 } }, // na ordem das teclas ▲ ▼
          rotulos: { diminuir: '▼ Diminuir<br>Vazão', aumentar: '▲ Aumentar<br>Vazão' },
          visor: 'lateral', // visor do calibrador menor, à direita (a bomba ocupa o centro)
        },
      ],
    },

    /* ---------- Passo 11 ---------- */
    {
      instrucao: 'Acesse a função de medição de vazão sequencial e realize um conjunto de 10 leituras.',
      quadros: [
        { img: '12', hs: CENA_CALIBRADOR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', vazao: '2,026', media: '1,9596', contador: '01 de 010', sel: 'PAUSA' }), hs: C_DIR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', vazao: '2,026', media: '1,9596', contador: '01 de 010', sel: 'SAIR' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'ÚNICA' }), hs: C_DIR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'CONT.' }), hs: C_DIR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'SEQUENCIAL' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', opcoes: ['SEQUENCIAL', 'SAIR'] }), hs: C_ENTER },
        {
          ...AFERIDOR_CLOSE,
          tipo: 'leituras',
          intervalo: 1800, // taxa de atualização = 1,8 s
          msgFinal: 'Essa é a vazão média da bomba!',
          leituras: [
            ['2,0390', '2,039'],
            ['2,0210', '2,030'],
            ['2,0530', '2,038'],
            ['2,0106', '2,031'],
            ['1,9763', '2,020'],
            ['1,9856', '2,014'],
            ['2,0120', '2,014'],
            ['1,9863', '2,010'],
            ['2,0255', '2,012'],
            ['1,9960', '2,011'],
          ],
        },
      ],
    },

    /* ---------- Passo 12 ---------- */
    {
      instrucao: `Na tela da bomba, pressione simultaneamente os botões ${T('▼')} ${T('▲')} para desligar o aferidor de vazão. Retire o amostrador representativo e tampe suas extremidades.`,
      quadros: [
        { img: '12', hs: CENA_BOMBA },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'OPERANDO TEMPO RESTANTE', valor: '480', unidade: 'min' }), hs: B_COMBO },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '480', unidade: 'min', pausa: true }), auto: 1500 },
        { img: '14', hs: { x: 51, y: 62 } }, // cassete representativo
        { img: '15' },
      ],
    },

    /* ---------- Passo 13 ---------- */
    {
      instrucao: 'Retire ambas as tampas das conexões do amostrador de coleta.',
      aviso:
        'Se forem utilizados amostradores branco de campo, suas extremidades também deverão ser abertas. Em seguida, tampe as extremidades e mantenha os amostradores em ambiente próximo ao ponto de coleta.',
      avisoNoFinal: true,
      quadros: [
        { img: '17', hs: { x: 49, y: 43 } }, // tampa de cima
        { img: '17_1', auto: 250 },
        { img: '17_2', auto: 250 },
        { img: '17_3', auto: 250 },
        { img: '17_4', hs: { x: 48, y: 55 } }, // vira o cassete
        { img: '18', hs: { x: 48, y: 47 } }, // tampa de baixo
        { img: '18_1', auto: 250 },
        { img: '18_2', auto: 250 },
        { img: '18_3', auto: 250 },
        { img: '18_4', auto: 250 },
        { img: '19' },
      ],
    },

    /* ---------- Passo 14 ---------- */
    {
      instrucao: 'Conecte a saída de ar do amostrador na outra extremidade do tubo.',
      quadros: [
        { img: '20', hs: { x: 33, y: 72 } }, // cassete de coleta
        { img: '21' },
      ],
    },

    /* ---------- Passo 15 ---------- */
    {
      instrucao:
        'Fixe a bomba de amostragem na cintura do trabalhador e posicione o amostrador, especificamente o ponto de ingresso de ar, na zona respiratória do empregado.',
      aviso:
        'Para soldadores, a máscara atua reduzindo a exposição do trabalhador, embora essa não seja a sua finalidade principal. Sempre que possível, a amostragem deve ser realizada internamente à máscara de solda, exceto quando o equipamento for um sistema de proteção respiratória alimentado por uma linha de ar. Será preciso verificar em campo se é possível posicionar o amostrador na parte interna da máscara.',
      avisoNoFinal: true,
      quadros: [
        { img: TRAB, painel: ['bomba', 'amostrador'], hs: PAINEL_BOMBA },
        { img: TRAB, painel: [null, 'amostrador'], hs: CINTURA },
        { img: TRAB, painel: [null, 'amostrador'], marcas: [CINTURA], hs: PAINEL_AMOSTRADOR },
        { img: TRAB, painel: [null, null], marcas: [CINTURA], hs: MASCARA },
        { img: TRAB_COM },
      ],
    },

    /* ---------- Passo 16 ---------- */
    {
      instrucao: 'Na tela da bomba, inicie a operação.',
      quadros: [
        { img: TRAB_COM, hs: CINTURA },
        { ...BOMBA_CLOSE, fundo: TRAB_COM, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '480', unidade: 'min', pausa: true }), hs: B_COMBO },
        { ...BOMBA_CLOSE, fundo: TRAB_COM, lcd: bomba({ titulo: 'OPERANDO TEMPO RESTANTE', valor: '480', unidade: 'min' }) },
      ],
    },

    /* ---------- Passo 17 ---------- */
    {
      instrucao:
        'Ligue o termo-higro-barômetro, aguarde as leituras estabilizarem e meça a temperatura, a umidade relativa e a pressão atmosférica. Anote os valores.',
      quadros: [
        { img: '22', hs: { x: 45, y: 59 } },
        { ...TERMO_CLOSE, hs: { x: 38.5, y: 74 } },
        { ...TERMO_CLOSE, lcd: { tipo: 'termo', texto: 'LIGANDO...' }, auto: 1500 },
        { ...TERMO_CLOSE, lcd: { tipo: 'termo', temp: '29.4', umid: '76.4', press: '999.2' } },
      ],
    },

    /* ---------- Passo 18 ---------- */
    {
      instrucao: 'Após 8 horas...',
      quadros: [
        {
          img: TRAB_COM,
          video: 'assets/video/Soldagem.mp4', // animação do trabalho (toca uma vez)
          tipo: 'espera',
          duracao: 5050, // duração do vídeo em ms (Soldagem.mp4 = 5,03 s)
          texto: 'Coletando amostra... (tempo acelerado)',
        },
      ],
    },

    /* ---------- Passo 19 ---------- */
    {
      instrucao:
        'Ligue o termo-higro-barômetro, aguarde as leituras estabilizarem e meça a temperatura, a umidade relativa e a pressão atmosférica. Anote os valores.',
      quadros: [
        { img: '22', hs: { x: 45, y: 59 } },
        { ...TERMO_CLOSE, hs: { x: 38.5, y: 74 } },
        { ...TERMO_CLOSE, lcd: { tipo: 'termo', texto: 'LIGANDO...' }, auto: 1500 },
        { ...TERMO_CLOSE, lcd: { tipo: 'termo', temp: '31.5', umid: '50.1', press: '1000.2' } },
      ],
    },

    /* ---------- Passo 20 ---------- */
    {
      instrucao: 'Agora que o tempo de avaliação foi concluído, retire o conjunto do empregado.',
      quadros: [
        { img: TRAB_COM, painel: [null, null], hs: MASCARA },
        { img: TRAB, painel: [null, 'amostrador'], hs: CINTURA },
        { img: TRAB, painel: ['bomba', 'amostrador'] },
      ],
    },

    /* ---------- Passo 21 ---------- */
    {
      instrucao: 'Retire o amostrador de coleta, tampe as extremidades e insira-o na caixa de isopor.',
      quadros: [
        { img: '21', hs: { x: 32, y: 72 } }, // cassete de coleta
        { img: '23', hs: { x: 69, y: 54 } }, // tampas
        { img: '24', hs: { x: 49, y: 48 } }, // cassete tampado
        { img: '25', hs: { x: 75, y: 52 } }, // leva até a caixa
        { img: '25_1', hs: { x: 30, y: 65 } }, // fecha a tampa
        { img: '25_2', auto: 1200 },
        { img: '26' }, // a bomba fica assim
      ],
    },

    /* ---------- Passo 22 ---------- */
    {
      instrucao: 'Agora, retire as tampas de proteção do amostrador representativo.',
      quadros: TAMPAS_REPRESENTATIVO,
    },

    /* ---------- Passo 23 ---------- */
    {
      instrucao: 'Conecte a saída de ar do amostrador representativo na extremidade do tubo.',
      quadros: [
        { img: '7', hs: { x: 47, y: 80 } }, // cassete representativo
        { img: '8' },
      ],
    },

    /* ---------- Passo 24 ---------- */
    {
      instrucao: 'Conecte a outra extremidade do amostrador ao outro tubo flexível.',
      quadros: [
        { img: '28', hs: { x: 22, y: 38 } },
        { img: '29' },
      ],
    },

    /* ---------- Passo 25 ---------- */
    {
      instrucao: 'Conecte a extremidade do tubo à porta de sucção do calibrador de vazão.',
      quadros: [
        { img: '30', hs: { x: 42, y: 61 } },
        { img: '30', hs: { x: 39, y: 38 } },
        { img: '31' },
      ],
    },

    /* ---------- Passo 26 ---------- */
    {
      instrucao: 'Ligue o aferidor de vazão. Navegue até a função MEDIR e depois selecione a função SEQUENCIAL.',
      quadros: [
        { img: '31', hs: CENA_CALIBRADOR },
        { ...AFERIDOR_CLOSE, hs: C_POWER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'inicio' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'ÚNICA' }), hs: C_DIR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'CONT.' }), hs: C_DIR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'SEQUENCIAL' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', opcoes: ['SEQUENCIAL', 'SAIR'] }) },
      ],
    },

    /* ---------- Passo 27 ---------- */
    {
      instrucao: `Na tela da bomba, pressione duas vezes simultaneamente os botões ${T('▲')} e ${T('▼')}.`,
      quadros: [
        { img: '31', hs: CENA_BOMBA },
        // tela inicial: tempo decorrido (contagem terminou)
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '0', unidade: 'min' }), hs: B_COMBO },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '480', unidade: 'min', pausa: true }), hs: B_COMBO },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'OPERANDO TEMPO RESTANTE', valor: '480', unidade: 'min' }), auto: 1500 },
        {
          ...AFERIDOR_CLOSE,
          tipo: 'leituras',
          intervalo: 1800, // taxa de atualização = 1,8 s
          msgFinal:
            'Essa é a vazão média final da bomba! A variação com relação à vazão inicial foi de -0,77%, o que está dentro da tolerância máxima de ±5%.',
          leituras: [
            ['1,9863', '1,986'],
            ['1,9889', '1,988'],
            ['2,0569', '2,011'],
            ['2,0158', '2,012'],
            ['1,9685', '2,003'],
            ['1,9756', '1,999'],
            ['2,0236', '2,002'],
            ['1,9756', '1,999'],
            ['1,9863', '1,998'],
            ['1,9769', '1,995'],
          ],
        },
      ],
    },
  ],

  /* ============================================================
   *  FINALIZAÇÃO
   * ============================================================ */
  fim: [
    /* ---------- Passo 28 (ilustrado) ---------- */
    {
      tipo: 'modal',
      img: CENARIO,
      textoBotao: 'OK',
      html: '<p style="text-align:center">Desligue os equipamentos, desmonte o sistema de coleta, tampe o amostrador representativo e guarde-o. Anote todos os dados de coleta em uma planilha e envie esses dados e os amostradores ao laboratório de análises químicas para que ele indique a concentração da substância química.</p>',
    },
    {
      tipo: 'modal',
      img: CENARIO,
      titulo: 'Finalização',
      textoBotao: 'OK',
      // No PDF desta situação a finalização tem só este parágrafo (sem a lista "Outros comentários").
      html: `
        <p>Você chegou ao final da coleta da substância química fumos de cobre. Agora, o laboratório analisará as amostras e enviará um documento com a concentração da substância na amostra.</p>`,
    },
  ],

  /* ============================================================
   *  MODAIS DO MENU
   * ============================================================ */
  parametros: {
    titulo: 'Parâmetros',
    itens: [
      'Tempo de jornada diária = 8 h (480 min).',
      'Substância a ser avaliada: fumos de cobre [CAS 7440-50-8].',
      'Tipo de limite de tolerância e valor: TLV-TWA de 0,2 mg/m³ (ACGIH 2026).',
      'Método de coleta: NIOSH 7303.',
      'Estabilidade da amostra: estável.',
      'Tipo de amostrador: cassete com filtro de éster de celulose.',
      'Faixa de volume de coleta: 15 a 500.000 litros.',
      'Faixa de vazão de coleta: 1 a 4 l/min.',
      'Volume escolhido: 960 litros.',
      'Vazão escolhida: 2 l/min.',
      'Tempo de uma amostra: 480 min.',
    ],
  },

  maisDetalhes: {
    titulo: 'Mais detalhes',
    html: `
      <p>Os fumos de cobre possuem um limite de tolerância do tipo média ponderada no tempo (TLV-TWA), portanto esta avaliação visa mensurar a concentração média à qual o trabalhador fica exposto durante sua jornada. Considere que não há dados que possam caracterizar um ciclo de trabalho bem definido para esse empregado e, nesse caso, foi considerado avaliar sua jornada completa de trabalho (480 min). Para cobrir toda a jornada de trabalho, pode ser necessário um ou mais amostradores. Neste exemplo, optou-se por um amostrador, com vazão e volume definidos dentro das faixas estabelecidas pelo método NIOSH 7303, resultando em um tempo total de 480 minutos. Dividindo o volume pela vazão escolhida, é possível confirmar que o tempo de uma amostra será de 480 minutos. Veja:</p>
      <div class="formula">
        <div>Tempo de uma amostra [min] = ${F('Volume de coleta [litro]', 'Vazão [l/min]')}</div>
        <div>= ${F('960 [litro]', '2 [l/min]')} = 480 min</div>
      </div>
      <p>Como o parâmetro de interesse é uma concentração média, é razoável supor que, em alguns momentos, a concentração no ambiente de trabalho pode ultrapassar o limite de tolerância, o que é tolerado até certo valor e com certas condições. O limite TLV-TWA é oriundo da ACGIH e para os fumos de cobre não há TLV-STEL ou TLV-C. Assim, a ACGIH estabelece a seguinte regra geral para exposições de pico:</p>
      <ul>
        <li>A concentração não deve exceder a 3 vezes o valor do TLV-TWA por mais de 15 minutos.</li>
        <li>A concentração não deve exceder a 5 vezes o valor de TLV-TWA em uma janela de tempo de 15 minutos.</li>
      </ul>
      <!-- O nome da opção abaixo estava com fundo amarelo no PDF; foi mantido para a frase fazer sentido. -->
      <p>A condução dessas avaliações, em especial para a janela de 15 minutos, pode ser realizada de forma semelhante à apresentada na opção “Avaliar exposição à substância com TLV-STEL”.</p>
      <p>Quando o laboratório retornar a concentração do amostrador, esse valor poderá ser comparado diretamente com o valor de TLV-TWA e com o nível de ação (metade do TLV-TWA), pois foi coletada uma única amostra que cobriu toda a jornada. Se várias amostras fossem empregadas, então seria necessário estimar a concentração média calculando uma média ponderada no tempo com os valores de concentração de cada amostra. Quando várias amostras são empregadas, o processo é o mesmo descrito para uma única amostra.</p>
      <p>Se a jornada de trabalho fosse maior que 8 horas por dia ou 40 horas por semana, o valor de TLV-TWA deveria ser redefinido de acordo com fatores de redução apropriados.</p>
      <p>Quando o trabalhador faz seu intervalo de refeição, deve-se pausar a coleta e retirar a montagem. A maioria das bombas de amostragem têm função de pausa.</p>`,
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
