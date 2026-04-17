// outputPredictionEngine.js - Output Prediction Mode Engine

let currentPredictionQuestion = null;
let predictionAttempts = 0;

function normalizeOutput(str) {
  if (!str) return '';
  return str.replace(/\s+/g, '').trim().toLowerCase();
}

function checkOutputAnswer(userAnswer, correctAnswer) {
  if (!userAnswer || !correctAnswer) {
    return { correct: false, message: "Please enter your predicted output." };
  }
  
  const userNormalized = normalizeOutput(userAnswer);
  const correctNormalized = normalizeOutput(correctAnswer);
  
  if (userNormalized === correctNormalized) {
    return { 
      correct: true, 
      message: "Correct! Great job!" 
    };
  }
  
  // Also try with single space normalization
  const userSingleSpace = userAnswer.trim().replace(/\s+/g, ' ');
  const correctSingleSpace = correctAnswer.trim().replace(/\s+/g, ' ');
  
  if (userSingleSpace === correctSingleSpace) {
    return { 
      correct: true, 
      message: "Correct! (Spacing was slightly different)" 
    };
  }
  
  return { 
    correct: false, 
    message: "Incorrect. Try again or reveal the answer." 
  };
}

function showPredictionFeedback(result, question, showExplanation = false) {
  const feedbackDiv = document.getElementById('predictionFeedback');
  if (!feedbackDiv) return;
  
  if (result.correct) {
    feedbackDiv.innerHTML = `
      <div class="bg-tertiary/20 border border-tertiary/40 rounded-lg p-4 mt-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-outlined text-tertiary">check_circle</span>
          <span class="font-bold text-tertiary">${result.message}</span>
        </div>
        <p class="text-sm text-on-surface-variant">You correctly predicted the output!</p>
      </div>
    `;
  } else {
    feedbackDiv.innerHTML = `
      <div class="bg-error/20 border border-error/40 rounded-lg p-4 mt-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-outlined text-error">cancel</span>
          <span class="font-bold text-error">${result.message}</span>
        </div>
        ${showExplanation ? `
          <div class="mt-3 p-3 bg-surface-container rounded">
            <p class="text-sm font-bold text-primary mb-1">Explanation:</p>
            <p class="text-sm text-on-surface-variant">${question.explanation}</p>
            ${question.hint ? `
              <p class="text-xs text-outline mt-2"><span class="font-bold">Hint:</span> ${question.hint}</p>
            ` : ''}
          </div>
        ` : `
          <button onclick="showPredictionFeedback({correct:false,message:''}, currentPredictionQuestion, true)" 
            class="mt-2 text-sm text-primary hover:underline">
            Show Explanation
          </button>
        `}
      </div>
    `;
  }
}

