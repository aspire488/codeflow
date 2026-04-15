// ============================================
// CHATBOT RENDERER - AI Assistant UI
// ============================================

function renderChatbot() {
    const messages = document.getElementById('chat-messages');
    if (!messages) return;

    // Clear existing messages and show welcome
    messages.innerHTML = `
        <div class="text-center text-gray-400 py-8">
            <span class="material-symbols-outlined text-4xl mb-2">chat</span>
            <p>Ask me anything about programming!</p>
            <p class="text-sm mt-2">Try questions like:</p>
            <div class="text-xs mt-2 space-y-1">
                <p>• "What is a pointer in C?"</p>
                <p>• "How do I use loops?"</p>
                <p>• "Explain recursion"</p>
            </div>
        </div>
    `;

    // Clear input
    const input = document.getElementById('chat-input');
    if (input) {
        input.value = '';
        input.focus();
    }

    // If chatbot engine exists, initialize it
    if (typeof Chatbot !== 'undefined' && Chatbot.init) {
        Chatbot.init();
    }
}