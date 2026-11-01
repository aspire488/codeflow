// ============================================
// QUIZ CENTER
// ============================================

let quizSession = null;

function questionsForTopic(topicId) {
  const fromDb = typeof QUIZ_DB !== 'undefined' && Object.prototype.hasOwnProperty.call(QUIZ_DB, topicId) ? QUIZ_DB[topicId] : null;
  if (Array.isArray(fromDb) && fromDb.length) return fromDb;
  const topic = hasTopic(topicId) ? TOPICS_DB[topicId] : null;
  if (topic && Array.isArray(topic.quiz) && topic.quiz.length) return topic.quiz;
  return [];
}

// One quiz row: same rail row as Topics, with the best score instead of a description pair.
function quizRowMarkup(topic, nextId) {
  const id = escapeHtml(topic.id);
  const score = AppState.quizScores[topic.id];
  const count = questionsForTopic(topic.id).length;
  const meta = `<div class="topic-meta">
      ${score ? `<span class="topic-score"><span class="sr-only">Best score </span>${escapeHtml(score.percentage)}%</span>` : ''}
      <button class="text-btn" data-action="start-quiz" data-topic="${id}">${score ? 'Retake' : 'Start'}<span class="sr-only"> quiz: ${escapeHtml(topic.title)}</span></button>
    </div>`;
  return railRowMarkup(topic, nextId, 'topic-row', `${pluralize(count, 'question')}${score ? `, best ${score.score} of ${score.total}` : ''}`, meta, 'quiz');
}

