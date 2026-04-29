  // ── Proteção de rota ────────────────────────────────────────
  const professor = DB.Sessao.exigir();
  if (professor.tipo !== "professor") window.location.href = "/dashboard/aluno/index.html";

  // ── Mapeamentos legíveis ────────────────────────────────────
  const freqMap = {
    "todos-dias":    "Todo dia",
    "3-4-semana":    "3–4×/sem",
    "1-2-semana":    "1–2×/sem",
    "finais-semana": "Fins de sem.",
  };
  const periodoMap = { manha: "Manhã", tarde: "Tarde", noite: "Noite", madrugada: "Madrugada" };
  const prefMap    = { sozinho: "Sozinho", grupo: "Em grupo", ambos: "Ambos" };

  // ── Progresso fake por aluno (sem backend real) ─────────────
  function progressoFake(id) {
    // gera um número estável baseado no id do aluno
    const hash = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return 40 + (hash % 51); // entre 40% e 90%
  }

  function statusInfo(pct) {
    if (pct >= 80) return { label: "Ótimo",   cls: "badge-otimo"   };
    if (pct >= 65) return { label: "Bom",     cls: "badge-bom"     };
    if (pct >= 50) return { label: "Regular", cls: "badge-regular" };
    return               { label: "Atenção",  cls: "badge-atencao" };
  }

  // ── Renderiza lista ─────────────────────────────────────────
  const alunos = DB.Usuarios.listarAlunos();
  document.getElementById("subtituloTurma").textContent =
    `${alunos.length} aluno${alunos.length !== 1 ? "s" : ""} cadastrado${alunos.length !== 1 ? "s" : ""}`;

  function renderLista(lista) {
    const container = document.getElementById("listaAlunos");
    const vazio     = document.getElementById("vazio");
    container.innerHTML = "";

    if (!lista.length) { vazio.style.display = "block"; return; }
    vazio.style.display = "none";

    lista.forEach((aluno) => {
      const pct    = progressoFake(aluno.id);
      const status = statusInfo(pct);
      const inicial = aluno.nome[0].toUpperCase();

      const card = document.createElement("div");
      card.className = "aluno-card";
      card.innerHTML = `
        <div class="info">
          <div class="avatar">${inicial}</div>
          <div>
            <p class="aluno-nome">
              ${aluno.nome}
              <span class="status-badge ${status.cls}">${status.label}</span>
            </p>
            <p class="aluno-sub">${aluno.serie || "Série não informada"}</p>
          </div>
        </div>
        <div class="nota">${pct}%</div>
      `;
      card.addEventListener("click", () => abrirAluno(aluno, pct));
      container.appendChild(card);
    });
  }

  renderLista(alunos);

  // ── Busca ───────────────────────────────────────────────────
  function filtrarAlunos() {
    const termo = document.getElementById("busca").value.toLowerCase();
    renderLista(alunos.filter((a) => a.nome.toLowerCase().includes(termo)));
  }

  // ── Modal ───────────────────────────────────────────────────
  function abrirAluno(aluno, pct) {
    const status = statusInfo(pct);

    document.getElementById("modalAvatar").textContent     = aluno.nome[0].toUpperCase();
    document.getElementById("modalNome").textContent       = aluno.nome;
    document.getElementById("modalMeta").textContent       = `${aluno.serie || "—"} · ${aluno.escola || "—"}`;
    document.getElementById("modalProgresso").textContent  = pct + "%";
    document.getElementById("modalFrequencia").textContent = freqMap[aluno.frequencia] || "—";
    document.getElementById("modalPeriodo").textContent    = periodoMap[aluno.periodo]  || "—";
    document.getElementById("modalPreferencia").textContent = prefMap[aluno.preferencia] || "—";

    const tags = (aluno.interesses || [])
      .map((i) => `<span class="tag">${i}</span>`)
      .join("") || "<span style='color:var(--cor-paragrafo); font-size:0.85em;'>Não informado</span>";
    document.getElementById("modalInteresses").innerHTML = tags;

    document.getElementById("modal-overlay").style.display = "block";
    document.getElementById("modal-aluno").style.display   = "block";
    document.body.style.overflow = "hidden";
  }

  function fecharModal() {
    document.getElementById("modal-overlay").style.display = "none";
    document.getElementById("modal-aluno").style.display   = "none";
    document.body.style.overflow = "";
  }

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharModal(); });