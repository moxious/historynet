/**
 * Layout interface types for HistoryNet visualizations
 * Allows swappable visualization layouts (graph, timeline, etc.)
 */

import type { GraphData, GraphNode, GraphEdge } from '@types';

/**
 * Options passed to visualization layouts
 */
export interface LayoutOptions {
  /** Container width in pixels */
  width: number;
  /** Container height in pixels */
  height: number;
  /** Callback when a node is clicked */
  onNodeClick?: (node: GraphNode) => void;
  /** Callback when an edge is clicked */
  onEdgeClick?: (edge: GraphEdge) => void;
  /** Currently selected node ID (for highlighting) */
  selectedNodeId?: string | null;
  /** Currently selected edge ID (for highlighting) */
  selectedEdgeId?: string | null;
  /** Search term for highlighting matching nodes */
  searchTerm?: string;
}

/**
 * Interface for visualization layouts
 * All layout implementations must conform to this interface
 */
export interface VisualizationLayout {
  /** Unique identifier for the layout */
  id: string;
  /** Human-readable name for the layout */
  name: string;
  /** Brief description of the layout */
  description: string;
  /**
   * Initialize the layout in a container element
   * @param container - DOM element to render into
   * @param data - Graph data to visualize
   * @param options - Layout options
   */
  render(container: HTMLElement, data: GraphData, options: LayoutOptions): void;
  /**
   * Update the layout with new data or options
   * @param data - Updated graph data
   * @param options - Updated layout options
   */
  update(data: GraphData, options: LayoutOptions): void;
  /**
   * Clean up the layout (remove event listeners, stop simulations, etc.)
   */
  cleanup(): void;
  /**
   * Reset the view (zoom/pan) to default state
   */
  resetView(): void;
  /**
   * Zoom in the view
   */
  zoomIn(): void;
  /**
   * Zoom out the view
   */
  zoomOut(): void;
}

/**
 * Information about a registered layout
 */
export interface LayoutInfo {
  id: string;
  name: string;
  description: string;
}

/**
 * Props for React layout components
 */
export interface LayoutComponentProps {
  /** Graph data to visualize */
  data: GraphData;
  /** Callback when a node is clicked */
  onNodeClick?: (node: GraphNode) => void;
  /** Callback when an edge is clicked */
  onEdgeClick?: (edge: GraphEdge) => void;
  /** Currently selected node ID */
  selectedNodeId?: string | null;
  /** Currently selected edge ID */
  selectedEdgeId?: string | null;
  /** Search term for highlighting */
  searchTerm?: string;
  /** CSS class name for the container */
  className?: string;
}
