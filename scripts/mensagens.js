const filterMessageInputs = [...document.querySelectorAll('input[name="filtroMensagem"]')];
const unreadCounter = document.getElementById('naoLidasQtd');
const composer = document.getElementById('composer');
const openComposerButton = document.getElementById('abrirComposer');
const sendMessageButton = document.getElementById('enviarMensagem');
const messageText = document.getElementById('mensagemTexto');
const messageList = document.getElementById('listaMensagens');

function getMessages() {
  return [...document.querySelectorAll('.mensagem-card')];
}

function updateUnreadCount() {
  const unread = getMessages().filter((item) => item.dataset.lida === 'false').length;
  unreadCounter.textContent = String(unread);
}

function applyMessageFilter(value) {
  getMessages().forEach((item) => {
    const category = item.dataset.categoria;
    const isUnread = item.dataset.lida === 'false';

    const show =
      value === 'todas' ||
      (value === 'nao-lida' && isUnread) ||
      (value === 'professor' && category === 'professor');

    item.style.display = show ? 'block' : 'none';
  });
}

// Apenas sincroniza classes e texto do botão — sem alterar dataset
function syncMessageUI(item) {
  const isRead = item.dataset.lida === 'true';
  const actionButton = item.querySelector('.acao-mensagem');

  item.classList.toggle('nao-lida', !isRead);
  actionButton.textContent = isRead ? 'Marcar como não lida' : 'Marcar como lida';
}

function addToggleEvent(button, item) {
  button.addEventListener('click', () => {
    const isRead = item.dataset.lida === 'true';

    // Alterna estado
    item.dataset.lida = isRead ? 'false' : 'true';
    syncMessageUI(item);
    updateUnreadCount();

    const activeFilter =
      document.querySelector('input[name="filtroMensagem"]:checked')?.value || 'todas';

    applyMessageFilter(activeFilter);
  });
}

// Setup inicial: apenas sincroniza UI com o estado já definido no HTML
getMessages().forEach((item) => {
  syncMessageUI(item);
  const button = item.querySelector('.acao-mensagem');
  addToggleEvent(button, item);
});

filterMessageInputs.forEach((input) => {
  input.addEventListener('change', () => {
    applyMessageFilter(input.value);
  });
});

openComposerButton.addEventListener('click', () => {
  const isHidden = composer.hidden;
  composer.hidden = !isHidden;

  if (!composer.hidden) {
    messageText.focus();
  } else {
    // Limpa o textarea ao fechar sem enviar
    messageText.value = '';
  }
});

sendMessageButton.addEventListener('click', () => {
  const text = messageText.value.trim();
  if (!text) return;

  const newMessage = document.createElement('article');
  newMessage.className = 'card mensagem-card';
  newMessage.dataset.categoria = 'professor';
  newMessage.dataset.lida = 'true';

  newMessage.innerHTML = `
    <div class="mensagem-topo">
      <div class="mensagem-autor">
        <span class="avatar-mini">EU</span>
        <div>
          <h4>Você</h4>
          <p class="mensagem-preview"></p>
        </div>
      </div>
      <span class="mensagem-hora">Agora</span>
    </div>
    <button type="button" class="acao-mensagem">Marcar como não lida</button>
  `;

  newMessage.querySelector('.mensagem-preview').textContent = text;

  const actionButton = newMessage.querySelector('.acao-mensagem');
  addToggleEvent(actionButton, newMessage);

  messageList.prepend(newMessage);
  messageText.value = '';
  composer.hidden = true;

  updateUnreadCount();

  const activeFilter =
    document.querySelector('input[name="filtroMensagem"]:checked')?.value || 'todas';

  applyMessageFilter(activeFilter);
});

// Contagem e filtro iniciais
updateUnreadCount();
applyMessageFilter('todas');