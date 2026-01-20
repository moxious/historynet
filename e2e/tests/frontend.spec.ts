import { test, expect } from '@playwright/test';

/**
 * Frontend rendering tests for Scenius.
 *
 * Verifies that key pages load and render correctly.
 * Uses ai-llm-research dataset for stable test data.
 */

const TEST_DATASET = 'ai-llm-research';
const TEST_NODE = 'person-geoffrey-hinton';

test.describe('Homepage', () => {
  test('loads and displays title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Scenius/);
  });

  test('displays dataset content', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load and show datasets
    // The homepage should have some content about datasets
    await expect(page.locator('body')).toContainText(/network|dataset|explore/i, {
      timeout: 10000,
    });
  });

  test('has navigation elements', async ({ page }) => {
    await page.goto('/');

    // Should have a header or nav element
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
  });
});

test.describe('Dataset Overview Page', () => {
  test('loads dataset overview', async ({ page }) => {
    await page.goto(`/${TEST_DATASET}`);

    // Page should load with dataset name visible
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
  });

  test('displays dataset information', async ({ page }) => {
    await page.goto(`/${TEST_DATASET}`);

    // Should show some AI/LLM related content
    await expect(page.locator('body')).toContainText(/AI|LLM|research/i, {
      timeout: 10000,
    });
  });
});

test.describe('Dataset Explore Page', () => {
  test('loads explore view', async ({ page }) => {
    await page.goto(`/${TEST_DATASET}/explore`);

    // Graph visualization should render (canvas or SVG)
    const graphElement = page.locator('canvas, svg').first();
    await expect(graphElement).toBeVisible({ timeout: 15000 });
  });

  test('has interactive controls', async ({ page }) => {
    await page.goto(`/${TEST_DATASET}/explore`);

    // Should have some form of search or filter UI
    const interactiveElement = page.locator(
      'input, button, [role="button"], [role="search"]'
    ).first();
    await expect(interactiveElement).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Node Detail Page', () => {
  test('loads node detail page', async ({ page }) => {
    await page.goto(`/${TEST_DATASET}/node/${TEST_NODE}`);

    // Should display the node title (Geoffrey Hinton)
    await expect(page.locator('body')).toContainText(/Geoffrey Hinton/i, {
      timeout: 10000,
    });
  });

  test('shows node connections or related info', async ({ page }) => {
    await page.goto(`/${TEST_DATASET}/node/${TEST_NODE}`);

    // Should show some relationship or connection information
    await expect(page.locator('body')).toContainText(
      /connection|relation|network|link/i,
      { timeout: 10000 }
    );
  });
});

test.describe('404 Page', () => {
  test('shows not found for invalid routes', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz');

    // Should show some indication of not found
    await expect(page.locator('body')).toContainText(/not found|404|error/i, {
      timeout: 10000,
    });
  });
});
