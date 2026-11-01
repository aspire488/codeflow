// logicAnalyzerEngine.js - Multi-Language Logic Analyzer

// Several scanners below are quadratic in input length; keep the cap low enough to stay under ~1s.
const ANALYZER_MAX_CHARS = 10000;

function analyzeCodeLogic(code, language) {
  if (!code || typeof code !== 'string') {
    return { error: 'No code provided', nodes: [] };
  }
  
  if (code.length > ANALYZER_MAX_CHARS) {
    return { error: `Code is too long to analyze (${code.length.toLocaleString()} characters). The limit is ${ANALYZER_MAX_CHARS.toLocaleString()}; paste a smaller excerpt.`, nodes: [] };
  }
  
  language = (language || 'c').toLowerCase();
  
  try {
    switch (language) {
      case 'c':
      case 'cpp':
        return analyzeCLike(code);
      case 'javascript':
      case 'js':
        return analyzeJavaScript(code);
      case 'html':
        return analyzeHTML(code);
      case 'css':
        return analyzeCSS(code);
      default:
        return analyzeCLike(code);
    }
  } catch (e) {
    return { error: 'Analysis failed: ' + e.message, nodes: [] };
  }
}

// Blank out comments and string/char contents (same length, newlines kept) so
// keyword matching cannot fire on text that is not code.
function maskCSource(code) {
  let out = '';
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    const next = code[i + 1];
    if (ch === '/' && next === '/') {
      while (i < code.length && code[i] !== '\n') { out += ' '; i++; }
      i--;
    } else if (ch === '/' && next === '*') {
      out += '  '; i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) { out += code[i] === '\n' ? '\n' : ' '; i++; }
      if (i < code.length) { out += '  '; i++; }
    } else if (ch === '"' || ch === "'") {
      out += ch; i++;
      while (i < code.length && code[i] !== ch && code[i] !== '\n') {
        if (code[i] === '\\' && i + 1 < code.length && code[i + 1] !== '\n') { out += '  '; i += 2; } else { out += ' '; i++; }
      }
      if (i < code.length && code[i] === ch) out += ch; else if (i < code.length) out += '\n';
    } else {
      out += ch;
    }
  }
  return out;
}

