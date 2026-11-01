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
function railRowMarkup(topic, nextId, extraClass, description, actions) {
  const id = escapeHtml(topic.id);
  const done = AppState.completedTopics.includes(topic.id);
  const current = topic.id === nextId;
  const state = done ? 'done' : (current ? 'current' : '');
  const cue = done ? 'Completed: ' : (current ? 'Next: ' : '');
  const link = `<a class="rail-link${description === undefined ? '' : ' topic-link'}" href="#lesson/${id}"${current ? ' aria-current="step"' : ''}>${cue ? `<span class="sr-only">${cue}</span>` : ''}${escapeHtml(topic.title)}</a>`;
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

  const weak = engine.getWeakTopics();
  const attempted = weak.filter((t) => t.totalAttempts > 0);
  const next = weak[0];

  host.innerHTML = `
    <div class="screen-heading">
      <h2 class="screen-title">Adaptive practice</h2>
      <p class="screen-subtitle">Recommendations come from your recorded quiz answers, not a fixed list.</p>
    </div>
    <div class="stitch-card pad-lg" style="margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div>
          <h3 class="card-title">${next ? 'Practice next' : 'Nothing to practise yet'}</h3>
          <p class="muted">${next
            ? escapeHtml((TOPICS_DB[next.topicKey] && TOPICS_DB[next.topicKey].title) || next.topicKey)
            : 'Answer some quiz questions and this screen will build a plan for you.'}</p>
        </div>
        ${next
          ? `<button class="stitch-btn" data-action="start-quiz" data-topic="${escapeHtml(next.topicKey)}"><span aria-hidden="true" class="material-symbols-outlined" style="font-size:16px">play_arrow</span> Start practice quiz</button>`
          : '<button class="stitch-btn" disabled>Start practice quiz</button>'}
      </div>
    </div>
    ${attempted.length ? `
      <h3 class="card-title">Weakest topics first</h3>
      <div class="topic-grid">
        ${attempted.slice(0, 8).map((t) => {
          const progress = engine.getMasteryProgress(t.topicKey);
          const title = (TOPICS_DB[t.topicKey] && TOPICS_DB[t.topicKey].title) || t.topicKey;
          return `
            <article class="stitch-card pad-lg">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
                <h3 style="font-size:15px;font-weight:600;margin:0">${escapeHtml(title)}</h3>
                <span class="badge ${progress.status === 'Mastered' ? 'success' : 'muted-badge'}">${escapeHtml(progress.status)}</span>
              </div>
              <div class="progress-bar" style="margin-top:12px"><div class="progress-fill" style="width:${progress.percentage}%"></div></div>
              <p class="muted" style="margin-top:8px">${progress.correct} correct &middot; ${progress.wrong} wrong &middot; ${progress.percentage}% accuracy</p>
              <div class="button-row">
                <button class="stitch-btn secondary" data-nav="lesson/${escapeHtml(t.topicKey)}">Review lesson</button>
                <button class="stitch-btn" data-action="start-quiz" data-topic="${escapeHtml(t.topicKey)}">Practise</button>
              </div>
            </article>`;
        }).join('')}
      </div>`
      : emptyState('No practice history yet', 'Complete a quiz and the weakest topics will appear here automatically.', 'Open quiz center', 'quiz')}
  `;
}

function renderProgressDashboard() {
  const host = document.getElementById('progress-content');
  if (!host) return;

  const all = topicsOf('all');
  const completed = all.filter((t) => AppState.completedTopics.includes(t.id));
  const quizzes = Object.entries(AppState.quizScores);
  const average = quizzes.length
    ? Math.round(quizzes.reduce((sum, entry) => sum + (entry[1].percentage || 0), 0) / quizzes.length)
    : 0;

  const bySubject = SUBJECTS.slice(1).map((s) => {
    const list = topicsOf(s.id);
    const done = list.filter((t) => AppState.completedTopics.includes(t.id)).length;
    return { label: s.label, done, total: list.length, percentage: list.length ? Math.round((done / list.length) * 100) : 0 };
  });

  host.innerHTML = `
    <div class="screen-heading">
      <h2 class="screen-title">Your progress</h2>
      <p class="screen-subtitle">Stored locally in this browser. Nothing is sent to a server.</p>
    </div>
    <div class="stat-grid" style="margin-bottom:24px">
      <div class="stat"><div class="stat-value">${completed.length}</div><div class="stat-label">Topics completed</div></div>
      <div class="stat"><div class="stat-value">${average}%</div><div class="stat-label">Average quiz score</div></div>
      <div class="stat"><div class="stat-value">${AppState.xp}</div><div class="stat-label">XP</div></div>
      <div class="stat"><div class="stat-value">${quizzes.length}</div><div class="stat-label">Quizzes taken</div></div>
    </div>
    <h3 class="card-title">Progress by subject</h3>
    <div style="display:flex;flex-direction:column;gap:12px">
      ${bySubject.map((s) => `
        <div class="stitch-card pad-lg">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            <strong style="font-size:14px">${escapeHtml(s.label)}</strong>
            <span class="muted">${s.done}/${s.total}</span>
          </div>
          <div class="progress-bar" style="margin-top:8px"><div class="progress-fill" style="width:${s.percentage}%"></div></div>
        </div>`).join('')}
    </div>
    <h3 class="card-title" style="margin-top:32px">Recent quiz scores</h3>
    ${quizzes.length ? `
      <div class="viz-panel" style="overflow-x:auto">
        <table class="viz-table">
          <thead><tr><th>Topic</th><th>Score</th><th>Percent</th><th></th></tr></thead>
          <tbody>
            ${quizzes.map((entry) => {
              const topic = entry[0]; const score = entry[1];
              return `<tr>
                <td>${escapeHtml((TOPICS_DB[topic] && TOPICS_DB[topic].title) || topic)}</td>
                <td>${score.score}/${score.total}</td>
                <td>${score.percentage}%</td>
                <td><button class="stitch-btn secondary" data-action="start-quiz" data-topic="${escapeHtml(topic)}">Retry</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`
      : emptyState('No quiz results yet', 'Take a quiz and your scores will be listed here.', 'Open quiz center', 'quiz')}
    <div class="button-row" style="margin-top:32px">
      <button class="stitch-btn danger" data-action="reset-progress">Reset all progress</button>
    </div>
  `;
}
