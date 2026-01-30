/**
 * Wrapper component that connects GraphContext data to CrossSceneProvider
 *
 * This component reads from GraphContext and passes the necessary data
 * (current dataset ID and nodes) to the CrossSceneProvider.
 */

import { type ReactNode } from 'react';
import { useGraphOptional } from '@contexts/GraphContext';
import { CrossSceneProvider } from '@contexts/CrossSceneContext';

interface CrossSceneProviderWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper that provides CrossSceneProvider with data from GraphContext
 *
 * Must be used inside GraphProvider, but wraps App to provide cross-scene
 * data to all child components.
 */
export function CrossSceneProviderWrapper({
  children,
}: CrossSceneProviderWrapperProps) {
  const graphContext = useGraphOptional();

  // Extract current dataset ID and nodes from graph context
  const currentDatasetId = graphContext?.currentDatasetId ?? null;
  const nodes = graphContext?.graphData?.nodes ?? [];

  return (
    <CrossSceneProvider currentDatasetId={currentDatasetId} nodes={nodes}>
      {children}
    </CrossSceneProvider>
  );
}
