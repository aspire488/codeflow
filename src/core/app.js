// ============================================
// APP - state, persistence, delegation, bootstrap
// ============================================

const STATE_KEY = 'codeflow_app_state';

const AppState = {
  xp: 0,
  streak: 0,
  completedTopics: [],
  quizScores: {},
  currentTopic: null,
  lastRoute: null
};

function defaultState() {
  return { xp: 0, streak: 0, completedTopics: [], quizScores: {}, currentTopic: null, lastRoute: null };
}

// Merge only well-formed fields so corrupted storage cannot break the app.
function sanitizeState(raw) {
  const base = defaultState();
  if (!raw || typeof raw !== 'object') return base;

  if (Number.isFinite(raw.xp) && raw.xp >= 0) base.xp = Math.floor(raw.xp);
  if (Number.isFinite(raw.streak) && raw.streak >= 0) base.streak = Math.floor(raw.streak);
  if (Array.isArray(raw.completedTopics)) {
    base.completedTopics = raw.completedTopics.filter((t) => typeof t === 'string');
  }
  if (raw.quizScores && typeof raw.quizScores === 'object' && !Array.isArray(raw.quizScores)) {
    Object.entries(raw.quizScores).forEach(([topic, score]) => {
      if (score && typeof score === 'object' && Number.isFinite(score.score) && Number.isFinite(score.total)) {
        base.quizScores[topic] = {
          score: Math.max(0, Math.min(score.score, score.total)),
          total: score.total,
          percentage: Number.isFinite(score.percentage) ? score.percentage : 0
        };
      }
    });
  }
  if (typeof raw.currentTopic === 'string') base.currentTopic = raw.currentTopic;
  return base;
}

function loadState() {
  try {
    const stored = localStorage.getItem(STATE_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    Object.assign(AppState, sanitizeState(parsed));
  } catch (error) {
    console.warn('[state] Stored progress was unreadable and has been reset.', error);
    try { localStorage.removeItem(STATE_KEY); } catch (_) { /* storage unavailable */ }
    Object.assign(AppState, defaultState());
  }
}

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(AppState));
  } catch (error) {
    console.warn('[state] Progress could not be saved.', error);
  }
}

function addXP(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return;
  AppState.xp += Math.floor(amount);
  saveState();
  syncChrome();
}

function markTopicComplete(topicId) {
  if (!topicId) return false;
  if (AppState.currentTopic !== topicId) AppState.currentTopic = topicId;
  if (AppState.completedTopics.includes(topicId)) {
    saveState();
    return false;
  }
  AppState.completedTopics.push(topicId);
  addXP(10);
  saveState();
  syncChrome();
  return true;
}

// ============================================
// Shared chrome (sidebar progress, XP chip)
// ============================================
function syncChrome() {
  const total = typeof TOPICS_DB !== 'undefined' ? Object.keys(TOPICS_DB).length : 0;
  const completed = AppState.completedTopics.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const fill = document.getElementById('sidebar-progress-fill');
  const value = document.getElementById('sidebar-progress-value');
  const text = document.getElementById('sidebar-progress-text');
  const xpChip = document.getElementById('xp-chip');
  const levelLabel = document.getElementById('sidebar-level');

  if (fill) fill.style.width = `${percentage}%`;
  if (value) value.textContent = `${percentage}%`;
  if (text) text.textContent = `${completed} of ${total} topics completed`;
  if (xpChip) xpChip.textContent = `${AppState.xp} XP`;
  if (levelLabel) levelLabel.textContent = `Level ${Math.floor(AppState.xp / 100) + 1} \u2022 ${completed} topics`;
}

