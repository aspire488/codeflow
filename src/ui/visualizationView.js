// ============================================
// VISUALIZATION VIEW
// ============================================

function renderVisualization(steps, code) {
    const container = document.createElement('div');
    container.className = 'visualization-container';

    // Code display with line numbers
    const codeDiv = document.createElement('pre');
    codeDiv.className = 'code-display';
    const lines = code.split('\n');
    lines.forEach((line, i) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'code-line';
        lineDiv.dataset.line = i + 1;
        lineDiv.textContent = (i + 1) + ': ' + line;
        codeDiv.appendChild(lineDiv);
    });
    container.appendChild(codeDiv);

    // Controls
    const controls = document.createElement('div');
    controls.className = 'controls';
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.className = 'stitch-btn';
    prevBtn.onclick = () => changeStep(-1);
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.className = 'stitch-btn';
    nextBtn.onclick = () => changeStep(1);
    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    container.appendChild(controls);

    // Variables table
    const varTable = document.createElement('table');
    varTable.className = 'variables-table';
    container.appendChild(varTable);

    // Output display
    const outputDiv = document.createElement('pre');
    outputDiv.className = 'output-display';
    container.appendChild(outputDiv);

    let currentStep = 0;

    function updateDisplay() {
        const step = steps[currentStep];
        if (!step) return;

        // Highlight current line
        document.querySelectorAll('.code-line').forEach(l => l.classList.remove('highlight'));
        const highlightLine = document.querySelector(`.code-line[data-line="${step.line}"]`);
        if (highlightLine) highlightLine.classList.add('highlight');

        // Update variables table
        varTable.innerHTML = '<tr><th>Variable</th><th>Value</th></tr>';
        Object.entries(step.variables).forEach(([k, v]) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${k}</td><td>${v}</td>`;
            varTable.appendChild(tr);
        });

        // Update output
        outputDiv.textContent = step.output;
    }

    function changeStep(delta) {
        currentStep = Math.max(0, Math.min(steps.length - 1, currentStep + delta));
        updateDisplay();
    }

    updateDisplay();

    return container;
}