import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GraphProvider, ThemeProvider } from '@contexts';
import { CrossSceneProviderWrapper } from '@components/CrossSceneProviderWrapper';
import { initGA } from '@utils';
import './index.css';
import App from './App';

// Initialize Google Analytics (no-op if VITE_GA_TRACKING_ID is not set)
initGA();

// Using BrowserRouter for clean URLs and social media crawlers (M33)
// URL structure:
// - /{datasetId}          - Dataset overview page
// - /{datasetId}/explore  - Graph/timeline/radial exploration
// - /{datasetId}/node/{nodeId} - Node detail page (stable permalink)
// - /{datasetId}/from/{sourceId}/to/{targetId} - Edge detail page
//
// Note: Vercel rewrites all client routes to index.html (see vercel.json)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider>
          <GraphProvider>
            <CrossSceneProviderWrapper>
              <App />
            </CrossSceneProviderWrapper>
          </GraphProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
