import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { GraphProvider, ThemeProvider } from '@contexts';
import './index.css';
import App from './App';

// Using HashRouter for GitHub Pages compatibility
// URLs will be like: https://username.github.io/scenius/#/?dataset=xyz
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <GraphProvider>
          <App />
        </GraphProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>
);
