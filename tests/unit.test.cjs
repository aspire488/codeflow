// Unit tests for the pure logic in the browser engines. The files are plain
// browser scripts, so they are evaluated in a vm context with the few globals
// they need. These assert behaviour, not merely that a function exists.
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { readFileSync } = require('node:fs');
const path = require('node:path');

function loadEngine(file, extraGlobals = {}) {
  const sandbox = {
    console,
    window: {},
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    ...extraGlobals
  };
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(path.resolve(__dirname, '..', file), 'utf8'), sandbox);
  return sandbox;
}

test('traceLoop computes iterations, variable values and printed output', () => {
  const engine = loadEngine('src/engines/visualizationEngine.js');
  const trace = engine.traceLoop('for(int i = 1; i <= 3; i++) {\n    printf("%d", i);\n}');

  assert.ok(trace, 'loop should be recognised');
  assert.equal(trace.iterations, 3);
  assert.equal(trace.output, '123');
  assert.equal(trace.rows[0].i, 1);
  assert.equal(trace.rows[2].i, 3);
  assert.match(trace.rows[3].condition, /false/);
});

test('traceLoop respects a space in the format string', () => {
  const engine = loadEngine('src/engines/visualizationEngine.js');
  const trace = engine.traceLoop('for (int i = 0; i < 4; i++) { printf("%d ", i); }');
  assert.equal(trace.output, '0 1 2 3 ');
});

test('traceLoop declines code it cannot evaluate instead of guessing', () => {
  const engine = loadEngine('src/engines/visualizationEngine.js');
  assert.equal(engine.traceLoop('while (1) { printf("*"); }'), null);
});

test('traceRecursion evaluates factorial and records call plus return order', () => {
  const engine = loadEngine('src/engines/visualizationEngine.js');
  const trace = engine.traceRecursion(4);

  assert.equal(trace.finalValue, 24);
  assert.equal(trace.steps[0].call, 'fact(4)');
  assert.equal(trace.steps[0].returnValue, null);
  const returns = trace.steps.filter((step) => step.returnValue !== null);
  assert.equal(returns[0].returnValue, 1, 'base case returns first');
  assert.equal(returns[returns.length - 1].returnValue, 24);
});

test('buildFlowchart classifies decisions, processes and terminators', () => {
  const engine = loadEngine('src/engines/visualizationEngine.js');
  const nodes = engine.buildFlowchart('int main() {\n  int i = 0;\n  for (int i = 0; i < 3; i++) {\n    printf("*");\n  }\n  return 0;\n}');

  assert.ok(nodes.some((node) => node.type === 'terminator' && node.text === 'main()'));
  assert.ok(nodes.some((node) => node.type === 'decision' && /for/.test(node.text)));
  assert.ok(nodes.some((node) => node.type === 'process' && /printf/.test(node.text)));
});

test('output prediction normalises whitespace and case but rejects wrong output', () => {
  const engine = loadEngine('src/engines/outputPredictionEngine.js');

  assert.equal(engine.normalizeOutput('  1 2 3 '), engine.normalizeOutput('123'));
  assert.equal(engine.checkOutputAnswer('123', '123').correct, true);
  assert.equal(engine.checkOutputAnswer(' 1 2 3 ', '123').correct, true);
  assert.equal(engine.checkOutputAnswer('abc', '123').correct, false);
  assert.equal(engine.checkOutputAnswer('', '123').correct, false);
});

test('logic quest execution stepper enforces real execution order', () => {
  const engine = loadEngine('src/engines/logicQuestEngine.js');
  const state = {
    i: 0, output: '', phase: 'check', finished: false, mistakes: 0, log: [], expectedOutput: '***'
  };

  // Incrementing before the body runs is the classic beginner error and must be rejected.
  assert.equal(engine.applyExecutionAction(state, 'increment').ok, false);

  assert.equal(engine.applyExecutionAction(state, 'check').ok, true);
  assert.equal(state.phase, 'body');
  assert.equal(engine.applyExecutionAction(state, 'increment').ok, false);

  assert.equal(engine.applyExecutionAction(state, 'body').ok, true);
  assert.equal(state.output, '*');
  assert.equal(engine.applyExecutionAction(state, 'increment').ok, true);
  assert.equal(state.i, 1);
});

test('logic quest execution reaches the expected output over three iterations', () => {
  const engine = loadEngine('src/engines/logicQuestEngine.js');
  const state = {
    i: 0, output: '', phase: 'check', finished: false, mistakes: 0, log: [], expectedOutput: '***'
  };

  for (let iteration = 0; iteration < 3; iteration += 1) {
    engine.applyExecutionAction(state, 'check');
    engine.applyExecutionAction(state, 'body');
    engine.applyExecutionAction(state, 'increment');
  }
  engine.applyExecutionAction(state, 'check');
  const final = engine.applyExecutionAction(state, 'finish');

  assert.equal(state.output, '***');
  assert.equal(final.success, true);
});

test('calculateQuizScore reports correct totals and percentages', () => {
  const engine = loadEngine('src/engines/quizEngine.js', { QUIZ_DB: { loops: [{}, {}] } });
  // Objects come from another vm realm, so compare fields rather than prototypes.
  const score = (answers, correct) => JSON.parse(JSON.stringify(engine.calculateQuizScore(answers, correct)));

  assert.deepEqual(score([0, 1, 2], [0, 1, 2]), { correct: 3, total: 3, percentage: 100 });
  assert.deepEqual(score([0, 2, 1], [0, 1, 2]), { correct: 1, total: 3, percentage: 33 });
  assert.deepEqual(score([1, 2, 0], [0, 1, 2]), { correct: 0, total: 3, percentage: 0 });
});

test('state sanitiser rejects corrupted persisted progress', () => {
  const source = readFileSync(path.resolve(__dirname, '..', 'src/core/app.js'), 'utf8');
  const start = source.indexOf('function defaultState');
  const end = source.indexOf('function loadState');
  assert.ok(start > -1 && end > start, 'sanitizeState should exist in app.js');

  const sandbox = { console };
  vm.createContext(sandbox);
  vm.runInContext(`${source.slice(start, end)}\nthis.sanitizeState = sanitizeState;`, sandbox);

  const cleaned = sandbox.sanitizeState({ xp: 'lots', completedTopics: 'nope', quizScores: { loops: { score: 9, total: 3 } } });
  assert.equal(cleaned.xp, 0);
  assert.deepEqual([...cleaned.completedTopics], []);
  assert.equal(cleaned.quizScores.loops.score, 3, 'score is clamped to total');

  const missing = sandbox.sanitizeState(null);
  assert.deepEqual([...missing.completedTopics], []);
  assert.equal(missing.xp, 0);
});
