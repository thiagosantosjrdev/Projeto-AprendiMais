// ============================================================
//  Aprendi+ | aluno-ia.js
//  Recomendações personalizadas offline — baseadas no perfil
//  Depende de: Database.js
// ============================================================

const ICONES_TIPO = {
  video:     "bi-play-btn",
  texto:     "bi-file-earmark-text",
  exercicio: "bi-pencil-square",
  podcast:   "bi-headphones",
  livro:     "bi-book",
  jogo:      "bi-controller",
  artigo:    "bi-newspaper",
  pratica:   "bi-lightning",
  mapa:      "bi-diagram-3",
  resumo:    "bi-clipboard-check",
};

// ── Banco de recomendações por interesse/objetivo/método ──────
const BANCO = {
  Tecnologia: [
    { titulo: "Lógica de programação do zero",      descricao: "Aprenda a pensar como um dev",          tipo: "video"     },
    { titulo: "Como a internet realmente funciona", descricao: "DNS, HTTP e servidores explicados",      tipo: "artigo"    },
    { titulo: "Desafios de algoritmos iniciantes",  descricao: "Pratique com exercícios reais",          tipo: "exercicio" },
    { titulo: "Inteligência Artificial explicada",  descricao: "IA de forma simples e visual",           tipo: "video"     },
    { titulo: "Robótica e eletrônica básica",       descricao: "Monte seu primeiro circuito",            tipo: "pratica"   },
  ],
  Ciencias: [
    { titulo: "O universo em escala",               descricao: "Do átomo ao cosmos em minutos",          tipo: "video"     },
    { titulo: "Química do cotidiano",               descricao: "Reações que acontecem na sua casa",      tipo: "artigo"    },
    { titulo: "Biologia celular visual",            descricao: "Entenda a célula de forma interativa",   tipo: "mapa"      },
    { titulo: "Física quântica para iniciantes",    descricao: "Conceitos incríveis sem fórmulas",       tipo: "video"     },
    { titulo: "Experimentos científicos em casa",   descricao: "Ciência prática com materiais simples",  tipo: "pratica"   },
  ],
  Artes: [
    { titulo: "Fundamentos do desenho",             descricao: "Perspectiva, sombra e proporção",        tipo: "video"     },
    { titulo: "História da arte moderna",           descricao: "Do impressionismo ao contemporâneo",     tipo: "artigo"    },
    { titulo: "Como desenvolver seu estilo visual", descricao: "Técnicas para criar sua identidade",     tipo: "texto"     },
    { titulo: "Fotografia para iniciantes",         descricao: "Composição e luz sem equipamento caro",  tipo: "video"     },
    { titulo: "Design gráfico gratuito",            descricao: "Ferramentas e princípios básicos",       tipo: "pratica"   },
  ],
  Esportes: [
    { titulo: "Ciência por trás do esporte",        descricao: "Física e biologia no alto rendimento",   tipo: "artigo"    },
    { titulo: "Nutrição esportiva essencial",        descricao: "O que comer antes e depois do treino",   tipo: "texto"     },
    { titulo: "Treinamento funcional em casa",      descricao: "Rotina completa sem academia",           tipo: "video"     },
    { titulo: "Psicologia do atleta",               descricao: "Foco, motivação e resiliência",          tipo: "podcast"   },
    { titulo: "Biomecânica do movimento",           descricao: "Como o corpo se move e por quê",         tipo: "artigo"    },
  ],
  Jogos: [
    { titulo: "Como jogos são desenvolvidos",       descricao: "Bastidores da indústria gamer",          tipo: "video"     },
    { titulo: "Game design para iniciantes",        descricao: "Crie seu primeiro jogo simples",         tipo: "pratica"   },
    { titulo: "Matemática nos jogos de estratégia", descricao: "Probabilidade e teoria dos jogos",       tipo: "artigo"    },
    { titulo: "História dos videogames",            descricao: "Do Atari ao metaverso",                  tipo: "texto"     },
    { titulo: "Lógica com puzzles e enigmas",       descricao: "Raciocínio lógico de forma divertida",   tipo: "jogo"      },
  ],
  Leitura: [
    { titulo: "Técnicas de leitura rápida",         descricao: "Leia mais em menos tempo",               tipo: "texto"     },
    { titulo: "Como fazer boas anotações",          descricao: "Método Cornell e mapas mentais",         tipo: "resumo"    },
    { titulo: "Clássicos da literatura brasileira", descricao: "Obras essenciais e resumos críticos",    tipo: "livro"     },
    { titulo: "Interpretação de texto avançada",    descricao: "Estratégias para questões de vestibular",tipo: "exercicio" },
    { titulo: "Filosofia através dos textos",       descricao: "Grandes ideias em linguagem acessível",  tipo: "livro"     },
  ],
};

