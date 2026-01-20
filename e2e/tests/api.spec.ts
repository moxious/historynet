import { test, expect } from '@playwright/test';

/**
 * API endpoint tests for Scenius.
 *
 * Verifies that serverless functions are working correctly.
 * These tests only run against production/Vercel deployments since
 * the API endpoints are serverless functions not available in local preview.
 *
 * To run against production: BASE_URL=https://scenius-seven.vercel.app npm run test:e2e
 */

const isLocalBuild = !process.env.BASE_URL?.includes('vercel.app');

test.describe('Health API', () => {
  test.skip(isLocalBuild, 'API tests require Vercel deployment');

  test('returns OK status with expected fields', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.timestamp).toBeTruthy();
    expect(body.environment).toBeDefined();
  });
});

test.describe('OG Image API', () => {
  test.skip(isLocalBuild, 'API tests require Vercel deployment');

  test('returns image for default/homepage', async ({ request }) => {
    const response = await request.get('/api/og');

    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('image/');
  });

  test('returns image for dataset', async ({ request }) => {
    const response = await request.get('/api/og?dataset=ai-llm-research');

    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('image/');
  });

  test('returns image for node', async ({ request }) => {
    const response = await request.get(
      '/api/og?dataset=ai-llm-research&node=person-geoffrey-hinton'
    );

    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('image/');
  });

  test('returns fallback image for invalid dataset', async ({ request }) => {
    const response = await request.get('/api/og?dataset=nonexistent-dataset');

    // Should still return 200 with default image (graceful fallback)
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('image/');
  });
});
