import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // Base URL for GitHub Pages deployment
  // When deployed to https://username.github.io/historynet/, this needs to be '/historynet/'
  base: process.env.GITHUB_ACTIONS ? '/historynet/' : '/',
  plugins: [react()],
  build: {
    // Optimize chunk size
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'd3-vendor': ['d3'],
        },
      },
    },
  },
  resolve: {
    alias: [
      // Root alias
      { find: '@', replacement: path.resolve(__dirname, './src') },
      // Module aliases - handle both @module and @module/file patterns
      { find: /^@components$/, replacement: path.resolve(__dirname, './src/components/index.ts') },
      { find: /^@components\/(.*)$/, replacement: path.resolve(__dirname, './src/components/$1') },
      { find: /^@contexts$/, replacement: path.resolve(__dirname, './src/contexts/index.ts') },
      { find: /^@contexts\/(.*)$/, replacement: path.resolve(__dirname, './src/contexts/$1') },
      { find: /^@hooks$/, replacement: path.resolve(__dirname, './src/hooks/index.ts') },
      { find: /^@hooks\/(.*)$/, replacement: path.resolve(__dirname, './src/hooks/$1') },
      { find: /^@layouts$/, replacement: path.resolve(__dirname, './src/layouts/index.ts') },
      { find: /^@layouts\/(.*)$/, replacement: path.resolve(__dirname, './src/layouts/$1') },
      { find: /^@services$/, replacement: path.resolve(__dirname, './src/services/index.ts') },
      { find: /^@services\/(.*)$/, replacement: path.resolve(__dirname, './src/services/$1') },
      { find: /^@types$/, replacement: path.resolve(__dirname, './src/types/index.ts') },
      { find: /^@types\/(.*)$/, replacement: path.resolve(__dirname, './src/types/$1') },
      { find: /^@utils$/, replacement: path.resolve(__dirname, './src/utils/index.ts') },
      { find: /^@utils\/(.*)$/, replacement: path.resolve(__dirname, './src/utils/$1') },
    ],
  },
})
