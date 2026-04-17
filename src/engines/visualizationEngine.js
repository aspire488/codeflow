// visualizationEngine.js - Execution simulator

let currentStepIndex = 0;
let currentExecutionSteps = [];
let currentVisualizationTopic = null;

function resetVisualization() {
  currentStepIndex = 0;
  currentExecutionSteps = [];
  currentVisualizationTopic = null;
}

// Global keyboard handler for visualization - prevents duplication
function handleVizKey(e) {
  const visualize = document.getElementById('visualize');
  if (!visualize || !visualize.classList.contains('active')) return;
  
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    if (currentStepIndex < currentExecutionSteps.length - 1) {
      currentStepIndex++;
      updateVisualization();
    }
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (currentStepIndex > 0) {
      currentStepIndex--;
      updateVisualization();
    }
  } else if (e.key === 'r' || e.key === 'R') {
    e.preventDefault();
    currentStepIndex = 0;
    updateVisualization();
  }
}

// Will be set to true after first visualization loads
let vizKeyListenerAdded = false;

function ensureVizKeyListener() {
  if (!vizKeyListenerAdded) {
    document.addEventListener('keydown', handleVizKey);
    vizKeyListenerAdded = true;
  }
}

function renderVisualization(topicKey) {
  // Reset before loading new visualization
  resetVisualization();
  
  const topic = TOPICS_DB[topicKey];
  if (!topic || !topic.visualizationSteps || topic.visualizationSteps.length === 0) {
    // Show mode selector even if no default visualization
    renderVisualizationModeSelector(topicKey);
    return;
  }

  // Show mode selector with current topic
  renderVisualizationModeSelector(topicKey, topic);
}

function renderVisualizationModeSelector(topicKey, topic = null) {
  const content = document.getElementById('visualizeContent');
  
  const pointerDemoCode = `int x = 10;
int *p = &x;
printf("%d", *p);`;
  const pointerVariables = [
    { name: 'x', type: 'int', value: '10' },
    { name: 'p', type: 'int*', value: '&x' }
  ];
  const pointerPointers = [
    { name: 'p', pointsTo: 'x' }
  ];
  
  const recursionCode = `int fact(int n) {
    if(n <= 1) return 1;
    return n * fact(n-1);
}
printf("%d", fact(3));`;
  const recursionSteps = [
    { call: 'fact(3)', description: 'n=3, calling fact(2)', output: '' },
    { call: 'fact(2)', description: 'n=2, calling fact(1)', output: '' },
    { call: 'fact(1)', description: 'n=1, base case returns 1', output: '1' },
    { call: 'fact(2)', description: 'Returns 2*1=2', output: '2' },
    { call: 'fact(3)', description: 'Returns 3*2=6', output: '6' }
  ];
  
  const loopCode = `for(int i=1; i<=3; i++) {
    printf("%d", i);
}`;
  const loopTrace = [
    { Iteration: '1', 'i': '1', Output: '1', Condition: 'i<=3 true' },
    { Iteration: '2', 'i': '2', Output: '12', Condition: 'i<=3 true' },
    { Iteration: '3', 'i': '3', Output: '123', Condition: 'i<=3 true' },
    { Iteration: '4', 'i': '-', Output: '123', Condition: 'i<=3 false, exit' }
  ];
  
  content.innerHTML = `
    <div class="col-span-12 mb-6">
      <h2 class="text-2xl font-bold text-on-surface mb-4 flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">code</span>
        Execution Visualizer
      </h2>
      <div class="flex gap-2 flex-wrap">
        <button onclick="renderBasicVisualization('${topicKey}')" class="px-4 py-2 bg-surface-container rounded-lg hover:bg-surface-container-high text-sm font-semibold flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">play_arrow</span>
          Step-by-Step
        </button>
        <button onclick="renderPointerVisualization(\`${escapeHtml(pointerDemoCode)}\`, ${JSON.stringify(pointerVariables)}, ${JSON.stringify(pointerPointers)})" class="px-4 py-2 bg-surface-container rounded-lg hover:bg-surface-container-high text-sm font-semibold flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">share</span>
          Pointer View
        </button>
        <button onclick="renderRecursionVisualization(\`${escapeHtml(recursionCode)}\`, 'fact', 'n <= 1 returns 1', ${JSON.stringify(recursionSteps)})" class="px-4 py-2 bg-surface-container rounded-lg hover:bg-surface-container-high text-sm font-semibold flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">layers</span>
          Recursion Stack
        </button>
        <button onclick="renderLoopTrace(\`${escapeHtml(loopCode)}\`, ${JSON.stringify(loopTrace)})" class="px-4 py-2 bg-surface-container rounded-lg hover:bg-surface-container-high text-sm font-semibold flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">table_chart</span>
          Loop Trace
        </button>
      </div>
    </div>
  `;
  
  if (topic) {
    // Also show basic visualization below
    renderBasicVisualization(topicKey);
  } else {
    document.getElementById('visualizeContent').innerHTML += `
      <div class="col-span-12 text-center py-12">
        <span class="material-symbols-outlined text-6xl text-outline mb-4">code</span>
        <h3 class="text-xl font-semibold text-on-surface mb-2">No Visualization Available</h3>
        <p class="text-on-surface-variant">Select a mode above to see visualizations.</p>
        <button onclick="navigateTo('lesson/${topicKey}')" class="mt-4 px-4 py-2 bg-primary text-on-primary rounded hover:brightness-110 transition-all">
          Back to Lesson
        </button>
      </div>
    `;
    document.getElementById('debugControls').innerHTML = '';
  }
}

