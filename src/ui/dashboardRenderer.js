// ============================================
// DASHBOARD / TOPIC EXPLORER / PRACTICE / PROGRESS
// ============================================

const SUBJECTS = [
  { id: 'all', label: 'All subjects' },
  { id: 'c', label: 'C Programming' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'js', label: 'JavaScript' }
];

let activeSubject = 'all';
let topicQuery = '';

function topicsOf(subject) {
  if (typeof TOPICS_DB === 'undefined') return [];
  return Object.entries(TOPICS_DB)
    .filter(([, topic]) => !subject || subject === 'all' || topic.subject === subject)
    .map(([id, topic]) => ({ id, ...topic }));
}

function subjectLabel(subject) {
  const found = SUBJECTS.find((s) => s.id === subject);
  return found ? found.label : 'Topic';
}

function languageForSubject(subject) {
  return subject === 'js' ? 'javascript' : (subject || 'c');
}

// Course order: the first topic not yet completed (never one just finished).
function nextUpTopic() {
  return topicsOf('all').find((t) => !AppState.completedTopics.includes(t.id)) || null;
}

// "Lesson 3 of 53" counts within the topic's own subject.
function lessonPosition(topic) {
  const list = topicsOf(topic.subject);
  return { number: list.findIndex((t) => t.id === topic.id) + 1, total: list.length };
}

function topicSummary(topic) {
  return (topic.concept && topic.concept[0]) || topic.examTip || '';
}

// One row of the program-counter rail. State comes from real progress only.
// Topic-explorer rows pass a description and actions; the link stays separate from the buttons.
function railRowMarkup(topic, nextId, extraClass, description, actions, route = 'lesson') {
  const id = escapeHtml(topic.id);
  const done = AppState.completedTopics.includes(topic.id);
  const current = topic.id === nextId;
  const state = done ? 'done' : (current ? 'current' : '');
  const cue = done ? 'Completed: ' : (current ? 'Next: ' : '');
  const link = `<a class="rail-link${description === undefined ? '' : ' topic-link'}" href="#${route}/${id}"${current ? ' aria-current="step"' : ''}>${cue ? `<span class="sr-only">${cue}</span>` : ''}${escapeHtml(topic.title)}</a>`;
  const body = description === undefined
    ? link
    : `<div class="topic-main">${link}<p class="topic-desc">${escapeHtml(description)}</p></div>${actions}`;
  return `<li class="rail-row ${done ? 'is-done' : ''} ${current ? 'is-current' : ''} ${extraClass || ''}" data-topic="${id}"><span class="rail-node ${state}" aria-hidden="true"></span>${body}</li>`;
}

// The rail line starts at the first visible node and ends at the last.
function markRailEnds(list) {
  list.querySelectorAll('.rail-row').forEach((row) => row.classList.remove('is-first', 'is-last'));
  const rows = Array.from(list.querySelectorAll('.rail-row:not([hidden])'));
  if (!rows.length) return;
  rows[0].classList.add('is-first');
  rows[rows.length - 1].classList.add('is-last');
}

