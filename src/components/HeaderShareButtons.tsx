/**
 * HeaderShareButtons - Share buttons for the Header with icons and toast feedback
 * 
 * Features:
 * - Copy permalink button: Copies current URL to clipboard
 * - Share button: Uses Web Share API with clipboard fallback
 * - SVG icons with visible labels on desktop
 * - Toast notifications for feedback
 * - 44px touch targets for mobile accessibility
 */

import { useCallback } from 'react';
import Toast, { useToast } from './Toast';
import './HeaderShareButtons.css';

function HeaderShareButtons() {
  const { toasts, showToast, dismissToast } = useToast();

  // Copy current URL to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied!', 'success');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  }, [showToast]);

  // Share using Web Share API or fallback to copy
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          url: window.location.href,
          title: document.title,
        });
        showToast('Shared!', 'success');
      } catch (err) {
        // User cancelled or share failed - don't show error for cancel
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied!', 'success');
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  }, [showToast]);

  return (
    <>
      <div className="header-share-buttons">
        <button
          className="header-share-buttons__button"
          onClick={handleCopy}
          title="Copy link to clipboard"
          aria-label="Copy link to clipboard"
          type="button"
        >
          <svg
            className="header-share-buttons__icon"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          <span className="header-share-buttons__label">Copy</span>
        </button>
        <button
          className="header-share-buttons__button"
          onClick={handleShare}
          title="Share this page"
          aria-label="Share this page"
          type="button"
        >
          <svg
            className="header-share-buttons__icon"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span className="header-share-buttons__label">Share</span>
        </button>
      </div>
      <Toast messages={toasts} onDismiss={dismissToast} duration={2000} />
    </>
  );
}

export default HeaderShareButtons;
