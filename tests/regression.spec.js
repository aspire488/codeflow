// Browser regression tests for the audit fixes. Each test starts from empty storage.
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { try { localStorage.clear(); } catch (_) { /* ignore */ } });
  await page.reload();
});

const topicIds = (page) => page.evaluate(() => Object.keys(TOPICS_DB));
const seedState = async (page, state) => {
  await page.evaluate((s) => localStorage.setItem('codeflow_app_state', JSON.stringify(s)), state);
  await page.reload();
};

async function finishQuiz(page, topicId, { wrongCount = 0 } = {}) {
  await page.goto('/#dashboard'); // same-hash goto would not re-render
  await page.goto(`/#quiz/${topicId}`);
  let wrong = wrongCount;
  for (let guard = 0; guard < 30; guard += 1) {
    if (await page.locator('.result-score').count()) break;
    const correct = await page.evaluate(() => quizSession.questions[quizSession.index].correct);
    const pick = wrong > 0 ? (correct + 1) % 4 : correct;
    if (wrong > 0) wrong -= 1;
    await page.locator(`.quiz-option[data-option="${pick}"]`).click();
    await page.locator('#quiz-check').click();
    await page.locator('#quiz-next').click();
  }
  await expect(page.locator('.result-score')).toBeVisible();
}

const xpValue = async (page) => Number((await page.locator('#xp-chip').innerText()).match(/\d+/)[0]);

test('analyzer escapes node labels (img onerror payload does not run)', async ({ page }) => {
  await page.goto('/#logic');
  await page.locator('#analyzer-code').fill('q = <img src=1 onerror="window.__pwned=1">;');
  await page.locator('#analyze-btn').click();
  await expect(page.locator('#analyzer-results')).toContainText('Logical nodes');
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.__pwned)).toBeUndefined();
  expect(await page.locator('#analyzer-results img').count()).toBe(0);
  await expect(page.locator('#analyzer-results')).toContainText('<img');
});

test('analyzer is honest: no Complexity/Findings cards, says it does not check for bugs, input capped', async ({ page }) => {
  await page.goto('/#logic');
  await page.locator('#analyzer-code').fill('for(;;){}');
  await page.locator('#analyze-btn').click();
  await expect(page.locator('#analyzer-results')).toContainText('Logical nodes');
  await expect(page.locator('#analyzer-results')).not.toContainText(/Complexity|Findings/);
  await expect(page.locator('#logic-screen')).toContainText('does not check for bugs');
  await expect(page.locator('#analyzer-code')).toHaveAttribute('maxlength', '10000');
});

test('analyzer: C text inside strings/comments is not reported as a loop', async ({ page }) => {
  await page.goto('/#logic');
  await page.locator('#analyzer-code').fill('printf("for while");\n// while(1)\nformat = 1;');
  await page.locator('#analyze-btn').click();
  await expect(page.locator('#analyzer-results')).toContainText('printf');
  await expect(page.locator('#analyzer-results')).not.toContainText('Loop');
});

test('topics/<subject> shows that subject with its chip active', async ({ page }) => {
  const expected = await page.evaluate(() => Object.values(TOPICS_DB).filter((t) => t.subject === 'css').length);
  expect(expected).toBeGreaterThan(0);
  await page.goto('/#topics/css');
  await expect(page.locator('#topics-content .topic-row')).toHaveCount(expected);
  await expect(page.locator('#topics-content .filter-chip.active')).toContainText('CSS');
  await page.locator('#topics-content .filter-chip', { hasText: 'HTML' }).click();
  await expect(page.locator('#topics-content .filter-chip.active')).toContainText('HTML');
});

test('malformed and prototype-key route params are handled', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/#quiz/%E0%A4%A');
  await expect(page.locator('#dashboard-screen')).toHaveClass(/active/);
  await page.goto('/#lesson/__proto__');
  await expect(page.locator('#lesson-content h2.screen-title')).not.toBeEmpty();
  expect(await page.evaluate(() => AppState.currentTopic)).not.toBe('__proto__');
  await page.goto('/#quiz/constructor');
  await expect(page.locator('#quiz-content .screen-title')).toContainText('Quiz center');
  expect(errors).toEqual([]);
});

