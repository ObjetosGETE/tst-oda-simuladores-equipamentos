/**
 * Quizzes ("Teste seu conhecimento")
 * Conteúdo transcrito de assets/quiz/*.md. Cada situação em data.js aponta
 * para um quiz pelo campo "quiz" (ex.: quiz: "vmb").
 *
 * Formato de cada pergunta:
 *   { text: "Enunciado", options: ["A", "B", "C"], correct: <índice da correta, a partir de 0> }
 */

export const quizzes = {
  // assets/quiz/quiz-vmb.md — Vibrações, Situação 1 (Mãos e Braços)
  vmb: {
    title: "Vibração em Mãos e Braços (VMB)",
    questions: [
      {
        text: "Na montagem do sensor para avaliação de VMB, qual é o posicionamento correto do acelerômetro?",
        options: [
          "O eixo X deve ficar voltado para a ferramenta, com o cabo direcionado para a frente do equipamento.",
          "O eixo X deve ficar posicionado de modo que o cabo esteja direcionado para o braço do trabalhador, evitando interferência nos movimentos.",
          "O posicionamento do sensor é indiferente, desde que esteja fixado ao acessório.",
        ],
        correct: 1,
      },
      {
        text: "Qual é o objetivo de fixar corretamente o acelerômetro na mão do trabalhador?",
        options: [
          "Facilitar a retirada do sensor ao final da avaliação.",
          "Permitir que a vibração transmitida pela ferramenta seja medida adequadamente.",
          "Evitar o aquecimento do sensor durante a medição.",
        ],
        correct: 1,
      },
      {
        text: "Por que o acelerômetro deve ser instalado utilizando o adaptador apropriado?",
        options: [
          "Para aumentar a autonomia da bateria do equipamento.",
          "Para garantir a fixação correta do sensor durante a medição.",
          "Para permitir a comunicação com o software.",
        ],
        correct: 1,
      },
      {
        text: "Após concluir a avaliação de vibração em mãos e braços (VMB), em que momento os resultados ficam disponíveis?",
        options: [
          "Imediatamente na tela inicial do medidor, sem necessidade de outras etapas.",
          "Após a extração dos dados para o software do equipamento, onde as informações são processadas e apresentadas.",
          "Após desligar e ligar novamente o equipamento.",
        ],
        correct: 1,
      },
    ],
  },

  // assets/quiz/quiz-vci.md — Vibrações, Situação 2 (Corpo Inteiro)
  vci: {
    title: "Vibração de Corpo Inteiro (VCI)",
    questions: [
      {
        text: "Na avaliação de vibração de corpo inteiro (VCI), onde o acelerômetro deve ser posicionado?",
        options: [
          "Na mão do operador da máquina.",
          "No banco do motorista da máquina.",
          "No volante da máquina.",
        ],
        correct: 1,
      },
      {
        text: "Ao posicionar o sensor de VCI, como deve estar orientado o eixo X?",
        options: [
          "Voltado para a porta da cabine.",
          "Voltado para o painel de instrumentos.",
          "Voltado para o volante do motorista ou para as costas do operador.",
        ],
        correct: 2,
      },
      {
        text: "Após finalizar a medição de VCI, quando os resultados são disponibilizados ao usuário?",
        options: [
          "Imediatamente após pressionar o botão Stop.",
          "Após a extração dos dados para o software do equipamento.",
          "Após desligar e ligar novamente o equipamento.",
        ],
        correct: 1,
      },
    ],
  },

  // assets/quiz/quiz-quimicos.md — Químico, o mesmo quiz em todas as situações
  quimicos: {
    title: "Agentes Químicos",
    questions: [
      {
        text: "Sobre a calibração da bomba de amostragem:",
        options: [
          "Antes da avaliação, é realizado o ajuste da vazão da bomba de amostragem com o auxílio do calibrador de vazão. Ao final da avaliação, o calibrador é usado para determinar a vazão final da bomba de amostragem, sem que ocorra ajuste na vazão.",
          "Antes e após da avaliação o calibrador de vazão é usado para ajustar a vazão da bomba de amostragem para o valor desejado.",
          "A tolerância máxima para a variação da vazão da bomba de amostragem é de ±10%. A variação percentual é calculada com base na vazão inicial e na vazão final.",
        ],
        correct: 0,
      },
      {
        text: "Sobre os amostradores é correto afirmar:",
        options: [
          "O amostrador representativo e o amostrador de coleta possuem funções diferentes na avaliação.",
          "Amostrador representativo é outro termo para fazer referência ao amostrador de coleta, já que ele (amostrador representativo) é usado para coletar o contaminante do ar.",
          "A escolha do amostrador é função do avaliador.",
        ],
        correct: 0,
      },
      {
        text: "Sobre a posição do sistema de coleta é correto afirmar:",
        options: [
          "O amostrador deve ser posicionado na zona respiratória do empregado avaliado.",
          "O amostrador e a bomba devem ser posicionados em tripé no centro do ambiente de trabalho de tal modo que o amostrador fique posicionado a 1,5m de altura do piso.",
          "O amostrador deve ser posicionado o mais próximo possível da fonte do contaminante.",
        ],
        correct: 0,
      },
    ],
  },
};
