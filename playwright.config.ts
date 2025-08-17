import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  reporter: process.env.CI ? 
    [
      ['list'],
      ['allure-playwright', {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: false
      }],
      ['html', { outputFolder: 'playwright-report' }],
      ['junit', { outputFile: 'test-results/junit.xml' }]
    ] : 
    [
      ['list'],
      ['allure-playwright']
    ],
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
});