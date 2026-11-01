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

function topicCardMarkup(topic) {
  const done = AppState.completedTopics.includes(topic.id);
  const summary = (topic.concept && topic.concept[0]) || topic.examTip || 'Open the lesson to begin.';
  return `
    <article class="stitch-card topic-card" data-topic="${escapeHtml(topic.id)}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
        <div class="card-icon-row">
          <span class="material-symbols-outlined">${escapeHtml(topic.icon || 'code')}</span>
          <h3>${escapeHtml(topic.title)}</h3>
        </div>
        ${done ? '<span class="badge success">Done</span>' : `<span class="badge muted-badge">${escapeHtml(subjectLabel(topic.subject))}</span>`}
      </div>
      <p>${escapeHtml(summary)}</p>
      <div class="button-row" style="margin-top:auto">
        <button class="stitch-btn secondary" data-action="visualize" data-topic="${escapeHtml(topic.id)}">
          <span class="material-symbols-outlined" style="font-size:16px">terminal</span> Visualize
        </button>
        <button class="stitch-btn" data-action="start-quiz" data-topic="${escapeHtml(topic.id)}">
          <span class="material-symbols-outlined" style="font-size:16px">quiz</span> Quiz
        </button>
      </div>
    </article>`;
}

function renderDashboard() {
  const host = document.getElementById('dashboard-content');
  if (!host) return;

  const all = topicsOf('all');
  const completed = AppState.completedTopics.length;
  const percentage = all.length ? Math.round((completed / all.length) * 100) : 0;
  const subjectsCovered = new Set(all.filter((t) => AppState.completedTopics.includes(t.id)).map((t) => t.subject));
  const resumeId = AppState.currentTopic && TOPICS_DB[AppState.currentTopic]
    ? AppState.currentTopic
    : (all.find((t) => !AppState.completedTopics.includes(t.id)) || all[0] || {}).id;

  host.innerHTML = `
    <div class="stitch-card hero-card">
      <h2 class="hero-title">Welcome to CodeFlow</h2>
      <p class="hero-sub">Execution-first learning for C, HTML, CSS and JavaScript. Read a lesson, watch the program state change, predict the output, then lock it in with a quiz.</p>
      <div class="button-row" style="margin-top:0">
        ${resumeId ? `<button class="stitch-btn" data-nav="lesson/${escapeHtml(resumeId)}">
          <span class="material-symbols-outlined" style="font-size:16px">play_arrow</span> Continue learning
        </button>` : ''}
        <button class="stitch-btn secondary" data-nav="topics"><span class="material-symbols-outlined" style="font-size:16px">explore</span> Explore topics</button>
        <button class="stitch-btn secondary" data-nav="visualize"><span class="material-symbols-outlined" style="font-size:16px">terminal</span> Open visualizer</button>
      </div>
      <div class="stat-grid">
        <div class="stat"><div class="stat-value">${completed}</div><div class="stat-label">Topics completed</div></div>
        <div class="stat"><div class="stat-value">${percentage}%</div><div class="stat-label">Course progress</div></div>
        <div class="stat"><div class="stat-value">${AppState.xp}</div><div class="stat-label">XP earned</div></div>
        <div class="stat"><div class="stat-value">${subjectsCovered.size}/4</div><div class="stat-label">Subjects started</div></div>
      </div>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;gap:8px">
      <h3 class="card-title" style="margin:0">Start with a topic</h3>
      <button class="stitch-btn secondary" data-nav="topics">See all ${all.length}</button>
    </div>
    <div class="topic-grid">${all.slice(0, 6).map(topicCardMarkup).join('')}</div>

    <h3 class="card-title" style="margin-top:32px">Practice and explore</h3>
    <div class="topic-grid">
      <article class="stitch-card topic-card" data-nav="predict">
        <div class="card-icon-row"><span class="material-symbols-outlined">psychology</span><h3>Output prediction</h3></div>
        <p>${typeof outputPredictionDB !== 'undefined' ? outputPredictionDB.length : 0} KTU-style questions: predict what the program prints.</p>
      </article>
      <article class="stitch-card topic-card" data-nav="game">
        <div class="card-icon-row"><span class="material-symbols-outlined">sports_esports</span><h3>Logic Quest</h3></div>
        <p>Play from START to the final boss, executing code one action at a time.</p>
      </article>
      <article class="stitch-card topic-card" data-nav="practice">
        <div class="card-icon-row"><span class="material-symbols-outlined">auto_awesome</span><h3>Adaptive practice</h3></div>
        <p>Practice is generated from the topics you actually get wrong.</p>
      </article>
    </div>
  `;
}

function renderTopicExplorer(routeParam) {
  const host = document.getElementById('topics-content');
  if (!host) return;
  if (routeParam && SUBJECTS.some((s) => s.id === routeParam)) activeSubject = routeParam;
  else if (!routeParam) activeSubject = 'all';

  const topics = topicsOf(activeSubject);
  const counts = { all: topicsOf('all').length };
  SUBJECTS.slice(1).forEach((s) => { counts[s.id] = topicsOf(s.id).length; });

  host.innerHTML = `
    <div class="screen-heading">
      <h2 class="screen-title">Explore topics</h2>
      <p class="screen-subtitle">${topics.length} topics shown. ${topics.filter((t) => AppState.completedTopics.includes(t.id)).length} completed in this filter.</p>
    </div>
    <div class="filter-row">
      ${SUBJECTS.map((s) => `
        <button class="filter-chip ${activeSubject === s.id ? 'active' : ''}" data-nav="${s.id === 'all' ? 'topics' : 'topics/' + s.id}">
          ${escapeHtml(s.label)} <span style="opacity:.6">(${counts[s.id] || 0})</span>
        </button>`).join('')}
    </div>
    ${topics.length
      ? `<div class="topic-grid">${topics.map(topicCardMarkup).join('')}</div>`
      : emptyState('No topics here yet', 'Pick another subject to keep exploring.', 'Back to dashboard', 'dashboard')}
  `;
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
          ? `<button class="stitch-btn" data-action="start-quiz" data-topic="${escapeHtml(next.topicKey)}"><span class="material-symbols-outlined" style="font-size:16px">play_arrow</span> Start practice quiz</button>`
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
