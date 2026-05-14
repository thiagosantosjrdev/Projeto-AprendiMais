document.addEventListener("DOMContentLoaded", () => {

  const usuario = DB.Sessao.exigir();

  // ── Streak ─────────────────────────────────────────────────
  const streak = _carregarStreak(usuario.id);
  _renderStreak(streak);

  // ── Verifica se já fez hoje ──────────────────────────────
  const hoje       = new Date().toDateString();
  const chaveHoje  = `aprendimais_desafio_feito_${usuario.id}_${hoje}`;
  const resultadoHoje = localStorage.getItem(chaveHoje);

  if (resultadoHoje) {
    const res = JSON.parse(resultadoHoje);
    document.getElementById("areaQuestao").style.display  = "none";
    document.getElementById("questoesProg").style.display = "none";
    document.getElementById("telaJaFeito").style.display  = "block";
    document.getElementById("jaFeitoAcertos").textContent = `${res.acertos}/${res.total}`;
    document.getElementById("jaFeitoStreak").textContent  = streak.atual;
    return;
  }

  // ── Carrega questões do dia ──────────────────────────────
  const questoes = selecionarQuestoesDia(usuario);
  if (!questoes.length) return;

  // ── Estado do desafio ────────────────────────────────────
  let indice   = 0;
  let acertos  = 0;
  let respostas = []; // "correta" | "errada" | null
  questoes.forEach(() => respostas.push(null));

  renderDots();
  renderQuestao(questoes[indice]);

  // ── Render dots de progresso ─────────────────────────────
  function renderDots() {
    const container = document.getElementById("questoesProg");
    container.innerHTML = questoes.map((_, i) => {
      const cls = respostas[i] === "correta" ? "correta"
                : respostas[i] === "errada"  ? "errada"
                : i === indice               ? "ativa"
                : "";
      return `<div class="questao-dot ${cls}"></div>`;
    }).join("");
  }

  // ── Render questão ───────────────────────────────────────
  function renderQuestao(q) {
    document.getElementById("questaoMateria").textContent  = q.materia;
    document.getElementById("questaoEnunciado").textContent = q.enunciado;

    const alts  = document.getElementById("alternativas");
    const disser = document.getElementById("dissertativaInput");
    const btn    = document.getElementById("btnAcao");
    const fb     = document.getElementById("feedbackBox");

    alts.innerHTML = "";
    disser.style.display = "none";
    disser.value = "";
    fb.style.display = "none";
    btn.disabled = true;
    btn.textContent = "Confirmar resposta";
    btn.classList.remove("verde");
    btn.onclick = acaoBotao;

    if (q.tipo === "dissertativa") {
      disser.style.display = "block";
      disser.disabled = false;
    } else {
      // múltipla ou texto
      const letras = ["A", "B", "C", "D"];
      q.alternativas.forEach((alt, i) => {
        const b = document.createElement("button");
        b.className = "alt-btn";
        b.type = "button";
        b.innerHTML = `<span class="alt-letra">${letras[i]}</span> ${alt}`;
        b.addEventListener("click", () => selecionarAlternativa(i, q));
        alts.appendChild(b);
      });
    }
  }

  // ── Selecionar alternativa ───────────────────────────────
  let selecaoAtual = null;

  function selecionarAlternativa(i, q) {
    selecaoAtual = i;
    document.querySelectorAll(".alt-btn").forEach((b, idx) => {
      b.classList.remove("correta", "errada");
      b.style.borderColor = idx === i ? "var(--cor-botoes)" : "";
      b.style.background  = idx === i ? "rgba(116,99,227,0.08)" : "";
    });
    document.getElementById("btnAcao").disabled = false;
  }

  // ── Verificar dissertativa ───────────────────────────────
  window.verificarDissertativa = function() {
    const val = document.getElementById("dissertativaInput").value.trim();
    document.getElementById("btnAcao").disabled = val.length < 5;
  };

  // ── Ação do botão (confirmar / próxima) ──────────────────
  let esperandoProxima = false;

  window.acaoBotao = function() {
    if (esperandoProxima) {
      proximaQuestao();
      return;
    }
    confirmarResposta();
  };

  function confirmarResposta() {
    const q    = questoes[indice];
    const btn  = document.getElementById("btnAcao");
    const fb   = document.getElementById("feedbackBox");
    const ft   = document.getElementById("feedbackTitulo");
    const ftx  = document.getElementById("feedbackTexto");
    const disser = document.getElementById("dissertativaInput");

    let acertou = false;

    if (q.tipo === "dissertativa") {
      // Dissertativa: sempre mostra gabarito e conta como correta se tentou
      disser.disabled = true;
      acertou = true; // crédito por tentar
      ft.textContent  = "📝 Gabarito";
      ftx.textContent = q.gabarito + "\n\n" + q.explicacao;
      fb.className    = "feedback-box correto";
      respostas[indice] = "correta";
      acertos++;
    } else {
      const correto = selecaoAtual === q.correta;
      acertou = correto;

      document.querySelectorAll(".alt-btn").forEach((b, i) => {
        b.disabled = true;
        if (i === q.correta)  b.classList.add("correta");
        if (i === selecaoAtual && !correto) b.classList.add("errada");
      });

      if (correto) {
        ft.textContent  = "✅ Correto!";
        ftx.textContent = q.explicacao;
        fb.className    = "feedback-box correto";
        respostas[indice] = "correta";
        acertos++;
      } else {
        ft.textContent  = "❌ Não foi dessa vez!";
        ftx.textContent = q.explicacao;
        fb.className    = "feedback-box errado";
        respostas[indice] = "errada";
      }
    }

    fb.style.display  = "block";
    selecaoAtual      = null;
    esperandoProxima  = true;

    renderDots();

    const isUltima = indice === questoes.length - 1;
    btn.disabled    = false;
    btn.textContent = isUltima ? "Ver resultado" : "Próxima questão →";
    btn.classList.toggle("verde", acertou);
  }

  function proximaQuestao() {
    esperandoProxima = false;
    selecaoAtual     = null;

    if (indice < questoes.length - 1) {
      indice++;
      renderDots();
      renderQuestao(questoes[indice]);
    } else {
      concluirDesafio();
    }
  }

  // ── Conclusão ────────────────────────────────────────────
  function concluirDesafio() {
    const novoStreak = _atualizarStreak(usuario.id);
    const pontos     = acertos * 10 + (acertos === questoes.length ? 5 : 0); // bônus perfeito

    // Salva resultado de hoje
    localStorage.setItem(chaveHoje, JSON.stringify({
      acertos, total: questoes.length, pontos,
    }));

    // Atualiza pontos totais
    const chavePontos = `aprendimais_pontos_${usuario.id}`;
    const ptAtual     = Number(localStorage.getItem(chavePontos) || 0);
    localStorage.setItem(chavePontos, ptAtual + pontos);

    document.getElementById("areaQuestao").style.display  = "none";
    document.getElementById("questoesProg").style.display = "none";
    document.getElementById("telaConclusao").classList.add("visivel");

    document.getElementById("statAcertos").textContent = `${acertos}/${questoes.length}`;
    document.getElementById("statStreak").textContent  = novoStreak;
    document.getElementById("statPontos").textContent  = `+${pontos}`;

    const perfeito = acertos === questoes.length;
    document.getElementById("conclusaoIcone").textContent = perfeito ? "🏆" : "🎉";
    document.getElementById("conclusaoTitulo").textContent = perfeito ? "Pontuação perfeita!" : "Desafio concluído!";
    document.getElementById("conclusaoSub").textContent   = perfeito
      ? "Incrível! Você acertou tudo hoje. Continue assim! 💪"
      : `Você acertou ${acertos} de ${questoes.length} questões. Amanhã vai melhor!`;

    _renderStreak({ atual: novoStreak, recorde: Math.max(novoStreak, streak.recorde) });
  }

  // ── Streak helpers ───────────────────────────────────────
  function _carregarStreak(userId) {
    const raw = localStorage.getItem(`aprendimais_streak_${userId}`);
    return raw ? JSON.parse(raw) : { atual: 0, recorde: 0, ultimodia: null };
  }

  function _atualizarStreak(userId) {
    const s    = _carregarStreak(userId);
    const hoje = new Date().toDateString();
    const ontem = new Date(); ontem.setDate(ontem.getDate() - 1);

    if (s.ultimodia === hoje) return s.atual; // já contou hoje
    if (s.ultimodia === ontem.toDateString()) {
      s.atual++; // dia consecutivo
    } else {
      s.atual = 1; // reinicia
    }
    s.recorde  = Math.max(s.atual, s.recorde);
    s.ultimodia = hoje;
    localStorage.setItem(`aprendimais_streak_${userId}`, JSON.stringify(s));
    return s.atual;
  }

  function _renderStreak(s) {
    document.getElementById("streakNum").textContent    = s.atual;
    document.getElementById("streakRecord").textContent = s.recorde > 0 ? `Recorde: ${s.recorde} dias` : "";
  }

});
