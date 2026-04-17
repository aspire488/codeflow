// logicAnalyzerEngine.js - Multi-Language Logic Analyzer

function analyzeCodeLogic(code, language) {
  if (!code || typeof code !== 'string') {
    return { error: 'No code provided', nodes: [] };
  }
  
  if (code.length > 50000) {
    return { error: 'Code too long for analysis', nodes: [] };
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

function analyzeCLike(code) {
  const lines = code.split('\n');
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
    const line = lines[i].trim();
    if (!line || line.startsWith('//')) continue;
    
    if (line.match(/^(int|void|char|float|double|long|short)\s+\w+\s*\(/)) {
      const match = line.match(/^(int|void|char|float|double|long|short)\s+(\w+)/);
      functionName = match ? match[2] : 'function';
      inFunction = true;
      addNode('function', `Function: ${functionName}`, 'Declaration');
      continue;
    }
    
    if (line.includes('for(') || line.startsWith('for')) {
      inLoop = true;
      loopType = 'for';
      addNode('loop-start', 'For Loop', 'Iteration start');
      continue;
    }
    
    if (line.includes('while(') || line.startsWith('while')) {
      inLoop = true;
      loopType = 'while';
      addNode('loop-start', 'While Loop', 'Condition check');
      continue;
    }
    
    if (line.includes('if(') || line.startsWith('if')) {
      inCondition = true;
      conditionType = 'if';
      addNode('condition', 'If Statement', 'Branch check');
      continue;
    }
    
    if (line.includes('else if') || line.startsWith('else if')) {
      addNode('condition', 'Else If', 'Alternative branch');
      continue;
    }
    
    if (line.startsWith('else')) {
      addNode('condition', 'Else', 'Default branch');
      continue;
    }
    
    if (line.includes('printf(')) {
      const match = line.match(/printf\s*\(\s*"([^"]*)"/);
      const content = match ? match[1] : 'output';
      addNode('output', 'printf', content.substring(0, 30));
      continue;
    }
    
    if (line.includes('scanf(')) {
      addNode('input', 'scanf', 'User input');
      continue;
    }
    
    if (line.includes('return') && !line.includes('//')) {
      const match = line.match(/return\s*([^;]+)/);
      const value = match ? match[1].trim() : '';
      addNode('return', 'Return', value || 'value');
      continue;
    }
    
    if (line.includes('=') && !line.includes('==') && !line.includes('!=') && !line.includes('<=') && !line.includes('>=')) {
      const match = line.match(/(\w+)\s*=\s*([^;]+)/);
      if (match && !line.includes('==')) {
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
  
  const ruleRegex = /([^{}]+)\s*\{([^}]*)\}/g;
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
        addNode('property', key.trim(), valueParts.join(':').trim().substring(0, 30), '   ');
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

function renderLogicAnalysis(result, containerId = 'logicAnalysisContainer') {
  const container = document.getElementById(containerId);
  if (!container) return '<div class="text-error">Container not found</div>';
  
  if (result.error) {
    return `<div class="p-4 bg-error/20 rounded-lg text-error">${result.error}</div>`;
  }
  
  const langColors = {
    c: { bg: 'bg-primary-container', text: 'text-on-primary-container' },
    javascript: { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
    html: { bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
    css: { bg: 'bg-error-container', text: 'text-on-error-container' }
  };
  
  const nodeColors = {
    start: { bg: 'bg-tertiary/30', border: 'border-tertiary', icon: 'play_arrow' },
    end: { bg: 'bg-error/30', border: 'border-error', icon: 'stop' },
    function: { bg: 'bg-primary/30', border: 'border-primary', icon: 'functions' },
    'loop-start': { bg: 'bg-secondary/30', border: 'border-secondary', icon: 'loop' },
    condition: { bg: 'bg-tertiary/30', border: 'border-tertiary', icon: 'call_split' },
    output: { bg: 'bg-tertiary-container/30', border: 'border-tertiary-container', icon: 'output' },
    input: { bg: 'bg-surface-container-high/30', border: 'border-surface-container-high', icon: 'input' },
    return: { bg: 'bg-primary-container/30', border: 'border-primary-container', icon: 'reply' },
    assignment: { bg: 'bg-surface-container/30', border: 'border-surface-container', icon: 'arrow_forward' },
    operation: { bg: 'bg-surface-container-high/30', border: 'border-surface-container-high', icon: 'settings' },
    element: { bg: 'bg-secondary/30', border: 'border-secondary', icon: 'code' },
    rule: { bg: 'bg-error/30', border: 'border-error', icon: 'style' },
    property: { bg: 'bg-surface-container-low/30', border: 'border-surface-container-low', icon: 'tune' },
    dom: { bg: 'bg-primary/30', border: 'border-primary', icon: 'web' },
    event: { bg: 'bg-tertiary/30', border: 'border-tertiary', icon: 'touch_app' }
  };
  
  const lang = result.language || 'c';
  const colors = langColors[lang] || langColors.c;
  const isTree = result.tree;
  
  let html = `
    <div class="bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden">
      <div class="px-4 py-3 bg-surface-container-high border-b border-outline-variant/20 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">psychology</span>
          <span class="font-semibold text-on-surface">Logic Analysis</span>
        </div>
        <span class="px-2 py-1 rounded ${colors.bg} ${colors.text} text-xs font-bold uppercase">${lang}</span>
      </div>
      <div class="p-4 max-h-[500px] overflow-y-auto">
  `;
  
  if (isTree) {
    result.nodes.forEach(node => {
      const nodeColor = nodeColors[node.type] || nodeColors.operation;
      const indent = node.depth * 24;
      html += `
        <div class="flex items-center gap-2 py-1" style="padding-left: ${indent}px">
          <span class="material-symbols-outlined text-sm text-outline">chevron_right</span>
          <span class="px-2 py-1 rounded ${nodeColor.bg} border ${nodeColor.border} text-xs font-mono">${node.label}</span>
          ${node.detail ? `<span class="text-xs text-outline ml-2">${node.detail}</span>` : ''}
        </div>
      `;
    });
  } else {
    const cols = result.nodes.length > 6 ? Math.ceil(result.nodes.length / 3) : 3;
    html += `<div class="grid grid-cols-1 md:grid-cols-${Math.min(cols, 3)} gap-2">`;
    
    result.nodes.forEach(node => {
      const nodeColor = nodeColors[node.type] || nodeColors.operation;
      html += `
        <div class="flex items-center gap-2 p-2 rounded ${nodeColor.bg} border ${nodeColor.border}">
          <span class="material-symbols-outlined text-sm">${nodeColor.icon}</span>
          <div class="flex-1 min-w-0">
            <span class="text-xs font-bold block truncate">${node.label}</span>
            ${node.detail ? `<span class="text-[10px] text-outline block truncate">${node.detail}</span>` : ''}
          </div>
        </div>
      `;
    });
    html += '</div>';
  }
  
  html += `
      </div>
      <div class="px-4 py-2 bg-surface-container-low border-t border-outline-variant/20 text-xs text-outline">
        ${result.nodes.length} nodes detected
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  return html;
}

function analyzeAndRender(code, language, containerId) {
  if (!code) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '<div class="p-4 bg-error/20 rounded-lg text-error">No code provided to analyze</div>';
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