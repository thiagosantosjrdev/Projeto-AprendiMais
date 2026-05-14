document.addEventListener("DOMContentLoaded", () => {

  const usuario = DB.Sessao.exigir();

  // ── Contatos e conversas ────────────────────────────────────
  window._usuario   = usuario;
  window._contatos  = _getContatos(usuario);
  window._conversas = _getConversas(usuario.id);

  // Garante entrada pra cada contato
  window._contatos.forEach(c => {
    if (!window._conversas[c.id]) {
      window._conversas[c.id] = { contato: c, mensagens: [], naoLidas: 0 };
    } else {
      window._conversas[c.id].contato = c;
    }
  });

  // Seed: APENAS mensagem do Aprendi+ (sistema), uma vez só
  _seedAprendimais(usuario);

  _salvarConversas(usuario.id, window._conversas);
  window._filtroAtivo = "todas";

  renderLista();
  renderNovosContatos();
});

// ── Persistência ─────────────────────────────────────────────
function _getConversas(userId) {
  const raw = localStorage.getItem(`aprendimais_chat_${userId}`);
  return raw ? JSON.parse(raw) : {};
}
function _salvarConversas(userId, conv) {
  localStorage.setItem(`aprendimais_chat_${userId}`, JSON.stringify(conv));
}

// ── Seed: só mensagem do Aprendi+ ────────────────────────────
const ID_SISTEMA = "sistema_aprendimais";

function _seedAprendimais(usuario) {
  const conv = window._conversas;

  // Só cria uma vez
  if (conv[ID_SISTEMA]) return;

  const agora = new Date();
  conv[ID_SISTEMA] = {
    contato: {
      id:   ID_SISTEMA,
      nome: "Aprendi+",
      tipo: "sistema",
      sub:  "Plataforma de aprendizado",
    },
    mensagens: [{
      de:    ID_SISTEMA,
      texto: `Olá, ${usuario.nome.split(" ")[0]}! 🎉 Seja bem-vindo ao Aprendi+. Use a plataforma pra estudar, tirar dúvidas com seus professores e se conectar com colegas. Bons estudos!`,
      hora:  _formatarHora(agora),
      data:  _formatarData(agora),
      ts:    agora.getTime(),
    }],
    naoLidas: 1,
  };

  _salvarConversas(usuario.id, conv);
}

// ── Contatos disponíveis ──────────────────────────────────────
function _getContatos(usuario) {
  const todos  = DB.Usuarios.listar();
  const ehProf = usuario.tipo === "professor";
  const lista  = [];

  if (ehProf) {
    const escolasProf = (usuario.escolas || []).map(e => e.nome.toLowerCase());
    todos.forEach(u => {
      if (u.id === usuario.id) return;
      const mesmaEscola = escolasProf.includes((u.escola || "").toLowerCase());
      if (u.tipo === "aluno" && mesmaEscola)
        lista.push({ id: u.id, nome: u.nome, tipo: "aluno",
          sub: `${u.serie || ""} · Turma ${u.turma || ""} · ${u.escola || ""}` });
      if (u.tipo === "professor")
        lista.push({ id: u.id, nome: u.nome, tipo: "professor",
          sub: `Professor · ${u.escola || ""}` });
    });
  } else {
    todos.forEach(u => {
      if (u.id === usuario.id) return;
      const mesmaEscola = (u.escola || "").toLowerCase() === (usuario.escola || "").toLowerCase();
      const mesmaTurma  = mesmaEscola && u.serie === usuario.serie && u.turma === usuario.turma;
      if (u.tipo === "professor" && mesmaEscola)
        lista.push({ id: u.id, nome: u.nome, tipo: "professor",
          sub: `Professor · ${u.escola || ""}` });
      if (u.tipo === "aluno" && mesmaTurma)
        lista.push({ id: u.id, nome: u.nome, tipo: "aluno",
          sub: `${u.serie || ""} · Turma ${u.turma || ""}` });
    });
  }

  return lista;
}

