// Caso esteja lendo isso, eu coloquei isso aqui porque é somente um protótipo, não um PROJEETO entende?

const SEED_USUARIOS = [
  {
    id: "u001",
    email: "ana.silva@email.com",
    senha: "senha123",
    tipo: "aluno",
    nome: "Ana Silva",
    idade: 15,
    serie: "1º Ano EM",
    escola: "Colégio Estadual Central",
    neurodivergente: "nao",
    cidade: "São Paulo",
    interesses: ["Tecnologia", "Ciencias", "Leitura"],
    objetivo: "Melhorar meu desempenho escolar",
    tempoLivre: "Gosto de ler e jogar videogame.",
    metodoAprender: "videos",
    preferencia: "sozinho",
    frequencia: "todos-dias",
    periodo: "tarde",
    criadoEm: "2025-01-10T14:00:00.000Z",
  },
  {
    id: "u002",
    email: "carlos.mendes@email.com",
    senha: "senha123",
    tipo: "aluno",
    nome: "Carlos Mendes",
    idade: 17,
    serie: "3º Ano EM",
    escola: "Instituto Federal",
    neurodivergente: "sim",
    cidade: "Recife",
    interesses: ["Tecnologia", "Jogos", "Artes"],
    objetivo: "Criar rotina de estudos",
    tempoLivre: "Programo nas horas vagas e jogo online.",
    metodoAprender: "textos",
    preferencia: "ambos",
    frequencia: "3-4-semana",
    periodo: "noite",
    criadoEm: "2025-02-03T09:30:00.000Z",
  },
  {
    id: "u003",
    email: "mariana.prof@email.com",
    senha: "senha123",
    tipo: "professor",
    nome: "Mariana Costa",
    idade: 34,
    serie: "N/A",
    escola: "Escola Municipal São Jorge",
    neurodivergente: "nao_dizer",
    cidade: "Belo Horizonte",
    interesses: ["Ciencias", "Leitura", "Artes"],
    objetivo: "Aprender algo novo",
    tempoLivre: "Gosto de caminhar e cozinhar.",
    metodoAprender: "textos",
    preferencia: "grupo",
    frequencia: "1-2-semana",
    periodo: "manha",
    criadoEm: "2025-01-20T11:00:00.000Z",
  },
  {
    id: "u004",
    email: "lucas.prof@email.com",
    senha: "senha123",
    tipo: "professor",
    nome: "Lucas Ferreira",
    idade: 41,
    serie: "N/A",
    escola: "Colégio Técnico Norte",
    neurodivergente: "nao",
    cidade: "Fortaleza",
    interesses: ["Tecnologia", "Ciencias", "Esportes"],
    objetivo: "Explorar novos temas",
    tempoLivre: "Assisto documentários e pratico natação.",
    metodoAprender: "videos",
    preferencia: "ambos",
    frequencia: "todos-dias",
    periodo: "manha",
    criadoEm: "2025-03-15T08:00:00.000Z",
  },
  {
    id: "u005",
    email: "julia.santos@email.com",
    senha: "senha123",
    tipo: "aluno",
    nome: "Júlia Santos",
    idade: 14,
    serie: "9º Ano EF",
    escola: "Escola Particular Horizonte",
    neurodivergente: "sim",
    cidade: "Curitiba",
    interesses: ["Artes", "Leitura", "Esportes"],
    objetivo: "Explorar novos temas",
    tempoLivre: "Desenho e ouço música.",
    metodoAprender: "videos",
    preferencia: "sozinho",
    frequencia: "finais-semana",
    periodo: "tarde",
    criadoEm: "2025-04-01T16:00:00.000Z",
  },
];

// ─────────────────────────────────────────────────────────────
//  CHAVES
// ─────────────────────────────────────────────────────────────
const CHAVE_USUARIOS  = "aprendimais_usuarios";
const CHAVE_SESSAO    = "aprendimais_sessao";
const CHAVE_CADASTRO  = "aprendimais_cadastro_temp";

