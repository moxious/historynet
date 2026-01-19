/**
 * Hook for automatic Google Analytics page view tracking.
 *
 * Tracks page views on route changes in the SPA.
 * Safe to use even when analytics is disabled (no-op when VITE_GA_TRACKING_ID is not set).
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@utils/analytics';

/**
 * Track page views on route changes.
 * Call this once in App.tsx to enable automatic page view tracking.
 */
export function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);
}
