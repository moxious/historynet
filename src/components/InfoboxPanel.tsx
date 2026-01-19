/**
 * InfoboxPanel - Container component for displaying node/edge details
 *
 * Shows detailed information about the selected node or edge in a
 * right-side panel with a close button.
 *
 * Features:
 * - Escape key to close the panel
 * - Accessible with proper ARIA labels
 * - Link to node/edge detail page from title
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGraph } from '@contexts';
import { getNodeTypeEmoji } from '@utils';
import type { GraphNode, GraphEdge } from '@types';
import NodeInfobox from './NodeInfobox';
import EdgeInfobox from './EdgeInfobox';
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

  // If nothing selected, hide the panel completely
  if (!selectedItem) {
    return null;
  }

  // Get the title for the panel header (without emoji)
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

  // Build the detail page URL for the selected item
  const getDetailUrl = (): string | null => {
    if (!currentDatasetId) return null;
    
    if (isNode(selectedItem)) {
      return `/${encodeURIComponent(currentDatasetId)}/node/${encodeURIComponent(selectedItem.id)}`;
    }
    
    if (isEdge(selectedItem)) {
      return `/${encodeURIComponent(currentDatasetId)}/edge/${encodeURIComponent(selectedItem.source)}/${encodeURIComponent(selectedItem.target)}`;
    }
    
    return null;
  };

  const detailUrl = getDetailUrl();

  return (
    <aside className={`infobox-panel ${className}`} aria-label="Details panel">
      <div className="infobox-panel__header">
        <h2 className="infobox-panel__title" title={getTitle()}>
          {isNode(selectedItem) && (
            <span className="infobox-panel__title-emoji" role="img" aria-label={`${selectedItem.type} icon`}>
              {getNodeTypeEmoji(selectedItem.type)}
            </span>
          )}
          <span className="infobox-panel__title-text">{getTitle()}</span>
          {detailUrl && (
            <Link
              to={detailUrl}
              className="infobox-panel__title-link"
              aria-label={`View ${getTitle()} detail page`}
              title="View detail page"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </Link>
          )}
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
