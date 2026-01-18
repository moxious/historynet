/**
 * Hook for managing selection state in the graph
 */

import { useState, useCallback, useMemo } from 'react';
import type { Selection, SelectionType, GraphNode, GraphEdge } from '@types';

interface UseSelectedItemReturn {
  /** Currently selected item (null if nothing selected) */
  selection: Selection | null;
  /** Select a node by ID */
  selectNode: (id: string) => void;
  /** Select an edge by ID */
  selectEdge: (id: string) => void;
  /** Select an item with explicit type */
  select: (type: SelectionType, id: string) => void;
  /** Clear the current selection */
  clearSelection: () => void;
  /** Check if a specific node is selected */
  isNodeSelected: (id: string) => boolean;
  /** Check if a specific edge is selected */
  isEdgeSelected: (id: string) => boolean;
  /** Check if anything is selected */
  hasSelection: boolean;
}

/**
 * Hook for managing selection state
 */
export function useSelectedItem(): UseSelectedItemReturn {
  const [selection, setSelection] = useState<Selection | null>(null);

  // Select a node
  const selectNode = useCallback((id: string) => {
    setSelection({ type: 'node', id });
  }, []);

  // Select an edge
  const selectEdge = useCallback((id: string) => {
    setSelection({ type: 'edge', id });
  }, []);

  // Generic select with type
  const select = useCallback((type: SelectionType, id: string) => {
    setSelection({ type, id });
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelection(null);
  }, []);

  // Check if a specific node is selected
  const isNodeSelected = useCallback(
    (id: string): boolean => {
      return selection?.type === 'node' && selection.id === id;
    },
    [selection]
  );

  // Check if a specific edge is selected
  const isEdgeSelected = useCallback(
    (id: string): boolean => {
      return selection?.type === 'edge' && selection.id === id;
    },
    [selection]
  );

  // Check if anything is selected
  const hasSelection = selection !== null;

  return useMemo(
    () => ({
      selection,
      selectNode,
      selectEdge,
      select,
      clearSelection,
      isNodeSelected,
      isEdgeSelected,
      hasSelection,
    }),
    [selection, selectNode, selectEdge, select, clearSelection, isNodeSelected, isEdgeSelected, hasSelection]
  );
}

/**
 * Get the selected item from graph data
 * Returns the node or edge object, or undefined if not found
 */
export function getSelectedItem(
  selection: Selection | null,
  nodes: GraphNode[],
  edges: GraphEdge[]
): GraphNode | GraphEdge | undefined {
  if (!selection) return undefined;

  if (selection.type === 'node') {
    return nodes.find((node) => node.id === selection.id);
  }

  return edges.find((edge) => edge.id === selection.id);
}
