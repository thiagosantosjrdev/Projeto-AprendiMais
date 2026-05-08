// ============================================================
//  Aprendi+ | dashboard/professor/professor-index.js
//  Depende de: Database.js
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  const professor = DB.Sessao.exigir();
  if (professor.tipo !== "professor") {
    window.location.href = "../dashboard/aluno/index.html";
    return;
  }

  const primeiroNome = professor.nome.split(" ")[0];

  // ── Header ─────────────────────────────────────────────────
  document.getElementById("saudacao").textContent     = `Olá, ${primeiroNome}!`;

  // ── Modal turma — lista alunos ──────────────────────────────
  const grupos      = DB.Usuarios.turmasDoProfessor(professor.id);
  const todosAlunos = DB.Usuarios.listarAlunos();
  const alunosVinc  = grupos.flatMap(g => g.series.flatMap(s => s.turmas.flatMap(t => t.alunos)));
  const listaFinal  = alunosVinc.length ? alunosVinc : todosAlunos;

  document.getElementById("totalAlunosLabel").textContent = `(${listaFinal.length})`;
  document.getElementById("lista-alunos-modal").innerHTML = listaFinal.length
    ? listaFinal.map(a => `
        <div class="aluno-row">
          <div class="aluno-avatar">${a.nome[0].toUpperCase()}</div>
          <div class="aluno-info">
            <p class="nome">${a.nome}</p>
            <p class="meta">${a.serie || "—"} · Turma ${a.turma || "—"} · ${a.escola || "—"}</p>
          </div>
        </div>`).join("")
    : `<p style="color:var(--cor-paragrafo);text-align:center;margin-top:16px;">Nenhum aluno cadastrado ainda.</p>`;

  // ── Estrutura de turmas compartilhada ─────────────────────
  window.estruturaTurmas = DB.Usuarios.turmasDoProfessor(professor.id);

  // ── Popula selects de MENSAGENS ────────────────────────────
  _popularSelectEscola("msgEscola", window.estruturaTurmas, () => {
    if (typeof carregarSeriesMensagem === "function") carregarSeriesMensagem();
  });

  // ── Popula selects de ATIVIDADES ───────────────────────────
  _popularSelectEscola("atividadeEscola", window.estruturaTurmas, () => {
    if (typeof carregarSeriesAtividade === "function") carregarSeriesAtividade();
  });

});

// ── Helper: popula um select de escola ───────────────────────
function _popularSelectEscola(selectId, estrutura, autoCallback) {
  const sel = document.getElementById(selectId);
  if (!sel) return;

  sel.innerHTML = `<option value="">Selecione a escola</option>`;

  if (!estrutura.length) {
    sel.innerHTML = `<option value="">Nenhuma turma vinculada</option>`;
    sel.disabled  = true;
    return;
  }

  estrutura.forEach((grupo, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = grupo.cidade
      ? `${grupo.escola} (${grupo.cidade}/${grupo.uf})`
      : grupo.escola;
    sel.appendChild(opt);
  });

  if (estrutura.length === 1) {
    sel.value = "0";
    if (autoCallback) autoCallback();
  }
}

// ── Selects encadeados — MENSAGENS ───────────────────────────
function carregarSeriesMensagem() {
  const escolaIndex = document.getElementById("msgEscola").value;
  const selSerie    = document.getElementById("msgSerie");
  const selTurma    = document.getElementById("msgTurma");

  selSerie.innerHTML = `<option value="">Selecione a série</option>`;
  selTurma.innerHTML = `<option value="">Selecione a turma</option>`;
  selTurma.disabled  = true;

  if (escolaIndex === "") { selSerie.disabled = true; return; }
  selSerie.disabled = false;

  window.estruturaTurmas[escolaIndex].series.forEach((s, i) => {
    const opt = document.createElement("option");
    opt.value = i; opt.textContent = s.serie;
    selSerie.appendChild(opt);
  });

  if (window.estruturaTurmas[escolaIndex].series.length === 1) {
    selSerie.value = "0";
    carregarTurmasMensagem();
  }
}

