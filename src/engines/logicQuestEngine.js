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

// Chapters in path order. `start` holds only the execution challenge (loops-1); every other
// level joins the chapter that lists its topic, so loops-2 and nested-loops-1 land in `loops`.
const QUEST_CHAPTERS = [
  { id: 'start', title: 'Start', blurb: 'Run a loop one action at a time.', topics: [] },
  { id: 'loops', title: 'Loops', blurb: 'Repeat, count and exit correctly.', topics: ['loops'] },
  { id: 'conditions', title: 'Conditions', blurb: 'Decide which branch runs.', topics: ['conditionals'] },
  { id: 'arrays', title: 'Arrays and strings', blurb: 'Walk indexed data without going out of bounds.', topics: ['arrays', 'strings'] },
  { id: 'pointers', title: 'Pointers', blurb: 'Follow addresses, not values.', topics: ['pointers'] },
  { id: 'recursion', title: 'Recursion', blurb: 'Unwind the call stack in the right order.', topics: ['recursion'] },
  { id: 'boss', title: 'Final boss', blurb: 'Combine everything.', topics: [] }
];

const QUEST_EXECUTION_LEVEL = 'loops-1';

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
  if (level.id === QUEST_EXECUTION_LEVEL) return 'start';
  if (level.difficulty === 'boss') return 'boss';
  const chapter = QUEST_CHAPTERS.find((c) => c.topics.includes(level.topic));
  return chapter ? chapter.id : 'start';
}

// Levels in unlock order, following the `requires` chain from the root.
function questPath() {
  const map = questMap();
  const ordered = [];
  const seen = new Set();
  let node = map.find((entry) => !entry.requires);
  while (node && !seen.has(node.id)) {
    seen.add(node.id);
    const level = questLevelById(node.id);
    if (level) ordered.push(level);
    node = map.find((entry) => entry.requires === ordered[ordered.length - 1]?.id);
  }
  return ordered;
}

// The first level that is unlocked and not yet cleared; null when the quest is finished.
function currentQuestLevel() {
  return questPath().find((level) => !logicQuestProgress.completedLevels.includes(level.id) && isLevelUnlocked(level.id)) || null;
}

function questChallengeType(level) {
  return level.id === QUEST_EXECUTION_LEVEL ? 'Execution challenge' : 'Prediction challenge';
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

function beginExecution(levelId) {
  if (levelId !== 'loops-1') return null;
  const state = createLoopExecution();
  executionChallenges[levelId] = state;
  return state;
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

function questStepMarkup(level, index, path) {
  const done = logicQuestProgress.completedLevels.includes(level.id);
  const unlocked = isLevelUnlocked(level.id);
  const current = currentQuestLevel();
  const isCurrent = Boolean(current) && current.id === level.id;
  const state = done ? 'done' : (isCurrent ? 'current' : 'locked');
  const previous = index > 0 ? path[index - 1] : null;
  const id = escapeHtml(level.id);

  const nodeIcon = done ? '<span aria-hidden="true" class="material-symbols-outlined">check</span>'
    : (isCurrent ? '' : '<span aria-hidden="true" class="material-symbols-outlined">lock</span>');
  const status = done
    ? '<span class="quest-status"><span aria-hidden="true" class="material-symbols-outlined">check_circle</span>Cleared<span class="sr-only">. Select to play again.</span></span>'
    : isCurrent
      ? '<span class="quest-status quest-start-cta">Play</span>'
      : `<span class="quest-status"><span aria-hidden="true" class="material-symbols-outlined">lock</span>Finish ${escapeHtml(previous ? previous.name : 'the previous level')} to unlock</span>`;

  return `
    <li class="quest-step ${state}">
      <span class="quest-node-mark ${state}" aria-hidden="true">${nodeIcon}</span>
      <button class="quest-node ${state}" data-action="play-level" data-level="${id}" ${unlocked ? '' : 'disabled'}${isCurrent ? ' aria-current="step"' : ''}>
        <span class="quest-name">${escapeHtml(level.name)}</span>
        <span class="quest-meta">${questChallengeType(level)} &middot; +${level.xp} XP</span>
        ${status}
      </button>
    </li>`;
}

function renderLogicQuestMap() {
  const host = document.getElementById('game-content');
  if (!host) return;
  loadLogicQuestProgress();

  const path = questPath();
  if (!path.length) {
    host.innerHTML = emptyState('Quest data missing', 'The Logic Quest level data did not load.', 'Back to dashboard', 'dashboard');
    return;
  }

  const current = currentQuestLevel();
  const position = current ? path.findIndex((level) => level.id === current.id) + 1 : path.length;
  const standing = current ? `Level ${position} of ${path.length}` : `All ${path.length} levels cleared`;

  host.innerHTML = `
    <div class="screen-heading quest-head">
      <div>
        <h2 class="screen-title">Logic Quest</h2>
        <p class="screen-subtitle"><strong class="quest-standing">${standing}</strong> &middot; ${logicQuestProgress.totalXP} XP earned from the quest</p>
      </div>
    </div>

    <div class="quest-layout">
      <div class="quest-map">
        ${QUEST_CHAPTERS.map((chapter) => {
          const levels = path.filter((level) => chapterForLevel(level) === chapter.id);
          if (!levels.length) return '';
          const done = levels.filter((level) => logicQuestProgress.completedLevels.includes(level.id)).length;
          return `
            <section class="quest-chapter" aria-labelledby="quest-ch-${chapter.id}">
              <div class="quest-chapter-head">
                <h3 id="quest-ch-${chapter.id}">${escapeHtml(chapter.title)}</h3>
                <span class="quest-chapter-count">${done} of ${levels.length} cleared</span>
              </div>
              <p class="quest-blurb">${escapeHtml(chapter.blurb)}</p>
              <ol class="quest-levels">
                ${levels.map((level) => questStepMarkup(level, path.indexOf(level), path)).join('')}
              </ol>
            </section>`;
        }).join('')}
      </div>

      <aside class="quest-aside" aria-label="About the quest">
        <h3 class="section-title">How the quest works</h3>
        <p>Levels unlock in order, one after another. Progress is saved in this browser.</p>
        <p><strong>Execution challenge.</strong> Only the first level. You choose each action the program takes, and the stepper tracks the real variable and output.</p>
        <p><strong>Prediction challenge.</strong> The other ${path.length - 1} levels. You read the code and pick its output. They check your answer; they do not run an interactive stepper.</p>
      </aside>
    </div>
  `;
  // On a phone the current level can start below the fold; bring it into view.
  host.querySelector('.quest-step.current')?.scrollIntoView({ block: 'nearest' });
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
      actions: '<button class="stitch-btn" id="modal-back">Back to quest map</button>'
    });
    document.getElementById('modal-back')?.addEventListener('click', () => { closeModal(); navigateTo('game'); });
    return;
  }

  if (levelId === QUEST_EXECUTION_LEVEL) {
    renderExecutionChallenge(beginExecution(levelId), level);
  } else {
    renderPredictionChallenge(level);
  }
  const heading = document.querySelector('#game-content h2');
  if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  const scroller = document.querySelector('#game-screen .screen-scroll');
  if (scroller) scroller.scrollTop = 0;
}

