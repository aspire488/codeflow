// ============================================
// SCREEN MANAGER - Core UI Management
// ============================================

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const target = document.getElementById(screenId + '-screen');
    if (target) {
        target.classList.add('active');

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'lesson': 'Lessons',
            'quiz': 'Quiz',
            'visualization': 'Visualization',
            'game': 'Logic Quest',
            'chatbot': 'AI Assistant',
            'logic': 'Logic Analyzer'
        };
        const titleElement = document.getElementById('page-title');
        if (titleElement) {
            titleElement.textContent = titles[screenId] || 'CodeFlow';
        }
    }
}

// Navigation helper
function navigateTo(route) {
    window.location.hash = route;
}