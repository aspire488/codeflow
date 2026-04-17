// tests/quizEngine.test.js
import { expect, test } from 'vitest';

test('calculateQuizScore - all correct', () => {
  const answers = [0, 1, 2];
  const correctAnswers = [0, 1, 2];
  const result = calculateQuizScore(answers, correctAnswers);
  expect(result).toEqual({ correct: 3, total: 3, percentage: 100 });
});

test('calculateQuizScore - some correct', () => {
  const answers = [0, 2, 1];
  const correctAnswers = [0, 1, 2];
  const result = calculateQuizScore(answers, correctAnswers);
  expect(result).toEqual({ correct: 2, total: 3, percentage: 67 });
});

test('calculateQuizScore - none correct', () => {
  const answers = [1, 2, 0];
  const correctAnswers = [0, 1, 2];
  const result = calculateQuizScore(answers, correctAnswers);
  expect(result).toEqual({ correct: 0, total: 3, percentage: 0 });
});