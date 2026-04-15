// logicQuestEngine.js - Logic Quest Game Engine

let logicQuestProgress = {
  currentLevel: 0,
  completedLevels: [],
  unlockedLevels: ['loops-1'],
  totalXP: 0
};

function loadLogicQuestProgress() {
  try {
    const data = localStorage.getItem('codeflow_logic_quest');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        logicQuestProgress = { ...logicQuestProgress, ...parsed };
      }
    }
  } catch (e) {
    console.error('Error loading Logic Quest progress:', e);
  }
}

function saveLogicQuestProgress() {
  try {
    localStorage.setItem('codeflow_logic_quest', JSON.stringify(logicQuestProgress));
  } catch (e) {
    console.error('Error saving Logic Quest progress:', e);
  }
}

function renderLogicQuestMap() {
  const content = document.getElementById('gameContent');
  if (!content) return;

  loadLogicQuestProgress();

  content.innerHTML = `
    <div class="max-w-4xl mx-auto p-4">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-on-surface flex items-center gap-2">
          <span class="material-symbols-outlined text-tertiary">map</span>
          Logic Quest
        </h2>
        <div class="flex items-center gap-4">
          <span class="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-sm font-bold">
            ${logicQuestProgress.totalXP} XP
          </span>
          <span class="text-sm text-outline">
            ${logicQuestProgress.completedLevels.length} / ${LOGIC_QUEST_LEVELS.length} Complete
          </span>
        </div>
      </div>

      <div class="bg-surface-container rounded-xl border border-outline-variant/20 p-6 relative overflow-hidden">
        <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          ${LOGIC_QUEST_MAP.filter(l => {
            const level = LOGIC_QUEST_LEVELS.find(ll => ll.id === l.id);
            return level && logicQuestProgress.completedLevels.includes(l.id);
          }).map(l => {
            const req = LOGIC_QUEST_MAP.find(m => m.id === l.id)?.requires;
            if (req && logicQuestProgress.completedLevels.includes(req)) {
              const from = LOGIC_QUEST_MAP.find(m => m.id === req);
              if (from) {
                return `<line x1="${from.x}" y1="${from.y}" x2="${l.x}" y2="${l.y}" stroke="#67df70" stroke-width="1" stroke-dasharray="2"/>`;
              }
            }
            return '';
          }).join('')}
        </svg>

        <div class="relative grid grid-cols-2 md:grid-cols-4 gap-4">
          ${LOGIC_QUEST_LEVELS.map(level => {
            const mapPos = LOGIC_QUEST_MAP.find(m => m.id === level.id) || { x: 0, y: 0 };
            const isUnlocked = logicQuestProgress.unlockedLevels.includes(level.id);
            const isCompleted = logicQuestProgress.completedLevels.includes(level.id);
            const isBoss = level.difficulty === 'boss';
            
            let statusClass = 'bg-surface-container border-outline-variant/30';
            let icon = 'lock';
            let cursor = 'not-allowed';
            
            if (isCompleted) {
              statusClass = 'bg-tertiary-container border-tertiary cursor-pointer';
              icon = 'check_circle';
              cursor = 'pointer';
            } else if (isUnlocked) {
              statusClass = isBoss ? 'bg-error-container border-error cursor-pointer' : 'bg-primary-container border-primary cursor-pointer';
              icon = isBoss ? 'whatshot' : 'play_arrow';
              cursor = 'pointer';
            }
            
            return `
              <button onclick="${isUnlocked ? `startLogicQuestLevel('${level.id}')` : ''}"
                class="p-4 rounded-lg border-2 ${statusClass} hover:brightness-110 transition-all text-left"
                style="cursor: ${cursor}"
                ${!isUnlocked ? 'disabled' : ''}>
                <div class="flex items-center justify-between mb-2">
                  <span class="material-symbols-outlined ${isBoss ? 'text-error' : 'text-on-surface-variant'}">${icon}</span>
                  <span class="text-xs px-2 py-0.5 rounded ${isBoss ? 'bg-error/20 text-error' : 'bg-surface-container-high text-outline'}">${level.xp} XP</span>
                </div>
                <div class="text-sm font-bold ${isBoss ? 'text-error' : 'text-on-surface'}">${level.name}</div>
                <div class="text-xs ${isCompleted ? 'text-tertiary' : 'text-outline'}">${level.topic}</div>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <div class="mt-6 p-4 bg-surface-container rounded-lg border border-outline-variant/20">
        <h3 class="text-sm font-bold text-outline uppercase mb-2">How to Play</h3>
        <ul class="text-sm text-on-surface-variant space-y-1">
          <li>• Each node contains a code puzzle - predict the output</li>
          <li>• Correct answers unlock the next level and award XP</li>
          <li>• Boss levels require deep understanding of recursion and pointers</li>
          <li>• Complete all levels to master C programming logic!</li>
        </ul>
      </div>
    </div>
  `;
}

function startLogicQuestLevel(levelId) {
  const level = LOGIC_QUEST_LEVELS.find(l => l.id === levelId);
  if (!level) return;

  const content = document.getElementById('gameContent');
  if (!content) return;

  content.innerHTML = `
    <div class="max-w-2xl mx-auto p-4">
      <button onclick="renderLogicQuestMap()" class="flex items-center gap-2 text-outline hover:text-on-surface mb-4">
        <span class="material-symbols-outlined">arrow_back</span>
        Back to Map
      </button>

      <div class="bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden">
        <div class="px-4 py-3 bg-surface-container-high border-b border-outline-variant/20 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">code</span>
            <span class="font-bold text-on-surface">${level.name}</span>
          </div>
          <span class="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-bold">
            +${level.xp} XP
          </span>
        </div>

        <div class="p-4">
          <pre class="font-mono text-sm bg-surface-container-lowest p-4 rounded-lg overflow-x-auto mb-4">${escapeHtml(level.code)}</pre>
          
          <p class="text-on-surface font-semibold mb-3">${level.question}</p>
          
          <div class="space-y-2 mb-4" id="questOptions">
            ${level.options.map((opt, i) => `
              <button onclick="checkLogicQuestAnswer(${i})" 
                class="w-full p-3 text-left rounded-lg border border-outline-variant/20 bg-surface-container-low hover:border-primary transition-all">
                <span class="font-mono text-sm">${opt}</span>
              </button>
            `).join('')}
          </div>

          <div id="questFeedback"></div>

          <div class="flex gap-2 mt-4">
            <button onclick="showQuestHint()" class="px-4 py-2 bg-surface-container text-on-surface-variant rounded hover:bg-surface-container-high text-sm">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">lightbulb</span>
                Hint
              </span>
            </button>
            <button onclick="showQuestVisualization('${level.id}')" class="px-4 py-2 bg-surface-container text-on-surface-variant rounded hover:bg-surface-container-high text-sm">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">visibility</span>
                Visualize
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  window.currentQuestLevel = level;
}