// Shared top of every level screen.
function questPlayHead(level, intro) {
  const path = questPath();
  const position = path.findIndex((entry) => entry.id === level.id) + 1;
  const chapter = QUEST_CHAPTERS.find((c) => c.id === chapterForLevel(level));
  return `
    <div class="quest-play-head">
      <button class="text-btn quiz-back" data-nav="game"><span aria-hidden="true" class="material-symbols-outlined">arrow_back</span>Quest map</button>
      <p class="quest-kicker">Level ${position} of ${path.length}${chapter ? ` &middot; ${escapeHtml(chapter.title)}` : ''}</p>
      <h2 class="screen-title">${escapeHtml(level.name)}</h2>
      <p class="quest-challenge"><span class="badge">${questChallengeType(level)}</span><span>${escapeHtml(intro)} +${level.xp} XP the first time.</span></p>
    </div>`;
}

function questCodeMarkup(code, name) {
  return `<div class="code-panel quest-code">
    <div class="code-panel-bar">${escapeHtml(name)}</div>
    <div class="code-scroll" tabindex="0" role="region" aria-label="Code for this level"><pre><code>${highlightCode(code, 'c')}</code></pre></div>
  </div>`;
}

function questNextMarkup(level) {
  const next = nextLevelAfter(level.id);
  return next
    ? `<div class="button-row"><button class="stitch-btn" data-action="play-level" data-level="${escapeHtml(next)}">Next level</button><button class="text-btn" data-nav="game">Quest map</button></div>`
    : '<div class="button-row"><button class="stitch-btn" data-nav="game">Back to quest map</button></div>';
}

