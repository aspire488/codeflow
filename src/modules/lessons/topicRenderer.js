// topicRenderer.js - Topic rendering functions

// Import comprehensive topics database
// Note: In a real implementation, this would be imported as a module
// For now, we'll assume TOPICS_DB is available globally from data/topicsDB.js

// Render topic list in sidebar
function renderTopicList() {
  const list = document.getElementById('topicList');
  list.innerHTML = '';
  Object.entries(TOPICS_DB).forEach(([key, topic]) => {
    const completed = AppState.completedTopics.includes(key);
    const item = document.createElement('a');
    item.className = 'flex items-center gap-3 px-3 py-2 text-[#8b949e] hover:bg-[#10141a] transition-all duration-200 ease-in-out font-["Inter"] text-[0.875rem] font-medium rounded-sm cursor-pointer';
    item.innerHTML = `
      <span class="material-symbols-outlined text-[20px]">${topic.icon || 'school'}</span>
      <span>${topic.title}</span>
      ${completed ? '<span class="material-symbols-outlined ml-auto text-tertiary text-sm">check_circle</span>' : ''}
    `;
    item.addEventListener('click', () => navigateTo(`lesson/${key}`));
    list.appendChild(item);
  });
}

// Render topic grid on dashboard
function renderTopicGrid() {
  const grid = document.getElementById('topicGrid');
  if (!grid) return;
  
  grid.innerHTML = '';
  Object.entries(TOPICS_DB).forEach(([key, topic]) => {
    const completed = AppState.completedTopics.includes(key);
    const summary = topic.concept?.[0] || topic.examTip || '';
    const lessons = topic.concept?.length || 1;
    const progress = completed ? 100 : 0;
    
    const card = document.createElement('div');
    card.className = `topic-card bg-surface-container p-4 md:p-6 rounded-lg border border-outline-variant/20 ${completed ? 'opacity-80' : 'bg-surface-container-high border-l-4 border-primary-container'} cursor-pointer relative overflow-hidden`;
    card.innerHTML = `
      ${completed ? '<div class="absolute top-0 right-0 p-2"><span class="material-symbols-outlined text-tertiary text-xl">check_circle</span></div>' : '<div class="absolute top-0 right-0 p-2"><span class="material-symbols-outlined text-primary-container text-xl animate-pulse">play_circle</span></div>'}
      <div class="flex items-center gap-2 mb-3">
        <span class="material-symbols-outlined ${completed ? 'text-outline' : 'text-primary-container'} text-[20px]">${topic.icon || 'school'}</span>
        <h4 class="font-bold text-on-surface">${topic.title}</h4>
      </div>
      <p class="text-xs text-outline mb-4 line-clamp-2">${summary}</p>
      <div class="progress-bar mb-2">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
      <div class="flex items-center gap-2 text-[10px] text-on-surface-variant">
        <span>${completed ? 'COMPLETED' : 'START LEARNING'}</span>
        <span class="w-1 h-1 bg-outline rounded-full"></span>
        <span>${lessons} LESSONS</span>
      </div>
    `;
    card.addEventListener('click', () => navigateTo(`lesson/${key}`));
    grid.appendChild(card);
  });
}