// ============================================
// Utilities
// ============================================
function escapeHtml(text) {
  return String(text == null ? '' : text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function emptyState(title, message, actionLabel, actionRoute) {
  const action = actionLabel && actionRoute
    ? `<button class="stitch-btn" style="margin-top:16px" data-nav="${escapeHtml(actionRoute)}">${escapeHtml(actionLabel)}</button>`
    : '';
  return `<div class="empty-state">
    <span class="material-symbols-outlined empty-icon">inbox</span>
    <h3 class="card-title">${escapeHtml(title)}</h3>
    <p class="muted">${escapeHtml(message)}</p>
    ${action}
  </div>`;
}

function showErrorState(route, error) {
  const definition = ROUTES[route];
  if (!definition) return;
  const screen = document.getElementById(definition.screen);
  const host = screen ? screen.querySelector('.screen-inner, .chat-shell') : null;
  if (!host) return;
  host.innerHTML = `<div class="empty-state">
    <span class="material-symbols-outlined empty-icon">error</span>
    <h3 class="card-title">This screen failed to load</h3>
    <p class="muted">${escapeHtml(error && error.message ? error.message : 'Unknown error')}</p>
    <button class="stitch-btn" style="margin-top:16px" data-nav="dashboard">Back to dashboard</button>
  </div>`;
}

// ============================================
// Modal lifecycle: open / close / Escape / backdrop / scroll lock / focus
// ============================================
let modalReturnFocus = null;

function openModal({ title, body, actions }) {
  const overlay = document.getElementById('app-modal');
  const titleEl = document.getElementById('app-modal-title');
  const bodyEl = document.getElementById('app-modal-body');
  const actionsEl = document.getElementById('app-modal-actions');
  const panel = document.getElementById('app-modal-panel');
  if (!overlay || !titleEl || !bodyEl || !actionsEl) return;

  modalReturnFocus = document.activeElement;
  titleEl.textContent = title || 'CodeFlow';
  bodyEl.innerHTML = body || '';
  actionsEl.innerHTML = actions || '';
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('modal-open');
  document.body.classList.add('modal-open');
  if (panel) panel.focus({ preventScroll: true });
}

function closeModal() {
  const overlay = document.getElementById('app-modal');
  if (!overlay) return;
  if (!overlay.classList.contains('active')) return;

  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.documentElement.classList.remove('modal-open');
  document.body.classList.remove('modal-open');

  const bodyEl = document.getElementById('app-modal-body');
  const actionsEl = document.getElementById('app-modal-actions');
  if (bodyEl) bodyEl.innerHTML = '';
  if (actionsEl) actionsEl.innerHTML = '';

  if (modalReturnFocus && typeof modalReturnFocus.focus === 'function') {
    modalReturnFocus.focus({ preventScroll: true });
  }
  modalReturnFocus = null;
}

// ============================================
// Mobile sidebar
// ============================================
function openMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const button = document.getElementById('mobile-menu-btn');
  if (!sidebar) return;
  sidebar.classList.add('open');
  if (backdrop) backdrop.classList.add('visible');
  if (button) button.setAttribute('aria-expanded', 'true');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const button = document.getElementById('mobile-menu-btn');
  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('visible');
  if (button) button.setAttribute('aria-expanded', 'false');
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  if (sidebar.classList.contains('open')) closeMobileSidebar();
  else openMobileSidebar();
}

// ============================================
// Event delegation - registered exactly once
// ============================================
function initEventDelegation() {
  const root = document.getElementById('app-root');
  if (!root) return;

  root.addEventListener('click', (event) => {
    const target = event.target;

    // Explicit actions win over their containing card.
    const actionEl = target.closest('[data-action]');
    if (actionEl) {
      const action = actionEl.getAttribute('data-action');
      const handled = handleAction(action, actionEl);
      if (handled) {
        event.preventDefault();
        return;
      }
    }

    const navBtn = target.closest('[data-nav]');
    if (navBtn) {
      event.preventDefault();
      navigateTo(navBtn.getAttribute('data-nav'));
      return;
    }

    const topicCard = target.closest('.topic-card[data-topic]');
    if (topicCard) {
      event.preventDefault();
      navigateTo(`lesson/${topicCard.getAttribute('data-topic')}`);
    }
  });

  document.getElementById('mobile-menu-btn')?.addEventListener('click', toggleMobileSidebar);
  document.getElementById('sidebar-backdrop')?.addEventListener('click', closeMobileSidebar);

  document.getElementById('help-btn')?.addEventListener('click', () => {
    openModal({
      title: 'Keyboard & navigation',
      body: `<ul class="modal-list">
        <li><strong>Esc</strong> closes any dialog and the mobile menu.</li>
        <li><strong>&larr; / &rarr;</strong> step backwards and forwards in the visualizer.</li>
        <li><strong>R</strong> resets the visualizer to the first step.</li>
        <li>Every screen has a stable URL hash, so browser back and forward work.</li>
      </ul>`,
      actions: '<button class="stitch-btn" id="modal-ok">Got it</button>'
    });
    document.getElementById('modal-ok')?.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
      closeMobileSidebar();
    }
  });

  // Backdrop click closes the modal (but not clicks inside the panel).
  const overlay = document.getElementById('app-modal');
  overlay?.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });
  document.getElementById('app-modal-close')?.addEventListener('click', closeModal);
}

function handleAction(action, element) {
  const topicId = element.getAttribute('data-topic')
    || element.closest('[data-topic]')?.getAttribute('data-topic');

  switch (action) {
    case 'start-lesson':
      if (topicId) { navigateTo(`lesson/${topicId}`); return true; }
      return false;
    case 'start-quiz':
      navigateTo(topicId ? `quiz/${topicId}` : 'quiz');
      return true;
    case 'start-predict':
      navigateTo(topicId ? `predict/${topicId}` : 'predict');
      return true;
    case 'visualize':
      navigateTo(topicId ? `visualize/code/${topicId}` : 'visualize');
      return true;
    case 'back':
      navigateTo('dashboard');
      return true;
    case 'play-level':
      if (typeof startLogicQuestLevel === 'function') {
        startLogicQuestLevel(element.getAttribute('data-level'));
        return true;
      }
      return false;
    case 'reset-progress':
      openModal({
        title: 'Reset all progress?',
        body: '<p class="muted">This clears XP, completed topics, quiz scores and practice history stored in this browser. It cannot be undone.</p>',
        actions: `<button class="stitch-btn secondary" id="cancel-reset">Cancel</button>
                  <button class="stitch-btn danger" id="confirm-reset">Reset progress</button>`
      });
      document.getElementById('cancel-reset')?.addEventListener('click', closeModal);
      document.getElementById('confirm-reset')?.addEventListener('click', () => {
        resetAllProgress();
        closeModal();
      });
      return true;
    default:
      return false;
  }
}

function resetAllProgress() {
  Object.assign(AppState, defaultState());
  try {
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem('codeflow_adaptive_state');
    localStorage.removeItem('codeflow_logic_quest');
  } catch (_) { /* storage unavailable */ }
  if (typeof AdaptiveEngine !== 'undefined') AdaptiveEngine.learningState = {};
  if (typeof reloadLogicQuestProgress === 'function') reloadLogicQuestProgress();
  syncChrome();
  if (typeof handleRouteChange === 'function') handleRouteChange();
}

// ============================================
// Bootstrap - runs once
// ============================================
let appBooted = false;

function bootApp() {
  if (appBooted) return;
  appBooted = true;

  loadState();
  initEventDelegation();
  initRouter();
  syncChrome();

  if (typeof AdaptiveEngine !== 'undefined' && AdaptiveEngine.init) AdaptiveEngine.init();
  if (typeof loadLogicQuestProgress === 'function') loadLogicQuestProgress();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch((error) => {
        console.warn('[pwa] Service worker registration failed:', error);
      });
    });
  }

  console.log('CodeFlow ready');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
}
