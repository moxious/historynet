/**
 * ShareButtons - Permalink and Share buttons for resource pages and infobox
 * 
 * Features:
 * - Permalink button: Copies stable URL to clipboard
 * - Share button: Uses Web Share API if available, falls back to copy
 * - Visual feedback on successful actions
 */

import { useState, useCallback } from 'react';
import './ShareButtons.css';

interface ShareButtonsProps {
  /** The URL to share/copy */
  url: string;
  /** Title for the share dialog */
  title?: string;
  /** Description/text for the share dialog */
  description?: string;
  /** Layout variant */
  variant?: 'inline' | 'stacked';
  /** Size variant */
  size?: 'small' | 'medium';
}

function ShareButtons({
  url,
  title = 'Check this out',
  description,
  variant = 'inline',
  size = 'small',
}: ShareButtonsProps) {
  const [copyFeedback, setCopyFeedback] = useState<'idle' | 'copied'>('idle');
  const [shareFeedback, setShareFeedback] = useState<'idle' | 'shared' | 'copied'>('idle');

  // Reset feedback after a delay
  const resetFeedback = useCallback((setter: (v: 'idle') => void) => {
    setTimeout(() => setter('idle'), 2000);
  }, []);

  // Copy URL to clipboard
  const handleCopyPermalink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyFeedback('copied');
      resetFeedback(() => setCopyFeedback('idle'));
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  }, [url, resetFeedback]);

  // Share using Web Share API or fallback to copy
  const handleShare = useCallback(async () => {
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        setShareFeedback('shared');
        resetFeedback(() => setShareFeedback('idle'));
      } catch (err) {
        // User cancelled or share failed - don't show error for cancel
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setShareFeedback('copied');
        resetFeedback(() => setShareFeedback('idle'));
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  }, [url, title, description, resetFeedback]);

  const containerClass = `share-buttons share-buttons--${variant} share-buttons--${size}`;

  return (
    <div className={containerClass}>
      {/* Permalink Button */}
      <button
        className="share-buttons__button share-buttons__button--permalink"
        onClick={handleCopyPermalink}
        title={copyFeedback === 'copied' ? 'Copied!' : 'Copy permalink'}
        aria-label="Copy permalink to clipboard"
      >
        {copyFeedback === 'copied' ? (
          <>
            <svg
              className="share-buttons__icon share-buttons__icon--success"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="share-buttons__label">Copied!</span>
          </>
        ) : (
          <>
            <svg
              className="share-buttons__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
            <span className="share-buttons__label">Permalink</span>
          </>
        )}
      </button>

      {/* Share Button */}
      <button
        className="share-buttons__button share-buttons__button--share"
        onClick={handleShare}
        title={
          shareFeedback === 'shared'
            ? 'Shared!'
            : shareFeedback === 'copied'
            ? 'Copied!'
            : 'Share'
        }
        aria-label="Share this page"
      >
        {shareFeedback !== 'idle' ? (
          <>
            <svg
              className="share-buttons__icon share-buttons__icon--success"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="share-buttons__label">
              {shareFeedback === 'shared' ? 'Shared!' : 'Copied!'}
            </span>
          </>
        ) : (
          <>
            <svg
              className="share-buttons__icon"
              viewBox="0 0 24 24"
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
            <span className="share-buttons__label">Share</span>
          </>
        )}
      </button>
    </div>
  );
}

export default ShareButtons;
