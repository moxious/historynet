/**
 * useNodeEnrichedData Hook
 *
 * Combines local node data with Wikipedia-first enrichment.
 * Provides a unified interface for displaying node information.
 *
 * Fallback priority for biography/description:
 * 1. Wikipedia extract (truncated with "Read more" link)
 * 2. Node's biography field (if present and non-empty)
 * 3. Node's shortDescription field (if present and non-empty)
 * 4. Empty state
 *
 * Fallback priority for images:
 * 1. Wikipedia thumbnail (fetched via API)
 * 2. Node's imageUrl field (if present AND loads successfully)
 * 3. No image
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { GraphNode, PersonNode } from '@types';
import { isPersonNode } from '@types';
import { useWikipediaData } from './useWikipediaData';
import type { WikipediaData, NodeTypeHint } from '@services';

/**
 * Data source indicator
 */
export type DataSource = 'local' | 'wikipedia' | 'none';

/**
 * Enriched node data with source tracking
 */
export interface EnrichedNodeData {
  /** Node title (always from local) */
  title: string;
  /** Description text (from Wikipedia or local) */
  description: string | null;
  /** Source of description */
  descriptionSource: DataSource;
  /** Image URL to display (from Wikipedia or local) */
  imageUrl: string | null;
  /** Source of image */
  imageSource: DataSource;
  /** Wikipedia page URL (for attribution link) */
  wikipediaUrl: string | null;
  /** Wikidata ID if available */
  wikidataId: string | null;
  /** Whether Wikipedia data is currently loading */
  loading: boolean;
  /** Whether local image failed to load */
  localImageFailed: boolean;
  /** Whether to show local biography field (only if non-redundant with Wikipedia) */
  shouldShowLocalBiography: boolean;
}

/**
 * Hook return type
 */
export interface UseNodeEnrichedDataResult {
  /** Enriched node data */
  enrichedData: EnrichedNodeData;
  /** Report that the local image failed to load */
  handleImageError: () => void;
  /** Raw Wikipedia data (for advanced use cases) */
  wikipediaData: WikipediaData | null;
}

/**
 * Maximum characters for Wikipedia extract display
 */
const MAX_EXTRACT_LENGTH = 250;

/**
 * Truncate text to max length, ending at word boundary
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Find the last space before maxLength
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + '…';
  }

  return truncated + '…';
}

/**
 * Check if local biography is redundant with Wikipedia extract
 *
 * A biography is considered redundant if the Wikipedia extract contains
 * most of the same information. This uses simple text comparison to detect
 * when the local biography doesn't add network-specific context.
 */
function isBiographyRedundant(localBio: string, wikipediaExtract: string): boolean {
  if (!localBio || !wikipediaExtract) {
    return false;
  }

  // Normalize both texts for comparison (lowercase, remove extra whitespace)
  const normalizedBio = localBio.toLowerCase().replace(/\s+/g, ' ').trim();
  const normalizedExtract = wikipediaExtract.toLowerCase().replace(/\s+/g, ' ').trim();

  // If Wikipedia extract is shorter than bio, likely not redundant
  if (normalizedExtract.length < normalizedBio.length * 0.7) {
    return false;
  }

  // Extract key phrases from local bio (words of 4+ characters, excluding common words)
  const commonWords = new Set(['the', 'and', 'was', 'were', 'been', 'have', 'from', 'with', 'that', 'this', 'they', 'their', 'there']);
  const bioWords = normalizedBio
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !commonWords.has(word))
    .slice(0, 10); // Take first 10 significant words

  // Check if Wikipedia extract contains most of these key phrases
  if (bioWords.length === 0) {
    return false;
  }

  const matches = bioWords.filter((word) => normalizedExtract.includes(word)).length;
  const matchRatio = matches / bioWords.length;

  // If Wikipedia extract contains 70%+ of key phrases, consider redundant
  return matchRatio >= 0.7;
}

