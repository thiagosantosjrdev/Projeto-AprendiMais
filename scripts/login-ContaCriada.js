function entrar() {
  // Após o cadastro, a sessão já foi iniciada pelo DB.Usuarios.cadastrar()
  // então lemos da sessão, não do CadastroTemp (que já foi limpo)
  const usuario = DB.Sessao.atual();
 
  if (!usuario) {
    // Sessão perdida por algum motivo — volta pro login
    window.location.href = "index.html";
    return;
  }
 
  const destino = usuario.tipo === "professor"
    ? "../dashboard/professor/"
    : "../dashboard/aluno/";
 
  window.location.href = `../loadingPage/index.html?redirect=${destino}`;
}