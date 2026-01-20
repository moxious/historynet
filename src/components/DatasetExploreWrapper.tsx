/**
 * DatasetExploreWrapper - Wrapper for explore view with route-based dataset validation
 * 
 * The dataset ID is sourced from the URL path (e.g., /christian-kabbalah/explore).
 * GraphContext reads the dataset ID directly from the path, making it the source of truth.
 * 
 * This wrapper validates the dataset ID and redirects to the default dataset if invalid.
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

  // MainLayout will get the dataset from GraphContext which reads from the path
  return <MainLayout />;
}

export default DatasetExploreWrapper;
