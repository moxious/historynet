/**
 * useMediaQuery hook for responsive breakpoint detection
 * 
 * Provides a way to detect if a CSS media query matches, enabling
 * responsive behavior in JavaScript/React components.
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 640px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */

import { useState, useEffect } from 'react';

/**
 * Hook that returns true if the given media query matches
 * 
 * @param query - CSS media query string (e.g., '(max-width: 640px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with the current match state
  // Use a function to avoid SSR issues where window might not exist
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // Exit early if we're in SSR
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    // Update the state if the initial value was wrong (SSR hydration fix)
    if (mediaQueryList.matches !== matches) {
      setMatches(mediaQueryList.matches);
    }

    // Event handler for media query changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers support addEventListener
    // REACT: cleanup event listener on unmount (R1)
    mediaQueryList.addEventListener('change', handleChange);
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query, matches]);

  return matches;
}

/**
 * Common breakpoint constants matching the app's responsive design
 */
export const BREAKPOINTS = {
  /** Small phones (iPhone SE) */
  XS: '480px',
  /** Standard phones - mobile menu breakpoint */
  SM: '640px',
  /** Large phones / tablets portrait - stack layout breakpoint */
  MD: '768px',
  /** Tablets landscape */
  LG: '1024px',
  /** Desktop */
  XL: '1280px',
} as const;

/**
 * Pre-configured hooks for common breakpoints
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.SM})`);
}

export function useIsTablet(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.MD})`);
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.MD})`);
}

export default useMediaQuery;
