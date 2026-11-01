// ============================================
// CHATBOT SCREEN - knowledge-base assistant
// ============================================

let chatBound = false;
const chatHistory = [];

function chatBubble(text, sender) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;
  return bubble;
}

function appendChatMessage(text, sender) {
  const log = document.getElementById('chat-messages');
  if (!log) return null;
  const bubble = chatBubble(text, sender);
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
  return bubble;
}

function renderChatbot() {
  const log = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const send = document.getElementById('chat-send');
  if (!log) return;

  if (!log.childElementCount) {
    appendChatMessage(
      'Hi! I am the CodeFlow study assistant. I answer from a curated C, HTML, CSS and JavaScript knowledge base - I am not a general-purpose language model.',
      'bot'
    );
    appendChatMessage('Try: "explain pointers", "css flexbox", "difference between let and var", or "what is a segmentation fault".', 'bot');
  }

  if (chatBound) return;
  chatBound = true;

  send?.addEventListener('click', sendChatMessage);
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendChatMessage();
    }
  });
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  if (text.length > 500) return;

  input.value = '';
  appendChatMessage(text, 'user');
  chatHistory.push({ role: 'user', text });

  const pending = appendChatMessage('Thinking...', 'pending');

  setTimeout(() => {
    let answer;
    try {
      if (typeof KNOWLEDGE_BASE !== 'undefined' && typeof KNOWLEDGE_BASE.getResponse === 'function') {
        answer = KNOWLEDGE_BASE.getResponse(text);
      } else {
        answer = 'The knowledge base did not load, so I cannot answer that right now.';
      }
    } catch (error) {
      console.error('[chat] knowledge base failed:', error);
      answer = 'Something went wrong while looking that up. Please try rephrasing.';
    }

    if (pending && pending.parentNode) {
      pending.classList.remove('pending');
      pending.classList.add('bot');
      pending.textContent = answer;
    } else {
      appendChatMessage(answer, 'bot');
    }
    chatHistory.push({ role: 'bot', text: answer });
    const log = document.getElementById('chat-messages');
    if (log) log.scrollTop = log.scrollHeight;
  }, 350);
}