function renderBasicVisualization(topicKey) {
  ensureVizKeyListener();
  resetVisualization();
  
  const topic = TOPICS_DB[topicKey];
  if (!topic || !topic.visualizationSteps || topic.visualizationSteps.length === 0) {
    document.getElementById('visualizeContent').innerHTML = `
      <div class="col-span-12 text-center py-12">
        <span class="material-symbols-outlined text-6xl text-outline mb-4">code</span>
        <h3 class="text-xl font-semibold text-on-surface mb-2">No Visualization Available</h3>
        <p class="text-on-surface-variant">This topic doesn't have step-by-step visualization yet.</p>
        <button onclick="navigateTo('lesson/${topicKey}')" class="mt-4 px-4 py-2 bg-primary text-on-primary rounded hover:brightness-110 transition-all">
          Back to Lesson
        </button>
      </div>
    `;
    document.getElementById('debugControls').innerHTML = '';
    return;
  }

  currentVisualizationTopic = topicKey;
  currentExecutionSteps = topic.visualizationSteps;
  currentStepIndex = 0;

  const content = document.getElementById('visualizeContent');
  content.innerHTML = `
    <div class="col-span-12 mb-4">
      <button onclick="renderVisualizationModeSelector('${topicKey}', TOPICS_DB['${topicKey}'])" class="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm">
        <span class="material-symbols-outlined">arrow_back</span>
        Back to Modes
      </button>
    </div>
    <div class="col-span-12 lg:col-span-7 flex flex-col gap-4">
      <div class="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/20 shadow-xl">
        <div class="flex items-center justify-between px-4 py-2 bg-surface-container-low border-b border-outline-variant/20">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-error/40"></span>
            <span class="w-3 h-3 rounded-full bg-tertiary/40"></span>
            <span class="w-3 h-3 rounded-full bg-primary/40"></span>
            <span class="ml-4 text-xs font-mono text-outline">${topicKey}.c</span>
          </div>
        </div>
        <div class="p-0 font-mono text-[0.8125rem] leading-6 overflow-x-auto" id="codeEditor">
          ${renderCodeLines(topic.code, currentStepIndex)}
        </div>
      </div>
      <div class="bg-surface-container rounded-lg p-5 border border-outline-variant/20 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
        <h3 class="text-primary font-semibold text-sm mb-2 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">info</span>
          CURRENT STEP: ${getStepDescription(currentStepIndex)}
        </h3>
        <p class="text-on-surface-variant text-sm leading-relaxed" id="stepDescription">
          ${currentExecutionSteps[currentStepIndex]?.output || 'Ready to start'}
        </p>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-5 flex flex-col gap-6">
      <section class="bg-surface-container rounded-lg border border-outline-variant/20 overflow-hidden flex flex-col">
        <div class="px-4 py-3 bg-surface-container-high border-b border-outline-variant/20 flex justify-between items-center">
          <h2 class="text-xs font-bold uppercase tracking-widest text-on-surface">Memory Stack</h2>
          <span class="text-[10px] font-mono text-tertiary">Live View</span>
        </div>
        <div class="p-0">
          <table class="w-full text-left text-sm font-mono border-collapse" id="memoryTable">
            <thead>
              <tr class="bg-surface-container-low text-outline text-[11px] uppercase">
                <th class="px-4 py-2 font-medium">Identifier</th>
                <th class="px-4 py-2 font-medium">Type</th>
                <th class="px-4 py-2 font-medium">Value</th>
                <th class="px-4 py-2 font-medium text-right">Address</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10" id="memoryBody">
              ${renderMemoryTable(currentStepIndex)}
            </tbody>
          </table>
        </div>
      </section>
      <section class="bg-surface-container-lowest rounded-lg border border-outline-variant/20 flex-1 min-h-[200px] flex flex-col shadow-inner">
        <div class="px-4 py-2 bg-[#1c2026] border-b border-outline-variant/20 flex items-center gap-2">
          <span class="material-symbols-outlined text-[14px] text-tertiary">terminal</span>
          <span class="text-[10px] font-mono text-outline uppercase tracking-tight">Output Console</span>
        </div>
        <div class="p-4 font-mono text-[0.8125rem] text-tertiary space-y-1" id="consoleOutput">
          <div class="flex gap-2">
            <span class="text-outline-variant">$</span>
            <span class="text-on-surface">gcc ${topicKey}.c -o main && ./main</span>
          </div>
          <div class="flex gap-2">
            <span class="text-outline-variant">&gt;</span>
            <span>Initializing execution environment...</span>
          </div>
          <div class="flex gap-2 animate-pulse" id="currentOutput">
            <span class="text-outline-variant">&gt;</span>
            <span class="bg-tertiary/20 px-1 rounded">Ready to execute</span>
          </div>
        </div>
      </section>
    </div>
  `;

  // Render debug controls
  const controls = document.getElementById('debugControls');
  controls.innerHTML = `
    <div class="hidden sm:flex items-center gap-4">
      <div class="flex flex-col">
        <span class="text-[10px] text-outline font-bold uppercase tracking-widest">Step</span>
        <span class="text-sm font-mono text-primary" id="stepCounter">01 / ${String(currentExecutionSteps.length).padStart(2, '0')}</span>
      </div>
      <div class="h-8 w-px bg-outline-variant/20 mx-2"></div>
      <div class="flex flex-col">
        <span class="text-[10px] text-outline font-bold uppercase tracking-widest">Speed</span>
        <span class="text-sm font-mono text-on-surface">1.0x</span>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button class="p-3 rounded-lg text-on-surface hover:bg-surface-container-high active:scale-95 transition-all group" id="resetBtn">
        <span class="material-symbols-outlined">restart_alt</span>
      </button>
      <button class="p-3 rounded-lg text-on-surface hover:bg-surface-container-high active:scale-95 transition-all group" id="prevBtn">
        <span class="material-symbols-outlined">skip_previous</span>
      </button>
      <button class="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20" id="nextBtn">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
        <span class="text-sm uppercase tracking-widest">Next Step</span>
      </button>
      <button class="p-3 rounded-lg text-on-surface hover:bg-surface-container-high active:scale-95 transition-all group" id="fastBtn">
        <span class="material-symbols-outlined">skip_next</span>
      </button>
    </div>
  `;

  // Add event listeners
  document.getElementById('resetBtn').addEventListener('click', () => {
    currentStepIndex = 0;
    updateVisualization();
  });

  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentStepIndex > 0) {
      currentStepIndex--;
      updateVisualization();
    }
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentStepIndex < currentExecutionSteps.length - 1) {
      currentStepIndex++;
      updateVisualization();
    }
  });

  document.getElementById('fastBtn').addEventListener('click', () => {
    currentStepIndex = currentExecutionSteps.length - 1;
    updateVisualization();
  });

  updateVisualization();
}

