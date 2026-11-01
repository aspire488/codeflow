// ============================================
// QUIZ HELPERS (pure functions, unit tested)
// ============================================

function getQuizForTopic(topicKey) {
  if (typeof QUIZ_DB === 'undefined') return [];
  return Object.prototype.hasOwnProperty.call(QUIZ_DB, topicKey) ? QUIZ_DB[topicKey] : [];
}

function calculateQuizScore(answers, correctAnswers) {
  const total = correctAnswers.length;
  let correct = 0;
  answers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) correct += 1;
  });
  return {
    correct,
    total,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0
  };
}

function getQuizDifficulty(topicKey) {
  const advanced = ['pointers', 'pointer-arithmetic', 'dynamic-memory', 'bitwise-operators', 'recursion'];
  const intermediate = ['functions', 'arrays', 'structures', 'file-basics', 'string-functions'];
  if (advanced.includes(topicKey)) return 'hard';
  if (intermediate.includes(topicKey)) return 'medium';
  return 'easy';
}

function getRandomQuizQuestions(topicKey, count = 3) {
  const questions = getQuizForTopic(topicKey);
  if (questions.length <= count) return questions.slice();
  const shuffled = questions.slice();
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled.slice(0, count);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getQuizForTopic, calculateQuizScore, getQuizDifficulty, getRandomQuizQuestions };
}
