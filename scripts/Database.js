const SEED_USUARIOS = [
  // ── Alunos da Mariana (Escola Municipal São Jorge, BH/MG) ──
  {
    id: "u001", email: "ana.silva@email.com", senha: "senha123", tipo: "aluno",
    nome: "Ana Silva", idade: 15, serie: "1º Ano EM", turma: "A",
    escola: "Escola Municipal São Jorge",
    escolaObj: { nome: "Escola Municipal São Jorge", cidade: "Belo Horizonte", uf: "MG" },
    neurodivergente: "nao", cidade: "Belo Horizonte",
    interesses: ["Tecnologia", "Ciencias", "Leitura"],
    objetivo: "Melhorar meu desempenho escolar", tempoLivre: "Gosto de ler e jogar.",
    metodoAprender: "videos", preferencia: "sozinho", frequencia: "todos-dias", periodo: ["tarde"],
    criadoEm: "2025-01-10T14:00:00.000Z",
  },
  {
    id: "u002", email: "carlos.mendes@email.com", senha: "senha123", tipo: "aluno",
    nome: "Carlos Mendes", idade: 17, serie: "1º Ano EM", turma: "B",
    escola: "Escola Municipal São Jorge",
    escolaObj: { nome: "Escola Municipal São Jorge", cidade: "Belo Horizonte", uf: "MG" },
    neurodivergente: "sim", cidade: "Belo Horizonte",
    interesses: ["Tecnologia", "Jogos", "Artes"],
    objetivo: "Criar rotina de estudos", tempoLivre: "Programo e jogo online.",
    metodoAprender: "textos", preferencia: "ambos", frequencia: "3-4-semana", periodo: ["noite"],
    criadoEm: "2025-02-03T09:30:00.000Z",
  },
  // ── Aluno da Mariana (Colégio Estadual Central, SP/SP) ──────
  {
    id: "u005", email: "julia.santos@email.com", senha: "senha123", tipo: "aluno",
    nome: "Júlia Santos", idade: 14, serie: "9º Ano EF", turma: "A",
    escola: "Colégio Estadual Central",
    escolaObj: { nome: "Colégio Estadual Central", cidade: "São Paulo", uf: "SP" },
    neurodivergente: "sim", cidade: "São Paulo",
    interesses: ["Artes", "Leitura", "Esportes"],
    objetivo: "Explorar novos temas", tempoLivre: "Desenho e ouço música.",
    metodoAprender: "videos", preferencia: "sozinho", frequencia: "finais-semana", periodo: ["tarde"],
    criadoEm: "2025-04-01T16:00:00.000Z",
  },
  // ── Professores ─────────────────────────────────────────────
  {
    id: "u003", email: "mariana.prof@email.com", senha: "senha123", tipo: "professor",
    nome: "Mariana Costa", idade: 34, serie: "N/A", turma: null,
    escola: "Escola Municipal São Jorge",
    escolas: [
      { nome: "Escola Municipal São Jorge", cidade: "Belo Horizonte", uf: "MG" },
      { nome: "Colégio Estadual Central",   cidade: "São Paulo",      uf: "SP" },
    ],
    neurodivergente: "nao_dizer", cidade: "Belo Horizonte",
    interesses: ["Ciencias", "Leitura", "Artes"],
    objetivo: "Aprender algo novo", tempoLivre: "Gosto de caminhar.",
    metodoAprender: "textos", preferencia: "grupo", frequencia: "1-2-semana", periodo: ["manha", "tarde"],
    criadoEm: "2025-01-20T11:00:00.000Z",
  },
  {
    id: "u004", email: "lucas.prof@email.com", senha: "senha123", tipo: "professor",
    nome: "Lucas Ferreira", idade: 41, serie: "N/A", turma: null,
    escola: "Colégio Técnico Norte",
    escolas: [{ nome: "Colégio Técnico Norte", cidade: "Fortaleza", uf: "CE" }],
    neurodivergente: "nao", cidade: "Fortaleza",
    interesses: ["Tecnologia", "Ciencias", "Esportes"],
    objetivo: "Explorar novos temas", tempoLivre: "Assisto documentários.",
    metodoAprender: "videos", preferencia: "ambos", frequencia: "todos-dias", periodo: ["manha"],
    criadoEm: "2025-03-15T08:00:00.000Z",
  },
];

const CHAVE_USUARIOS = "aprendimais_usuarios";
const CHAVE_SESSAO   = "aprendimais_sessao";
const CHAVE_CADASTRO = "aprendimais_cadastro_temp";

(function inicializar() {
  if (!localStorage.getItem(CHAVE_USUARIOS))
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(SEED_USUARIOS));
})();

