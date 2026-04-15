// ============================================
// VISUALIZATION RENDERER - Code Execution UI
// ============================================

function renderVisualization(topicId) {
    const content = document.getElementById('visualization-content');
    if (!content) return;

    // Clear existing content
    content.innerHTML = '';

    // Get visualization data
    let vizData = null;
    if (typeof OUTPUT_PREDICTION_DB !== 'undefined' && OUTPUT_PREDICTION_DB.problems) {
        vizData = OUTPUT_PREDICTION_DB.problems.find(p => p.topicId === topicId);
    }

    if (!vizData) {
        // Fallback visualization
        vizData = {
            title: 'Code Visualization',
            code: `#include <stdio.h>

int main() {
    int x = 5;
    int y = 10;
    int sum = x + y;

    printf("Sum: %d\\n", sum);
    return 0;
}`,
            steps: [
                { line: 4, description: 'Variable x is assigned value 5', variables: { x: 5 } },
                { line: 5, description: 'Variable y is assigned value 10', variables: { x: 5, y: 10 } },
                { line: 6, description: 'Sum is calculated: x + y = 15', variables: { x: 5, y: 10, sum: 15 } },
                { line: 8, description: 'Print statement executed', output: 'Sum: 15' }
            ]
        };
    }

    // Render visualization interface
    content.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <!-- Code Panel -->
            <div class="stitch-card p-6">
                <h3 class="text-xl font-bold mb-4">Code Execution</h3>
                <div class="bg-gray-800 p-4 rounded-lg font-mono text-sm mb-4" id="code-display">
                    <pre><code class="language-c">${vizData.code}</code></pre>
                </div>

                <div class="flex gap-2 mb-4">
                    <button class="stitch-btn flex-1" id="play-btn">Play</button>
                    <button class="stitch-btn flex-1" id="step-btn">Step</button>
                    <button class="stitch-btn flex-1" id="reset-btn">Reset</button>
                </div>

                <div class="text-sm text-gray-400">
                    <div>Step: <span id="current-step">0</span> / ${vizData.steps.length}</div>
                </div>
            </div>

            <!-- Variables & Output Panel -->
            <div class="space-y-6">
                <!-- Variables -->
                <div class="stitch-card p-6">
                    <h4 class="font-semibold mb-4">Variables</h4>
                    <div id="variables-display" class="space-y-2">
                        <p class="text-gray-400 text-sm">No variables yet</p>
                    </div>
                </div>

                <!-- Output -->
                <div class="stitch-card p-6">
                    <h4 class="font-semibold mb-4">Output</h4>
                    <div id="output-display" class="bg-black p-4 rounded font-mono text-sm min-h-[100px]">
                        <p class="text-gray-400">Program output will appear here</p>
                    </div>
                </div>

                <!-- Current Step Description -->
                <div class="stitch-card p-6">
                    <h4 class="font-semibold mb-4">Current Step</h4>
                    <p id="step-description" class="text-gray-300">Ready to start execution</p>
                </div>
            </div>
        </div>
    `;

    // Apply syntax highlighting
    applySyntaxHighlighting();

    // Visualization state
    let currentStepIndex = 0;
    let isPlaying = false;
    let playInterval = null;

    function updateDisplay() {
        const step = vizData.steps[currentStepIndex];
        if (!step) return;

        // Update step counter
        document.getElementById('current-step').textContent = currentStepIndex + 1;

        // Update step description
        document.getElementById('step-description').textContent = step.description;

        // Update variables
        const variablesDisplay = document.getElementById('variables-display');
        if (step.variables) {
            variablesDisplay.innerHTML = Object.entries(step.variables)
                .map(([name, value]) => `
                    <div class="flex justify-between">
                        <span class="text-blue-400">${name}</span>
                        <span class="text-white">${value}</span>
                    </div>
                `).join('');
        }

        // Update output
        const outputDisplay = document.getElementById('output-display');
        if (step.output) {
            outputDisplay.innerHTML = `<span class="text-green-400">${step.output}</span>`;
        }

        // Highlight current line in code
        const codeLines = document.querySelectorAll('#code-display pre code');
        if (codeLines.length > 0) {
            const codeContent = codeLines[0].innerHTML;
            const lines = codeContent.split('\n');
            const highlightedLines = lines.map((line, index) => {
                if (index + 1 === step.line) {
                    return `<span class="bg-yellow-600 bg-opacity-30">${line}</span>`;
                }
                return line;
            });
            codeLines[0].innerHTML = highlightedLines.join('\n');
        }
    }

    function nextStep() {
        if (currentStepIndex < vizData.steps.length - 1) {
            currentStepIndex++;
            updateDisplay();
        } else {
            stopPlayback();
        }
    }

    function reset() {
        currentStepIndex = 0;
        stopPlayback();
        updateDisplay();

        // Reset output
        document.getElementById('output-display').innerHTML = '<p class="text-gray-400">Program output will appear here</p>';
        document.getElementById('step-description').textContent = 'Ready to start execution';
    }

    function startPlayback() {
        if (isPlaying) return;
        isPlaying = true;
        playInterval = setInterval(nextStep, 2000);
    }

    function stopPlayback() {
        isPlaying = false;
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    }

    // Event listeners
    document.getElementById('play-btn').addEventListener('click', startPlayback);
    document.getElementById('step-btn').addEventListener('click', nextStep);
    document.getElementById('reset-btn').addEventListener('click', reset);

    // Initialize display
    updateDisplay();
}