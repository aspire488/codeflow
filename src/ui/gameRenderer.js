// ============================================
// GAME RENDERER - Logic Quest UI
// ============================================

function renderLogicQuest() {
    const content = document.getElementById('game-content');
    if (!content) return;

    // Clear existing content
    content.innerHTML = '';

    // Get game data
    let gameData = null;
    if (typeof GAME_LEVELS !== 'undefined') {
        gameData = GAME_LEVELS;
    }

    if (!gameData) {
        // Fallback game data
        gameData = {
            levels: [
                {
                    id: 'level1',
                    title: 'Basic Logic Gates',
                    description: 'Learn about AND, OR, NOT gates',
                    difficulty: 'Easy',
                    xp: 100,
                    completed: false
                },
                {
                    id: 'level2',
                    title: 'Switch Statements',
                    description: 'Master switch-case control flow',
                    difficulty: 'Medium',
                    xp: 150,
                    completed: false
                },
                {
                    id: 'level3',
                    title: 'Loop Patterns',
                    description: 'Advanced loop constructs',
                    difficulty: 'Hard',
                    xp: 200,
                    completed: false
                }
            ]
        };
    }

    // Render game interface
    content.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <!-- Game Header -->
            <div class="stitch-card p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-2xl font-bold">Logic Quest</h2>
                        <p class="text-gray-400">Gamified learning experience</p>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-blue-400">Level 12</div>
                        <div class="text-sm text-gray-400">12,450 XP</div>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-gray-700 rounded-full h-3 mb-4">
                    <div class="bg-blue-600 h-3 rounded-full" style="width: 70%"></div>
                </div>
                <div class="text-sm text-gray-400">70% to next level</div>
            </div>

            <!-- Levels Grid -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="levels-grid">
                ${gameData.levels.map(level => `
                    <div class="stitch-card p-6 cursor-pointer hover:scale-105 transition-transform level-card" data-level="${level.id}">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-sm px-2 py-1 rounded ${
                                level.difficulty === 'Easy' ? 'bg-green-600' :
                                level.difficulty === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                            } text-white">${level.difficulty}</span>
                            <span class="text-sm text-gray-400">${level.xp} XP</span>
                        </div>

                        <h3 class="text-lg font-semibold mb-2">${level.title}</h3>
                        <p class="text-gray-400 text-sm mb-4">${level.description}</p>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                ${level.completed ?
                                    '<span class="material-symbols-outlined text-green-400">check_circle</span>' :
                                    '<span class="material-symbols-outlined text-gray-400">play_circle</span>'
                                }
                                <span class="text-sm ${level.completed ? 'text-green-400' : 'text-gray-400'}">
                                    ${level.completed ? 'Completed' : 'Play'}
                                </span>
                            </div>
                            <button class="stitch-btn text-sm px-4 py-2" data-action="play-level" data-level="${level.id}">
                                ${level.completed ? 'Replay' : 'Start'}
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Game Stats -->
            <div class="grid md:grid-cols-3 gap-6 mt-8">
                <div class="stitch-card p-6 text-center">
                    <div class="text-3xl font-bold text-blue-400 mb-2">24</div>
                    <div class="text-gray-400">Levels Completed</div>
                </div>

                <div class="stitch-card p-6 text-center">
                    <div class="text-3xl font-bold text-green-400 mb-2">1,247</div>
                    <div class="text-gray-400">Total XP Earned</div>
                </div>

                <div class="stitch-card p-6 text-center">
                    <div class="text-3xl font-bold text-purple-400 mb-2">7</div>
                    <div class="text-gray-400">Day Streak</div>
                </div>
            </div>
        </div>
    `;

    // Add event listeners for level cards
    content.addEventListener('click', function(e) {
        const levelCard = e.target.closest('.level-card');
        if (levelCard) {
            const levelId = levelCard.getAttribute('data-level');
            if (levelId && typeof startLogicQuestLevel !== 'undefined') {
                startLogicQuestLevel(levelId);
            }
        }

        const playBtn = e.target.closest('[data-action="play-level"]');
        if (playBtn) {
            const levelId = playBtn.getAttribute('data-level');
            if (levelId && typeof startLogicQuestLevel !== 'undefined') {
                startLogicQuestLevel(levelId);
            }
        }
    });
}

// Level start function (called from game engine)
function startLogicQuestLevel(levelId) {
    const content = document.getElementById('game-content');
    if (!content) return;

    // Get level data
    let levelData = null;
    if (typeof LOGIC_QUEST_DB !== 'undefined' && LOGIC_QUEST_DB.levels) {
        levelData = LOGIC_QUEST_DB.levels.find(l => l.id === levelId);
    }

    if (!levelData) {
        // Fallback level
        levelData = {
            id: levelId,
            title: 'Sample Level',
            description: 'Complete the programming challenge',
            challenge: {
                instruction: 'Write a function that returns the sum of two numbers',
                code: `int sum(int a, int b) {
    // Your code here
    return a + b;
}`,
                tests: [
                    { input: [2, 3], expected: 5 },
                    { input: [10, 20], expected: 30 }
                ]
            }
        };
    }

    // Render level interface
    content.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <!-- Level Header -->
            <div class="stitch-card p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-2xl font-bold">${levelData.title}</h2>
                        <p class="text-gray-400">${levelData.description}</p>
                    </div>
                    <button class="stitch-btn" onclick="renderLogicQuest()">Back to Levels</button>
                </div>
            </div>

            <!-- Challenge -->
            <div class="grid md:grid-cols-2 gap-6">
                <div class="stitch-card p-6">
                    <h3 class="font-semibold mb-4">Challenge</h3>
                    <p class="text-gray-300 mb-4">${levelData.challenge.instruction}</p>

                    <h4 class="font-semibold mb-2">Starting Code:</h4>
                    <div class="bg-gray-800 p-4 rounded-lg font-mono text-sm">
                        <pre><code class="language-c">${levelData.challenge.code}</code></pre>
                    </div>
                </div>

                <div class="stitch-card p-6">
                    <h3 class="font-semibold mb-4">Test Cases</h3>
                    <div class="space-y-3" id="test-results">
                        ${levelData.challenge.tests.map((test, index) => `
                            <div class="p-3 bg-gray-700 rounded test-case" data-test="${index}">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm">Test ${index + 1}</span>
                                    <span class="text-xs px-2 py-1 rounded bg-gray-600" id="test-status-${index}">Pending</span>
                                </div>
                                <div class="text-sm text-gray-300">
                                    Input: ${JSON.stringify(test.input)}<br>
                                    Expected: ${test.expected}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <button class="stitch-btn w-full mt-4" id="run-tests-btn">Run Tests</button>
                </div>
            </div>
        </div>
    `;

    // Apply syntax highlighting
    applySyntaxHighlighting();

    // Add test runner functionality
    document.getElementById('run-tests-btn').addEventListener('click', function() {
        runLevelTests(levelData.challenge.tests);
    });
}

function runLevelTests(tests) {
    tests.forEach((test, index) => {
        const statusElement = document.getElementById(`test-status-${index}`);
        const testElement = document.querySelector(`[data-test="${index}"]`);

        // Simulate test running
        statusElement.textContent = 'Running...';
        statusElement.className = 'text-xs px-2 py-1 rounded bg-yellow-600';

        setTimeout(() => {
            // Simple mock test result (in real implementation, this would run actual code)
            const passed = Math.random() > 0.3; // 70% pass rate for demo

            if (passed) {
                statusElement.textContent = 'Passed';
                statusElement.className = 'text-xs px-2 py-1 rounded bg-green-600';
                testElement.classList.add('border-green-500');
            } else {
                statusElement.textContent = 'Failed';
                statusElement.className = 'text-xs px-2 py-1 rounded bg-red-600';
                testElement.classList.add('border-red-500');
            }
        }, 1000 + Math.random() * 2000);
    });
}