function analyzeCLike(code) {
  const lines = code.split('\n');
  const masked = maskCSource(code).split('\n');
  const nodes = [];
  let nodeId = 0;
  
  const addNode = (type, label, detail = '') => {
    nodes.push({ id: nodeId++, type, label, detail });
  };
  
  addNode('start', 'Program Start', 'Entry point');
  
  let inFunction = false;
  let functionName = '';
  let braceCount = 0;
  let inLoop = false;
  let loopType = '';
  let inCondition = false;
  let conditionType = '';
  
  for (let i = 0; i < lines.length; i++) {
    const original = lines[i].trim();
    const line = (masked[i] || '').trim();
    if (!line) continue;
    
    if (line.match(/^(int|void|char|float|double|long|short)\s+\w+\s*\(/)) {
      const match = line.match(/^(int|void|char|float|double|long|short)\s+(\w+)/);
      functionName = match ? match[2] : 'function';
      inFunction = true;
      addNode('function', `Function: ${functionName}`, 'Declaration');
      continue;
    }
    
    if (/^(\}\s*)?for\s*\(/.test(line)) {
      inLoop = true;
      loopType = 'for';
      addNode('loop-start', 'For Loop', 'Iteration start');
      continue;
    }
    
    if (/^(\}\s*)?while\s*\(/.test(line)) {
      inLoop = true;
      loopType = 'while';
      addNode('loop-start', 'While Loop', 'Condition check');
      continue;
    }
    
    if (/^(\}\s*)?else\s+if\b/.test(line)) {
      addNode('condition', 'Else If', 'Alternative branch');
      continue;
    }
    
    if (/^(\}\s*)?if\s*\(/.test(line)) {
      inCondition = true;
      conditionType = 'if';
      addNode('condition', 'If Statement', 'Branch check');
      continue;
    }
    
    if (/^(\}\s*)?else\b/.test(line)) {
      addNode('condition', 'Else', 'Default branch');
      continue;
    }
    
    if (/\bprintf\s*\(/.test(line)) {
      const match = original.match(/printf\s*\(\s*"([^"]*)"/);
      const content = match ? match[1] : 'output';
      addNode('output', 'printf', content.substring(0, 30));
      continue;
    }
    
    if (/\bscanf\s*\(/.test(line)) {
      addNode('input', 'scanf', 'User input');
      continue;
    }
    
    if (/\breturn\b/.test(line)) {
      const match = original.match(/return\s*([^;]+)/);
      const value = match ? match[1].trim() : '';
      addNode('return', 'Return', value || 'value');
      continue;
    }
    
    if (line.includes('=') && !line.includes('==') && !line.includes('!=') && !line.includes('<=') && !line.includes('>=')) {
      const match = original.match(/(\w+)\s*=\s*([^;]+)/);
      if (match) {
        addNode('assignment', `${match[1]} =`, match[2].trim().substring(0, 20));
      }
      continue;
    }
    
    braceCount += (line.match(/{/g) || []).length;
    braceCount -= (line.match(/}/g) || []).length;
    
    if (braceCount === 0 && inFunction) {
      inFunction = false;
      inLoop = false;
      inCondition = false;
    }
  }
  
  if (nodes.length === 1) {
    addNode('operation', 'Operations', 'Code operations');
  }
  
  addNode('end', 'Program End', 'Termination');
  
  return {
    language: 'c',
    nodes,
    connections: generateConnections(nodes)
  };
}

function analyzeJavaScript(code) {
  const lines = code.split('\n');
  const nodes = [];
  let nodeId = 0;
  
  const addNode = (type, label, detail = '') => {
    nodes.push({ id: nodeId++, type, label, detail });
  };
  
  addNode('start', 'Script Start', 'Entry point');
  
  let inFunction = false;
  let functionName = '';
  let inLoop = false;
  let inCondition = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('//') || line.startsWith('/*')) continue;
    
    if (line.match(/^function\s+\w+/) || line.match(/^\w+\s*=\s*function/) || line.match(/^const\s+\w+\s*=\s*\(/)) {
      const match = line.match(/function\s+(\w+)/) || line.match(/^(\w+)\s*=/);
      functionName = match ? match[1] : 'anonymous';
      inFunction = true;
      addNode('function', `Function: ${functionName}`, 'Function definition');
      continue;
    }
    
    if (line.match(/^const\s+\w+\s*=\s*\(?\s*async/)) {
      const match = line.match(/const\s+(\w+)/);
      functionName = match ? match[1] : 'async';
      addNode('function', `Async: ${functionName}`, 'Async function');
      continue;
    }
    
    if (line.includes('for(') || line.startsWith('for') || line.includes('.forEach') || line.includes('.map')) {
      inLoop = true;
      addNode('loop-start', 'Loop', 'Iteration');
      continue;
    }
    
    if (line.includes('while(') || line.startsWith('while')) {
      inLoop = true;
      addNode('loop-start', 'While Loop', 'Condition loop');
      continue;
    }
    
    if (line.includes('if(') || line.startsWith('if')) {
      inCondition = true;
      addNode('condition', 'If Statement', 'Branch');
      continue;
    }
    
    if (line.includes('console.log')) {
      const match = line.match(/console\.log\s*\(\s*(.+?)\s*\)/);
      const content = match ? match[1].trim() : 'output';
      addNode('output', 'console.log', content.substring(0, 25));
      continue;
    }
    
    if (line.includes('alert')) {
      addNode('output', 'alert', 'User notification');
      continue;
    }
    
    if (line.includes('return') && !line.includes('//')) {
      const match = line.match(/return\s*([^;]+)/);
      const value = match ? match[1].trim() : '';
      addNode('return', 'Return', value || 'value');
      continue;
    }
    
    if (line.includes('const ') || line.includes('let ') || line.includes('var ')) {
      const match = line.match(/(const|let|var)\s+(\w+)/);
      if (match) {
        addNode('assignment', `${match[2]}`, 'Variable declaration');
      }
      continue;
    }
    
    if (line.includes('=>')) {
      addNode('function', 'Arrow Function', 'ES6 arrow');
      continue;
    }
    
    if (line.includes('document.getElementById') || line.includes('document.querySelector')) {
      addNode('dom', 'DOM Access', 'Element selection');
      continue;
    }
    
    if (line.includes('addEventListener')) {
      addNode('event', 'Event Listener', 'Event binding');
      continue;
    }
  }
  
  if (nodes.length === 1) {
    addNode('operation', 'Operations', 'JavaScript operations');
  }
  
  addNode('end', 'Script End', 'Completion');
  
  return {
    language: 'javascript',
    nodes,
    connections: generateConnections(nodes)
  };
}

function analyzeHTML(code) {
  const nodes = [];
  let nodeId = 0;
  
  const addNode = (type, label, detail = '', depth = 0) => {
    nodes.push({ id: nodeId++, type, label, detail, depth });
  };
  
  addNode('root', 'HTML Document', 'Root element', 0);
  
  const tagRegex = /<(\/?)(\w+)[^>]*>/g;
  let match;
  const stack = [];
  
  while ((match = tagRegex.exec(code)) !== null) {
    const [, closing, tagName] = match;
    const cleanTag = tagName.toLowerCase();
    
    if (['!DOCTYPE', 'html', 'head', 'body', 'script', 'style'].includes(cleanTag)) {
      continue;
    }
    
    if (cleanTag === 'meta' || cleanTag === 'link' || cleanTag === 'br' || cleanTag === 'img' || cleanTag === 'input' || cleanTag === 'hr') {
      addNode('element', `<${cleanTag}>`, 'Self-closing', stack.length);
      continue;
    }
    
    if (closing) {
      if (stack.length > 0 && stack[stack.length - 1] === cleanTag) {
        stack.pop();
      }
    } else {
      stack.push(cleanTag);
      addNode('element', `<${cleanTag}>`, `Line ${code.substring(0, match.index).split('\n').length}`, stack.length);
    }
  }
  
  if (nodes.length <= 1) {
    const lines = code.split('\n').filter(l => l.trim().startsWith('<'));
    lines.forEach((line, i) => {
      const match = line.match(/<(\w+)/);
      if (match) {
        addNode('element', `<${match[1]}>`, `Line ${i + 1}`, 1);
      }
    });
  }
  
  return {
    language: 'html',
    nodes,
    tree: true,
    connections: generateTreeConnections(nodes)
  };
}

function analyzeCSS(code) {
  const nodes = [];
  let nodeId = 0;
  
  const addNode = (type, label, detail = '') => {
    nodes.push({ id: nodeId++, type, label, detail });
  };
  
  addNode('start', 'CSS Rules', 'Stylesheet');
  
  const ruleRegex = /([^{}]+)\{([^}]*)\}/g;
  let match;
  
  while ((match = ruleRegex.exec(code)) !== null) {
    const selector = match[1].trim();
    const properties = match[2].trim();
    
    if (selector.startsWith('@') || !selector) continue;
    
    addNode('rule', selector, 'CSS Selector');
    
    const propLines = properties.split(';').filter(p => p.trim());
    propLines.forEach(prop => {
      const [key, ...valueParts] = prop.split(':');
      if (key && valueParts.length > 0) {
        addNode('property', key.trim(), valueParts.join(':').trim().substring(0, 30), 1);
      }
    });
  }
  
  if (nodes.length === 1) {
    const lines = code.split('\n').filter(l => l.includes(':'));
    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        if (key) {
          addNode('property', key, value.substring(0, 40));
        }
      }
    });
  }
  
  addNode('end', 'End of Styles', 'Complete');
  
  return {
    language: 'css',
    nodes,
    connections: generateConnections(nodes)
  };
}

