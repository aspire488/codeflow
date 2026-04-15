// ============================================
// DASHBOARD RENDERER - Main Dashboard UI
// ============================================

function renderDashboard() {
    const grid = document.getElementById('topic-grid');
    if (!grid) return;

    // Clear existing content
    grid.innerHTML = '';

    // Get topics from database
    if (typeof TOPICS_DB !== 'undefined' && TOPICS_DB.topics) {
        TOPICS_DB.topics.forEach(topic => {
            const card = document.createElement('div');
            card.className = 'stitch-card p-6 topic-card cursor-pointer hover:scale-105 transition-transform';
            card.setAttribute('data-topic', topic.id);

            card.innerHTML = `
                <div class="flex items-center gap-3 mb-4">
                    <span class="material-symbols-outlined text-blue-400">${topic.icon || 'code'}</span>
                    <h3 class="font-semibold text-lg">${topic.title}</h3>
                </div>
                <p class="text-gray-400 text-sm mb-4">${topic.description || 'Learn about ' + topic.title}</p>
                <div class="flex gap-2">
                    <button class="stitch-btn flex-1 text-sm" data-action="start-lesson">Start Learning</button>
                    <button class="stitch-btn flex-1 text-sm" data-action="start-quiz" data-topic="${topic.id}">Take Quiz</button>
                </div>
            `;

            grid.appendChild(card);
        });
    } else {
        // Fallback topics
        const fallbackTopics = [
            { id: 'variables', title: 'Variables & Data Types', icon: 'memory' },
            { id: 'loops', title: 'Loops & Control Flow', icon: 'loop' },
            { id: 'functions', title: 'Functions', icon: 'function' },
            { id: 'arrays', title: 'Arrays & Pointers', icon: 'data_array' },
            { id: 'strings', title: 'Strings', icon: 'text_fields' },
            { id: 'structures', title: 'Structures', icon: 'account_tree' }
        ];

        fallbackTopics.forEach(topic => {
            const card = document.createElement('div');
            card.className = 'stitch-card p-6 topic-card cursor-pointer hover:scale-105 transition-transform';
            card.setAttribute('data-topic', topic.id);

            card.innerHTML = `
                <div class="flex items-center gap-3 mb-4">
                    <span class="material-symbols-outlined text-blue-400">${topic.icon}</span>
                    <h3 class="font-semibold text-lg">${topic.title}</h3>
                </div>
                <p class="text-gray-400 text-sm mb-4">Learn about ${topic.title.toLowerCase()}</p>
                <div class="flex gap-2">
                    <button class="stitch-btn flex-1 text-sm" data-action="start-lesson">Start Learning</button>
                    <button class="stitch-btn flex-1 text-sm" data-action="start-quiz" data-topic="${topic.id}">Take Quiz</button>
                </div>
            `;

            grid.appendChild(card);
        });
    }

    // Apply syntax highlighting to any code blocks
    applySyntaxHighlighting();
}