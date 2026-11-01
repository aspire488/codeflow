// ============================================
// LESSON RENDERER - a reading environment
// ============================================

// Wrap call-like tokens (main(), printf("x"), #include <stdio.h>, bare #include / #define, `return 0`) in <code>.
// Deliberately narrow: `return` is only matched before a number, so prose such as "return value" is untouched.
// Each piece is escaped on its own, so nothing from the data reaches the DOM raw.
const LESSON_CODE_TOKEN = /(#include\s*<[^>\s]+>|#(?:include|define)\b|\breturn\s+-?\d+\b|\b[A-Za-z_][\w.]*\([^()]*\))/;

function lessonInlineCode(text) {
  return String(text).split(LESSON_CODE_TOKEN)
    .map((piece, index) => (index % 2 ? `<code>${escapeHtml(piece)}</code>` : escapeHtml(piece)))
    .join('');
}

// "int main() - Entry point" renders as <code>int main()</code>: Entry point
function lessonPoint(point) {
  const text = String(point);
  const split = text.indexOf(' - ');
  if (split > 0) {
    return `<code>${escapeHtml(text.slice(0, split))}</code>: ${lessonInlineCode(text.slice(split + 3))}`;
  }
  return lessonInlineCode(text);
}

function lessonList(heading, points) {
  if (!points.length) return '';
  return `
    <section class="lesson-sec lesson-prose">
      <h3>${heading}</h3>
      <ul class="prose-list">${points.map((point) => `<li>${lessonPoint(point)}</li>`).join('')}</ul>
    </section>`;
}

function lessonPagerLink(key, label, direction) {
  const topic = TOPICS_DB[key];
  return `<a class="pager-link ${direction}" href="#lesson/${escapeHtml(key)}">
    <span class="pager-label">${label}</span>
    <span class="pager-title">${escapeHtml(topic.title)}</span>
  </a>`;
}

function renderLesson(topicId) {
  const host = document.getElementById('lesson-content');
  if (!host) return;

  const keys = Object.keys(TOPICS_DB || {});
  if (!keys.length) {
    host.innerHTML = emptyState('Content unavailable', 'The topic data did not load. Reload the page to try again.', 'Back to dashboard', 'dashboard');
    return;
  }

  // No (or an unknown) topic: open the next incomplete lesson and make the URL say so.
  let key = topicId && hasTopic(topicId) ? topicId : null;
  if (!key) {
    const next = nextUpTopic();
    key = next ? next.id : (hasTopic(AppState.currentTopic) ? AppState.currentTopic : keys[0]);
    window.history.replaceState(null, '', `#lesson/${encodeURIComponent(key)}`);
  }
  const topic = TOPICS_DB[key];
  AppState.currentTopic = key;
  saveState();

  const index = keys.indexOf(key);
  const previous = index > 0 ? keys[index - 1] : null;
  const next = index < keys.length - 1 ? keys[index + 1] : null;
  const position = lessonPosition({ id: key, subject: topic.subject });
  const language = languageForSubject(topic.subject);
  const isDone = AppState.completedTopics.includes(key);
  const concepts = Array.isArray(topic.concept) ? topic.concept : [];
  const explanations = Array.isArray(topic.explanation) ? topic.explanation : [];
  const id = escapeHtml(key);
  const title = escapeHtml(topic.title);

  host.innerHTML = `
    <article class="lesson">
      <header class="lesson-head lesson-prose">
        <a class="back-link" href="#topics"><span aria-hidden="true" class="material-symbols-outlined">arrow_back</span>All topics</a>
        <h2 class="screen-title">${title}</h2>
        <p class="lesson-meta">
          <span>${escapeHtml(subjectLabel(topic.subject))}, lesson ${position.number} of ${position.total}</span>
          ${isDone ? '<span class="status-done"><span aria-hidden="true" class="material-symbols-outlined">check_circle</span>Completed</span>' : ''}
        </p>
      </header>
      ${lessonList('The concept', concepts)}
      ${topic.code ? `
        <section class="lesson-sec">
          <h3>Example code</h3>
          <div class="code-panel">
            <div class="code-panel-bar">${id}.${language === 'javascript' ? 'js' : language}</div>
            <div class="code-scroll" tabindex="0" role="region" aria-label="Example code for ${title}"><pre><code>${highlightCode(topic.code, language)}</code></pre></div>
          </div>
        </section>` : ''}
      ${lessonList('Line by line', explanations)}
      ${topic.examTip ? `<div class="callout tip lesson-prose"><strong>Exam tip</strong>${lessonInlineCode(topic.examTip)}</div>` : ''}
      ${topic.practiceQ ? `
        <section class="lesson-sec lesson-prose">
          <h3>Try it yourself</h3>
          <p>${lessonInlineCode(topic.practiceQ)}</p>
        </section>` : ''}
      <section class="lesson-end lesson-prose">
        <h3>Next step</h3>
        <div class="button-row">
          <a class="stitch-btn" href="#quiz/${id}">Take the quiz</a>
          <a class="stitch-btn secondary" href="#visualize/code/${id}">Visualize this code</a>
          <a class="text-btn" href="#predict/${id}">Predict the output</a>
          ${isDone ? '' : '<button class="text-btn" id="mark-complete">Mark as complete</button>'}
        </div>
        ${isDone ? '' : '<p class="muted">Passing the quiz also marks this lesson complete.</p>'}
        <nav class="lesson-pager" aria-label="Lesson navigation">
          ${previous ? lessonPagerLink(previous, 'Previous lesson', 'prev') : ''}
          ${next ? lessonPagerLink(next, 'Next lesson', 'next') : ''}
        </nav>
      </section>
    </article>
  `;

  const completeButton = document.getElementById('mark-complete');
  if (completeButton) {
    completeButton.addEventListener('click', () => {
      markTopicComplete(key);
      renderLesson(key);
      const meta = host.querySelector('.status-done');
      if (meta) { meta.setAttribute('tabindex', '-1'); meta.focus({ preventScroll: true }); }
    });
  }
}
