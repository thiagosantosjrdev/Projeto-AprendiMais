window.QUESTOES = {

  // ── MATEMÁTICA (fixo pra 2º EM) ───────────────────────────
  Matematica: [
    {
      id: "mat_001",
      tipo: "multipla",
      materia: "Matemática",
      enunciado: "Em uma PA, o primeiro termo é 3 e a razão é 5. Qual é o 6º termo?",
      alternativas: ["28", "30", "33", "23"],
      correta: 0,
      explicacao: "Em uma PA, o termo geral é aₙ = a₁ + (n-1)·r. Então a₆ = 3 + (6-1)·5 = 3 + 25 = 28.",
    },
    {
      id: "mat_002",
      tipo: "multipla",
      materia: "Matemática",
      enunciado: "Numa PG de razão 2, o primeiro termo é 4. Qual é o 5º termo?",
      alternativas: ["48", "64", "32", "16"],
      correta: 1,
      explicacao: "Em uma PG, aₙ = a₁ · qⁿ⁻¹. Então a₅ = 4 · 2⁴ = 4 · 16 = 64.",
    },
    {
      id: "mat_003",
      tipo: "multipla",
      materia: "Matemática",
      enunciado: "Qual é o valor de sen(30°)?",
      alternativas: ["√3/2", "1/2", "√2/2", "1"],
      correta: 1,
      explicacao: "O seno de 30° é um valor fundamental da trigonometria: sen(30°) = 1/2. Lembre-se do triângulo retângulo com ângulos 30°-60°-90°.",
    },
    {
      id: "mat_004",
      tipo: "dissertativa",
      materia: "Matemática",
      enunciado: "Uma loja oferece 20% de desconto em um produto que custa R$150. Qual o preço final? Explique como você calculou.",
      gabarito: "R$120,00. Calculando 20% de 150: 0,20 × 150 = 30. Subtraindo: 150 - 30 = 120.",
      explicacao: "Para calcular desconto, multiplique o valor pelo percentual (em decimal) e subtraia. 20% = 0,20. Então: 150 × 0,20 = 30 de desconto. Preço final: 150 - 30 = R$120,00.",
    },
    {
      id: "mat_005",
      tipo: "multipla",
      materia: "Matemática",
      enunciado: "Uma função é definida por f(x) = 2x² - 3x + 1. Qual é f(2)?",
      alternativas: ["3", "5", "7", "2"],
      correta: 0,
      explicacao: "Substituindo x=2: f(2) = 2·(2²) - 3·2 + 1 = 2·4 - 6 + 1 = 8 - 6 + 1 = 3.",
    },
    {
      id: "mat_006",
      tipo: "multipla",
      materia: "Matemática",
      enunciado: "Qual é a soma dos ângulos internos de um hexágono?",
      alternativas: ["540°", "720°", "900°", "360°"],
      correta: 1,
      explicacao: "A fórmula para soma dos ângulos internos é (n-2)·180°. Para hexágono (n=6): (6-2)·180° = 4·180° = 720°.",
    },
  ],

  // ── PORTUGUÊS (fixo pra 2º EM) ────────────────────────────
  Portugues: [
    {
      id: "port_001",
      tipo: "texto",
      materia: "Português",
      enunciado: `Leia o trecho abaixo e responda:\n\n"A educação é a arma mais poderosa que você pode usar para mudar o mundo. Ela não se limita às paredes de uma escola — ela acontece em cada conversa, em cada livro, em cada desafio superado."\n\nDe acordo com o texto, onde a educação acontece?`,
      alternativas: [
        "Apenas dentro das escolas",
        "Em conversas, livros e desafios superados",
        "Somente em universidades",
        "Exclusivamente em livros didáticos",
      ],
      correta: 1,
      explicacao: 'O texto diz claramente: "ela acontece em cada conversa, em cada livro, em cada desafio superado." A resposta está no próprio texto — basta ler com atenção!',
    },
    {
      id: "port_002",
      tipo: "multipla",
      materia: "Português",
      enunciado: "Qual é a classe gramatical da palavra 'rapidamente'?",
      alternativas: ["Adjetivo", "Substantivo", "Advérbio", "Verbo"],
      correta: 2,
      explicacao: "Palavras terminadas em '-mente' formadas a partir de adjetivos são advérbios de modo. 'Rapidamente' indica de que modo algo acontece.",
    },
    {
      id: "port_003",
      tipo: "texto",
      materia: "Português",
      enunciado: `Leia e responda:\n\n"Ele chegou cedo, mas mesmo assim perdeu a apresentação. O auditório estava cheio quando as portas se abriram, e todos queriam os melhores lugares."\n\nQual conjunção indica uma ideia de contraste no texto?`,
      alternativas: ["e", "quando", "mas", "mesmo assim"],
      correta: 2,
      explicacao: '"Mas" é uma conjunção adversativa — indica contraste ou oposição. No texto, contrasta "chegou cedo" com "perdeu a apresentação". "Mesmo assim" reforça essa ideia, mas não é conjunção.',
    },
    {
      id: "port_004",
      tipo: "dissertativa",
      materia: "Português",
      enunciado: "Reescreva a frase abaixo corrigindo os erros de concordância: 'Os aluno foram muito dedicados nas aula de hoje.'",
      gabarito: "Os alunos foram muito dedicados nas aulas de hoje.",
      explicacao: "Erros de concordância nominal: 'aluno' deve concordar com o artigo 'Os' (plural) → 'alunos'. 'aula' deve concordar com 'nas' (plural) → 'aulas'.",
    },
    {
      id: "port_005",
      tipo: "multipla",
      materia: "Português",
      enunciado: "Qual figura de linguagem está presente em: 'Meus olhos são dois rios'?",
      alternativas: ["Metonímia", "Metáfora", "Hipérbole", "Personificação"],
      correta: 1,
      explicacao: "É uma metáfora — comparação implícita (sem 'como') entre olhos e rios, criando uma imagem poética. Se fosse 'Meus olhos são como dois rios', seria símile/comparação.",
    },
  ],

  // ── TECNOLOGIA (interesse) ────────────────────────────────
  Tecnologia: [
    {
      id: "tec_001",
      tipo: "multipla",
      materia: "Tecnologia",
      enunciado: "O que é um algoritmo?",
      alternativas: [
        "Um tipo de computador",
        "Uma sequência de passos para resolver um problema",
        "Uma linguagem de programação",
        "Um vírus de computador",
      ],
      correta: 1,
      explicacao: "Um algoritmo é uma sequência lógica e finita de instruções para resolver um problema ou realizar uma tarefa. É a base de toda a programação!",
    },
    {
      id: "tec_002",
      tipo: "multipla",
      materia: "Tecnologia",
      enunciado: "O que significa 'HTML' na sigla usada para criar páginas web?",
      alternativas: [
        "HyperText Markup Language",
        "High Tech Modern Language",
        "HyperText Modern Links",
        "Home Tool Markup Language",
      ],
      correta: 0,
      explicacao: "HTML (HyperText Markup Language) é a linguagem de marcação usada para estruturar conteúdo na web. É a base de toda página que você acessa no navegador!",
    },
    {
      id: "tec_003",
      tipo: "multipla",
      materia: "Tecnologia",
      enunciado: "Qual das opções abaixo é um exemplo de inteligência artificial?",
      alternativas: [
        "Uma calculadora simples",
        "Um relógio digital",
        "Um assistente virtual como Siri ou Alexa",
        "Um pendrive",
      ],
      correta: 2,
      explicacao: "Assistentes virtuais como Siri e Alexa usam IA para entender linguagem natural, aprender com interações e tomar decisões. Calculadoras e relógios apenas executam operações fixas.",
    },
  ],

  // ── CIÊNCIAS (interesse) ──────────────────────────────────
  Ciencias: [
    {
      id: "cien_001",
      tipo: "multipla",
      materia: "Ciências",
      enunciado: "Qual gás é produzido pelas plantas durante a fotossíntese?",
      alternativas: ["Dióxido de carbono (CO₂)", "Nitrogênio (N₂)", "Oxigênio (O₂)", "Hidrogênio (H₂)"],
      correta: 2,
      explicacao: "Durante a fotossíntese, as plantas absorvem CO₂ e luz solar, e produzem glicose (energia) e O₂ (oxigênio) como subproduto. É por isso que as plantas são essenciais para a vida na Terra!",
    },
    {
      id: "cien_002",
      tipo: "multipla",
      materia: "Ciências",
      enunciado: "Qual é a unidade básica da vida?",
      alternativas: ["Átomo", "Molécula", "Célula", "Tecido"],
      correta: 2,
      explicacao: "A célula é a menor unidade estrutural e funcional dos seres vivos. Tudo que é considerado vivo é formado por pelo menos uma célula.",
    },
    {
      id: "cien_003",
      tipo: "multipla",
      materia: "Ciências",
      enunciado: "O que é o DNA?",
      alternativas: [
        "Uma proteína que dá energia às células",
        "A molécula que carrega as informações genéticas",
        "Um tipo de vírus",
        "Uma enzima digestiva",
      ],
      correta: 1,
      explicacao: "O DNA (Ácido Desoxirribonucleico) é a molécula que contém todas as instruções genéticas de um ser vivo — determina características como cor dos olhos, altura e muito mais.",
    },
  ],

  // ── ARTES (interesse) ─────────────────────────────────────
  Artes: [
    {
      id: "art_001",
      tipo: "multipla",
      materia: "Artes",
      enunciado: "Quais são as três cores primárias na pintura?",
      alternativas: [
        "Vermelho, verde e azul",
        "Amarelo, azul e vermelho",
        "Amarelo, verde e roxo",
        "Laranja, roxo e verde",
      ],
      correta: 1,
      explicacao: "Na pintura (modelo subtrativo), as cores primárias são amarelo, azul e vermelho. A partir delas, misturando duas a duas, obtemos as cores secundárias: laranja, verde e roxo.",
    },
    {
      id: "art_002",
      tipo: "multipla",
      materia: "Artes",
      enunciado: "Qual artista brasileiro é conhecido pela obra 'Abaporu'?",
      alternativas: ["Cândido Portinari", "Tarsila do Amaral", "Di Cavalcanti", "Anita Malfatti"],
      correta: 1,
      explicacao: "Abaporu (1928) é uma das obras mais famosas da arte brasileira, criada por Tarsila do Amaral. A palavra 'abaporu' significa 'homem que come gente' em tupi-guarani.",
    },
  ],

  // ── ESPORTES (interesse) ──────────────────────────────────
  Esportes: [
    {
      id: "esp_001",
      tipo: "multipla",
      materia: "Esportes",
      enunciado: "Quantos jogadores formam um time de futebol em campo?",
      alternativas: ["9", "10", "11", "12"],
      correta: 2,
      explicacao: "Um time de futebol é composto por 11 jogadores em campo, incluindo o goleiro. Essa regra é estabelecida pela FIFA e vale para todas as competições oficiais.",
    },
    {
      id: "esp_002",
      tipo: "multipla",
      materia: "Esportes",
      enunciado: "Qual é o princípio físico que explica por que uma bola curva no ar?",
      alternativas: ["Lei de Newton", "Efeito Magnus", "Princípio de Arquimedes", "Lei de Boyle"],
      correta: 1,
      explicacao: "O Efeito Magnus explica a trajetória curva de bolas em rotação. Quando a bola gira, cria diferença de pressão nos lados — um lado com mais pressão empurra a bola para o lado de menor pressão.",
    },
  ],

  // ── JOGOS (interesse) ─────────────────────────────────────
  Jogos: [
    {
      id: "jog_001",
      tipo: "multipla",
      materia: "Jogos",
      enunciado: "Em jogos de estratégia, o que é 'teoria dos jogos'?",
      alternativas: [
        "Um estudo sobre design de games",
        "A matemática das decisões estratégicas entre jogadores",
        "Um tipo de programação para criar jogos",
        "Uma regra do xadrez",
      ],
      correta: 1,
      explicacao: "A teoria dos jogos é um campo da matemática que estuda decisões estratégicas — como agir quando o resultado depende das escolhas dos outros. É usada em economia, política e sim, em jogos!",
    },
  ],

  // ── LEITURA (interesse) ───────────────────────────────────
  Leitura: [
    {
      id: "leit_001",
      tipo: "texto",
      materia: "Leitura",
      enunciado: `Leia e responda:\n\n"Ler é voar sem sair do lugar. É conhecer mundos que nunca existiram e pessoas que jamais vão morrer. Um livro aberto é uma janela para o infinito."\n\nQual é a ideia central do texto?`,
      alternativas: [
        "A leitura é uma atividade física cansativa",
        "Os livros existem apenas no mundo real",
        "A leitura expande o conhecimento e a imaginação",
        "Só é possível conhecer o mundo viajando",
      ],
      correta: 2,
      explicacao: 'O texto usa metáforas como "voar", "conhecer mundos" e "janela para o infinito" para expressar que a leitura expande nossa mente e imaginação. A ideia central está nas metáforas positivas usadas.',
    },
  ],
};

