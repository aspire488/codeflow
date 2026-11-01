// ============================================
// LOGIC ANALYZER SCREEN
// ============================================

const ANALYZER_LIMIT = 10000;

const ANALYZER_SAMPLES = {
  c: {
    label: 'C',
    language: 'c',
    code: `#include <stdio.h>

int main() {
    int x = 5;
    int y = 10;
    int sum = x + y;

    printf("Sum: %d\\n", sum);
    return 0;
}`
  },
  javascript: {
    label: 'JavaScript',
    language: 'javascript',
    code: `function total(items) {
  let sum = 0;
  for (const item of items) {
    if (item.price > 0) {
      sum += item.price;
    }
  }
  return sum;
}

console.log(total([{ price: 3 }, { price: 4 }]));`
  },
  css: {
    label: 'CSS',
    language: 'css',
    code: `.card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}

.card:hover {
  background: #1c2026;
}`
  }
};

let analyzerBound = false;

function updateAnalyzerCount() {
  const codeInput = document.getElementById('analyzer-code');
  const count = document.getElementById('analyzer-count');
  if (!codeInput || !count) return;
  count.textContent = codeInput.value.length.toLocaleString();
  count.parentElement.classList.toggle('is-near-limit', codeInput.value.length >= ANALYZER_LIMIT * 0.9);
}

// Shown before the first run: say what happens and offer examples instead of an empty panel.
function analyzerEmptyMarkup() {
  return `
    <div class="analyzer-empty">
      <p class="analyzer-empty-title">Results will appear here.</p>
      <p class="muted">Press Analyze code, or start from an example. Each example loads into the editor and runs.</p>
      <div class="button-row">
        ${Object.keys(ANALYZER_SAMPLES).map((key) => `<button class="stitch-btn secondary" data-analyzer-sample="${key}">${ANALYZER_SAMPLES[key].label} example</button>`).join('')}
      </div>
    </div>`;
}

function loadAnalyzerSample(key) {
  const sample = ANALYZER_SAMPLES[key];
  const codeInput = document.getElementById('analyzer-code');
  const languageSelect = document.getElementById('analyzer-language');
  if (!sample || !codeInput || !languageSelect) return;
  codeInput.value = sample.code;
  languageSelect.value = sample.language;
  updateAnalyzerCount();
  analyzeCode();
}

function renderLogicAnalyzer() {
  const codeInput = document.getElementById('analyzer-code');
  const languageSelect = document.getElementById('analyzer-language');
  const results = document.getElementById('analyzer-results');
  if (!codeInput || !languageSelect || !results) return;

  if (!codeInput.value.trim()) {
    codeInput.value = ANALYZER_SAMPLES.c.code;
    languageSelect.value = 'c';
    results.innerHTML = analyzerEmptyMarkup();
  } else if (!results.childElementCount) {
    results.innerHTML = analyzerEmptyMarkup();
  }
  updateAnalyzerCount();

  if (!analyzerBound) {
    analyzerBound = true;
    document.getElementById('analyze-btn')?.addEventListener('click', analyzeCode);
    codeInput.addEventListener('input', updateAnalyzerCount);
    codeInput.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') analyzeCode();
    });
    results.addEventListener('click', (event) => {
      const button = event.target.closest('[data-analyzer-sample]');
      if (button) loadAnalyzerSample(button.getAttribute('data-analyzer-sample'));
    });
  }
}

function analyzerFallbackHtml(message) {
  return `<div class="callout"><strong>Analyzer unavailable.</strong> ${escapeHtml(message)}</div>`;
}

function analyzeCode() {
  const codeInput = document.getElementById('analyzer-code');
  const languageSelect = document.getElementById('analyzer-language');
  const results = document.getElementById('analyzer-results');
  if (!codeInput || !languageSelect || !results) return;

  const code = codeInput.value;
  const language = languageSelect.value;

  if (!code.trim()) {
    results.innerHTML = '<div class="feedback bad"><strong>Nothing to analyze</strong>Paste some code first.</div>';
    return;
  }

  if (typeof analyzeCodeLogic !== 'function') {
    results.innerHTML = analyzerFallbackHtml('The analysis engine did not load.');
    return;
  }

  let analysis;
  try {
    analysis = analyzeCodeLogic(code, language);
  } catch (error) {
    console.error('[analyzer] failed:', error);
    results.innerHTML = '<div class="feedback bad"><strong>Analysis error</strong>The analyzer could not process this input.</div>';
    return;
  }

  if (!analysis) {
    results.innerHTML = analyzerFallbackHtml('No analysis was returned.');
    return;
  }

  if (analysis.error) {
    results.innerHTML = `<div class="feedback bad"><strong>Could not analyze</strong>${escapeHtml(analysis.error)}</div>`;
    return;
  }

  const nodes = Array.isArray(analysis.nodes) ? analysis.nodes : [];

  results.innerHTML = `
    <p class="analysis-summary"><span class="analysis-count">${nodes.length}</span> <span class="analysis-label">Logical nodes</span></p>
    <div id="analysis-body"></div>
  `;

  const body = document.getElementById('analysis-body');
  if (typeof renderLogicAnalysis === 'function') {
    renderLogicAnalysis(analysis, 'analysis-body');
  } else if (body) {
    body.innerHTML = '<p class="muted">Detailed rendering is unavailable.</p>';
  }
}
