document.addEventListener("DOMContentLoaded", () => {

  const usuario = DB.Sessao.exigir();
  const primeiroNome = usuario.nome.split(" ")[0];

  // ── Header ─────────────────────────────────────────────────
  document.querySelector(".header h2").textContent    = `Olá, ${primeiroNome}!`;

  // ── Progresso dinâmico (baseado em aulas concluídas) ───────
  const aulas        = _getAulasConcluidas(usuario.id);
  const totalAulas   = 10; // total de aulas da trilha atual
  const pct          = Math.round((aulas / totalAulas) * 100);

  document.querySelector(".progresso .top span").textContent = `${pct}%`;
  document.querySelector(".progresso .fill").style.width     = `${pct}%`;

});

// ── Helpers ───────────────────────────────────────────────────
function _getAulasConcluidas(userId) {
  const raw = localStorage.getItem(`aprendimais_aulas_${userId}`);
  if (!raw) return 0;
  const aulas = JSON.parse(raw);
  return aulas.filter(a => a.done).length;
}