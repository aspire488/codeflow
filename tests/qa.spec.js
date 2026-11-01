// ============================================
// QA SUITE - simulated personas
//
// These are AI-simulated testing profiles, not real human participants. Each
// test builds its own browser context so no persona inherits another's
// localStorage. Every assertion checks a resulting state or a rendered value,
// never merely that a control exists.
// ============================================

const { test, expect } = require('@playwright/test');

const BASE = 'http://127.0.0.1:4173';

const ROUTES = [
  'dashboard', 'topics', 'lesson', 'quiz', 'predict',
  'visualize', 'game', 'logic', 'chatbot', 'practice', 'progress'
];

async function newUser(browser, options = {}) {
  const { width = 1280, height = 800, mobile = false, seed = null } = options;
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: mobile,
    hasTouch: mobile
  });

  if (seed) {
    await context.addInitScript((entries) => {
      Object.entries(entries).forEach(([key, value]) => {
        try {
          localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        } catch (error) { /* storage unavailable */ }
      });
    }, seed);
  }

  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(`${BASE}/#dashboard`, { waitUntil: 'networkidle' });
  return { context, page, errors };
}

async function closeUser(user) {
  await user.context.close();
}

async function go(page, route) {
  const menu = page.locator('#mobile-menu-btn');
  if (await menu.isVisible()) {
    await menu.click();
    await expect(page.locator('#sidebar')).toHaveClass(/open/);
  }
  await page.locator(`.nav-item[data-nav="${route}"]`).click();
  await expect(page.locator(`#${route}-screen`)).toHaveClass(/active/);
}

async function xp(page) {
  const text = await page.locator('#xp-chip').innerText();
  return Number((text.match(/\d+/) || ['0'])[0]);
}

async function state(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('codeflow_app_state') || '{}'));
}

// Measures clipping rather than relying on overflow-x:hidden to hide it.
async function clipping(page) {
  return page.evaluate(() => {
    const screen = document.querySelector('.screen.active');
    const scroller = screen ? screen.querySelector('.screen-scroll') : null;
    return {
      viewportOverflow: document.documentElement.scrollWidth - window.innerWidth,
      clippedContent: scroller ? scroller.scrollWidth - scroller.clientWidth : 0
    };
  });
}

async function runQuiz(page, options = {}) {
  const { wrongFirst = false } = options;
  for (let guard = 0; guard < 14; guard += 1) {
    if (await page.locator('.result-score').count()) break;
    const correct = await page.evaluate(() => quizSession.questions[quizSession.index].correct);
    const pick = wrongFirst && guard === 0 ? (correct + 1) % 4 : correct;
    await page.locator(`.quiz-option[data-option="${pick}"]`).click();
    await page.locator('#quiz-check').click();
    await expect(page.locator('#quiz-feedback .feedback')).toBeVisible();
    await page.locator('#quiz-next').click();
  }
  await expect(page.locator('.result-score')).toBeVisible();
}

// ---------- Persona 1 - complete beginner, phone ----------
test('persona 1 beginner can go from dashboard to a finished quiz on a phone', async ({ browser }) => {
  const user = await newUser(browser, { width: 375, height: 812, mobile: true });
  const { page, errors } = user;

  await go(page, 'topics');
  await page.locator('#topics-content .filter-chip', { hasText: 'C Programming' }).click();
  await expect(page.locator('#topics-content .topic-row').first()).toBeVisible();

  await page.locator('#topics-content .topic-row').first().locator('.topic-link').click();
  await expect(page.locator('#lesson-screen')).toHaveClass(/active/);
  await expect(page.locator('#lesson-content h2')).not.toBeEmpty();
  await expect(page.locator('#lesson-content pre code')).toBeVisible();
  await expect(page.locator('#lesson-content pre code')).not.toContainText('text-[#');

  const topicId = await page.evaluate(() => AppState.currentTopic);
  await go(page, 'quiz');
  await page.locator(`#quiz-content [data-action="start-quiz"][data-topic="${topicId}"]`).first().click();
  await expect(page.locator('.quiz-question')).not.toBeEmpty();

  await runQuiz(page, { wrongFirst: true });
  const score = await page.locator('.result-score').innerText();
  expect(score).toMatch(/^\d+\/\d+$/);

  const saved = await state(page);
  expect(saved.quizScores[topicId]).toBeTruthy();
  // Wrong first answer on a short quiz fails it; a failed attempt no longer pays XP (that was farmable).
  expect(await xp(page)).toBe(0);

  const metrics = await clipping(page);
  expect(metrics.viewportOverflow, 'no horizontal scroll on 375px').toBeLessThanOrEqual(0);
  expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([]);
  await closeUser(user);
});