// ── Render lista ──────────────────────────────────────────────
function renderLista(filtro = "todas", busca = "") {
  const lista = document.getElementById("listaConversas");
  if (!lista) return;

  let itens = Object.values(window._conversas)
    .filter(c => c.mensagens.length > 0 || c.naoLidas > 0);

  itens.sort((a, b) => (b.mensagens.at(-1)?.ts || 0) - (a.mensagens.at(-1)?.ts || 0));

  if (filtro === "nao-lida")  itens = itens.filter(c => c.naoLidas > 0);
  if (filtro === "professor") itens = itens.filter(c => c.contato.tipo === "professor");
  if (filtro === "aluno")     itens = itens.filter(c => c.contato.tipo === "aluno");
  if (busca) itens = itens.filter(c => c.contato.nome.toLowerCase().includes(busca.toLowerCase()));

  const totalNaoLidas = Object.values(window._conversas).reduce((a, c) => a + (c.naoLidas || 0), 0);
  const sub = document.getElementById("subtituloMensagens");
  if (sub) sub.textContent = totalNaoLidas > 0
    ? `${totalNaoLidas} mensagem${totalNaoLidas > 1 ? "s" : ""} não lida${totalNaoLidas > 1 ? "s" : ""}`
    : "Tudo em dia por aqui!";

  if (!itens.length) {
    lista.innerHTML = `
      <div class="vazio-msg">
        <i class="bi bi-chat-dots"></i>
        Nenhuma conversa encontrada.<br>
        Toque no <i class="bi bi-pencil-square"></i> para iniciar uma.
      </div>`;
    return;
  }

  lista.innerHTML = itens.map(c => {
    const ultima  = c.mensagens.at(-1);
    const preview = ultima?.texto || "Nenhuma mensagem";
    const hora    = ultima?.hora  || "";
    const naoLida = c.naoLidas > 0;
    const isSistema = c.contato.tipo === "sistema";

    const icone = isSistema ? "bi-stars" :
                  c.contato.tipo === "professor" ? "bi-mortarboard" : "bi-person";

    return `
      <div class="conversa-item ${naoLida ? "nao-lida" : ""}"
           onclick="abrirChat('${c.contato.id}')">
        <div class="conversa-avatar ${c.contato.tipo}">
          ${c.contato.nome[0].toUpperCase()}
          <span class="badge-tipo">
            <i class="bi ${icone}" style="font-size:0.65em;"></i>
          </span>
        </div>
        <div class="conversa-info">
          <p class="conversa-nome">${c.contato.nome}</p>
          <p class="conversa-preview">${_truncar(preview, 45)}</p>
        </div>
        <div class="conversa-meta">
          <span class="conversa-hora">${hora}</span>
          ${naoLida ? `<span class="conversa-badge">${c.naoLidas}</span>` : ""}
        </div>
      </div>`;
  }).join("");
}

// ── Filtros ───────────────────────────────────────────────────
function setFiltro(btn) {
  document.querySelectorAll(".filtro-chip").forEach(b => b.classList.remove("ativo"));
  btn.classList.add("ativo");
  window._filtroAtivo = btn.dataset.filtro;
  filtrarConversas();
}
function filtrarConversas() {
  const busca = document.getElementById("buscaConversa")?.value || "";
  renderLista(window._filtroAtivo, busca);
}

// ── Abre chat ─────────────────────────────────────────────────
function abrirChat(contatoId) {
  const conv = window._conversas[contatoId];
  if (!conv) return;

  conv.naoLidas = 0;
  _salvarConversas(window._usuario.id, window._conversas);
  renderLista(window._filtroAtivo);

  document.getElementById("chatAvatar").textContent = conv.contato.nome[0].toUpperCase();
  document.getElementById("chatNome").textContent   = conv.contato.nome;
  document.getElementById("chatSub").textContent    = conv.contato.sub;

  window._chatAtivo = contatoId;
  renderMensagens(conv.mensagens);

  document.getElementById("chatSheet").classList.add("aberto");
  document.getElementById("chatOverlay").style.display = "block";
  document.body.style.overflow = "hidden";
  document.getElementById("chatInput")?.focus();
}

function fecharChat() {
  document.getElementById("chatSheet").classList.remove("aberto");
  document.getElementById("chatOverlay").style.display = "none";
  document.body.style.overflow = "";
  window._chatAtivo = null;
  renderLista(window._filtroAtivo);
}

// ── Render mensagens ──────────────────────────────────────────
function renderMensagens(mensagens) {
  const container = document.getElementById("chatMensagens");
  if (!container) return;

  if (!mensagens.length) {
    container.innerHTML = `
      <div class="vazio-msg">
        <i class="bi bi-chat"></i>
        Nenhuma mensagem ainda. Diga olá! 👋
      </div>`;
    return;
  }

  let html = "";
  let ultimaData = "";

  mensagens.forEach(m => {
    const ehMeu = m.de === window._usuario.id;
    if (m.data && m.data !== ultimaData) {
      html += `<div class="msg-data-divider">${m.data}</div>`;
      ultimaData = m.data;
    }
    html += `
      <div class="msg-bubble ${ehMeu ? "enviada" : "recebida"}">
        ${_escapeHtml(m.texto)}
        <span class="msg-hora">${m.hora}</span>
      </div>`;
  });

  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
}

