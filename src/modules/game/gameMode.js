// gameMode.js - Game mode functionality

let currentGameTab = 'levels';

function renderGameMode() {
  const content = document.getElementById('gameContent');
  
  content.innerHTML = `
    <div class="max-w-4xl mx-auto p-4">
      <div class="flex gap-2 border-b border-outline-variant/20 mb-6">
        <button onclick="switchGameTab('levels')" id="gameTabLevels" 
          class="px-4 py-2 text-sm font-semibold border-b-2 border-primary text-primary">
          <span class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">sports_esports</span>
            Game Levels
          </span>
        </button>
        <button onclick="switchGameTab('logicquest')" id="gameTabLogicQuest" 
          class="px-4 py-2 text-sm font-semibold border-b-2 border-transparent text-on-surface-variant hover:text-on-surface">
          <span class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">map</span>
            Logic Quest
          </span>
        </button>
      </div>
      <div id="gameTabContent"></div>
    </div>
  `;
  
  switchGameTab('levels');
}

function switchGameTab(tab) {
  currentGameTab = tab;
  const content = document.getElementById('gameTabContent');
  const levelsBtn = document.getElementById('gameTabLevels');
  const questBtn = document.getElementById('gameTabLogicQuest');
  
  if (tab === 'levels') {
    levelsBtn.className = 'px-4 py-2 text-sm font-semibold border-b-2 border-primary text-primary';
    questBtn.className = 'px-4 py-2 text-sm font-semibold border-b-2 border-transparent text-on-surface-variant hover:text-on-surface';
    renderGameLevels();
  } else {
    levelsBtn.className = 'px-4 py-2 text-sm font-semibold border-b-2 border-transparent text-on-surface-variant hover:text-on-surface';
    questBtn.className = 'px-4 py-2 text-sm font-semibold border-b-2 border-primary text-primary';
    renderLogicQuestMap();
  }
}

function renderGameLevels() {
  // Load game state
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

  const content = document.getElementById('gameContent');
  content.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Player Stats -->
      <div class="lg:col-span-1">
        <div class="bg-surface-container rounded-lg p-6 border border-outline-variant/20">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center">
              <span class="material-symbols-outlined text-on-primary">person</span>
            </div>
            <div>
              <h3 class="font-bold text-lg">Player</h3>
              <p class="text-sm text-outline">Level ${Math.floor(AppState.xp / 100) + 1}</p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-outline">XP Progress</span>
                <span class="text-primary font-bold">${AppState.xp} / ${(Math.floor(AppState.xp / 100) + 1) * 100}</span>
              </div>
              <div class="w-full bg-surface-container-high rounded-full h-2">
                <div class="bg-gradient-to-r from-primary to-primary-container h-2 rounded-full transition-all duration-500" style="width: ${(AppState.xp % 100)}%"></div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-center">
              <div class="bg-surface-container-high p-3 rounded-lg">
                <div class="text-2xl font-bold text-tertiary">${AppState.completedTopics?.length || 0}</div>
                <div class="text-xs text-outline uppercase">Completed</div>
              </div>
              <div class="bg-surface-container-high p-3 rounded-lg">
                <div class="text-2xl font-bold text-primary">${AppState.streak || 0}</div>
                <div class="text-xs text-outline uppercase">Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Level Map -->
      <div class="lg:col-span-2">
        <div class="bg-surface-container rounded-lg border border-outline-variant/20 overflow-hidden">
          <div class="px-6 py-4 bg-surface-container-high border-b border-outline-variant/20">
            <h2 class="text-lg font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">map</span>
              Code Journey
            </h2>
            <p class="text-sm text-outline mt-1">Complete challenges to earn XP and unlock new levels</p>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="levelGrid">
              ${renderLevelGrid()}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Challenge Modal (hidden by default) -->
    <div id="challengeModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-surface-container rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div class="px-6 py-4 bg-surface-container-high border-b border-outline-variant/20 flex justify-between items-center">
            <h3 class="text-xl font-bold" id="challengeTitle">Challenge</h3>
            <button class="p-2 hover:bg-surface-container rounded-lg transition-colors" onclick="closeChallenge()">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-6 space-y-6" id="challengeContent">
            <!-- Challenge content will be loaded here -->
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderLevelGrid() {
  return AppState.levels.map(level => `
    <div class="relative group">
      <div class="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-container rounded-lg blur opacity-0 ${level.completed ? 'opacity-75' : 'group-hover:opacity-75'} transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <div class="relative bg-surface-container-high p-4 rounded-lg border ${level.completed ? 'border-tertiary bg-tertiary/5' : 'border-outline-variant/20 group-hover:border-primary-container'} transition-all cursor-pointer" onclick="startChallenge(${level.id})">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            ${level.completed ? '<span class="material-symbols-outlined text-tertiary">check_circle</span>' : '<span class="material-symbols-outlined text-primary-container">radio_button_unchecked</span>'}
            <span class="text-sm font-bold text-outline">Level ${level.id}</span>
          </div>
          <span class="text-xs font-mono text-tertiary bg-surface-container px-2 py-1 rounded">+${level.xp} XP</span>
        </div>
        <h4 class="font-semibold mb-1">${level.title}</h4>
        <p class="text-sm text-outline">${level.description}</p>
      </div>
    </div>
  `).join('');
}

function startChallenge(levelId) {
  const level = AppState.levels.find(l => l.id === levelId);
  if (!level) return;

  const modal = document.getElementById('challengeModal');
  const title = document.getElementById('challengeTitle');
  const content = document.getElementById('challengeContent');

  title.textContent = `Level ${level.id}: ${level.title}`;
  content.innerHTML = `
    <div class="space-y-6">
      <div class="bg-surface-container-low p-4 rounded-lg border border-outline-variant/20">
        <h4 class="font-semibold mb-2">Objective</h4>
        <p class="text-sm text-on-surface-variant">${level.description}</p>
      </div>

      <div class="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/20">
        <h4 class="font-semibold mb-3">Write Code</h4>
        <textarea id="codeInput" class="w-full h-32 bg-surface-container font-mono text-sm p-3 rounded border border-outline-variant/20 focus:border-primary-container focus:outline-none resize-none" placeholder="Write your C code here..."></textarea>
      </div>

      <div class="flex gap-3">
        <button class="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold rounded-lg hover:brightness-110 transition-all" onclick="submitChallenge(${levelId})">
          Submit Solution
        </button>
        <button class="px-4 py-2 bg-surface-container-high text-on-surface border border-outline-variant/20 rounded-lg hover:bg-surface-container transition-all" onclick="closeChallenge()">
          Cancel
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeChallenge() {
  document.getElementById('challengeModal').classList.add('hidden');
}

function submitChallenge(levelId) {
  const code = document.getElementById('codeInput').value.trim();
  if (!code) {
    alert('Please write some code first!');
    return;
  }

  // Simple validation (in real app, this would be server-side)
  const level = AppState.levels.find(l => l.id === levelId);
  if (level && !level.completed) {
    level.completed = true;
    AppState.xp += level.xp;
    AppState.streak = (AppState.streak || 0) + 1;
    saveState();

    alert(`Challenge completed! +${level.xp} XP earned.`);
    closeChallenge();
    renderGameMode(); // Refresh the UI
  }
}