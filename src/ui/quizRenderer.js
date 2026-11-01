// ============================================
// QUIZ CENTER
// ============================================

let quizSession = null;

function questionsForTopic(topicId) {
  const fromDb = typeof QUIZ_DB !== 'undefined' ? QUIZ_DB[topicId] : null;
  if (Array.isArray(fromDb) && fromDb.length) return fromDb;
  const topic = TOPICS_DB[topicId];
  if (topic && Array.isArray(topic.quiz) && topic.quiz.length) return topic.quiz;
  return [];
}

function renderQuiz(topicId) {
  const host = document.getElementById('quiz-content');
  if (!host) return;
  quizSession = null;

  const topicsWithQuizzes = Object.keys(QUIZ_DB || {}).filter((key) => questionsForTopic(key).length > 0);

  if (!topicId || !TOPICS_DB[topicId]) {
    const rows = topicsWithQuizzes.map((key) => {
      const topic = TOPICS_DB[key];
      const score = AppState.quizScores[key];
      return `
        <button class="quiz-option" data-action="start-quiz" data-topic="${escapeHtml(key)}">
          <span>
            <strong>${escapeHtml(topic ? topic.title : key)}</strong>
            <span class="muted" style="display:block;font-size:12px">${questionsForTopic(key).length} questions &middot; ${escapeHtml(subjectLabel(topic ? topic.subject : 'c'))}</span>
          </span>
          <span class="badge ${score ? 'success' : 'muted-badge'}">${score ? score.percentage + '%' : 'New'}</span>
        </button>`;
    }).join('');

    host.innerHTML = `
      <div class="screen-heading">
        <h2 class="screen-title">Quiz center</h2>
        <p class="screen-subtitle">Pick a topic. Every question includes an explanation.</p>
      </div>
      ${topicsWithQuizzes.length
        ? `<div class="quiz-options">${rows}</div>`
        : emptyState('No quizzes loaded', 'The quiz database did not load.', 'Back to dashboard', 'dashboard')}
    `;
    return;
  }

  const questions = questionsForTopic(topicId);
  if (!questions.length) {
    host.innerHTML = emptyState('No quiz for this topic yet', 'This topic has a lesson but no questions yet. Try output prediction instead.', 'Output prediction', 'predict');
    return;
  }

  quizSession = { topicId, questions, index: 0, score: 0, selected: -1, answered: false, answers: [] };
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const host = document.getElementById('quiz-content');
  const session = quizSession;
  if (!host || !session) return;

  const question = session.questions[session.index];
  const topic = TOPICS_DB[session.topicId];
  const total = session.questions.length;
  const progress = Math.round((session.index / total) * 100);

  host.innerHTML = `
    <div class="stack-head">
      <button class="stitch-btn secondary" data-nav="quiz">
        <span class="material-symbols-outlined" style="font-size:16px">arrow_back</span> Quiz center
      </button>
      <h2 class="screen-title" style="margin-top:16px">${escapeHtml(topic ? topic.title : session.topicId)}</h2>
      <p class="screen-subtitle">Question ${session.index + 1} of ${total} &middot; Score ${session.score}</p>
    </div>
    <div class="progress-bar" style="margin-bottom:16px"><div class="progress-fill" style="width:${progress}%"></div></div>
    <div class="stitch-card quiz-card">
      <div class="quiz-meta">
        <span>${escapeHtml(subjectLabel(topic ? topic.subject : 'c'))}</span>
        <span>${session.answered ? 'Answer locked' : 'Select one answer'}</span>
      </div>
      <h3 class="quiz-question">${escapeHtml(question.question)}</h3>
      <div class="quiz-options" id="quiz-options">
        ${question.options.map((option, index) => `
          <button class="quiz-option" data-option="${index}" ${session.answered ? 'disabled' : ''}>
            <span class="key">${String.fromCharCode(65 + index)}</span>
            <span class="label">${escapeHtml(option)}</span>
            <span class="material-symbols-outlined" style="font-size:18px"></span>
          </button>`).join('')}
      </div>
      <div id="quiz-feedback"></div>
      <div class="button-row">
        <button class="stitch-btn" id="quiz-check" ${session.answered ? 'disabled' : ''}>Check answer</button>
        <button class="stitch-btn secondary" id="quiz-next" style="display:none">
          ${session.index < total - 1 ? 'Next question' : 'See results'}
        </button>
      </div>
    </div>
  `;

  const optionButtons = Array.from(host.querySelectorAll('.quiz-option'));

  optionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (session.answered) return;
      session.selected = Number(button.getAttribute('data-option'));
      optionButtons.forEach((b) => b.classList.remove('selected'));
      button.classList.add('selected');
    });
  });

  document.getElementById('quiz-check').addEventListener('click', () => {
    if (session.selected < 0) {
      document.getElementById('quiz-feedback').innerHTML =
        '<div class="feedback bad"><strong>Pick an answer first</strong>Choose one of the options above.</div>';
      return;
    }

    session.answered = true;
    const isCorrect = session.selected === question.correct;
    if (isCorrect) session.score += 1;
    session.answers.push({ question: question.question, selected: session.selected, correct: question.correct, isCorrect });

    if (typeof AdaptiveEngine !== 'undefined' && AdaptiveEngine.recordAnswer) {
      AdaptiveEngine.recordAnswer(session.topicId, isCorrect);
    }

    optionButtons.forEach((button, index) => {
      button.disabled = true;
      button.classList.remove('selected');
      const icon = button.querySelector('.material-symbols-outlined');
      if (index === question.correct) {
        button.classList.add('correct');
        if (icon) icon.textContent = 'check_circle';
      } else if (index === session.selected) {
        button.classList.add('wrong');
        if (icon) icon.textContent = 'cancel';
      }
    });

    document.getElementById('quiz-feedback').innerHTML = `
      <div class="feedback ${isCorrect ? 'ok' : 'bad'}">
        <strong>${isCorrect ? 'Correct' : 'Not quite'}</strong>
        ${escapeHtml(question.explanation || '')}
      </div>`;

    document.getElementById('quiz-check').disabled = true;
    document.getElementById('quiz-next').style.display = 'inline-flex';
  });

  document.getElementById('quiz-next').addEventListener('click', () => {
    if (session.index < session.questions.length - 1) {
      session.index += 1;
      session.selected = -1;
      session.answered = false;
      renderQuizQuestion();
    } else {
      renderQuizResult();
    }
  });
}

