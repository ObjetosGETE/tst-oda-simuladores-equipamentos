/**
 * ============================================================
 *  SITUAÇÃO 2.2 – Fumos de ferro / óxido de ferro (soldagem)
 *  Avaliar exposição à substância com LT-MPT ou TLV-TWA → Particulado com fração respirável
 * ============================================================
 *  Este arquivo contém SOMENTE conteúdo. Para criar outra situação,
 *  duplique este arquivo, altere textos/imagens/passos e troque o
 *  import em assets/js/main.js.
 *
 *  Textos: assets/referencias_textos/Decupagem Situação 2.2_rev.pdf
 *  (trechos com fundo amarelo foram ignorados).
 *
 *  Imagens:
 *    '07'                      -> assets/img/renders/07.png
 *    '46_1'                    -> assets/img/renders/46_1.png
 *    'cenario_introducao.png'  -> assets/img/cenario_introducao.png
 *    video: 'assets/video/x.mp4' -> vídeo no lugar da imagem de fundo
 *    caminho com '/'           -> usado como está
 *
 *  Renders (alguns são repetidos com outro número):
 *    01–03 caixa de isopor           04–09 cassete SRX 50897: girar a tampa e destacar a 3ª seção
 *    10–11 ciclone de alumínio       12–15 suporte do cassete e conector metálico
 *    16–19 tubo, bomba e adaptador   20–21 calibrador conectado (cena geral)
 *    24 retirada do representativo   25–36 mesmo processo com o cassete de coleta SRX 50898
 *    37 termo-higro-barômetro        39–47 desmontagem, embalagem e caixa de isopor
 *    (22, 38 e 54 são close-ups antigos – usamos renders/telas_equi; 48–53 não são usados)
 *
 *  Posições (x, y) sempre em % da tela (0–100).
 *  Estrutura de um passo: ver assets/js/core/Passo.js
 * ============================================================
 */

/* ---------- atalhos de posição (botões dos equipamentos) ---------- */
// Close-ups dos equipamentos (assets/img/renders/telas_equi – PNG com fundo transparente;
// "fundo" = render desfocado que aparece atrás)
const BOMBA_CLOSE = { img: 'renders/telas_equi/Bomba.png', fundo: '21' };
const AFERIDOR_CLOSE = { img: 'renders/telas_equi/Aferidor.png', fundo: '21' };
const TERMO_CLOSE = { img: 'renders/telas_equi/Termo_higro.png', fundo: '37' };

// Bomba (Bomba.png)
const B_CIMA = { x: 38, y: 81 };
const B_ASTER = { x: 50.5, y: 81 };
const B_BAIXO = { x: 63, y: 81 };
const B_COMBO = { x: 50.5, y: 70.5, combo: { largura: 25 } }; // ▲ + ▼ juntos

// Calibrador (Aferidor.png)
const C_ENTER = { x: 63.5, y: 48.5 };
const C_DIR = { x: 71, y: 48.5 };
const C_POWER = { x: 73.5, y: 61 };

// Cena geral com calibrador + bomba (render 21)
const CENA_CALIBRADOR = { x: 22, y: 45 };
const CENA_BOMBA = { x: 75, y: 55 };

// Cenário da introdução/finalização
const CENARIO = 'cenario_introducao.png';

// Cena do trabalhador: sem e com os equipamentos (assets/img/personagem_*.png)
const TRAB = 'personagem_sem.png';
const TRAB_COM = 'personagem_com.png';
const CINTURA = { x: 42, y: 80 }; // bomba na cintura (personagem_com.png)
const PEITO = { x: 47.5, y: 35 }; // amostrador no peitoral – zona respiratória (por fora da máscara)
const PAINEL_BOMBA = { x: 10.5, y: 79 };
const PAINEL_AMOSTRADOR = { x: 22.8, y: 79 };

/* ---------- telas do visor ---------- */
const bomba = (d) => ({ tipo: 'bomba', ...d });
const calib = (d) => ({ tipo: 'calibrador', ...d });

