// ============================================================
//  Aprendi+ | PaginaInicial.js
//  Depende de: db.js (carregado antes deste script)
// ============================================================

// ── Mostrar/ocultar senha ───────────────────────────────────
const togglePassword = document.getElementById("togglePassword");
const inputSenha = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const visivel = inputSenha.type === "text";
  inputSenha.type = visivel ? "password" : "text";
  togglePassword.classList.toggle("fa-eye", visivel);
  togglePassword.classList.toggle("fa-eye-slash", !visivel);
});

// ── Login ───────────────────────────────────────────────────
const form = document.getElementById("main");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("password").value;

  const resultado = DB.Auth.login(email, senha);

  if (!resultado.ok) {
    mostrarErro(resultado.erro);
    return;
  }

  DB.Auth.redirecionarPorTipo(resultado.usuario);
});

// ── Mensagem de erro inline ─────────────────────────────────
function mostrarErro(mensagem) {
  let erro = document.getElementById("erro-login");

  if (!erro) {
    erro = document.createElement("p");
    erro.id = "erro-login";
    erro.style.cssText = "color: #e53e3e; font-size: 0.875em; margin: 4px 0 0; text-align: center;";
    form.querySelector("#Entrar").insertAdjacentElement("beforebegin", erro);
  }

  erro.textContent = mensagem;
}