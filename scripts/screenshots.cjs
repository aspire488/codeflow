// Visual inspection harness: captures every screen, plus key states, at desktop and mobile sizes.
// Usage: node scripts/screenshots.cjs [outDir]
const { chromium } = require('@playwright/test');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const outDir = process.argv[2] || 'screenshots';
const port = 4188;
const base = `http://127.0.0.1:${port}`;

const SHOTS = [
  ['dashboard', '#dashboard'],
  ['topics', '#topics'],
  ['lesson', '#lesson/c-basics'],
  ['lesson-pointers', '#lesson/pointers'],
  ['quiz-list', '#quiz'],
  ['quiz-question', '#quiz/c-basics'],
  ['predict', '#predict'],
  ['viz-code', '#visualize/code/loops'],
  ['viz-flow', '#visualize/flow/loops'],
  ['viz-pointers', '#visualize/pointers/loops'],
  ['viz-recursion', '#visualize/recursion/recursion'],
  ['viz-loops', '#visualize/loops/loops'],
  ['viz-unsupported', '#visualize/code/html-basics'],
  ['game', '#game'],
  ['logic', '#logic'],
  ['chatbot', '#chatbot'],
  ['practice', '#practice'],
  ['progress', '#progress']
];

// Seeded progress used by the "state" shots below.
const SEED = {
  codeflow_app_state: {
    xp: 150,
    streak: 0,
    completedTopics: ['c-basics', 'variables', 'operators', 'loops'],
    quizScores: { 'c-basics': { score: 4, total: 5, percentage: 80 }, loops: { score: 3, total: 5, percentage: 60 } },
    currentTopic: 'loops'
  },
  codeflow_logic_quest: { completedLevels: ['loops-1', 'loops-2', 'nested-loops-1'], totalXP: 45, attempts: 2 },
  codeflow_adaptive_state: { loops: { correct: 3, wrong: 2, streak: 0, mastered: false }, operators: { correct: 1, wrong: 1, streak: 0, mastered: false } }
};

async function seed(page) {
  await page.goto(`${base}/#dashboard`, { waitUntil: 'networkidle' });
  await page.evaluate((state) => { Object.entries(state).forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value))); }, SEED);
  await page.reload({ waitUntil: 'networkidle' });
}

