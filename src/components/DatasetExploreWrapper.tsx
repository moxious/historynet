/**
 * DatasetExploreWrapper - Wrapper for explore view that validates dataset ID
 *
 * GraphContext now reads dataset ID directly from the path, so this wrapper
 * only needs to validate the dataset ID and redirect if invalid.
 *
 * URL: /{datasetId}/explore
 */

import { useParams, Navigate } from 'react-router-dom';
import { isValidDatasetId, DEFAULT_DATASET_ID } from '@utils/dataLoader';
import MainLayout from './MainLayout';

function DatasetExploreWrapper() {
  const { datasetId } = useParams<{ datasetId: string }>();

  // Invalid dataset - redirect to default
  if (!datasetId || !isValidDatasetId(datasetId)) {
    return <Navigate to={`/${DEFAULT_DATASET_ID}/explore`} replace />;
  }

  return <MainLayout />;
}

export default DatasetExploreWrapper;
