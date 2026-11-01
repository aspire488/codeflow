// ============================================
// LOGIC ANALYZER SCREEN
// ============================================

const ANALYZER_SAMPLE = `#include <stdio.h>

int main() {
    int x = 5;
    int y = 10;
    int sum = x + y;

    printf("Sum: %d\\n", sum);
    return 0;
}`;

let analyzerBound = false;

function renderLogicAnalyzer() {
  const codeInput = document.getElementById('analyzer-code');
  const languageSelect = document.getElementById('analyzer-language');
  const results = document.getElementById('analyzer-results');
  if (!codeInput || !languageSelect || !results) return;

  if (!codeInput.value.trim()) {
    codeInput.value = ANALYZER_SAMPLE;
  }

  if (!analyzerBound) {
    analyzerBound = true;
    document.getElementById('analyze-btn')?.addEventListener('click', analyzeCode);
    codeInput.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') analyzeCode();
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
  const issues = Array.isArray(analysis.issues) ? analysis.issues : [];

  results.innerHTML = `
    <div class="stat-grid" style="margin:0 0 12px">
      <div class="stat">
        <div class="stat-value" style="font-size:18px">${escapeHtml(analysis.complexity || 'n/a')}</div>
        <div class="stat-label">Complexity</div>
      </div>
      <div class="stat">
        <div class="stat-value" style="font-size:18px">${nodes.length}</div>
        <div class="stat-label">Logical nodes</div>
      </div>
      <div class="stat">
        <div class="stat-value" style="font-size:18px">${issues.length}</div>
        <div class="stat-label">Findings</div>
      </div>
    </div>
    <div id="analysis-body" class="viz-panel"></div>
  `;

  const body = document.getElementById('analysis-body');
  if (typeof renderLogicAnalysis === 'function') {
    renderLogicAnalysis(analysis, 'analysis-body');
  } else if (body) {
    body.innerHTML = '<p class="muted">Detailed rendering is unavailable, but the summary above was produced by the analyzer.</p>';
  }
}
