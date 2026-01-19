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

import { useMemo } from 'react';
import { useGraph } from '@contexts';
import type { GraphNode, GraphEdge } from '@types';
import { buildFullNodeUrl, buildFullEdgeUrl } from '@hooks/useResourceParams';
import BottomSheet from './BottomSheet';
import NodeInfobox from './NodeInfobox';
import EdgeInfobox from './EdgeInfobox';
import ShareButtons from './ShareButtons';
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
  const { selectedItem, clearSelection, selectNode, getNode, graphData, currentDatasetId } = useGraph();

  // Handler for clicking on internal node links
  const handleNodeLinkClick = (nodeId: string) => {
    selectNode(nodeId);
  };

  // Get the title for the sheet header
  const getTitle = (): string => {
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

  return (
    <BottomSheet
      isOpen={!!selectedItem}
      onClose={clearSelection}
      title={getTitle()}
      initialState="peek"
      className="mobile-infobox-panel"
    >
      {selectedItem && (
        <div className="mobile-infobox-panel__content">
          {/* Share buttons */}
          {stableUrl && (
            <div className="mobile-infobox-panel__share">
              <ShareButtons
                url={stableUrl}
                title={getTitle()}
                description={isNode(selectedItem) ? selectedItem.shortDescription : undefined}
                variant="inline"
                size="small"
              />
            </div>
          )}

          {/* Node or Edge content */}
          {isNode(selectedItem) && (
            <NodeInfobox
              node={selectedItem}
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
