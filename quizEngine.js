// quizEngine.js - Quiz handling functions

// Quiz functionality is now integrated into topicRenderer.js
// This file can be expanded for additional quiz features like:
// - Quiz statistics and analytics
// - Quiz difficulty levels
// - Timed quizzes
// - Quiz categories and filtering
// - Quiz progress tracking
// - Quiz achievements and rewards

function getQuizForTopic(topicKey) {
  return QUIZ_DB[topicKey] || [];
}

function calculateQuizScore(answers, correctAnswers) {
  let correct = 0;
  answers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) correct++;
  });
  return {
    correct,
    total: correctAnswers.length,
    percentage: Math.round((correct / correctAnswers.length) * 100)
  };
}

function getQuizDifficulty(topicKey) {
  // Determine quiz difficulty based on topic
  const advancedTopics = ['pointers', 'memory', 'bitwise-operators', 'recursion'];
  const intermediateTopics = ['functions', 'arrays', 'structures', 'file-basics'];

  if (advancedTopics.includes(topicKey)) return 'hard';
  if (intermediateTopics.includes(topicKey)) return 'medium';
  return 'easy';
}

function getRandomQuizQuestions(topicKey, count = 3) {
  const questions = QUIZ_DB[topicKey] || [];
  if (questions.length <= count) return questions;

  // Shuffle and return subset
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}