let restante = 8;
const contador = document.getElementById('contador');

const intervalo = setInterval(() => {
  restante -= 1;
  contador.textContent = String(restante);

  if (restante <= 0) {
    clearInterval(intervalo);
    window.location.href = '/';
  }
}, 1000);

document.getElementById('voltar').addEventListener('click', () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '/';
  }
});