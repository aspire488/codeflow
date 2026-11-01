// Visual inspection harness: captures every screen at desktop and mobile sizes.
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
  ['game', '#game'],
  ['logic', '#logic'],
  ['chatbot', '#chatbot'],
  ['practice', '#practice'],
  ['progress', '#progress']
];

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const server = spawn(process.execPath, ['tests/static-server.cjs', String(port)], { stdio: 'ignore' });

  const browser = await chromium.launch();
  const errors = [];

  async function shoot(label, width, height, isMobile) {
    const context = await browser.newContext({
      viewport: { width, height },
      isMobile: Boolean(isMobile),
      hasTouch: Boolean(isMobile),
      deviceScaleFactor: 1
    });
    const page = await context.newPage();
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`${label}: ${message.text()}`); });
    page.on('pageerror', (error) => errors.push(`${label}: ${error.message}`));

    for (const [name, hash] of SHOTS) {
      await page.goto(`${base}/${hash}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      if (isMobile) {
        // Capture the mobile nav drawer on the dashboard only.
        if (name === 'dashboard') {
          await page.locator('#mobile-menu-btn').click();
          await page.waitForTimeout(400);
          await page.screenshot({ path: path.join(outDir, `mobile-nav.png`) });
          await page.keyboard.press('Escape');
          await page.waitForTimeout(400);
        }
      }
      const suffix = isMobile ? 'mobile' : 'desktop';
      await page.screenshot({ path: path.join(outDir, `${name}-${suffix}.png`), fullPage: false });
    }

    // Modal state on desktop.
    if (!isMobile) {
      await page.goto(`${base}/#dashboard`, { waitUntil: 'networkidle' });
      await page.locator('#help-btn').click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(outDir, 'modal-desktop.png') });
    }

    await context.close();
  }

  await shoot('desktop', 1440, 900, false);
  await shoot('mobile', 393, 852, true);

  await browser.close();
  server.kill();

  fs.writeFileSync(path.join(outDir, 'console-errors.txt'), errors.join('\n'));
  console.log(`Captured ${SHOTS.length * 2 + 2} screenshots into ${outDir}; console errors: ${errors.length}`);
  errors.slice(0, 10).forEach((error) => console.log('ERR', error));
}

main().catch((error) => { console.error(error); process.exit(1); });
