// ============================================
// QUIZ RENDERER - Quiz Interface UI
// ============================================

function renderQuiz(topicId) {
    const content = document.getElementById('quiz-content');
    if (!content) return;

    // Clear existing content
    content.innerHTML = '';

    // Get quiz data
    let quizData = null;
    if (typeof QUIZ_DB !== 'undefined' && QUIZ_DB.quizzes) {
        quizData = QUIZ_DB.quizzes.find(q => q.topicId === topicId);
    }

    if (!quizData) {
        // Fallback quiz
        quizData = {
            title: 'Sample Quiz',
            questions: [
                {
                    question: 'What is a variable in C programming?',
                    options: [
                        'A function that stores data',
                        'A container for storing data values',
                        'A type of loop',
                        'A mathematical operator'
                    ],
                    correct: 1
                },
                {
                    question: 'Which data type is used to store integer values?',
                    options: ['float', 'char', 'int', 'double'],
                    correct: 2
                }
            ]
        };
    }

    // Render quiz interface
    content.innerHTML = `
        <div class="max-w-2xl mx-auto">
            <div class="stitch-card p-6 mb-6">
                <h3 class="text-xl font-bold mb-4">${quizData.title}</h3>
                <div class="text-sm text-gray-400 mb-4">Question <span id="current-question">1</span> of ${quizData.questions.length}</div>

                <div id="question-container">
                    <p class="text-lg mb-6" id="question-text">${quizData.questions[0].question}</p>

                    <div class="space-y-3" id="options-container">
                        ${quizData.questions[0].options.map((option, index) => `
                            <button class="quiz-option w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" data-option="${index}">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="flex justify-between mt-6">
                    <button class="stitch-btn" id="prev-btn" disabled>Previous</button>
                    <button class="stitch-btn" id="next-btn">Next</button>
                </div>
            </div>

            <div class="stitch-card p-6">
                <h4 class="font-semibold mb-4">Progress</h4>
                <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" id="progress-bar" style="width: 0%"></div>
                </div>
                <div class="text-sm text-gray-400 mt-2" id="progress-text">0% Complete</div>
            </div>
        </div>
    `;

    // Quiz state
    let currentQuestion = 0;
    let answers = new Array(quizData.questions.length).fill(null);
    let score = 0;

    function updateQuestion() {
        const question = quizData.questions[currentQuestion];
        document.getElementById('question-text').textContent = question.question;
        document.getElementById('current-question').textContent = currentQuestion + 1;

        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = question.options.map((option, index) => `
            <button class="quiz-option w-full text-left p-4 rounded-lg transition-colors ${
                answers[currentQuestion] === index ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }" data-option="${index}">
                ${option}
            </button>
        `).join('');

        // Update navigation buttons
        document.getElementById('prev-btn').disabled = currentQuestion === 0;
        document.getElementById('next-btn').textContent =
            currentQuestion === quizData.questions.length - 1 ? 'Finish' : 'Next';

        // Update progress
        const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
        document.getElementById('progress-bar').style.width = progress + '%';
        document.getElementById('progress-text').textContent = Math.round(progress) + '% Complete';
    }

    function showResults() {
        content.innerHTML = `
            <div class="max-w-2xl mx-auto">
                <div class="stitch-card p-6 text-center">
                    <h3 class="text-2xl font-bold mb-4">Quiz Complete!</h3>
                    <div class="text-6xl font-black text-blue-400 mb-4">${score}/${quizData.questions.length}</div>
                    <p class="text-gray-400 mb-6">You scored ${Math.round((score/quizData.questions.length)*100)}%</p>
                    <div class="flex gap-4 justify-center">
                        <button class="stitch-btn" onclick="navigateTo('dashboard')">Back to Dashboard</button>
                        <button class="stitch-btn" onclick="renderQuiz('${topicId}')">Retake Quiz</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Event listeners
    content.addEventListener('click', function(e) {
        if (e.target.classList.contains('quiz-option')) {
            const optionIndex = parseInt(e.target.getAttribute('data-option'));
            answers[currentQuestion] = optionIndex;

            // Update UI
            document.querySelectorAll('.quiz-option').forEach(btn => {
                btn.classList.remove('bg-blue-600');
                btn.classList.add('bg-gray-700', 'hover:bg-gray-600');
            });
            e.target.classList.remove('bg-gray-700', 'hover:bg-gray-600');
            e.target.classList.add('bg-blue-600');
        }

        if (e.target.id === 'next-btn') {
            if (currentQuestion < quizData.questions.length - 1) {
                currentQuestion++;
                updateQuestion();
            } else {
                // Calculate score
                answers.forEach((answer, index) => {
                    if (answer === quizData.questions[index].correct) {
                        score++;
                    }
                });
                showResults();
            }
        }

        if (e.target.id === 'prev-btn' && currentQuestion > 0) {
            currentQuestion--;
            updateQuestion();
        }
    });

    // Initialize first question
    updateQuestion();
}