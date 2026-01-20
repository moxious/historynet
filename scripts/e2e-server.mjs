#!/usr/bin/env node
/**
 * E2E Test Server
 *
 * Builds the frontend and serves it along with API endpoints for E2E testing.
 * This avoids the need for Vercel CLI authentication in CI environments.
 */

import express from 'express';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

const PORT = process.env.PORT || 3000;
// Always use Vite dev server for now (building in CI has issues)
const USE_BUILD = false;

async function createViteDevServer() {
  const vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'spa',
  });
  return vite;
}

async function startServer() {
  const app = express();

  // Parse JSON bodies
  app.use(express.json());

  // Serve API routes by dynamically importing the Vercel functions
  // These functions are designed for Vercel's serverless environment
  // but can work in a standard Node.js environment with proper setup

  app.get('/api/health', async (req, res) => {
    try {
      const module = await import(`${root}/api/health.ts`);
      await module.default(req, res);
    } catch (error) {
      console.error('Error loading health API:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/og', async (req, res) => {
    try {
      const module = await import(`${root}/api/og.tsx`);
      await module.default(req, res);
    } catch (error) {
      console.error('Error loading OG API:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/submit-feedback', async (req, res) => {
    try {
      const module = await import(`${root}/api/submit-feedback.ts`);
      await module.default(req, res);
    } catch (error) {
      console.error('Error loading submit-feedback API:', error);
      res.status(500).json({ error: error.message });
    }
  });

  if (USE_BUILD) {
    // In CI: Build first, then serve static files
    console.log('Building frontend for production...');
    const buildProcess = spawn('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' });

    await new Promise((resolve, reject) => {
      buildProcess.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Build failed with code ${code}`));
      });
    });

    // Serve static files from dist
    app.use(express.static(join(root, 'dist')));

    // SPA fallback - serve index.html for all non-API, non-static routes
    // Use a wildcard route that works with Express v5
    app.get(/.*/,  (req, res) => {
      res.sendFile(join(root, 'dist', 'index.html'));
    });
  } else {
    // In local dev: Use Vite dev server
    const vite = await createViteDevServer();
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`E2E server running at http://localhost:${PORT}`);
    console.log(`Mode: ${USE_BUILD ? 'production build' : 'development'}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
