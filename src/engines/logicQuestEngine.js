// ============================================
// LOGIC QUEST
//
// Two challenge types:
//  - Execution challenges (below): the player chooses the next action the
//    program takes. The stepper really tracks i, the condition result and the
//    output, so the only way to win is a correct execution order.
//  - Prediction challenges: the existing LOGIC_QUEST_LEVELS multiple choice data.
// ============================================

const QUEST_STORAGE_KEY = 'codeflow_logic_quest';

const QUEST_CHAPTERS = [
  { id: 'start', title: 'START', blurb: 'Read what a loop does before it runs.', topics: ['loops'] },
  { id: 'conditions', title: 'CONDITIONS', blurb: 'Decide which branch executes.', topics: ['conditionals'] },
  { id: 'loops', title: 'LOOPS', blurb: 'Repeat, count and exit correctly.', topics: ['loops'] },
  { id: 'arrays', title: 'ARRAYS', blurb: 'Walk indexed data without going out of bounds.', topics: ['arrays', 'strings'] },
  { id: 'pointers', title: 'POINTERS', blurb: 'Follow addresses, not values.', topics: ['pointers'] },
  { id: 'recursion', title: 'RECURSION', blurb: 'Unwind the call stack in the right order.', topics: ['recursion'] },
  { id: 'boss', title: 'FINAL BOSS', blurb: 'Combine everything at speed.', topics: ['boss'] }
];

let logicQuestProgress = {
  completedLevels: [],
  totalXP: 0,
  attempts: 0
};

// ---------- persistence ----------

function loadLogicQuestProgress() {
  try {
    const stored = localStorage.getItem(QUEST_STORAGE_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return;
    logicQuestProgress.completedLevels = Array.isArray(parsed.completedLevels)
      ? parsed.completedLevels.filter((id) => typeof id === 'string')
      : [];
    logicQuestProgress.totalXP = Number.isFinite(parsed.totalXP) ? Math.max(0, Math.floor(parsed.totalXP)) : 0;
    logicQuestProgress.attempts = Number.isFinite(parsed.attempts) ? Math.max(0, Math.floor(parsed.attempts)) : 0;
  } catch (error) {
    console.warn('[quest] Progress was unreadable and has been reset.', error);
    try { localStorage.removeItem(QUEST_STORAGE_KEY); } catch (_) { /* storage unavailable */ }
  }
}

function saveLogicQuestProgress() {
  try {
    localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(logicQuestProgress));
  } catch (error) {
    console.warn('[quest] Progress could not be saved.', error);
  }
}

function reloadLogicQuestProgress() {
  logicQuestProgress = { completedLevels: [], totalXP: 0, attempts: 0 };
  loadLogicQuestProgress();
}

// ---------- level helpers ----------

function questLevels() {
  return typeof LOGIC_QUEST_LEVELS !== 'undefined' ? LOGIC_QUEST_LEVELS : [];
}

function questMap() {
  return typeof LOGIC_QUEST_MAP !== 'undefined' ? LOGIC_QUEST_MAP : [];
}

function questLevelById(levelId) {
  return questLevels().find((level) => level.id === levelId) || null;
}

function isLevelUnlocked(levelId) {
  const node = questMap().find((entry) => entry.id === levelId);
  if (!node || !node.requires) return true;
  return logicQuestProgress.completedLevels.includes(node.requires);
}

function chapterForLevel(level) {
  if (level.difficulty === 'boss') return 'boss';
  const chapter = QUEST_CHAPTERS.find((c) => c.id !== 'boss' && c.topics.includes(level.topic));
  return chapter ? chapter.id : 'start';
}

function nextLevelAfter(levelId) {
  const nextNode = questMap().find((node) => node.requires === levelId);
  return nextNode ? nextNode.id : null;
}

// ---------- execution challenge ----------

// A real stepper for `for (int i = 0; i < 3; i++) { printf("*"); }`
function createLoopExecution() {
  return {
    id: 'loops-1',
    code: 'for (int i = 0; i < 3; i++) {\n    printf("*");\n}',
    goal: 'Run the loop correctly and finish with the output ***',
    expectedOutput: '***',
    i: 0,
    output: '',
    phase: 'check',
    finished: false,
    mistakes: 0,
    log: ['Program start. i is not declared yet.']
  };
}

const executionChallenges = {};

function executionFor(levelId) {
  return executionChallenges[levelId] || null;
}