function pluralize(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

function renderDashboard() {
  const host = document.getElementById('dashboard-content');
  if (!host) return;

  const all = topicsOf('all');
  const completed = AppState.completedTopics.length;
  const next = nextUpTopic();

  let nextBlock;
  let railBlock = '';
  if (next) {
    const position = lessonPosition(next);
    const id = escapeHtml(next.id);
    nextBlock = `
      <section>
        <h2 class="eyebrow">Next up</h2>
        <h3 class="next-title">${escapeHtml(next.title)}</h3>
        <p class="next-meta">${escapeHtml(subjectLabel(next.subject))}, lesson ${position.number} of ${position.total}</p>
        <div class="next-actions">
          <a class="stitch-btn" href="#lesson/${id}">${completed > 0 ? 'Continue lesson' : 'Start lesson'}</a>
          <a class="text-btn" href="#quiz/${id}">Take the quiz</a>
          <a class="text-btn" href="#visualize/code/${id}">Visualize the code</a>
        </div>
      </section>`;

    const list = topicsOf(next.subject);
    const index = list.findIndex((t) => t.id === next.id);
    const slice = list.slice(Math.max(0, index - 1), index + 4);
    const doneInSubject = list.filter((t) => AppState.completedTopics.includes(t.id)).length;
    railBlock = `
      <section class="course-rail">
        <h2 class="section-title">${escapeHtml(subjectLabel(next.subject))}</h2>
        <p class="section-note">${doneInSubject} of ${list.length} completed</p>
        <ol class="rail">${slice.map((t) => railRowMarkup(t, next.id)).join('')}</ol>
        <a class="text-btn rail-more" href="#topics">See all ${all.length} topics</a>
      </section>`;
  } else {
    nextBlock = `
      <section>
        <h2 class="eyebrow">Course</h2>
        <h3 class="next-title">All topics completed</h3>
        <p class="next-meta">You finished all ${all.length} topics. Retake a quiz to improve a score, or review any lesson.</p>
        <div class="next-actions">
          <a class="stitch-btn" href="#topics">Review topics</a>
          <a class="text-btn" href="#practice">Adaptive practice</a>
          <a class="text-btn" href="#quiz">Quiz center</a>
        </div>
      </section>`;
  }

  const bySubject = SUBJECTS.slice(1).map((s) => {
    const list = topicsOf(s.id);
    const done = list.filter((t) => AppState.completedTopics.includes(t.id)).length;
    return { id: s.id, label: s.label, done, total: list.length, percentage: list.length ? Math.round((done / list.length) * 100) : 0 };
  }).filter((s) => s.total > 0);

  const quizCount = Object.keys(AppState.quizScores).length;
  const summary = [
    completed > 0 ? `${completed} of ${all.length} topics completed.` : 'No topics completed yet.',
    AppState.xp > 0 ? `${AppState.xp} XP earned.` : '',
    quizCount > 0 ? `${pluralize(quizCount, 'quiz')} taken.` : ''
  ].filter(Boolean).join(' ');

  const outputQuestions = typeof outputPredictionDB !== 'undefined' ? outputPredictionDB.length : 0;

  host.innerHTML = `
    <div class="dash-top ${railBlock ? '' : 'is-single'}">
      ${nextBlock}
      ${railBlock}
    </div>
    <div class="dash-bottom">
      <section>
        <h2 class="section-title">Your progress</h2>
        <p class="progress-summary">${escapeHtml(summary)}</p>
        <ul class="subject-list">
          ${bySubject.map((s) => `
            <li class="subject-row">
              <a class="subject-name" href="#topics/${escapeHtml(s.id)}">${escapeHtml(s.label)}</a>
              <span class="subject-count">${s.done}/${s.total}</span>
              <div class="progress-bar" aria-hidden="true"><div class="progress-fill" style="width:${s.percentage}%"></div></div>
            </li>`).join('')}
        </ul>
      </section>
      <section>
        <h2 class="section-title">Practice tools</h2>
        <ul class="tool-list">
          <li><a class="tool-link" href="#predict"><span class="tool-name">Output prediction</span><span class="tool-desc">${outputQuestions ? `${outputQuestions} questions: ` : ''}predict what the program prints.</span></a></li>
          <li><a class="tool-link" href="#game"><span class="tool-name">Logic Quest</span><span class="tool-desc">Run code one action at a time, from start to the final boss.</span></a></li>
          <li><a class="tool-link" href="#practice"><span class="tool-name">Adaptive practice</span><span class="tool-desc">Questions drawn from the topics you get wrong.</span></a></li>
        </ul>
      </section>
    </div>
  `;
  host.querySelectorAll('.rail').forEach(markRailEnds);
}

function topicRowMarkup(topic, nextId) {
  const id = escapeHtml(topic.id);
  const score = AppState.quizScores[topic.id];
  const meta = `<div class="topic-meta">
      ${score ? `<span class="topic-score"><span class="sr-only">Quiz score </span>${escapeHtml(score.percentage)}%</span>` : ''}
      <button class="text-btn" data-action="start-quiz" data-topic="${id}">Quiz<span class="sr-only">: ${escapeHtml(topic.title)}</span></button>
      <button class="text-btn" data-action="visualize" data-topic="${id}">Visualize<span class="sr-only">: ${escapeHtml(topic.title)}</span></button>
    </div>`;
  return railRowMarkup(topic, nextId, 'topic-row', topicSummary(topic), meta);
}

function renderTopicExplorer(routeParam) {
  const host = document.getElementById('topics-content');
  if (!host) return;
  if (routeParam && SUBJECTS.some((s) => s.id === routeParam)) activeSubject = routeParam;
  else if (!routeParam) activeSubject = 'all';

  const all = topicsOf('all');
  const next = nextUpTopic();
  const nextId = next ? next.id : null;
  const groups = SUBJECTS.slice(1)
    .filter((s) => activeSubject === 'all' || s.id === activeSubject)
    .map((s) => ({ subject: s, list: topicsOf(s.id) }))
    .filter((g) => g.list.length);
  const counts = { all: all.length };
  SUBJECTS.slice(1).forEach((s) => { counts[s.id] = topicsOf(s.id).length; });
  const completed = AppState.completedTopics.length;

  host.innerHTML = `
    <div class="screen-heading">
      <div>
        <h2 class="screen-title">Explore topics</h2>
        <p class="screen-subtitle">${all.length} topics in ${SUBJECTS.length - 1} subjects. ${completed > 0 ? `${completed} completed.` : 'Pick any lesson, or follow the marker to your next one.'}</p>
      </div>
    </div>
    <div class="topics-tools">
      <div class="topic-search">
        <span aria-hidden="true" class="material-symbols-outlined">search</span>
        <label class="sr-only" for="topic-search">Search topics</label>
        <input type="search" id="topic-search" class="input" autocomplete="off" placeholder="Search topics" value="${escapeHtml(topicQuery)}"/>
      </div>
      <div class="filter-row" role="group" aria-label="Filter by subject">
        ${SUBJECTS.map((s) => `
          <button class="filter-chip ${activeSubject === s.id ? 'active' : ''}" data-nav="${s.id === 'all' ? 'topics' : 'topics/' + s.id}"${activeSubject === s.id ? ' aria-current="true"' : ''}>${escapeHtml(s.label)}<span>${counts[s.id] || 0}</span></button>`).join('')}
      </div>
    </div>
    <p class="topic-status" id="topic-status" role="status"></p>
    ${groups.map((g) => {
      const done = g.list.filter((t) => AppState.completedTopics.includes(t.id)).length;
      return `
      <section class="topic-group" data-subject="${escapeHtml(g.subject.id)}">
        <div class="topic-group-head">
          <h3>${escapeHtml(g.subject.label)}</h3>
          <span class="topic-group-count">${done} of ${g.list.length}<span class="sr-only"> completed</span></span>
        </div>
        <ol class="rail">${g.list.map((t) => topicRowMarkup(t, nextId)).join('')}</ol>
      </section>`;
    }).join('')}
    <div class="topic-empty" id="topic-empty" hidden>
      <h3 class="card-title" id="topic-empty-title"></h3>
      <p class="muted">Try a different word, or clear the search to see every topic.</p>
      <button class="stitch-btn secondary" id="topic-clear">Clear search</button>
    </div>
  `;

  // Lowercased title + description per row, computed once per render.
  const rows = Array.from(host.querySelectorAll('.topic-row')).map((el) => {
    const topic = TOPICS_DB[el.getAttribute('data-topic')];
    return { el, hay: `${topic.title} ${topicSummary(topic)}`.toLowerCase() };
  });
  const sections = Array.from(host.querySelectorAll('.topic-group'));
  const input = document.getElementById('topic-search');
  const status = document.getElementById('topic-status');
  const empty = document.getElementById('topic-empty');
  const emptyTitle = document.getElementById('topic-empty-title');
  const visibleTotal = rows.length;

  function applyTopicFilter() {
    const query = topicQuery.trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    let shown = 0;
    rows.forEach((row) => {
      const match = terms.every((term) => row.hay.includes(term));
      if (row.el.hidden === match) row.el.hidden = !match;
      if (match) shown += 1;
    });
    sections.forEach((section) => {
      const list = section.querySelector('.rail');
      markRailEnds(list);
      section.hidden = !list.querySelector('.rail-row:not([hidden])');
    });
    empty.hidden = shown > 0;
    emptyTitle.textContent = `No topics match “${topicQuery.trim()}”`;
    status.textContent = terms.length
      ? `${shown} of ${visibleTotal} topics match`
      : `${visibleTotal} topics${activeSubject === 'all' ? '' : ` in ${subjectLabel(activeSubject)}`}`;
  }

  function setTopicQuery(value) {
    topicQuery = value;
    if (input.value !== value) input.value = value;
    applyTopicFilter();
  }

  input.addEventListener('input', () => setTopicQuery(input.value));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && input.value) {
      event.preventDefault();
      setTopicQuery('');
    }
  });
  document.getElementById('topic-clear').addEventListener('click', () => {
    setTopicQuery('');
    input.focus();
  });
  applyTopicFilter();
}

