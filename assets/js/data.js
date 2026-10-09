/**
 * Simulator Database
 * This file contains the content structures for introductions,
 * environmental risk categories, equipment specifications, and simulator situations.
 */

export const intros = [
  "Neste material, você simulará o uso de equipamentos de monitoramento de riscos ambientais.<br><br> Selecione o tipo de risco, o equipamento e o ambiente onde realizará a medição. Siga o tutorial para configurar e posicionar corretamente o equipamento.<br><br> Ao final, o equipamento apresentará os resultados do monitoramento realizado.",
];

/**
 * Situações da categoria Químico — as mesmas para todos os equipamentos.
 * Cada uma abre, na própria página, o simulador da pasta
 * assets/simuladores/<simulador>/index.html
 */
const SITUACOES_QUIMICO = [
  {
    number: "1",
    title: "Pico de exposição – LT‑MPT/TLV‑TWA",
    subTitle: "Gás ou vapor",
    simulador: "oda_quimico_1",
  },
  {
    number: "2",
    title: "Exposição – LT‑MPT/TLV‑TWA",
    subTitle: "Gás ou vapor",
    simulador: "oda_quimico_2",
  },
  {
    number: "2.1",
    title: "Exposição – LT‑MPT/TLV‑TWA",
    subTitle: "Particulado sem fração",
    simulador: "oda_quimico_2_1",
  },
  {
    number: "2.2",
    title: "Exposição – LT‑MPT/TLV‑TWA",
    subTitle: "Particulado – fração respirável",
    simulador: "oda_quimico_2_2",
  },
  {
    number: "2.3",
    title: "Exposição – LT‑MPT/TLV‑TWA",
    subTitle: "Particulado – fração inalável",
    simulador: "oda_quimico_2_3",
  },
  {
    number: "4",
    title: "Exposição – TLV‑STEL",
    subTitle: "Gás ou vapor",
    simulador: "oda_quimico_4",
  },
  {
    number: "5",
    title: "Exposição – LT‑VT/TLV‑C",
    subTitle: "Gás ou vapor",
    simulador: "oda_quimico_5",
  },
];