async function answer(page, wrong) {
  const correct = await page.evaluate(() => quizSession.questions[quizSession.index].correct);
  const pick = wrong ? (correct + 1) % 4 : correct;
  await page.locator(`.quiz-option[data-option="${pick}"]`).click();
  await page.locator('#quiz-check').click();
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const server = spawn(process.execPath, ['tests/static-server.cjs', String(port)], { stdio: 'ignore' });

  const browser = await chromium.launch();
  const errors = [];
  let count = 0;

  async function shoot(label, width, height, isMobile) {
    const suffix = isMobile ? 'mobile' : 'desktop';
    const context = await browser.newContext({
      viewport: { width, height },
      isMobile: Boolean(isMobile),
      hasTouch: Boolean(isMobile),
      deviceScaleFactor: 1
    });
    const page = await context.newPage();
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`${label}: ${message.text()}`); });
    page.on('pageerror', (error) => errors.push(`${label}: ${error.message}`));
    const snap = async (name) => {
      await page.evaluate(() => {
        const active = document.querySelector('.screen.active .screen-scroll');
        if (active) active.scrollTop = 0;
      });
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(outDir, `${name}-${suffix}.png`), fullPage: false });
      count += 1;
    };

    for (const [name, hash] of SHOTS) {
      await page.goto(`${base}/${hash}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      if (isMobile && name === 'dashboard') {
        await page.locator('#mobile-menu-btn').click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(outDir, 'mobile-nav.png') });
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
      await snap(name);
    }

    // Seeded progress.
    await seed(page);
    for (const [name, hash] of [['s-dashboard', '#dashboard'], ['s-progress', '#progress'], ['s-practice', '#practice'], ['s-game', '#game'], ['s-quiz-list', '#quiz'], ['s-predict', '#predict']]) {
      await page.goto(`${base}/#topics`, { waitUntil: 'networkidle' });
      await page.goto(`${base}/${hash}`, { waitUntil: 'networkidle' });
      await snap(name);
    }

    // Quest play screens.
    await page.goto(`${base}/#game`, { waitUntil: 'networkidle' });
    await page.locator('.quest-node.current').click();
    await snap('s-quest-play');
    await page.locator('[data-quest-option]').nth(3).click();
    await snap('s-quest-wrong');

    // Mid-quiz after a wrong answer, then results.
    await page.goto(`${base}/#quiz/c-basics`, { waitUntil: 'networkidle' });
    await answer(page, false);
    await page.locator('#quiz-next').click();
    await answer(page, true);
    await snap('s-quiz-wrong');
    for (let guard = 0; guard < 30; guard += 1) {
      await page.locator('#quiz-next').click();
      if (await page.locator('.result-score').count()) break;
      await answer(page, guard % 2 === 0);
    }
    await snap('s-quiz-result');

    // Mid-walkthrough steps.
    for (const [name, hash, steps] of [['s-viz-code', '#visualize/code/loops', 3], ['s-viz-loops', '#visualize/loops/loops', 3], ['s-viz-recursion', '#visualize/recursion/recursion', 5], ['s-viz-pointers', '#visualize/pointers/loops', 2]]) {
      await page.goto(`${base}/#topics`, { waitUntil: 'networkidle' });
      await page.goto(`${base}/${hash}`, { waitUntil: 'networkidle' });
      for (let i = 0; i < steps; i += 1) await page.locator('#viz-next').click();
      await snap(name);
    }

    // Analyzer after a run, chat after a message, prediction after a wrong answer.
    await page.goto(`${base}/#logic`, { waitUntil: 'networkidle' });
    await page.locator('[data-analyzer-sample="javascript"]').click();
    await snap('s-logic-run');
    await page.locator('#analyzer-language').selectOption('html');
    await page.locator('#analyzer-code').fill('<main>\n  <h1>Hi</h1>\n  <ul><li>One</li></ul>\n</main>');
    await page.locator('#analyze-btn').click();
    await snap('s-logic-html');
    await page.goto(`${base}/#chatbot`, { waitUntil: 'networkidle' });
    await page.locator('.suggest-chip').first().click();
    await snap('s-chat');
    await page.goto(`${base}/#predict`, { waitUntil: 'networkidle' });
    await page.locator('#prediction-input').fill('definitely wrong');
    await page.locator('#prediction-check').click();
    await snap('s-predict-wrong');

    // Dialogs.
    await page.goto(`${base}/#progress`, { waitUntil: 'networkidle' });
    await page.locator('.progress-settings summary').click();
    await page.locator('[data-action="reset-progress"]').click();
    await snap('s-modal-reset');
    await page.locator('#app-modal-close').click();
    await page.locator('#app-modal').waitFor({ state: 'hidden' });
    await page.locator('#help-btn').click();
    await snap('s-modal-help');
    await page.locator('#app-modal-close').click();
    await page.locator('#app-modal').waitFor({ state: 'hidden' });

    // Theme variants across the primary learning surfaces.
    await page.goto(`${base}/#progress`, { waitUntil: 'networkidle' });
    await page.locator('#theme-toggle').click();
    await snap('progress-light');
    await page.goto(`${base}/#dashboard`, { waitUntil: 'networkidle' });
    await snap('dashboard-light');
    await page.goto(`${base}/#visualize/code/loops`, { waitUntil: 'networkidle' });
    await snap('visualizer-light');
    await page.locator('#theme-toggle').click();

    await context.close();
  }

  await shoot('desktop', 1440, 900, false);
  await shoot('mobile', 393, 852, true);

  // Short phone: transport must be reachable without scrolling.
  const small = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });
  const smallPage = await small.newPage();
  await smallPage.goto(`${base}/#visualize/code/loops`, { waitUntil: 'networkidle' });
  await smallPage.waitForTimeout(300);
  await smallPage.screenshot({ path: path.join(outDir, 'viz-code-667.png') });
  await small.close();

  await browser.close();
  server.kill();

  fs.writeFileSync(path.join(outDir, 'console-errors.txt'), errors.join('\n'));
  console.log(`Captured ${count} screenshots into ${outDir}; console errors: ${errors.length}`);
  errors.slice(0, 10).forEach((error) => console.log('ERR', error));
}

main().catch((error) => { console.error(error); process.exit(1); });