function beginExecution(levelId) {
  if (levelId !== 'loops-1') return null;
  const state = createLoopExecution();
  executionChallenges[levelId] = state;
  return state;
}

function expectedActions(state) {
  if (state.finished) return ['finish'];
  if (state.phase === 'check') return ['check', state.i < 3 ? 'body' : 'exit'];
  if (state.phase === 'body') return ['body', 'increment'];
  if (state.phase === 'increment') return ['increment', 'check'];
  return [];
}

function applyExecutionAction(state, action) {
  if (state.finished && action !== 'finish') {
    return { ok: false, message: 'This run is already finished. Reset to play again.' };
  }

  if (state.phase === 'check') {
    if (action === 'check') {
      const holds = state.i < 3;
      state.log.push(`Evaluate i < 3 with i = ${state.i} \u2192 ${holds}`);
      state.phase = holds ? 'body' : 'done';
      if (!holds) state.log.push('Condition is false, so the loop is skipped and control leaves the loop.');
      return { ok: true, message: holds ? 'Condition is true - the body runs next.' : 'Condition is false - leave the loop.' };
    }
    if (action === 'body' && state.i < 3) return { ok: false, message: 'You cannot run the body before evaluating the condition.' };
    if (action === 'exit') return { ok: false, message: 'You must evaluate the condition before deciding to exit.' };
    return { ok: false, message: 'Evaluate the loop condition first.' };
  }

  if (state.phase === 'body') {
    if (action === 'body') {
      state.output += '*';
      state.log.push(`Execute body with i = ${state.i}: print "*" \u2192 "${state.output}"`);
      state.phase = 'increment';
      return { ok: true, message: `Body executed. Output is now ${state.output}` };
    }
    return { ok: false, message: 'The body runs before the increment step.' };
  }

  if (state.phase === 'increment') {
    if (action === 'increment') {
      state.i += 1;
      state.log.push(`Run i++ \u2192 i = ${state.i}`);
      state.phase = 'check';
      return { ok: true, message: `i is now ${state.i}. Loop back to the condition.` };
    }
    return { ok: false, message: 'The update step must run before the next condition check.' };
  }

  if (state.phase === 'done') {
    if (action === 'finish') {
      state.finished = true;
      const success = state.output === state.expectedOutput;
      state.log.push(`Finished with output "${state.output}".`);
      return {
        ok: success,
        finished: true,
        success,
        message: success ? 'Correct execution order.' : `Output is "${state.output}" but expected "${state.expectedOutput}".`
      };
    }
    return { ok: false, message: 'The loop has exited - finish the level.' };
  }

  return { ok: false, message: 'Unknown state.' };
}

// ---------- rendering ----------

function renderLogicQuestMap() {
  const host = document.getElementById('game-content');
  if (!host) return;
  loadLogicQuestProgress();

  const levels = questLevels();
  if (!levels.length) {
    host.innerHTML = emptyState('Quest data missing', 'The Logic Quest level data did not load.', 'Back to dashboard', 'dashboard');
    return;
  }

  const completed = logicQuestProgress.completedLevels.length;
  const percentage = Math.round((completed / levels.length) * 100);

  host.innerHTML = `
    <div class="quest-header">
      <div>
        <h2 class="screen-title" style="margin:0">Logic Quest</h2>
        <p class="screen-subtitle">${completed} of ${levels.length} levels complete &middot; ${logicQuestProgress.totalXP} XP</p>
      </div>
      <div class="progress-bar" style="width:160px"><div class="progress-fill" style="width:${percentage}%"></div></div>
    </div>

    <div class="quest-map">
      ${QUEST_CHAPTERS.map((chapter) => {
        const chapterLevels = levels.filter((level) => chapterForLevel(level) === chapter.id);
        if (!chapterLevels.length) return '';
        return `
          <section class="quest-chapter">
            <h4>${escapeHtml(chapter.title)}</h4>
            <p>${escapeHtml(chapter.blurb)}</p>
            <div class="quest-levels">
              ${chapterLevels.map((level) => {
                const unlocked = isLevelUnlocked(level.id);
                const done = logicQuestProgress.completedLevels.includes(level.id);
                return `
                  <button class="quest-node ${done ? 'done' : ''}" data-action="play-level" data-level="${escapeHtml(level.id)}"
                    ${unlocked ? '' : 'disabled'}>
                    <span class="quest-name">${escapeHtml(level.name)}</span>
                    <span class="quest-foot">
                      <span>${done ? 'Completed' : unlocked ? 'Play' : 'Locked'}</span>
                      <span>+${level.xp} XP</span>
                    </span>
                  </button>`;
              }).join('')}
            </div>
          </section>`;
      }).join('')}
    </div>

    <div class="stitch-card pad-lg" style="margin-top:20px">
      <h3 class="card-title">How it works</h3>
      <p class="muted">The START chapter is an execution-order challenge: you choose the next action the program performs, and the runtime tracks the real variable state and output. Every other node is a prediction challenge. Levels unlock in order and progress is saved in this browser.</p>
    </div>
  `;
}

