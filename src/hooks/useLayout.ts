/**
 * Hook for managing visualization layout state
 */

import { useState, useCallback, useMemo } from 'react';
import type { LayoutInfo } from '@layouts/types';

/**
 * Available layout types
 */
export type LayoutType = 'force-graph' | 'timeline' | 'radial';

/**
 * Registry of available layouts
 */
const LAYOUTS: Record<LayoutType, LayoutInfo> = {
  'force-graph': {
    id: 'force-graph',
    name: 'Graph View',
    description: 'Interactive force-directed graph showing relationships',
  },
  timeline: {
    id: 'timeline',
    name: 'Timeline View',
    description: 'Vertical timeline showing events chronologically',
  },
  radial: {
    id: 'radial',
    name: 'Radial View',
    description: 'Ego-network view centered on selected node',
  },
};

interface UseLayoutReturn {
  /** Current layout ID */
  currentLayout: LayoutType;
  /** Switch to a different layout */
  setLayout: (layoutId: LayoutType) => void;
  /** Get info about the current layout */
  layoutInfo: LayoutInfo;
  /** Get info about all available layouts */
  availableLayouts: LayoutInfo[];
  /** Check if a layout is available */
  isLayoutAvailable: (layoutId: string) => boolean;
}

/**
 * Hook for managing visualization layout state
 * @param initialLayout - Initial layout to use (defaults to 'force-graph')
 */
export function useLayout(initialLayout: LayoutType = 'force-graph'): UseLayoutReturn {
  const [currentLayout, setCurrentLayout] = useState<LayoutType>(initialLayout);

  const setLayout = useCallback((layoutId: LayoutType) => {
    if (layoutId in LAYOUTS) {
      setCurrentLayout(layoutId);
    } else {
      console.warn(`Unknown layout: ${layoutId}`);
    }
  }, []);

  const layoutInfo = useMemo(() => LAYOUTS[currentLayout], [currentLayout]);

  const availableLayouts = useMemo(() => Object.values(LAYOUTS), []);

  const isLayoutAvailable = useCallback((layoutId: string): boolean => {
    return layoutId in LAYOUTS;
  }, []);

  return useMemo(
    () => ({
      currentLayout,
      setLayout,
      layoutInfo,
      availableLayouts,
      isLayoutAvailable,
    }),
    [currentLayout, setLayout, layoutInfo, availableLayouts, isLayoutAvailable]
  );
}

export default useLayout;