function renderOutputPredictionQuiz(topicKey = null) {
  let questions = [...outputPredictionDB];
  
  if (topicKey && topicKey !== 'all') {
    questions = questions.filter(q => q.topic === topicKey);
  }
  
  if (questions.length === 0) {
    return `
      <div class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-outline mb-4">code_off</span>
        <h3 class="text-xl font-semibold text-on-surface mb-2">No Questions Available</h3>
        <p class="text-on-surface-variant">No output prediction questions found for this topic.</p>
        <button onclick="renderOutputPredictionQuiz('all')" class="mt-4 px-4 py-2 bg-primary text-on-primary rounded hover:brightness-110">
          View All Topics
        </button>
      </div>
    `;
  }
  
  const randomIndex = Math.floor(Math.random() * questions.length);
  currentPredictionQuestion = questions[randomIndex];
  predictionAttempts = 0;
  
  const q = currentPredictionQuestion;
  const difficultyColor = q.difficulty === 'easy' ? 'text-tertiary' : q.difficulty === 'medium' ? 'text-primary' : 'text-error';
  
  return `
    <div class="max-w-4xl mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-on-surface flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">psychology</span>
          Output Prediction Mode
        </h2>
        <span class="px-3 py-1 rounded-full bg-surface-container text-xs font-bold ${difficultyColor}">
          ${q.difficulty.toUpperCase()}
        </span>
      </div>
      
      <div class="bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden">
        <div class="px-4 py-2 bg-surface-container-high border-b border-outline-variant/20 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm text-outline">code</span>
          <span class="text-xs font-mono text-outline">Predict the output</span>
        </div>
        <div class="p-6">
          <pre class="font-mono text-sm text-on-surface bg-surface-container-lowest p-4 rounded-lg overflow-x-auto"><code>${escapeHtml(q.code)}</code></pre>
        </div>
      </div>
      
      <div class="mt-6">
        <label class="block text-sm font-semibold text-on-surface mb-2">
          Your Predicted Output:
        </label>
        <input type="text" 
          id="predictionInput" 
          placeholder="Enter your predicted output..."
          class="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-lg text-on-surface font-mono focus:border-primary focus:outline-none"
          onkeypress="if(event.key==='Enter') checkPredictionAnswer()"
        />
      </div>
      
      <div class="flex gap-3 mt-4">
        <button onclick="checkPredictionAnswer()" 
          class="px-6 py-3 bg-tertiary text-on-tertiary font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
          <span class="material-symbols-outlined">check</span>
          Check Answer
        </button>
        <button onclick="revealPredictionAnswer()" 
          class="px-6 py-3 bg-surface-container-high text-on-surface font-semibold rounded-lg hover:bg-surface-container border border-outline-variant transition-all flex items-center gap-2">
          <span class="material-symbols-outlined">visibility</span>
          Reveal Answer
        </button>
        <button onclick="renderOutputPredictionQuiz('${topicKey || 'all'}')" 
          class="px-6 py-3 bg-surface-container text-on-surface-variant font-semibold rounded-lg hover:bg-surface-container-high transition-all flex items-center gap-2">
          <span class="material-symbols-outlined">refresh</span>
          Next Question
        </button>
      </div>
      
      <div id="predictionFeedback"></div>
      
      <div class="mt-8 p-4 bg-surface-container rounded-lg border border-outline-variant/20">
        <h3 class="text-sm font-bold text-outline uppercase tracking-wider mb-2">Topic: ${q.topic}</h3>
        <div class="flex gap-2">
          <span class="text-xs text-on-surface-variant">Study this topic to improve:</span>
          <button onclick="navigateTo('lesson/${getTopicFromCode(q.code)}')" class="text-xs text-primary hover:underline">
            Go to Lesson
          </button>
        </div>
      </div>
    </div>
  `;
}

function checkPredictionAnswer() {
  const input = document.getElementById('predictionInput');
  if (!input || !currentPredictionQuestion) return;
  
  predictionAttempts++;
  const result = checkOutputAnswer(input.value, currentPredictionQuestion.answer);
  showPredictionFeedback(result, currentPredictionQuestion, result.correct);
}

function revealPredictionAnswer() {
  const feedbackDiv = document.getElementById('predictionFeedback');
  if (!feedbackDiv || !currentPredictionQuestion) return;
  
  feedbackDiv.innerHTML = `
    <div class="bg-primary-container/20 border border-primary/40 rounded-lg p-4 mt-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="material-symbols-outlined text-primary">lightbulb</span>
        <span class="font-bold text-primary">Correct Answer</span>
      </div>
      <p class="text-xl font-mono text-on-surface font-bold">${escapeHtml(currentPredictionQuestion.answer)}</p>
      <div class="mt-3 p-3 bg-surface-container rounded">
        <p class="text-sm font-bold text-tertiary mb-1">Explanation:</p>
        <p class="text-sm text-on-surface-variant">${currentPredictionQuestion.explanation}</p>
        ${currentPredictionQuestion.hint ? `
          <p class="text-xs text-outline mt-2"><span class="font-bold">Hint:</span> ${currentPredictionQuestion.hint}</p>
        ` : ''}
      </div>
    </div>
  `;
}

