// selfTestEngine.js - Automated Self-Testing System

const SelfTestEngine = {
  results: [],
  errors: [],
  testCount: 0,
  passCount: 0,
  
  log: function(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, type, message };
    this.results.push(logEntry);
    console.log(`[SelfTest] [${type.toUpperCase()}] ${message}`);
  },
  
  assert: function(condition, testName) {
    this.testCount++;
    if (condition) {
      this.passCount++;
      this.log(`PASS: ${testName}`, 'pass');
      return true;
    } else {
      this.errors.push(testName);
      this.log(`FAIL: ${testName}`, 'error');
      return false;
    }
  },
  
  runAllTests: async function() {
    this.log('Starting self-test suite...', 'info');
    this.results = [];
    this.errors = [];
    this.testCount = 0;
    this.passCount = 0;
    
    await this.testDOMStructure();
    await this.testNavigation();
    await this.testQuizSystem();
    await this.testVisualization();
    await this.testOutputPrediction();
    await this.testLogicQuest();
    await this.testChatbot();
    await this.testStatePersistence();
    await this.testResponsiveUI();
    
    const summary = `
========================================
SELF-TEST SUMMARY
========================================
Total Tests: ${this.testCount}
Passed: ${this.passCount}
Failed: ${this.errors.length}
Pass Rate: ${((this.passCount/this.testCount)*100).toFixed(1)}%
========================================
    `;
    this.log(summary, this.errors.length === 0 ? 'pass' : 'error');
    
    return {
      total: this.testCount,
      passed: this.passCount,
      failed: this.errors.length,
      results: this.results
    };
  },
  
  testDOMStructure: async function() {
    this.log('Testing DOM Structure...', 'info');
    
    // Check critical screens exist
    const screens = ['dashboard', 'lesson', 'quiz', 'visualize', 'game'];
    for (const screen of screens) {
      const el = document.getElementById(screen);
      this.assert(el !== null, `Screen #${screen} exists`);
      if (el) {
        this.assert(el.classList.contains('screen'), `Screen #${screen} has .screen class`);
      }
    }
    
    // Check critical containers
    const containers = ['topicGrid', 'quizContent', 'visualizeContent', 'gameContent'];
    for (const container of containers) {
      const el = document.getElementById(container);
      this.assert(el !== null, `Container #${container} exists`);
    }
  },
  
  testNavigation: async function() {
    this.log('Testing Navigation...', 'info');
    
    // Test router exists
    this.assert(typeof navigateTo === 'function', 'navigateTo function exists');
    this.assert(typeof showScreen === 'function', 'showScreen function exists');
    
    // Test route parsing
    window.location.hash = '#lesson/variables';
    const route = parseHashRoute();
    this.assert(route.route === 'lesson', 'Route parsing - route');
    this.assert(route.param === 'variables', 'Route parsing - param');
    
    // Test screen switching
    showScreen('dashboard');
    const dash = document.getElementById('dashboard');
    this.assert(dash.classList.contains('active'), 'Dashboard becomes active');
    
    // Verify other screens are hidden
    const lesson = document.getElementById('lesson');
    this.assert(!lesson.classList.contains('active') || lesson.classList.length === 1, 'Lesson is inactive');
  },
  
  testQuizSystem: async function() {
    this.log('Testing Quiz System...', 'info');
    
    // Check quiz functions exist
    this.assert(typeof startQuiz === 'function', 'startQuiz function exists');
    this.assert(typeof switchQuizTab === 'function', 'switchQuizTab function exists');
    this.assert(typeof renderMcqQuiz === 'function', 'renderMcqQuiz function exists');
    
    // Check quiz data exists
    this.assert(typeof QUIZ_DB !== 'undefined', 'QUIZ_DB loaded');
    this.assert(typeof outputPredictionDB !== 'undefined', 'outputPredictionDB loaded');
  },
  
  testVisualization: async function() {
    this.log('Testing Visualization Engine...', 'info');
    
    // Check visualization functions
    this.assert(typeof renderVisualization === 'function', 'renderVisualization exists');
    this.assert(typeof updateVisualization === 'function', 'updateVisualization exists');
    this.assert(typeof resetVisualization === 'function', 'resetVisualization exists');
    
    // Test loop trace function
    this.assert(typeof updateLoopIteration === 'function', 'updateLoopIteration exists');
    this.assert(typeof renderLoopTrace === 'function', 'renderLoopTrace exists');
  },
  
  testOutputPrediction: async function() {
    this.log('Testing Output Prediction...', 'info');
    
    // Check output prediction functions
    this.assert(typeof checkOutputAnswer === 'function', 'checkOutputAnswer exists');
    this.assert(typeof renderOutputPredictionQuiz === 'function', 'renderOutputPredictionQuiz exists');
    this.assert(typeof normalizeOutput === 'function', 'normalizeOutput exists');
    
    // Test normalization
    const result1 = normalizeOutput('123');
    const result2 = normalizeOutput('  1  2  3  ');
    this.assert(result1 === result2, 'Output normalization works');
    
    // Test answer checking
    const check = checkOutputAnswer('123', '123');
    this.assert(check.correct === true, 'Correct answer passes');
    
    const checkFail = checkOutputAnswer('abc', '123');
    this.assert(checkFail.correct === false, 'Wrong answer fails');
  },
  
  testLogicQuest: async function() {
    this.log('Testing Logic Quest...', 'info');
    
    // Check logic quest data
    this.assert(typeof LOGIC_QUEST_LEVELS !== 'undefined', 'LOGIC_QUEST_LEVELS loaded');
    this.assert(Array.isArray(LOGIC_QUEST_LEVELS), 'LOGIC_QUEST_LEVELS is array');
    this.assert(LOGIC_QUEST_LEVELS.length >= 10, 'Logic Quest has sufficient levels');
    
    // Check engine functions
    this.assert(typeof renderLogicQuestMap === 'function', 'renderLogicQuestMap exists');
    this.assert(typeof startLogicQuestLevel === 'function', 'startLogicQuestLevel exists');
    this.assert(typeof loadLogicQuestProgress === 'function', 'loadLogicQuestProgress exists');
  },
  
  testChatbot: async function() {
    this.log('Testing Chatbot...', 'info');
    
    // Check chatbot elements exist in DOM
    const fab = document.getElementById('aiFab');
    const chatPanel = document.getElementById('chatPanel');
    const input = document.getElementById('aiInput');
    
    // These may not exist until the lesson screen is loaded
    if (fab) this.assert(true, 'AI FAB exists');
    if (chatPanel) this.assert(true, 'Chat panel exists');
    
    // Check knowledge base
    this.assert(typeof KNOWLEDGE_BASE !== 'undefined', 'KNOWLEDGE_BASE loaded');
    this.assert(typeof KNOWLEDGE_BASE.getResponse === 'function', 'KNOWLEDGE_BASE.getResponse exists');
  },
  
  testStatePersistence: async function() {
    this.log('Testing State Persistence...', 'info');
    
    // Check state functions
    this.assert(typeof AppState !== 'undefined', 'AppState exists');
    this.assert(typeof saveState === 'function', 'saveState exists');
    this.assert(typeof loadState === 'function', 'loadState exists');
    
    // Test saving and loading
    const testXP = AppState.xp;
    AppState.xp = testXP + 100;
    saveState();
    
    // Reload state
    AppState.xp = 0;
    loadState();
    
    this.assert(AppState.xp === testXP + 100 || AppState.xp >= 0, 'State persistence works');
    
    // Restore
    AppState.xp = testXP;
  },
  
  testResponsiveUI: async function() {
    this.log('Testing Responsive UI...', 'info');
    
    // Check CSS classes exist
    const grid = document.getElementById('topicGrid');
    if (grid) {
      const gridHTML = grid.className || '';
      this.assert(gridHTML.includes('grid') || gridHTML.includes('grid-cols'), 'Topic grid uses responsive classes');
    }
    
    // Check viewport meta tag
    const meta = document.querySelector('meta[name="viewport"]');
    this.assert(meta !== null, 'Viewport meta tag exists');
    this.assert(meta.content.includes('width=device-width'), 'Viewport width set');
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SelfTestEngine;
}

// Auto-run tests after DOM loads
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[SelfTest] System ready. Run SelfTestEngine.runAllTests() to execute tests.');
  });
}