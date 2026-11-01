// ============================================
// ROUTER - single source of truth for navigation
// ============================================

const ROUTES = {
  dashboard: { screen: 'dashboard-screen', title: 'Dashboard', render: () => renderDashboard() },
  topics:    { screen: 'topics-screen',    title: 'Explore topics', render: (p) => renderTopicExplorer(p) },
  lesson:    { screen: 'lesson-screen',    title: 'Lessons', render: (p) => renderLesson(p) },
  quiz:      { screen: 'quiz-screen',      title: 'Quiz center', render: (p) => renderQuiz(p) },
  predict:   { screen: 'predict-screen',   title: 'Output prediction', render: (p) => renderOutputPrediction(p) },
  visualize: { screen: 'visualize-screen', title: 'Visualizer', render: (p) => renderVisualizer(p) },
  game:      { screen: 'game-screen',      title: 'Logic Quest', render: () => renderLogicQuestMap() },
  logic:     { screen: 'logic-screen',     title: 'Logic Analyzer', render: () => renderLogicAnalyzer() },
  chatbot:   { screen: 'chatbot-screen',   title: 'Study assistant', render: () => renderChatbot() },
  practice:  { screen: 'practice-screen',  title: 'Adaptive practice', render: () => renderAdaptivePractice() },
  progress:  { screen: 'progress-screen',  title: 'Progress', render: () => renderProgressDashboard() }
};

let currentRoute = 'dashboard';
let currentParam = null;

// Parse "#lesson/loops" into { route, param }
function parseHashRoute() {
  const raw = (window.location.hash || '').replace(/^#\/?/, '');
  if (!raw) return { route: 'dashboard', param: null };
  let parts;
  try {
    parts = raw.split('/').filter(Boolean).map(decodeURIComponent);
  } catch (_) {
    // Malformed %-escape: treat as an unknown route (falls back to the dashboard).
    return { route: 'invalid', param: null };
  }
  return { route: parts[0] || 'dashboard', param: parts.length > 1 ? parts.slice(1).join('/') : null };
}

// Show exactly one screen. Unknown routes fall back to the dashboard.
function showScreen(route) {
  const definition = ROUTES[route];
  const screenId = definition ? definition.screen : ROUTES.dashboard.screen;

  document.querySelectorAll('.screen').forEach((screen) => {
    const isActive = screen.id === screenId;
    screen.classList.toggle('active', isActive);
    if (isActive) {
      // Reset scroll position per screen change without touching body overflow.
      const scroller = screen.querySelector('.screen-scroll');
      if (scroller) scroller.scrollTop = 0;
    }
  });

  const target = document.getElementById(screenId);
  const titleEl = document.getElementById('page-title');
  if (titleEl) titleEl.textContent = (definition || ROUTES.dashboard).title;
  document.title = `${(definition || ROUTES.dashboard).title} - CodeFlow`;

  document.querySelectorAll('.nav-item').forEach((item) => {
    const isActive = item.getAttribute('data-nav') === route;
    item.classList.toggle('active', isActive);
    if (isActive) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });

  closeMobileSidebar();
  return target;
}

function navigateTo(route) {
  const clean = String(route || '').replace(/^#/, '');
  const nextHash = `#${clean}`;
  if (window.location.hash === nextHash) {
    handleRouteChange();
  } else {
    window.location.hash = nextHash;
  }
}

function handleRouteChange() {
  const { route, param } = parseHashRoute();
  const isKnown = Object.prototype.hasOwnProperty.call(ROUTES, route);
  const resolvedRoute = isKnown ? route : 'dashboard';

  currentRoute = resolvedRoute;
  currentParam = isKnown ? param : null;
  if (!isKnown) {
    // Replace the invalid hash so back/forward does not fight the fallback.
    window.history.replaceState(null, '', '#dashboard');
  }

  showScreen(resolvedRoute);

  try {
    ROUTES[resolvedRoute].render(param);
  } catch (error) {
    console.error(`[router] Failed to render route "${resolvedRoute}":`, error);
    if (typeof showErrorState === 'function') {
      showErrorState(resolvedRoute, error);
    }
  }

  if (typeof syncChrome === 'function') syncChrome();

  // Move focus to the screen heading so screen readers announce where they landed.
  const screen = document.getElementById(ROUTES[resolvedRoute].screen);
  const focusTarget = (screen && screen.querySelector('h2')) || screen;
  if (focusTarget) {
    focusTarget.setAttribute('tabindex', '-1');
    focusTarget.focus({ preventScroll: true });
  }
}

function initRouter() {
  window.addEventListener('hashchange', handleRouteChange);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleRouteChange);
  } else {
    handleRouteChange();
  }
}

function getCurrentRoute() {
  return currentRoute;
}
