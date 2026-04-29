const usuario = DB.Sessao.exigir();
const primeiroNome = usuario.nome.split(" ")[0];

// ── Mapeamentos legíveis ─────────────────────────────────────
const metodoMap = { videos: "Vídeos / Visual", textos: "Leitura / Textual" };
const prefMap   = { sozinho: "Sozinho", grupo: "Em grupo", ambos: "Um pouco dos dois" };
const freqMap   = {
  "todos-dias":    "Todos os dias",
  "3-4-semana":    "3 a 4 vezes na semana",
  "1-2-semana":    "1 a 2 vezes na semana",
  "finais-semana": "Somente nos finais de semana",
};
const periodoMap = { manha: "Manhã", tarde: "Tarde", noite: "Noite", madrugada: "Madrugada" };

// ── Header e hero ────────────────────────────────────────────
document.getElementById("avatarGrande").textContent  = primeiroNome[0].toUpperCase();
document.getElementById("nomeAluno").textContent     = usuario.nome;
document.getElementById("metaAluno").textContent     =
  [usuario.serie, usuario.escola].filter(Boolean).join(" | ") || "—";

// ── Itens da lista ───────────────────────────────────────────
document.getElementById("tipoAprendizagem").textContent =
  metodoMap[usuario.metodoAprender] || "Não informado";
document.getElementById("emailAluno").textContent = usuario.email;

// ── Meta semanal ─────────────────────────────────────────────
const aulasConcluidas = 3, metaTotal = 5;
const metaPct = Math.round((aulasConcluidas / metaTotal) * 100);
document.getElementById("metaTexto").textContent = `${aulasConcluidas} de ${metaTotal} aulas`;
document.getElementById("metaFill").style.width  = `${metaPct}%`;

// ── Preenche modal DADOS ──────────────────────────────────────
function preencherDados() {
  document.getElementById("d-nome").textContent   = usuario.nome;
  document.getElementById("d-email").textContent  = usuario.email;
  document.getElementById("d-serie").textContent  = usuario.serie   || "Não informado";
  document.getElementById("d-escola").textContent = usuario.escola  || "Não informado";
  document.getElementById("d-cidade").textContent = usuario.cidade  || "Não informado";
  document.getElementById("d-idade").textContent  = usuario.idade ? `${usuario.idade} anos` : "Não informado";

  const tags = (usuario.interesses || [])
    .map(i => `<span class="tag">${i}</span>`).join("") ||
    `<span style="color:var(--cor-paragrafo); font-size:0.85em;">Não informado</span>`;
  document.getElementById("d-interesses").innerHTML = tags;
}

// ── Preenche modal PREFERÊNCIAS ───────────────────────────────
function preencherPreferencias() {
  document.getElementById("p-metodo").textContent      = metodoMap[usuario.metodoAprender] || "—";
  document.getElementById("p-preferencia").textContent = prefMap[usuario.preferencia]      || "—";
  document.getElementById("p-frequencia").textContent  = freqMap[usuario.frequencia]       || "—";
  document.getElementById("p-periodo").textContent     = periodoMap[usuario.periodo]       || "—";
  document.getElementById("p-objetivo").textContent    = usuario.objetivo                  || "—";
}

// ── Preenche modal EDITAR ─────────────────────────────────────
function preencherEditar() {
  document.getElementById("edit-cidade").value = usuario.cidade || "";
  document.getElementById("edit-escola").value = usuario.escola || "";
  document.getElementById("edit-serie").value  = usuario.serie  || "";
}

// ── Sistema de modais ─────────────────────────────────────────
let modalAtual = null;

function abrirModal(nome) {
  if (modalAtual) {
    document.getElementById("modal-" + modalAtual)?.classList.remove("aberto");
  }

  if (nome === "dados")        preencherDados();
  if (nome === "preferencias") preencherPreferencias();
  if (nome === "editar")       preencherEditar();

  const modal = document.getElementById("modal-" + nome);
  if (!modal) return;

  document.getElementById("modal-overlay").style.display = "block";
  modal.style.display = "block";
  requestAnimationFrame(() => modal.classList.add("aberto"));
  document.body.style.overflow = "hidden";
  modalAtual = nome;
}

function fecharModal() {
  if (modalAtual) {
    const modal = document.getElementById("modal-" + modalAtual);
    modal?.classList.remove("aberto");
    setTimeout(() => { if (modal) modal.style.display = "none"; }, 300);
  }
  document.getElementById("modal-overlay").style.display = "none";
  document.body.style.overflow = "";
  modalAtual = null;
}

document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharModal(); });

// ── Salvar edição ─────────────────────────────────────────────
document.getElementById("btnSalvarEdicao").addEventListener("click", () => {
  const cidade = document.getElementById("edit-cidade").value.trim();
  const escola = document.getElementById("edit-escola").value.trim();
  const serie  = document.getElementById("edit-serie").value.trim();

  DB.Usuarios.atualizar(usuario.id, { cidade, escola, serie });

  // Atualiza localmente sem precisar recarregar
  usuario.cidade = cidade;
  usuario.escola = escola;
  usuario.serie  = serie;

  document.getElementById("metaAluno").textContent =
    [serie, escola].filter(Boolean).join(" | ") || "—";

  fecharModal();

  const status = document.getElementById("statusPerfil");
  status.textContent = "Alterações salvas!";
  setTimeout(() => {
    status.textContent = "Seu perfil está atualizado. Continue estudando para liberar novas trilhas.";
  }, 3000);
});

// ── Toggle lembretes ──────────────────────────────────────────
const toggleLembrete = document.getElementById("toggleLembrete");
let lembreteAtivo = true;
toggleLembrete.addEventListener("click", () => {
  lembreteAtivo = !lembreteAtivo;
  toggleLembrete.textContent      = lembreteAtivo ? "Ativo" : "Inativo";
  toggleLembrete.ariaPressed      = lembreteAtivo;
  toggleLembrete.style.background = lembreteAtivo ? "var(--cor-botoes)" : "#ccc";
});

// ── Salvar alterações (botão fixo) ────────────────────────────
document.getElementById("salvarPerfil").addEventListener("click", () => {
  const status = document.getElementById("statusPerfil");
  status.textContent = "✅ Alterações salvas!";
  setTimeout(() => {
    status.textContent = "Seu perfil está atualizado. Continue estudando para liberar novas trilhas.";
  }, 3000);
});

// ── Engrenagem → abre configurações ──────────────────────────
document.getElementById("btnGear").addEventListener("click", () => abrirModal("config"));

// ── Logout ────────────────────────────────────────────────────
document.getElementById("btnLogout").addEventListener("click", () => {
  if (confirm("Deseja sair da sua conta?")) DB.Auth.logout();
});