function startLogicQuestLevel(levelId) {
  const level = questLevelById(levelId);
  if (!level) {
    navigateTo('game');
    return;
  }
  if (!isLevelUnlocked(levelId)) {
    openModal({
      title: 'Level locked',
      body: '<p class="muted">Complete the previous level on the path to unlock this one.</p>',
      actions: '<button class="stitch-btn" id="modal-back">Back to map</button>'
    });
    document.getElementById('modal-back')?.addEventListener('click', () => { closeModal(); navigateTo('game'); });
    return;
  }

  if (levelId === 'loops-1') {
    renderExecutionChallenge(beginExecution(levelId), level);
  } else {
    renderPredictionChallenge(level);
  }
}

function renderPredictionChallenge(level) {
  const host = document.getElementById('game-content');
  if (!host) return;

  host.innerHTML = `
    <div class="screen-heading">
      <button class="stitch-btn secondary" data-nav="game"><span class="material-symbols-outlined" style="font-size:16px">arrow_back</span> Map</button>
      <h2 class="screen-title" style="margin-top:16px">${escapeHtml(level.name)}</h2>
      <p class="screen-subtitle">${escapeHtml(level.topic)} &middot; ${escapeHtml(level.difficulty)} &middot; +${level.xp} XP</p>
    </div>
    <div class="stitch-card quest-panel">
      <pre class="quest-code">${escapeHtml(level.code)}</pre>
      <p style="font-weight:600;margin:0 0 10px">${escapeHtml(level.question)}</p>
      <div class="action-grid" id="quest-options">
        ${level.options.map((option, index) => `
          <button class="action-btn" data-quest-option="${index}">${escapeHtml(option)}</button>
        `).join('')}
      </div>
      <div id="quest-feedback"></div>
      <div class="button-row">
        <button class="stitch-btn secondary" id="quest-hint">Hint</button>
      </div>
    </div>
  `;

  host.querySelectorAll('[data-quest-option]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.getAttribute('data-quest-option'));
      const correct = index === level.correct;
      const feedback = document.getElementById('quest-feedback');

      if (!correct) {
        logicQuestProgress.attempts += 1;
        saveLogicQuestProgress();
        feedback.innerHTML = `<div class="feedback bad"><strong>Not yet</strong>${escapeHtml(level.hint || 'Trace the code line by line.')}</div>`;
        return;
      }

      completeQuestLevel(level);
      feedback.innerHTML = `
        <div class="feedback ok">
          <strong>Correct &mdash; +${level.xp} XP</strong>
          ${escapeHtml(level.explanation || '')}
        </div>`;
      host.querySelectorAll('[data-quest-option]').forEach((b) => { b.disabled = true; });
      const next = nextLevelAfter(level.id);
      if (next) feedback.innerHTML += `<div class="button-row"><button class="stitch-btn" data-action="play-level" data-level="${escapeHtml(next)}">Next level</button></div>`;
    });
  });

  document.getElementById('quest-hint').addEventListener('click', () => {
    document.getElementById('quest-feedback').innerHTML =
      `<div class="callout"><strong>Hint:</strong> ${escapeHtml(level.hint || 'Trace the variables after each iteration.')}</div>`;
  });
}