// ---------- Persona 2 - KTU student, exam practice ----------
test('persona 2 student predicts output from the real answer key, then drills a quiz', async ({ browser }) => {
  const user = await newUser(browser, { width: 1280, height: 800 });
  const { page, errors } = user;

  await page.goto(`${BASE}/#predict/loops`, { waitUntil: 'networkidle' });
  const answer = await page.evaluate(() => predictionState.question.answer);
  expect(answer.length).toBeGreaterThan(0);

  await page.locator('#prediction-input').fill(answer);
  await page.locator('#prediction-check').click();
  await expect(page.locator('#prediction-feedback .feedback.ok')).toContainText(/correct/i);

  await page.goto(`${BASE}/#quiz/c-basics`, { waitUntil: 'networkidle' });
  await runQuiz(page);
  const saved = await state(page);
  expect(saved.quizScores['c-basics'].percentage).toBe(100);
  expect(saved.completedTopics).toContain('c-basics');

  await go(page, 'progress');
  await expect(page.locator('#progress-content')).toContainText('100%');
  expect(errors).toEqual([]);
  await closeUser(user);
});

// ---------- Persona 3 - intermediate, execution truthfulness ----------
test('persona 3 verifies every visualization against the engine data', async ({ browser }) => {
  const user = await newUser(browser, { width: 1440, height: 900 });
  const { page, errors } = user;

  await page.goto(`${BASE}/#visualize/code/loops`, { waitUntil: 'networkidle' });
  const authored = await page.evaluate(() => TOPICS_DB.loops.visualizationSteps.length);
  await expect(page.locator('#viz-step-label')).toContainText(`1 / ${authored}`);
  await expect(page.locator('#viz-console')).toContainText('(no output yet)');
  await expect(page.locator('#visualize-content')).toContainText('authored walkthrough');

  // Every step must expose a different variable state from the data.
  const firstVars = await page.locator('#viz-variables').innerText();
  await page.locator('#viz-next').click();
  await page.locator('#viz-next').click();
  const laterVars = await page.locator('#viz-variables').innerText();
  expect(laterVars).not.toEqual(firstVars);

  // Loop trace rows must match the computed trace, not a decorative count.
  await page.goto(`${BASE}/#visualize/loops/loops`, { waitUntil: 'networkidle' });
  const trace = await page.evaluate(() => {
    const result = traceLoop(TOPICS_DB.loops.code);
    return { rows: result.rows.length, output: result.output, iterations: result.iterations };
  });
  await expect(page.locator('.viz-table tbody tr')).toHaveCount(trace.rows);
  await expect(page.locator('.console').last()).toContainText(trace.output);

  // Recursion: base case must return before the outer call.
  await page.goto(`${BASE}/#visualize/recursion/recursion`, { waitUntil: 'networkidle' });
  for (let step = 0; step < 4; step += 1) await page.locator('#viz-next').click();
  await expect(page.locator('#recursion-stack')).toContainText('fact(');
  await expect(page.locator('#recursion-output')).toContainText(/returned 1|returned 2/);

  // Pointers: values must change as the steps advance, with symbolic addresses.
  await page.goto(`${BASE}/#visualize/pointers/loops`, { waitUntil: 'networkidle' });
  const before = await page.locator('#visualize-content').innerText();
  await page.locator('#viz-next').click();
  await page.locator('#viz-next').click();
  await page.locator('#viz-next').click();
  const after = await page.locator('#visualize-content').innerText();
  expect(after).not.toEqual(before);
  expect(after).toContain('25');
  expect(after).not.toMatch(/0x[0-9a-f]{4,}/i);

  expect(errors).toEqual([]);
  await closeUser(user);
});

