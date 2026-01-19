/**
 * Hook for calculating the most connected nodes by POLE type
 * 
 * Groups nodes by type (Person, Object, Location, Entity) and returns
 * the top N nodes by degree (number of edges) for each type.
 */

import { useMemo } from 'react';
import type { GraphNode, GraphEdge } from '@types';

export interface NodeWithDegree {
  node: GraphNode;
  degree: number;
}

export interface TopConnectedByType {
  person: NodeWithDegree[];
  object: NodeWithDegree[];
  location: NodeWithDegree[];
  entity: NodeWithDegree[];
}

/**
 * Calculate the top connected nodes for each POLE type
 * @param nodes - Array of graph nodes
 * @param edges - Array of graph edges
 * @param topN - Number of top nodes to return per type (default: 5)
 * @returns Object with arrays of top connected nodes per type
 */
export function useTopConnectedNodes(
  nodes: GraphNode[],
  edges: GraphEdge[],
  topN: number = 5
): TopConnectedByType {
  return useMemo(() => {
    // Calculate degree for each node
    const degreeMap = new Map<string, number>();
    
    for (const edge of edges) {
      // D3 may mutate source/target to object references during simulation
      // Handle both string IDs and object references with id property
      const source = edge.source as string | { id: string };
      const target = edge.target as string | { id: string };
      const sourceId = typeof source === 'object' && source !== null ? source.id : String(source);
      const targetId = typeof target === 'object' && target !== null ? target.id : String(target);
      
      degreeMap.set(sourceId, (degreeMap.get(sourceId) || 0) + 1);
      degreeMap.set(targetId, (degreeMap.get(targetId) || 0) + 1);
    }
    
    // Create node with degree array
    const nodesWithDegree: NodeWithDegree[] = nodes.map(node => ({
      node,
      degree: degreeMap.get(node.id) || 0,
    }));
    
    // Group by type
    const byType: Record<string, NodeWithDegree[]> = {
      person: [],
      object: [],
      location: [],
      entity: [],
    };
    
    for (const nwd of nodesWithDegree) {
      const type = nwd.node.type;
      if (type in byType) {
        byType[type].push(nwd);
      }
    }
    
    // Sort each group by degree (descending) and take top N
    const result: TopConnectedByType = {
      person: byType.person
        .sort((a, b) => b.degree - a.degree)
        .slice(0, topN),
      object: byType.object
        .sort((a, b) => b.degree - a.degree)
        .slice(0, topN),
      location: byType.location
        .sort((a, b) => b.degree - a.degree)
        .slice(0, topN),
      entity: byType.entity
        .sort((a, b) => b.degree - a.degree)
        .slice(0, topN),
    };
    
    return result;
  }, [nodes, edges, topN]);
}

/**
 * Get display label for POLE type
 */
export function getTypeLabel(type: keyof TopConnectedByType): string {
  const labels: Record<keyof TopConnectedByType, string> = {
    person: 'People',
    object: 'Works & Objects',
    location: 'Locations',
    entity: 'Organizations',
  };
  return labels[type];
}

/**
 * Get icon/emoji for POLE type
 */
export function getTypeIcon(type: keyof TopConnectedByType): string {
  const icons: Record<keyof TopConnectedByType, string> = {
    person: '👤',
    object: '📜',
    location: '📍',
    entity: '🏛️',
  };
  return icons[type];
}
