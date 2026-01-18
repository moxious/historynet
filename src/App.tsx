import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from '@components/Header';
import MainLayout from '@components/MainLayout';
import ErrorBoundary from '@components/ErrorBoundary';
import { NodeDetailPage, EdgeDetailPage, NotFoundPage } from './pages';

/**
 * Main App component with routing configuration
 * 
 * Route structure:
 * - / : Main graph view with query params (?dataset=..., ?selected=..., etc.)
 * - /:datasetId/node/:nodeId : Node detail page (stable permalink)
 * - /:datasetId/from/:sourceId/to/:targetId : Edge detail page (stable permalink)
 * - * : 404 page for unmatched routes
 */
function App() {
  return (
    <Routes>
      {/* Main graph view */}
      <Route
        path="/"
        element={
          <div className="app">
            <Header />
            {/* REACT: Error boundary prevents render errors from crashing the app (R6) */}
            <ErrorBoundary>
              <MainLayout />
            </ErrorBoundary>
          </div>
        }
      />

      {/* Node detail page - stable permalink */}
      <Route
        path="/:datasetId/node/:nodeId"
        element={
          <div className="app">
            <Header />
            <ErrorBoundary>
              <NodeDetailPage />
            </ErrorBoundary>
          </div>
        }
      />

      {/* Edge detail page - stable permalink for all edges between two nodes */}
      <Route
        path="/:datasetId/from/:sourceId/to/:targetId"
        element={
          <div className="app">
            <Header />
            <ErrorBoundary>
              <EdgeDetailPage />
            </ErrorBoundary>
          </div>
        }
      />

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <div className="app">
            <Header />
            <NotFoundPage message="Page not found" />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
