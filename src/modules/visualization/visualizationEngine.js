// ============================================
// VISUALIZATION ENGINE
// ============================================

function visualizeCode(code) {
    const lines = code.split('\n').map(l => l.trim()).filter(l => l);
    const steps = [];
    const variables = {};
    let step = 0;
    let output = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;

        // Handle variable assignment
        const assignMatch = line.match(/^(\w+)\s*=\s*(.+);?$/);
        if (assignMatch) {
            const varName = assignMatch[1];
            const value = assignMatch[2];
            // Simple evaluation for numbers and strings
            if (/^\d+$/.test(value)) {
                variables[varName] = parseInt(value);
            } else if (/^".*"$/.test(value) || /^'.*'$/.test(value)) {
                variables[varName] = value.slice(1, -1);
            } else {
                variables[varName] = value;
            }
            steps.push({
                step: ++step,
                line: lineNum,
                variables: {...variables},
                output: output
            });
            continue;
        }

        // Handle console.log or printf
        const logMatch = line.match(/^(console\.log|printf)\((.+)\);?$/);
        if (logMatch) {
            const expr = logMatch[2].trim();
            let logValue = expr;
            // Simple variable substitution
            if (variables[expr]) {
                logValue = variables[expr];
            } else if (expr.startsWith('"') && expr.endsWith('"')) {
                logValue = expr.slice(1, -1);
            } else if (expr.startsWith("'") && expr.endsWith("'")) {
                logValue = expr.slice(1, -1);
            }
            output += logValue + '\n';
            steps.push({
                step: ++step,
                line: lineNum,
                variables: {...variables},
                output: output
            });
            continue;
        }

        // Handle simple for loop
        const forMatch = line.match(/^for\s*\(\w+\s+(\w+)\s*=\s*(\d+);\s*\w+\s*<\s*(\d+);\s*\w+\+\+\)\s*\{$/);
        if (forMatch) {
            const varName = forMatch[1];
            const start = parseInt(forMatch[2]);
            const end = parseInt(forMatch[3]);
            for (let j = start; j < end; j++) {
                variables[varName] = j;
                steps.push({
                    step: ++step,
                    line: lineNum,
                    variables: {...variables},
                    output: output
                });
            }
            continue;
        }

        // Default: add step for other statements
        steps.push({
            step: ++step,
            line: lineNum,
            variables: {...variables},
            output: output
        });
    }

    return steps;
}