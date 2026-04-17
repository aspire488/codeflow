// chatbot.js - AI chatbot functionality

// Knowledge base is imported from data/knowledgeBase.js

function initChatbot() {
  const fab = document.getElementById('aiFab');
  const chatPanel = document.getElementById('chatPanel');
  const input = document.getElementById('aiInput');
  const sendBtn = document.getElementById('aiSend');
  const messages = document.getElementById('aiMessages');

  // Toggle chat panel
  if (fab && chatPanel) {
    fab.addEventListener('click', () => {
      const isVisible = chatPanel.style.display !== 'none';
      chatPanel.style.display = isVisible ? 'none' : 'flex';
    });
  }

  function sendMessage() {
    if (!input) return;
    let text = input.value.trim();
    if (!text) return;
    
    // Truncate very long messages
    if (text.length > 500) {
      text = text.substring(0, 500) + '...';
    }

    addMessage(text, 'user');
    input.value = '';

    setTimeout(() => {
      const response = KNOWLEDGE_BASE.getResponse(text);
      addMessage(response, 'bot');
    }, 300);
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
  
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  setTimeout(() => {
    addMessage("Hi! I'm your CodeFlow assistant. Ask me anything about C, HTML, CSS, or JavaScript programming.", 'bot');
  }, 1000);
}

function addMessage(text, sender) {
  const messages = document.getElementById('aiMessages');
  if (!messages) return;
  
  // Sanitize text to prevent XSS
  const sanitizedText = escapeHtml(text);
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`;

  messageDiv.innerHTML = `
    <div class="max-w-[85%] ${sender === 'user' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high'} rounded-lg px-3 py-2 shadow-sm">
      <p class="text-xs leading-relaxed">${sanitizedText}</p>
    </div>
  `;

  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}
