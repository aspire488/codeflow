// ============================================
// ROUTER - Hash-based Navigation System
// ============================================

function initRouter() {
    function route() {
        const hash = window.location.hash.replace('#', '') || 'dashboard';

        if (hash === 'dashboard') {
            showScreen('dashboard');
            renderDashboard();
        }
        else if (hash.startsWith('lesson/')) {
            const topicId = hash.split('/')[1];
            showScreen('lesson');
            renderLesson(topicId);
        }
        else if (hash.startsWith('quiz/')) {
            const topicId = hash.split('/')[1];
            showScreen('quiz');
            renderQuiz(topicId);
        }
        else if (hash.startsWith('visualize/')) {
            const topicId = hash.split('/')[1];
            showScreen('visualization');
            renderVisualization(topicId);
        }
        else if (hash === 'game') {
            showScreen('game');
            renderLogicQuest();
        }
        else if (hash === 'chatbot') {
            showScreen('chatbot');
            renderChatbot();
        }
        else if (hash === 'logic') {
            showScreen('logic');
            renderLogicAnalyzer();
        }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', route);

    // Initial route
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', route);
    } else {
        route();
    }
}