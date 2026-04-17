// ============================================
// APP.JS - Main Application Bootstrap
// ============================================

// Application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core systems
    initRouter();
    initEventSystem();

    // Initialize renderers
    renderDashboard();

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('✓ Service Worker registered'))
            .catch(err => console.log('✗ Service Worker registration failed:', err));
    }

    console.log('✓ CodeFlow application initialized');
});

// Global render functions (called by router)
function renderDashboard() {
    // This function is implemented in ui/dashboardRenderer.js
    // Called automatically by router when #dashboard is loaded
}

function renderLesson(topicId) {
    // This function is implemented in ui/lessonRenderer.js
    // Called by router when #lesson/{topic} is loaded
}

function renderQuiz(topicId) {
    // This function is implemented in ui/quizRenderer.js
    // Called by router when #quiz/{topic} is loaded
}

function renderVisualization(topicId) {
    // This function is implemented in ui/visualizationRenderer.js
    // Called by router when #visualize/{topic} is loaded
}

function renderLogicQuest() {
    // This function is implemented in ui/gameRenderer.js
    // Called by router when #game is loaded
}

function renderChatbot() {
    // This function is implemented in ui/chatbotRenderer.js
    // Called by router when #chatbot is loaded
}

function renderLogicAnalyzer() {
    // This function is implemented in ui/logicRenderer.js
    // Called by router when #logic is loaded
}

// Legacy compatibility functions
function renderTopicList() {
    // Legacy function - now handled by dashboardRenderer
}

function renderTopicGrid() {
    // Legacy function - now handled by dashboardRenderer
}

function renderProgressSummary() {
    // Legacy function - now handled by dashboardRenderer
}

function renderLesson(topicId) {
    // Legacy function - now handled by lessonRenderer
}

function renderQuizScreen(topicId) {
    // Legacy function - now handled by quizRenderer
}

function startLogicQuestLevel(levelId) {
    // This function is implemented in ui/gameRenderer.js
}

// Export functions for global access
window.renderDashboard = renderDashboard;
window.renderLesson = renderLesson;
window.renderQuiz = renderQuiz;
window.renderVisualization = renderVisualization;
window.renderLogicQuest = renderLogicQuest;
window.renderChatbot = renderChatbot;
window.renderLogicAnalyzer = renderLogicAnalyzer;
window.startLogicQuestLevel = startLogicQuestLevel;
  renderGameMode();
}

function renderOutputPredictionMode(topicKey) {
  const contentEl = document.getElementById('quizContent') || document.getElementById('lessonContent');
  if (!contentEl) return;
  
  contentEl.innerHTML = `
    <div class="max-w-4xl mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <button onclick="navigateTo('quiz/${topicKey || 'all'}')" class="p-2 hover:bg-surface-container rounded text-on-surface-variant hover:text-on-surface">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 class="text-xl font-bold text-on-surface">Output Prediction Mode</h2>
        </div>
        <button onclick="showAllPredictionQuestions('${topicKey || 'all'}')" class="px-4 py-2 bg-surface-container text-on-surface-variant rounded hover:bg-surface-container-high text-sm">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">list</span>
            All Questions
          </span>
        </button>
      </div>
      <div id="predictionContainer">${renderOutputPredictionQuiz(topicKey)}</div>
    </div>
  `;
}

function showAllPredictionQuestions(topicKey) {
  const container = document.getElementById('predictionContainer');
  if (container) {
    container.innerHTML = renderOutputPredictionList(topicKey);
  }
}

