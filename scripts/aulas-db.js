// ============================================================
//  Aprendi+ | aulasDB.js
//  Gerencia aulas criadas pelos professores
//  Depende de: Database.js
// ============================================================

const CHAVE_AULAS = "aprendimais_aulas_turmas";

const AulasDB = {

  // ── Salva todas as aulas ──────────────────────────────────
  _getAulas() {
    const raw = localStorage.getItem(CHAVE_AULAS);
    return raw ? JSON.parse(raw) : [];
  },
  _salvar(lista) {
    localStorage.setItem(CHAVE_AULAS, JSON.stringify(lista));
  },

  // ── Cria uma nova aula ────────────────────────────────────
  criar({ professorId, professorNome, escola, serie, turma, titulo, descricao, duracao, tipo, link }) {
    const aulas = this._getAulas();
    const nova = {
      id:           "aula_" + Date.now(),
      professorId,
      professorNome,
      escola,
      serie,
      turma,        // null = todas as turmas da série
      titulo,
      descricao,
      duracao,
      tipo,         // "video" | "texto" | "exercicio"
      link,         // link do YouTube ou texto do conteúdo
      criadaEm:     new Date().toISOString(),
    };
    aulas.unshift(nova); // mais recente primeiro
    this._salvar(aulas);
    return nova;
  },

  // ── Busca aulas para um aluno específico ──────────────────
  paraAluno(usuario) {
    const aulas = this._getAulas();
    return aulas.filter(a => {
      const mesmaEscola = (a.escola || "").toLowerCase() === (usuario.escola || "").toLowerCase();
      const mesmaSerie  = a.serie === usuario.serie;
      const mesmaTurma  = !a.turma || a.turma === usuario.turma;
      return mesmaEscola && mesmaSerie && mesmaTurma;
    });
  },

  // ── Busca aulas criadas por um professor ──────────────────
  doProfessor(professorId) {
    return this._getAulas().filter(a => a.professorId === professorId);
  },

  // ── Remove uma aula ───────────────────────────────────────
  remover(aulaId) {
    const aulas = this._getAulas().filter(a => a.id !== aulaId);
    this._salvar(aulas);
  },

  // ── Progresso do aluno ────────────────────────────────────
  getProgresso(usuarioId) {
    const raw = localStorage.getItem(`aprendimais_prog_${usuarioId}`);
    return raw ? JSON.parse(raw) : {};
  },
  salvarProgresso(usuarioId, aulaId, feita) {
    const prog = this.getProgresso(usuarioId);
    prog[aulaId] = feita;
    localStorage.setItem(`aprendimais_prog_${usuarioId}`, JSON.stringify(prog));
  },
};

window.AulasDB = AulasDB;