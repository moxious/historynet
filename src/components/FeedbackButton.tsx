/**
 * FeedbackButton - Floating button for user feedback
 * 
 * A fixed-position button in the bottom-right corner that opens
 * the feedback form modal. Visible on all pages.
 * 
 * Features:
 * - Floating position (fixed, bottom-right)
 * - Auto-captures context URL when clicked
 * - Extracts dataset ID from URL path
 * - Light/dark theme support
 * - Mobile-friendly with icon-only variant
 * - Safe area inset support for iPhone
 * 
 * Part of M25: User Feedback Feature
 */

import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import FeedbackForm from './FeedbackForm';
import './FeedbackButton.css';

/**
 * Extract dataset ID from the current path
 * Returns null for homepage or paths without a dataset
 */
function extractDatasetId(pathname: string): string | null {
  // Remove leading slash and split
  const segments = pathname.replace(/^\//, '').split('/');
  
  // First segment is dataset ID (if not empty and not a reserved route)
  const firstSegment = segments[0];
  
  // Empty path means homepage - no dataset
  if (!firstSegment) {
    return null;
  }
  
  // Return the first segment as dataset ID
  // This handles:
  // - /:datasetId
  // - /:datasetId/explore
  // - /:datasetId/node/:nodeId
  // - /:datasetId/from/:sourceId/to/:targetId
  return firstSegment;
}

function FeedbackButton() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [capturedContext, setCapturedContext] = useState<{ url: string; datasetId: string | null }>({
    url: '',
    datasetId: null,
  });
  
  const location = useLocation();

  const handleOpenForm = useCallback(() => {
    // Capture context at the moment the button is clicked
    const fullUrl = window.location.href;
    const datasetId = extractDatasetId(location.pathname);
    
    setCapturedContext({
      url: fullUrl,
      datasetId,
    });
    setIsFormOpen(true);
  }, [location.pathname]);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  return (
    <>
      <button
        className="feedback-button"
        onClick={handleOpenForm}
        aria-label="Send feedback"
        type="button"
      >
        <svg 
          className="feedback-button__icon" 
          viewBox="0 0 24 24" 
          width="20" 
          height="20" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Message bubble icon */}
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="feedback-button__label">Feedback</span>
      </button>

      <FeedbackForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        datasetId={capturedContext.datasetId}
        contextUrl={capturedContext.url}
      />
    </>
  );
}

export default FeedbackButton;
