const lessons = [...document.querySelectorAll('.aula-card')];
const filterInputs = [...document.querySelectorAll('input[name="filtro"]')];
const progressFill = document.getElementById('progressoFill');
const progressLabel = document.getElementById('progressoTexto');

function updateProgress() {
  const done = lessons.filter((item) => item.dataset.done === 'true').length;
  const percent = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  progressFill.style.width = `${percent}%`;
  progressLabel.textContent = `${percent}%`;
}

function applyFilter(value) {
  lessons.forEach((item) => {
    const status = item.dataset.status;
    const done = item.dataset.done === 'true';
    const show = value === 'todas' || status === value || (value === 'concluida' && done);
    item.style.display = show ? 'block' : 'none';
  });
}

function updateLessonState(item, done) {
  const statusTag = item.querySelector('.aula-status');
  const actionButton = item.querySelector('.marcar-aula');

  item.dataset.done = String(done);
  item.dataset.status = done ? 'concluida' : 'hoje';

  statusTag.textContent = done ? 'Concluida' : 'Pendente';
  statusTag.classList.toggle('concluida', done);
  actionButton.textContent = done ? 'Marcar como pendente' : 'Marcar como concluída';
}

document.querySelectorAll('.marcar-aula').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.aula-card');
    const isDone = item.dataset.done === 'true';
    updateLessonState(item, !isDone);
    updateProgress();

    const activeFilter = document.querySelector('input[name="filtro"]:checked')?.value || 'todas';
    applyFilter(activeFilter);
  });
});

filterInputs.forEach((input) => {
  input.addEventListener('change', () => applyFilter(input.value));
});

lessons.forEach((item) => updateLessonState(item, item.dataset.done === 'true'));
updateProgress();
applyFilter('todas');