function renderQuiz(topicId) {
  const host = document.getElementById('quiz-content');
  if (!host) return;
  quizSession = null;

  const quizTopics = Object.keys(QUIZ_DB || {}).filter((key) => hasTopic(key) && questionsForTopic(key).length > 0);

  if (!topicId || !hasTopic(topicId)) {
    const next = nextUpTopic();
    const groups = SUBJECTS.slice(1)
      .map((s) => ({ subject: s, list: quizTopics.filter((key) => TOPICS_DB[key].subject === s.id).map((key) => ({ id: key, ...TOPICS_DB[key] })) }))
      .filter((g) => g.list.length);
    const taken = Object.keys(AppState.quizScores).length;

    host.innerHTML = `
      <div class="screen-heading">
        <div>
          <h2 class="screen-title">Quiz center</h2>
          <p class="screen-subtitle">${quizTopics.length ? `${quizTopics.length} quizzes. ${taken > 0 ? `${taken} taken.` : 'Every question includes an explanation.'} Score 70% or more to pass.` : 'Pick a topic.'}</p>
        </div>
      </div>
      ${quizTopics.length ? groups.map((g) => `
        <section class="topic-group">
          <div class="topic-group-head"><h3>${escapeHtml(g.subject.label)}</h3></div>
          <ol class="rail">${g.list.map((t) => quizRowMarkup(t, next ? next.id : null)).join('')}</ol>
        </section>`).join('')
        : emptyState('No quizzes loaded', 'The quiz database did not load.', 'Back to dashboard', 'dashboard')}
    `;
    host.querySelectorAll('.rail').forEach(markRailEnds);
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

// Per-question segments coloured by real results. State is also in text for screen readers.
function quizSegmentsMarkup(session, currentIndex) {
  return `<ol class="quiz-segs" aria-label="Question progress">${session.questions.map((_, index) => {
    const result = session.answers[index];
    const state = result ? (result.isCorrect ? 'correct' : 'wrong') : (index === currentIndex ? 'current' : 'todo');
    const label = { correct: 'answered correctly', wrong: 'answered incorrectly', current: 'current question', todo: 'not answered yet' }[state];
    return `<li class="seg ${state}"${state === 'current' ? ' aria-current="step"' : ''}><span class="sr-only">Question ${index + 1}: ${label}</span></li>`;
  }).join('')}</ol>`;
}

function renderQuizQuestion() {
  const host = document.getElementById('quiz-content');
  const session = quizSession;
  if (!host || !session) return;

  const question = session.questions[session.index];
  const topic = TOPICS_DB[session.topicId];
  const total = session.questions.length;

  host.innerHTML = `
    <div class="quiz-head">
      <button class="text-btn quiz-back" data-nav="quiz"><span aria-hidden="true" class="material-symbols-outlined">arrow_back</span>Quiz center</button>
      <h2 class="screen-title">${escapeHtml(topic ? topic.title : session.topicId)}</h2>
      <p class="quiz-count">Question ${session.index + 1} of ${total}<span class="quiz-score"> &middot; ${session.score} correct so far</span></p>
      ${quizSegmentsMarkup(session, session.index)}
    </div>
    <section class="quiz-body" aria-labelledby="quiz-q">
      <h3 class="quiz-question" id="quiz-q">${escapeHtml(question.question)}</h3>
      <div class="quiz-options" id="quiz-options" role="group" aria-label="Answers">
        ${question.options.map((option, index) => `
          <button class="quiz-option" data-option="${index}" aria-pressed="false">
            <span class="key" aria-hidden="true">${String.fromCharCode(65 + index)}</span>
            <span class="label">${escapeHtml(option)}</span>
            <span class="state"><span aria-hidden="true" class="material-symbols-outlined"></span><span class="state-text"></span></span>
          </button>`).join('')}
      </div>
      <div id="quiz-feedback" role="status" aria-live="polite"></div>
      <div class="button-row quiz-actions">
        <button class="stitch-btn" id="quiz-check">Check answer</button>
        <button class="stitch-btn" id="quiz-next" hidden>${session.index < total - 1 ? 'Next question' : 'See results'}</button>
      </div>
    </section>
  `;

  const optionButtons = Array.from(host.querySelectorAll('.quiz-option'));
  const check = document.getElementById('quiz-check');

  optionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (session.answered) return;
      session.selected = Number(button.getAttribute('data-option'));
      optionButtons.forEach((b) => {
        const on = b === button;
        b.classList.toggle('selected', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.querySelector('.state-text').textContent = on ? 'Selected' : '';
      });
    });
  });

  check.addEventListener('click', () => {
    if (session.answered) return;
    if (session.selected < 0) {
      document.getElementById('quiz-feedback').innerHTML =
        '<div class="feedback bad"><strong>Pick an answer first</strong>Choose one of the options above.</div>';
      return;
    }

    session.answered = true;
    const isCorrect = session.selected === question.correct;
    if (isCorrect) session.score += 1;
    session.answers.push({ question: question.question, selected: session.selected, correct: question.correct, isCorrect, explanation: question.explanation || '', options: question.options });

    if (typeof AdaptiveEngine !== 'undefined' && AdaptiveEngine.recordAnswer) {
      AdaptiveEngine.recordAnswer(session.topicId, isCorrect);
    }

    // Icon + text + colour, so state never depends on colour alone.
    optionButtons.forEach((button, index) => {
      button.disabled = true;
      button.classList.remove('selected');
      const icon = button.querySelector('.material-symbols-outlined');
      const text = button.querySelector('.state-text');
      if (index === question.correct) {
        button.classList.add('correct');
        icon.textContent = 'check_circle';
        text.textContent = index === session.selected ? 'Your answer, correct' : 'Correct answer';
      } else if (index === session.selected) {
        button.classList.add('wrong');
        icon.textContent = 'cancel';
        text.textContent = 'Your answer, incorrect';
      } else {
        text.textContent = '';
      }
    });

    document.getElementById('quiz-feedback').innerHTML = `
      <div class="feedback ${isCorrect ? 'ok' : 'bad'}">
        <strong><span aria-hidden="true" class="material-symbols-outlined">${isCorrect ? 'check_circle' : 'info'}</span>${isCorrect ? 'Correct' : 'Not quite'}</strong>
        ${escapeHtml(question.explanation || '')}
      </div>`;

    const segment = host.querySelector('.quiz-segs .seg.current');
    if (segment) {
      segment.className = `seg ${isCorrect ? 'correct' : 'wrong'}`;
      segment.querySelector('.sr-only').textContent = `Question ${session.index + 1}: ${isCorrect ? 'answered correctly' : 'answered incorrectly'}`;
    }

    check.disabled = true;
    check.classList.add('secondary');
    const nextButton = document.getElementById('quiz-next');
    nextButton.hidden = false;
    nextButton.focus(); // the options just became disabled; keep keyboard focus somewhere useful
  });

  document.getElementById('quiz-next').addEventListener('click', () => {
    if (session.index < session.questions.length - 1) {
      session.index += 1;
      session.selected = -1;
      session.answered = false;
      renderQuizQuestion();
      const heading = document.getElementById('quiz-q');
      if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
    } else {
      renderQuizResult();
    }
  });
}

