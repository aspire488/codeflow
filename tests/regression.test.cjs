// Pure-logic regression tests for the audit fixes (analyzer, router parsing, state sanitising, headers).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const { analyzeCodeLogic } = require('../src/engines/logicAnalyzerEngine.js');
const labels = (code, lang = 'c') => analyzeCodeLogic(code, lang).nodes.map((node) => node.label);

test('analyzer: CSS scan is not exponential on long whitespace (was 17s at 4000 spaces)', () => {
  const started = Date.now();
  analyzeCodeLogic(' '.repeat(4000) + '{', 'css');
  analyzeCodeLogic(' '.repeat(9999), 'css');
  analyzeCodeLogic('<a'.repeat(5000), 'html');
  assert.ok(Date.now() - started < 1500, `took ${Date.now() - started}ms`);
});

test('analyzer: input over 10,000 characters is refused with a clear message', () => {
  const result = analyzeCodeLogic('x'.repeat(10001), 'c');
  assert.match(result.error, /too long.*10,000/i);
  assert.deepEqual(result.nodes, []);
  assert.equal(analyzeCodeLogic('x'.repeat(10000), 'c').error, undefined);
});

test('analyzer: C keywords inside strings and comments are not loops', () => {
  assert.ok(!labels('printf("for while");').some((l) => /Loop/.test(l)));
  assert.ok(!labels('/* while(1) */\n// for(;;)\nint x;').some((l) => /Loop/.test(l)));
  assert.ok(!labels('format = 1;\nwhileCount = 2;').some((l) => /Loop/.test(l)));
  assert.deepEqual(labels('format = 1;').slice(1, 2), ['format =']);
});

test('analyzer: real C control flow is still found, including "} else {"', () => {
  const found = labels('for (i = 0; i < 3; i++) {\n}\nwhile (x) {\n}\nif (a) {\n} else if (b) {\n} else {\n}');
  assert.deepEqual(found.slice(1, -1), ['For Loop', 'While Loop', 'If Statement', 'Else If', 'Else']);
});

test('analyzer: displayed printf text comes from the original source, not the masked copy', () => {
  const nodes = analyzeCodeLogic('printf("hello world");', 'c').nodes;
  assert.equal(nodes.find((n) => n.label === 'printf').detail, 'hello world');
});

function routerSandbox(hash) {
  const sandbox = { window: { location: { hash }, addEventListener() {}, history: {} }, document: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(`${read('src/core/router.js')}\nthis.parseHashRoute = parseHashRoute; this.ROUTES = ROUTES;`, sandbox);
  return sandbox;
}

test('router: malformed percent-escapes do not throw and resolve to an unknown route', () => {
  const sandbox = routerSandbox('#quiz/%E0%A4%A');
  const parsed = sandbox.parseHashRoute();
  assert.equal(Object.prototype.hasOwnProperty.call(sandbox.ROUTES, parsed.route), false);
});

test('router: topics route forwards its parameter to the explorer', () => {
  assert.match(read('src/core/router.js'), /topics:\s+\{[^}]*render: \(p\) => renderTopicExplorer\(p\)/);
});

test('router: unreferenced getRouteParam is gone', () => {
  assert.doesNotMatch(read('src/core/router.js'), /getRouteParam/);
});

function loadSanitizer(topics) {
  const source = read('src/core/app.js');
  const start = source.indexOf('// Far above anything earnable');
  const end = source.indexOf('function loadState');
  const sandbox = { console, TOPICS_DB: topics };
  vm.createContext(sandbox);
  vm.runInContext(`function defaultState() { return { xp: 0, streak: 0, completedTopics: [], quizScores: {}, currentTopic: null, lastRoute: null }; }\n${source.slice(start, end)}\nthis.sanitizeState = sanitizeState;`, sandbox);
  return sandbox.sanitizeState;
}

test('state: sanitiser dedupes topics, drops unknown ids and clamps absurd XP', () => {
  const sanitize = loadSanitizer({ loops: {}, arrays: {} });
  const cleaned = sanitize({ xp: 1e306, completedTopics: ['loops', 'loops', 'nope', 'arrays', 7], quizScores: { ghost: { score: 1, total: 2 } } });
  assert.deepEqual([...cleaned.completedTopics], ['loops', 'arrays']);
  assert.ok(cleaned.xp <= 1000000, `xp ${cleaned.xp}`);
  assert.deepEqual(Object.keys(cleaned.quizScores), []);
  assert.equal(sanitize({ completedTopics: ['__proto__'] }).completedTopics.length, 0);
});

test('adaptive state: non-numeric counters are normalised', () => {
  const { AdaptiveEngine } = require('../src/engines/adaptivePracticeEngine.js');
  const storage = { codeflow_adaptive_state: JSON.stringify({ loops: { correct: 'x', wrong: -4, streak: null, mastered: 'yes' }, bad: 5 }) };
  global.localStorage = { getItem: (k) => storage[k] || null, setItem() {}, removeItem() {} };
  AdaptiveEngine.loadState();
  delete global.localStorage;
  assert.deepEqual(JSON.parse(JSON.stringify(AdaptiveEngine.learningState)), { loops: { correct: 0, wrong: 0, streak: 0, mastered: false } });
});

test('headers: vercel.json ships the CSP and index.html has no inline script or handlers', () => {
  const headers = JSON.parse(read('vercel.json')).headers.flatMap((h) => h.headers);
  const csp = headers.find((h) => h.key === 'Content-Security-Policy').value;
  assert.match(csp, /script-src 'self'(;|$)/);
  assert.match(csp, /frame-ancestors 'none'/);
  const html = read('index.html');
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/);
  assert.doesNotMatch(html, /\son[a-z]+\s*=\s*["']/i);
  for (const file of ['src/ui', 'src/engines', 'src/core'].flatMap((d) => fs.readdirSync(path.join(root, d)).map((f) => `${d}/${f}`))) {
    assert.doesNotMatch(read(file), /\son(click|change|input|submit|load|error)\s*=\s*\?"/i, `${file} has an inline handler`);
  }
});

test('service worker: navigation responses are cached only when ok; cache name bumped', () => {
  const worker = read('service-worker.js');
  assert.match(worker, /codeflow-v7/);
  assert.match(worker, /if \(fresh\.ok\)[\s\S]*cache\.put\('\/index\.html'/);
});

test('every .material-symbols-outlined span in markup is aria-hidden (except the data-driven viz/predict engines)', () => {
  const skip = new Set(['src/engines/visualizationEngine.js', 'src/engines/outputPredictionEngine.js']);
  const files = ['index.html', ...['src/ui', 'src/engines', 'src/core'].flatMap((d) => fs.readdirSync(path.join(root, d)).map((f) => `${d}/${f}`))];
  files.filter((f) => !skip.has(f)).forEach((file) => {
    [...read(file).matchAll(/<span[^>]*material-symbols-outlined[^>]*>/g)].forEach((m) => {
      assert.match(m[0], /aria-hidden="true"/, `${file}: ${m[0]}`);
    });
  });
});
