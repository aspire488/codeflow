// ============================================
// ROUTER - single source of truth for navigation
// ============================================

const ROUTES = {
  dashboard: { screen: 'dashboard-screen', title: 'Dashboard', render: () => renderDashboard() },
  topics:    { screen: 'topics-screen',    title: 'Explore Topics', render: () => renderTopicExplorer() },
  lesson:    { screen: 'lesson-screen',    title: 'Lessons', render: (p) => renderLesson(p) },
  quiz:      { screen: 'quiz-screen',      title: 'Quiz Center', render: (p) => renderQuiz(p) },
  predict:   { screen: 'predict-screen',   title: 'Output Prediction', render: (p) => renderOutputPrediction(p) },
  visualize: { screen: 'visualize-screen', title: 'Visualization', render: (p) => renderVisualizer(p) },
  game:      { screen: 'game-screen',      title: 'Logic Quest', render: () => renderLogicQuestMap() },
  logic:     { screen: 'logic-screen',     title: 'Logic Analyzer', render: () => renderLogicAnalyzer() },
  chatbot:   { screen: 'chatbot-screen',   title: 'AI Assistant', render: () => renderChatbot() },
  practice:  { screen: 'practice-screen',  title: 'Adaptive Practice', render: () => renderAdaptivePractice() },
  progress:  { screen: 'progress-screen',  title: 'Progress', render: () => renderProgressDashboard() }
};

let currentRoute = 'dashboard';
let currentParam = null;

// Parse "#lesson/loops" into { route, param }
function parseHashRoute() {
  const raw = (window.location.hash || '').replace(/^#\/?/, '');
  if (!raw) return { route: 'dashboard', param: null };
  const parts = raw.split('/').filter(Boolean).map(decodeURIComponent);
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
    item.classList.toggle('active', item.getAttribute('data-nav') === route);
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

  // Move focus to the screen for keyboard and screen-reader users.
  const screen = document.getElementById(ROUTES[resolvedRoute].screen);
  if (screen) {
    screen.setAttribute('tabindex', '-1');
    screen.focus({ preventScroll: true });
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

function getRouteParam() {
  return currentParam;
}
