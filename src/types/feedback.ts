/**
 * Types for user feedback submission
 * 
 * Part of M25: User Feedback Feature
 */

/**
 * Data submitted by users via the feedback form
 */
export interface FeedbackSubmission {
  /** Dataset ID, or null when on homepage (general feedback) */
  dataset: string | null;
  /** Main feedback text (required) */
  feedback: string;
  /** URLs, citations, or narrative evidence (optional) */
  evidence?: string;
  /** Additional context or information (optional) */
  additionalInfo?: string;
  /** Optional contact email (kept private, not included in GitHub issue) */
  email?: string;
  /** Full URL when form was opened (for context) */
  contextUrl: string;
}

/**
 * Response from the feedback submission API
 */
export interface FeedbackResponse {
  /** Whether the submission was successful */
  success: boolean;
  /** URL of the created GitHub issue (on success) */
  issueUrl?: string;
  /** Error message (on failure) */
  error?: string;
}

/**
 * State of the feedback form submission
 */
export type FeedbackFormState = 
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; issueUrl: string }
  | { status: 'error'; message: string };