function nextTopicKey(topicId) {
  const keys = Object.keys(TOPICS_DB || {});
  const index = keys.indexOf(topicId);
  return index >= 0 && index < keys.length - 1 ? keys[index + 1] : null;
}

function renderQuizResult() {
  const host = document.getElementById('quiz-content');
  const session = quizSession;
  if (!host || !session) return;

  const total = session.questions.length;
  const percentage = Math.round((session.score / total) * 100);
  const passed = percentage >= 70;

  // XP only on the first pass of a topic; a worse retake never overwrites the best score.
  const prior = AppState.quizScores[session.topicId];
  const alreadyPassed = !!prior && prior.percentage >= 70;
  if (!prior || percentage >= prior.percentage) AppState.quizScores[session.topicId] = { score: session.score, total, percentage };
  if (passed) markTopicComplete(session.topicId);
  else saveState();

  const firstPass = passed && !alreadyPassed;
  if (firstPass) addXP(20);
  syncChrome();
  const xpNote = firstPass ? '+20 XP for passing for the first time'
    : passed ? 'Already passed: no extra XP'
    : alreadyPassed ? 'No XP: you already passed this quiz'
    : 'No XP yet: score 70% or more to earn it';
  const bestNote = prior && prior.percentage > percentage ? `Best score kept: ${prior.percentage}%` : '';

  const missed = session.answers.filter((answer) => !answer.isCorrect);
  const topic = TOPICS_DB[session.topicId];
  const upcoming = nextTopicKey(session.topicId);
  const id = escapeHtml(session.topicId);

  const retake = `data-action="start-quiz" data-topic="${id}"`;
  const primary = passed && upcoming
    ? `<a class="stitch-btn" href="#lesson/${escapeHtml(upcoming)}">Next lesson: ${escapeHtml(TOPICS_DB[upcoming].title)}</a>`
    : passed
      ? '<a class="stitch-btn" href="#topics">Back to topics</a>'
      : `<button class="stitch-btn" ${retake}><span aria-hidden="true" class="material-symbols-outlined">refresh</span>Retake quiz</button>`;

  host.innerHTML = `
    <section class="result-card">
      <button class="text-btn quiz-back" data-nav="quiz"><span aria-hidden="true" class="material-symbols-outlined">arrow_back</span>Quiz center</button>
      <p class="result-topic">${escapeHtml(topic ? topic.title : session.topicId)}</p>
      <h2 class="screen-title" id="quiz-result-title" tabindex="-1">${passed ? 'Passed' : 'Not passed yet'}</h2>
      <div class="result-score" aria-label="${session.score} of ${total} correct">${session.score}/${total}</div>
      ${quizSegmentsMarkup(session, -1)}
      <p class="result-line">${percentage}% correct. Pass mark is 70%.</p>
      <p class="result-xp"><span aria-hidden="true" class="material-symbols-outlined">${firstPass ? 'bolt' : 'info'}</span>${escapeHtml(xpNote)}${bestNote ? `. ${escapeHtml(bestNote)}` : ''}</p>
      <div class="button-row result-actions">
        ${primary}
        ${passed ? `<button class="text-btn" ${retake}>Retake quiz</button>` : `<button class="text-btn" data-nav="lesson/${id}">Review the lesson</button>`}
        <button class="text-btn" data-nav="progress">View progress</button>
      </div>
    </section>
    ${missed.length ? `
      <section class="quiz-review">
        <h3 class="section-title">${missed.length === 1 ? '1 question to review' : `${missed.length} questions to review`}</h3>
        <ol class="review-list">
          ${missed.map((answer) => `
            <li class="review-item">
              <p class="review-q">${escapeHtml(answer.question)}</p>
              <p class="review-line wrong"><span aria-hidden="true" class="material-symbols-outlined">cancel</span><span><span class="review-tag">Your answer:</span> ${escapeHtml(answer.options[answer.selected])}</span></p>
              <p class="review-line correct"><span aria-hidden="true" class="material-symbols-outlined">check_circle</span><span><span class="review-tag">Correct answer:</span> ${escapeHtml(answer.options[answer.correct])}</span></p>
              ${answer.explanation ? `<p class="review-why">${escapeHtml(answer.explanation)}</p>` : ''}
            </li>`).join('')}
        </ol>
      </section>` : ''}
  `;
  const heading = document.getElementById('quiz-result-title');
  if (heading) heading.focus({ preventScroll: true });
}