// ─────────────────────────────────────────────────────────────
//  INICIALIZAÇÃO — popula o localStorage com o seed se vazio
// ─────────────────────────────────────────────────────────────
(function inicializar() {
  if (!localStorage.getItem(CHAVE_USUARIOS)) {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(SEED_USUARIOS));
  }
})();

// ─────────────────────────────────────────────────────────────
//  HELPERS INTERNOS
// ─────────────────────────────────────────────────────────────
function _getUsuarios() {
  return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
}

function _salvarUsuarios(lista) {
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(lista));
}

function _gerarId() {
  return "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─────────────────────────────────────────────────────────────
//  SESSÃO — quem está logado agora
// ─────────────────────────────────────────────────────────────
const Sessao = {
  /** Salva o usuário logado na sessionStorage */
  iniciar(usuario) {
    const { senha, ...semSenha } = usuario; // nunca guarda a senha na sessão
    sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(semSenha));
  },

  /** Retorna o usuário logado ou null */
  atual() {
    const dados = sessionStorage.getItem(CHAVE_SESSAO);
    return dados ? JSON.parse(dados) : null;
  },

  /** Encerra a sessão e redireciona para o login */
  encerrar(redirecionar = true) {
    sessionStorage.removeItem(CHAVE_SESSAO);
    if (redirecionar) window.location.href='../../loadingPage/index.html?redirect=../register/index.html';
  },

  /** Verifica se há sessão ativa; redireciona se não tiver */
  exigir(redirecionar = true) {
    const usuario = this.atual();
    if (!usuario) {
      if (redirecionar) window.location.href='../../loadingPage/index.html?redirect=../register/index.html';
      return null;
    }
    return usuario;
  },
};

// ─────────────────────────────────────────────────────────────
//  CADASTRO TEMPORÁRIO — persiste dados entre as 3 etapas
// ─────────────────────────────────────────────────────────────
const CadastroTemp = {
  /** Salva (ou mescla) dados parciais */
  salvar(dados) {
    const atual = this.ler();
    sessionStorage.setItem(CHAVE_CADASTRO, JSON.stringify({ ...atual, ...dados }));
  },

  /** Retorna todos os dados salvos até agora */
  ler() {
    const dados = sessionStorage.getItem(CHAVE_CADASTRO);
    return dados ? JSON.parse(dados) : {};
  },

  /** Limpa os dados temporários */
  limpar() {
    sessionStorage.removeItem(CHAVE_CADASTRO);
  },
};

// ─────────────────────────────────────────────────────────────
//  AUTENTICAÇÃO
// ─────────────────────────────────────────────────────────────
const Auth = {
  /**
   * Tenta fazer login.
   * @returns {{ ok: true, usuario } | { ok: false, erro: string }}
   */
  login(email, senha) {
    const usuarios = _getUsuarios();
    const usuario = usuarios.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
    );

    if (!usuario) {
      return { ok: false, erro: "E-mail ou senha incorretos." };
    }

    Sessao.iniciar(usuario);
    return { ok: true, usuario };
  },

  /**
   * Redireciona para o dashboard correto conforme o tipo do usuário.
   * Chame após um login bem-sucedido.
   */
  redirecionarPorTipo(usuario) {
    if (usuario.tipo === "professor") {
      window.location.href = "../loadingPage/index.html?redirect=../dashboard/professor/index.html";
    } else {
      window.location.href = "../loadingPage/index.html?redirect=../dashboard/aluno/index.html";
    }
  },

  /** Logout */
  logout() {
    Sessao.encerrar();
  },
};