function renderExecutionChallenge(state, level) {
  const host = document.getElementById('game-content');
  if (!host) return;
  if (!state) {
    host.innerHTML = emptyState('Challenge unavailable', 'This execution challenge could not start.', 'Back to map', 'game');
    return;
  }

  host.innerHTML = `
    <div class="screen-heading">
      <button class="stitch-btn secondary" data-nav="game"><span class="material-symbols-outlined" style="font-size:16px">arrow_back</span> Map</button>
      <h2 class="screen-title" style="margin-top:16px">${escapeHtml(level.name)} &mdash; execution order</h2>
      <p class="screen-subtitle">${escapeHtml(state.goal)}</p>
    </div>
    <div class="stitch-card quest-panel">
      <pre class="quest-code">${escapeHtml(state.code)}</pre>
      <div class="stat-grid" style="margin:0 0 12px">
        <div class="stat"><div class="stat-value" id="exec-i">${state.i}</div><div class="stat-label">i</div></div>
        <div class="stat"><div class="stat-value" id="exec-output" style="font-family:ui-monospace,monospace">${state.output || '-'}</div><div class="stat-label">Output</div></div>
        <div class="stat"><div class="stat-value" id="exec-mistakes">${state.mistakes}</div><div class="stat-label">Mistakes</div></div>
      </div>
      <p class="muted" style="margin:0 0 8px">What does the program do next?</p>
      <div class="action-grid" id="exec-actions">
        <button class="action-btn" data-exec-action="check">Evaluate i &lt; 3</button>
        <button class="action-btn" data-exec-action="body">Execute the loop body</button>
        <button class="action-btn" data-exec-action="increment">Run i++</button>
        <button class="action-btn" data-exec-action="exit">Exit the loop</button>
        <button class="action-btn" data-exec-action="finish">Finish the program</button>
      </div>
      <div id="exec-feedback"></div>
      <h4 class="card-title" style="margin-top:16px">Execution log</h4>
      <div class="trace-log" id="exec-log"></div>
      <div class="button-row">
        <button class="stitch-btn secondary" id="exec-reset">Reset run</button>
      </div>
    </div>
  `;

  const paint = () => {
    document.getElementById('exec-i').textContent = state.i;
    document.getElementById('exec-output').textContent = state.output || '-';
    document.getElementById('exec-mistakes').textContent = state.mistakes;
    document.getElementById('exec-log').textContent = state.log.join('\n');
    document.querySelectorAll('[data-exec-action]').forEach((button) => {
      button.disabled = state.finished;
    });
  };

  host.querySelectorAll('[data-exec-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-exec-action');
      const result = applyExecutionAction(state, action);
      const feedback = document.getElementById('exec-feedback');

      if (!result.ok) {
        state.mistakes += 1;
        state.log.push(`Wrong action: ${action}. ${result.message}`);
      } else {
        state.log.push(`Correct: ${action}. ${result.message}`);
      }

      feedback.innerHTML = `<div class="feedback ${result.ok ? 'ok' : 'bad'}"><strong>${result.ok ? 'Correct step' : 'Not this one'}</strong>${escapeHtml(result.message)}</div>`;
      paint();

      if (result.finished) {
        if (result.success) {
          completeQuestLevel(level);
          const next = nextLevelAfter(level.id);
          feedback.innerHTML = `<div class="feedback ok">
            <strong>Level complete &mdash; +${level.xp} XP</strong>
            Output ${escapeHtml(state.output)} matches. Execution order was correct with ${state.mistakes} wrong step(s).
            ${next ? `<div class="button-row"><button class="stitch-btn" data-action="play-level" data-level="${escapeHtml(next)}">Next level</button></div>` : ''}
          </div>`;
        } else {
          feedback.innerHTML = `<div class="feedback bad"><strong>Run finished with the wrong output</strong>Expected "${escapeHtml(state.expectedOutput)}" but got "${escapeHtml(state.output)}". Reset and try again.</div>`;
        }
        document.querySelectorAll('[data-exec-action]').forEach((b) => { b.disabled = true; });
      }
    });
  });

  document.getElementById('exec-reset').addEventListener('click', () => {
    startLogicQuestLevel(level.id);
  });

  paint();
}

function completeQuestLevel(level) {
  if (!logicQuestProgress.completedLevels.includes(level.id)) {
    logicQuestProgress.completedLevels.push(level.id);
    logicQuestProgress.totalXP += level.xp;
    addXP(level.xp);
  }
  saveLogicQuestProgress();
}

// Kept for backwards compatibility with older callers/tests.
function checkLogicQuestAnswer(selectedIndex) {
  const level = window.currentQuestLevel;
  if (!level) return;
  const correct = selectedIndex === level.correct;
  const feedback = document.getElementById('quest-feedback');
  if (!feedback) return;
  if (correct) completeQuestLevel(level);
  feedback.innerHTML = `<div class="feedback ${correct ? 'ok' : 'bad'}"><strong>${correct ? 'Correct' : 'Not yet'}</strong>${escapeHtml(correct ? level.explanation : level.hint)}</div>`;
}
