import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Scenius E2E tests.
 *
 * Tests run against the production Vercel deployment by default.
 * Override with BASE_URL env var for preview deployments or local testing.
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
    // Run against production by default, override with BASE_URL env var
    baseURL: process.env.BASE_URL || 'https://scenius-seven.vercel.app',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
