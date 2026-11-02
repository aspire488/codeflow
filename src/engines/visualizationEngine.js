// ============================================
// VISUALIZATION ENGINE
//
// Two kinds of visualization, both honest:
//  1. Authored step replays from topic.visualizationSteps (data-driven).
//  2. Derived traces computed by a small, bounded evaluator for
//     `for` loops, factorial recursion and the pointer demo below.
// The evaluator handles a deliberately narrow subset of C, not general code.
// ============================================

const VIZ_MODES = ['code', 'flow', 'pointers', 'recursion', 'loops'];

const VizState = {
  mode: 'code',
  topicKey: null,
  steps: [],
  index: 0,
  playing: false,
  timer: null,
  paint: null,
  keyboardBound: false
};

// Own-property check so route params like __proto__ are never treated as topics.
function vizHasTopic(key) {
  return typeof key === 'string' && Object.prototype.hasOwnProperty.call(TOPICS_DB, key);
}

function defaultVizTopic() {
  if (AppState.currentTopic && vizHasTopic(AppState.currentTopic)) return AppState.currentTopic;
  const keys = Object.keys(TOPICS_DB || {});
  return keys[0] || null;
}

// ---------- real, bounded evaluation helpers ----------

function formatPrintf(format, values) {
  let index = 0;
  return String(format)
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/%d|%i|%c|%s|%f/g, () => {
      const value = values[index];
      index += 1;
      return value === undefined ? '' : String(value);
    });
}

function comparisonHolds(left, operator, right) {
  switch (operator) {
    case '<': return left < right;
    case '<=': return left <= right;
    case '>': return left > right;
    case '>=': return left >= right;
    case '==': return left === right;
    case '!=': return left !== right;
    default: return false;
  }
}

// Returns the text of the statement or {...} block that follows index `from`.
function loopBody(text, from) {
  const rest = text.slice(from);
  const open = rest.search(/\S/);
  if (open < 0) return '';
  if (rest[open] !== '{') {
    const end = rest.indexOf(';', open);
    return end < 0 ? rest.slice(open) : rest.slice(open, end + 1);
  }
  let depth = 0;
  for (let i = open; i < rest.length; i += 1) {
    if (rest[i] === '{') depth += 1;
    else if (rest[i] === '}' && --depth === 0) return rest.slice(open + 1, i);
  }
  return rest.slice(open + 1);
}