function renderQuizResult() {
  const host = document.getElementById('quiz-content');
  const session = quizSession;
  if (!host || !session) return;

  const total = session.questions.length;
  const percentage = Math.round((session.score / total) * 100);
  const passed = percentage >= 70;

  AppState.quizScores[session.topicId] = { score: session.score, total, percentage };
  if (passed) markTopicComplete(session.topicId);
  else saveState();

  addXP(passed ? 20 : 5);
  syncChrome();

  const wrong = session.answers.filter((answer) => !answer.isCorrect);

  host.innerHTML = `
    <div class="stitch-card result-card">
      <span class="material-symbols-outlined" style="font-size:44px;color:${passed ? '#67df70' : '#ff6b6b'}">
        ${passed ? 'emoji_events' : 'school'}
      </span>
      <h2 class="screen-title" style="margin-top:8px">${passed ? 'Passed' : 'Keep practising'}</h2>
      <div class="result-score">${session.score}/${total}</div>
      <p class="muted">${percentage}% &middot; ${passed ? '+20 XP' : '+5 XP'}</p>
      <div class="button-row" style="justify-content:center">
        <button class="stitch-btn" data-action="start-quiz" data-topic="${escapeHtml(session.topicId)}">
          <span class="material-symbols-outlined" style="font-size:16px">refresh</span> Retry quiz
        </button>
        <button class="stitch-btn secondary" data-nav="lesson/${escapeHtml(session.topicId)}">Review lesson</button>
        <button class="stitch-btn secondary" data-nav="progress">View progress</button>
      </div>
    </div>
    ${wrong.length ? `
      <h3 class="card-title" style="margin-top:32px">Review these</h3>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${wrong.map((answer) => {
          const question = session.questions.find((q) => q.question === answer.question);
          return `<div class="stitch-card pad-lg">
            <p style="font-weight:600;margin:0 0 8px">${escapeHtml(answer.question)}</p>
            <p class="muted" style="margin:0">Correct answer: <strong>${escapeHtml(question ? question.options[answer.correct] : '')}</strong></p>
            <p class="muted" style="margin:6px 0 0">${escapeHtml(question && question.explanation ? question.explanation : '')}</p>
          </div>`;
        }).join('')}
      </div>` : ''}
  `;
}
