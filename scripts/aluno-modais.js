let timeoutsFechando = [];

function abrirModal(nome) {
  // Cancela qualquer timeout de fechamento em andamento
  timeoutsFechando.forEach(clearTimeout);
  timeoutsFechando = [];

  // Esconde outros modais imediatamente (sem animação)
  document.querySelectorAll('.modal-sheet').forEach(m => {
    m.style.display = 'none';
  });

  const overlay = document.getElementById('modal-overlay');
  const modal   = document.getElementById('modal-' + nome);

  if (!modal) return;

  overlay.style.display = 'block';
  modal.style.display   = 'block';

  // Força reflow antes de aplicar a animação
  modal.getBoundingClientRect();
  modal.style.transform = 'translateX(-50%) translateY(0)';

  document.body.style.overflow = 'hidden';
}

function fecharModal(restaurarScroll = true) {
  document.querySelectorAll('.modal-sheet').forEach(m => {
    m.style.transform = 'translateX(-50%) translateY(100%)';

    const t = setTimeout(() => {
      m.style.display = 'none';
    }, 300);

    timeoutsFechando.push(t);
  });

  document.getElementById('modal-overlay').style.display = 'none';

  if (restaurarScroll) document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharModal();
});