// Executes a single simple `for` loop whose body is exactly one printf that
// prints only the loop variable or numeric literals. Anything else (nested
// loops, other printf arguments, no printf) returns null so the UI can say
// "can't be traced" instead of printing guessed text.
function traceLoop(source) {
  const text = String(source || '');
  const loopMatch = text.match(/for\s*\(\s*(?:int\s+|let\s+|var\s+)?(\w+)\s*=\s*(-?\d+)\s*;\s*(\w+)\s*(<=|>=|<|>|==|!=)\s*(-?\d+)\s*;\s*(\w+)\s*(\+\+|--|\+=\s*\d+|-=\s*\d+)\s*\)/);
  if (!loopMatch) return null;

  const variable = loopMatch[1];
  let current = Number(loopMatch[2]);
  const bound = Number(loopMatch[5]);
  const operator = loopMatch[4];
  const update = loopMatch[7].replace(/\s+/g, '');

  const body = loopBody(text, loopMatch.index + loopMatch[0].length);
  if (/\b(for|while|do)\b/.test(body)) return null;
  if ((body.match(/printf\s*\(/g) || []).length !== 1) return null;
  const printfMatch = body.match(/printf\s*\(\s*"((?:[^"\\]|\\.)*)"\s*(?:,\s*([^)]*))?\)/);
  if (!printfMatch) return null;
  const format = printfMatch[1];
  const printArgs = printfMatch[2] ? printfMatch[2].split(',').map((s) => s.trim()) : [];
  const placeholders = format.match(/%[^%]/g) || [];
  if (placeholders.some((p) => !/%[dicsf]/.test(p)) || placeholders.length !== printArgs.length) return null;
  if (printArgs.some((arg) => arg !== variable && !/^-?\d+$/.test(arg))) return null;

  const rows = [];
  let output = '';
  let guard = 0;

  while (comparisonHolds(current, operator, bound) && guard < 50) {
    const values = printArgs.map((arg) => (arg === variable ? current : Number(arg)));
    output += formatPrintf(format, values);
    rows.push({
      iteration: guard + 1,
      [variable]: current,
      condition: `${variable} ${operator} ${bound} \u2192 true`,
      output
    });
    if (update === '++') current += 1;
    else if (update === '--') current -= 1;
    else if (update.startsWith('+=')) current += Number(update.slice(2));
    else if (update.startsWith('-=')) current -= Number(update.slice(2));
    else break;
    guard += 1;
  }

  // The safety guard is not evidence that the loop condition became false.
  // Decline to trace rather than inventing an exit row for non-terminating
  // loops (for example, i += 0) or loops longer than the supported bound.
  if (comparisonHolds(current, operator, bound)) return null;

  rows.push({
    iteration: rows.length + 1,
    [variable]: current,
    condition: `${variable} ${operator} ${bound} \u2192 false, loop exits`,
    output
  });

  // 1-based source lines, so the visualizer can place the program counter honestly.
  const lines = text.split('\n');
  const headerLine = text.slice(0, loopMatch.index).split('\n').length;
  const printfOffset = lines.slice(headerLine - 1).findIndex((line) => /printf\s*\(/.test(line));
  const bodyLine = printfOffset < 0 ? null : headerLine + printfOffset;

  return { variable, rows, output, iterations: guard, headerLine, bodyLine };
}

// Records every call and return of a recursive factorial.
function traceRecursion(n, functionName = 'fact') {
  const calls = [];
  const steps = [];

  function evaluate(value, depth) {
    calls.push(`${functionName}(${value})`);
    steps.push({
      depth,
      value,
      call: `${functionName}(${value})`,
      description: value <= 1
        ? `n = ${value}, base case returns 1`
        : `n = ${value}, needs ${functionName}(${value - 1})`,
      returnValue: null
    });

    let result;
    if (value <= 1) {
      result = 1;
    } else {
      result = value * evaluate(value - 1, depth + 1);
    }

    calls.pop();
    steps.push({
      depth,
      value,
      call: `${functionName}(${value})`,
      description: value <= 1
        ? 'base case returns 1'
        : `returns ${value} \u00d7 ${result / value} = ${result}`,
      returnValue: result
    });
    return result;
  }

  const finalValue = evaluate(n, 0);
  return { steps, finalValue, callCount: steps.filter((s) => s.returnValue !== null).length };
}

// Structural parse of common statements into flowchart nodes.
function buildFlowchart(source) {
  const lines = String(source || '').split('\n');
  const nodes = [];

  lines.forEach((raw) => {
    // Drop a leading `}` (so `} else {` is still seen), then comments.
    const line = raw.trim().replace(/^\}\s*/, '').replace(/\s*\/\/.*$/, '').trim();
    if (!line || line.startsWith('#') || line === '{' || line.startsWith('/*') || /^\*(\s|\/)/.test(line)) return;

    if (/^(int|float|char|double)\s+main\s*\(/.test(line)) {
      nodes.push({ type: 'terminator', text: 'main()' });
      return;
    }
    if (/^for\s*\(/.test(line)) {
      nodes.push({ type: 'decision', text: line.replace(/\s*\{\s*$/, '') });
      return;
    }
    if (/^while\s*\(/.test(line)) {
      nodes.push({ type: 'decision', text: line.replace(/\s*\{\s*$/, '') });
      return;
    }
    if (/^if\s*\(/.test(line)) {
      nodes.push({ type: 'decision', text: line.replace(/\s*\{\s*$/, '') });
      return;
    }
    if (/^else\s+if\s*\(/.test(line)) {
      nodes.push({ type: 'decision', text: line.replace(/\s*\{\s*$/, '') });
      return;
    }
    if (/^else\b/.test(line)) {
      nodes.push({ type: 'branch', text: 'else' });
      return;
    }
    if (/^return\b/.test(line)) {
      nodes.push({ type: 'terminator', text: line });
      return;
    }
    if (/^printf\s*\(/.test(line)) {
      nodes.push({ type: 'process', text: line.replace(/\s*\{\s*$/, '') });
      return;
    }
    if (/^(int|float|char|double|const|let|var)\b/.test(line) || /[=+\-*/]=?/.test(line)) {
      nodes.push({ type: 'process', text: line.replace(/\s*\{\s*$/, '') });
    }
  });

  return nodes;
}

// Call frames still open after step `index` (a frame pops when its return step has run).
function callStackAt(steps, index) {
  const stack = [];
  steps.slice(0, index + 1).forEach((step) => {
    if (step.returnValue === null) stack.push(step);
    else stack.pop();
  });
  return stack;
}

function pointerDemo() {
  return {
    code: 'int x = 10;\nint *p = &x;\n*p = 25;\nprintf("%d", x);',
    variables: [
      { name: 'x', type: 'int', value: '10 -> 25' },
      { name: 'p', type: 'int *', value: '&x' }
    ],
    steps: [
      { description: 'int x = 10;  // x holds 10', variables: { x: '10' }, pointers: {}, output: '' },
      { description: 'int *p = &x;  // p stores the address of x', variables: { x: '10', p: '&x' }, pointers: { p: 'x' }, output: '' },
      { description: '*p = 25;  // write through the pointer changes x', variables: { x: '25', p: '&x' }, pointers: { p: 'x' }, output: '' },
      { description: 'printf("%d", x);  // reads the updated x', variables: { x: '25', p: '&x' }, pointers: { p: 'x' }, output: '25' }
    ]
  };
}

// ---------- step construction ----------
// Every step: { line (1-based or null), description, variables, console, ... }.

function buildAuthoredSteps(topicKey) {
  const topic = TOPICS_DB[topicKey];
  if (!topic || !Array.isArray(topic.visualizationSteps) || !topic.visualizationSteps.length) return [];

  // These entries are an authored walkthrough. Their `output` field is the
  // narration for the step, not program stdout, so it must never be rendered
  // in the console panel as if the program had printed it.
  return topic.visualizationSteps.map((step, index) => ({
    line: Number.isFinite(step.line) ? step.line : null,
    description: String(step.output || 'Step ' + (index + 1)),
    variables: step.variables || {},
    console: String(step.stdout || '')
  }));
}

// A computed loop trace as steps. Iterations sit on the printf line; the final
// failed condition sits on the loop header.
function loopTraceSteps(trace) {
  return trace.rows.map((row, index) => ({
    line: index === trace.rows.length - 1 ? trace.headerLine : (trace.bodyLine || trace.headerLine),
    description: `Iteration ${row.iteration}: ${row.condition}`,
    variables: { [trace.variable]: row[trace.variable] },
    console: row.output,
    row: index
  }));
}

// { kind: 'authored' | 'computed' | 'unsupported', steps }
function buildStepsForTopic(topicKey) {
  const authored = buildAuthoredSteps(topicKey);
  if (authored.length) return { kind: 'authored', steps: authored };

  const topic = TOPICS_DB[topicKey];
  const trace = topic && topic.code ? traceLoop(topic.code) : null;
  if (trace) return { kind: 'computed', steps: loopTraceSteps(trace), trace };
  return { kind: 'unsupported', steps: [] };
}

const RECURSION_DEMO_N = 4;
const RECURSION_CODE = 'int fact(int n) {\n    if (n <= 1) return 1;\n    return n * fact(n - 1);\n}\n\nprintf("%d", fact(' + RECURSION_DEMO_N + '));';

// Each traced event is placed on the line of RECURSION_CODE where it happens.
function recursionSteps() {
  return traceRecursion(RECURSION_DEMO_N).steps.map((step) => ({
    ...step,
    line: step.value <= 1 ? 2 : 3,
    console: ''
  }));
}

function pointerSteps() {
  return pointerDemo().steps.map((step, index) => ({ ...step, line: index + 1, console: step.output }));
}

// ---------- rendering ----------

const VIZ_STEPPED = ['code', 'pointers', 'recursion', 'loops'];

function vizEl(id) { return document.getElementById(id); }

function vizFileName(language) {
  return `${VizState.topicKey}.${language === 'javascript' ? 'js' : language}`;
}

function renderVisualizer(param) {
  let mode = 'code';
  let topicKey = null;

  if (param) {
    const parts = String(param).split('/');
    if (VIZ_MODES.includes(parts[0])) {
      mode = parts[0];
      if (parts[1]) topicKey = parts[1];
    } else if (vizHasTopic(parts[0])) {
      topicKey = parts[0];
    }
  }

  VizState.mode = mode;
  VizState.topicKey = vizHasTopic(topicKey) ? topicKey : defaultVizTopic();
  VizState.index = 0;
  VizState.steps = [];
  VizState.paint = null;
  stopAutoPlay();

  document.querySelectorAll('.viz-tab').forEach((tab) => {
    const isActive = tab.getAttribute('data-viz-mode') === mode;
    tab.classList.toggle('active', isActive);
    if (isActive) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  });

  if (!VizState.topicKey) {
    vizEl('viz-example').innerHTML = '';
    vizEl('visualize-content').innerHTML =
      emptyState('No code to visualize', 'The topic database did not load.', 'Back to dashboard', 'dashboard');
    return;
  }

  bindVizTabs();
  bindVizKeyboard();
  renderVizExample();

  if (mode === 'code') renderCodeMode();
  else if (mode === 'flow') renderFlowMode();
  else if (mode === 'pointers') renderPointerMode();
  else if (mode === 'recursion') renderRecursionMode();
  else renderLoopMode();
}

function bindVizTabs() {
  document.querySelectorAll('.viz-tab').forEach((tab) => {
    if (tab.dataset.bound === '1') return;
    tab.dataset.bound = '1';
    tab.addEventListener('click', () => {
      const mode = tab.getAttribute('data-viz-mode');
      navigateTo(`visualize/${mode}${VizState.topicKey ? '/' + VizState.topicKey : ''}`);
    });
  });
}

function bindVizKeyboard() {
  if (VizState.keyboardBound) return;
  VizState.keyboardBound = true;
  document.addEventListener('keydown', (event) => {
    if (getCurrentRoute() !== 'visualize') return;
    const tag = (event.target && event.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (event.target && event.target.isContentEditable) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (!VIZ_STEPPED.includes(VizState.mode) || !VizState.steps.length) return;

    if (event.key === 'ArrowRight') { event.preventDefault(); stepVisualization(1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); stepVisualization(-1); }
    else if (event.key === 'r' || event.key === 'R') { event.preventDefault(); resetVizSteps(); }
  });
  // Stop autoplay when the user navigates away from the visualizer.
  window.addEventListener('hashchange', () => {
    if (!/^#\/?visualize/.test(window.location.hash)) stopAutoPlay();
  });
}

function vizTopicOptionsMarkup() {
  const keys = Object.keys(TOPICS_DB || {});
  const groups = [['c', 'C Programming'], ['html', 'HTML'], ['css', 'CSS'], ['js', 'JavaScript']];
  return groups.map(([subject, label]) => {
    const items = keys.filter((key) => TOPICS_DB[key].subject === subject);
    if (!items.length) return '';
    return '<optgroup label="' + escapeHtml(label) + '">' + items.map((key) =>
      '<option value="' + escapeHtml(key) + '"' + (key === VizState.topicKey ? ' selected' : '') + '>' +
      escapeHtml(TOPICS_DB[key].title) + '</option>').join('') + '</optgroup>';
  }).join('');
}

// The example select lives in the single toolbar. Pointer and recursion use fixed built-in examples.
function renderVizExample() {
  const host = vizEl('viz-example');
  if (!host) return;
  if (VizState.mode === 'pointers' || VizState.mode === 'recursion') {
    host.innerHTML = '<span class="viz-fixed">Built-in example</span>';
    return;
  }
  host.innerHTML = `
    <label class="field-label" for="viz-topic-select">Example</label>
    <select class="select" id="viz-topic-select">${vizTopicOptionsMarkup()}</select>`;
  vizEl('viz-topic-select').addEventListener('change', (event) => {
    navigateTo('visualize/' + VizState.mode + '/' + event.target.value);
  });
}

// ---- shared pieces ----

const VIZ_SOURCE = {
  authored: { icon: 'menu_book', label: 'Authored walkthrough', note: 'Narration written by hand for this lesson. The code was not run.' },
  computed: { icon: 'calculate', label: 'Computed trace', note: 'Evaluated step by step by a small interpreter for this simple shape of code.' },
  structural: { icon: 'account_tree', label: 'Structural view', note: 'Statements parsed from the source. Nothing was run.' }
};

function vizSourceMarkup(kind, extra) {
  const source = VIZ_SOURCE[kind];
  return `<p class="viz-source"><span class="viz-source-label"><span aria-hidden="true" class="material-symbols-outlined">${source.icon}</span>${source.label}</span><span class="viz-source-note">${escapeHtml(extra || source.note)}</span></p>`;
}

function vizCodeMarkup(code, language, name) {
  const lines = String(code || '').split('\n');
  return `
    <div class="viz-codewrap">
      <div class="viz-code-bar"><span>${escapeHtml(name)}</span><span id="viz-line-status" class="viz-line-status"></span></div>
      <div class="viz-code" id="viz-code" tabindex="0" role="region" aria-label="Code with line numbers">
        ${lines.map((line, index) => `<div class="viz-line" data-line="${index + 1}"><span class="pc" aria-hidden="true"></span><span class="ln" aria-hidden="true">${index + 1}</span><span class="code">${highlightCode(line, language) || ' '}</span></div>`).join('')}
      </div>
    </div>`;
}

// The program counter: highlight one line and keep it visible inside the code panel.
function markVizLine(line) {
  const host = vizEl('viz-code');
  if (!host) return;
  let target = null;
  host.querySelectorAll('.viz-line').forEach((element) => {
    const on = Number(element.getAttribute('data-line')) === line;
    element.classList.toggle('active', on);
    if (on) { element.setAttribute('aria-current', 'step'); target = element; }
    else element.removeAttribute('aria-current');
  });
  const status = vizEl('viz-line-status');
  if (status) status.textContent = line ? `Line ${line}` : (VizState.steps.length ? 'No line for this step' : '');
  if (target) {
    const top = target.offsetTop;
    if (top < host.scrollTop || top + target.offsetHeight > host.scrollTop + host.clientHeight) {
      host.scrollTop = Math.max(0, top - host.clientHeight / 2);
    }
  }
}

function vizTerminalMarkup(id, title) {
  return `<div class="terminal"><div class="terminal-bar"><span aria-hidden="true" class="material-symbols-outlined">terminal</span>${escapeHtml(title)}</div><pre class="console" id="${id}"></pre></div>`;
}

function vizWorkspace(left, right, options) {
  const hasTransport = Boolean(options && options.transport);
  vizEl('visualize-content').innerHTML = `
    <div class="viz-workspace ${hasTransport ? 'has-transport' : ''}">
      <div class="viz-left">
        ${left}
        <div id="viz-controls" class="viz-transport" ${hasTransport ? '' : 'hidden'}></div>
      </div>
      <div class="viz-right">${right}</div>
    </div>`;
}

function unsupportedMarkup(title, message, actions) {
  return `<div class="viz-unsupported">
    <h3><span aria-hidden="true" class="material-symbols-outlined">info</span>${escapeHtml(title)}</h3>
    <p>${escapeHtml(message)}</p>
    <div class="button-row">${actions}</div>
  </div>`;
}

// ---- transport: Reset, Back, Step n of m with progress, Next, Play ----

function renderVizTransport() {
  const controls = vizEl('viz-controls');
  if (!controls) return;
  const icon = (name) => `<span aria-hidden="true" class="material-symbols-outlined">${name}</span>`;
  controls.innerHTML = `
    <div class="transport-progress">
      <span class="viz-step-label" id="viz-step-label"></span>
      <span class="sr-only" id="viz-step-announcement" role="status" aria-live="polite" aria-atomic="true"></span>
      <div class="progress-bar" aria-hidden="true"><div class="progress-fill" id="viz-progress"></div></div>
    </div>
    <div class="transport-buttons">
      <button class="stitch-btn secondary transport-reset" id="viz-reset" aria-label="Reset to the first step">${icon('restart_alt')}<span class="transport-text">Reset</span></button>
      <button class="stitch-btn secondary" id="viz-prev">${icon('skip_previous')}Back</button>
      <button class="stitch-btn" id="viz-next">Next${icon('skip_next')}</button>
      <button class="stitch-btn secondary" id="viz-play">${icon('play_arrow')}<span id="viz-play-text">Play</span></button>
    </div>`;
  vizEl('viz-prev').addEventListener('click', () => stepVisualization(-1));
  vizEl('viz-next').addEventListener('click', () => stepVisualization(1));
  vizEl('viz-play').addEventListener('click', toggleAutoPlay);
  vizEl('viz-reset').addEventListener('click', resetVizSteps);
}

function paintVizTransport() {
  const total = VizState.steps.length;
  const label = vizEl('viz-step-label');
  if (label) label.textContent = `Step ${VizState.index + 1} of ${total}`;
  const announcement = vizEl('viz-step-announcement');
  if (announcement) {
    const current = VizState.steps[VizState.index];
    announcement.textContent = current
      ? `Step ${VizState.index + 1} of ${total}. ${current.description || ''}`
      : '';
  }
  const bar = vizEl('viz-progress');
  if (bar) bar.style.width = `${total > 1 ? Math.round((VizState.index / (total - 1)) * 100) : 100}%`;
  const next = vizEl('viz-next');
  if (next) next.disabled = VizState.index >= total - 1;
  const previous = vizEl('viz-prev');
  if (previous) previous.disabled = VizState.index <= 0;
}

// Install steps and a per-mode painter, then paint step 1.
function startVizPlayer(steps, paint) {
  VizState.steps = steps;
  VizState.index = 0;
  VizState.paint = paint;
  renderVizTransport();
  paintViz();
}

function paintViz() {
  const step = VizState.steps[VizState.index];
  if (!step) return;
  markVizLine(step.line);
  if (VizState.paint) VizState.paint(step);
  paintVizTransport();
}

function stepVisualization(delta) {
  if (!VIZ_STEPPED.includes(VizState.mode) || !VizState.steps.length) return;
  const next = VizState.index + delta;
  if (next < 0 || next >= VizState.steps.length) return;
  VizState.index = next;
  paintViz();
}

function resetVizSteps() {
  if (!VIZ_STEPPED.includes(VizState.mode) || !VizState.steps.length) return;
  stopAutoPlay();
  VizState.index = 0;
  paintViz();
}

function setPlayButton(playing) {
  const button = vizEl('viz-play');
  if (!button) return;
  button.querySelector('.material-symbols-outlined').textContent = playing ? 'pause' : 'play_arrow';
  vizEl('viz-play-text').textContent = playing ? 'Pause' : 'Play';
}

function toggleAutoPlay() {
  if (VizState.playing) { stopAutoPlay(); return; }
  if (!VizState.steps.length) return;
  if (VizState.index >= VizState.steps.length - 1) VizState.index = 0;
  VizState.playing = true;
  setPlayButton(true);
  paintViz();
  VizState.timer = setInterval(() => {
    if (getCurrentRoute() !== 'visualize' || VizState.index >= VizState.steps.length - 1) {
      stopAutoPlay();
      return;
    }
    VizState.index += 1;
    paintViz();
    if (VizState.index >= VizState.steps.length - 1) stopAutoPlay();
  }, 1200);
}

function stopAutoPlay() {
  VizState.playing = false;
  if (VizState.timer) {
    clearInterval(VizState.timer);
    VizState.timer = null;
  }
  setPlayButton(false);
}

// ---- right-column painters ----

function paintVariables(step) {
  const variables = vizEl('viz-variables');
  if (!variables) return;
  const entries = Object.entries(step.variables || {});
  variables.innerHTML = entries.length
    ? entries.map(([name, value]) => `<tr><th scope="row" class="var-name">${escapeHtml(name)}</th><td>${escapeHtml(String(value))}</td></tr>`).join('')
    : '<tr><td class="muted">No variables in scope at this step</td></tr>';
}

function paintStepText(id, step) {
  const host = vizEl(id);
  if (host) host.textContent = step.description;
}

function paintConsole(id, text, empty) {
  const host = vizEl(id);
  if (host) host.textContent = text || empty || '(no output yet)';
}

// ---- modes ----

function renderCodeMode() {
  const topic = TOPICS_DB[VizState.topicKey];
  const language = languageForSubject(topic.subject);
  const built = buildStepsForTopic(VizState.topicKey);
  const left = vizCodeMarkup(topic.code, language, vizFileName(language));

  if (built.kind === 'unsupported') {
    vizWorkspace(left, unsupportedMarkup(
      'No step-by-step walkthrough for this lesson',
      'This lesson has no authored walkthrough, and its code is not a simple loop the trace engine can compute. The code is shown for reference.',
      `<button class="stitch-btn" data-nav="visualize/flow/${escapeHtml(VizState.topicKey)}">See the flow diagram</button>
       <button class="text-btn" data-nav="visualize/code/loops">Try the loops walkthrough</button>`
    ));
    return;
  }

  const hasLines = built.steps.some((step) => step.line);
  const source = VIZ_SOURCE[built.kind].note + (hasLines ? '' : ' It has no line data, so no code line is highlighted.');
  vizWorkspace(left, `
    ${vizSourceMarkup(built.kind, source)}
    <section class="viz-section"><h3>Current step</h3><p id="viz-description" class="viz-step-text"></p></section>
    <section class="viz-section"><h3>Variables</h3><table class="viz-table"><tbody id="viz-variables"></tbody></table></section>
    <section class="viz-section"><h3>${built.kind === 'authored' ? 'Output shown by the walkthrough' : 'Output'}</h3>${vizTerminalMarkup('viz-console', 'Output')}</section>
  `, { transport: true });

  startVizPlayer(built.steps, (step) => {
    paintStepText('viz-description', step);
    paintVariables(step);
    paintConsole('viz-console', step.console);
  });
}

function renderFlowMode() {
  const topic = TOPICS_DB[VizState.topicKey];
  const language = languageForSubject(topic.subject);
  const nodes = buildFlowchart(topic.code || '');

  vizWorkspace(vizCodeMarkup(topic.code, language, vizFileName(language)), `
    ${vizSourceMarkup('structural')}
    <section class="viz-section">
      <h3>Flow diagram</h3>
      ${nodes.length ? `<ol class="flow-chart" aria-label="Statements in source order">${nodes.map((node) => `<li class="flow-node ${node.type}">${escapeHtml(node.text)}</li>`).join('')}</ol>`
        : '<p class="muted">No control-flow statements were recognised in this snippet.</p>'}
      <p class="viz-note">Source order, top to bottom. Decisions are marked, but branches and loop-backs are not drawn, so the arrows are not the execution path. Rounded nodes are conditions; green nodes are entry and exit points.</p>
    </section>
  `);
}

function renderPointerMode() {
  const demo = pointerDemo();
  vizWorkspace(vizCodeMarkup(demo.code, 'c', 'pointer-demo.c'), `
    ${vizSourceMarkup('authored', 'A scripted walkthrough of this four-line snippet. Addresses are illustrative: &x stands for "the address of x", not a real memory address.')}
    <section class="viz-section"><h3>Memory</h3><div id="pointer-memory" class="mem-grid"></div></section>
    <section class="viz-section"><h3>Current step</h3><p id="pointer-description" class="viz-step-text"></p></section>
    <section class="viz-section"><h3>Output</h3>${vizTerminalMarkup('pointer-output', 'Output')}</section>
  `, { transport: true });

  startVizPlayer(pointerSteps(), (step) => {
    vizEl('pointer-memory').innerHTML = demo.variables.map((variable) => {
      const value = step.variables[variable.name];
      const target = step.pointers[variable.name];
      return `<div class="mem-row ${value === undefined ? 'is-empty' : ''}">
        <span class="mem-name">${escapeHtml(variable.name)}</span>
        <span class="mem-type">${escapeHtml(variable.type)}</span>
        <span class="mem-value">${value === undefined ? 'not declared yet' : escapeHtml(String(value))}</span>
        ${target ? `<span class="mem-points"><span aria-hidden="true" class="material-symbols-outlined">arrow_right_alt</span>points to ${escapeHtml(target)}</span>` : ''}
      </div>`;
    }).join('');
    paintStepText('pointer-description', step);
    paintConsole('pointer-output', step.console);
  });
}

// The call stack as a real stack: newest frame on top, the active frame marked.
function paintRecursionStep(step) {
  const all = VizState.steps;
  const returning = step.returnValue !== null;
  const frames = callStackAt(all, returning ? VizState.index - 1 : VizState.index);
  vizEl('recursion-stack').innerHTML = frames.length
    ? frames.slice().reverse().map((frame, position) => {
      const current = position === 0;
      const state = current ? (returning ? `returning ${step.returnValue}` : step.description) : `waiting for fact(${frame.value - 1})`;
      return `<li class="frame ${current ? 'current' : ''}"${current ? ' aria-current="step"' : ''}>
        <span class="pc" aria-hidden="true"></span>
        <span class="frame-call">${escapeHtml(frame.call)}</span>
        <span class="frame-state">${current ? '<span class="sr-only">Current frame: </span>' : ''}${escapeHtml(state)}</span>
      </li>`;
    }).join('')
    : `<li class="frame is-empty">Stack empty: every call has returned.</li>`;

  const returns = all.slice(0, VizState.index + 1).filter((s) => s.returnValue !== null);
  paintConsole('recursion-output', returns.map((s) => `${s.call} returned ${s.returnValue}`).join('\n'), 'Nothing has returned yet');
  paintStepText('recursion-description', step);
}

function renderRecursionMode() {
  vizWorkspace(vizCodeMarkup(RECURSION_CODE, 'c', 'factorial.c'), `
    ${vizSourceMarkup('computed', `Every call and return comes from really evaluating fact(${RECURSION_DEMO_N}). The highlighted line is where each event happens.`)}
    <section class="viz-section"><h3>Call stack</h3><ol id="recursion-stack" class="call-stack" aria-label="Call stack, newest frame first"></ol><p class="viz-note">Newest call on top. The marked frame is the one running.</p></section>
    <section class="viz-section"><h3>Current step</h3><p id="recursion-description" class="viz-step-text"></p></section>
    <section class="viz-section"><h3>Returns so far</h3>${vizTerminalMarkup('recursion-output', 'Returns')}</section>
  `, { transport: true });
  startVizPlayer(recursionSteps(), paintRecursionStep);
}

function renderLoopMode() {
  const topic = TOPICS_DB[VizState.topicKey];
  const language = languageForSubject(topic.subject);
  const trace = traceLoop(topic.code || '');
  const left = vizCodeMarkup(topic.code, language, vizFileName(language));

  if (!trace) {
    vizWorkspace(left, unsupportedMarkup(
      "This example can't be traced",
      'The trace engine handles one for loop whose body is a single printf of the loop variable or numbers, with no nested loops. For example: for (int i = 0; i < 3; i++) { printf("%d ", i); }',
      `<button class="stitch-btn" data-nav="visualize/loops/loops">Open a loop example</button>
       <button class="text-btn" data-nav="visualize/code/${escapeHtml(VizState.topicKey)}">Back to step-by-step</button>`
    ));
    return;
  }

  const headers = Object.keys(trace.rows[0] || {});
  vizWorkspace(left, `
    ${vizSourceMarkup('computed', 'Computed by executing the loop with the parsed start, condition and update values. The highlighted line is the statement that ran.')}
    <section class="viz-section"><h3>Current step</h3><p id="viz-description" class="viz-step-text"></p></section>
    <section class="viz-section">
      <h3>Iterations (${trace.iterations})</h3>
      <div class="table-scroll"><table class="viz-table">
        <thead><tr>${headers.map((h) => `<th scope="col">${escapeHtml(h)}</th>`).join('')}</tr></thead>
        <tbody>${trace.rows.map((row, index) => `<tr data-row="${index}">${headers.map((h) => `<td>${escapeHtml(String(row[h]))}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>
    </section>
    <section class="viz-section"><h3>Output so far</h3>${vizTerminalMarkup('viz-console', 'Output')}</section>
  `, { transport: true });

  startVizPlayer(loopTraceSteps(trace), (step) => {
    paintStepText('viz-description', step);
    paintConsole('viz-console', step.console);
    document.querySelectorAll('.viz-table tbody tr').forEach((row) => {
      const on = Number(row.getAttribute('data-row')) === step.row;
      row.classList.toggle('active', on);
      if (on) row.setAttribute('aria-current', 'step'); else row.removeAttribute('aria-current');
    });
  });
}
