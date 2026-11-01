const { defineConfig, devices } = require('@playwright/test');

const BASE = process.env.CODEFLOW_BASE_URL || 'https://codeflow-app-sigma.vercel.app';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 45000,
  expect: { timeout: 7000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: BASE,
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'prod-desktop-1280', testMatch: 'e2e.spec.js', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'prod-desktop-1440', testMatch: 'e2e.spec.js', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'prod-mobile-393', testMatch: 'e2e.spec.js', use: { ...devices['Pixel 5'] } },
    { name: 'prod-qa', testMatch: 'qa.production.spec.js', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } }
  ]
});
