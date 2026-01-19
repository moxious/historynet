/**
 * Graph color utilities
 *
 * Shared color functions for consistent styling across
 * ForceGraphLayout and TimelineLayout components.
 */

import type { NodeType } from '@types';

/**
 * Get emoji character for a node type
 * Used for visual representation of node types in graph layouts and info panels
 */
export function getNodeTypeEmoji(type: NodeType | string): string {
  switch (type) {
    case 'person':
      return '👤';
    case 'object':
      return '📜';
    case 'location':
      return '📍';
    case 'entity':
      return '🏛️';
    default:
      return '📄';
  }
}

/**
 * Get node color based on type
 */
export function getNodeColor(type: NodeType): string {
  switch (type) {
    case 'person':
      return '#3b82f6'; // blue
    case 'object':
      return '#10b981'; // green
    case 'location':
      return '#f59e0b'; // amber
    case 'entity':
      return '#8b5cf6'; // purple
    default:
      return '#6b7280'; // gray
  }
}

/**
 * Get edge color based on relationship type
 */
export function getEdgeColor(relationship: string): string {
  // Group relationships by category
  if (['influenced', 'influenced_by', 'taught', 'studied_under'].includes(relationship)) {
    return '#6366f1'; // indigo - intellectual relationships
  }
  if (['collaborated_with', 'corresponded_with', 'knows'].includes(relationship)) {
    return '#22c55e'; // green - collaborative relationships
  }
  if (['authored', 'translated', 'edited', 'founded'].includes(relationship)) {
    return '#f97316'; // orange - creative relationships
  }
  if (['born_in', 'died_in', 'lived_in', 'worked_at', 'visited'].includes(relationship)) {
    return '#8b5cf6'; // purple - location relationships
  }
  if (['member_of', 'led', 'associated_with'].includes(relationship)) {
    return '#ec4899'; // pink - organizational relationships
  }
  if (['related_to', 'opposed', 'succeeded'].includes(relationship)) {
    return '#ef4444'; // red - personal relationships
  }
  return '#94a3b8'; // slate - default
}
