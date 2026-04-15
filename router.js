let currentRoute = "dashboard";

// Simple class-based screen switching
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
  }
  return target;
}

function initRouter() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleRouteChange);
  } else {
    handleRouteChange();
  }
  window.addEventListener('hashchange', handleRouteChange);
}

function parseHashRoute() {
  const hash = window.location.hash.replace(/^#/, '') || 'dashboard';
  const [route, ...rest] = hash.split('/');
  return {
    route: route || 'dashboard',
    param: rest.length ? decodeURIComponent(rest.join('/')) : null
  };
}

function getFirstTopicKey() {
  return (typeof TOPICS_DB !== 'undefined' && Object.keys(TOPICS_DB).length > 0) 
    ? Object.keys(TOPICS_DB)[0] 
    : 'c-basics';
}

function isValidTopic(topicId) {
  return topicId && typeof TOPICS_DB !== 'undefined' && TOPICS_DB.hasOwnProperty(topicId);
}

function handleRouteChange() {
  const { route, param } = parseHashRoute();
  const targetScreen = showScreen(route);

  if (!targetScreen) {
    showScreen('dashboard');
    return;
  }

  currentRoute = route;

  switch (route) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'lesson':
      if (param && !isValidTopic(param)) {
        navigateTo('dashboard');
        return;
      }
      renderTopic(param || getFirstTopicKey());
      break;
    case 'quiz':
      if (param && !isValidTopic(param)) {
        navigateTo('dashboard');
        return;
      }
      startQuiz(param || getFirstTopicKey());
      break;
    case 'visualize':
      if (param && !isValidTopic(param)) {
        navigateTo('dashboard');
        return;
      }
      startVisualization(param || getFirstTopicKey());
      break;
    case 'game':
      openGameMode();
      break;
    case 'logic':
      if (param && !isValidTopic(param)) {
        navigateTo('dashboard');
        return;
      }
      renderTopic(param || getFirstTopicKey());
      break;
    case 'predict':
      renderOutputPredictionMode(param);
      break;
    default:
      renderDashboard();
  }
}

function navigateTo(route) {
  window.location.hash = route.replace(/^#/, '');
}

function getCurrentRoute() {
  return currentRoute;
}

function getRouteParam() {
  return parseHashRoute().param;
}
