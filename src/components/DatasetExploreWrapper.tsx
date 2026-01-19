/**
 * DatasetExploreWrapper - Wrapper for explore view that syncs route params to URL state
 * 
 * Since GraphContext uses query params for dataset ID (for historical reasons),
 * this wrapper reads the datasetId from route params and syncs it to query params.
 * This allows the explore view to work with the new URL scheme while maintaining
 * compatibility with existing data loading logic.
 * 
 * URL: /#/{datasetId}/explore
 */

import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useUrlState } from '@hooks/useUrlState';
import { isValidDatasetId, DEFAULT_DATASET_ID } from '@utils/dataLoader';
import MainLayout from './MainLayout';

function DatasetExploreWrapper() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const { datasetId: urlDatasetId, setDatasetId } = useUrlState();

  // Sync route param to query param (for GraphContext compatibility)
  useEffect(() => {
    if (datasetId && isValidDatasetId(datasetId) && urlDatasetId !== datasetId) {
      setDatasetId(datasetId);
    }
  }, [datasetId, urlDatasetId, setDatasetId]);

  // Invalid dataset - redirect to default
  if (!datasetId || !isValidDatasetId(datasetId)) {
    return <Navigate to={`/${DEFAULT_DATASET_ID}/explore`} replace />;
  }

  // Wait for sync before rendering (prevents flash of wrong dataset)
  if (urlDatasetId !== datasetId) {
    return (
      <div className="main-layout">
        <section className="main-layout__graph" aria-label="Graph visualization">
          <div className="main-layout__placeholder main-layout__placeholder--loading">
            <div className="main-layout__spinner" aria-hidden="true" />
            <p>Loading dataset...</p>
          </div>
        </section>
      </div>
    );
  }

  return <MainLayout />;
}

export default DatasetExploreWrapper;
