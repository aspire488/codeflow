// Browser tests against the real application. Run with: npm run test:e2e
const { test, expect } = require('@playwright/test');

const ROUTES = [
  ['dashboard', 'Next up'],
  ['topics', 'Explore topics'],
  ['lesson', 'C'],
  ['quiz', 'Quiz center'],
  ['predict', 'Output prediction'],
  ['visualize', 'Execution Visualizer'],
  ['game', 'Logic Quest'],
  ['logic', 'Logic Analyzer'],
  ['chatbot', ''],
  ['practice', 'Adaptive practice'],
  ['progress', 'Your progress']
];

// On phones the navigation lives in an off-canvas drawer, so open it first.
async function nav(page, route) {
  const menu = page.locator('#mobile-menu-btn');
  if (await menu.isVisible()) {
    await menu.click();
    await expect(page.locator('#sidebar')).toHaveClass(/open/);
  }
  await page.locator(`.nav-item[data-nav="${route}"]`).click();
}

test.beforeEach(async ({ page }) => {
  // Clear once per test, not on every navigation: the persistence test reloads
  // the page and must observe what the app actually wrote to storage.
  await page.goto('/');
  await page.evaluate(() => { try { window.localStorage.clear(); } catch (error) { /* ignore */ } });
  await page.reload();
});

test('application boots with no console errors and renders the dashboard', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page.locator('#dashboard-screen')).toHaveClass(/active/);
  const rows = page.locator('#dashboard-content .rail-row');
  await expect(rows.first()).toBeVisible();
  expect(await rows.count()).toBe(4); // current lesson plus the next three
  expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([]);
});

test('appearance: theme toggle updates the page and persists the selection', async ({ page }) => {
  const root = page.locator('html');
  const toggle = page.locator('#theme-toggle');
  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect(toggle).toHaveAttribute('aria-label', 'Switch to light mode');
  await toggle.click();
  await expect(root).toHaveAttribute('data-theme', 'light');
  await expect(toggle).toHaveAttribute('aria-label', 'Switch to dark mode');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f8fafc');
  await page.reload();
  await expect(root).toHaveAttribute('data-theme', 'light');
  await toggle.click();
  await expect(root).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => localStorage.getItem('codeflow_theme'))).toBe('dark');
});

test('every screen is reachable from the sidebar with a matching active state', async ({ page }) => {
  await page.goto('/');
  for (const [route, heading] of ROUTES) {
    await nav(page, route);
    await expect(page.locator(`#${route}-screen`)).toHaveClass(/active/);
    await expect(page.locator(`.nav-item[data-nav="${route}"]`)).toHaveClass(/active/);
    await expect(page).toHaveURL(new RegExp(`#${route}`));
    if (heading) {
      const text = await page.locator(`#${route}-screen`).innerText();
      expect(text).toContain(heading);
    }
  }
});

test('lesson content, navigation and completion persist across reloads', async ({ page }) => {
  await page.goto('/#lesson/loops');
  await expect(page.locator('#lesson-content h2')).toContainText(/loop/i);
  await expect(page.locator('#lesson-content pre code')).toBeVisible();

  await page.locator('#lesson-content a[href^="#lesson/"]').last().click();
  await expect(page.locator('#lesson-content h2')).not.toBeEmpty();

  await page.goto('/#lesson/c-basics');
  await page.locator('#mark-complete').click();
  await expect(page.locator('#lesson-content')).toContainText('Completed');

  await page.reload();
  await expect(page.locator('#lesson-content')).toContainText('Completed');
});

test('quiz can be answered end to end and reports a score', async ({ page }) => {
  await page.goto('/#quiz/c-basics');
  await expect(page.locator('.quiz-question')).toBeVisible();

  for (let guard = 0; guard < 10; guard += 1) {
    await page.locator('.quiz-option').first().click();
    await page.locator('#quiz-check').click();
    await expect(page.locator('#quiz-feedback .feedback')).toBeVisible();
    await page.locator('#quiz-next').click();
    if (await page.locator('.result-card').count()) break;
  }

  await expect(page.locator('.result-card')).toBeVisible();
  await expect(page.locator('.result-score')).toContainText('/');
  await expect(page.locator('.result-card')).toContainText('XP');
});