const BANCO_OBJETIVO = {
  "Melhorar meu desempenho escolar": [
    { titulo: "Técnica Pomodoro para estudar",      descricao: "Concentração máxima em blocos de tempo", tipo: "texto"     },
    { titulo: "Como organizar sua rotina de estudos",descricao: "Planejamento semanal que realmente funciona", tipo: "resumo" },
    { titulo: "Mapas mentais para memorizar mais",  descricao: "Técnica visual de alto desempenho",      tipo: "mapa"      },
  ],
  "Criar rotina de estudos": [
    { titulo: "Hábitos de estudo dos melhores alunos", descricao: "O que eles fazem de diferente",       tipo: "artigo"    },
    { titulo: "Planejamento semanal com metas",     descricao: "Como definir e cumprir objetivos",       tipo: "texto"     },
    { titulo: "Aplicativos gratuitos para estudar", descricao: "As melhores ferramentas digitais",       tipo: "pratica"   },
  ],
  "Aprender algo novo": [
    { titulo: "Como aprender qualquer coisa rápido",descricao: "O método de aprendizado acelerado",      tipo: "video"     },
    { titulo: "Aprendizagem ativa vs passiva",      descricao: "Por que fazer > assistir",               tipo: "artigo"    },
    { titulo: "Cursos gratuitos online",            descricao: "As melhores plataformas para estudar",   tipo: "texto"     },
  ],
  "Explorar novos temas": [
    { titulo: "Interdisciplinaridade na prática",   descricao: "Como áreas diferentes se conectam",      tipo: "artigo"    },
    { titulo: "TED Talks mais assistidos",          descricao: "Ideias que vão expandir sua visão",      tipo: "video"     },
    { titulo: "Curiosidades científicas incríveis", descricao: "Fatos que vão te surpreender",           tipo: "podcast"   },
  ],
};

const BANCO_METODO = {
  videos: [
    { titulo: "YouTube como ferramenta de estudo",  descricao: "Como usar playlists educativas",         tipo: "texto"     },
    { titulo: "Canais educativos imperdíveis",       descricao: "Os melhores criadores de conteúdo",     tipo: "video"     },
  ],
  textos: [
    { titulo: "Leitura analítica para estudantes",  descricao: "Extraia o máximo de cada texto",         tipo: "texto"     },
    { titulo: "Artigos científicos simplificados",  descricao: "Como ler e entender papers",             tipo: "artigo"    },
  ],
};

// ── Engine de recomendação ────────────────────────────────────
function gerarRecomendacoes() {
  const usuario = DB.Sessao.atual();
  if (!usuario) return;

  const btn = document.getElementById("btnRefreshIA");
  btn?.classList.add("girando");

  // Pequeno delay pra dar a sensação de "processando"
  setTimeout(() => {
    const selecionadas = _selecionarRecomendacoes(usuario);
    renderRecomendacoes(selecionadas);
    btn?.classList.remove("girando");
  }, 800);
}

function _selecionarRecomendacoes(usuario) {
  const pool = [];
  const usados = new Set();

  function adicionar(lista) {
    for (const item of lista) {
      if (!usados.has(item.titulo) && pool.length < 10) {
        pool.push(item);
        usados.add(item.titulo);
      }
    }
  }

  // 1. Baseado nos interesses (pega 1-2 por interesse)
  const interesses = usuario.interesses || [];
  for (const interesse of interesses) {
    const lista = BANCO[interesse] || [];
    // Embaralha e pega os primeiros
    const embaralhada = [...lista].sort(() => Math.random() - 0.5);
    adicionar(embaralhada.slice(0, 2));
    if (pool.length >= 6) break;
  }

  // 2. Baseado no objetivo
  const porObjetivo = BANCO_OBJETIVO[usuario.objetivo] || [];
  adicionar([...porObjetivo].sort(() => Math.random() - 0.5));

  // 3. Baseado no método de aprendizado
  const porMetodo = BANCO_METODO[usuario.metodoAprender] || [];
  adicionar([...porMetodo].sort(() => Math.random() - 0.5));

  // Embaralha o pool final e retorna 3
  return pool.sort(() => Math.random() - 0.5).slice(0, 3);
}

function renderRecomendacoes(lista) {
  const conteudo = document.getElementById("iaConteudo");
  if (!conteudo) return;

  if (!lista?.length) {
    conteudo.innerHTML = `<p class="ia-erro">Complete seu perfil para receber recomendações!</p>`;
    return;
  }

  conteudo.innerHTML = `<div class="ia-recomendacoes">${
    lista.map(item => `
      <div class="ia-item" onclick="abrirRecomendacao('${encodeURIComponent(item.titulo)}')">
        <div class="ia-item-icon">
          <i class="bi ${ICONES_TIPO[item.tipo] || "bi-lightbulb"}"></i>
        </div>
        <div class="ia-item-texto">
          <p class="ia-item-titulo">${item.titulo}</p>
          <p class="ia-item-sub">${item.descricao}</p>
        </div>
        <i class="bi bi-chevron-right" style="opacity:0.6; font-size:0.85em; align-self:center;"></i>
      </div>
    `).join("")
  }</div>`;
}

function abrirRecomendacao(tituloEncoded) {
  const titulo = decodeURIComponent(tituloEncoded);
  const query  = encodeURIComponent(titulo + " aula");
  window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", gerarRecomendacoes);