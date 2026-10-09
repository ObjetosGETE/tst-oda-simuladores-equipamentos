/**
 * ============================================================
 *  SITUAÇÃO 2.3 – Fumos de níquel (soldagem)
 *  Avaliar exposição à substância com LT-MPT ou TLV-TWA → Particulado com fração inalável
 * ============================================================
 *  Este arquivo contém SOMENTE conteúdo. Para criar outra situação,
 *  duplique este arquivo, altere textos/imagens/passos e troque o
 *  import em assets/js/main.js.
 *
 *  Textos: assets/referencias_textos/Decupagem Situação 2.3_rev.pdf
 *  (trechos com fundo amarelo foram ignorados).
 *
 *  Imagens:
 *    '07'                      -> assets/img/renders/07.png
 *    '14_1'                    -> assets/img/renders/14_1.png
 *    'cenario_introducao.png'  -> assets/img/cenario_introducao.png
 *    video: 'assets/video/x.mp4' -> vídeo no lugar da imagem de fundo
 *    caminho com '/'           -> usado como está
 *
 *  Renders (alguns são repetidos com outro número):
 *    01–04 caixa de isopor e amostradores IOM     05–07 retirada do suporte e da tampa
 *    08–11 montagem no suporte para coleta        12–13 tubo flexível + bomba
 *    14 / 18 / 30 bomba com o amostrador de volta no suporte
 *    14_1–14_4 adaptador de calibração (parafuso) e calibrador
 *    20 termo-higro-barômetro                     23–25 amostrador voltando ao suporte
 *    26–29 embalagem plástica e caixa de isopor
 *    (15/17/19/32, 16/31 e 21 são close-ups antigos – usamos renders/telas_equi)
 *
 *  Posições (x, y) sempre em % da tela (0–100).
 *  Estrutura de um passo: ver assets/js/core/Passo.js
 * ============================================================
 */

/* ---------- atalhos de posição (botões dos equipamentos) ---------- */
// Close-ups dos equipamentos (assets/img/renders/telas_equi – PNG com fundo transparente;
// "fundo" = render desfocado que aparece atrás)
const BOMBA_CLOSE = { img: 'renders/telas_equi/Bomba.png', fundo: '14_4' };
const AFERIDOR_CLOSE = { img: 'renders/telas_equi/Aferidor.png', fundo: '14_4' };
const TERMO_CLOSE = { img: 'renders/telas_equi/Termo_higro.png', fundo: '20' };

// Bomba (Bomba.png)
const B_CIMA = { x: 38, y: 81 };
const B_ASTER = { x: 50.5, y: 81 };
const B_BAIXO = { x: 63, y: 81 };
const B_COMBO = { x: 50.5, y: 70.5, combo: { largura: 25 } }; // ▲ + ▼ juntos

// Calibrador (Aferidor.png)
const C_ENTER = { x: 63.5, y: 48.5 };
const C_DIR = { x: 71, y: 48.5 };
const C_POWER = { x: 73.5, y: 61 };

