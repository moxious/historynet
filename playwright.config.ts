import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Scenius E2E tests.
 *
 * Tests build the app and run against a local preview server.
 * This ensures PRs are tested before merge, not after deploy.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  /* Run E2E server to serve both frontend and API */
  webServer: {
    command: 'npm run e2e:server',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes for build and startup
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