// ── Enviar ────────────────────────────────────────────────────
function enviarMensagem() {
  const input  = document.getElementById("chatInput");
  const texto  = input.value.trim();
  const chatId = window._chatAtivo;
  if (!texto || !chatId) return;

  // Bloqueia envio pra conversa do sistema
  if (chatId === ID_SISTEMA) {
    input.value = "";
    return;
  }

  const agora = new Date();
  window._conversas[chatId].mensagens.push({
    de:   window._usuario.id,
    texto,
    hora: _formatarHora(agora),
    data: _formatarData(agora),
    ts:   agora.getTime(),
  });
  _salvarConversas(window._usuario.id, window._conversas);

  input.value = "";
  input.style.height = "auto";
  renderMensagens(window._conversas[chatId].mensagens);
  _simularResposta(chatId);
}

function handleEnter(e) {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarMensagem(); }
}
function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 100) + "px";
}

// ── Resposta automática (demo) ────────────────────────────────
const RESPOSTAS = [
  "Entendido! Vou verificar isso. 👍",
  "Ótima pergunta! Vamos falar sobre isso na próxima aula.",
  "Obrigado pelo contato! Logo te respondo com mais detalhes.",
  "Anotado! Continue estudando com dedicação. 💪",
  "Claro! Se tiver mais dúvidas, pode perguntar à vontade.",
  "Vi sua mensagem! Vou preparar um material sobre isso.",
];

function _simularResposta(chatId) {
  const conv = window._conversas[chatId];
  if (!conv || conv.contato.tipo !== "professor") return;

  setTimeout(() => {
    const agora = new Date();
    conv.mensagens.push({
      de:   conv.contato.id,
      texto: RESPOSTAS[Math.floor(Math.random() * RESPOSTAS.length)],
      hora: _formatarHora(agora),
      data: _formatarData(agora),
      ts:   agora.getTime(),
    });

    if (window._chatAtivo !== chatId) conv.naoLidas = (conv.naoLidas || 0) + 1;
    _salvarConversas(window._usuario.id, window._conversas);

    if (window._chatAtivo === chatId) renderMensagens(conv.mensagens);
    else renderLista(window._filtroAtivo);
  }, 1200 + Math.random() * 1000);
}

// ── Novo chat ─────────────────────────────────────────────────
function abrirNovoChat() {
  document.getElementById("novoChatSheet").classList.add("aberto");
  document.getElementById("novoChatOverlay").style.display = "block";
}
function fecharNovoChat() {
  document.getElementById("novoChatSheet").classList.remove("aberto");
  document.getElementById("novoChatOverlay").style.display = "none";
}

function renderNovosContatos() {
  const lista = document.getElementById("listaNovosContatos");
  if (!lista) return;

  const contatos = window._contatos;
  if (!contatos.length) {
    lista.innerHTML = `<div class="vazio-msg"><i class="bi bi-people"></i>Nenhum contato disponível ainda.</div>`;
    return;
  }

  const profs   = contatos.filter(c => c.tipo === "professor");
  const colegas = contatos.filter(c => c.tipo === "aluno");
  let html = "";

  if (profs.length) {
    html += `<p style="font-size:0.75em;font-weight:700;color:var(--cor-paragrafo);
                       text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">
               Professores</p>`;
    profs.forEach(c => { html += _itemContato(c); });
  }
  if (colegas.length) {
    html += `<p style="font-size:0.75em;font-weight:700;color:var(--cor-paragrafo);
                       text-transform:uppercase;letter-spacing:0.06em;margin:14px 0 6px;">
               Colegas de turma</p>`;
    colegas.forEach(c => { html += _itemContato(c); });
  }

  lista.innerHTML = html;
}

function _itemContato(c) {
  return `
    <div class="novo-chat-item" onclick="iniciarChat('${c.id}')">
      <div class="conversa-avatar ${c.tipo}" style="width:40px;height:40px;font-size:1em;flex-shrink:0;">
        ${c.nome[0].toUpperCase()}
      </div>
      <div style="flex:1;">
        <p style="margin:0;font-weight:700;font-size:0.9em;">${c.nome}</p>
        <p style="margin:0;font-size:0.75em;color:var(--cor-paragrafo);">${c.sub}</p>
      </div>
      <i class="bi bi-chevron-right" style="color:#aaa;"></i>
    </div>`;
}

function iniciarChat(contatoId) {
  fecharNovoChat();
  if (!window._conversas[contatoId]) {
    const contato = window._contatos.find(c => c.id === contatoId);
    if (contato) window._conversas[contatoId] = { contato, mensagens: [], naoLidas: 0 };
  }
  abrirChat(contatoId);
}

// ── Utils ─────────────────────────────────────────────────────
function _formatarHora(d) {
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
function _formatarData(d) {
  const hoje  = new Date();
  const ontem = new Date(hoje); ontem.setDate(hoje.getDate() - 1);
  if (d.toDateString() === hoje.toDateString())  return "Hoje";
  if (d.toDateString() === ontem.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
function _truncar(str, n) { return str.length > n ? str.slice(0, n) + "…" : str; }
function _escapeHtml(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/\n/g,"<br>");
}