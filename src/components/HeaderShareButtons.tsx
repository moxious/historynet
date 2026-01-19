/**
 * HeaderShareButtons - Compact emoji-based share buttons for the Header
 * 
 * Features:
 * - Copy permalink button: Shows link emoji, copies current URL to clipboard
 * - Share button: Uses Web Share API with clipboard fallback
 * - Visual feedback: Brief checkmark on success
 * - 44px touch targets for mobile accessibility
 */

import { useState, useCallback } from 'react';
import './HeaderShareButtons.css';

function HeaderShareButtons() {
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  // Copy current URL to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  }, []);

  // Share using Web Share API or fallback to copy
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          url: window.location.href,
          title: document.title,
        });
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 1500);
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
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 1500);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  }, []);

  return (
    <div className="header-share-buttons">
      <button
        className={`header-share-buttons__button ${copyFeedback ? 'header-share-buttons__button--success' : ''}`}
        onClick={handleCopy}
        title={copyFeedback ? 'Copied!' : 'Permalink'}
        aria-label="Copy link to clipboard"
        type="button"
      >
        <span className="header-share-buttons__emoji" role="img" aria-hidden="true">
          {copyFeedback ? '✅' : '🔗'}
        </span>
      </button>
      <button
        className={`header-share-buttons__button ${shareFeedback ? 'header-share-buttons__button--success' : ''}`}
        onClick={handleShare}
        title={shareFeedback ? 'Shared!' : 'Share'}
        aria-label="Share this page"
        type="button"
      >
        <span className="header-share-buttons__emoji" role="img" aria-hidden="true">
          {shareFeedback ? '✅' : '↗'}
        </span>
      </button>
    </div>
  );
}

export default HeaderShareButtons;