test('quiz XP is paid once on first pass; retakes keep the best score and explain why', async ({ page }) => {
  const [topic] = await topicIds(page);
  await finishQuiz(page, topic);
  await expect(page.locator('.result-card')).toContainText('+20 XP');
  const afterFirst = await xpValue(page);
  expect(afterFirst).toBeGreaterThanOrEqual(20);

  await finishQuiz(page, topic);
  await expect(page.locator('.result-card')).toContainText('Already passed: no extra XP');
  expect(await xpValue(page)).toBe(afterFirst);

  const best = await page.evaluate((t) => AppState.quizScores[t].percentage, topic);
  await finishQuiz(page, topic, { wrongCount: 99 });
  await expect(page.locator('.result-card')).toContainText('Best score kept');
  expect(await xpValue(page)).toBe(afterFirst);
  expect(await page.evaluate((t) => AppState.quizScores[t].percentage, topic)).toBe(best);
});

test('a failed first attempt pays no XP and says why', async ({ page }) => {
  const [topic] = await topicIds(page);
  await finishQuiz(page, topic, { wrongCount: 99 });
  await expect(page.locator('.result-card')).toContainText('No XP yet');
  expect(await xpValue(page)).toBe(0);
});

test('state: absurd XP, duplicate and unknown topics are sanitised on load', async ({ page }) => {
  const [first] = await topicIds(page);
  await seedState(page, { xp: 1e306, completedTopics: [first, first, 'not-a-topic'], quizScores: {} });
  expect(await page.evaluate(() => AppState.completedTopics)).toEqual([first]);
  await expect(page.locator('#sidebar-level')).not.toContainText('e+');
  expect(await xpValue(page)).toBeLessThanOrEqual(1000000);
});

test('state: progress written by another tab is adopted and never overwritten', async ({ page, context }) => {
  const [a, b] = await topicIds(page);
  const other = await context.newPage();
  await other.goto('/#dashboard');
  await page.evaluate((t) => markTopicComplete(t), a);
  // The other tab loaded before that write; its own write must not erase it.
  await other.evaluate((t) => markTopicComplete(t), b);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('codeflow_app_state')).completedTopics);
  expect(stored).toEqual(expect.arrayContaining([a, b]));
  await expect.poll(() => page.evaluate(() => AppState.completedTopics.length)).toBe(2);
  await other.close();
});

test('state: a failed storage write shows a visible warning', async ({ page }) => {
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('quota'); }; });
  await page.evaluate(() => addXP(5));
  await expect(page.locator('#toast')).toHaveClass(/show/);
  await expect(page.locator('#toast')).toContainText('could not be saved');
});

test('Continue lesson goes to the next incomplete topic in course order, then says all done', async ({ page }) => {
  const ids = await topicIds(page);
  await seedState(page, { xp: 0, completedTopics: [ids[0], ids[1]], quizScores: {}, currentTopic: ids[1] });
  await page.goto('/#dashboard');
  await page.getByRole('link', { name: 'Continue lesson' }).click();
  await expect(page).toHaveURL(new RegExp(`#lesson/${ids[2]}$`));

  await seedState(page, { xp: 0, completedTopics: ids, quizScores: {} });
  await page.goto('/#dashboard');
  await expect(page.locator('#dashboard-content')).toContainText('All topics completed');
  await expect(page.getByRole('link', { name: /Continue lesson|Start lesson/ })).toHaveCount(0);
});

test('quiz: feedback is a live region, options expose state, focus moves to Next after checking', async ({ page }) => {
  const [topic] = await topicIds(page);
  await page.goto(`/#quiz/${topic}`);
  await expect(page.locator('#quiz-feedback')).toHaveAttribute('role', 'status');
  await expect(page.locator('#quiz-feedback')).toHaveAttribute('aria-live', 'polite');
  const option = page.locator('.quiz-option[data-option="0"]');
  await option.click();
  await expect(option).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#quiz-check').click();
  await expect(page.locator('#quiz-next')).toBeFocused();
});