function renderPredictionChallenge(level) {
  const host = document.getElementById('game-content');
  if (!host) return;

  host.innerHTML = `
    ${questPlayHead(level, 'Read the code and pick what it prints.')}
    <section class="quest-challenge-panel">
      ${questCodeMarkup(level.code, `${level.id}.c`)}
      <h3 class="quiz-question" id="quest-q">${escapeHtml(level.question)}</h3>
      <div class="quiz-options" id="quest-options" role="group" aria-labelledby="quest-q">
        ${level.options.map((option, index) => `
          <button class="quiz-option" data-quest-option="${index}">
            <span class="key" aria-hidden="true">${String.fromCharCode(65 + index)}</span>
            <span class="label">${escapeHtml(option)}</span>
            <span class="state"><span aria-hidden="true" class="material-symbols-outlined"></span><span class="state-text"></span></span>
          </button>`).join('')}
      </div>
      <div id="quest-feedback" role="status" aria-live="polite"></div>
      <div class="button-row quest-tools"><button class="text-btn" id="quest-hint">Show a hint</button></div>
    </section>
  `;

  const buttons = Array.from(host.querySelectorAll('[data-quest-option]'));
  const markState = (button, className, icon, text) => {
    button.classList.add(className);
    button.querySelector('.material-symbols-outlined').textContent = icon;
    button.querySelector('.state-text').textContent = text;
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.getAttribute('data-quest-option'));
      const feedback = document.getElementById('quest-feedback');

      if (index !== level.correct) {
        logicQuestProgress.attempts += 1;
        saveLogicQuestProgress();
        markState(button, 'wrong', 'cancel', 'Not this one');
        button.disabled = true;
        feedback.innerHTML = `<div class="feedback bad"><strong><span aria-hidden="true" class="material-symbols-outlined">info</span>Not yet</strong>${escapeHtml(level.hint || 'Trace the code line by line.')}</div>`;
        return;
      }

      const firstTime = !logicQuestProgress.completedLevels.includes(level.id);
      completeQuestLevel(level);
      buttons.forEach((b) => { b.disabled = true; });
      markState(button, 'correct', 'check_circle', 'Correct');
      feedback.innerHTML = `
        <div class="feedback ok">
          <strong><span aria-hidden="true" class="material-symbols-outlined">check_circle</span>Correct${firstTime ? ` &mdash; +${level.xp} XP` : ' &mdash; already cleared, no extra XP'}</strong>
          ${escapeHtml(level.explanation || '')}
        </div>${questNextMarkup(level)}`;
    });
  });

  document.getElementById('quest-hint').addEventListener('click', () => {
    document.getElementById('quest-feedback').innerHTML =
      `<div class="callout"><strong>Hint</strong>${escapeHtml(level.hint || 'Trace the variables after each iteration.')}</div>`;
  });
}

function renderExecutionChallenge(state, level) {
  const host = document.getElementById('game-content');
  if (!host) return;
  if (!state) {
    host.innerHTML = emptyState('Challenge unavailable', 'This execution challenge could not start.', 'Back to quest map', 'game');
    return;
  }

  host.innerHTML = `
    ${questPlayHead(level, 'Choose each action the program takes, in order.')}
    <section class="quest-challenge-panel">
      <p class="quest-goal">${escapeHtml(state.goal)}</p>
      ${questCodeMarkup(state.code, `${level.id}.c`)}
      <dl class="exec-state">
        <div><dt>i</dt><dd id="exec-i">${state.i}</dd></div>
        <div><dt>Output</dt><dd id="exec-output">${state.output || '-'}</dd></div>
        <div><dt>Wrong steps</dt><dd id="exec-mistakes">${state.mistakes}</dd></div>
      </dl>
      <h3 class="quiz-question" id="exec-q">What does the program do next?</h3>
      <div class="action-grid" id="exec-actions" role="group" aria-labelledby="exec-q">
        <button class="action-btn" data-exec-action="check">Evaluate i &lt; 3</button>
        <button class="action-btn" data-exec-action="body">Execute the loop body</button>
        <button class="action-btn" data-exec-action="increment">Run i++</button>
        <button class="action-btn" data-exec-action="exit">Exit the loop</button>
        <button class="action-btn" data-exec-action="finish">Finish the program</button>
      </div>
      <div id="exec-feedback" role="status" aria-live="polite"></div>
      <h3 class="section-title exec-log-title">Execution log</h3>
      <div class="terminal"><div class="terminal-bar"><span aria-hidden="true" class="material-symbols-outlined">terminal</span>Log</div><pre class="console" id="exec-log"></pre></div>
      <div class="button-row quest-tools"><button class="text-btn" id="exec-reset">Reset run</button></div>
    </section>
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

      feedback.innerHTML = `<div class="feedback ${result.ok ? 'ok' : 'bad'}"><strong><span aria-hidden="true" class="material-symbols-outlined">${result.ok ? 'check_circle' : 'cancel'}</span>${result.ok ? 'Correct step' : 'Not this one'}</strong>${escapeHtml(result.message)}</div>`;
      paint();

      if (result.finished) {
        if (result.success) {
          const firstTime = !logicQuestProgress.completedLevels.includes(level.id);
          completeQuestLevel(level);
          feedback.innerHTML = `<div class="feedback ok">
            <strong><span aria-hidden="true" class="material-symbols-outlined">check_circle</span>Level complete${firstTime ? ` &mdash; +${level.xp} XP` : ' &mdash; already cleared, no extra XP'}</strong>
            Output ${escapeHtml(state.output)} matches. Execution order was correct with ${state.mistakes} wrong step(s).
          </div>${questNextMarkup(level)}`;
        } else {
          feedback.innerHTML = `<div class="feedback bad"><strong><span aria-hidden="true" class="material-symbols-outlined">cancel</span>Run finished with the wrong output</strong>Expected "${escapeHtml(state.expectedOutput)}" but got "${escapeHtml(state.output)}". Reset and try again.</div>`;
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
