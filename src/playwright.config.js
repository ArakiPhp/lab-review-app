/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './e2e',
  globalSetup: './e2e/global-setup.js',
  fullyParallel: false,
  retries: 1,
  timeout: 30000,
  use: {
    baseURL: 'http://localhost',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  reporter: [['html', { open: 'never' }], ['list']],
};

export default config;
