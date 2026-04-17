let currentRoute = "dashboard";
let routeParam = null;

// Screen ID mapping for new Stitch UI
const SCREEN_MAP = {
  'dashboard': 'dashboard-screen',
  'lesson': 'lesson-screen',
  'quiz': 'quiz-screen',
  'visualize': 'visualize-screen',
  'game': 'game-screen',
  'chatbot': 'chatbot-screen',
  'logic': 'logic-analyzer-screen'
};

// Unified screen switching
function showScreen(screenName) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
    screen.style.display = 'none';
  });

  // Show target screen
  const screenId = SCREEN_MAP[screenName] || SCREEN_MAP['dashboard'];
  const target = document.getElementById(screenId);
  
  if (target) {
    target.classList.add('active');
    target.style.display = 'flex';
    
    // Reset scroll position on screen change
    const main = target.querySelector('main');
    if (main) {
      main.scrollTop = 0;
    } else {
      target.scrollTop = 0;
    }
    
    // Ensure body scroll is restored
    document.body.style.overflow = 'auto';
  }
  
  return target;
}

// Initialize router
function initRouter() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleRouteChange);
  } else {
    handleRouteChange();
  }
  
  window.addEventListener('hashchange', handleRouteChange);
  
  // Reset scroll on route change
  window.addEventListener('hashchange', () => {
    document.body.style.overflow = 'auto';
  });
}

// Parse hash route
function parseHashRoute() {
  const hash = window.location.hash.replace(/^#/, '') || 'dashboard';
  const [route, ...rest] = hash.split('/');
  return {
    route: route || 'dashboard',
    param: rest.length ? decodeURIComponent(rest.join('/')) : null
  };
}

// Helper functions
function getFirstTopicKey() {
  return (typeof TOPICS_DB !== 'undefined' && Object.keys(TOPICS_DB).length > 0) 
    ? Object.keys(TOPICS_DB)[0] 
    : 'c-basics';
}

function isValidTopic(topicId) {
  return topicId && typeof TOPICS_DB !== 'undefined' && TOPICS_DB.hasOwnProperty(topicId);
}

// Main route handler
function handleRouteChange() {
  const { route, param } = parseHashRoute();
  
  // Store for reference
  currentRoute = route;
  routeParam = param;
  
  // Show appropriate screen
  const targetScreen = showScreen(route);

  if (!targetScreen) {
    showScreen('dashboard');
    return;
  }

  // Route-specific rendering
  switch (route) {
    case 'dashboard':
      if (typeof renderDashboard === 'function') {
        renderDashboard();
      }
      break;
      
    case 'lesson':
      if (param && !isValidTopic(param)) {
        navigateTo('dashboard');
        return;
      }
      if (typeof renderTopic === 'function') {
        renderTopic(param || getFirstTopicKey());
      }
      break;
      
    case 'quiz':
      if (param && !isValidTopic(param)) {
        navigateTo('dashboard');
        return;
      }
      if (typeof startQuiz === 'function') {
        startQuiz(param || getFirstTopicKey());
      }
      break;
      
    case 'visualize':
      if (param && !isValidTopic(param)) {
        navigateTo('dashboard');
        return;
      }
      if (typeof startVisualization === 'function') {
        startVisualization(param || getFirstTopicKey());
      }
      break;
      
    case 'game':
      if (typeof openGameMode === 'function') {
        openGameMode();
      }
      break;
      
    case 'chatbot':
      if (typeof renderChatbot === 'function') {
        renderChatbot();
      }
      break;
      
    case 'logic':
      if (typeof renderLogicAnalyzer === 'function') {
        renderLogicAnalyzer();
      }
      break;
      
    case 'predict':
      if (typeof renderOutputPredictionMode === 'function') {
        renderOutputPredictionMode(param);
      }
      break;
      
    default:
      showScreen('dashboard');
      if (typeof renderDashboard === 'function') {
        renderDashboard();
      }
  }
}

// Navigation helper
function navigateTo(route) {
  window.location.hash = '#' + route.replace(/^#/, '');
}

// Route accessors
function getCurrentRoute() {
  return currentRoute;
}

function getRouteParam() {
  return routeParam;
}