function renderAdaptivePractice() {
  const host = document.getElementById('practice-content');
  if (!host) return;
  const engine = typeof AdaptiveEngine !== 'undefined' ? AdaptiveEngine : null;
  if (!engine) {
    host.innerHTML = emptyState('Practice engine unavailable', 'The adaptive practice module did not load.', 'Back to dashboard', 'dashboard');
    return;
  }
  if (engine.init) engine.init();

  // Only topics with at least one wrong answer on record, and not yet mastered, need practice.
  const weak = engine.getWeakTopics().filter((t) => t.wrong > 0 && !t.mastered && hasTopic(t.topicKey));
  const titleOf = (key) => (TOPICS_DB[key] && TOPICS_DB[key].title) || key;
  const next = weak[0];

  const heading = `
    <div class="screen-heading">
      <div>
        <h2 class="screen-title">Adaptive practice</h2>
        <p class="screen-subtitle">Practice comes from the questions you get wrong in quizzes and output prediction, stored in this browser.</p>
      </div>
    </div>`;

  if (!next) {
    host.innerHTML = `${heading}
      <section class="quiet-empty">
        <h3 class="next-title">Nothing to practise yet</h3>
        <p class="next-meta">Take a quiz first; practice comes from questions you get wrong.</p>
        <div class="next-actions">
          <button class="stitch-btn" data-nav="quiz">Take a quiz</button>
          <a class="text-btn" href="#predict">Try output prediction</a>
        </div>
      </section>`;
    return;
  }

  host.innerHTML = `${heading}
    <section class="practice-next">
      <h3 class="eyebrow">Practice next</h3>
      <p class="next-title">${escapeHtml(titleOf(next.topicKey))}</p>
      <p class="next-meta">${pluralize(next.wrong, 'wrong answer')} and ${pluralize(next.correct, 'correct answer')} recorded.</p>
      <div class="next-actions">
        <button class="stitch-btn" data-action="start-quiz" data-topic="${escapeHtml(next.topicKey)}"><span aria-hidden="true" class="material-symbols-outlined">play_arrow</span>Start practice quiz</button>
        <a class="text-btn" href="#lesson/${escapeHtml(next.topicKey)}">Review the lesson</a>
      </div>
    </section>
    <section class="progress-sec">
      <h3 class="section-title">Topics to practise</h3>
      <p class="section-note">Most wrong answers first.</p>
      <ul class="plain-list">
        ${weak.slice(0, 10).map((t) => `
          <li class="plain-row">
            <div class="plain-main"><a class="plain-link" href="#lesson/${escapeHtml(t.topicKey)}">${escapeHtml(titleOf(t.topicKey))}</a>
              <span class="plain-meta">${t.wrong} wrong, ${t.correct} correct</span></div>
            <button class="text-btn" data-action="start-quiz" data-topic="${escapeHtml(t.topicKey)}">Practise<span class="sr-only">: ${escapeHtml(titleOf(t.topicKey))}</span></button>
          </li>`).join('')}
      </ul>
    </section>`;
}