/**
 * Get description from node (biography or shortDescription)
 */
function getLocalDescription(node: GraphNode): string | null {
  // For person nodes, prefer biography
  if (isPersonNode(node)) {
    const personNode = node as PersonNode;
    if (personNode.biography && personNode.biography.trim()) {
      return personNode.biography.trim();
    }
  }

  // Fall back to shortDescription
  if (node.shortDescription && node.shortDescription.trim()) {
    return node.shortDescription.trim();
  }

  return null;
}

/**
 * Map GraphNode type to NodeTypeHint
 */
function getNodeTypeHint(node: GraphNode): NodeTypeHint {
  return node.type as NodeTypeHint;
}

/**
 * Custom hook to get enriched node data with Wikipedia fallback
 *
 * @example
 * const { enrichedData, handleImageError } = useNodeEnrichedData(node);
 *
 * // In render:
 * <img
 *   src={enrichedData.imageUrl}
 *   onError={handleImageError}
 * />
 * <p>{enrichedData.description}</p>
 * {enrichedData.descriptionSource === 'wikipedia' && (
 *   <a href={enrichedData.wikipediaUrl}>Read more on Wikipedia</a>
 * )}
 */
export function useNodeEnrichedData(node: GraphNode): UseNodeEnrichedDataResult {
  // Track whether local image has failed
  const [localImageFailed, setLocalImageFailed] = useState(false);

  // Reset image failure state when node changes
  useEffect(() => {
    setLocalImageFailed(false);
  }, [node.id]);

  // Get local description
  const localDescription = useMemo(() => getLocalDescription(node), [node]);

  // Always fetch Wikipedia data when wikipediaTitle is present (Wikipedia-first precedence)
  const { data: wikipediaData, loading } = useWikipediaData({
    wikipediaTitle: node.wikipediaTitle,
    nodeType: getNodeTypeHint(node),
    skip: !node.wikipediaTitle,
  });

  // Handle image error
  const handleImageError = useCallback(() => {
    setLocalImageFailed(true);
  }, []);

  // Build enriched data
  const enrichedData = useMemo((): EnrichedNodeData => {
    // Description: Wikipedia-first precedence
    let description: string | null = null;
    let descriptionSource: DataSource = 'none';

    if (wikipediaData?.extract) {
      description = truncateText(wikipediaData.extract, MAX_EXTRACT_LENGTH);
      descriptionSource = 'wikipedia';
    } else if (localDescription) {
      description = localDescription;
      descriptionSource = 'local';
    }

    // Image: Wikipedia-first precedence
    let imageUrl: string | null = null;
    let imageSource: DataSource = 'none';

    if (wikipediaData?.thumbnail?.source) {
      imageUrl = wikipediaData.thumbnail.source;
      imageSource = 'wikipedia';
    } else if (node.imageUrl && !localImageFailed) {
      imageUrl = node.imageUrl;
      imageSource = 'local';
    }

    // Determine if local biography should be shown (only if non-redundant)
    let shouldShowLocalBiography = false;
    if (isPersonNode(node) && node.biography && wikipediaData?.extract) {
      // Show local biography only if it adds network-specific context
      shouldShowLocalBiography = !isBiographyRedundant(node.biography, wikipediaData.extract);
    } else if (isPersonNode(node) && node.biography && !wikipediaData?.extract) {
      // Show local biography if no Wikipedia data available
      shouldShowLocalBiography = true;
    }

    return {
      title: node.title,
      description,
      descriptionSource,
      imageUrl,
      imageSource,
      wikipediaUrl: wikipediaData?.pageUrl || null,
      wikidataId: wikipediaData?.wikidataId || node.wikidataId || null,
      loading,
      localImageFailed,
      shouldShowLocalBiography,
    };
  }, [node, localDescription, localImageFailed, wikipediaData, loading]);

  return {
    enrichedData,
    handleImageError,
    wikipediaData,
  };
}

export default useNodeEnrichedData;