// Cena geral com calibrador + bomba (render 14_4)
const CENA_CALIBRADOR = { x: 24, y: 55 };
const CENA_BOMBA = { x: 80, y: 49 };

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
        <p>As atividades de solda expõem os trabalhadores a uma série de fumos metálicos, gases e, eventualmente, vapores. Nesta etapa, você avaliará a exposição de um soldador a fumos de níquel (compostos inorgânicos insolúveis).</p>
        <p>O níquel [CAS 7440-02-0] tem um limite do tipo TLV-TWA de 0,2 mg/m³, referente à fração inalável do agente.</p>`,
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
        { img: '02', hs: { x: 45, y: 42 } }, // embalagem dentro da caixa
        { img: '03', hs: { x: 72, y: 56 } }, // embalagem fora da caixa
        {
          img: '04',
          infoPosicao: 'rodape',
          info: 'Considere os seguintes amostradores e suas funções:<br><b>SRX 2550</b> – Amostrador representativo usado para ajuste da vazão<br><b>SRX 2551</b> – Amostrador usado para coleta',
        },
      ],
    },

    /* ---------- Passo 2 ---------- */
    {
      instrucao: 'Retire o amostrador representativo do suporte e também sua tampa de proteção.',
      quadros: [
        { img: '05', hs: { x: 50, y: 30 } }, // suporte vermelho
        { img: '06', hs: { x: 43, y: 46 } }, // tampa de proteção
        { img: '07' },
      ],
    },

    /* ---------- Passo 3 ---------- */
    {
      instrucao: 'Monte o amostrador no suporte para coleta.',
      quadros: [
        { img: '08', hs: { x: 30, y: 55 } }, // abre o suporte (anel)
        { img: '09', hs: { x: 61, y: 21 }, instrucaoPosicao: 'rodape' }, // amostrador
        { img: '10', hs: { x: 52, y: 57 } }, // fecha com o anel
        { img: '11' },
      ],
    },

    /* ---------- Passo 4 ---------- */
    {
      instrucao: 'Conecte um tubo flexível no suporte para coleta e ligue a outra extremidade da mangueira à entrada de ar da bomba.',
      quadros: [
        { img: '12', hs: { x: 14, y: 86 } }, // ponta do tubo
        { img: '12', hs: { x: 74, y: 14 }, instrucaoPosicao: 'rodape' }, // entrada de ar da bomba
        { img: '13' },
      ],
    },

    /* ---------- Passo 5 ---------- */
    {
      instrucao:
        'Insira o suporte do amostrador no adaptador para calibração e conecte a extremidade do tubo flexível à entrada de sucção do calibrador.',
      quadros: [
        { img: '14_1', hs: { x: 49, y: 80 } }, // adaptador para calibração
        { img: '14_2', hs: { x: 66, y: 69 } }, // parafuso: apertar para fixar
        { img: '14_3', hs: { x: 38, y: 38 } }, // entrada de sucção do calibrador
        { img: '14_4' },
      ],
    },

    /* ---------- Passo 6 ---------- */
    {
      instrucao: 'Ligue a bomba pressionando o botão por meio segundo.',
      quadros: [
        { img: '14_4', hs: CENA_BOMBA },
        // segurar 0,5 s no botão ✱ para ligar
        { ...BOMBA_CLOSE, lcd: bomba({ bateria: false }), hs: { ...B_ASTER, segurar: 500 } },
        { ...BOMBA_CLOSE, lcd: bomba({}), auto: 700, ok: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ valor: 'On', centro: true }), auto: 1000, ok: B_ASTER },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '475', unidade: 'min', pausa: true }),
          marcas: [B_ASTER],
        },
      ],
    },

    /* ---------- Passo 7 ---------- */
    // A bomba fica na tela de configuração (será usada no passo 9).
    {
      instrucao: 'Acesse a configuração da bomba e ajuste o tempo para 480 min.',
      quadros: [
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '475', unidade: 'min', pausa: true }), hs: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '475', unidade: 'min', pausa: true }), hs: B_CIMA },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '475', unidade: 'min', pausa: true }), hs: B_BAIXO },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '475', unidade: 'min', pausa: true }), hs: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ valor: 'CLr', centro: true }), hs: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ valor: '- -', centro: true, legenda: 'AJUSTAR VAZÃO' }), hs: B_ASTER },
        ...subirTempo(475, 480), // ▲ cinco vezes: 475 -> 480 min
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'AJUSTE DE TEMPO', valor: '480', unidade: 'min' }) },
      ],
    },

    /* ---------- Passo 8 ---------- */
    {
      instrucao: 'Ligue o calibrador/aferidor de vazão. Navegue até a função MEDIR e depois selecione a função ÚNICA.',
      quadros: [
        { img: '14_4', hs: CENA_CALIBRADOR },
        { ...AFERIDOR_CLOSE, hs: C_POWER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'inicio' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'ÚNICA' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', opcoes: ['UNICA', 'SAIR'] }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', vazao: '2,3960', media: '2,3960', contador: '01 de 01' }) },
      ],
    },

    /* ---------- Passo 9 ---------- */
    // Da tela AJUSTE DE TEMPO, o ✱ passa por ATRASO e volta para a vazão (traços centrais).
    {
      instrucao: 'Volte para a tela de configuração da vazão da bomba. Ajuste a vazão para <b style="color:#e5461d">2,0 l/min</b>.',
      quadros: [
        { img: '14_4', hs: CENA_BOMBA },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'AJUSTE DE TEMPO', valor: '480', unidade: 'min' }), hs: B_ASTER },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'AJUSTE DE ATRASO', valor: '0', unidade: 'min' }), hs: B_ASTER },
        {
          ...BOMBA_CLOSE,
          lcd: bomba({ valor: '- -', centro: true, legenda: 'AJUSTAR VAZÃO' }),
          tipo: 'ajuste',
          valores: ['2,5059', '2,4658', '2,3960', '2,2364', '2,1045', '2,0181'],
          inicio: 2,
          alvo: 5,
          media: '2,3960',
          msgAjustar: 'Diminua a vazão.',
          msgSucesso:
            'Você ajustou a vazão para um valor próximo ao desejado. Agora, avance para a função de medição de vazão sequencial.',
          botoes: { aumentar: { x: 76, y: 63 }, diminuir: { x: 90, y: 63 } }, // na ordem das teclas ▲ ▼
          rotulos: { diminuir: '▼ Diminuir<br>Vazão', aumentar: '▲ Aumentar<br>Vazão' },
          visor: 'lateral', // visor do calibrador menor, à direita (a bomba ocupa o centro)
        },
      ],
    },

    /* ---------- Passo 10 ---------- */
    {
      instrucao: 'Acesse a função de medição de vazão sequencial e realize um conjunto de 10 leituras.',
      quadros: [
        { img: '14_4', hs: CENA_CALIBRADOR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', vazao: '2,0181', media: '2,3960', contador: '01 de 010', sel: 'PAUSA' }), hs: C_DIR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', vazao: '2,0181', media: '2,3960', contador: '01 de 010', sel: 'SAIR' }), hs: C_ENTER },
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
            ['2,0690', '2,069'],
            ['2,0156', '2,042'],
            ['1,9986', '2,028'],
            ['1,9863', '2,017'],
            ['2,0135', '2,017'],
            ['1,9889', '2,012'],
            ['2,0126', '2,012'],
            ['2,0610', '2,018'],
            ['1,9963', '2,016'],
            ['1,9921', '2,013'],
          ],
        },
      ],
    },

    /* ---------- Passo 11 ---------- */
    {
      instrucao: `Na tela da bomba, desligue o aferidor de vazão pressionando simultaneamente os botões ${T('▼')} e ${T('▲')}. Retire o amostrador representativo e coloque-o de volta no suporte.`,
      quadros: [
        { img: '14_4', hs: CENA_BOMBA },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'OPERANDO TEMPO RESTANTE', valor: '457', unidade: 'min' }), hs: B_COMBO },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '457', unidade: 'min', pausa: true }), auto: 1500 },
        { img: '14_4', hs: { x: 57, y: 67 } }, // suporte no adaptador
        { img: '23', hs: { x: 25, y: 61 } }, // tampa de proteção
        { img: '24', hs: { x: 71, y: 50 } }, // suporte vermelho
        { img: '25', auto: 1200 },
        { img: '14' },
      ],
    },

    /* ---------- Passo 12 ---------- */
    {
      instrucao: 'Monte o amostrador de coleta SRX 2551 no suporte para coleta.',
      quadros: [
        { img: '08', hs: { x: 30, y: 55 } },
        { img: '09', hs: { x: 61, y: 21 }, instrucaoPosicao: 'rodape' },
        { img: '10', hs: { x: 52, y: 57 } },
        { img: '11', hs: { x: 29, y: 78 } }, // conecta o suporte ao tubo da bomba
        { img: '13' },
      ],
    },

    /* ---------- Passo 13 ---------- */
    {
      instrucao:
        'Fixe a bomba de amostragem na cintura do trabalhador e posicione o amostrador, especificamente o ponto de ingresso de ar, na zona respiratória do empregado.',
      aviso:
        'Para soldadores, a máscara atua reduzindo a exposição do trabalhador, embora essa não seja a sua finalidade principal. Sempre que possível, a amostragem deve ser realizada internamente à máscara de solda, exceto quando o equipamento for um sistema de proteção respiratória alimentado por uma linha de ar. Será necessário verificar em campo se é possível alocar o amostrador internamente.',
      avisoNoFinal: true,
      quadros: [
        { img: TRAB, painel: ['bomba', 'amostrador'], hs: PAINEL_BOMBA },
        { img: TRAB, painel: [null, 'amostrador'], hs: CINTURA },
        { img: TRAB, painel: [null, 'amostrador'], marcas: [CINTURA], hs: PAINEL_AMOSTRADOR },
        { img: TRAB, painel: [null, null], marcas: [CINTURA], hs: MASCARA },
        { img: TRAB_COM },
      ],
    },

    /* ---------- Passo 14 ---------- */
    {
      instrucao: 'Na tela da bomba, inicie a operação.',
      quadros: [
        { img: TRAB_COM, hs: CINTURA },
        { ...BOMBA_CLOSE, fundo: TRAB_COM, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '480', unidade: 'min', pausa: true }), hs: B_COMBO },
        { ...BOMBA_CLOSE, fundo: TRAB_COM, lcd: bomba({ titulo: 'OPERANDO TEMPO RESTANTE', valor: '480', unidade: 'min' }) },
      ],
    },

    /* ---------- Passo 15 ---------- */
    {
      instrucao:
        'Ligue o termo-higro-barômetro. Aguarde as leituras estabilizarem e meça a temperatura, a umidade relativa e a pressão atmosférica. Anote os valores.',
      quadros: [
        { img: '20', hs: { x: 45, y: 60 } },
        { ...TERMO_CLOSE, hs: { x: 38.5, y: 74 } },
        { ...TERMO_CLOSE, lcd: { tipo: 'termo', texto: 'LIGANDO...' }, auto: 1500 },
        { ...TERMO_CLOSE, lcd: { tipo: 'termo', temp: '28.4', umid: '69.9', press: '1002.2' } },
      ],
    },

    /* ---------- Passo 16 ---------- */
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

    /* ---------- Passo 17 ---------- */
    {
      instrucao:
        'Ligue o termo-higro-barômetro. Aguarde as leituras estabilizarem e meça a temperatura, a umidade relativa e a pressão atmosférica. Anote os valores.',
      quadros: [
        { img: '20', hs: { x: 45, y: 60 } },
        { ...TERMO_CLOSE, hs: { x: 38.5, y: 74 } },
        { ...TERMO_CLOSE, lcd: { tipo: 'termo', texto: 'LIGANDO...' }, auto: 1500 },
        { ...TERMO_CLOSE, lcd: { tipo: 'termo', temp: '31.6', umid: '50.1', press: '1007.3' } },
      ],
    },

    /* ---------- Passo 18 ---------- */
    {
      instrucao: 'Agora que o tempo de avaliação foi concluído, retire o conjunto do empregado.',
      quadros: [
        { img: TRAB_COM, painel: [null, null], hs: MASCARA },
        { img: TRAB, painel: [null, 'amostrador'], hs: CINTURA },
        { img: TRAB, painel: ['bomba', 'amostrador'] },
      ],
    },

    /* ---------- Passo 19 ---------- */
    {
      instrucao: 'Retire o amostrador IOM de dentro do suporte e guarde-o na embalagem plástica dentro da caixa de isopor.',
      quadros: [
        { img: '13', hs: { x: 50, y: 80 } }, // abre o suporte para coleta
        { img: '23', hs: { x: 25, y: 61 } }, // tampa de proteção
        { img: '24', hs: { x: 71, y: 50 } }, // suporte vermelho
        { img: '25', hs: { x: 50, y: 40 } }, // amostrador -> embalagem
        { img: '26', hs: { x: 50, y: 45 } }, // embalagem plástica
        { img: '27', hs: { x: 72, y: 56 } }, // leva até a caixa
        { img: '28', hs: { x: 25, y: 62 } }, // fecha a tampa
        { img: '29', auto: 1200 },
        { img: '30' }, // a bomba fica assim
      ],
    },

    /* ---------- Passo 20 ---------- */
    // Mesmas ações dos passos 2, 3 e 5, agora com o suporte já conectado à bomba.
    {
      instrucao: 'Agora, monte novamente o amostrador representativo no adaptador de calibração.',
      quadros: [
        { img: '30', hs: { x: 31, y: 56 } }, // amostrador representativo (no suporte vermelho)
        { img: '05', hs: { x: 50, y: 30 } },
        { img: '06', hs: { x: 43, y: 46 } },
        { img: '07', hs: { x: 46, y: 60 } },
        { img: '08', hs: { x: 30, y: 55 } },
        { img: '09', hs: { x: 61, y: 21 }, instrucaoPosicao: 'rodape' },
        { img: '10', hs: { x: 52, y: 57 } },
        { img: '11', hs: { x: 29, y: 78 } },
        { img: '14_1', hs: { x: 49, y: 80 } },
        { img: '14_2', hs: { x: 66, y: 69 } },
        { img: '14_3', hs: { x: 38, y: 38 } },
        { img: '14_4' },
      ],
    },

    /* ---------- Passo 21 ---------- */
    {
      instrucao: 'Ligue o aferidor de vazão. Navegue até a função MEDIR e depois selecione a função SEQUENCIAL.',
      quadros: [
        { img: '14_4', hs: CENA_CALIBRADOR },
        { ...AFERIDOR_CLOSE, hs: C_POWER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'inicio' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'ÚNICA' }), hs: C_DIR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'CONT.' }), hs: C_DIR },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'menu', sel: 'SEQUENCIAL' }), hs: C_ENTER },
        { ...AFERIDOR_CLOSE, lcd: calib({ tela: 'medicao', opcoes: ['SEQUENCIAL', 'SAIR'] }) },
      ],
    },

    /* ---------- Passo 22 ---------- */
    {
      instrucao: `Na tela da bomba, pressione duas vezes simultaneamente os botões ${T('▲')} e ${T('▼')}.`,
      quadros: [
        { img: '14_4', hs: CENA_BOMBA },
        // tela inicial: tempo decorrido (contagem terminou)
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '0', unidade: 'min' }), hs: B_COMBO },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'TEMPO RESTANTE', valor: '480', unidade: 'min', pausa: true }), hs: B_COMBO },
        { ...BOMBA_CLOSE, lcd: bomba({ titulo: 'OPERANDO TEMPO RESTANTE', valor: '480', unidade: 'min' }), auto: 1500 },
        {
          ...AFERIDOR_CLOSE,
          tipo: 'leituras',
          intervalo: 1800, // taxa de atualização = 1,8 s
          msgFinal:
            'Essa é a vazão média final da bomba! A variação com relação à vazão inicial foi de -0,57%, o que está dentro da tolerância máxima de ±5%.',
          leituras: [
            ['2,0210', '2,021'],
            ['1,9856', '2,003'],
            ['1,9965', '2,001'],
            ['2,0210', '2,006'],
            ['2,0136', '2,008'],
            ['1,9860', '2,004'],
            ['1,9963', '2,003'],
            ['1,9963', '2,002'],
            ['1,9886', '2,001'],
            ['2,0100', '2,001'],
          ],
        },
      ],
    },
  ],

  /* ============================================================
   *  FINALIZAÇÃO
   * ============================================================ */
  fim: [
    /* ---------- Passo 23 (ilustrado) ---------- */
    {
      tipo: 'modal',
      img: CENARIO,
      textoBotao: 'OK',
      html: '<p style="text-align:center">Desligue os equipamentos, desmonte o sistema de coleta e acondicione o amostrador representativo. Anote todos os dados de coleta em uma planilha e envie esses dados e os amostradores ao laboratório de análises químicas para que ele indique a concentração da substância química.</p>',
    },
    {
      tipo: 'modal',
      img: CENARIO,
      titulo: 'Finalização',
      textoBotao: 'OK',
      html: `
        <p>Você chegou ao final da coleta da substância química fumos de níquel. Agora, o laboratório analisará as amostras e enviará um documento com a concentração da substância na amostra.</p>
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
      'Substância a ser avaliada: fumos de níquel [7440-02-0].',
      'Tipo de limite de tolerância e valor: TLV-TWA de 0,2 mg/m³ – inalável (ACGIH 2026).',
      'Método de coleta: NIOSH 7303.',
      'Estabilidade da amostra: estável.',
      'Tipo de amostrador: cassete com filtro de éster de celulose e ciclone.',
      'Faixa de volume de coleta: 1 a 50.000 litros.',
      'Faixa de vazão de coleta: 1 a 4 l/min.',
      'Vazão escolhida: 2,0 l/min (fixa pelo uso de amostrador IOM).',
      'Volume escolhido: 960 litros.',
      'Tempo de uma amostra: 480 min.',
    ],
  },

  maisDetalhes: {
    titulo: 'Mais detalhes',
    html: `
      <p>Os fumos de níquel (compostos inorgânicos insolúveis) possuem um limite de tolerância do tipo média ponderada no tempo (TLV-TWA), portanto esta avaliação visa mensurar a concentração média à qual o trabalhador fica exposto durante sua jornada.</p>
      <p>Considere que não há dados que possam caracterizar um ciclo de trabalho bem definido para esse empregado e, nesse caso, foi considerado avaliar a jornada completa do empregado (480 min). Para cobrir toda a jornada de trabalho, pode ser necessário um ou mais amostradores. Neste exemplo, optou-se por um amostrador, com um volume de 960 litros. A vazão é fixa devido ao uso de um amostrador IOM. O IOM é um elemento separador de partículas empregado na avaliação de particulados com limites envolvendo fração inalável. O volume e a vazão estão definidos dentro da faixa estabelecida pelo método NIOSH 7303. O tempo de uma amostra pode ser calculado como:</p>
      <div class="formula">
        <div>Tempo de uma amostra [min] = ${F('Volume de coleta [litro]', 'Vazão [l/min]')}</div>
        <div>= ${F('960 [litro]', '2,0 [l/min]')} = 480 min</div>
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
