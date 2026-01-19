/**
 * MobileInfoboxPanel - Mobile wrapper for InfoboxPanel using BottomSheet
 * 
 * On mobile devices, displays the InfoboxPanel content inside a draggable
 * bottom sheet instead of a fixed side panel.
 * 
 * Features:
 * - Shows as bottom sheet on mobile (< 768px)
 * - Opens to peek state when item is selected
 * - User can swipe up to expand or down to dismiss
 * - Preserves all InfoboxPanel functionality
 */

import { Link } from 'react-router-dom';
import { useGraph } from '@contexts';
import { getNodeTypeEmoji } from '@utils';
import type { GraphNode, GraphEdge } from '@types';
import BottomSheet from './BottomSheet';
import NodeInfobox from './NodeInfobox';
import EdgeInfobox from './EdgeInfobox';
import './MobileInfoboxPanel.css';

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

function MobileInfoboxPanel() {
  const { selectedItem, clearSelection, selectNode, getNode, getEdgesForNode, graphData, currentDatasetId } = useGraph();

  // Handler for clicking on internal node links
  const handleNodeLinkClick = (nodeId: string) => {
    selectNode(nodeId);
  };

  // Get the plain text title for the sheet header
  const getTitleText = (): string => {
    if (!selectedItem) return 'Details';
    
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
    if (!currentDatasetId || !selectedItem) return null;
    
    if (isNode(selectedItem)) {
      return `/${encodeURIComponent(currentDatasetId)}/node/${encodeURIComponent(selectedItem.id)}`;
    }
    
    if (isEdge(selectedItem)) {
      return `/${encodeURIComponent(currentDatasetId)}/edge/${encodeURIComponent(selectedItem.source)}/${encodeURIComponent(selectedItem.target)}`;
    }
    
    return null;
  };

  const titleText = getTitleText();
  const detailUrl = getDetailUrl();

  // Build the title with emoji and link
  const renderTitle = () => {
    if (!selectedItem) return 'Details';
    
    return (
      <span className="mobile-infobox-panel__title">
        {isNode(selectedItem) && (
          <span className="mobile-infobox-panel__title-emoji" role="img" aria-label={`${selectedItem.type} icon`}>
            {getNodeTypeEmoji(selectedItem.type)}
          </span>
        )}
        <span className="mobile-infobox-panel__title-text">{titleText}</span>
        {detailUrl && (
          <Link
            to={detailUrl}
            className="mobile-infobox-panel__title-link"
            aria-label={`View ${titleText} detail page`}
            title="View detail page"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </Link>
        )}
      </span>
    );
  };

  return (
    <BottomSheet
      isOpen={!!selectedItem}
      onClose={clearSelection}
      title={renderTitle()}
      titleText={titleText}
      initialState="peek"
      className="mobile-infobox-panel"
    >
      {selectedItem && (
        <div className="mobile-infobox-panel__content">
          {/* Node or Edge content */}
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
      )}
    </BottomSheet>
  );
}

export default MobileInfoboxPanel;
