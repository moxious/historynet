/**
 * FeedbackForm - Modal form for submitting user feedback
 * 
 * Allows users to submit feedback about graph data without a GitHub account.
 * Captures context (URL, dataset) automatically and creates GitHub issues.
 * 
 * Features:
 * - Auto-populated dataset from URL
 * - Form validation
 * - Loading, success, and error states
 * - Light/dark theme support
 * - Accessible modal with focus management
 * 
 * Part of M25: User Feedback Feature
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import type { FeedbackSubmission, FeedbackFormState, FeedbackResponse } from '@types';
import './FeedbackForm.css';

interface FeedbackFormProps {
  /** Whether the form modal is open */
  isOpen: boolean;
  /** Callback to close the form */
  onClose: () => void;
  /** Dataset ID extracted from URL, or null for general feedback */
  datasetId: string | null;
  /** Full URL when the form was opened */
  contextUrl: string;
}

/** Email validation regex */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FeedbackForm({ isOpen, onClose, datasetId, contextUrl }: FeedbackFormProps) {
  // Form state
  const [feedback, setFeedback] = useState('');
  const [evidence, setEvidence] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [email, setEmail] = useState('');
  
  // Validation state
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  
  // Submission state
  const [formState, setFormState] = useState<FeedbackFormState>({ status: 'idle' });
  
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const feedbackInputRef = useRef<HTMLTextAreaElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setFeedback('');
      setEvidence('');
      setAdditionalInfo('');
      setEmail('');
      setFeedbackError(null);
      setEmailError(null);
      setFormState({ status: 'idle' });
      
      // Focus the first input after a short delay
      const timer = setTimeout(() => {
        feedbackInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && formState.status !== 'submitting') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, formState.status]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    let isValid = true;

    // Validate feedback (required)
    if (!feedback.trim()) {
      setFeedbackError('Please describe your feedback');
      isValid = false;
    } else {
      setFeedbackError(null);
    }

    // Validate email (optional, but must be valid if provided)
    if (email.trim() && !EMAIL_REGEX.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError(null);
    }

    return isValid;
  }, [feedback, email]);

  // Submit form
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormState({ status: 'submitting' });

    const submission: FeedbackSubmission = {
      dataset: datasetId,
      feedback: feedback.trim(),
      evidence: evidence.trim() || undefined,
      additionalInfo: additionalInfo.trim() || undefined,
      email: email.trim() || undefined,
      contextUrl,
    };

    try {
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      const data: FeedbackResponse = await response.json();

      if (!response.ok || !data.success) {
        setFormState({ 
          status: 'error', 
          message: data.error || 'Failed to submit feedback. Please try again.' 
        });
        return;
      }

      setFormState({ 
        status: 'success', 
        issueUrl: data.issueUrl || '' 
      });
    } catch {
      setFormState({ 
        status: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    }
  }, [validateForm, datasetId, feedback, evidence, additionalInfo, email, contextUrl]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && formState.status !== 'submitting') {
      onClose();
    }
  }, [onClose, formState.status]);

  if (!isOpen) {
    return null;
  }

  const datasetLabel = datasetId 
    ? datasetId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'General Feedback';

  return (
    <div 
      className="feedback-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
    >
      <div 
        ref={modalRef}
        className="feedback-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="feedback-modal__header">
          <h2 id="feedback-title" className="feedback-modal__title">
            Submit Feedback
          </h2>
          <button
            ref={closeButtonRef}
            className="feedback-modal__close"
            onClick={onClose}
            aria-label="Close feedback form"
            type="button"
            disabled={formState.status === 'submitting'}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success State */}
        {formState.status === 'success' && (
          <div className="feedback-modal__content feedback-modal__content--success">
            <div className="feedback-success">
              <div className="feedback-success__icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
              </div>
              <h3 className="feedback-success__title">Thank you for your feedback!</h3>
              <p className="feedback-success__message">
                Your feedback has been submitted and will be reviewed by our team.
              </p>
              {formState.issueUrl && (
                <a 
                  href={formState.issueUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="feedback-success__link"
                >
                  View on GitHub
                </a>
              )}
              <button
                className="feedback-modal__button feedback-modal__button--primary"
                onClick={onClose}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {formState.status === 'error' && (
          <div className="feedback-modal__content">
            <div className="feedback-error">
              <div className="feedback-error__icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="feedback-error__title">Submission Failed</h3>
              <p className="feedback-error__message">{formState.message}</p>
              <button
                className="feedback-modal__button feedback-modal__button--primary"
                onClick={() => setFormState({ status: 'idle' })}
                type="button"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Form (idle or submitting) */}
        {(formState.status === 'idle' || formState.status === 'submitting') && (
          <form className="feedback-modal__content" onSubmit={handleSubmit}>
            {/* Help text */}
            <div className="feedback-modal__help">
              <p>
                Help us improve the data! Your feedback will be publicly posted as a 
                {' '}
                <a 
                  href="https://github.com/moxious/historynet/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  GitHub issue
                </a>
                {' '}for review.
              </p>
            </div>

            {/* Dataset (read-only) */}
            <div className="feedback-modal__field">
              <label className="feedback-modal__label">Dataset</label>
              <div className="feedback-modal__dataset">{datasetLabel}</div>
            </div>

            {/* Feedback (required) */}
            <div className="feedback-modal__field">
              <label htmlFor="feedback-text" className="feedback-modal__label">
                What's missing, incorrect, or should be changed?
                <span className="feedback-modal__required">*</span>
              </label>
              <textarea
                ref={feedbackInputRef}
                id="feedback-text"
                className={`feedback-modal__textarea ${feedbackError ? 'feedback-modal__textarea--error' : ''}`}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Describe what needs to be added, corrected, or changed..."
                rows={4}
                disabled={formState.status === 'submitting'}
                aria-invalid={!!feedbackError}
                aria-describedby={feedbackError ? 'feedback-error' : undefined}
              />
              {feedbackError && (
                <span id="feedback-error" className="feedback-modal__error">
                  {feedbackError}
                </span>
              )}
            </div>

            {/* Evidence (optional) */}
            <div className="feedback-modal__field">
              <label htmlFor="feedback-evidence" className="feedback-modal__label">
                Evidence: links, citations, or explanation
                <span className="feedback-modal__optional">(optional)</span>
              </label>
              <textarea
                id="feedback-evidence"
                className="feedback-modal__textarea"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Provide URLs, book citations, or explain how you know this..."
                rows={3}
                disabled={formState.status === 'submitting'}
              />
            </div>

            {/* Additional info (optional) */}
            <div className="feedback-modal__field">
              <label htmlFor="feedback-additional" className="feedback-modal__label">
                Anything else?
                <span className="feedback-modal__optional">(optional)</span>
              </label>
              <textarea
                id="feedback-additional"
                className="feedback-modal__textarea"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Any other context that might be helpful..."
                rows={2}
                disabled={formState.status === 'submitting'}
              />
            </div>

            {/* Email (optional) */}
            <div className="feedback-modal__field">
              <label htmlFor="feedback-email" className="feedback-modal__label">
                Email
                <span className="feedback-modal__optional">(optional, kept private)</span>
              </label>
              <input
                id="feedback-email"
                type="email"
                className={`feedback-modal__input ${emailError ? 'feedback-modal__input--error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={formState.status === 'submitting'}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
              />
              {emailError && (
                <span id="email-error" className="feedback-modal__error">
                  {emailError}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="feedback-modal__actions">
              <button
                type="button"
                className="feedback-modal__button feedback-modal__button--secondary"
                onClick={onClose}
                disabled={formState.status === 'submitting'}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="feedback-modal__button feedback-modal__button--primary"
                disabled={formState.status === 'submitting'}
              >
                {formState.status === 'submitting' ? (
                  <>
                    <span className="feedback-modal__spinner" aria-hidden="true" />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default FeedbackForm;
