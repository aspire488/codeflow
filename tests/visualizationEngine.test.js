// tests/visualizationEngine.test.js
import { expect, test } from 'vitest';

test('visualizeCode - basic assignment', () => {
  const code = 'x = 5;\ny = 10;';
  const steps = visualizeCode(code);
  expect(steps.length).toBe(2);
  expect(steps[0].variables.x).toBe(5);
  expect(steps[1].variables.x).toBe(5);
  expect(steps[1].variables.y).toBe(10);
});

test('visualizeCode - console.log', () => {
  const code = 'x = 5;\nconsole.log(x);';
  const steps = visualizeCode(code);
  expect(steps.length).toBe(2);
  expect(steps[1].output).toBe('5\n');
});

test('visualizeCode - for loop', () => {
  const code = 'for (let i = 0; i < 3; i++) {\n  // loop body\n}';
  const steps = visualizeCode(code);
  expect(steps.length).toBe(3); // i=0, i=1, i=2
  expect(steps[0].variables.i).toBe(0);
  expect(steps[1].variables.i).toBe(1);
  expect(steps[2].variables.i).toBe(2);
});