test('chrome: active nav item has aria-current, icons are hidden from names, heading receives focus', async ({ page }) => {
  await page.goto('/#progress');
  await expect(page.locator('.nav-item[data-nav="progress"]')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.nav-item[data-nav="dashboard"]')).not.toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('button', { name: 'Dashboard', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Study assistant', exact: true })).toBeVisible();
  await expect(page.locator('#progress-content h2')).toBeFocused();
  expect(await page.locator('#viz-tabs [role="tab"]').count()).toBe(0);
});

test('mobile drawer: focus goes in, page is inert, Escape restores focus to the menu button', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/#dashboard');
  await page.locator('#mobile-menu-btn').click();
  await expect(page.locator('#sidebar')).toHaveClass(/open/);
  await expect(page.locator('#sidebar .nav-item').first()).toBeFocused();
  expect(await page.evaluate(() => document.getElementById('screen-container').inert)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu-btn')).toBeFocused();
  expect(await page.evaluate(() => document.getElementById('screen-container').inert)).toBe(false);
  await context.close();
});

test('CSP is served and no route trips it', async ({ page }) => {
  const violations = [];
  page.on('console', (m) => { if (/Content Security Policy|Refused to/i.test(m.text())) violations.push(m.text()); });
  const response = await page.reload();
  expect(response.headers()['content-security-policy']).toContain("script-src 'self'");
  for (const route of ['dashboard', 'topics', 'lesson', 'quiz', 'predict', 'visualize', 'game', 'logic', 'chatbot', 'practice', 'progress']) {
    await page.goto(`/#${route}`);
    await page.waitForTimeout(100);
  }
  expect(violations).toEqual([]);
});

test('Next up: a new user starts at lesson 1 of the first subject', async ({ page }) => {
  const [first] = await topicIds(page);
  const info = await page.evaluate((id) => ({ title: TOPICS_DB[id].title, total: Object.values(TOPICS_DB).filter((t) => t.subject === TOPICS_DB[id].subject).length }), first);
  await page.goto('/#dashboard');
  await expect(page.locator('#dashboard-content .next-title')).toHaveText(info.title);
  await expect(page.locator('#dashboard-content .next-meta')).toHaveText(`C Programming, lesson 1 of ${info.total}`);
  await expect(page.getByRole('link', { name: 'Start lesson' })).toHaveAttribute('href', `#lesson/${first}`);
  await expect(page.locator('#dashboard-content .rail-node.current')).toHaveCount(1);
  await expect(page.locator('#dashboard-content .rail-node.done')).toHaveCount(0);
  await expect(page.locator('#dashboard-content')).not.toContainText(/\b0 XP\b|streak/i); // no zero stats, no invented streak
});

test('Next up: mid-course shows the first incomplete topic, honest label, last done row and quiet quiz link', async ({ page }) => {
  const ids = await topicIds(page);
  await seedState(page, { xp: 30, completedTopics: [ids[0], ids[1]], quizScores: {}, currentTopic: ids[1] });
  await page.goto('/#dashboard');
  const nextTitle = await page.evaluate((id) => TOPICS_DB[id].title, ids[2]);
  await expect(page.locator('#dashboard-content .next-title')).toHaveText(nextTitle);
  await expect(page.locator('#dashboard-content .next-meta')).toContainText('lesson 3 of');
  await expect(page.getByRole('link', { name: 'Continue lesson' })).toHaveAttribute('href', `#lesson/${ids[2]}`);
  await expect(page.getByRole('link', { name: 'Take the quiz' })).toHaveAttribute('href', `#quiz/${ids[2]}`);
  await expect(page.getByRole('link', { name: 'Visualize the code' })).toHaveAttribute('href', `#visualize/code/${ids[2]}`);
  await expect(page.locator('#dashboard-content .rail-row.is-current .rail-link')).toHaveAttribute('href', `#lesson/${ids[2]}`);
  await expect(page.locator('#dashboard-content .rail-node.done')).toHaveCount(1); // only the last completed row
  await expect(page.locator('#dashboard-content')).toContainText('30 XP');
});

test('Next up: when every topic is done the dashboard says so and offers no lesson to continue', async ({ page }) => {
  const ids = await topicIds(page);
  await seedState(page, { xp: 0, completedTopics: ids, quizScores: {} });
  await page.goto('/#dashboard');
  await expect(page.locator('#dashboard-content .next-title')).toHaveText('All topics completed');
  await expect(page.locator('#dashboard-content .rail-node.current')).toHaveCount(0);
});