// Quiz screen renderer
function renderQuizScreen(topicKey) {
  const topic = TOPICS_DB[topicKey];
  const quizQuestions = QUIZ_DB[topicKey] || topic?.quiz || [];
  
  // Use quizContent if available, otherwise fall back to lessonContent
  const contentEl = document.getElementById('quizContent') || document.getElementById('lessonContent');
  
  if (quizQuestions.length === 0 && (!outputPredictionDB || outputPredictionDB.length === 0)) {
    contentEl.innerHTML = `
      <div class="mt-8 p-6 bg-surface-container rounded-lg">
        <p class="text-on-surface-variant">No quiz available for this topic yet.</p>
        <button onclick="navigateTo('lesson/${topicKey}')" class="mt-4 px-4 py-2 bg-primary text-on-primary rounded">Back to Lesson</button>
      </div>
    `;
    return;
  }
  
  contentEl.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <button onclick="navigateTo('lesson/${topicKey}')" class="flex items-center gap-2 text-outline hover:text-primary transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
          <span>Back to Lesson</span>
        </button>
      </div>
      
      <div class="flex gap-2 border-b border-outline-variant/20 mb-6 quiz-nav-tabs">
        <button onclick="switchQuizTab('mcq', currentQuizTopic)" id="quizTabMcq" class="px-4 py-2 text-sm font-semibold border-b-2 border-primary text-primary">
          <span class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">quiz</span>
            MCQ Quiz
          </span>
        </button>
        <button onclick="switchQuizTab('predict', currentQuizTopic)" id="quizTabPredict" class="px-4 py-2 text-sm font-semibold border-b-2 border-transparent text-on-surface-variant hover:text-on-surface">
          <span class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">psychology</span>
            Output Prediction
          </span>
        </button>
      </div>
      
      <div id="quizTabContent"></div>
    </div>
  `;
  
  currentQuizTopic = topicKey;
  switchQuizTab('mcq', topicKey);
}

function switchQuizTab(tab, topicKey) {
  const content = document.getElementById('quizTabContent');
  const mcqBtn = document.getElementById('quizTabMcq');
  const predictBtn = document.getElementById('quizTabPredict');
  
  if (!content || !mcqBtn || !predictBtn) return;
  
  if (tab === 'mcq') {
    mcqBtn.className = 'px-4 py-2 text-sm font-semibold border-b-2 border-primary text-primary';
    predictBtn.className = 'px-4 py-2 text-sm font-semibold border-b-2 border-transparent text-on-surface-variant hover:text-on-surface';
    renderMcqQuiz(topicKey);
  } else {
    mcqBtn.className = 'px-4 py-2 text-sm font-semibold border-b-2 border-transparent text-on-surface-variant hover:text-on-surface';
    predictBtn.className = 'px-4 py-2 text-sm font-semibold border-b-2 border-primary text-primary';
    content.innerHTML = renderOutputPredictionQuiz(topicKey);
  }
}

function renderMcqQuiz(topicKey) {
  const topic = TOPICS_DB[topicKey];
  const quizQuestions = QUIZ_DB[topicKey] || topic?.quiz || [];
  const content = document.getElementById('quizTabContent');
  
  if (quizQuestions.length === 0) {
    content.innerHTML = `
      <div class="p-6 bg-surface-container rounded-lg">
        <p class="text-on-surface-variant">No MCQ quiz available for this topic yet.</p>
        <p class="text-sm text-on-surface-variant mt-2">Try the Output Prediction mode instead!</p>
      </div>
    `;
    return;
  }

  let currentQuestion = 0;
  let score = 0;
  let selectedAnswer = -1;

  function renderQuestion() {
    const q = quizQuestions[currentQuestion];
    
    content.innerHTML = `
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <span class="text-sm text-outline">Question ${currentQuestion + 1} of ${quizQuestions.length}</span>
        </div>
        
        <div class="bg-surface-container p-6 rounded-lg mb-6">
          <h2 class="text-xl font-semibold mb-4">${q.question}</h2>
          <div class="space-y-3" id="quizOptions">
            ${q.options.map((opt, i) => `
              <label class="block p-4 rounded-lg border border-outline-variant/20 bg-surface-container-low hover:border-primary-container cursor-pointer transition-all ${selectedAnswer === i ? 'bg-primary-container/20 border-primary-container' : ''}" data-index="${i}">
                <div class="flex items-center justify-between">
                  <span class="font-code text-sm">${opt}</span>
                  <div class="w-5 h-5 rounded-full border border-outline-variant flex items-center justify-center ${selectedAnswer === i ? 'border-primary-container bg-primary-container' : ''}">
                    ${selectedAnswer === i ? '<span class="material-symbols-outlined text-sm text-on-primary-container">check</span>' : ''}
                  </div>
                </div>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="flex justify-between">
          <button onclick="submitAnswer()" class="px-6 py-3 min-h-10 bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold rounded-lg hover:brightness-110 transition-all">
            ${selectedAnswer >= 0 ? 'Submit Answer' : 'Select an Answer'}
          </button>
        </div>

        <div id="quizFeedback" class="mt-4"></div>
      </div>
    `;

    // Add click handlers
    const options = content.querySelectorAll('#quizOptions label');
    options.forEach((label, i) => {
      label.addEventListener('click', () => {
        selectedAnswer = i;
        options.forEach(l => {
          l.classList.remove('bg-primary-container/20', 'border-primary-container');
          l.querySelector('div:last-child').innerHTML = '';
          l.querySelector('div:last-child').classList.remove('border-primary-container', 'bg-primary-container');
        });
        label.classList.add('bg-primary-container/20', 'border-primary-container');
        const checkIcon = label.querySelector('div:last-child');
        checkIcon.innerHTML = '<span class="material-symbols-outlined text-sm text-on-primary-container">check</span>';
        checkIcon.classList.add('border-primary-container', 'bg-primary-container');
      });
    });
  }

  function submitAnswer() {
    if (selectedAnswer < 0) return;
    
    const q = quizQuestions[currentQuestion];
    const isCorrect = selectedAnswer === q.correct;
    
    if (isCorrect) score++;
    
    // Track adaptive learning performance
    if (typeof AdaptiveEngine !== 'undefined' && topicKey) {
      AdaptiveEngine.recordAnswer(topicKey, isCorrect);
    }
    
    const feedback = document.getElementById('quizFeedback');
    feedback.innerHTML = `
      <div class="p-4 rounded-lg ${isCorrect ? 'bg-tertiary/10 border border-tertiary' : 'bg-error/10 border border-error'}">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-outlined ${isCorrect ? 'text-tertiary' : 'text-error'}">
            ${isCorrect ? 'check_circle' : 'cancel'}
          </span>
          <span class="font-bold ${isCorrect ? 'text-tertiary' : 'text-error'}">
            ${isCorrect ? 'Correct!' : 'Incorrect'}
          </span>
        </div>
        <p class="text-sm text-on-surface-variant">${q.explanation}</p>
        <button onclick="${currentQuestion < quizQuestions.length - 1 ? `currentQuestion++; selectedAnswer=-1; renderQuestion()` : `showFinalScore()`}" class="mt-4 px-4 py-2 bg-surface-container-high text-on-surface rounded hover:bg-surface-container transition-colors">
          ${currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      </div>
    `;
  }

  function showFinalScore() {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const passed = percentage >= 70;
    
    // Save score
    AppState.quizScores[topicKey] = { score, total: quizQuestions.length, percentage };
    if (passed && !AppState.completedTopics.includes(topicKey)) {
      AppState.completedTopics.push(topicKey);
    }
    AppState.xp += passed ? 20 : 10;
    saveState();

    content.innerHTML = `
      <div class="mt-8 max-w-2xl mx-auto text-center">
        <div class="bg-surface-container p-8 rounded-lg">
          <span class="material-symbols-outlined text-6xl ${passed ? 'text-tertiary' : 'text-error'}">
            ${passed ? 'emoji_events' : 'sentiment_dissatisfied'}
          </span>
          <h2 class="text-2xl font-bold mt-4">${passed ? 'Congratulations!' : 'Keep Practicing!'}</h2>
          <p class="text-on-surface-variant mt-2">You scored ${score} out of ${quizQuestions.length} (${percentage}%)</p>
          <p class="text-tertiary mt-2">+${passed ? 20 : 10} XP earned</p>
          
          <div class="flex justify-center gap-4 mt-6">
            <button onclick="startQuiz('${topicKey}')" class="px-6 py-3 min-h-10 bg-surface-container-high text-on-surface rounded hover:bg-surface-container transition-colors">
              Retry Quiz
            </button>
            <button onclick="navigateTo('lesson/${topicKey}')" class="px-6 py-3 min-h-10 bg-surface-container-high text-on-surface rounded hover:bg-surface-container transition-colors">
              Review Lesson
            </button>
            <button onclick="navigateTo('dashboard')" class="px-6 py-3 min-h-10 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded hover:brightness-110 transition-all">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderQuestion();
}

// Progress summary renderer
function renderProgressSummary() {
  const summary = document.getElementById('progressSummary');
  if (!summary) return;
  
  const completed = AppState.completedTopics.length;
  const total = Object.keys(TOPICS_DB).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  summary.innerHTML = `
    <div class="px-4 py-3 space-y-2">
      <div class="flex justify-between text-xs">
        <span class="text-outline">Progress</span>
        <span class="text-primary font-mono">${percentage}%</span>
      </div>
      <div class="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
        <div class="h-full bg-primary-container transition-all" style="width: ${percentage}%"></div>
      </div>
      <div class="text-[10px] text-outline">${completed}/${total} topics completed</div>
    </div>
  `;
}

// Save state to localStorage
function saveState() {
  try {
    localStorage.setItem('codeflow_app_state', JSON.stringify(AppState));
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

// Load state from localStorage
function loadState() {
  try {
    const data = localStorage.getItem('codeflow_app_state');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        AppState = { ...AppState, ...parsed };
      } else {
        localStorage.removeItem('codeflow_app_state');
      }
    }
  } catch (e) {
    console.error('Error loading state:', e);
    localStorage.removeItem('codeflow_app_state');
  }
}

// Initialize application
function initApp() {
  loadState();
  
  // Check if levels are initialized
  if (!AppState.levels || AppState.levels.length === 0) {
    AppState.levels = GAME_LEVELS.levels.slice(0, 12).map(l => ({
      id: l.id,
      title: l.name,
      description: l.description,
      xp: l.xpRequired,
      completed: false
    }));
    saveState();
  }
  
  // Initialize router
  initRouter();
  
  console.log('CodeFlow initialized successfully');
}

// ============================================
// CHATBOT SCREEN RENDER
// ============================================
function renderChatbot() {
  const content = document.getElementById('chatbotContent');
  if (!content) return;
  
  content.innerHTML = `
    <div class="flex flex-col h-full">
      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <div class="max-w-3xl mx-auto">
          <div class="text-center mb-8">
            <div class="text-6xl mb-4">🤖</div>
            <h1 class="text-2xl font-bold text-on-surface mb-2">CodeFlow AI Assistant</h1>
            <p class="text-on-surface-variant">Ask any question about C programming, HTML, CSS, or JavaScript</p>
          </div>
          <div id="chatMessages" class="space-y-4 mb-4"></div>
        </div>
      </main>
      
      <div class="bg-surface-container border-t border-outline-variant/20 p-4 md:p-6">
        <div class="max-w-3xl mx-auto flex gap-3">
          <input 
            type="text" 
            id="chatInput" 
            placeholder="Ask your doubt..." 
            class="flex-1 px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant/20 text-on-surface placeholder-on-surface-variant outline-none focus:border-primary-container"
          />
          <button 
            id="chatSendBtn" 
            class="px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:brightness-110 transition-all active:scale-95 flex items-center gap-2"
          >
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Initialize chatbot functionality
  initChatbotScreen();
}

function initChatbotScreen() {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const messagesContainer = document.getElementById('chatMessages');
  
  if (!input || !sendBtn || !messagesContainer) return;
  
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    
    // Add user message
    addChatMessage(text, 'user');
    input.value = '';
    
    // Simulate response
    setTimeout(() => {
      if (typeof KNOWLEDGE_BASE !== 'undefined' && KNOWLEDGE_BASE.getResponse) {
        const response = KNOWLEDGE_BASE.getResponse(text);
        addChatMessage(response, 'bot');
      } else {
        addChatMessage('I\'m here to help! Ask me about programming concepts.', 'bot');
      }
    }, 300);
  }
  
  function addChatMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
    msgDiv.innerHTML = `
      <div class="max-w-[70%] ${sender === 'user' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface'} rounded-lg px-4 py-2">
        <p class="text-sm">${escapeHtml(text)}</p>
      </div>
    `;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  // Initial greeting
  setTimeout(() => {
    addChatMessage("Hi! I'm your CodeFlow AI Assistant. What programming concept can I help you with today?", 'bot');
  }, 300);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// LOGIC ANALYZER SCREEN RENDER
// ============================================
function renderLogicAnalyzer() {
  const content = document.getElementById('analyzerContent');
  if (!content) return;
  
  content.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-on-surface mb-2">Logic Analyzer</h1>
        <p class="text-on-surface-variant">Analyze and understand code logic in C, JavaScript, HTML, and CSS</p>
      </div>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-surface-container rounded-lg p-6">
          <h2 class="text-lg font-semibold text-on-surface mb-4">Enter Your Code</h2>
          <textarea 
            id="analyzerCode" 
            placeholder="Paste your code here..." 
            class="w-full h-64 p-4 bg-surface-container-low border border-outline-variant/20 rounded-lg font-code text-sm text-on-surface placeholder-on-surface-variant outline-none focus:border-primary-container resize-none"
          ></textarea>
          
          <div class="mt-4 space-y-2">
            <label class="block text-sm text-on-surface-variant">Language</label>
            <select id="analyzerLanguage" class="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/20 rounded-lg text-on-surface outline-none focus:border-primary-container">
              <option value="c">C Programming</option>
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
          </div>
          
          <button 
            onclick="analyzeCode()"
            class="w-full mt-6 px-4 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold rounded-lg hover:brightness-110 transition-all active:scale-95"
          >
            <span class="flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">analytics</span>
              Analyze Code
            </span>
          </button>
        </div>
        
        <div class="bg-surface-container rounded-lg p-6">
          <h2 class="text-lg font-semibold text-on-surface mb-4">Analysis Results</h2>
          <div id="analyzerResults" class="space-y-3 text-sm">
            <p class="text-on-surface-variant">Analysis results will appear here...</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Make analyzeCode available globally
  window.analyzeCode = function() {
    const code = document.getElementById('analyzerCode').value;
    const language = document.getElementById('analyzerLanguage').value;
    const resultsDiv = document.getElementById('analyzerResults');
    
    if (!code.trim()) {
      resultsDiv.innerHTML = '<p class="text-error">Please enter some code to analyze</p>';
      return;
    }
    
    if (typeof LogicAnalyzer !== 'undefined' && LogicAnalyzer.analyze) {
      const analysis = LogicAnalyzer.analyze(code, language);
      resultsDiv.innerHTML = `
        <div class="space-y-2">
          <div class="p-3 bg-surface-container-highest rounded">
            <p class="text-xs uppercase tracking-wider text-outline mb-1">Complexity</p>
            <p class="text-on-surface">${analysis.complexity || 'Unknown'}</p>
          </div>
          <div class="p-3 bg-surface-container-highest rounded">
            <p class="text-xs uppercase tracking-wider text-outline mb-1">Issues Found</p>
            <p class="text-on-surface">${analysis.issues?.length || 0} potential issues</p>
          </div>
          <div class="p-3 bg-surface-container-highest rounded">
            <p class="text-xs uppercase tracking-wider text-outline mb-1">Suggestions</p>
            <ul class="text-on-surface-variant space-y-1 text-xs">
              ${(analysis.suggestions || []).map(s => `<li class="flex gap-2"><span class="text-tertiary">•</span>${s}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    } else {
      resultsDiv.innerHTML = `
        <div class="space-y-2">
          <p class="text-on-surface">Code length: ${code.length} characters</p>
          <p class="text-on-surface">Language: ${language}</p>
          <p class="text-on-surface-variant text-xs mt-2">Logic Analyzer engine initializing...</p>
        </div>
      `;
    }
  };
}

// Start app when DOM is ready
window.addEventListener('DOMContentLoaded', initApp);

// Also initialize if DOM was already ready
if (document.readyState !== 'loading') {
  initApp();
}