function checkLogicQuestAnswer(selectedIndex) {
  const level = window.currentQuestLevel;
  if (!level) return;

  const feedback = document.getElementById('questFeedback');
  const isCorrect = selectedIndex === level.correct;

  if (isCorrect) {
    if (!logicQuestProgress.completedLevels.includes(level.id)) {
      logicQuestProgress.completedLevels.push(level.id);
      logicQuestProgress.totalXP += level.xp;
      
      const mapPos = LOGIC_QUEST_MAP.find(m => m.id === level.id);
      if (mapPos) {
        const nextLevel = LOGIC_QUEST_MAP.find(m => m.requires === level.id);
        if (nextLevel && !logicQuestProgress.unlockedLevels.includes(nextLevel.id)) {
          logicQuestProgress.unlockedLevels.push(nextLevel.id);
        }
      }
      
      saveLogicQuestProgress();
    }

    feedback.innerHTML = `
      <div class="p-4 bg-tertiary/20 border border-tertiary rounded-lg">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-outlined text-tertiary">check_circle</span>
          <span class="font-bold text-tertiary">Correct! +${level.xp} XP</span>
        </div>
        <p class="text-sm text-on-surface-variant">${level.explanation}</p>
        <button onclick="renderLogicQuestMap()" class="mt-3 px-4 py-2 bg-tertiary text-on-tertiary rounded hover:brightness-110">
          Continue
        </button>
      </div>
    `;

    const options = document.querySelectorAll('#questOptions button');
    options[level.correct].classList.add('bg-tertiary-container', 'border-tertiary');
  } else {
    feedback.innerHTML = `
      <div class="p-4 bg-error/20 border border-error rounded-lg">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-outlined text-error">cancel</span>
          <span class="font-bold text-error">Incorrect. Try again!</span>
        </div>
        <p class="text-sm text-on-surface-variant">${level.hint}</p>
      </div>
    `;
  }
}

function showQuestHint() {
  const level = window.currentQuestLevel;
  if (!level) return;

  const feedback = document.getElementById('questFeedback');
  feedback.innerHTML = `
    <div class="p-4 bg-primary-container/20 border border-primary rounded-lg">
      <div class="flex items-center gap-2 mb-2">
        <span class="material-symbols-outlined text-primary">lightbulb</span>
        <span class="font-bold text-primary">Hint</span>
      </div>
      <p class="text-sm text-on-surface-variant">${level.hint}</p>
    </div>
  `;
}

function showQuestVisualization(levelId) {
  const level = window.currentQuestLevel;
  if (!level) return;

  navigateTo(`visualize/${level.topic}`);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderLogicQuestMap,
    startLogicQuestLevel,
    loadLogicQuestProgress
  };
}