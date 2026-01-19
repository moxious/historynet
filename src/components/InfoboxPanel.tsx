/**
 * InfoboxPanel - Container component for displaying node/edge details
 *
 * Shows detailed information about the selected node or edge in a
 * right-side panel with a close button.
 *
 * Features:
 * - Escape key to close the panel
 * - Accessible with proper ARIA labels
 * - Permalink and Share buttons for stable resource URLs
 */

import { useEffect, useMemo } from 'react';
import { useGraph } from '@contexts';
import type { GraphNode, GraphEdge } from '@types';
import { buildFullNodeUrl, buildFullEdgeUrl } from '@hooks/useResourceParams';
import NodeInfobox from './NodeInfobox';
import EdgeInfobox from './EdgeInfobox';
import ShareButtons from './ShareButtons';
import './InfoboxPanel.css';

/**
 * Type guard to check if the selected item is a node
 */
function isNode(item: GraphNode | GraphEdge): item is GraphNode {
  return (
    'type' in item &&
    typeof item.type === 'string' &&
    ['person', 'object', 'location', 'entity'].includes(item.type)
  );
}

/**
 * Type guard to check if the selected item is an edge
 */
function isEdge(item: GraphNode | GraphEdge): item is GraphEdge {
  return 'relationship' in item && 'source' in item && 'target' in item;
}

interface InfoboxPanelProps {
  /** Optional class name for the panel */
  className?: string;
}

function InfoboxPanel({ className = '' }: InfoboxPanelProps) {
  const { selectedItem, clearSelection, selectNode, getNode, getEdgesForNode, graphData, currentDatasetId } = useGraph();

  // Handle Escape key to close the panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Escape if we have a selection and not in an input
      if (e.key === 'Escape' && selectedItem) {
        const activeEl = document.activeElement;
        const isInInput =
          activeEl instanceof HTMLInputElement ||
          activeEl instanceof HTMLTextAreaElement ||
          activeEl instanceof HTMLSelectElement;

        if (!isInInput) {
          clearSelection();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, clearSelection]);

  // Handler for clicking on internal node links
  const handleNodeLinkClick = (nodeId: string) => {
    // Just update the infobox to show the linked node
    // Don't change the graph view/filter
    selectNode(nodeId);
  };

  // Build stable URL for current selection (for permalink/share)
  const stableUrl = useMemo(() => {
    if (!selectedItem || !currentDatasetId) return '';
    
    if (isNode(selectedItem)) {
      return buildFullNodeUrl(currentDatasetId, selectedItem.id);
    }
    
    if (isEdge(selectedItem)) {
      return buildFullEdgeUrl(currentDatasetId, selectedItem.source, selectedItem.target);
    }
    
    return '';
  }, [selectedItem, currentDatasetId]);

  // If nothing selected, hide the panel completely
  if (!selectedItem) {
    return null;
  }

  // Get the title for the panel header
  const getTitle = (): string => {
    if (isNode(selectedItem)) {
      return selectedItem.title;
    }
    if (isEdge(selectedItem)) {
      return (
        selectedItem.label ??
        selectedItem.relationship
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      );
    }
    return 'Details';
  };

  return (
    <aside className={`infobox-panel ${className}`} aria-label="Details panel">
      <div className="infobox-panel__header">
        <h2 className="infobox-panel__title" title={getTitle()}>
          {getTitle()}
        </h2>
        <button
          className="infobox-panel__close-button"
          onClick={clearSelection}
          aria-label="Close details panel"
          title="Close"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Share buttons for stable resource URLs (M15) */}
      {stableUrl && (
        <div className="infobox-panel__share">
          <ShareButtons
            url={stableUrl}
            title={getTitle()}
            description={isNode(selectedItem) ? selectedItem.shortDescription : undefined}
            variant="inline"
            size="small"
          />
        </div>
      )}

      <div className="infobox-panel__content">
        {isNode(selectedItem) && (
          <NodeInfobox
            node={selectedItem}
            edges={getEdgesForNode(selectedItem.id)}
            onNodeLinkClick={handleNodeLinkClick}
            getNode={getNode}
          />
        )}
        {isEdge(selectedItem) && graphData && (
          <EdgeInfobox
            edge={selectedItem}
            onNodeLinkClick={handleNodeLinkClick}
            getNode={getNode}
            nodes={graphData.nodes}
          />
        )}
      </div>
    </aside>
  );
}

export default InfoboxPanel;