test('quiz answers feed adaptive practice recommendations', async ({ page }) => {
  await page.goto('/#quiz/loops');
  for (let guard = 0; guard < 12; guard += 1) {
    await page.locator('.quiz-option').nth(1).click();
    await page.locator('#quiz-check').click();
    await page.locator('#quiz-next').click();
    if (await page.locator('.result-card').count()) break;
  }
  await nav(page, 'practice');
  await expect(page.locator('#practice-content')).toContainText('Adaptive practice');
  await expect(page.locator('#practice-content')).not.toContainText('Practice engine unavailable');
});

test('output prediction reveals the answer and explains it', async ({ page }) => {
  await page.goto('/#predict');
  await expect(page.locator('#prediction-input')).toBeVisible();
  await page.locator('#prediction-reveal').click();
  await expect(page.locator('#prediction-feedback')).toContainText('Expected output');
  await expect(page.locator('#prediction-feedback')).toContainText(/loop|output|iteration|print/i);
});

test('visualizer steps forward, backward and resets', async ({ page }) => {
  await page.goto('/#visualize/code/loops');
  const label = page.locator('#viz-step-label');
  await expect(label).toContainText('Step 1 of');

  await page.locator('#viz-next').click();
  await expect(label).toContainText('Step 2 of');
  await page.locator('#viz-prev').click();
  await expect(label).toContainText('Step 1 of');
  await page.locator('#viz-next').click();
  await page.locator('#viz-reset').click();
  await expect(label).toContainText('Step 1 of');
});

test('flow, pointer, recursion and loop visualizations all render', async ({ page }) => {
  await page.goto('/#visualize/flow/loops');
  await expect(page.locator('.flow-node').first()).toBeVisible();

  await page.goto('/#visualize/pointers/loops');
  await expect(page.locator('#pointer-memory')).toContainText('x');
  await page.locator('#viz-next').click();
  await expect(page.locator('#pointer-description')).not.toBeEmpty();

  await page.goto('/#visualize/recursion/recursion');
  await expect(page.locator('#recursion-stack')).toContainText('fact');
  await page.locator('#viz-next').click();
  await expect(page.locator('#viz-step-label')).toContainText('Step 2 of');

  await page.goto('/#visualize/loops/loops');
  await expect(page.locator('.viz-table')).toContainText('iteration');
  await expect(page.locator('.console')).not.toBeEmpty();
});

test('logic quest execution challenge awards XP and unlocks the next level', async ({ page }) => {
  await page.goto('/#game');
  await expect(page.locator('.quest-chapter').first()).toBeVisible();

  await page.locator('[data-level="loops-1"]').click();
  await expect(page.locator('#exec-actions')).toBeVisible();

  const actions = ['check', 'body', 'increment', 'check', 'body', 'increment', 'check', 'body', 'increment', 'check', 'finish'];
  for (const action of actions) {
    await page.locator(`[data-exec-action="${action}"]`).click();
  }

  await expect(page.locator('#exec-feedback')).toContainText('Level complete');
  await expect(page.locator('#xp-chip')).toHaveText('10 XP');

  await nav(page, 'game');
  await expect(page.locator('[data-level="loops-1"]')).toHaveClass(/done/);
  await expect(page.locator('[data-level="loops-2"]')).toBeEnabled();
});

test('logic quest rejects a wrong execution order', async ({ page }) => {
  await page.goto('/#game');
  await page.locator('[data-level="loops-1"]').click();
  await page.locator('[data-exec-action="increment"]').click();
  await expect(page.locator('#exec-feedback .feedback.bad')).toBeVisible();
  await expect(page.locator('#exec-mistakes')).toHaveText('1');
});