// ---------- Persona 4 - mobile-first, whole workflow ----------
test('persona 4 completes the full workflow through the mobile drawer', async ({ browser }) => {
  const user = await newUser(browser, { width: 393, height: 852, mobile: true });
  const { page, errors } = user;

  const topicId = await page.evaluate(() => Object.keys(TOPICS_DB)[0]);

  await go(page, 'topics');
  await page.locator(`#topics-content .topic-row[data-topic="${topicId}"] .topic-link`).click();
  await expect(page.locator('#lesson-screen')).toHaveClass(/active/);

  const complete = page.locator('#mark-complete');
  if (await complete.count()) {
    await complete.click();
    await expect(page.locator('#lesson-content')).toContainText('Completed');
  }

  await go(page, 'quiz');
  await page.locator(`#quiz-content [data-action="start-quiz"][data-topic="${topicId}"]`).first().click();
  await runQuiz(page);

  await go(page, 'progress');
  await expect(page.locator('#progress-content')).toContainText('Topics completed');
  const metrics = await clipping(page);
  expect(metrics.viewportOverflow).toBeLessThanOrEqual(0);

  await page.locator('#mobile-menu-btn').click();
  await expect(page.locator('#sidebar')).toHaveClass(/open/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#sidebar')).not.toHaveClass(/open/);
  await expect(page.locator('#sidebar-backdrop')).not.toHaveClass(/visible/);

  expect(errors).toEqual([]);
  await closeUser(user);
});

// ---------- Persona 5 - impatient, double submits ----------
test('persona 5 cannot double-score, double-advance or land on a stale screen', async ({ browser }) => {
  const user = await newUser(browser, { width: 1440, height: 900 });
  const { page, errors } = user;

  await page.goto(`${BASE}/#quiz/c-basics`, { waitUntil: 'networkidle' });
  const correct = await page.evaluate(() => quizSession.questions[0].correct);
  await page.locator(`.quiz-option[data-option="${correct}"]`).click();
  await page.locator('#quiz-check').click();
  await page.locator('#quiz-check').click({ force: true });
  const scoreAfterDouble = await page.evaluate(() => quizSession.score);
  expect(scoreAfterDouble).toBe(1);
  await expect(page.locator('#quiz-feedback .feedback')).toHaveCount(1);

  const before = await page.locator('#quiz-feedback').innerText();
  await page.locator('#quiz-next').click();
  await page.locator('#quiz-next').click({ force: true }).catch(() => {});
  const index = await page.evaluate(() => quizSession.index);
  expect(index).toBeLessThanOrEqual(1);
  expect(await page.locator('#quiz-feedback').innerText()).not.toBe(before);

  // Rapid navigation must leave exactly one screen and one active nav item.
  for (let round = 0; round < 3; round += 1) {
    for (const route of ['topics', 'quiz', 'visualize', 'game', 'progress', 'dashboard']) {
      await page.locator(`.nav-item[data-nav="${route}"]`).click({ force: true });
    }
  }
  await expect(page.locator('.screen.active')).toHaveCount(1);
  await expect(page.locator('.nav-item.active')).toHaveCount(1);
  await expect(page.locator('#dashboard-screen')).toHaveClass(/active/);

  // Rapid visualization mode switching must not leave a timer or stale panels.
  await page.goto(`${BASE}/#visualize/code/loops`, { waitUntil: 'networkidle' });
  for (let round = 0; round < 3; round += 1) {
    for (const mode of ['flow', 'pointers', 'recursion', 'loops', 'code']) {
      await page.locator(`.viz-tab[data-viz-mode="${mode}"]`).click({ force: true });
    }
  }
  await expect(page.locator('.viz-tab.active')).toHaveCount(1);
  await expect(page.locator('.viz-tab[data-viz-mode="code"]')).toHaveClass(/active/);
  const playing = await page.evaluate(() => Boolean(VizState.timer));
  expect(playing).toBe(false);

  expect(errors).toEqual([]);
  await closeUser(user);
});

// ---------- Persona 6 - mistake-prone, every rejection path ----------
test('persona 6 gets honest feedback for every wrong or empty submission', async ({ browser }) => {
  const user = await newUser(browser, { width: 375, height: 812, mobile: true });
  const { page, errors } = user;

  await page.goto(`${BASE}/#quiz/c-basics`, { waitUntil: 'networkidle' });
  await page.locator('#quiz-check').click();
  await expect(page.locator('#quiz-feedback')).toContainText(/pick an answer/i);
  expect(await page.evaluate(() => quizSession.score)).toBe(0);

  const correct = await page.evaluate(() => quizSession.questions[0].correct);
  await page.locator(`.quiz-option[data-option="${(correct + 1) % 4}"]`).click();
  await page.locator('#quiz-check').click();
  await expect(page.locator('#quiz-feedback .feedback.bad')).toBeVisible();
  await expect(page.locator('.quiz-option.correct')).toHaveCount(1);
  expect(await page.evaluate(() => quizSession.score)).toBe(0);

  await page.goto(`${BASE}/#predict`, { waitUntil: 'networkidle' });
  await page.locator('#prediction-check').click();
  await expect(page.locator('#prediction-feedback')).toContainText(/type the output/i);

  await page.goto(`${BASE}/#logic`, { waitUntil: 'networkidle' });
  await page.locator('#analyzer-code').fill('int main( { this is not code');
  await page.locator('#analyze-btn').click();
  await expect(page.locator('#analyzer-results')).not.toBeEmpty();

  await page.goto(`${BASE}/#game`, { waitUntil: 'networkidle' });
  await page.locator('.quest-node:not([disabled])').first().click();
  if (await page.locator('[data-exec-action]').count()) {
    await page.locator('[data-exec-action="body"]').click();
    await expect(page.locator('#exec-feedback .feedback.bad')).toBeVisible();
    const log = await page.locator('#exec-log').innerText();
    expect(log).toContain('Wrong action');
  }

  expect(errors).toEqual([]);
  await closeUser(user);
});

// ---------- Persona 7 - returning user, persistence ----------
test('persona 7 keeps progress across reloads and never double-counts XP', async ({ browser }) => {
  const user = await newUser(browser, { width: 1280, height: 800 });
  const { page, errors } = user;

  await page.goto(`${BASE}/#quiz/c-basics`, { waitUntil: 'networkidle' });
  await runQuiz(page);
  const earned = await xp(page);
  expect(earned).toBeGreaterThan(0);

  await page.reload({ waitUntil: 'networkidle' });
  expect(await xp(page)).toBe(earned);
  const saved = await state(page);
  expect(saved.completedTopics).toContain('c-basics');

  await page.goto(`${BASE}/#lesson/c-basics`, { waitUntil: 'networkidle' });
  const completedBefore = saved.completedTopics.length;
  await page.evaluate(() => markTopicComplete('c-basics'));
  const savedAgain = await state(page);
  expect(savedAgain.completedTopics.length).toBe(completedBefore);
  expect(savedAgain.xp).toBe(saved.xp);

  const second = await newUser(browser, { width: 1280, height: 800 });
  expect(await xp(second.page)).toBe(0);
  await closeUser(second);

  expect(errors).toEqual([]);
  await closeUser(user);
});

// ---------- Persona 8 - keyboard only ----------
test('persona 8 can drive the app with the keyboard and is never trapped or leaked focus', async ({ browser }) => {
  const desktop = await newUser(browser, { width: 1440, height: 900 });
  const { page, errors } = desktop;

  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => {
    const el = document.activeElement;
    const style = getComputedStyle(el);
    return { tag: el.tagName, outline: style.outlineStyle, width: style.outlineWidth };
  });
  expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(outline.tag);
  expect(outline.outline === 'none' && outline.width === '0px').toBe(false);

  await page.locator('#help-btn').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#app-modal')).toHaveClass(/active/);

  // Tab must stay inside the dialog.
  for (let press = 0; press < 12; press += 1) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => document.getElementById('app-modal').contains(document.activeElement));
    expect(inside, 'focus escaped the modal').toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('#app-modal')).not.toHaveClass(/active/);

  const phone = await newUser(browser, { width: 375, height: 812, mobile: true });
  await phone.page.locator('body').click({ position: { x: 5, y: 5 } });
  for (let press = 0; press < 14; press += 1) {
    await phone.page.keyboard.press('Tab');
    const inHiddenDrawer = await phone.page.evaluate(() => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar.classList.contains('open')) return false;
      return sidebar.contains(document.activeElement);
    });
    expect(inHiddenDrawer, 'focus reached the closed off-canvas drawer').toBe(false);
  }

  expect(errors).toEqual([]);
  await closeUser(desktop);
  await closeUser(phone);
});