function generateConnections(nodes) {
  const connections = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    connections.push({ from: nodes[i].id, to: nodes[i + 1].id });
  }
  return connections;
}

function generateTreeConnections(nodes) {
  const connections = [];
  const depthStack = [];
  
  nodes.forEach(node => {
    if (node.type === 'root') {
      depthStack[0] = node.id;
      return;
    }
    
    const parentDepth = node.depth - 1;
    while (depthStack.length > parentDepth + 1) {
      depthStack.pop();
    }
    
    if (depthStack[parentDepth] !== undefined) {
      connections.push({ from: depthStack[parentDepth], to: node.id });
    }
    
    depthStack[node.depth] = node.id;
  });
  
  return connections;
}

// Node kinds map to a Material Symbol and a short plain-language kind label.
const ANALYZER_KINDS = {
  start: ['play_arrow', 'start'], end: ['stop', 'end'], function: ['functions', 'function'],
  'loop-start': ['loop', 'repeats'], condition: ['call_split', 'decision'], output: ['output', 'output'],
  input: ['input', 'input'], return: ['reply', 'return'], assignment: ['arrow_forward', 'assignment'],
  operation: ['settings', 'operation'], element: ['code', 'element'], rule: ['style', 'rule'],
  property: ['tune', 'property'], dom: ['web', 'DOM'], event: ['touch_app', 'event'], root: ['account_tree', 'root']
};

// Indented structure tree. Indentation uses the depth the engine reports (HTML elements, CSS properties);
// C and JavaScript results are flat because those scanners do not report nesting.
function renderLogicAnalysis(result, containerId = 'logicAnalysisContainer') {
  const container = document.getElementById(containerId);
  if (!container) return '<div class="feedback bad">Container not found</div>';

  if (result.error) {
    const html = `<div class="feedback bad"><strong>Could not analyze</strong>${escapeHtml(result.error)}</div>`;
    container.innerHTML = html;
    return html;
  }

  const items = result.nodes.map((node) => {
    const [icon, kind] = ANALYZER_KINDS[node.type] || ANALYZER_KINDS.operation;
    const depth = Number.isFinite(node.depth) ? Math.max(0, Math.min(node.depth, 8)) : 0;
    return `<li class="atree-node" style="--d:${depth}">
      <span aria-hidden="true" class="material-symbols-outlined atree-icon">${icon}</span>
      <span class="atree-label">${escapeHtml(node.label)}</span>
      <span class="atree-kind">${escapeHtml(kind)}</span>
      ${node.detail ? `<span class="atree-detail">${escapeHtml(node.detail)}</span>` : ''}
    </li>`;
  }).join('');

  const html = `<ul class="atree" aria-label="Code structure">${items}</ul>`;
  container.innerHTML = html;
  return html;
}

function analyzeAndRender(code, language, containerId) {
  if (!code) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '<div class="feedback bad"><strong>Nothing to analyze</strong>Paste some code first.</div>';
    }
    return;
  }
  
  const result = analyzeCodeLogic(code, language);
  return renderLogicAnalysis(result, containerId);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeCodeLogic,
    renderLogicAnalysis,
    analyzeAndRender
  };
}