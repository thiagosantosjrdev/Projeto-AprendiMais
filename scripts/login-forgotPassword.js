let emailAtual = null;

// Trocar de tela
function irParaStep(step) {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById(step).classList.add("active");
}

// STEP 1 - verificar email
document.getElementById("btnVerificar").addEventListener("click", verificarEmail);

function verificarEmail() {
  const email = document.getElementById("emailRecup").value.trim();
  const erro  = document.getElementById("erroEmail");
  const btn   = document.getElementById("btnVerificar");

  if (!email) return;

  btn.disabled = true;
  btn.textContent = "Verificando...";

  setTimeout(() => {
    const usuario = DB.Usuarios.buscarPorEmail(email);

    if (!usuario) {
      erro.style.display = "block";
      btn.disabled = false;
      btn.textContent = "Continuar";
      return;
    }

    erro.style.display = "none";
    emailAtual = email;
    document.getElementById("emailExibido").textContent = email;

    btn.textContent = "Continuar";
    btn.disabled = false;

    irParaStep("step2");
  }, 800);
}

// STEP 2 - redefinir senha
document.getElementById("btnRedefinir").addEventListener("click", redefinirSenha);

function redefinirSenha() {
  const nova = document.getElementById("novaSenha").value;
  const confirmar = document.getElementById("confirmarSenha").value;

  const erroNova = document.getElementById("erroNova");
  const erroConfirmar = document.getElementById("erroConfirmar");

  erroNova.style.display = nova.length < 6 ? "block" : "none";
  erroConfirmar.style.display = nova !== confirmar ? "block" : "none";

  if (nova.length < 6 || nova !== confirmar) return;

  const usuario = DB.Usuarios.buscarPorEmail(emailAtual);

  if (usuario) {
    DB.Usuarios.atualizar(usuario.id, { senha: nova });
  }

  alert("Senha redefinida com sucesso!");

  window.location.href = "../login/index.html";
}

// ENTER funciona
document.getElementById("emailRecup").addEventListener("keydown", (e) => {
  if (e.key === "Enter") verificarEmail();
});

document.getElementById("confirmarSenha").addEventListener("keydown", (e) => {
  if (e.key === "Enter") redefinirSenha();
});

// Validação em tempo real
document.getElementById("novaSenha").addEventListener("input", () => {
  const erro = document.getElementById("erroNova");
  erro.style.display = document.getElementById("novaSenha").value.length < 6 ? "block" : "none";
});

document.getElementById("confirmarSenha").addEventListener("input", () => {
  const erro = document.getElementById("erroConfirmar");
  erro.style.display =
    document.getElementById("novaSenha").value !== document.getElementById("confirmarSenha").value
      ? "block"
      : "none";
});