test('chatbot answers from the knowledge base', async ({ page }) => {
  await page.goto('/#chatbot');
  await expect(page.locator('#chat-messages .chat-bubble').first()).toBeVisible();
  const before = await page.locator('#chat-messages .chat-bubble').count();

  await page.locator('#chat-input').fill('explain pointers');
  await page.locator('#chat-send').click();

  await expect(page.locator('#chat-messages .chat-bubble').nth(before)).toContainText('pointers', { ignoreCase: true });
  await expect(page.locator('#chat-messages')).not.toContainText('Thinking...');
});

test('logic analyzer produces structural results for C and JavaScript', async ({ page }) => {
  await page.goto('/#logic');
  await page.locator('#analyze-btn').click();
  await expect(page.locator('#analyzer-results')).not.toContainText('Results will appear here');
  await expect(page.locator('#analyzer-results')).toContainText('Logical nodes');
  // The engine never produced complexity or findings; those placeholder cards were removed.
  await expect(page.locator('#analyzer-results')).not.toContainText('Complexity');

  await page.locator('#analyzer-language').selectOption('javascript');
  await page.locator('#analyzer-code').fill('function add(a, b) { return a + b; }\nconst total = add(1, 2);');
  await page.locator('#analyze-btn').click();
  await expect(page.locator('#analyzer-results')).toContainText('Logical nodes');
});

test('modal opens, closes with Escape and never locks scrolling', async ({ page }) => {
  await page.goto('/');
  await page.locator('#help-btn').click();
  await expect(page.locator('#app-modal')).toHaveClass(/active/);

  await page.keyboard.press('Escape');
  await expect(page.locator('#app-modal')).not.toHaveClass(/active/);
  await expect(page.locator('body')).not.toHaveClass(/modal-open/);

  // Re-open and close via the backdrop, then scroll the dashboard.
  await page.locator('#help-btn').click();
  await page.locator('#app-modal').click({ position: { x: 5, y: 5 } });
  await expect(page.locator('#app-modal')).not.toHaveClass(/active/);

  await page.goto('/#topics');
  const before = await page.locator('#topics-screen .screen-scroll').evaluate((el) => el.scrollTop);
  await page.locator('#topics-screen .screen-scroll').evaluate((el) => { el.scrollTop = 600; });
  const after = await page.locator('#topics-screen .screen-scroll').evaluate((el) => el.scrollTop);
  expect(after).toBeGreaterThanOrEqual(before);
});

test('back and forward navigation work and direct routes survive reload', async ({ page }) => {
  await page.goto('/#dashboard');
  await nav(page, 'quiz');
  await nav(page, 'topics');

  await page.goBack();
  await expect(page.locator('#quiz-screen')).toHaveClass(/active/);
  await page.goForward();
  await expect(page.locator('#topics-screen')).toHaveClass(/active/);

  await page.goto('/#lesson/pointers');
  await page.reload();
  await expect(page.locator('#lesson-screen')).toHaveClass(/active/);
  await expect(page.locator('#lesson-content h2')).toContainText(/pointer/i);
});

test('unknown routes fall back to the dashboard instead of a blank screen', async ({ page }) => {
  await page.goto('/#does-not-exist');
  await expect(page.locator('#dashboard-screen')).toHaveClass(/active/);
});

test('corrupted local storage does not break startup', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.evaluate(() => {
    window.localStorage.setItem('codeflow_app_state', '{not json');
    window.localStorage.setItem('codeflow_logic_quest', '[]');
    window.localStorage.setItem('codeflow_adaptive_state', 'nonsense');
  });
  await page.reload();

  await expect(page.locator('#dashboard-screen')).toHaveClass(/active/);
  await expect(page.locator('#dashboard-content .rail-row').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('mobile navigation opens, navigates and closes without overflow', async ({ page, isMobile }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const menu = page.locator('#mobile-menu-btn');
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(page.locator('#sidebar')).toHaveClass(/open/);

  await page.locator('.nav-item[data-nav="progress"]').click();
  await expect(page.locator('#progress-screen')).toHaveClass(/active/);
  await expect(page.locator('#sidebar')).not.toHaveClass(/open/);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
