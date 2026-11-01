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

  rows.push({
    iteration: rows.length + 1,
    [variable]: current,
    condition: `${variable} ${operator} ${bound} \u2192 false, loop exits`,
    output
  });

  return { variable, rows, output, iterations: guard };
}

// Records every call and return of a recursive factorial.
function traceRecursion(n, functionName = 'fact') {
  const calls = [];
  const steps = [];

  function evaluate(value, depth) {
    calls.push(`${functionName}(${value})`);
    steps.push({
      depth,
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

function buildStepsForTopic(topicKey) {
  const authored = buildAuthoredSteps(topicKey);
  if (authored.length) return authored;

  const topic = TOPICS_DB[topicKey];
  if (!topic || !topic.code) return [];

  const trace = traceLoop(topic.code);
  if (!trace) {
    return [{
      line: null,
      description: 'This topic has no authored execution steps. Open Loop trace for a computed example, or pick a loop topic.',
      variables: {},
      console: ''
    }];
  }

  return trace.rows.map((row) => ({
    line: null,
    description: row.condition,
    variables: { [trace.variable]: row[trace.variable] },
    console: row.output
  }));
}

// ---------- rendering ----------

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
  stopAutoPlay();

  document.querySelectorAll('.viz-tab').forEach((tab) => {
    const isActive = tab.getAttribute('data-viz-mode') === mode;
    tab.classList.toggle('active', isActive);
    if (isActive) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  });

  if (!VizState.topicKey) {
    document.getElementById('visualize-content').innerHTML =
      emptyState('No code to visualize', 'The topic database did not load.', 'Back to dashboard', 'dashboard');
    document.getElementById('viz-controls').innerHTML = '';
    return;
  }

  bindVizTabs();
  bindVizKeyboard();

  if (mode === 'code') renderCodeMode();
  else if (mode === 'flow') renderFlowMode();
  else if (mode === 'pointers') renderPointerMode();
  else if (mode === 'recursion') renderRecursionMode();
  else renderLoopMode();

  bindVizTopicSelect();
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
    const steppers = {
      code: [stepVisualization, resetVizSteps],
      pointers: [pointerStep, () => { VizState.index = 0; paintPointerStep(); }],
      recursion: [recursionStep, () => { VizState.index = 0; paintRecursionStep(); }]
    }[VizState.mode];
    if (!steppers) return;

    if (event.key === 'ArrowRight') { event.preventDefault(); steppers[0](1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); steppers[0](-1); }
    else if (event.key === 'r' || event.key === 'R') { event.preventDefault(); steppers[1](); }
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

function topicSelectorMarkup() {
  const total = Object.keys(TOPICS_DB || {}).length;
  return `<div class="viz-topic" style="margin-bottom:16px">
    <label class="field-label" for="viz-topic-select" style="margin:0">Example</label>
    <select class="select" id="viz-topic-select" aria-label="Choose a code example">${vizTopicOptionsMarkup()}</select>
    <span class="faint">${total} lessons</span>
  </div>`;
}

function bindVizTopicSelect() {
  const select = document.getElementById('viz-topic-select');
  if (!select) return;
  select.addEventListener('change', () => {
    navigateTo('visualize/' + VizState.mode + '/' + select.value);
  });
}

function renderCodeMode() {
  const topic = TOPICS_DB[VizState.topicKey];
  VizState.steps = buildStepsForTopic(VizState.topicKey);
  VizState.index = 0;

  document.getElementById('visualize-content').innerHTML = `
    ${topicSelectorMarkup()}
    <div class="viz-code" id="viz-code"></div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="viz-panel">
        <h3>Current step</h3>
        <p id="viz-description" class="muted" style="margin:0"></p>
      </div>
      <div class="viz-panel">
        <h3>Variables</h3>
        <table class="viz-table"><tbody id="viz-variables"></tbody></table>
      </div>
      <div class="viz-panel">
        <h3>${topic.visualizationSteps ? 'Output (authored walkthrough)' : 'Output'}</h3>
        <div class="console" id="viz-console"></div>
      </div>
    </div>
  `;

  renderVizControls({ stepped: true, total: VizState.steps.length });
  paintCodeStep();
}

function renderVizControls(options) {
  const controls = document.getElementById('viz-controls');
  const total = options.total || 1;
  const stepControls = options.stepped
    ? `<button class="stitch-btn secondary" id="viz-prev"><span aria-hidden="true" class="material-symbols-outlined" style="font-size:18px">skip_previous</span> Back</button>
       <span class="viz-step-label" id="viz-step-label">Step 1 / ${total}</span>
       <button class="stitch-btn" id="viz-next"><span aria-hidden="true" class="material-symbols-outlined" style="font-size:18px">skip_next</span> Next</button>`
    : `<span class="viz-step-label">${escapeHtml(options.note || '')}</span>`;

  controls.innerHTML = `
    <button class="stitch-btn secondary" id="viz-reset"><span aria-hidden="true" class="material-symbols-outlined" style="font-size:18px">restart_alt</span> Reset</button>
    ${stepControls}
    ${options.stepped ? '<button class="stitch-btn secondary" id="viz-play"><span aria-hidden="true" class="material-symbols-outlined" style="font-size:18px">play_arrow</span> Play</button>' : ''}
  `;

  if (!options.stepped) return;

  document.getElementById('viz-prev').addEventListener('click', () => stepVisualization(-1));
  document.getElementById('viz-next').addEventListener('click', () => stepVisualization(1));
  document.getElementById('viz-play').addEventListener('click', toggleAutoPlay);
  document.getElementById('viz-reset')?.addEventListener('click', resetVizSteps);
}

function paintCodeStep() {
  const topic = TOPICS_DB[VizState.topicKey];
  const step = VizState.steps[VizState.index];
  if (!topic || !step) return;

  const codeHost = document.getElementById('viz-code');
  if (codeHost) {
    const lines = String(topic.code || '').split('\n');
    codeHost.innerHTML = lines.map((line, index) => `
      <div class="viz-line ${step.line && step.line === index + 1 ? 'active' : ''}">
        <span class="ln">${index + 1}</span>
        <span class="code">${highlightCode(line, languageForSubject(topic.subject))}</span>
      </div>`).join('');
  }

  const description = document.getElementById('viz-description');
  if (description) description.textContent = step.description;

  const variables = document.getElementById('viz-variables');
  if (variables) {
    const entries = Object.entries(step.variables || {});
    variables.innerHTML = entries.length
      ? entries.map(([name, value]) => `<tr><td class="var-name">${escapeHtml(name)}</td><td>${escapeHtml(String(value))}</td></tr>`).join('')
      : '<tr><td class="muted">No variables in scope at this step</td></tr>';
  }

  const consoleHost = document.getElementById('viz-console');
  if (consoleHost) consoleHost.textContent = step.console || '(no output yet)';

  const label = document.getElementById('viz-step-label');
  if (label) label.textContent = `Step ${VizState.index + 1} / ${VizState.steps.length}`;

  const next = document.getElementById('viz-next');
  if (next) next.disabled = VizState.index >= VizState.steps.length - 1;
  const previous = document.getElementById('viz-prev');
  if (previous) previous.disabled = VizState.index <= 0;
}

function stepVisualization(delta) {
  if (VizState.mode !== 'code' || !VizState.steps.length) return;
  const next = VizState.index + delta;
  if (next < 0 || next >= VizState.steps.length) return;
  VizState.index = next;
  paintCodeStep();
}

function resetVizSteps() {
  if (VizState.mode !== 'code') return;
  stopAutoPlay();
  VizState.index = 0;
  paintCodeStep();
}

function toggleAutoPlay() {
  if (VizState.playing) {
    stopAutoPlay();
    return;
  }
  if (!VizState.steps.length) return;
  VizState.playing = true;
  const button = document.getElementById('viz-play');
  if (button) button.innerHTML = '<span aria-hidden="true" class="material-symbols-outlined" style="font-size:18px">pause</span> Pause';

  VizState.timer = setInterval(() => {
    if (VizState.index >= VizState.steps.length - 1) {
      stopAutoPlay();
      return;
    }
    VizState.index += 1;
    paintCodeStep();
  }, 1200);
}

function stopAutoPlay() {
  VizState.playing = false;
  if (VizState.timer) {
    clearInterval(VizState.timer);
    VizState.timer = null;
  }
  const button = document.getElementById('viz-play');
  if (button) button.innerHTML = '<span aria-hidden="true" class="material-symbols-outlined" style="font-size:18px">play_arrow</span> Play';
}

function renderFlowMode() {
  const topic = TOPICS_DB[VizState.topicKey];
  const nodes = buildFlowchart(topic.code || '');
  const content = document.getElementById('visualize-content');

  content.innerHTML = `
    ${topicSelectorMarkup()}
    <div>
      <div class="viz-panel">
        <h3>Flow control graph</h3>
        <div class="flow-chart">
          ${nodes.length ? nodes.map((node, index) => `
            <div class="flow-node ${node.type}">${escapeHtml(node.text)}</div>
            ${index < nodes.length - 1 ? '<div class="flow-arrow">&darr;</div>' : ''}
          `).join('') : '<p class="muted">No control-flow statements were recognised in this snippet.</p>'}
        </div>
      </div>
    </div>
    <div>
      <div class="viz-panel">
        <h3>How to read this</h3>
        <p class="muted">Nodes are produced by parsing the statements in this lesson's code. Rounded nodes are conditions, green nodes are entry and exit points, and square nodes are executed statements. This is a structural view in source order: decision points are marked, but branches and loop-backs are not drawn and the arrows are not the execution path. It is not a runtime trace.</p>
      </div>
      <div class="viz-panel" style="margin-top:16px">
        <h3>Source</h3>
        <pre class="viz-code" style="padding:12px;max-height:none">${highlightCode(topic.code || '', languageForSubject(topic.subject))}</pre>
      </div>
    </div>
  `;

  renderVizControls({ stepped: false, note: `${nodes.length} nodes parsed` });
}

function renderPointerMode() {
  const demo = pointerDemo();
  const content = document.getElementById('visualize-content');
  VizState.steps = demo.steps;
  VizState.index = 0;

  content.innerHTML = `
    <div class="viz-panel">
      <h3>Pointer program</h3>
      <pre class="viz-code" style="padding:12px;max-height:none">${highlightCode(demo.code, 'c')}</pre>
      <p class="muted" style="margin-top:10px">Authored walkthrough of this snippet: taking an address, then writing through the pointer. No real memory addresses are shown; &amp;x stands for "the address of x".</p>
    </div>
    <div>
      <div class="viz-panel">
        <h3>Memory and references</h3>
        <div id="pointer-memory"></div>
      </div>
      <div class="viz-panel" style="margin-top:16px">
        <h3>Step</h3>
        <p id="pointer-description" class="muted" style="margin:0"></p>
        <div class="console" id="pointer-output" style="margin-top:10px"></div>
      </div>
    </div>
  `;

  renderVizControls({ stepped: true, total: demo.steps.length });
  // Reuse the shared stepping machinery for this mode.
  VizState.mode = 'pointers';
  document.getElementById('viz-prev').addEventListener('click', () => pointerStep(-1));
  document.getElementById('viz-next').addEventListener('click', () => pointerStep(1));
  document.getElementById('viz-play').addEventListener('click', togglePointerPlay);
  document.getElementById('viz-reset').addEventListener('click', () => {
    VizState.index = 0;
    paintPointerStep();
  });

  paintPointerStep();
}

function paintPointerStep() {
  const demo = pointerDemo();
  const step = demo.steps[VizState.index];
  if (!step) return;

  const memory = document.getElementById('pointer-memory');
  if (memory) {
    memory.innerHTML = demo.variables.map((variable) => {
      const value = step.variables[variable.name] !== undefined ? step.variables[variable.name] : variable.value;
      const isPointer = step.pointers[variable.name];
      return `<div class="pointer-row">
        <div class="mem-box ${isPointer ? 'pointer' : 'active'}">
          <span class="mem-name">${escapeHtml(variable.name)}</span>
          <span class="mem-value">${escapeHtml(variable.type)}</span>
        </div>
        <div class="mem-box active">
          <span class="mem-name">${escapeHtml(String(value))}</span>
          <span class="mem-value">${isPointer ? 'points to ' + escapeHtml(step.pointers[variable.name]) : 'value'}</span>
        </div>
      </div>`;
    }).join('');
  }

  const description = document.getElementById('pointer-description');
  if (description) description.textContent = step.description;

  const output = document.getElementById('pointer-output');
  if (output) output.textContent = step.output || '(no output yet)';

  const label = document.getElementById('viz-step-label');
  if (label) label.textContent = `Step ${VizState.index + 1} / ${demo.steps.length}`;
  const previous = document.getElementById('viz-prev');
  if (previous) previous.disabled = VizState.index <= 0;
  const next = document.getElementById('viz-next');
  if (next) next.disabled = VizState.index >= demo.steps.length - 1;
}

function pointerStep(delta) {
  const demo = pointerDemo();
  const next = VizState.index + delta;
  if (next < 0 || next >= demo.steps.length) return;
  VizState.index = next;
  paintPointerStep();
}

function togglePointerPlay() {
  if (VizState.timer) {
    clearInterval(VizState.timer);
    VizState.timer = null;
    return;
  }
  VizState.timer = setInterval(() => {
    const demo = pointerDemo();
    if (VizState.index >= demo.steps.length - 1) {
      clearInterval(VizState.timer);
      VizState.timer = null;
      return;
    }
    VizState.index += 1;
    paintPointerStep();
  }, 1200);
}

function renderRecursionMode() {
  const demoN = 4;
  const trace = traceRecursion(demoN);
  const content = document.getElementById('visualize-content');
  VizState.steps = trace.steps;
  VizState.index = 0;

  content.innerHTML = `
    <div class="viz-panel">
      <h3>Recursive function</h3>
      <pre class="viz-code" style="padding:12px;max-height:none">${highlightCode('int fact(int n) {\n    if (n <= 1) return 1;\n    return n * fact(n - 1);\n}\n\nprintf("%d", fact(' + demoN + '));', 'c')}</pre>
      <p class="muted" style="margin-top:10px">Calls are produced by actually evaluating <code>fact(${demoN})</code>, not by playing back a scripted animation.</p>
    </div>
    <div>
      <div class="viz-panel">
        <h3>Call stack</h3>
        <div id="recursion-stack"></div>
      </div>
      <div class="viz-panel" style="margin-top:16px">
        <h3>Result</h3>
        <div class="console" id="recursion-output"></div>
      </div>
    </div>
  `;

  renderVizControls({ stepped: true, total: trace.steps.length });
  document.getElementById('viz-prev').addEventListener('click', () => recursionStep(-1));
  document.getElementById('viz-next').addEventListener('click', () => recursionStep(1));
  document.getElementById('viz-play').addEventListener('click', toggleRecursionPlay);
  document.getElementById('viz-reset').addEventListener('click', () => { VizState.index = 0; paintRecursionStep(); });

  paintRecursionStep();
}

function currentRecursionTrace() {
  return traceRecursion(4);
}

function paintRecursionStep() {
  const trace = currentRecursionTrace();
  const step = trace.steps[VizState.index];
  if (!step) return;

  const stack = document.getElementById('recursion-stack');
  if (stack) {
    const active = callStackAt(trace.steps, VizState.index).slice(-5);
    stack.innerHTML = active.length
      ? active.map((entry, index) => `
        <div class="stack-item ${index === active.length - 1 ? 'active' : ''}">
          <div class="stack-call">${escapeHtml(entry.call)}</div>
          <div class="stack-desc">${escapeHtml(entry.description)}</div>
        </div>`).join('')
      : '<p class="muted">Stack empty - recursion has fully unwound.</p>';
  }

  const output = document.getElementById('recursion-output');
  if (output) {
    const returns = trace.steps.slice(0, VizState.index + 1).filter((s) => s.returnValue !== null);
    output.textContent = returns.length
      ? returns.map((s) => `${s.call} returned ${s.returnValue}`).join('\n')
      : 'Unwinding has not started yet';
  }

  const label = document.getElementById('viz-step-label');
  if (label) label.textContent = `Call ${VizState.index + 1} / ${trace.steps.length}`;
  const previous = document.getElementById('viz-prev');
  if (previous) previous.disabled = VizState.index <= 0;
  const next = document.getElementById('viz-next');
  if (next) next.disabled = VizState.index >= trace.steps.length - 1;
}

function recursionStep(delta) {
  const trace = currentRecursionTrace();
  const next = VizState.index + delta;
  if (next < 0 || next >= trace.steps.length) return;
  VizState.index = next;
  paintRecursionStep();
}

function toggleRecursionPlay() {
  if (VizState.timer) {
    clearInterval(VizState.timer);
    VizState.timer = null;
    return;
  }
  VizState.timer = setInterval(() => {
    const trace = currentRecursionTrace();
    if (VizState.index >= trace.steps.length - 1) {
      clearInterval(VizState.timer);
      VizState.timer = null;
      return;
    }
    VizState.index += 1;
    paintRecursionStep();
  }, 1100);
}

function renderLoopMode() {
  const topic = TOPICS_DB[VizState.topicKey];
  const content = document.getElementById('visualize-content');
  const trace = traceLoop(topic.code || '');

  if (!trace) {
    content.innerHTML = `
      ${topicSelectorMarkup()}
      <div class="viz-panel">
        <h3>Loop trace</h3>
        <p class="muted">This example can't be traced: the evaluator only handles a single <code>for</code> loop whose body is one <code>printf</code> printing the loop variable or numbers, with no nested loops.</p>
        <p class="muted">Supported shape: <code>for (int i = 0; i &lt; 3; i++) { printf("%d ", i); }</code></p>
        <button class="stitch-btn" data-nav="visualize/loops/loops">Open a loop example</button>
      </div>`;
    renderVizControls({ stepped: false, note: 'No supported loop found' });
    return;
  }

  const headers = Object.keys(trace.rows[0] || {});

  content.innerHTML = `
    ${topicSelectorMarkup()}
    <div class="viz-panel">
      <h3>Source</h3>
      <pre class="viz-code" style="padding:12px;max-height:none">${highlightCode(topic.code, languageForSubject(topic.subject))}</pre>
    </div>
    <div>
      <div class="viz-panel" style="overflow-x:auto">
        <h3>Iteration trace (${trace.iterations} iterations)</h3>
        <table class="viz-table">
          <thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
          <tbody>
            ${trace.rows.map((row, index) => `
              <tr class="${index === VizState.index ? 'active' : ''}">
                ${headers.map((h) => `<td>${escapeHtml(String(row[h]))}</td>`).join('')}
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="viz-panel" style="margin-top:16px">
        <h3>Final output</h3>
        <div class="console">${escapeHtml(trace.output || '(no output)')}</div>
        <p class="muted" style="margin-top:8px">Computed by executing the loop with the parsed start, condition and update values.</p>
      </div>
    </div>
  `;

  renderVizControls({ stepped: false, note: `${trace.iterations} iterations` });
}
