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
  const nextRoute = `predict${filter === 'all' ? '' : '/' + filter}`;

  host.innerHTML = `
    <div class="screen-heading">
      <div>
        <h2 class="screen-title">Output prediction</h2>
        <p class="screen-subtitle">Read the snippet and type exactly what it prints. Whitespace differences are tolerated. You earn 5 XP for a correct first answer you did not reveal.</p>
      </div>
    </div>

    <div class="filter-row predict-filters" role="group" aria-label="Filter by topic">
      <button class="filter-chip ${filter === 'all' ? 'active' : ''}" data-nav="predict"${filter === 'all' ? ' aria-current="true"' : ''}>All topics</button>
      ${predictionTopics().map((topic) => `
        <button class="filter-chip ${filter === topic ? 'active' : ''}" data-nav="predict/${escapeHtml(topic)}"${filter === topic ? ' aria-current="true"' : ''}>${escapeHtml(topic)}</button>
      `).join('')}
    </div>

    <div class="predict-layout">
      <section class="predict-code" aria-label="Code to predict">
        <div class="code-panel">
          <div class="code-panel-bar"><span>predict.c</span><span>${escapeHtml(question.difficulty || 'practice')} &middot; ${escapeHtml(question.topic)}</span></div>
          <div class="code-scroll" tabindex="0" role="region" aria-label="Code for question ${escapeHtml(question.id)}"><pre><code>${highlightCode(question.code, 'c')}</code></pre></div>
        </div>
      </section>

      <section class="predict-answer" aria-label="Your answer">
        <label class="field-label" for="prediction-input">What does it print?</label>
        <input type="text" id="prediction-input" class="text-input mono-input" autocomplete="off" spellcheck="false" placeholder="e.g. 123" />
        <div class="button-row predict-actions">
          <button class="stitch-btn" id="prediction-check">Check answer</button>
          <button class="text-btn" id="prediction-reveal">Reveal answer</button>
        </div>
        <div id="prediction-feedback" role="status" aria-live="polite"></div>
        <div class="button-row predict-next">
          <button class="stitch-btn secondary" id="prediction-next" data-nav="${nextRoute}">Next question</button>
          <button class="text-btn" data-nav="lesson/${escapeHtml(question.topic)}">Open the lesson</button>
        </div>
      </section>
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
  input.focus({ preventScroll: true });
}

// Expected vs yours, then why. Text and icon carry the verdict, not colour alone.
function predictionFeedbackMarkup({ ok, headline, yours, question, extra }) {
  const mono = (text) => `<pre class="compare-out">${escapeHtml(text)}</pre>`;
  return `
    <div class="feedback ${ok ? 'ok' : 'bad'}">
      <strong><span aria-hidden="true" class="material-symbols-outlined">${ok ? 'check_circle' : 'cancel'}</span>${escapeHtml(headline)}</strong>
      <div class="compare">
        <div><span class="compare-label">Your output</span>${yours === null ? '<span class="compare-none">Not answered</span>' : mono(yours)}</div>
        <div><span class="compare-label">Expected output</span>${mono(question.answer)}</div>
      </div>
      <p class="compare-why">${escapeHtml(question.explanation || '')}</p>
      ${extra || ''}
    </div>`;
}

// After an answer or a reveal the question is finished: Next becomes the primary action.
function finishPredictionQuestion() {
  const check = document.getElementById('prediction-check');
  const next = document.getElementById('prediction-next');
  if (check) { check.disabled = true; check.classList.add('secondary'); }
  if (next) next.classList.remove('secondary');
}

function checkPredictionAnswer() {
  const input = document.getElementById('prediction-input');
  const feedback = document.getElementById('prediction-feedback');
  const question = predictionState.question;
  if (!input || !feedback || !question || predictionState.answered) return;

  const result = checkOutputAnswer(input.value, question.answer);
  if (!input.value.trim()) {
    feedback.innerHTML = `<div class="feedback bad"><strong>${escapeHtml(result.message)}</strong></div>`;
    return;
  }
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

  feedback.innerHTML = predictionFeedbackMarkup({
    ok: result.correct,
    headline: result.correct ? result.message : 'Not correct',
    yours: input.value,
    question,
    extra: xp.reason ? `<p class="compare-xp">${escapeHtml(xp.reason)}</p>` : (result.correct ? '' : '<p class="compare-xp">No XP for an incorrect answer.</p>')
  });
  input.disabled = true;
  finishPredictionQuestion();
}

function revealPredictionAnswer() {
  const feedback = document.getElementById('prediction-feedback');
  const question = predictionState.question;
  if (!feedback || !question || predictionState.answered) return;
  predictionState.revealed = true;
  predictionState.answered = true;

  feedback.innerHTML = predictionFeedbackMarkup({
    ok: true,
    headline: 'Answer revealed',
    yours: null,
    question,
    extra: `<p class="compare-xp">No XP is awarded for this question after revealing the answer.</p>${question.hint ? `<p class="compare-why"><strong class="inline-strong">Hint:</strong> ${escapeHtml(question.hint)}</p>` : ''}`
  });
  const input = document.getElementById('prediction-input');
  if (input) input.disabled = true;
  finishPredictionQuestion();
}