// ── Engine: seleciona questões do dia ─────────────────────────
window.selecionarQuestoesDia = function(usuario) {
  const hoje        = new Date().toDateString();
  const chave       = `aprendimais_questoes_${usuario.id}_${hoje}`;
  const salvas      = localStorage.getItem(chave);
  if (salvas) {
    try {
      const parsed = JSON.parse(salvas);
      const valido = parsed.length > 0 && parsed.every(q => q && q.enunciado && (q.alternativas?.length > 0 || q.tipo === "dissertativa"));
      if (valido) return parsed;
    } catch(e) {}
    localStorage.removeItem(chave);
  }

  const interesses  = usuario.interesses || [];
  const selecionadas = [];
  const usados      = new Set();

  function pegar(pool) {
    const disponiveis = pool.filter(q => !usados.has(q.id));
    if (!disponiveis.length) return null;
    const q = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    usados.add(q.id);
    return q;
  }

  // 1 questão de Matemática (sempre)
  const qMat = pegar(window.QUESTOES.Matematica);
  if (qMat) selecionadas.push(qMat);

  // 1 questão de Português (sempre)
  const qPort = pegar(window.QUESTOES.Portugues);
  if (qPort) selecionadas.push(qPort);

  // 1 questão do interesse do aluno (aleatório entre os interesses dele)
  const interessesComQuestoes = interesses.filter(i => window.QUESTOES[i]?.length);
  if (interessesComQuestoes.length) {
    const interesse = interessesComQuestoes[Math.floor(Math.random() * interessesComQuestoes.length)];
    const qInt = pegar(window.QUESTOES[interesse]);
    if (qInt) selecionadas.push(qInt);
  }

  localStorage.setItem(chave, JSON.stringify(selecionadas));
  return selecionadas;
};
