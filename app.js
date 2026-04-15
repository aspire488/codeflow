// app.js - Main application initialization

// Application state
let AppState = {
  currentSubject: "c",
  currentTopic: null,
  mode: "study",
  completedTopics: [],
  quizScores: {},
  xp: 0,
  level: 1,
  streak: 0,
  levels: []
};

let currentQuizTopic = null;

// Global functions for lesson renderer
function renderDashboard() {
  renderTopicList();
  renderTopicGrid();
  renderProgressSummary();
  
  // Render smart practice if AdaptiveEngine is loaded
  if (typeof AdaptiveEngine !== 'undefined') {
    setTimeout(() => {
      const container = document.getElementById('smartPracticeContainer');
      if (container) {
        renderSmartPracticeUI('smartPracticeContainer');
      }
    }, 100);
  }
}

function renderTopic(topicId) {
  if (!topicId) return;
  renderLesson(topicId);
}

function startQuiz(topicId) {
  if (!topicId) topicId = "c-basics";
  renderQuizScreen(topicId);
}

function startVisualization(topicId) {
  if (!topicId) topicId = "variables";
  renderVisualization(topicId);
}

function openGameMode() {
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

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
