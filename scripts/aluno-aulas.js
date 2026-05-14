// ============================================================
//  Aprendi+ | dashboard/aluno/aulas.js
//  Depende de: Database.js
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  const usuario = DB.Sessao.exigir();

  // ── Avatar no header ────────────────────────────────────────
  const primeiroNome = usuario.nome.split(" ")[0];

  // ── Carrega estado salvo das aulas ───────────────────────────
  const chave     = `aprendimais_aulas_${usuario.id}`;
  let estadoAulas = _carregarEstado(chave);

  // ── Inicializa cards com estado salvo ────────────────────────
  const cards = document.querySelectorAll(".aula-card");

  cards.forEach((card, i) => {
    const id     = card.dataset.aulaId || `aula_${i}`;
    card.dataset.aulaId = id;

    // Se tem estado salvo, aplica
    if (estadoAulas[id] !== undefined) {
      const feita = estadoAulas[id];
      _aplicarEstado(card, feita);
    }
  });

  // ── Progresso inicial ────────────────────────────────────────
  atualizarProgresso();

  // ── Marcar / desmarcar aula ──────────────────────────────────
  cards.forEach(card => {
    const btn = card.querySelector(".marcar-aula");
    btn.addEventListener("click", () => {
      const id    = card.dataset.aulaId;
      const feita = card.dataset.done === "true";

      _aplicarEstado(card, !feita);

      // Salva no localStorage
      estadoAulas[id] = !feita;
      _salvarEstado(chave, estadoAulas);

      atualizarProgresso();
      aplicarFiltro();
    });
  });

  // ── Filtros ──────────────────────────────────────────────────
  function aplicarFiltro() {
    const ativo = document.querySelector("input[name='filtro']:checked")?.value || "todas";
    cards.forEach(card => {
      const mostrar =
        ativo === "todas" ||
        (ativo === "hoje"      && card.dataset.status === "hoje") ||
        (ativo === "concluida" && card.dataset.done   === "true");
      card.style.display = mostrar ? "" : "none";
    });
  }

  document.querySelectorAll("input[name='filtro']").forEach(f =>
    f.addEventListener("change", aplicarFiltro)
  );

  // ── Progresso ────────────────────────────────────────────────
  function atualizarProgresso() {
    const total      = cards.length;
    const concluidas = [...cards].filter(c => c.dataset.done === "true").length;
    const pct        = total ? Math.round((concluidas / total) * 100) : 0;

    document.getElementById("progressoTexto").textContent = `${pct}%`;
    document.getElementById("progressoFill").style.width  = `${pct}%`;
  }

});

// ── Aplica estado visual no card ──────────────────────────────
function _aplicarEstado(card, feita) {
  const btn    = card.querySelector(".marcar-aula");
  const status = card.querySelector(".aula-status");

  card.dataset.done   = feita;
  card.dataset.status = feita ? "concluida" : "hoje";

  if (status) {
    status.textContent = feita ? "Concluída" : "Pendente";
    status.classList.toggle("concluida", feita);
  }
  if (btn) btn.textContent = feita ? "Marcar como pendente" : "Marcar como concluída";
}

// ── Persistência ──────────────────────────────────────────────
function _carregarEstado(chave) {
  try {
    const raw = localStorage.getItem(chave);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function _salvarEstado(chave, estado) {
  localStorage.setItem(chave, JSON.stringify(estado));
}