function _getUsuarios() { return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || []; }
function _salvarUsuarios(l) { localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(l)); }
function _gerarId() { return "u" + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

const Sessao = {
  iniciar(u) { const {senha,...s}=u; sessionStorage.setItem(CHAVE_SESSAO,JSON.stringify(s)); },
  atual()    { const d=sessionStorage.getItem(CHAVE_SESSAO); return d?JSON.parse(d):null; },
  encerrar(r=true) { sessionStorage.removeItem(CHAVE_SESSAO); if(r) window.location.href="../register/index.html"; },
  exigir(r=true)   { const u=this.atual(); if(!u){if(r)window.location.href="../register/index.html"; return null;} return u; },
};

const CadastroTemp = {
  salvar(d) { sessionStorage.setItem(CHAVE_CADASTRO,JSON.stringify({...this.ler(),...d})); },
  ler()     { const d=sessionStorage.getItem(CHAVE_CADASTRO); return d?JSON.parse(d):{}; },
  limpar()  { sessionStorage.removeItem(CHAVE_CADASTRO); },
};

const Auth = {
  login(email, senha) {
    const u = _getUsuarios().find(u => u.email.toLowerCase()===email.toLowerCase() && u.senha===senha);
    if (!u) return { ok:false, erro:"E-mail ou senha incorretos." };
    Sessao.iniciar(u);
    return { ok:true, usuario:u };
  },
  redirecionarPorTipo(u) {
    window.location.href = u.tipo==="professor" ? "../dashboard/professor/index.html" : "../dashboard/aluno/index.html";
  },
  logout() { Sessao.encerrar(); },
};

const Usuarios = {
  listar()           { return _getUsuarios().map(({senha,...u})=>u); },
  listarAlunos()     { return _getUsuarios().filter(u=>u.tipo==="aluno").map(({senha,...u})=>u); },
  listarProfessores(){ return _getUsuarios().filter(u=>u.tipo==="professor").map(({senha,...u})=>u); },

  buscarPorId(id) {
    const u=_getUsuarios().find(u=>u.id===id); if(!u)return null;
    const{senha,...s}=u; return s;
  },
  buscarPorEmail(email) {
    const u=_getUsuarios().find(u=>u.email.toLowerCase()===email.toLowerCase()); if(!u)return null;
    const{senha,...s}=u; return s;
  },

  cadastrar(dados) {
    const {email,senha,nome,tipo}=dados;
    if (!email||!senha||!nome||!tipo) return {ok:false,erro:"Campos obrigatórios faltando."};
    const usuarios=_getUsuarios();
    if (usuarios.find(u=>u.email.toLowerCase()===email.toLowerCase()))
      return {ok:false,erro:"Este e-mail já está cadastrado."};

    const novo = {
      id:_gerarId(), email:email.toLowerCase().trim(), senha, tipo,
      nome:nome.trim(), idade:dados.idade||null,
      serie:dados.serie||null, turma:dados.turma||null,
      escola:dados.escola||null, escolaObj:dados.escolaObj||null,
      escolas:dados.escolas||(dados.escolaObj?[dados.escolaObj]:[]),
      neurodivergente:dados.neurodivergente||"nao_dizer",
      cidade:dados.cidade||null, interesses:dados.interesses||[],
      objetivo:dados.objetivo||null, tempoLivre:dados.tempoLivre||null,
      metodoAprender:dados.metodoAprender||null, preferencia:dados.preferencia||null,
      frequencia:dados.frequencia||null, periodo:dados.periodo||[],
      materia:dados.materia||null, criadoEm:new Date().toISOString(),
    };

    usuarios.push(novo);
    _salvarUsuarios(usuarios);
    CadastroTemp.limpar();
    Sessao.iniciar(novo);
    return {ok:true, usuario:novo};
  },

  atualizar(id, campos) {
    const usuarios=_getUsuarios();
    const idx=usuarios.findIndex(u=>u.id===id);
    if (idx===-1) return {ok:false,erro:"Usuário não encontrado."};
    const {id:_,criadoEm:__,...seguros}=campos;
    usuarios[idx]={...usuarios[idx],...seguros};
    _salvarUsuarios(usuarios);
    const s=Sessao.atual();
    if (s&&s.id===id) Sessao.iniciar(usuarios[idx]);
    return {ok:true};
  },

  remover(id) {
    const usuarios=_getUsuarios();
    const idx=usuarios.findIndex(u=>u.id===id);
    if (idx===-1) return {ok:false,erro:"Usuário não encontrado."};
    usuarios.splice(idx,1); _salvarUsuarios(usuarios);
    return {ok:true};
  },

  turmasDoProfessor(professorId) {
    const prof = _getUsuarios().find(u=>u.id===professorId);
    if (!prof) return [];

    const escolasProf = (prof.escolas||[]).map(e=>e.nome.toLowerCase().trim());
    if (!escolasProf.length) return [];

    const alunos = _getUsuarios().filter(u => {
      if (u.tipo!=="aluno") return false;
      return escolasProf.includes((u.escola||"").toLowerCase().trim());
    });

    const mapa = {};
    alunos.forEach(a => {
      const e = a.escola||"Sem escola";
      const s = a.serie ||"Sem série";
      const t = a.turma ||"Geral";
      if (!mapa[e]) mapa[e]={};
      if (!mapa[e][s]) mapa[e][s]={};
      if (!mapa[e][s][t]) mapa[e][s][t]=[];
      const {senha,...sem}=a;
      mapa[e][s][t].push(sem);
    });

    return Object.entries(mapa).map(([escola,series])=>({
      escola,
      uf:     alunos.find(a=>a.escola===escola)?.escolaObj?.uf||"",
      cidade: alunos.find(a=>a.escola===escola)?.escolaObj?.cidade||"",
      series: Object.entries(series).map(([serie,turmas])=>({
        serie,
        turmas: Object.entries(turmas).map(([turma,alunos])=>({turma,alunos})),
      })),
    }));
  },

  listaTurmasProfessor(professorId) {
    const lista = [];
    this.turmasDoProfessor(professorId).forEach(g => {
      g.series.forEach(s => {
        s.turmas.forEach(t => {
          lista.push({ label:`${g.escola} · ${s.serie} · Turma ${t.turma}`, escola:g.escola, serie:s.serie, turma:t.turma, alunos:t.alunos });
        });
      });
    });
    return lista;
  },
};

const Debug = {
  verTudo()  { console.table(_getUsuarios()); },
  // ⚠️ Chame isso no console do browser se o banco estiver
  // com dados velhos e precisar atualizar o seed:
  resetar()  {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(SEED_USUARIOS));
    sessionStorage.clear();
    console.log("✅ Banco resetado para o seed mais recente.");
  },
};

window.DB = { Sessao, CadastroTemp, Auth, Usuarios, Debug };