// ============================================
// CHATBOT SCREEN
//
// This assistant is a curated knowledge base, not a language model. The UI
// says so, the replies are synchronous, and nothing pretends to be an API
// call. If a hosted model is wired in later it belongs behind a server
// endpoint - never with a key in this file.
// ============================================

const CHAT_SUGGESTIONS = [
  'Explain pointers',
  'Difference between let and var',
  'CSS flexbox',
  'What is a segmentation fault'
];

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

function renderChatSuggestions() {
  const host = document.getElementById('chat-suggestions');
  if (!host || host.childElementCount) return;
  CHAT_SUGGESTIONS.forEach((text) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'suggest-chip';
    chip.textContent = text;
    chip.addEventListener('click', () => {
      const input = document.getElementById('chat-input');
      if (!input) return;
      input.value = text;
      input.focus();
    });
    host.appendChild(chip);
  });
}

function renderChatbot() {
  const log = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const send = document.getElementById('chat-send');
  if (!log) return;

  if (!log.childElementCount) {
    appendChatMessage(
      'I am the CodeFlow study assistant. I answer from a curated C, HTML, CSS and JavaScript knowledge base - I am not a general-purpose language model, so I can be wrong about anything outside it.',
      'bot'
    );
    appendChatMessage('Ask about a concept, a keyword or an error message. Try one of the suggestions below.', 'bot');
  }

  renderChatSuggestions();

  if (chatBound) return;
  chatBound = true;

  send?.addEventListener('click', sendChatMessage);
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendChatMessage();
    }
  });
}

function answerFromKnowledgeBase(text) {
  if (typeof KNOWLEDGE_BASE === 'undefined' || typeof KNOWLEDGE_BASE.getResponse !== 'function') {
    return 'The knowledge base did not load, so I cannot answer right now. The rest of CodeFlow still works.';
  }
  try {
    const answer = KNOWLEDGE_BASE.getResponse(text);
    return answer && String(answer).trim()
      ? answer
      : 'I do not have a matching entry for that yet. Try naming the concept directly - for example "pointer arithmetic" or "flex-direction".';
  } catch (error) {
    console.error('[chat] knowledge base failed:', error);
    return 'Something went wrong while looking that up. Please try rephrasing.';
  }
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  if (text.length > 500) {
    input.value = '';
    appendChatMessage('That message is ' + text.length + ' characters. Please keep questions under 500 so the knowledge base can match an entry.', 'bot');
    return;
  }

  input.value = '';
  appendChatMessage(text, 'user');
  chatHistory.push({ role: 'user', text });

  const answer = answerFromKnowledgeBase(text);
  appendChatMessage(answer, 'bot');
  chatHistory.push({ role: 'bot', text });
}