// ▼ uma vez por clique no ajuste de tempo da bomba (de -> ate, descendo)
const descerTempo = (de, ate) =>
  Array.from({ length: de - ate }, (_, i) => ({
    ...BOMBA_CLOSE,
    lcd: bomba({ titulo: 'AJUSTE DE TEMPO', valor: String(de - i), unidade: 'min' }),
    hs: B_BAIXO,
  }));

// Cassete: girar a tampa (renders em sequência) e destacar a 3ª seção
const girarTampa = (renders, ultimo) => [
  ...renders.map((img, i) => (i === 0 ? { img, hs: { x: 50, y: 34 } } : { img, auto: 280 })), // tampa
  { img: ultimo, hs: { x: 50, y: 58 } }, // parte inferior (3ª seção)
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
        'Existem outras formas de avaliar agentes químicos dispersos no ar ambiente além do uso de bombas de amostragem e amostradores. Todos os métodos e equipamentos disponíveis apresentam vantagens e desvantagens. Este simulador foi construído considerando os limites de tolerância preventivos válidos para o ano de 2025.',
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
        <p>As atividades de solda expõem os trabalhadores a uma série de fumos metálicos, gases e, eventualmente, vapores. Nesta etapa, você avaliará a exposição de um soldador a fumos de ferro (óxido de ferro).</p>
        <p>O óxido de ferro [CAS 1309-37-1] tem um limite do tipo TLV-TWA de 5 mg/m³, referente à fração respirável do agente.</p>`,
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
        { img: '01', hs: { x: 45, y: 45 } }, // tampa da caixa
        { img: '02', hs: { x: 50, y: 44 } }, // cassetes dentro da caixa
        {
          img: '03',
          infoPosicao: 'rodape',
          info: 'Considere os seguintes amostradores e suas funções:<br><b>SRX 50897</b> – Amostrador representativo usado para ajuste da vazão<br><b>SRX 50898</b> – Amostrador usado para coleta',
        },
      ],
    },

    /* ---------- Passo 2 ---------- */
    {
      instrucao:
        'Retire a tampa da conexão superior (saída de ar) do amostrador representativo e destaque a parte inferior do cassete (terceira seção).',
      quadros: [...girarTampa(['04', '05', '06', '07'], '08'), { img: '09' }],
    },

    /* ---------- Passo 3 ---------- */
    // O texto do PDF neste passo repete o de outra situação ("Conecte o tubo flexível...");
    // usado o texto dos passos 16 e 27, que descreve a mesma ação (ver LEIAME).
    {
      instrucao: 'Conecte o ciclone de alumínio no cassete na parte em que a seção foi destacada.',
      quadros: [
        { img: '10', hs: { x: 65, y: 50 } }, // ciclone
        { img: '11' },
      ],
    },

    /* ---------- Passo 4 ---------- */
    {
      instrucao: 'Fixe a montagem no suporte do cassete.',
      aviso: 'Garanta que a entrada de ar no ciclone fique para a frente.',
      avisoNoFinal: true,
      quadros: [
        { img: '12', hs: { x: 69, y: 44 } }, // cassete + ciclone
        { img: '12', hs: { x: 49, y: 55 } }, // suporte do cassete
        { img: '13' },
      ],
    },

    /* ---------- Passo 5 ---------- */
    {
      instrucao: 'Conecte o conector metálico na saída de ar do cassete.',
      quadros: [
        { img: '14', hs: { x: 57, y: 67 } }, // conector metálico
        { img: '15' },
      ],
    },

    /* ---------- Passo 6 ---------- */
    {
      instrucao: 'Conecte a extremidade do tubo flexível à entrada da bomba de amostragem.',
      quadros: [
        { img: '16', hs: { x: 53, y: 56 } }, // ponta do tubo
        { img: '16', hs: { x: 74, y: 17 }, instrucaoPosicao: 'rodape' }, // entrada de ar da bomba
        { img: '17' },
      ],
    },

    /* ---------- Passo 7 ---------- */
    {
      instrucao: 'Conecte o adaptador de calibração ao ciclone.',
      quadros: [
        { img: '18', hs: { x: 23, y: 52 } }, // adaptador de calibração
        { img: '18', hs: { x: 33, y: 67 } }, // entrada do ciclone
        { img: '19' },
      ],
    },

    /* ---------- Passo 8 ---------- */
    {
      instrucao: 'Conecte a extremidade do tubo à porta de sucção do calibrador de vazão.',
      quadros: [
        { img: '20', hs: { x: 91, y: 61 } }, // ponta do tubo
        { img: '20', hs: { x: 33, y: 29 } }, // porta de sucção do calibrador
        { img: '21' }, // conjunto cassete + ciclone na vertical durante a calibração
      ],
    },

    /* ---------- Passo 9 ---------- */
    {
      instrucao: 'Ligue a bomba pressionando o botão por meio segundo.',
      quadros: [
        { img: '21', hs: CENA_BOMBA },
        // segurar 0,5 s no botão ✱ para ligar
        { ...BOMBA_CLOSE, lcd: bomba({ bateria: false }), hs: { ...B_ASTER, segurar: 500 } },
        { ...BOMBA_CLOSE, lcd: bomba({}), auto: 700, ok: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ valor: 'On', centro: true }), auto: 1000, ok: B_ASTER },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '500', unidade: 'min', pausa: true }),
          marcas: [B_ASTER],
        },
      ],
    },

    /* ---------- Passo 10 ---------- */
    // A bomba fica na tela de configuração (será usada no passo 12).
    {
      instrucao: 'Acesse a configuração da bomba e ajuste o tempo para 480 min.',
      quadros: [
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '500', unidade: 'min', pausa: true }), hs: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '500', unidade: 'min', pausa: true }), hs: B_CIMA },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '500', unidade: 'min', pausa: true }), hs: B_BAIXO },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '500', unidade: 'min', pausa: true }), hs: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ valor: 'CLr', centro: true }), hs: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ valor: '- -', centro: true, legenda: 'AJUSTAR VAZÃO' }), hs: B_ASTER },
        ...descerTempo(500, 480), // ▼ vinte vezes: 500 -> 480 min
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'AJUSTE DE TEMPO', valor: '480', unidade: 'min' }) },
      ],
    },

    /* ---------- Passo 11 ---------- */
    {
      instrucao: 'Ligue o calibrador/aferidor de vazão, acesse a função MEDIR e depois selecione a opção ÚNICA.',
      quadros: [
        { img: '21', hs: CENA_CALIBRADOR },
        { ...AFERIDOR_CLOSE, hs: C_POWER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'inicio' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'ÚNICA' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', opcoes: ['UNICA', 'SAIR'] }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', vazao: '2,4869', media: '2,4869', contador: '01 de 01' }) },
      ],
    },

    /* ---------- Passo 12 ---------- */
    // Da tela AJUSTE DE TEMPO, o ✱ passa por ATRASO e volta para a vazão (traços centrais).
    {
      instrucao: 'Volte para a tela de configuração da vazão da bomba. Ajuste a vazão para <b style="color:#e5461d">2,5 l/min</b>.',
      quadros: [
        { img: '21', hs: CENA_BOMBA },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'AJUSTE DE TEMPO', valor: '480', unidade: 'min' }), hs: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'AJUSTE DE ATRASO', valor: '0', unidade: 'min' }), hs: B_ASTER },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ valor: '- -', centro: true, legenda: 'AJUSTAR VAZÃO' }),
          tipo: 'ajuste',
          valores: ['2,4989', '2,4869', '2,4756', '2,4614'],
          inicio: 1,
          alvo: 0,
          media: '2,4869',
          msgAjustar: 'Aumente a vazão.',
          msgSucesso:
            'Você ajustou a vazão para um valor próximo ao desejado. Agora, avance para a função de medição de vazão sequencial.',
          botoes: { aumentar: { x: 76, y: 63 }, diminuir: { x: 90, y: 63 } }, // na ordem das teclas ▲ ▼
          rotulos: { diminuir: '▼ Diminuir<br>Vazão', aumentar: '▲ Aumentar<br>Vazão' },
          visor: 'lateral', // visor do calibrador menor, à direita (a bomba ocupa o centro)
        },
      ],
    },

    /* ---------- Passo 13 ---------- */
    {
      instrucao: 'Acesse a função de medição de vazão sequencial e realize um conjunto de 10 leituras.',
      quadros: [
        { img: '21', hs: CENA_CALIBRADOR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', vazao: '2,4989', media: '2,4869', contador: '01 de 010', sel: 'PAUSA' }), hs: C_DIR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', vazao: '2,4989', media: '2,4869', contador: '01 de 010', sel: 'SAIR' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'ÚNICA' }), hs: C_DIR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'CONT.' }), hs: C_DIR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'SEQUENCIAL' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', opcoes: ['SEQUENCIAL', 'SAIR'] }), hs: C_ENTER },
        {
          ...AFERIDOR_CLOSE,
          tipo: 'leituras',
          intervalo: 1500, // taxa de atualização = 1,5 s
          msgFinal: 'Essa é a vazão média da bomba!',
          leituras: [
            ['2,5063', '2,506'],
            ['2,4933', '2,500'],
            ['2,4896', '2,496'],
            ['2,5020', '2,498'],
            ['2,5021', '2,499'],
            ['2,4987', '2,499'],
            ['2,4846', '2,497'],
            ['2,5012', '2,497'],
            ['2,5014', '2,498'],
            ['2,4967', '2,498'],
          ],
        },
      ],
    },

    /* ---------- Passo 14 ---------- */
    {
      instrucao: `Na tela da bomba, desligue o aferidor de vazão pressionando simultaneamente os botões ${T('▼')} e ${T('▲')}. Retire o amostrador representativo e tampe suas extremidades.`,
      quadros: [
        { img: '21', hs: CENA_BOMBA },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'OPERANDO TEMPO RESTANTE', valor: '480', unidade: 'min' }), hs: B_COMBO },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '480', unidade: 'min', pausa: true }), auto: 1500 },
        { img: '21', hs: { x: 45, y: 62 } }, // conjunto cassete + ciclone
        { img: '24' },
      ],
    },

    /* ---------- Passo 15 ---------- */
    {
      instrucao:
        'Retire a tampa da conexão superior (saída de ar) do amostrador de coleta e destaque a parte inferior do cassete (terceira seção).',
      quadros: [...girarTampa(['25', '26', '27', '28'], '29'), { img: '30' }],
    },

    /* ---------- Passo 16 ---------- */
    {
      instrucao: 'Conecte o ciclone de alumínio no cassete na parte em que a seção foi destacada.',
      quadros: [
        { img: '31', hs: { x: 65, y: 42 } }, // ciclone
        { img: '32' },
      ],
    },

    /* ---------- Passo 17 ---------- */
    {
      instrucao: 'Fixe a montagem no suporte do cassete.',
      quadros: [
        { img: '33', hs: { x: 34, y: 45 } }, // cassete + ciclone
        { img: '33', hs: { x: 57, y: 50 } }, // suporte do cassete
        { img: '34' },
      ],
    },

    /* ---------- Passo 18 ---------- */
    {
      instrucao: 'Conecte o conector metálico na saída de ar do cassete.',
      quadros: [
        { img: '35', hs: { x: 44, y: 58 } }, // conector metálico
        { img: '36' },
      ],
    },

    /* ---------- Passo 19 ---------- */
    {
      instrucao:
        'Fixe a bomba de amostragem na cintura do trabalhador e posicione o amostrador, especificamente o ponto de ingresso de ar, na zona respiratória do empregado.',
      aviso:
        'Para soldadores, a máscara atua reduzindo a exposição do trabalhador, embora essa não seja a sua finalidade principal. Sempre que possível, a amostragem deve ser realizada internamente à máscara de solda, exceto quando o equipamento for um sistema de proteção respiratória alimentado por uma linha de ar. Para a montagem com ciclone e cassete, é pouco provável que você consiga incluir o conjunto dentro da máscara. Na simulação, ela foi colocada por fora. Amostradores respiráveis do tipo PPI (parallel particle impactor) podem ser utilizados para alocação dentro da máscara.',
      avisoNoFinal: true,
      quadros: [
        { img: TRAB, painel: ['bomba', 'amostrador'], hs: PAINEL_BOMBA },
        { img: TRAB, painel: [null, 'amostrador'], hs: CINTURA },
        { img: TRAB, painel: [null, 'amostrador'], marcas: [CINTURA], hs: PAINEL_AMOSTRADOR },
        { img: TRAB, painel: [null, null], marcas: [CINTURA], hs: PEITO },
        { img: TRAB_COM },
      ],
    },

    /* ---------- Passo 20 ---------- */
    {
      instrucao: 'Na tela da bomba, inicie a operação.',
      quadros: [
        { img: TRAB_COM, hs: CINTURA },
        { ...BOMBA_CLOSE, fundo: TRAB_COM, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '480', unidade: 'min', pausa: true }), hs: B_COMBO },
        { ...BOMBA_CLOSE, fundo: TRAB_COM, lcd: bomba({ titulo: 'OPERANDO TEMPO RESTANTE', valor: '480', unidade: 'min' }) },
      ],
    },

    /* ---------- Passo 21 ---------- */
    {
      instrucao:
        'Ligue o termo-higro-barômetro. Aguarde as leituras estabilizarem e meça a temperatura, a umidade relativa e a pressão atmosférica. Anote os valores.',
      quadros: [
        { img: '37', hs: { x: 45, y: 60 } },
        { ...TERMO_CLOSE, hs: { x: 38.5, y: 74 } },
        { ...TERMO_CLOSE, lcd: { tipo: 'termo', texto: 'LIGANDO...' }, auto: 1500 },
        { ...TERMO_CLOSE, lcd: { tipo: 'termo', temp: '28.4', umid: '65.9', press: '999.2' } },
      ],
    },

    /* ---------- Passo 22 ---------- */
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

    /* ---------- Passo 23 ---------- */
    {
      instrucao:
        'Ligue o termo-higro-barômetro. Aguarde as leituras estabilizarem e meça a temperatura, a umidade relativa e a pressão atmosférica. Anote os valores.',
      quadros: [
        { img: '37', hs: { x: 45, y: 60 } },
        { ...TERMO_CLOSE, hs: { x: 38.5, y: 74 } },
        { ...TERMO_CLOSE, lcd: { tipo: 'termo', texto: 'LIGANDO...' }, auto: 1500 },
        { ...TERMO_CLOSE, lcd: { tipo: 'termo', temp: '30.5', umid: '52.7', press: '1000.2' } },
      ],
    },

    /* ---------- Passo 24 ---------- */
    {
      instrucao: 'Agora que o tempo de avaliação foi concluído, retire o conjunto do empregado.',
      aviso:
        'Não gire o ciclone, pois o material depositado no sistema de coleta de rejeitos pode ser lançado para dentro do amostrador. Se necessário, desconecte o sistema de coleta e limpe-o antes de desmontar o restante do sistema.',
      avisoNoFinal: true,
      quadros: [
        { img: TRAB_COM, painel: [null, null], hs: PEITO },
        { img: TRAB, painel: [null, 'amostrador'], hs: CINTURA },
        { img: TRAB, painel: ['bomba', 'amostrador'] },
      ],
    },

    /* ---------- Passo 25 ---------- */
    {
      instrucao:
        'Retire o amostrador de coleta, desconecte o ciclone, insira a terceira seção de volta, tampe a extremidade do amostrador e insira-o na caixa de isopor.',
      quadros: [
        { img: '36', hs: { x: 30, y: 48 } }, // retira o conjunto do suporte
        { img: '39', hs: { x: 55, y: 50 } }, // desconecta o ciclone
        { img: '40', hs: { x: 66, y: 40 } }, // terceira seção de volta
        { img: '41', auto: 280 }, // tampa girando
        { img: '42', auto: 280 },
        { img: '43', auto: 280 },
        { img: '44', auto: 280 },
        { img: '45', hs: { x: 50, y: 40 } }, // amostrador tampado
        { img: '46', hs: { x: 66, y: 47 } }, // leva até a caixa
        { img: '46_1', hs: { x: 30, y: 62 } }, // fecha a tampa
        { img: '46_2', auto: 1200 },
        { img: '47' }, // a bomba fica assim
      ],
    },

    /* ---------- Passo 26 ---------- */
    {
      instrucao: 'No amostrador representativo novamente, retire a tampa de proteção da saída de ar e destaque a terceira seção.',
      quadros: [...girarTampa(['04', '05', '06', '07'], '08'), { img: '09' }],
    },

    /* ---------- Passo 27 ---------- */
    {
      instrucao: 'Conecte o ciclone de alumínio no cassete na parte em que a seção foi destacada.',
      quadros: [
        { img: '10', hs: { x: 65, y: 50 } },
        { img: '11' },
      ],
    },

    /* ---------- Passo 28 ---------- */
    {
      instrucao: 'Fixe a montagem no suporte do cassete.',
      quadros: [
        { img: '12', hs: { x: 69, y: 44 } },
        { img: '12', hs: { x: 49, y: 55 } },
        { img: '13' },
      ],
    },

    /* ---------- Passo 29 ---------- */
    {
      instrucao: 'Conecte o conector metálico na saída de ar do cassete.',
      quadros: [
        { img: '14', hs: { x: 57, y: 67 } },
        { img: '15', auto: 1000 },
        { img: '17' }, // a outra extremidade já está ligada à bomba
      ],
    },

    /* ---------- Passo 30 ---------- */
    {
      instrucao: 'Conecte o adaptador de calibração ao ciclone.',
      quadros: [
        { img: '18', hs: { x: 23, y: 52 } },
        { img: '18', hs: { x: 33, y: 67 } },
        { img: '19' },
      ],
    },

    /* ---------- Passo 31 ---------- */
    {
      instrucao: 'Conecte a extremidade do tubo à porta de sucção do calibrador de vazão.',
      quadros: [
        { img: '20', hs: { x: 91, y: 61 } },
        { img: '20', hs: { x: 33, y: 29 } },
        { img: '21' },
      ],
    },

    /* ---------- Passo 32 ---------- */
    {
      instrucao: 'Ligue o aferidor de vazão. Navegue até a função MEDIR e depois selecione a função SEQUENCIAL.',
      quadros: [
        { img: '21', hs: CENA_CALIBRADOR },
        { ...AFERIDOR_CLOSE, hs: C_POWER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'inicio' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'ÚNICA' }), hs: C_DIR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'CONT.' }), hs: C_DIR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'SEQUENCIAL' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', opcoes: ['SEQUENCIAL', 'SAIR'] }) },
      ],
    },

    /* ---------- Passo 33 (no PDF aparece como um segundo "Passo 32") ---------- */
    {
      instrucao: `Na tela da bomba, pressione duas vezes simultaneamente os botões ${T('▲')} e ${T('▼')}.`,
      quadros: [
        { img: '21', hs: CENA_BOMBA },
        // tela inicial: tempo decorrido (contagem terminou)
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '0', unidade: 'min' }), hs: B_COMBO },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '480', unidade: 'min', pausa: true }), hs: B_COMBO },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'OPERANDO TEMPO RESTANTE', valor: '480', unidade: 'min' }), auto: 1500 },
        {
          ...AFERIDOR_CLOSE,
          tipo: 'leituras',
          intervalo: 1500, // taxa de atualização = 1,5 s
          msgFinal:
            'Essa é a vazão média final da bomba! A variação com relação à vazão inicial foi de 0,05%, o que está dentro da tolerância máxima de ±5%.',
          leituras: [
            ['2,4865', '2,487'],
            ['2,5026', '2,495'],
            ['2,4987', '2,496'],
            ['2,4825', '2,493'],
            ['2,5060', '2,495'],
            ['2,5103', '2,498'],
            ['2,4969', '2,498'],
            ['2,5048', '2,499'],
            ['2,5019', '2,499'],
            ['2,5015', '2,499'],
          ],
        },
      ],
    },
  ],

  /* ============================================================
   *  FINALIZAÇÃO
   * ============================================================ */
  fim: [
    /* ---------- Passo final (ilustrado) ---------- */
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
      // O PDF diz "fumos de cobre" aqui; o restante da situação é sobre fumos de ferro (ver LEIAME).
      html: `
        <p>Você chegou ao final da coleta da substância química fumos de ferro. Agora, o laboratório analisará as amostras e enviará um documento com a concentração da substância na amostra.</p>
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
    titulo: 'Parâmetros',
    itens: [
      'Tempo de jornada diária = 8 h (480 min).',
      'Substância a ser avaliada: fumos de ferro (óxido de ferro) [CAS 1309-37-1].',
      'Tipo de limite de tolerância e valor: TLV-TWA de 5 mg/m³ – respirável (ACGIH 2026).',
      'Método de coleta: NIOSH 7303.',
      'Estabilidade da amostra: estável.',
      'Tipo de amostrador: cassete com filtro de éster de celulose e ciclone.',
      'Faixa de volume de coleta: 1 a 5.000 litros.',
      'Faixa de vazão de coleta: 1 a 4 l/min.',
      'Vazão escolhida: 2,5 l/min (fixa pelo uso de ciclone de alumínio).',
      'Volume escolhido: 1.200 litros.',
      'Tempo de uma amostra: 480 min.',
    ],
  },

  maisDetalhes: {
    titulo: 'Mais detalhes',
    html: `
      <p>Os fumos de ferro possuem um limite de tolerância do tipo média ponderada no tempo (TLV-TWA), portanto esta avaliação visa mensurar a concentração média à qual o trabalhador fica exposto durante sua jornada. Considere que não há dados que possam caracterizar um ciclo de trabalho bem definido para esse empregado e, nesse caso, foi considerado avaliar a jornada completa do empregado (480 minutos). Para cobrir toda a jornada de trabalho, pode ser necessário um ou mais amostradores. Neste exemplo, optou-se por um amostrador, com um volume de 1.200 litros. A vazão é fixa devido ao uso de ciclone de alumínio, ressaltando que outros modelos de ciclone podem operar com vazões diferentes. O ciclone é um elemento separador de partículas empregado na avaliação de particulados com limites envolvendo fração respirável. O volume e a vazão estão definidos dentro da faixa estabelecida pelo método NIOSH 7303. O tempo de uma amostra pode ser calculado como:</p>
      <div class="formula">
        <div>Tempo de uma amostra [min] = ${F('Volume de coleta [litro]', 'Vazão [l/min]')}</div>
        <div>= ${F('1.200 [litro]', '2,5 [l/min]')} = 480 min</div>
      </div>
      <p>Como o parâmetro de interesse é uma concentração média, é razoável supor que, em alguns momentos, a concentração no ambiente de trabalho pode ultrapassar o limite de tolerância, o que é tolerado até certo valor e com certas condições. O limite TLV-TWA é oriundo da ACGIH e para essa substância não há TLV-STEL ou TLV-C. Assim, a ACGIH estabelece a seguinte regra geral para exposições de pico:</p>
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
