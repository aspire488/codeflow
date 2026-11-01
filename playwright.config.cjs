const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 7000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'desktop-chromium', testMatch: 'e2e.spec.js', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile-chromium', testMatch: 'e2e.spec.js', use: { ...devices['Pixel 5'] } },
    { name: 'regression', testMatch: 'regression.spec.js', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'qa', testMatch: 'qa.spec.js', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } }
  ],
  webServer: {
    command: 'node tests/static-server.cjs 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 20000
  }
});