// ─────────────────────────────────────────────────────────────
//  USUÁRIOS — CRUD
// ─────────────────────────────────────────────────────────────
const Usuarios = {
  /** Lista todos os usuários (sem senhas) */
  listar() {
    return _getUsuarios().map(({ senha, ...u }) => u);
  },

  /** Busca por ID */
  buscarPorId(id) {
    const u = _getUsuarios().find((u) => u.id === id);
    if (!u) return null;
    const { senha, ...semSenha } = u;
    return semSenha;
  },

  /** Busca por e-mail */
  buscarPorEmail(email) {
    const u = _getUsuarios().find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!u) return null;
    const { senha, ...semSenha } = u;
    return semSenha;
  },

  /**
   * Cadastra um novo usuário com todos os dados das 3 etapas.
   * @returns {{ ok: true, usuario } | { ok: false, erro: string }}
   */
  cadastrar(dados) {
    const { email, senha, nome, tipo } = dados;

    if (!email || !senha || !nome || !tipo) {
      return { ok: false, erro: "Campos obrigatórios faltando." };
    }

    const usuarios = _getUsuarios();

    if (usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, erro: "Este e-mail já está cadastrado." };
    }

    const novoUsuario = {
      id: _gerarId(),
      email: email.toLowerCase().trim(),
      senha,
      tipo,                                       // "aluno" | "professor"
      nome: nome.trim(),
      idade: dados.idade || null,
      serie: dados.serie || null,
      escola: dados.escola || null,
      neurodivergente: dados.neurodivergente || "nao_dizer",
      cidade: dados.cidade || null,
      interesses: dados.interesses || [],
      objetivo: dados.objetivo || null,
      tempoLivre: dados.tempoLivre || null,
      metodoAprender: dados.metodoAprender || null,
      preferencia: dados.preferencia || null,
      frequencia: dados.frequencia || null,
      periodo: dados.periodo || null,
      criadoEm: new Date().toISOString(),
    };

    usuarios.push(novoUsuario);
    _salvarUsuarios(usuarios);

    CadastroTemp.limpar();
    Sessao.iniciar(novoUsuario);

    return { ok: true, usuario: novoUsuario };
  },

  /**
   * Atualiza campos de um usuário existente.
   * @returns {{ ok: true } | { ok: false, erro: string }}
   */
  atualizar(id, campos) {
    const usuarios = _getUsuarios();
    const idx = usuarios.findIndex((u) => u.id === id);

    if (idx === -1) return { ok: false, erro: "Usuário não encontrado." };

    const { id: _, criadoEm: __, ...seguros } = campos;
    usuarios[idx] = { ...usuarios[idx], ...seguros };
    _salvarUsuarios(usuarios);

    const sessao = Sessao.atual();
    if (sessao && sessao.id === id) Sessao.iniciar(usuarios[idx]);

    return { ok: true };
  },

  /**
   * Remove um usuário.
   * @returns {{ ok: true } | { ok: false, erro: string }}
   */
  remover(id) {
    const usuarios = _getUsuarios();
    const idx = usuarios.findIndex((u) => u.id === id);
    if (idx === -1) return { ok: false, erro: "Usuário não encontrado." };
    usuarios.splice(idx, 1);
    _salvarUsuarios(usuarios);
    return { ok: true };
  },

  listarAlunos() {
    return _getUsuarios()
      .filter((u) => u.tipo === "aluno")
      .map(({ senha, ...u }) => u);
  },

  listarProfessores() {
    return _getUsuarios()
      .filter((u) => u.tipo === "professor")
      .map(({ senha, ...u }) => u);
  },
};

// ─────────────────────────────────────────────────────────────
//  UTILITÁRIOS DE DEBUG (só para desenvolvimento)
// ─────────────────────────────────────────────────────────────
const Debug = {
  verTudo() {
    console.table(_getUsuarios());
  },

  resetar() {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(SEED_USUARIOS));
    sessionStorage.clear();
    console.log("Banco resetado para o seed original.");
  },
};

// ─────────────────────────────────────────────────────────────
//  EXPORTA PARA O ESCOPO GLOBAL (sem bundler)
// ─────────────────────────────────────────────────────────────
window.DB = { Sessao, CadastroTemp, Auth, Usuarios, Debug };