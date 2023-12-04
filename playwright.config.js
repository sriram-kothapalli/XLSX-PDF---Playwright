import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 5000,
  retries: 1,
  reporter: 'html',
  projects: [
    {
      use: {
        baseURL: '****URL****',
        contextOptions: { ignoreHTTPSErrors: true },
        viewport: { width: 1366, height: 768 },
        browserName: 'chromium',
        launchOptions: { headless: false },
        trace: 'off',
      },
    },
  ],
  contextOptions: { ignoreHTTPSErrors: true },
  DB: {
    user: '****',
    password: '****',
    host: '****',
    port: 1234,
    database: '****',
    ssl: { rejectUnauthorized: false },
  }
});
