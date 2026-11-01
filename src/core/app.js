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

// Far above anything earnable; stops corrupted storage rendering absurd levels.
const MAX_XP = 1000000;

function hasTopic(id) {
  return typeof TOPICS_DB === 'undefined' || Object.prototype.hasOwnProperty.call(TOPICS_DB, id);
}

// Merge only well-formed fields so corrupted storage cannot break the app.
function sanitizeState(raw) {
  const base = defaultState();
  if (!raw || typeof raw !== 'object') return base;

  if (Number.isFinite(raw.xp) && raw.xp >= 0) base.xp = Math.min(Math.floor(raw.xp), MAX_XP);
  if (Number.isFinite(raw.streak) && raw.streak >= 0) base.streak = Math.floor(raw.streak);
  if (Array.isArray(raw.completedTopics)) {
    base.completedTopics = [...new Set(raw.completedTopics.filter((t) => typeof t === 'string' && hasTopic(t)))];
  }
  if (raw.quizScores && typeof raw.quizScores === 'object' && !Array.isArray(raw.quizScores)) {
    Object.entries(raw.quizScores).forEach(([topic, score]) => {
      if (hasTopic(topic) && score && typeof score === 'object' && Number.isFinite(score.score) && Number.isFinite(score.total)) {
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

// Fold another tab's saved progress into ours without losing either side.
function mergeState(target, other) {
  target.xp = Math.max(target.xp, other.xp);
  target.streak = Math.max(target.streak, other.streak);
  target.completedTopics = [...new Set([...other.completedTopics, ...target.completedTopics])];
  Object.entries(other.quizScores).forEach(([topic, score]) => {
    const mine = target.quizScores[topic];
    if (!mine || score.percentage > mine.percentage) target.quizScores[topic] = score;
  });
}

function saveState() {
  try {
    // Re-read first: another tab may have written since we loaded.
    const stored = localStorage.getItem(STATE_KEY);
    if (stored) mergeState(AppState, sanitizeState(JSON.parse(stored)));
  } catch (_) { /* unreadable storage is overwritten below */ }
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(AppState));
    return true;
  } catch (error) {
    console.warn('[state] Progress could not be saved.', error);
    showToast('Progress could not be saved in this browser (storage is full or blocked). It will be lost when you close this tab.');
    return false;
  }
}

function showToast(message, ms = 6000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), ms);
}

// Another tab saved progress: adopt it so this tab does not overwrite it later.
function onStorageChange(event) {
  if (event.key !== null && event.key !== STATE_KEY) return;
  if (event.newValue) {
    try { Object.assign(AppState, sanitizeState(JSON.parse(event.newValue))); } catch (_) { return; }
  } else {
    Object.assign(AppState, defaultState());
  }
  syncChrome();
  if (['dashboard', 'topics', 'progress'].includes(currentRoute)) ROUTES[currentRoute].render(currentParam);
}

function addXP(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return;
  AppState.xp = Math.min(AppState.xp + Math.floor(amount), MAX_XP);
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
  if (levelLabel) levelLabel.textContent = `Level ${Math.floor(AppState.xp / 100) + 1}`;
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
    <span aria-hidden="true" class="material-symbols-outlined empty-icon">inbox</span>
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
    <span aria-hidden="true" class="material-symbols-outlined empty-icon">error</span>
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
// Keep Tab inside an open dialog. Without this, focus walks into the page
// behind the overlay even though the page is visually blocked.
function trapModalFocus(event) {
  const overlay = document.getElementById('app-modal');
  if (!overlay || !overlay.classList.contains('active')) return;

  const panel = document.getElementById('app-modal-panel');
  if (!panel) return;

  const focusable = Array.from(panel.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
)).filter((element) => !element.disabled && element.offsetParent !== null);

  if (!focusable.length) {
    event.preventDefault();
    panel.focus({ preventScroll: true });
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && (active === first || !panel.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}

function openMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const button = document.getElementById('mobile-menu-btn');
  if (!sidebar) return;
  sidebar.classList.add('open');
  if (backdrop) backdrop.classList.add('visible');
  if (button) button.setAttribute('aria-expanded', 'true');
  // inert keeps focus (and screen readers) out of the page behind the drawer.
  setPageInert(true);
  sidebar.querySelector('.nav-item')?.focus({ preventScroll: true });
}

function setPageInert(on) {
  ['screen-container', 'help-btn'].forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.inert = on;
  });
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const button = document.getElementById('mobile-menu-btn');
  const wasOpen = sidebar && sidebar.classList.contains('open');
  setPageInert(false);
  if (wasOpen && button) button.focus({ preventScroll: true });
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
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') trapModalFocus(event);
  });

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
  });

  window.addEventListener('storage', onStorageChange);
  document.getElementById('mobile-menu-btn')?.addEventListener('click', toggleMobileSidebar);
  document.getElementById('sidebar-backdrop')?.addEventListener('click', closeMobileSidebar);

  document.getElementById('help-btn')?.addEventListener('click', () => {
    openModal({
      title: 'Keyboard & navigation',
      body: `<dl class="key-list">
        <div><dt><kbd>Esc</kbd></dt><dd>Close a dialog or the mobile menu.</dd></div>
        <div><dt><kbd>&larr;</kbd> <kbd>&rarr;</kbd></dt><dd>Step back and forward in the visualizer.</dd></div>
        <div><dt><kbd>R</kbd></dt><dd>Reset the visualizer to its first step.</dd></div>
        <div><dt><kbd>Ctrl</kbd> <kbd>Enter</kbd></dt><dd>Run the Logic Analyzer.</dd></div>
      </dl>
      <p class="modal-note">Every screen has its own address, so the browser back and forward buttons work.</p>`,
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
        body: '<p>This clears XP, completed topics, quiz scores, practice history and Logic Quest progress stored in this browser. It cannot be undone.</p>',
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
