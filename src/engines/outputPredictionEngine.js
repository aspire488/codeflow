// ============================================
// OUTPUT PREDICTION ENGINE
// ============================================

let predictionState = { question: null, answered: false, revealed: false, topicFilter: null, index: 0 };

// Questions that already paid XP. Kept under its own storage key so it does not
// depend on AppState's sanitiser, which only keeps known fields.
const PREDICTION_XP_KEY = 'codeflow_prediction_xp_awarded';

function predictionXpAwardedIds() {
  try {
    const ids = JSON.parse(localStorage.getItem(PREDICTION_XP_KEY) || '[]');
    return Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : [];
  } catch (_) { return []; }
}

// Decides whether a check earns XP: only a correct, unrevealed first answer per question id.
function predictionXpDecision(questionId, correct, revealed, awardedIds) {
  if (!correct) return { award: false, reason: '' };
  if (revealed) return { award: false, reason: 'No XP: you revealed the answer first.' };
  if (awardedIds.includes(questionId)) return { award: false, reason: 'No XP: this question already earned XP.' };
  return { award: true, reason: '+5 XP' };
}

function normalizeOutput(str) {
  if (!str) return '';
  return String(str).replace(/\s+/g, '').trim().toLowerCase();
}

function checkOutputAnswer(userAnswer, correctAnswer) {
  if (!userAnswer || !String(userAnswer).trim()) {
    return { correct: false, message: 'Type the output you expect first.' };
  }
  const user = normalizeOutput(userAnswer);
  const correct = normalizeOutput(correctAnswer);

  if (user === correct) return { correct: true, message: 'Correct - exact match.' };

  const userLoose = String(userAnswer).trim().replace(/\s+/g, ' ');
  const correctLoose = String(correctAnswer).trim().replace(/\s+/g, ' ');
  if (userLoose === correctLoose) return { correct: true, message: 'Correct - only whitespace differed.' };

  return { correct: false, message: 'Not correct yet. Reveal the answer to compare, then try another.' };
}

function predictionPool(topicFilter) {
  const all = typeof outputPredictionDB !== 'undefined' ? outputPredictionDB : [];
  if (!topicFilter || topicFilter === 'all') return all;
  const filtered = all.filter((question) => question.topic === topicFilter);
  return filtered.length ? filtered : all;
}

function predictionTopics() {
  const all = typeof outputPredictionDB !== 'undefined' ? outputPredictionDB : [];
  return Array.from(new Set(all.map((question) => question.topic))).sort();
}

function renderOutputPrediction(param) {
  const host = document.getElementById('predict-content');
  if (!host) return;

  const filter = param && param !== 'all' ? param : 'all';
  const pool = predictionPool(filter);
  if (!pool.length) {
    host.innerHTML = emptyState('No prediction questions', 'The output prediction database did not load.', 'Back to dashboard', 'dashboard');
    return;
  }

  const question = pool[Math.floor(Math.random() * pool.length)];
  predictionState = { question, answered: false, revealed: false, topicFilter: filter, index: 0 };

  host.innerHTML = `
    <div class="screen-heading">
      <h2 class="screen-title">Output prediction</h2>
      <p class="screen-subtitle">Read the snippet, type exactly what it prints, then check. Whitespace differences are tolerated.</p>
    </div>

    <div class="filter-row">
      <button class="filter-chip ${filter === 'all' ? 'active' : ''}" data-nav="predict">All topics</button>
      ${predictionTopics().map((topic) => `
        <button class="filter-chip ${filter === topic ? 'active' : ''}" data-nav="predict/${escapeHtml(topic)}">${escapeHtml(topic)}</button>
      `).join('')}
    </div>

    <div class="stitch-card pad-lg">
      <div class="quiz-meta">
        <span class="badge">${escapeHtml(question.difficulty || 'practice')}</span>
        <span>${escapeHtml(question.topic)}</span>
      </div>
      <div class="code-panel">
        <div class="code-panel-bar"><span>predict.c</span><span>${escapeHtml(question.id)}</span></div>
        <pre><code>${highlightCode(question.code, 'c')}</code></pre>
      </div>

      <label class="field-label" for="prediction-input">Your predicted output</label>
      <input type="text" id="prediction-input" class="text-input" autocomplete="off" placeholder="e.g. 123" />

      <div class="button-row">
        <button class="stitch-btn" id="prediction-check">Check answer</button>
        <button class="stitch-btn secondary" id="prediction-reveal">Reveal answer</button>
        <button class="stitch-btn secondary" data-nav="predict${filter === 'all' ? '' : '/' + filter}">Next question</button>
        <button class="stitch-btn secondary" data-nav="lesson/${escapeHtml(question.topic)}">Open the lesson</button>
      </div>

      <div id="prediction-feedback"></div>
    </div>
  `;

  const input = document.getElementById('prediction-input');
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      checkPredictionAnswer();
    }
  });
  document.getElementById('prediction-check').addEventListener('click', checkPredictionAnswer);
  document.getElementById('prediction-reveal').addEventListener('click', revealPredictionAnswer);
  input.focus();
}

function checkPredictionAnswer() {
  const input = document.getElementById('prediction-input');
  const feedback = document.getElementById('prediction-feedback');
  const question = predictionState.question;
  if (!input || !feedback || !question || predictionState.answered) return;

  const result = checkOutputAnswer(input.value, question.answer);
  predictionState.answered = true;

  if (typeof AdaptiveEngine !== 'undefined' && AdaptiveEngine.recordAnswer) {
    AdaptiveEngine.recordAnswer(question.topic, result.correct);
  }
  const xp = predictionXpDecision(question.id, result.correct, predictionState.revealed, predictionXpAwardedIds());
  if (xp.award) {
    addXP(5);
    try {
      localStorage.setItem(PREDICTION_XP_KEY, JSON.stringify(predictionXpAwardedIds().concat(question.id)));
    } catch (_) { /* storage unavailable: XP still granted once this session */ }
  }

  feedback.innerHTML = `
    <div class="feedback ${result.correct ? 'ok' : 'bad'}">
      <strong>${escapeHtml(result.message)}</strong>
      ${result.correct
        ? escapeHtml(question.explanation || '')
        : 'Expected output is hidden - use Reveal answer to check the explanation.'}
      ${xp.reason ? `<div class="muted" style="margin-top:6px">${escapeHtml(xp.reason)}</div>` : ''}
    </div>`;
}

function revealPredictionAnswer() {
  const feedback = document.getElementById('prediction-feedback');
  const question = predictionState.question;
  if (!feedback || !question) return;
  predictionState.revealed = true;

  feedback.innerHTML = `
    <div class="feedback ok">
      <strong>Expected output</strong>
      <pre style="margin:8px 0;font-family:ui-monospace,monospace;white-space:pre-wrap">${escapeHtml(question.answer)}</pre>
      <p style="margin:0">${escapeHtml(question.explanation || '')}</p>
      <p class="muted" style="margin:8px 0 0">No XP is awarded for this question after revealing the answer.</p>
      ${question.hint ? `<p class="muted" style="margin:8px 0 0"><strong>Hint:</strong> ${escapeHtml(question.hint)}</p>` : ''}
    </div>`;
}