function getTopicFromCode(code) {
  const topics = {
    'for(': 'loops',
    'while(': 'loops',
    'int *': 'pointers',
    'int[]': 'arrays',
    'int fact': 'recursion',
    'if(': 'conditionals',
    'switch(': 'conditionals'
  };
  
  for (const [pattern, topic] of Object.entries(topics)) {
    if (code.includes(pattern)) return topic;
  }
  return 'loops';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderOutputPredictionList(topicKey = null) {
  let questions = [...outputPredictionDB];
  
  if (topicKey && topicKey !== 'all') {
    questions = questions.filter(q => q.topic === topicKey);
  }
  
  const topics = ['loops', 'conditionals', 'pointers', 'arrays', 'recursion', 'functions', 'strings', 'structures'];
  
  let html = `
    <div class="max-w-6xl mx-auto p-6">
      <h2 class="text-2xl font-bold text-on-surface mb-6 flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">quiz</span>
        Output Prediction Practice
      </h2>
      
      <div class="flex gap-2 mb-6 flex-wrap">
        <button onclick="renderOutputPredictionList('all')" 
          class="px-4 py-2 rounded-lg ${!topicKey || topicKey === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'} text-sm font-semibold transition-all">
          All Topics
        </button>
        ${topics.map(t => `
          <button onclick="renderOutputPredictionList('${t}')" 
            class="px-4 py-2 rounded-lg ${topicKey === t ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'} text-sm font-semibold transition-all">
            ${t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        `).join('')}
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${questions.map(q => {
          const diffColor = q.difficulty === 'easy' ? 'bg-tertiary/20 text-tertiary' : q.difficulty === 'medium' ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error';
          return `
            <div class="bg-surface-container rounded-lg border border-outline-variant/20 p-4 hover:border-primary/40 transition-all cursor-pointer"
              onclick="startPredictionFromList('${q.id}')">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold ${diffColor} px-2 py-0.5 rounded">${q.difficulty}</span>
                <span class="text-xs text-outline">${q.topic}</span>
              </div>
              <pre class="text-xs font-mono text-on-surface-variant line-clamp-3">${escapeHtml(q.code.substring(0, 100))}...</pre>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  
  return html;
}

function startPredictionFromList(questionId) {
  const question = outputPredictionDB.find(q => q.id === questionId);
  if (!question) return;
  
  currentPredictionQuestion = question;
  predictionAttempts = 0;
  
  const difficultyColor = question.difficulty === 'easy' ? 'text-tertiary' : question.difficulty === 'medium' ? 'text-primary' : 'text-error';
  
  const content = document.getElementById('quizContent') || document.getElementById('visualizeContent');
  if (!content) return;
  
  content.innerHTML = `
    <div class="max-w-4xl mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-on-surface flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">psychology</span>
          Output Prediction
        </h2>
        <span class="px-3 py-1 rounded-full bg-surface-container text-xs font-bold ${difficultyColor}">
          ${question.difficulty.toUpperCase()}
        </span>
      </div>
      
      <div class="bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden">
        <div class="px-4 py-2 bg-surface-container-high border-b border-outline-variant/20 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm text-outline">code</span>
          <span class="text-xs font-mono text-outline">Predict the output</span>
        </div>
        <div class="p-6">
          <pre class="font-mono text-sm text-on-surface bg-surface-container-lowest p-4 rounded-lg overflow-x-auto"><code>${escapeHtml(question.code)}</code></pre>
        </div>
      </div>
      
      <div class="mt-6">
        <label class="block text-sm font-semibold text-on-surface mb-2">
          Your Predicted Output:
        </label>
        <input type="text" 
          id="predictionInput" 
          placeholder="Enter your predicted output..."
          class="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-lg text-on-surface font-mono focus:border-primary focus:outline-none"
          onkeypress="if(event.key==='Enter') checkPredictionAnswer()"
        />
      </div>
      
      <div class="flex gap-3 mt-4">
        <button onclick="checkPredictionAnswer()" 
          class="px-6 py-3 bg-tertiary text-on-tertiary font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
          <span class="material-symbols-outlined">check</span>
          Check Answer
        </button>
        <button onclick="revealPredictionAnswer()" 
          class="px-6 py-3 bg-surface-container-high text-on-surface font-semibold rounded-lg hover:bg-surface-container border border-outline-variant transition-all flex items-center gap-2">
          <span class="material-symbols-outlined">visibility</span>
          Reveal Answer
        </button>
      </div>
      
      <div id="predictionFeedback"></div>
    </div>
  `;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    checkOutputAnswer, 
    renderOutputPredictionQuiz,
    renderOutputPredictionList 
  };
}