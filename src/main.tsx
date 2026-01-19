import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GraphProvider, ThemeProvider } from '@contexts';
import './index.css';
import App from './App';

// Using HashRouter for GitHub Pages compatibility
// URL structure (M31):
// - /#/{datasetId}          - Dataset overview page
// - /#/{datasetId}/explore  - Graph/timeline/radial exploration
// - /#/{datasetId}/node/{nodeId} - Node detail page (stable permalink)
// - /#/{datasetId}/from/{sourceId}/to/{targetId} - Edge detail page
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <HelmetProvider>
        <ThemeProvider>
          <GraphProvider>
            <App />
          </GraphProvider>
        </ThemeProvider>
      </HelmetProvider>
    </HashRouter>
  </StrictMode>
);
