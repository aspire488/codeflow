// ============================================
// LOGIC RENDERER - Logic Analyzer UI
// ============================================

function renderLogicAnalyzer() {
    const codeInput = document.getElementById('analyzer-code');
    const languageSelect = document.getElementById('analyzer-language');
    const results = document.getElementById('analyzer-results');

    if (!codeInput || !languageSelect || !results) return;

    // Clear inputs and show welcome
    codeInput.value = `#include <stdio.h>

int main() {
    int x = 5;
    int y = 10;
    int sum = x + y;

    printf("Sum: %d\\n", sum);
    return 0;
}`;

    languageSelect.value = 'c';

    results.innerHTML = `
        <div class="text-center text-gray-400 py-4">
            <span class="material-symbols-outlined text-2xl mb-2">analytics</span>
            <p>Paste your code above and click "Analyze Code"</p>
        </div>
    `;

    // If logic analyzer engine exists, initialize it
    if (typeof LogicAnalyzer !== 'undefined' && LogicAnalyzer.init) {
        LogicAnalyzer.init();
    }
}