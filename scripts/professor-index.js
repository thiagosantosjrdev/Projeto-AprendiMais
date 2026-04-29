
const usuario = DB.Sessao.exigir();

// Garante que é professor
if (usuario.tipo !== "professor") {
  window.location.href = "/dashboard/aluno/index.html";
}

const primeiroNome = usuario.nome.split(" ")[0];
const inicial      = primeiroNome[0].toUpperCase();

// ── Header ───────────────────────────────────────────────────
document.querySelector(".header h2").textContent   = `Olá, ${primeiroNome}!`;

// ── Modal turma — lista alunos do banco ──────────────────────
const alunos = DB.Usuarios.listarAlunos();

const listaHTML = alunos.length
  ? alunos.map((a) => `
      <div style="display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid #f0f0f5;">
        <div style="width:36px; height:36px; border-radius:50%; background:rgba(116,99,227,0.12);
                    display:flex; align-items:center; justify-content:center;
                    font-weight:bold; color:var(--cor-botoes); flex-shrink:0;">
          ${a.nome[0].toUpperCase()}
        </div>
        <div>
          <p style="margin:0; font-weight:bold; font-size:0.9em;">${a.nome}</p>
          <p style="margin:0; font-size:0.78em; color:var(--cor-paragrafo);">${a.serie || "Série não informada"} · ${a.escola || "Escola não informada"}</p>
        </div>
      </div>`).join("")
  : `<p style="color:var(--cor-paragrafo); text-align:center; margin-top:16px;">Nenhum aluno cadastrado ainda.</p>`;

document.querySelector("#modal-turma").innerHTML = `
  <div class="modal-handle"></div>
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h3 style="margin:0;">Alunos (${alunos.length})</h3>
    <i class="bi bi-x-lg" onclick="fecharModal()" style="cursor:pointer; font-size:1.2em; color:#888;"></i>
  </div>
  ${listaHTML}
`;