// ---------- Persona 9 - 320px small screen ----------
test('persona 9 finds no clipped content at 320px on any screen', async ({ browser }) => {
  test.setTimeout(120000);
  const user = await newUser(browser, { width: 320, height: 700, mobile: true });
  const { page, errors } = user;

  const problems = [];
  for (const route of ROUTES) {
    await page.goto(`${BASE}/#${route}`, { waitUntil: 'networkidle' });
    const metrics = await clipping(page);
    if (metrics.viewportOverflow > 0 || metrics.clippedContent > 1) {
      problems.push(`${route}: viewport +${metrics.viewportOverflow}px, content +${metrics.clippedContent}px`);
    }
  }
  expect(problems.join('\n')).toBe('');
  expect(errors).toEqual([]);
  await closeUser(user);
});

// ---------- Persona 10 - curious explorer ----------
test('persona 10 reaches every route, unknown routes, and never finds a blank screen', async ({ browser }) => {
  const user = await newUser(browser, { width: 1024, height: 768 });
  const { page, errors } = user;

  for (const route of ROUTES) {
    await page.goto(`${BASE}/#${route}`, { waitUntil: 'networkidle' });
    const text = await page.locator(`#${route}-screen`).innerText();
    expect(text.trim().length, `${route} rendered no content`).toBeGreaterThan(20);
  }

  await page.goto(`${BASE}/#not-a-route`, { waitUntil: 'networkidle' });
  await expect(page.locator('#dashboard-screen')).toHaveClass(/active/);
  expect(page.url()).toContain('#dashboard');

  await page.goto(`${BASE}/#lesson/does-not-exist`, { waitUntil: 'networkidle' });
  await expect(page.locator('#lesson-content h2')).not.toBeEmpty();

  for (const route of ['quiz/unknown', 'predict/unknown', 'visualize/code/unknown']) {
    await page.goto(`${BASE}/#${route}`, { waitUntil: 'networkidle' });
    const screen = route.split('/')[0];
    await expect(page.locator(`#${screen}-screen`)).toHaveClass(/active/);
  }

  expect(errors).toEqual([]);
  await closeUser(user);
});