// Render lesson content
function renderLesson(topicKey) {
  console.log('[TopicRenderer] renderLesson called with:', topicKey);
  const topic = TOPICS_DB[topicKey];
  console.log('[TopicRenderer] Topic found:', !!topic);
  if (!topic) {
    console.log('[TopicRenderer] Topic not found:', topicKey);
    return;
  }

  AppState.currentTopic = topicKey;
  document.getElementById('lessonTitle').textContent = topic.title;

  // Render sidebar
  const sidebar = document.getElementById('lessonSidebar');
  sidebar.innerHTML = '';
  Object.entries(TOPICS_DB).forEach(([key, t]) => {
    const item = document.createElement('a');
    item.className = `flex items-center gap-3 px-4 py-3 ${key === topicKey ? 'bg-[#262a31] text-[#58a6ff] border-l-2 border-[#58a6ff]' : 'text-[#8b949e] hover:bg-[#10141a]'} transition-all`;
    item.innerHTML = `<span class="material-symbols-outlined">${t.icon}</span><span class="font-['Inter'] text-[0.875rem] font-medium">${t.title}</span>`;
    item.addEventListener('click', () => navigateTo(`lesson/${key}`));
    sidebar.appendChild(item);
  });

  // Render content
  const sampleQuiz = topic.quiz?.[0] || { question: 'Try this quick self-check.', options: ['A', 'B', 'C', 'D'], correct: 0, explanation: 'Review the concept and try again.' };
  const content = document.getElementById('lessonContent');
  content.innerHTML = `
    <div class="mt-8 space-y-6">
      <section class="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-symbols-outlined text-primary-container" style="font-variation-settings: 'FILL' 1;">lightbulb</span>
          <h2 class="text-xl font-semibold tracking-tight font-headline">The Concept of ${topic.title}</h2>
        </div>
        <ul class="list-disc list-inside space-y-2 text-on-surface-variant text-sm">
          ${topic.concept.map(point => `<li>${point}</li>`).join('')}
        </ul>
      </section>

      <section class="overflow-hidden bg-surface-container-lowest rounded-lg shadow-xl relative group">
        <div class="absolute left-0 top-0 bottom-0 w-[3px] bg-primary-container"></div>
        <div class="flex items-center justify-between px-6 py-3 bg-surface-container border-b border-outline-variant/20">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-error/40"></span>
            <span class="w-3 h-3 rounded-full bg-tertiary/40"></span>
            <span class="w-3 h-3 rounded-full bg-primary/40"></span>
            <span class="ml-4 text-xs font-mono text-outline">${topicKey}.c</span>
          </div>
          <div class="flex gap-2">
            <button class="p-1.5 hover:bg-surface-container-high rounded transition-colors text-outline-variant hover:text-on-surface copy-btn">
              <span class="material-symbols-outlined text-sm">content_copy</span>
            </button>
          </div>
        </div>
        <div class="p-6">
          <pre class="font-code text-[0.8125rem] leading-relaxed overflow-x-auto code-block">${highlightCode(topic.code)}</pre>
        </div>
        <div class="flex items-center gap-0 border-t border-outline-variant/10 p-1">
          <button class="flex-1 flex items-center justify-center gap-2 py-3 font-medium text-xs text-tertiary hover:bg-surface-container-high transition-colors run-btn">
            <span class="material-symbols-outlined text-sm">play_arrow</span> Run
          </button>
          <div class="w-[1px] h-6 bg-outline-variant/20"></div>
          <button class="flex-1 flex items-center justify-center gap-2 py-3 font-medium text-xs text-primary-container hover:bg-surface-container-high transition-colors visualize-btn">
            <span class="material-symbols-outlined text-sm">visibility</span> Visualize
          </button>
          <div class="w-[1px] h-6 bg-outline-variant/20"></div>
          <button class="flex-1 flex items-center justify-center gap-2 py-3 font-medium text-xs text-secondary hover:bg-surface-container-high transition-colors analyze-logic-btn">
            <span class="material-symbols-outlined text-sm">psychology</span> Analyze
          </button>
        </div>
      </section>

      <div id="logicAnalysisContainer" class="mt-4"></div>

      <section class="bg-surface p-6 rounded-lg border border-outline-variant/20">
        <h3 class="text-sm font-bold uppercase tracking-widest text-outline mb-4">Explanation</h3>
        <ul class="list-disc list-inside space-y-2 text-on-surface-variant text-sm">
          ${topic.explanation.map(point => `<li>${point}</li>`).join('')}
        </ul>
      </section>

      ${topic.examTip ? `
      <section class="bg-tertiary-container/10 p-4 rounded-lg border border-tertiary/20">
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-tertiary mt-0.5">tips_and_updates</span>
          <div>
            <h4 class="text-sm font-bold text-tertiary mb-1">Exam Tip</h4>
            <p class="text-sm text-on-surface-variant">${topic.examTip}</p>
          </div>
        </div>
      </section>
      ` : ''}

      <section class="bg-surface-container-low p-6 rounded-lg border border-outline-variant/20">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 class="text-lg font-semibold tracking-tight font-headline">Quick Practice</h2>
            <p class="text-sm text-on-surface-variant mt-2">${topic.practiceQ}</p>
          </div>
          <button class="px-6 py-3 min-h-10 border border-primary-container text-primary-container text-sm font-semibold rounded hover:bg-surface-container-high transition-all active:scale-95 start-quiz-btn">Launch Full Quiz</button>
        </div>
        <div class="space-y-3 quiz-options">
          ${sampleQuiz.options.map((opt, i) => `
            <label class="block p-4 rounded-lg border border-outline-variant/20 bg-surface-container-low hover:border-primary-container cursor-pointer transition-all group">
              <div class="flex items-center justify-between">
                <span class="font-code text-sm">${opt}</span>
                <div class="w-5 h-5 rounded-full border border-outline-variant group-hover:border-primary-container flex items-center justify-center"></div>
              </div>
            </label>
          `).join('')}
        </div>
        <div class="mt-6 flex justify-between flex-wrap gap-2">
          <button class="px-6 py-3 min-h-10 bg-gradient-to-br from-primary to-primary-container text-on-primary text-sm font-semibold rounded hover:brightness-110 transition-all active:scale-95 check-quiz-btn">Check Answer</button>
          <div class="quiz-result mt-4 w-full" style="display: none;"></div>
        </div>
      </section>
    </div>
  `;

  // Add event listeners
  content.querySelector('.copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(topic.code);
    alert('Code copied!');
  });

  content.querySelector('.run-btn').addEventListener('click', () => {
    const encodedCode = encodeURIComponent(topic.code);
    window.open(`https://www.onlinegdb.com/online_c_compiler?code=${encodedCode}`, '_blank');
  });

  content.querySelector('.visualize-btn').addEventListener('click', () => {
    navigateTo(`visualize/${topicKey}`);
  });

  const analyzeBtn = content.querySelector('.analyze-logic-btn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      const code = topic.code || '';
      const language = topic.language || 'c';
      analyzeAndRender(code, language, 'logicAnalysisContainer');
    });
  }

  const startQuizBtn = content.querySelector('.start-quiz-btn');
  if (startQuizBtn) {
    startQuizBtn.addEventListener('click', () => {
      navigateTo(`quiz/${topicKey}`);
    });
  }

  content.querySelector('.check-quiz-btn').addEventListener('click', () => {
    const options = content.querySelectorAll('.quiz-options input[type="radio"]');
    let selected = -1;
    options.forEach((opt, i) => {
      if (opt.checked) selected = i;
    });
    const result = content.querySelector('.quiz-result');
    if (selected === sampleQuiz.correct) {
      result.innerHTML = `<div class="p-4 bg-tertiary/10 border border-tertiary rounded-lg"><span class="text-tertiary font-bold">Correct!</span> ${sampleQuiz.explanation}</div>`;
      if (!AppState.completedTopics.includes(topicKey)) {
        AppState.completedTopics.push(topicKey);
        saveState();
      }
    } else {
      result.innerHTML = `<div class="p-4 bg-error/10 border border-error rounded-lg"><span class="text-error font-bold">Incorrect.</span> ${sampleQuiz.explanation}</div>`;
    }
    result.style.display = 'block';
  });

  // Add radio buttons for quiz
  const labels = content.querySelectorAll('.quiz-options label');
  labels.forEach((label, i) => {
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'quiz-option';
    radio.style.display = 'none';
    label.insertBefore(radio, label.firstChild);
    label.addEventListener('click', () => {
      radio.checked = true;
      labels.forEach(l => l.classList.remove('bg-[#262a31]', 'border-primary-container'));
      label.classList.add('bg-[#262a31]', 'border-primary-container');
    });
  });
}

// Simple code highlighting
function highlightCode(code) {
  return code
    .replace(/#include/g, '<span class="text-[#8b949e]">#include</span>')
    .replace(/int|float|char|double|void/g, '<span class="text-[#d19a66]">$&</span>')
    .replace(/main|printf|scanf|return/g, '<span class="text-[#61afef]">$&</span>')
    .replace(/"[^"]*"/g, '<span class="text-[#98c379]">$&</span>')
    .replace(/\/\/.*$/gm, '<span class="text-[#8b949e]">$&</span>');
}