export const categories = [
  // {
  //   id: "ruido",
  //   title: "Ruído",
  //   icon: "ruido", // Matches standard icon rendering
  //   equipments: [
  //     {
  //       id: "decibelimetro",
  //       name: "Decibelímetro",
  //       description:
  //         "Equipamento utilizado para realizar medições instantâneas do nível de pressão sonora (ruído) em tempo real, permitindo avaliar picos de ruído e mapear níveis acústicos em ambientes industriais.",
  //       image: "assets/img/decibelimetro.png",
  //       iconSvg: `<svg viewBox="0 0 100 100" class="equip-svg">
  //         <!-- Decibelimeter body -->
  //         <rect x="35" y="30" width="30" height="55" rx="5" fill="#2c3e50" stroke="#f37021" stroke-width="2"/>
  //         <rect x="40" y="35" width="20" height="20" fill="#ecf0f1" rx="2"/>
  //         <!-- Screen details -->
  //         <rect x="42" y="38" width="16" height="8" fill="#34495e"/>
  //         <text x="50" y="44" fill="#2ecc71" font-size="5" text-anchor="middle" font-family="monospace">85.4 dB</text>
  //         <!-- Buttons -->
  //         <circle cx="45" cy="63" r="3" fill="#e74c3c"/>
  //         <circle cx="55" cy="63" r="3" fill="#3498db"/>
  //         <circle cx="50" cy="72" r="3" fill="#f1c40f"/>
  //         <!-- Microphone stem and wind screen -->
  //         <line x1="50" y1="30" x2="50" y2="15" stroke="#bdc3c7" stroke-width="4"/>
  //         <circle cx="50" cy="12" r="8" fill="#7f8c8d"/>
  //       </svg>`,
  //       situations: [
  //         {
  //           number: 1,
  //           title: "Medição de Ruído de Impacto",
  //           subTitle: "Prensa Industrial",
  //         },
  //         {
  //           number: 2,
  //           title: "Avaliação Preliminar",
  //           subTitle: "Mapeamento Acústico da Oficina",
  //         },
  //       ],
  //     },
  //     {
  //       id: "dosimetro",
  //       name: "Dosímetro de Ruído",
  //       description:
  //         "Dispositivo de uso pessoal fixado ao trabalhador para registrar a dose acumulada de exposição ao ruído ao longo de sua jornada de trabalho, em conformidade com as normas vigentes (NR-15 e NHO-01).",
  //       image: "assets/img/dosimetro.png",
  //       iconSvg: `<svg viewBox="0 0 100 100" class="equip-svg">
  //         <!-- Dosimeter body -->
  //         <rect x="38" y="40" width="24" height="40" rx="4" fill="#34495e" stroke="#f37021" stroke-width="2"/>
  //         <rect x="42" y="44" width="16" height="12" fill="#ecf0f1" rx="1"/>
  //         <text x="50" y="52" fill="#2c3e50" font-size="6" text-anchor="middle" font-weight="bold">92%</text>
  //         <!-- Small microphone with cord -->
  //         <path d="M 50,40 C 50,25 30,25 30,15" fill="none" stroke="#7f8c8d" stroke-width="2"/>
  //         <circle cx="30" cy="12" r="4" fill="#2c3e50"/>
  //         <!-- Clip -->
  //         <rect x="44" y="80" width="12" height="6" fill="#7f8c8d"/>
  //       </svg>`,
  //       situations: [
  //         {
  //           number: 1,
  //           title: "Dosimetria Diária",
  //           subTitle: "Operador de Caldeira",
  //         },
  //         {
  //           number: 2,
  //           title: "Dosimetria em Turno",
  //           subTitle: "Motorista de Caminhão",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "calor",
  //   title: "Calor",
  //   icon: "calor",
  //   equipments: [
  //     {
  //       id: "ibutg",
  //       name: "IBUTG",
  //       model: "ibutg",
  //       description:
  //         "Equipamento utilizado para avaliação da exposição ocupacional ao calor. Mede o Índice de Bulbo Úmido Termômetro de Globo, composto por termômetro de bulbo úmido natural, termômetro de globo e termômetro de bulbo seco.",
  //       image: "assets/img/ibutg.png",
  //       iconSvg: `<svg viewBox="0 0 100 100" class="equip-svg">
  //         <!-- Tripod base -->
  //         <line x1="50" y1="85" x2="30" y2="100" stroke="#7f8c8d" stroke-width="3"/>
  //         <line x1="50" y1="85" x2="70" y2="100" stroke="#7f8c8d" stroke-width="3"/>
  //         <line x1="50" y1="85" x2="50" y2="100" stroke="#7f8c8d" stroke-width="3"/>

  //         <!-- Central stand -->
  //         <line x1="50" y1="85" x2="50" y2="50" stroke="#95a5a6" stroke-width="4"/>

  //         <!-- Instrument main block -->
  //         <rect x="35" y="50" width="30" height="20" rx="3" fill="#2c3e50" stroke="#f37021" stroke-width="2"/>
  //         <rect x="42" y="54" width="16" height="8" fill="#34495e"/>
  //         <text x="50" y="60" fill="#2ecc71" font-size="5" text-anchor="middle" font-family="monospace">28.7°C</text>

  //         <!-- Thermometer 1 (Wet bulb natural) -->
  //         <line x1="42" y1="50" x2="42" y2="28" stroke="#7f8c8d" stroke-width="2"/>
  //         <rect x="41" y="44" width="2" height="6" fill="#3498db"/>

  //         <!-- Thermometer 2 (Globe - black sphere) -->
  //         <line x1="50" y1="50" x2="50" y2="35" stroke="#7f8c8d" stroke-width="2"/>
  //         <circle cx="50" cy="23" r="12" fill="#111111"/>

  //         <!-- Thermometer 3 (Dry bulb) -->
  //         <line x1="58" y1="50" x2="58" y2="32" stroke="#7f8c8d" stroke-width="2"/>
  //         <rect x="57" y="44" width="2" height="6" fill="#e74c3c"/>
  //       </svg>`,
  //       situations: [
  //         {
  //           number: 1,
  //           title: "Situação 1",
  //           subTitle: "(“título” da situação 1)",
  //         },
  //         {
  //           number: 2,
  //           title: "Situação 2",
  //           subTitle: "(“título” da situação 2)",
  //         },
  //         {
  //           number: 3,
  //           title: "Situação 3",
  //           subTitle: "(“título” da situação 3)",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "iluminancia",
  //   title: "Iluminancia",
  //   icon: "iluminancia",
  //   equipments: [
  //     {
  //       id: "luximetro",
  //       name: "Luxímetro",
  //       description:
  //         "Equipamento fotométrico empregado para medir a iluminância de um ambiente de trabalho (em lux), garantindo níveis adequados de iluminação de acordo com a norma de higiene ocupacional NHO-11.",
  //       image: "assets/img/luximetro.png",
  //       iconSvg: `<svg viewBox="0 0 100 100" class="equip-svg">
  //         <!-- Luxmeter main body -->
  //         <rect x="42" y="45" width="26" height="40" rx="4" fill="#34495e" stroke="#f37021" stroke-width="2"/>
  //         <rect x="46" y="50" width="18" height="12" fill="#ecf0f1" rx="1"/>
  //         <text x="55" y="59" fill="#2c3e50" font-size="7" text-anchor="middle" font-weight="bold" font-family="monospace">500 lx</text>
  //         <!-- Buttons -->
  //         <circle cx="50" cy="70" r="3" fill="#e74c3c"/>
  //         <circle cx="60" cy="70" r="3" fill="#2ecc71"/>
  //         <!-- Photocell sensor and cable -->
  //         <path d="M 55,45 Q 40,35 30,35" fill="none" stroke="#7f8c8d" stroke-width="2.5"/>
  //         <circle cx="28" cy="30" r="10" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="2"/>
  //         <circle cx="28" cy="30" r="6" fill="#ffffff"/>
  //       </svg>`,
  //       situations: [
  //         {
  //           number: 1,
  //           title: "Medição de Iluminância Geral",
  //           subTitle: "Escritório Administrativo",
  //         },
  //         {
  //           number: 2,
  //           title: "Medição no Posto de Trabalho",
  //           subTitle: "Área de Montagem de Precisão",
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    id: "vibracao",
    title: "Vibração",
    icon: "vibracao",
    equipments: [
      {
        id: "medidor_vibracao",
        name: "Medidor de Vibração Ocupacional",
        model: "acelerometro",
        description:
          "Aparelho portátil configurado para medir a vibração de corpo inteiro (VCI) ou de mãos e braços (VMB) transmitida por máquinas e ferramentas aos colaboradores.",
        image: "assets/img/equipamentos/medidor_vibracao.webp",
        situations: [
          {
            number: 1,
            title: "Mãos e Braços (VMB)",
            subTitle: "Operação de roçadeira",
            simulador: "oda_vibracoes_1",
          },
          {
            number: 2,
            title: "Corpo Inteiro (VCI)",
            subTitle: "Operação de pá carregadeira",
            simulador: "oda_vibracoes_2",
          },
        ],
      },
    ],
  },
  // {
  //   id: "multigases",
  //   title: "Multigases",
  //   icon: "multigases",
  //   equipments: [
  //     {
  //       id: "detector_multigas",
  //       name: "Detector Multigás",
  //       description:
  //         "Equipamento essencial de segurança para monitoramento simultâneo de gases perigosos (como O2, CO, H2S e gases inflamáveis LEL) em ambientes confinados ou áreas de processo.",
  //       image: "assets/img/detector_multigas.png",
  //       iconSvg: `<svg viewBox="0 0 100 100" class="equip-svg">
  //         <!-- Heavy duty casing -->
  //         <rect x="36" y="30" width="28" height="50" rx="6" fill="#f1c40f" stroke="#2c3e50" stroke-width="2"/>
  //         <!-- Screen -->
  //         <rect x="41" y="35" width="18" height="15" fill="#2c3e50"/>
  //         <text x="43" y="41" fill="#2ecc71" font-size="4" font-family="monospace">O2: 20.9%</text>
  //         <text x="43" y="47" fill="#2ecc71" font-size="4" font-family="monospace">CO: 0ppm</text>
  //         <!-- Sensor grills -->
  //         <circle cx="43" cy="60" r="4" fill="#7f8c8d" stroke="#34495e" stroke-width="1"/>
  //         <circle cx="57" cy="60" r="4" fill="#7f8c8d" stroke="#34495e" stroke-width="1"/>
  //         <circle cx="50" cy="70" r="4" fill="#7f8c8d" stroke="#34495e" stroke-width="1"/>
  //         <!-- Alarm LEDs -->
  //         <rect x="38" y="27" width="6" height="3" fill="#e74c3c" rx="1"/>
  //         <rect x="56" y="27" width="6" height="3" fill="#e74c3c" rx="1"/>
  //       </svg>`,
  //       situations: [
  //         {
  //           number: 1,
  //           title: "Espaço Confinado",
  //           subTitle: "Entrada em Galeria Subterrânea",
  //         },
  //         {
  //           number: 2,
  //           title: "Inspeção de Vazamento",
  //           subTitle: "Linha de Tubulação de Gás",
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    id: "quimico",
    title: "Químico",
    icon: "quimico",
    equipments: [
      {
        id: "bomba_amostragem",
        name: "Bomba de Amostragem Individual",
        model: "bomba_amostragem",
        description:
          "Equipamento calibrado para aspirar um fluxo constante de ar através de um meio de coleta (filtros, cassetes ou tubos adsorventes) para posterior análise química dos contaminantes dispersos no ar.",
        image: "assets/img/equipamentos/bomba_amostragem.webp",
        situations: SITUACOES_QUIMICO,
      },
      {
        id: "aferidor_vazao",
        name: "Aferidor de Vazão",
        model: "aferidor_vazao",
        description:
          "Dispositivo de precisão utilizado para aferir e calibrar a vazão das bombas de amostragem de ar antes e após as coletas, assegurando a exatidão do volume de ar amostrado.",
        image: "assets/img/equipamentos/aferidor_vazao.webp",
        situations: SITUACOES_QUIMICO,
      },
      {
        id: "termo_higro",
        name: "Termo-Higrômetro",
        model: "termo_higro",
        description:
          "Instrumento destinado à medição simultânea da temperatura e umidade relativa do ar no ambiente amostrado, variáveis essenciais para a correção e registro das condições de amostragem química.",
        image: "assets/img/equipamentos/termo_higro.webp",
        situations: SITUACOES_QUIMICO,
      },
    ],
  },
];
