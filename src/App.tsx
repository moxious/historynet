import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from '@components/Header';
import DatasetExploreWrapper from '@components/DatasetExploreWrapper';
import ErrorBoundary from '@components/ErrorBoundary';
import { DatasetOverviewPage, NodeDetailPage, EdgeDetailPage, NotFoundPage } from './pages';
import { DEFAULT_DATASET_ID } from '@utils/dataLoader';

/**
 * Main App component with routing configuration
 * 
 * Route structure (M31 Dataset Pages):
 * - / : Redirects to default dataset (will become homepage in M32)
 * - /:datasetId : Dataset overview page (narrative entry point)
 * - /:datasetId/explore : Graph/timeline/radial exploration view
 * - /:datasetId/node/:nodeId : Node detail page (stable permalink)
 * - /:datasetId/from/:sourceId/to/:targetId : Edge detail page (stable permalink)
 * - * : 404 page for unmatched routes
 */
function App() {
  return (
    <Routes>
      {/* Root redirects to default dataset overview (will become homepage in M32) */}
      <Route
        path="/"
        element={<Navigate to={`/${DEFAULT_DATASET_ID}`} replace />}
      />

      {/* Dataset overview page - narrative entry point */}
      <Route
        path="/:datasetId"
        element={
          <div className="app">
            <Header />
            <ErrorBoundary>
              <DatasetOverviewPage />
            </ErrorBoundary>
          </div>
        }
      />

      {/* Explore view - graph/timeline/radial visualization */}
      <Route
        path="/:datasetId/explore"
        element={
          <div className="app">
            <Header />
            {/* REACT: Error boundary prevents render errors from crashing the app (R6) */}
            <ErrorBoundary>
              <DatasetExploreWrapper />
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