// ---------- Persona 11 - performance-conscious ----------
test('persona 11 measures a real resource and DOM footprint', async ({ browser }) => {
  const user = await newUser(browser, { width: 1280, height: 800 });
  const { page, errors } = user;

  const failed = [];
  page.on('response', (response) => {
    if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
  });

  await page.reload({ waitUntil: 'networkidle' });
  const measured = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    const scripts = Array.from(document.querySelectorAll('script[src]')).map((tag) => tag.src);
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      scriptCount: scripts.length,
      resourceCount: resources.length,
      transferKB: Math.round(resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0) / 1024),
      domNodes: document.querySelectorAll('*').length,
      domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd)
    };
  });

  console.log('PERF', JSON.stringify(measured));
  expect(measured.scriptCount).toBeLessThanOrEqual(21);
  expect(measured.domNodes).toBeLessThan(1600);
  expect(failed, `failed requests: ${failed.join(', ')}`).toEqual([]);
  expect(errors).toEqual([]);
  await closeUser(user);
});

// ---------- Persona 12 - skeptical power user ----------
test('persona 12 checks that displayed scores, XP and claims are real', async ({ browser }) => {
  const user = await newUser(browser, { width: 1440, height: 900 });
  const { page, errors } = user;

  const xpBefore = await xp(page);
  await page.goto(`${BASE}/#quiz/c-basics`, { waitUntil: 'networkidle' });
  const total = await page.evaluate(() => quizSession.questions.length);
  await runQuiz(page);
  const saved = await state(page);
  expect(saved.quizScores['c-basics']).toEqual({ score: total, total, percentage: 100 });
  // +20 for passing the quiz, +10 for the first completion of the topic.
  expect(await xp(page)).toBe(xpBefore + 30);

  await page.goto(`${BASE}/#progress`, { waitUntil: 'networkidle' });
  await expect(page.locator('#progress-content')).toContainText(`${total}/${total}`);
  await expect(page.locator('#progress-content')).toContainText('100%');

  await page.goto(`${BASE}/#chatbot`, { waitUntil: 'networkidle' });
  await expect(page.locator('.chat-head')).toContainText('Not an LLM');
  await page.locator('#chat-input').fill('explain pointers');
  await page.locator('#chat-send').click();
  await expect(page.locator('#chat-messages')).toContainText(/pointer/i);

  await page.goto(`${BASE}/#logic`, { waitUntil: 'networkidle' });
  await expect(page.locator('#logic-screen')).toContainText('not a compiler');

  await page.goto(`${BASE}/#visualize/code/pointers`, { waitUntil: 'networkidle' });
  await expect(page.locator('#visualize-content')).toContainText('authored walkthrough');

  expect(errors).toEqual([]);
  await closeUser(user);
});

