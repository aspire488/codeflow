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

// ---- regression tests for audited content/engine errors ----
const quizDB = require('../data/quizDB.js');
const topicsDB = require('../data/topicsDB.js');
const { outputPredictionDB } = require('../data/outputPredictionDB.js');
const knowledgeBase = require('../data/knowledgeBase.js');

const keyed = (q) => q.options[q.correct];
const allQuizQuestions = () => [
  ...Object.values(quizDB).flat(),
  ...Object.values(topicsDB).flatMap((topic) => topic.quiz || [])
];
const findQuestions = (re) => allQuizQuestions().filter((q) => re.test(q.question));

test('quiz keys: 7 % 3, else count, scanf, const, truthy, rgb alpha', () => {
  const mod = findQuestions(/7 % 3/);
  assert.equal(mod.length, 2);
  mod.forEach((q) => assert.equal(keyed(q), '1'));

  const elseQ = findQuestions(/How many else statements/);
  assert.equal(elseQ.length, 1);
  assert.equal(keyed(elseQ[0]), '1');

  const scanfQ = findQuestions(/precede a variable name in scanf/);
  assert.equal(scanfQ.length, 1);
  assert.match(keyed(scanfQ[0]), /^&/);

  const reassign = findQuestions(/reassigned/);
  assert.equal(reassign.length, 2, 'quizDB and topicsDB copies');
  reassign.forEach((q) => {
    assert.match(q.question, /CANNOT/);
    assert.equal(keyed(q), 'const');
  });

  const truthy = findQuestions(/Truthy values include/);
  assert.equal(truthy.length, 1);
  assert.notEqual(keyed(truthy[0]), 'All except false');
  assert.match(keyed(truthy[0]), /Non-empty strings/);

  const rgb = findQuestions(/Transparent color syntax/);
  assert.equal(keyed(rgb[0]), 'Both');
});

test('every quiz question has a valid key and no duplicate options', () => {
  allQuizQuestions().forEach((q) => {
    assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length, q.question);
    assert.equal(new Set(q.options).size, q.options.length, q.question);
  });
});

test('output prediction answers verified with gcc stay fixed', () => {
  const byId = (id) => outputPredictionDB.find((q) => q.id === id);
  assert.equal(byId('cond-if-2').answer, 'Y', 'else binds to the second if');
  assert.equal(byId('pointer-basic-4').answer, '102012');
  assert.match(byId('pointer-basic-3').code, /\*p = 30;/);
  assert.doesNotMatch(byId('pointer-basic-3').code, /\*x = 30/);
  assert.doesNotMatch(byId('string-basic-3').code, /printf\("%d", strcmp\(s1, s2\)\);/, 'strcmp magnitude is unspecified');
});

test('chatbot matches whole words and prefers the named subject', () => {
  const greeted = (text) => knowledgeBase.greetings.includes(knowledgeBase.getResponse(text));
  assert.equal(greeted('what is this loop'), false);
  assert.equal(greeted('explain this'), false);
  assert.equal(greeted('hi'), true);

  const subjectOf = (text) => {
    const reply = knowledgeBase.getResponse(text);
    return Object.keys(knowledgeBase.subjects).filter((s) =>
      Object.values(knowledgeBase.subjects[s].responses).flat().includes(reply));
  };
  assert.deepEqual(subjectOf('javascript functions'), ['javascript']);
  assert.deepEqual(subjectOf('css layout tips please'), ['css']);
});

test('traceLoop declines nested loops and non-numeric printf arguments but traces simple loops', () => {
  const engine = loadEngine('src/engines/visualizationEngine.js');
  assert.equal(engine.traceLoop(topicsDB['nested-loops'].code), null);
  assert.equal(engine.traceLoop(topicsDB.arrays.code), null);
  assert.equal(engine.traceLoop(topicsDB['array-of-structures'].code), null);
  assert.equal(engine.traceLoop('for (int i = 0; i < 3; i++) { printf("x %d", i * 2); }'), null);
  const ok = engine.traceLoop(topicsDB.loops.code);
  assert.ok(ok);
  assert.equal(ok.output, '1 2 3 4 5 ');
});

test('call stack pops frames as they return and ends empty', () => {
  const engine = loadEngine('src/engines/visualizationEngine.js');
  const { steps } = engine.traceRecursion(3);
  const depth = (i) => engine.callStackAt(steps, i).length;
  assert.equal(depth(0), 1);
  assert.equal(depth(2), 3, 'fact(3), fact(2), fact(1) open');
  assert.equal(depth(3), 2, 'fact(1) has returned');
  assert.equal(depth(steps.length - 1), 0, 'stack is empty after the outermost return');
});

test('buildFlowchart skips comments and keeps else / else if branches', () => {
  const engine = loadEngine('src/engines/visualizationEngine.js');
  const nodes = engine.buildFlowchart('int main() {\n  // set up x = 1\n  int x = 1;\n  if (x > 1) {\n    x = 2;\n  } else if (x == 1) {\n    x = 3;\n  } else {\n    x = 4;\n  }\n}');
  assert.ok(!nodes.some((n) => /set up/.test(n.text)), 'comments are not nodes');
  assert.ok(nodes.some((n) => n.type === 'decision' && /else if \(x == 1\)/.test(n.text)));
  assert.ok(nodes.some((n) => n.type === 'branch' && n.text === 'else'));
});

test('chatbot answers pointer, recursion, stack/heap, let/var and segfault specifically', () => {
  const reply = (q) => knowledgeBase.getResponse(q);
  assert.match(reply('what is a pointer'), /pointer/i);
  assert.match(reply('pointer'), /pointer/i);
  assert.match(reply('What is recursion?'), /base case/i);
  assert.match(reply('stack vs heap'), /heap/i);
  assert.match(reply('Difference between let and var'), /block-scoped/i);
  assert.match(reply('What is a segmentation fault'), /segfault|segmentation/i);
  assert.match(reply('qwerty zzz'), /HTML, CSS and JavaScript/, 'no-match lists topics');
});

test('prediction XP: only a correct, unrevealed, first answer per question earns XP', () => {
  const engine = loadEngine('src/engines/outputPredictionEngine.js');
  const d = (...a) => engine.predictionXpDecision(...a);
  assert.equal(d('q1', true, false, []).award, true);
  assert.equal(d('q1', true, true, []).award, false, 'revealed');
  assert.match(d('q1', true, true, []).reason, /revealed/);
  assert.equal(d('q1', true, false, ['q1']).award, false, 'already awarded');
  assert.equal(d('q1', false, false, []).award, false);
});

test('visualizer ignores prototype-key route params and keyboard works outside code mode', () => {
  const src = readFileSync(path.resolve(__dirname, '..', 'src/engines/visualizationEngine.js'), 'utf8');
  const engine = loadEngine('src/engines/visualizationEngine.js', { TOPICS_DB: { loops: {} } });
  assert.equal(engine.vizHasTopic('loops'), true);
  assert.equal(engine.vizHasTopic('__proto__'), false);
  assert.equal(engine.vizHasTopic('constructor'), false);
  assert.match(src, /pointers: \[pointerStep/);
  assert.match(src, /recursion: \[recursionStep/);
  assert.match(src, /addEventListener\('hashchange'/);
  assert.doesNotMatch(src, /<h4>|role="tab"|aria-selected/);
});