function updateVisualization() {
  if (!currentVisualizationTopic || !currentExecutionSteps || currentExecutionSteps.length === 0) {
    return;
  }
  
  // Clamp step index to valid range
  currentStepIndex = Math.max(0, Math.min(currentStepIndex, currentExecutionSteps.length - 1));
  
  const topic = TOPICS_DB[currentVisualizationTopic];
  
  // Update code highlighting
  const codeEditor = document.getElementById('codeEditor');
  if (codeEditor && topic && topic.code) {
    codeEditor.innerHTML = renderCodeLines(topic.code, currentStepIndex);
  }

  // Update step description
  const stepDesc = document.getElementById('stepDescription');
  if (stepDesc) {
    stepDesc.textContent = currentExecutionSteps[currentStepIndex]?.output || 'Execution complete';
  }

  // Update memory table
  const memBody = document.getElementById('memoryBody');
  if (memBody) {
    memBody.innerHTML = renderMemoryTable(currentStepIndex);
  }

  // Update console
  const curOutput = document.getElementById('currentOutput');
  if (curOutput) {
    const output = currentExecutionSteps[currentStepIndex]?.output || 'Program finished';
    curOutput.innerHTML = `
      <span class="text-outline-variant">&gt;</span>
      <span class="bg-tertiary/20 px-1 rounded">${output}</span>
    `;

  // Update step counter
  document.getElementById('stepCounter').textContent = `${String(currentStepIndex + 1).padStart(2, '0')} / ${String(currentExecutionSteps.length).padStart(2, '0')}`;

  // Update button states
  document.getElementById('prevBtn').disabled = currentStepIndex === 0;
  document.getElementById('nextBtn').disabled = currentStepIndex === currentExecutionSteps.length - 1;
}

function renderCodeLines(code, activeLine) {
  const lines = code.split('\n');
  return lines.map((line, i) => `
    <div class="flex group ${i === activeLine ? 'code-line-active' : ''}">
      <div class="w-12 text-right pr-4 text-outline-variant/50 select-none bg-surface-container-low/30">${i + 1}</div>
      <div class="flex-1 px-4">${highlightCode(line)}</div>
    </div>
  `).join('');
}

function renderMemoryTable(stepIndex) {
  const step = currentExecutionSteps[stepIndex];
  if (!step || !step.variables) return '<tr><td colspan="4" class="px-4 py-3 text-center text-outline">No variables in memory</td></tr>';

  return Object.entries(step.variables).map(([name, value]) => `
    <tr class="hover:bg-surface-container-high transition-colors">
      <td class="px-4 py-3 text-primary font-semibold">${name}</td>
      <td class="px-4 py-3 text-[#d19a66]">${value.split(' ')[1]?.replace(/[()]/g, '') || 'unknown'}</td>
      <td class="px-4 py-3 text-on-surface font-bold">${value.split(' ')[0]}</td>
      <td class="px-4 py-3 text-outline-variant text-[11px] text-right">0x${Math.floor(Math.random() * 100000).toString(16)}</td>
    </tr>
  `).join('');
}

function getStepDescription(index) {
  const descriptions = [
    'INITIALIZING PROGRAM',
    'ALLOCATING VARIABLES',
    'EXECUTING STATEMENTS',
    'OUTPUTTING RESULTS',
    'CLEANING UP'
  ];
  return descriptions[index] || 'EXECUTING';
}

// ============================================
// ENHANCED VISUALIZATION FEATURES
// ============================================

// POINTER VISUALIZATION
let pointerVisualizationData = null;

function renderPointerVisualization(code, variables, pointers) {
  pointerVisualizationData = { variables, pointers, step: 0 };
  
  const container = document.getElementById('visualizeContent');
  container.innerHTML = `
    <div class="col-span-12 lg:col-span-5 flex flex-col gap-4">
      <div class="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/20 shadow-xl">
        <div class="flex items-center justify-between px-4 py-2 bg-surface-container-low border-b border-outline-variant/20">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-error/40"></span>
            <span class="w-3 h-3 rounded-full bg-tertiary/40"></span>
            <span class="ml-4 text-xs font-mono text-outline">pointer_demo.c</span>
          </div>
        </div>
        <pre class="p-4 font-mono text-sm text-on-surface">${escapeHtml(code)}</pre>
      </div>
      <div class="bg-surface-container rounded-lg p-4 border border-outline-variant/20">
        <h3 class="text-sm font-bold text-outline uppercase tracking-wider mb-3">Memory & Pointers</h3>
        <div id="pointerMemoryDisplay"></div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-7 flex flex-col gap-4">
      <div class="bg-surface-container rounded-lg p-6 border border-outline-variant/20">
        <h3 class="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">share</span>
          Pointer Visualization
        </h3>
        <div id="pointerDiagram" class="space-y-6"></div>
      </div>
      <div class="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant/20">
        <h3 class="text-sm font-bold text-outline uppercase mb-2">Control</h3>
        <div class="flex gap-2">
          <button onclick="updatePointerStep(-1)" class="px-3 py-2 bg-surface-container text-on-surface rounded hover:bg-surface-container-high">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button onclick="updatePointerStep(1)" class="px-3 py-2 bg-primary text-on-primary rounded hover:brightness-110">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
          <span id="pointerStepInfo" class="px-4 py-2 text-on-surface font-mono">Step 1 / ${pointers.length + 1}</span>
        </div>
      </div>
    </div>
  `;
  
  updatePointerVisualization(0);
}

function updatePointerVisualization(step) {
  if (!pointerVisualizationData) return;
  
  const element = document.getElementById('pointerStepInfo');
  if (!element) return;
  
  const { variables, pointers } = pointerVisualizationData;
  const maxStep = pointers.length;
  step = Math.max(0, Math.min(step, maxStep));
  pointerVisualizationData.step = step;
  
  element.textContent = `Step ${step + 1} / ${maxStep + 1}`;
  
  // Render memory display
  const memoryEl = document.getElementById('pointerMemoryDisplay');
  if (!memoryEl) return;
  
  const memoryHtml = variables.map((v, i) => `
    <div class="flex items-center justify-between p-2 ${i <= step ? 'bg-surface-container-high' : 'bg-surface-container-low opacity-50'} rounded">
      <div>
        <span class="font-mono text-primary font-bold">${v.name}</span>
        <span class="text-outline text-xs ml-2">${v.type}</span>
      </div>
      <div class="font-mono text-on-surface">${v.value}</div>
    </div>
  `).join('');
  
  memoryEl.innerHTML = memoryHtml;
  
  // Render pointer diagram
  const diagramEl = document.getElementById('pointerDiagram');
  if (!diagramEl) return;
  
  let diagramHtml = '';
  
  // Show variable boxes
  variables.forEach((v, i) => {
    const isActive = i <= step;
    diagramHtml += `
      <div class="flex items-center gap-4">
        <div class="w-24 p-3 rounded-lg border-2 ${isActive ? 'border-primary bg-primary-container/20' : 'border-outline-variant/30 bg-surface-container'} text-center">
          <div class="font-mono text-primary font-bold">${v.name}</div>
          <div class="text-xs text-outline">${v.value}</div>
        </div>
        ${pointers.filter(p => p.pointsTo === v.name && pointers.indexOf(p) <= step).map(p => `
          <div class="flex items-center gap-2">
            <span class="text-tertiary font-bold">${p.name}</span>
            <span class="text-outline">→</span>
            <div class="w-20 p-2 rounded border border-tertiary bg-tertiary/10 text-center">
              <span class="text-xs text-tertiary">${p.name}</span>
              <span class="block text-xs text-outline">→ ${v.name}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  });
  
  diagramEl.innerHTML = diagramHtml || '<p class="text-outline">Click next to see pointer operations</p>';
}

function updatePointerStep(delta) {
  if (!pointerVisualizationData) return;
  const { pointers } = pointerVisualizationData;
  const newStep = pointerVisualizationData.step + delta;
  if (newStep >= 0 && newStep <= pointers.length) {
    updatePointerVisualization(newStep);
  }
}

// RECURSION STACK VISUALIZATION
let recursionData = null;
let recursionCurrentCall = 0;

function renderRecursionVisualization(code, functionName, baseCase, steps) {
  recursionData = { code, functionName, baseCase, steps };
  recursionCurrentCall = 0;
  
  const container = document.getElementById('visualizeContent');
  container.innerHTML = `
    <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
      <div class="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/20 shadow-xl">
        <div class="flex items-center justify-between px-4 py-2 bg-surface-container-low border-b border-outline-variant/20">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-tertiary/40"></span>
            <span class="ml-4 text-xs font-mono text-outline">recursion.c</span>
          </div>
        </div>
        <pre class="p-4 font-mono text-sm text-on-surface">${escapeHtml(code)}</pre>
      </div>
      <div class="bg-surface-container rounded-lg p-4 border border-outline-variant/20">
        <h3 class="text-sm font-bold text-outline uppercase mb-2">Base Case</h3>
        <p class="text-on-surface-variant text-sm">${baseCase}</p>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
      <div class="bg-surface-container rounded-lg p-6 border border-outline-variant/20">
        <h3 class="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-tertiary">layers</span>
          Call Stack
        </h3>
        <div id="recursionStack" class="space-y-2"></div>
      </div>
      <div class="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant/20">
        <h3 class="text-sm font-bold text-outline uppercase mb-2">Execution Control</h3>
        <div class="flex gap-2">
          <button onclick="updateRecursionStep(-1)" class="p-2 bg-surface-container text-on-surface rounded hover:bg-surface-container-high">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button onclick="updateRecursionStep(1)" class="p-2 bg-primary text-on-primary rounded hover:brightness-110">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
          <span id="recursionStepInfo" class="px-4 py-2 text-on-surface font-mono">Call 1 / ${steps.length}</span>
        </div>
        <div id="recursionOutput" class="mt-4 p-3 bg-surface-container rounded font-mono text-sm text-tertiary"></div>
      </div>
    </div>
  `;
  
  updateRecursionVisualization(0);
}

function updateRecursionVisualization(step) {
  if (!recursionData) return;
  
  const stepEl = document.getElementById('recursionStepInfo');
  const stackEl = document.getElementById('recursionStack');
  const outputEl = document.getElementById('recursionOutput');
  
  if (!stepEl || !stackEl || !outputEl) return;
  
  const { steps } = recursionData;
  step = Math.max(0, Math.min(step, steps.length - 1));
  recursionCurrentCall = step;
  
  stepEl.textContent = `Call ${step + 1} / ${steps.length}`;
  
  // Render stack (showing calls from first to current)
  let stackHtml = '';
  const displaySteps = steps.slice(0, step + 1);
  
  displaySteps.forEach((s, i) => {
    const isCurrent = i === step;
    const isReturning = step > 0 && i < step;
    
    stackHtml += `
      <div class="p-3 rounded-lg border-l-4 ${isCurrent ? 'border-primary bg-primary-container/20' : isReturning ? 'border-tertiary bg-tertiary/10' : 'border-outline-variant bg-surface-container'}">
        <div class="flex items-center justify-between">
          <span class="font-mono font-bold ${isCurrent ? 'text-primary' : 'text-on-surface'}">${s.call}</span>
          ${isCurrent ? '<span class="text-xs text-primary px-2 py-0.5 bg-primary/20 rounded">EXECUTING</span>' : ''}
          ${isReturning ? '<span class="text-xs text-tertiary px-2 py-0.5 bg-tertiary/20 rounded">RETURNED</span>' : ''}
        </div>
        <div class="text-sm text-on-surface-variant mt-1">${s.description}</div>
        ${s.returnValue ? `<div class="text-sm text-tertiary mt-1 font-mono">→ ${s.returnValue}</div>` : ''}
      </div>
    `;
  });
  
  document.getElementById('recursionStack').innerHTML = stackHtml;
  
  // Show output at current step
  const output = steps.slice(0, step + 1).map(s => s.output).filter(Boolean).join(' → ');
  document.getElementById('recursionOutput').innerHTML = output ? `Output: ${output}` : 'No output yet';
}

function updateRecursionStep(delta) {
  if (!recursionData) return;
  const newStep = recursionCurrentCall + delta;
  if (newStep >= 0 && newStep < recursionData.steps.length) {
    updateRecursionVisualization(newStep);
  }
}

// LOOP TRACE MODE
let loopTraceData = null;
let loopCurrentIteration = 0;

function renderLoopTrace(code, traceData) {
  loopTraceData = { code, trace: traceData };
  loopCurrentIteration = 0;
  
  const container = document.getElementById('visualizeContent');
  container.innerHTML = `
    <div class="col-span-12 lg:col-span-5 flex flex-col gap-4">
      <div class="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/20 shadow-xl">
        <div class="flex items-center justify-between px-4 py-2 bg-surface-container-low border-b border-outline-variant/20">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-error/40"></span>
            <span class="ml-4 text-xs font-mono text-outline">loop_trace.c</span>
          </div>
        </div>
        <pre class="p-4 font-mono text-sm text-on-surface">${escapeHtml(code)}</pre>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-7 flex flex-col gap-4">
      <div class="bg-surface-container rounded-lg p-6 border border-outline-variant/20">
        <h3 class="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">table_chart</span>
          Loop Trace Table
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-surface-container-high text-outline text-xs uppercase">
                ${Object.keys(traceData[0] || {}).map(h => `<th class="px-4 py-2 text-left">${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody id="loopTraceTable"></tbody>
          </table>
        </div>
      </div>
      <div class="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant/20">
        <h3 class="text-sm font-bold text-outline uppercase mb-2">Iteration Control</h3>
        <div class="flex items-center gap-4">
          <button onclick="updateLoopIteration(loopCurrentIteration - 1)" class="p-2 bg-surface-container text-on-surface rounded hover:bg-surface-container-high">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <div class="flex-1">
            <input type="range" min="0" max="${traceData.length - 1}" value="0" 
              class="w-full" oninput="updateLoopIteration(this.valueAsNumber)">
          </div>
          <button onclick="updateLoopIteration(loopCurrentIteration + 1)" class="p-2 bg-primary text-on-primary rounded hover:brightness-110">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <div id="loopIterationInfo" class="mt-2 text-center text-on-surface font-mono text-sm">
          Iteration 1 / ${traceData.length}
        </div>
      </div>
    </div>
  `;
  
  updateLoopVisualization(0);
}

function updateLoopVisualization(iteration) {
  if (!loopTraceData) return;
  
  const iterInfoEl = document.getElementById('loopIterationInfo');
  const tableEl = document.getElementById('loopTraceTable');
  
  if (!iterInfoEl || !tableEl) return;
  
  const { trace } = loopTraceData;
  iteration = Math.max(0, Math.min(iteration, trace.length - 1));
  loopCurrentIteration = iteration;
  
  iterInfoEl.textContent = `Iteration ${iteration + 1} / ${trace.length}`;
  
  const tableHtml = trace.map((row, i) => `
    <tr class="${i === iteration ? 'bg-primary-container/20' : i < iteration ? 'bg-tertiary/10' : ''} hover:bg-surface-container-high transition-colors">
      ${Object.values(row).map(v => `<td class="px-4 py-2 text-on-surface font-mono">${v}</td>`).join('')}
    </tr>
  `).join('');
  
  tableEl.innerHTML = tableHtml;
}

function updateLoopIteration(index) {
  if (!loopTraceData) return;
  if (index >= 0 && index < loopTraceData.trace.length) {
    loopCurrentIteration = index;
    updateLoopVisualization(index);
  }
}

// Helper function for code highlighting
function highlightCode(line) {
  const keywords = /\b(int|float|char|void|if|else|for|while|return|break|continue|switch|case|default|struct|sizeof|printf|scanf)\b/g;
  const strings = /"[^"]*"|'[^']*'/g;
  const comments = /\/\/.*$|\/\*[\s\S]*?\*\//g;
  
  let result = line;
  result = result.replace(comments, '<span class="hl-comment">$&</span>');
  result = result.replace(strings, '<span class="hl-string">$&</span>');
  result = result.replace(keywords, '<span class="hl-keyword">$&</span>');
  
  return result;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderVisualization,
    renderPointerVisualization,
    renderRecursionVisualization,
    renderLoopTrace
  };
}