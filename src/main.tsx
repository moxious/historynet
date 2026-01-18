import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GraphProvider, ThemeProvider } from '@contexts';
import './index.css';
import App from './App';

// Using HashRouter for GitHub Pages compatibility
// URLs will be like: https://username.github.io/scenius/#/?dataset=xyz
// Resource URLs: /#/{dataset}/node/{nodeId} or /#/{dataset}/from/{sourceId}/to/{targetId}
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
