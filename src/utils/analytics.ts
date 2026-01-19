/**
 * Google Analytics 4 integration using react-ga4
 *
 * Analytics is automatically disabled when VITE_GA_TRACKING_ID is not set,
 * making it safe to use in development without a tracking ID.
 */
import ReactGA from 'react-ga4';

const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID as string | undefined;

/**
 * Initialize Google Analytics.
 * Call this once at app startup (in main.tsx).
 */
export const initGA = (): void => {
  if (TRACKING_ID) {
    ReactGA.initialize(TRACKING_ID);
  }
};

/**
 * Track a page view.
 * @param path - The page path (e.g., '/ai-llm-research/explore')
 */
export const trackPageView = (path: string): void => {
  if (TRACKING_ID) {
    ReactGA.send({ hitType: 'pageview', page: path });
  }
};

/**
 * Track a custom event.
 * @param category - Event category (e.g., 'Dataset')
 * @param action - Event action (e.g., 'select')
 * @param label - Optional event label (e.g., 'ai-llm-research')
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string
): void => {
  if (TRACKING_ID) {
    ReactGA.event({ category, action, label });
  }
};

/**
 * Check if analytics is enabled.
 * @returns true if VITE_GA_TRACKING_ID is set
 */
export const isAnalyticsEnabled = (): boolean => !!TRACKING_ID;
