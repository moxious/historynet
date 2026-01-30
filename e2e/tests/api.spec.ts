import { test, expect } from '@playwright/test';

/**
 * API endpoint tests for Scenius.
 *
 * Verifies that serverless functions are working correctly.
 * Tests run against local dev server or production deployments.
 * Note: OG Image API tests are skipped in local/CI as they require Vercel's runtime.
 */

const isProduction = process.env.BASE_URL?.includes('vercel.app');

test.describe('Health API', () => {

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
  // Skip OG API tests in local/CI - they require Vercel's runtime and WASM support
  test.skip(!isProduction, 'OG API requires Vercel runtime');

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
