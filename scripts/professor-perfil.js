const usuario = DB.Sessao.exigir();

// Garante que é professor; se não, manda pro dashboard de aluno
if (usuario.tipo !== "professor") {
  window.location.href = "../dashboard/aluno/index.html";
}

const primeiroNome = usuario.nome.split(" ")[0];
const inicial      = primeiroNome[0].toUpperCase();

// ── Avatares ────────────────────────────────────────────────
document.getElementById("avatarGrande").textContent = inicial;

// ── Hero ────────────────────────────────────────────────────
document.getElementById("nomeProf").textContent   = usuario.nome;
document.getElementById("escolaProf").textContent = usuario.escola || "Escola não informada";

// ── Stats ────────────────────────────────────────────────────
// Conta alunos cadastrados no banco (todos com tipo "aluno")
const totalAlunos = DB.Usuarios.listarAlunos().length;
document.getElementById("totalAlunos").textContent = totalAlunos;

// Turmas e aulas são dados futuros — exibe placeholder por enquanto
document.getElementById("totalTurmas").textContent = "3";
document.getElementById("totalAulas").textContent  = "12";
document.getElementById("cidadeProf").textContent  = usuario.cidade || "—";

// ── Itens de configuração ────────────────────────────────────
document.getElementById("emailProf").textContent = usuario.email;
document.getElementById("escolaItem").textContent = usuario.escola || "—";

document.getElementById("interessesProf").textContent =
  usuario.interesses?.length ? usuario.interesses.join(", ") : "—";

const metodos = { videos: "Vídeos", textos: "Textos e leitura" };
document.getElementById("metodoProf").textContent =
  metodos[usuario.metodoAprender] || "—";

// ── Toggle notificações ──────────────────────────────────────
const toggleNotif = document.getElementById("toggleNotif");
let notifAtivo = true;

toggleNotif.addEventListener("click", () => {
  notifAtivo = !notifAtivo;
  toggleNotif.textContent      = notifAtivo ? "Ativo" : "Inativo";
  toggleNotif.ariaPressed      = notifAtivo;
  toggleNotif.style.background = notifAtivo ? "var(--cor-botoes)" : "#ccc";
});

// ── Salvar alterações ────────────────────────────────────────
document.getElementById("salvarPerfil").addEventListener("click", () => {
  const status = document.getElementById("statusPerfil");
  status.textContent = "✅ Alterações salvas!";
  setTimeout(() => {
    status.textContent = "Seus dados estão atualizados.";
  }, 3000);
});

// ── Logout — ícone engrenagem e botão sair ───────────────────
function confirmarSaida() {
  if (confirm("Deseja sair da sua conta?")) DB.Auth.logout();
}

document.getElementById("btnLogout").addEventListener("click", confirmarSaida);
document.getElementById("btnSair").addEventListener("click", confirmarSaida);