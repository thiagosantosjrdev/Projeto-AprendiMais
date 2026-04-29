const usuario = DB.Sessao.exigir();

const primeiroNome = usuario.nome.split(" ")[0];
document.querySelector(".header h2").textContent = `Olá, ${primeiroNome}!`;