// ---------- Adversarial input ----------
test('adversarial input is escaped, bounded and never executed', async ({ browser }) => {
  const user = await newUser(browser, { width: 1280, height: 800 });
  const { page, errors } = user;

  await page.goto(`${BASE}/#chatbot`, { waitUntil: 'networkidle' });
  const payload = '<img src=x onerror="window.__xss=1">';
  await page.locator('#chat-input').fill(payload);
  await page.locator('#chat-send').click();
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
  await expect(page.locator('#chat-messages')).toContainText('<img src=x');

  const long = 'a'.repeat(2000);
  await page.evaluate((value) => {
    const input = document.getElementById('chat-input');
    input.value = value;
  }, long);
  await page.locator('#chat-send').click();
  await expect(page.locator('#chat-messages')).toContainText(/under 500|too long|500/i);

  await page.goto(`${BASE}/#logic`, { waitUntil: 'networkidle' });
  await page.locator('#analyzer-code').fill(payload);
  await page.locator('#analyze-btn').click();
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
  await expect(page.locator('#analyzer-results')).not.toBeEmpty();

  expect(errors).toEqual([]);
  await closeUser(user);
});

// ---------- Storage resilience ----------
test('corrupted and missing storage both recover without a broken app', async ({ browser }) => {
  const corrupted = await newUser(browser, {
    width: 1024,
    height: 768,
    seed: {
      codeflow_app_state: '{"xp":"lots","completedTopics":"nope"}',
      codeflow_adaptive_state: '<<<not json>>>',
      codeflow_logic_quest: 'null'
    }
  });
  await expect(corrupted.page.locator('#dashboard-content .rail-row').first()).toBeVisible();
  expect(await xp(corrupted.page)).toBe(0);
  await corrupted.page.goto(`${BASE}/#practice`, { waitUntil: 'networkidle' });
  await expect(corrupted.page.locator('#practice-content')).not.toBeEmpty();
  expect(corrupted.errors, `console errors: ${corrupted.errors.join(' | ')}`).toEqual([]);
  await closeUser(corrupted);

  const blocked = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  await blocked.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() { throw new Error('storage disabled'); }
    });
  });
  const page = await blocked.newPage();
  await page.goto(`${BASE}/#dashboard`, { waitUntil: 'networkidle' });
  await expect(page.locator('#dashboard-content .rail-row').first()).toBeVisible();
  await page.locator('#dashboard-content .rail-row .rail-link').first().click();
  await expect(page.locator('#lesson-screen')).toHaveClass(/active/);
  await blocked.close();
});

// ---------- Responsive device matrix ----------
const MATRIX_SMALL = [[320, 700], [375, 812], [393, 852], [412, 915]];
const MATRIX_LARGE = [[768, 1024], [1024, 768], [1280, 800], [1440, 900], [1920, 1080]];

async function matrix(browser, sizes) {
  const report = [];
  for (const [width, height] of sizes) {
    const user = await newUser(browser, { width, height, mobile: width < 768 });
    for (const route of ROUTES) {
      await user.page.goto(`${BASE}/#${route}`, { waitUntil: 'networkidle' });
      const metrics = await clipping(user.page);
      if (metrics.viewportOverflow > 0 || metrics.clippedContent > 1) {
        report.push(`${width}x${height} ${route}: viewport +${metrics.viewportOverflow}, clipped +${metrics.clippedContent}`);
      }
    }
    await closeUser(user);
  }
  return report;
}

test('responsive matrix - small viewports', async ({ browser }) => {
  test.setTimeout(240000);
  const report = await matrix(browser, MATRIX_SMALL);
  expect(report.join('\n')).toBe('');
});

test('responsive matrix - tablet and desktop viewports', async ({ browser }) => {
  test.setTimeout(240000);
  const report = await matrix(browser, MATRIX_LARGE);
  expect(report.join('\n')).toBe('');
});
