// ============================================
// LESSON RENDERER
// ============================================

function renderLesson(topicId) {
  const host = document.getElementById('lesson-content');
  if (!host) return;

  const keys = Object.keys(TOPICS_DB || {});
  if (!keys.length) {
    host.innerHTML = emptyState('Content unavailable', 'The topic database did not load.', 'Back to dashboard', 'dashboard');
    return;
  }

  const key = topicId && hasTopic(topicId) ? topicId : keys[0];
  const topic = TOPICS_DB[key];
  AppState.currentTopic = key;
  saveState();

  const sameSubject = keys.filter((k) => TOPICS_DB[k].subject === topic.subject);
  const position = sameSubject.indexOf(key);
  const previous = position > 0 ? sameSubject[position - 1] : null;
  const next = position >= 0 && position < sameSubject.length - 1 ? sameSubject[position + 1] : null;
  const language = languageForSubject(topic.subject);
  const isDone = AppState.completedTopics.includes(key);
  const concepts = Array.isArray(topic.concept) ? topic.concept : [];
  const explanations = Array.isArray(topic.explanation) ? topic.explanation : [];

  host.innerHTML = `
    <div class="stack-head">
      <button class="stitch-btn secondary" data-nav="topics">
        <span aria-hidden="true" class="material-symbols-outlined" style="font-size:16px">arrow_back</span> All topics
      </button>
      <h2 class="screen-title" style="margin-top:16px">${escapeHtml(topic.title)}</h2>
      <p class="screen-subtitle">
        ${escapeHtml(subjectLabel(topic.subject))} &middot; Lesson ${position + 1} of ${sameSubject.length}
        ${isDone ? ' &middot; <span class="badge success">Completed</span>' : ''}
      </p>
    </div>
    <div class="lesson-layout">
      ${concepts.length ? `
        <section class="stitch-card lesson-section">
          <h3>The concept</h3>
          <ul class="lesson-list">${concepts.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul>
        </section>` : ''}
      ${topic.code ? `
        <section class="code-panel">
          <div class="code-panel-bar">
            <span>${escapeHtml(key)}.${language === 'javascript' ? 'js' : language}</span>
            <button class="stitch-btn secondary" data-action="visualize" data-topic="${escapeHtml(key)}">
              <span aria-hidden="true" class="material-symbols-outlined" style="font-size:16px">terminal</span> Visualize this code
            </button>
          </div>
          <pre><code>${highlightCode(topic.code, language)}</code></pre>
        </section>` : ''}
      ${explanations.length ? `
        <section class="stitch-card lesson-section">
          <h3>Line by line</h3>
          <ul class="lesson-list">${explanations.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul>
        </section>` : ''}
      ${topic.examTip ? `<section class="callout tip"><strong>Exam tip:</strong> ${escapeHtml(topic.examTip)}</section>` : ''}
      ${topic.practiceQ ? `
        <section class="stitch-card lesson-section">
          <h3>Try it yourself</h3>
          <p class="muted">${escapeHtml(topic.practiceQ)}</p>
          <div class="button-row">
            <button class="stitch-btn" data-action="start-quiz" data-topic="${escapeHtml(key)}">
              <span aria-hidden="true" class="material-symbols-outlined" style="font-size:16px">quiz</span> Quiz this topic
            </button>
            <button class="stitch-btn secondary" data-action="start-predict" data-topic="${escapeHtml(key)}">
              <span aria-hidden="true" class="material-symbols-outlined" style="font-size:16px">psychology</span> Predict output
            </button>
            ${isDone ? '' : '<button class="stitch-btn secondary" id="mark-complete">Mark as complete</button>'}
          </div>
        </section>` : ''}
      <div class="lesson-nav">
        <button class="stitch-btn secondary" ${previous ? `data-nav="lesson/${escapeHtml(previous)}"` : 'disabled'}>
          <span aria-hidden="true" class="material-symbols-outlined" style="font-size:16px">chevron_left</span> Previous
        </button>
        <button class="stitch-btn" ${next ? `data-nav="lesson/${escapeHtml(next)}"` : 'disabled'}>
          Next <span aria-hidden="true" class="material-symbols-outlined" style="font-size:16px">chevron_right</span>
        </button>
      </div>
    </div>
  `;

  const completeButton = document.getElementById('mark-complete');
  if (completeButton) {
    completeButton.addEventListener('click', () => {
      markTopicComplete(key);
      renderLesson(key);
    });
  }
}