test('Lessons nav item opens the next incomplete lesson and puts it in the URL', async ({ page }) => {
  const ids = await topicIds(page);
  await seedState(page, { xp: 0, completedTopics: [ids[0]], quizScores: {}, currentTopic: ids[0] });
  await page.goto('/#dashboard');
  await page.locator('.nav-item[data-nav="lesson"]').click();
  await expect(page).toHaveURL(new RegExp(`#lesson/${ids[1]}$`));
  await expect(page.locator('#lesson-content .lesson-meta')).toContainText('lesson 2 of');
});

test('topic search filters title and description live, Escape clears, no-match state has a working Clear', async ({ page }) => {
  await page.goto('/#topics');
  const total = await page.locator('#topics-content .topic-row').count();
  expect(total).toBeGreaterThan(50);
  const search = page.locator('#topic-search');

  await search.fill('pointer');
  const matches = await page.evaluate(() => Object.values(TOPICS_DB).filter((t) => (t.title + ' ' + (t.concept[0] || '')).toLowerCase().includes('pointer')).length);
  await expect(page.locator('#topics-content .topic-row:visible')).toHaveCount(matches);
  await expect(page.locator('#topic-status')).toContainText(`${matches} of ${total} topics match`);

  await search.press('Escape');
  await expect(search).toHaveValue('');
  await expect(page.locator('#topics-content .topic-row:visible')).toHaveCount(total);

  await search.fill('zzzqqq');
  await expect(page.locator('#topics-content .topic-row:visible')).toHaveCount(0);
  await expect(page.locator('#topic-empty')).toContainText('No topics match');
  await page.locator('#topic-clear').click();
  await expect(page.locator('#topics-content .topic-row:visible')).toHaveCount(total);
  await expect(page.locator('#topic-empty')).toBeHidden();
  await expect(search).toBeFocused();
});

test('topic rows: link and buttons are separate, quiz score shows, rows are semantic list items', async ({ page }) => {
  const ids = await topicIds(page);
  await seedState(page, { xp: 0, completedTopics: [ids[0]], quizScores: { [ids[0]]: { score: 2, total: 3, percentage: 67 } } });
  await page.goto('/#topics');
  const row = page.locator(`#topics-content li.topic-row[data-topic="${ids[0]}"]`);
  await expect(row.locator('a.topic-link')).toHaveAttribute('href', `#lesson/${ids[0]}`);
  await expect(row.locator('.topic-score')).toContainText('67%');
  await expect(row.locator('button[data-action="start-quiz"]')).toBeVisible();
  await expect(row.locator('button[data-action="visualize"]')).toBeVisible();
  expect(await row.locator('a button, button a').count()).toBe(0);
  await row.locator('button[data-action="start-quiz"]').click();
  await expect(page).toHaveURL(new RegExp(`#quiz/${ids[0]}$`));
});

test('lesson: reading width, labelled scrollable code region, end-of-lesson next steps with titled neighbours', async ({ page }) => {
  const ids = await topicIds(page);
  await page.goto(`/#lesson/${ids[1]}`);
  const region = page.locator('#lesson-content .code-scroll');
  await expect(region).toHaveAttribute('tabindex', '0');
  await expect(region).toHaveAttribute('aria-label', /Example code for/);
  const prose = await page.locator('#lesson-content .lesson-sec.lesson-prose').first().evaluate((el) => el.getBoundingClientRect().width);
  expect(prose).toBeLessThanOrEqual(760);
  await expect(page.getByRole('link', { name: 'Take the quiz' })).toHaveAttribute('href', `#quiz/${ids[1]}`);
  await expect(page.getByRole('link', { name: 'Visualize this code' })).toHaveAttribute('href', `#visualize/code/${ids[1]}`);
  const [prevTitle, nextTitle] = await page.evaluate((i) => [TOPICS_DB[i[0]].title, TOPICS_DB[i[2]].title], ids.slice(0, 3));
  await expect(page.locator('.pager-link.prev .pager-title')).toHaveText(prevTitle);
  await expect(page.locator('.pager-link.next .pager-title')).toHaveText(nextTitle);
});
