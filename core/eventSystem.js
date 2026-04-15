// ============================================
// EVENT SYSTEM - Global Event Delegation
// ============================================

function initEventSystem() {
    // Global click delegation
    document.addEventListener('click', function(e) {
        // Navigation buttons
        const navBtn = e.target.closest('.nav-item');
        if (navBtn) {
            const route = navBtn.getAttribute('data-nav');
            if (route) navigateTo(route);
        }

        // Topic cards
        const topicCard = e.target.closest('.topic-card');
        if (topicCard) {
            const topicId = topicCard.getAttribute('data-topic');
            if (topicId) navigateTo('lesson/' + topicId);
        }

        // Quiz start buttons
        const quizBtn = e.target.closest('[data-action="start-quiz"]');
        if (quizBtn) {
            const topicId = quizBtn.closest('[data-topic]')?.getAttribute('data-topic') ||
                           quizBtn.getAttribute('data-topic');
            if (topicId) navigateTo('quiz/' + topicId);
        }

        // Visualization buttons
        const vizBtn = e.target.closest('[data-action="visualize"]');
        if (vizBtn) {
            const topicId = vizBtn.closest('[data-topic]')?.getAttribute('data-topic') ||
                           vizBtn.getAttribute('data-topic');
            if (topicId) navigateTo('visualize/' + topicId);
        }

        // Game level buttons
        const levelBtn = e.target.closest('[data-action="play-level"]');
        if (levelBtn) {
            const levelId = levelBtn.closest('[data-level]')?.getAttribute('data-level') ||
                           levelBtn.getAttribute('data-level');
            if (levelId && typeof startLogicQuestLevel !== 'undefined') {
                startLogicQuestLevel(levelId);
            }
        }

        // Chat send button
        if (e.target.closest('#chat-send')) {
            sendChatMessage();
        }

        // Mobile menu toggle
        if (e.target.closest('#mobile-menu-btn')) {
            toggleMobileSidebar();
        }

        // Back buttons
        if (e.target.closest('[data-action="back"]')) {
            navigateTo('dashboard');
        }
    });

    // Chat input enter key
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    // Analyzer code analysis
    window.analyzeCode = function() {
        const code = document.getElementById('analyzer-code')?.value;
        const language = document.getElementById('analyzer-language')?.value;
        const results = document.getElementById('analyzer-results');

        if (!code || !code.trim()) {
            if (results) results.innerHTML = '<p class="text-red-400">Please enter some code to analyze</p>';
            return;
        }

        if (typeof LogicAnalyzer !== 'undefined' && LogicAnalyzer.analyze) {
            const analysis = LogicAnalyzer.analyze(code, language);
            if (results) {
                results.innerHTML = `
                    <div class="space-y-3">
                        <div class="p-3 bg-gray-700 rounded">
                            <div class="text-xs text-gray-400 mb-1">COMPLEXITY</div>
                            <div class="text-white">${analysis.complexity || 'Unknown'}</div>
                        </div>
                        <div class="p-3 bg-gray-700 rounded">
                            <div class="text-xs text-gray-400 mb-1">ISSUES FOUND</div>
                            <div class="text-white">${analysis.issues?.length || 0} potential issues</div>
                        </div>
                        <div class="p-3 bg-gray-700 rounded">
                            <div class="text-xs text-gray-400 mb-1">SUGGESTIONS</div>
                            <div class="text-sm text-gray-300">
                                ${analysis.suggestions?.map(s => `• ${s}`).join('<br>') || 'No suggestions available'}
                            </div>
                        </div>
                    </div>
                `;
            }
        } else {
            if (results) {
                results.innerHTML = `
                    <div class="p-3 bg-gray-700 rounded">
                        <div class="text-white">Code length: ${code.length} characters</div>
                        <div class="text-gray-400 text-sm mt-1">Language: ${language}</div>
                    </div>
                `;
            }
        }
    };
}

// Chat functions
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');

    if (!input || !messages || !input.value.trim()) return;

    const message = input.value.trim();
    input.value = '';

    // Add user message
    addChatMessage(message, 'user');

    // Simulate AI response
    setTimeout(() => {
        if (typeof KNOWLEDGE_BASE !== 'undefined' && KNOWLEDGE_BASE.getResponse) {
            const response = KNOWLEDGE_BASE.getResponse(message);
            addChatMessage(response, 'bot');
        } else {
            addChatMessage('I\'m here to help! Ask me about programming concepts.', 'bot');
        }
    }, 500);
}

function addChatMessage(text, sender) {
    const messages = document.getElementById('chat-messages');
    if (!messages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`;

    msgDiv.innerHTML = `
        <div class="max-w-[70%] ${sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'} rounded-lg px-4 py-2">
            <p class="text-sm">${escapeHtml(text)}</p>
        </div>
    `;

    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('hidden');
    }
}