function renderProgressDashboard() {
  const host = document.getElementById('progress-content');
  if (!host) return;

  const all = topicsOf('all');
  const completed = all.filter((t) => AppState.completedTopics.includes(t.id));
  const quizzes = Object.entries(AppState.quizScores).filter(([topic]) => hasTopic(topic));
  const average = quizzes.length
    ? Math.round(quizzes.reduce((sum, entry) => sum + (entry[1].percentage || 0), 0) / quizzes.length)
    : 0;

  const bySubject = SUBJECTS.slice(1).map((s) => {
    const list = topicsOf(s.id);
    const done = list.filter((t) => AppState.completedTopics.includes(t.id)).length;
    return { id: s.id, label: s.label, done, total: list.length, percentage: list.length ? Math.round((done / list.length) * 100) : 0 };
  }).filter((s) => s.total > 0);

  // Only real, non-zero numbers get a place in the strip.
  const stats = [
    completed.length > 0 && [completed.length, 'Topics completed'],
    quizzes.length > 0 && [`${average}%`, 'Average quiz score'],
    AppState.xp > 0 && [AppState.xp, 'XP'],
    quizzes.length > 0 && [quizzes.length, 'Quizzes taken']
  ].filter(Boolean);
  const hasProgress = completed.length > 0 || quizzes.length > 0 || AppState.xp > 0;
  const next = nextUpTopic();

  const strip = stats.length
    ? `<dl class="stat-strip">${stats.map(([value, label]) => `<div class="stat"><dt class="stat-label">${label}</dt><dd class="stat-value">${value}</dd></div>`).join('')}</dl>`
    : '';
  const empty = hasProgress ? '' : `
    <section class="quiet-empty">
      <h3 class="next-title">No progress yet</h3>
      <p class="next-meta">Finish a lesson or pass a quiz and your numbers will show up here.</p>
      <div class="next-actions">
        ${next ? `<a class="stitch-btn" href="#lesson/${escapeHtml(next.id)}">Start lesson</a>` : ''}
        <a class="text-btn" href="#quiz">Open quiz center</a>
      </div>
    </section>`;
  const scores = quizzes.length ? `
    <section class="progress-sec">
      <h3 class="section-title">Quiz scores</h3>
      <p class="section-note">Your best score for each quiz you have taken.</p>
      <div class="table-scroll">
        <table class="data-table">
          <thead><tr><th scope="col">Topic</th><th scope="col">Best score</th><th scope="col"><span class="sr-only">Action</span></th></tr></thead>
          <tbody>
            ${quizzes.slice().reverse().map(([topic, score]) => `<tr>
              <td><a href="#lesson/${escapeHtml(topic)}">${escapeHtml(TOPICS_DB[topic].title)}</a></td>
              <td class="num">${escapeHtml(score.score)}/${escapeHtml(score.total)} &middot; ${escapeHtml(score.percentage)}%</td>
              <td class="act"><button class="text-btn" data-action="start-quiz" data-topic="${escapeHtml(topic)}">Retake<span class="sr-only">: ${escapeHtml(TOPICS_DB[topic].title)}</span></button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>` : '';

  host.innerHTML = `
    <div class="screen-heading">
      <div>
        <h2 class="screen-title">Your progress</h2>
        <p class="screen-subtitle">Stored locally in this browser. Nothing is sent to a server.</p>
      </div>
    </div>
    ${strip}
    ${empty}
    <section class="progress-sec">
      <h3 class="section-title">Progress by subject</h3>
      <ul class="subject-list">
        ${bySubject.map((s) => `
          <li class="subject-row">
            <a class="subject-name" href="#topics/${escapeHtml(s.id)}">${escapeHtml(s.label)}</a>
            <span class="subject-count">${s.done}/${s.total} topics</span>
            <div class="progress-bar" aria-hidden="true"><div class="progress-fill" style="width:${s.percentage}%"></div></div>
          </li>`).join('')}
      </ul>
    </section>
    ${scores}
    <section class="danger-zone">
      <h3 class="section-title">Reset</h3>
      <p class="section-note">Clears XP, completed topics, quiz scores and practice history in this browser.</p>
      <button class="text-btn danger" data-action="reset-progress">Reset all progress</button>
    </section>
  `;
}