function carregarTurmasMensagem() {
  const escolaIndex = document.getElementById("msgEscola").value;
  const serieIndex  = document.getElementById("msgSerie").value;
  const selTurma    = document.getElementById("msgTurma");

  selTurma.innerHTML = `<option value="">Selecione a turma</option>`;
  if (serieIndex === "") { selTurma.disabled = true; return; }
  selTurma.disabled = false;

  window.estruturaTurmas[escolaIndex].series[serieIndex].turmas.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Turma ${t.turma} (${t.alunos.length} aluno${t.alunos.length !== 1 ? "s" : ""})`;
    selTurma.appendChild(opt);
  });

  if (window.estruturaTurmas[escolaIndex].series[serieIndex].turmas.length === 1)
    selTurma.value = "0";
}

function enviarMensagemTurma() {
  const texto       = document.getElementById("msgTexto").value.trim();
  const escolaIndex = document.getElementById("msgEscola").value;
  const serieIndex  = document.getElementById("msgSerie").value;
  const turmaIndex  = document.getElementById("msgTurma").value;

  if (escolaIndex === "" || serieIndex === "" || turmaIndex === "") {
    mostrarToast("Selecione escola, série e turma.");
    return;
  }
  if (!texto) { mostrarToast("Digite uma mensagem."); return; }

  const turma = window.estruturaTurmas[escolaIndex].series[serieIndex].turmas[turmaIndex];
  document.getElementById("msgTexto").value = "";
  fecharModal();
  mostrarToast(`Mensagem enviada para ${turma.alunos.length} aluno${turma.alunos.length !== 1 ? "s" : ""} da Turma ${turma.turma}`);
}

// ── Selects encadeados — ATIVIDADES ─────────────────────────
function carregarSeriesAtividade() {
  const escolaIndex = document.getElementById("atividadeEscola").value;
  const selSerie    = document.getElementById("atividadeSerie");
  const selTurma    = document.getElementById("atividadeTurma");

  selSerie.innerHTML = `<option value="">Selecione a série</option>`;
  selTurma.innerHTML = `<option value="">Selecione a turma</option>`;
  selTurma.disabled  = true;

  if (escolaIndex === "") { selSerie.disabled = true; return; }
  selSerie.disabled = false;

  window.estruturaTurmas[escolaIndex].series.forEach((s, i) => {
    const opt = document.createElement("option");
    opt.value = i; opt.textContent = s.serie;
    selSerie.appendChild(opt);
  });

  if (window.estruturaTurmas[escolaIndex].series.length === 1) {
    selSerie.value = "0";
    carregarTurmasAtividade();
  }
}

function carregarTurmasAtividade() {
  const escolaIndex = document.getElementById("atividadeEscola").value;
  const serieIndex  = document.getElementById("atividadeSerie").value;
  const selTurma    = document.getElementById("atividadeTurma");

  selTurma.innerHTML = `<option value="">Todas as turmas desta série</option>`;
  if (serieIndex === "") { selTurma.disabled = true; return; }
  selTurma.disabled = false;

  window.estruturaTurmas[escolaIndex].series[serieIndex].turmas.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Turma ${t.turma} (${t.alunos.length} aluno${t.alunos.length !== 1 ? "s" : ""})`;
    selTurma.appendChild(opt);
  });
}

// ── Criar atividade ──────────────────────────────────────────
function criarAtividade() {
  const titulo      = document.getElementById("atividadeTitulo").value.trim();
  const data        = document.getElementById("atividadeData").value;
  const escolaIndex = document.getElementById("atividadeEscola").value;
  const serieIndex  = document.getElementById("atividadeSerie").value;
  const turmaIndex  = document.getElementById("atividadeTurma").value;
  const icone       = document.querySelector("input[name='iconeAtividade']:checked")?.value || "bi-file-earmark-text";

  if (!titulo || !data) { mostrarToast("Preencha título e data!"); return; }
  if (escolaIndex === "" || serieIndex === "") { mostrarToast("Selecione escola e série."); return; }

  // Monta label de destino
  const escola = window.estruturaTurmas[escolaIndex];
  const serie  = escola.series[serieIndex];
  const turmaLabel = turmaIndex !== ""
    ? `Turma ${serie.turmas[turmaIndex].turma}`
    : "Todas as turmas";
  const totalAlunos = turmaIndex !== ""
    ? serie.turmas[turmaIndex].alunos.length
    : serie.turmas.reduce((acc, t) => acc + t.alunos.length, 0);

  // Injeta no modal de atividades
  const lista    = document.getElementById("modal-atividades");
  const botao    = lista.querySelector(".btn-enviar");
  const novaDiv  = document.createElement("div");
  novaDiv.className = "atividade-item";
  novaDiv.innerHTML = `
    <div class="ativ-icon"><i class="bi ${icone}"></i></div>
    <div class="ativ-info">
      <p class="ativ-titulo">${titulo}</p>
      <p class="ativ-meta">Entrega: ${formatarData(data)} · ${totalAlunos} aluno${totalAlunos !== 1 ? "s" : ""} · ${turmaLabel}</p>
    </div>
    <span class="badge badge-pendente">Pendente</span>
  `;
  lista.insertBefore(novaDiv, botao);

  // Limpa campos
  document.getElementById("atividadeTitulo").value = "";
  document.getElementById("atividadeData").value   = "";
  document.getElementById("atividadeEscola").value = "";
  document.getElementById("atividadeSerie").innerHTML  = `<option value="">Selecione a série</option>`;
  document.getElementById("atividadeSerie").disabled   = true;
  document.getElementById("atividadeTurma").innerHTML  = `<option value="">Selecione a turma</option>`;
  document.getElementById("atividadeTurma").disabled   = true;
  document.querySelector("input[name='iconeAtividade'][value='bi-file-earmark-text']").checked = true;

  fecharModal();
  mostrarToast(`Atividade criada para ${turmaLabel} — ${serie.serie}!`);
}

// ── Expõe tudo globalmente ────────────────────────────────────
window.carregarSeriesMensagem    = carregarSeriesMensagem;
window.carregarTurmasMensagem    = carregarTurmasMensagem;
window.enviarMensagemTurma       = enviarMensagemTurma;
window.carregarSeriesAtividade   = carregarSeriesAtividade;
window.carregarTurmasAtividade   = carregarTurmasAtividade;
window.criarAtividade            = criarAtividade;