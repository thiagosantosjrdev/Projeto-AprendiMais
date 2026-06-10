// ============================================================
//  Aprendi+ | dashboard/aluno/aluno-aulas.js
//  Depende de: Database.js + aulasDB.js
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  const usuario = DB.Sessao.exigir();

  // ── Carrega aulas do professor ──────────────────────────────
  const aulas    = AulasDB.paraAluno(usuario);
  const progresso = AulasDB.getProgresso(usuario.id);

  // ── Banner ──────────────────────────────────────────────────
  document.getElementById("bannerTitulo").textContent =
    `${usuario.serie} · Turma ${usuario.turma}`;
  document.getElementById("bannerSub").textContent =
    aulas.length > 0
      ? `${aulas.length} aula${aulas.length > 1 ? "s" : ""} disponível${aulas.length > 1 ? "is" : ""}`
      : "Nenhuma aula disponível ainda";

  // ── Progresso ───────────────────────────────────────────────
  function atualizarProgresso() {
    const prog  = AulasDB.getProgresso(usuario.id);
    const total = aulas.length;
    const feitas = aulas.filter(a => prog[a.id]).length;
    const pct   = total ? Math.round((feitas / total) * 100) : 0;
    document.getElementById("progressoTexto").textContent = `${pct}%`;
    document.getElementById("progressoFill").style.width  = `${pct}%`;
  }

  atualizarProgresso();

  // ── Render lista ─────────────────────────────────────────────
  const TIPOS = {
    video:     { classe: "tipo-video",     icone: "bi-play-btn",          label: "Vídeo"      },
    texto:     { classe: "tipo-texto",     icone: "bi-file-earmark-text", label: "Texto"      },
    exercicio: { classe: "tipo-exercicio", icone: "bi-pencil-square",     label: "Exercício"  },
  };

  function renderLista(filtro = "todas") {
    const lista = document.getElementById("listaAulas");
    const prog  = AulasDB.getProgresso(usuario.id);

    let itens = [...aulas];
    if (filtro === "pendente")  itens = itens.filter(a => !prog[a.id]);
    if (filtro === "concluida") itens = itens.filter(a =>  prog[a.id]);

    if (!itens.length) {
      lista.innerHTML = `
        <div class="vazio-aulas">
          <i class="bi bi-mortarboard"></i>
          <p>${filtro === "concluida"
            ? "Você ainda não concluiu nenhuma aula."
            : filtro === "pendente"
            ? "Todas as aulas foram concluídas! 🎉"
            : "Seu professor ainda não enviou aulas.<br>Fique de olho por aqui!"
          }</p>
        </div>`;
      return;
    }

    lista.innerHTML = itens.map(a => {
      const feita = !!prog[a.id];
      const tipo  = TIPOS[a.tipo] || TIPOS.video;
      const data  = new Date(a.criadaEm).toLocaleDateString("pt-BR", { day:"2-digit", month:"short" });

      return `
        <div class="aula-card">
          <div class="aula-topo">
            <div>
              <span class="tipo-badge ${tipo.classe}">
                <i class="bi ${tipo.icone}"></i> ${tipo.label}
              </span>
              <p class="aula-titulo">${a.titulo}</p>
              <p class="aula-meta">${a.duracao ? a.duracao + " min · " : ""}${data}</p>
            </div>
            <span class="aula-status ${feita ? "concluida" : ""}">
              ${feita ? "Concluída" : "Pendente"}
            </span>
          </div>

          ${a.descricao ? `<p style="font-size:0.82em;color:var(--cor-paragrafo);margin:0 0 10px;">${a.descricao}</p>` : ""}

          <div class="aula-prof">
            <div class="aula-prof-avatar">${a.professorNome[0].toUpperCase()}</div>
            ${a.professorNome}
          </div>

          <div class="aula-acoes">
            <button class="btn-aula btn-ver" onclick="abrirAula('${a.id}')">
              <i class="bi bi-${tipo.icone}"></i> Ver conteúdo
            </button>
            <button class="btn-aula btn-concluir ${feita ? "feita" : ""}"
                    onclick="toggleConcluir('${a.id}', this)">
              ${feita ? "✓ Concluída" : "Marcar concluída"}
            </button>
          </div>
        </div>`;
    }).join("");
  }

  renderLista();

  // ── Filtros ──────────────────────────────────────────────────
  document.querySelectorAll("input[name='filtro']").forEach(f =>
    f.addEventListener("change", () => renderLista(f.value))
  );

  // ── Toggle concluída ─────────────────────────────────────────
  window.toggleConcluir = function(aulaId, btn) {
    const prog  = AulasDB.getProgresso(usuario.id);
    const feita = !!prog[aulaId];
    AulasDB.salvarProgresso(usuario.id, aulaId, !feita);
    atualizarProgresso();

    // Atualiza botão e status sem re-render completo
    btn.textContent = feita ? "Marcar concluída" : "✓ Concluída";
    btn.classList.toggle("feita", !feita);
    const card   = btn.closest(".aula-card");
    const status = card.querySelector(".aula-status");
    status.textContent = feita ? "Pendente" : "Concluída";
    status.classList.toggle("concluida", !feita);

    // Atualiza botão no modal se estiver aberto
    const modalBtn = document.getElementById("modalBtnConcluir");
    if (window._aulaModalAtiva === aulaId) {
      modalBtn.textContent = feita ? "Marcar como concluída" : "✓ Já concluída";
      modalBtn.classList.toggle("feita", !feita);
    }
  };

  // ── Abre modal de conteúdo ───────────────────────────────────
  window.abrirAula = function(aulaId) {
    const aula = aulas.find(a => a.id === aulaId);
    if (!aula) return;

    window._aulaModalAtiva = aulaId;
    const prog  = AulasDB.getProgresso(usuario.id);
    const feita = !!prog[aulaId];
    const tipo  = TIPOS[aula.tipo] || TIPOS.video;

    document.getElementById("modalAulaTitulo").textContent = aula.titulo;
    document.getElementById("modalAulaProf").textContent   =
      `Prof. ${aula.professorNome} · ${new Date(aula.criadaEm).toLocaleDateString("pt-BR")}`;

    const conteudo = document.getElementById("modalAulaConteudo");

    if (aula.tipo === "video" && aula.link) {
      const videoId = _extrairYouTubeId(aula.link);
      conteudo.innerHTML = videoId
        ? `<div class="video-embed">
             <iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
           </div>`
        : `<a href="${aula.link}" target="_blank" class="btn-aula btn-ver" style="display:block;text-align:center;">
             <i class="bi bi-play-btn"></i> Abrir vídeo
           </a>`;
    } else if (aula.tipo === "texto") {
      conteudo.innerHTML = `<div class="aula-conteudo-texto">${aula.link || "Conteúdo não disponível."}</div>`;
    } else {
      conteudo.innerHTML = aula.link
        ? `<a href="${aula.link}" target="_blank" class="btn-aula btn-ver" style="display:block;text-align:center;margin:12px 0;">
             <i class="bi bi-box-arrow-up-right"></i> Acessar exercício
           </a>`
        : `<div class="aula-conteudo-texto">${aula.descricao || "Sem conteúdo adicional."}</div>`;
    }

    const modalBtn = document.getElementById("modalBtnConcluir");
    modalBtn.textContent = feita ? "✓ Já concluída" : "Marcar como concluída";
    modalBtn.classList.toggle("feita", feita);

    document.getElementById("modal-overlay").style.display = "block";
    document.getElementById("modal-aula").classList.add("aberto");
    document.body.style.overflow = "hidden";
  };

  window.fecharModal = function() {
    document.getElementById("modal-aula").classList.remove("aberto");
    document.getElementById("modal-overlay").style.display = "none";
    document.body.style.overflow = "";
    window._aulaModalAtiva = null;
  };

  window.concluirDoModal = function() {
    if (!window._aulaModalAtiva) return;
    const btn = document.querySelector(
      `.aula-card .btn-concluir[onclick="toggleConcluir('${window._aulaModalAtiva}', this)"]`
    );
    toggleConcluir(window._aulaModalAtiva, btn || document.createElement("button"));
    fecharModal();
    const filtroAtivo = document.querySelector("input[name='filtro']:checked")?.value || "todas";
    renderLista(filtroAtivo);
    atualizarProgresso();
  };

  // ── Helper: extrai ID do YouTube ─────────────────────────────
  function _extrairYouTubeId(url) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  }

});