/**
 * Feedback Submission API Endpoint
 *
 * Receives user feedback and creates a GitHub issue.
 * Email and IP are logged privately but NOT included in the public issue.
 *
 * @endpoint POST /api/submit-feedback
 * @body {FeedbackSubmission} The feedback data
 * @returns {FeedbackResponse} Success with issue URL, or error
 *
 * Part of M25: User Feedback Feature
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FeedbackSubmission {
  dataset: string | null;
  feedback: string;
  evidence?: string;
  additionalInfo?: string;
  email?: string;
  contextUrl: string;
}

interface FeedbackResponse {
  success: boolean;
  issueUrl?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Rate Limiting (In-Memory)
// Note: Resets on cold starts; consider Vercel KV for persistence
// ---------------------------------------------------------------------------

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getRateLimitKey(req: VercelRequest): string {
  // Use x-forwarded-for for real IP behind Vercel's proxy
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].split(',')[0].trim();
  }
  // Fallback to remote address
  return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    // First request or window expired
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

// ---------------------------------------------------------------------------
// Input Sanitization
// ---------------------------------------------------------------------------

/** Strip HTML tags from text */
function stripHtml(text: string): string {
  // Remove HTML tags but preserve text content
  return text.replace(/<[^>]*>/g, '');
}

/** Truncate text to max length */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/** Validate URL format (basic check) */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/** Sanitize and validate input */
function sanitizeSubmission(
  body: unknown
): { valid: true; data: FeedbackSubmission } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { dataset, feedback, evidence, additionalInfo, email, contextUrl } =
    body as Record<string, unknown>;

  // Required: feedback
  if (typeof feedback !== 'string' || !feedback.trim()) {
    return { valid: false, error: 'Feedback is required' };
  }

  // Required: contextUrl
  if (typeof contextUrl !== 'string' || !contextUrl.trim()) {
    return { valid: false, error: 'Context URL is required' };
  }

  // Validate contextUrl format
  if (!isValidUrl(contextUrl)) {
    return { valid: false, error: 'Invalid context URL' };
  }

  // Optional: dataset (string or null)
  const sanitizedDataset =
    dataset === null || dataset === undefined
      ? null
      : typeof dataset === 'string'
        ? truncate(stripHtml(dataset), 100)
        : null;

  // Optional: email (validate format if provided)
  let sanitizedEmail: string | undefined;
  if (email && typeof email === 'string' && email.trim()) {
    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      return { valid: false, error: 'Invalid email format' };
    }
    sanitizedEmail = emailTrimmed;
  }

  return {
    valid: true,
    data: {
      dataset: sanitizedDataset,
      feedback: truncate(stripHtml(feedback.trim()), 5000),
      evidence:
        evidence && typeof evidence === 'string'
          ? truncate(stripHtml(evidence.trim()), 2000) || undefined
          : undefined,
      additionalInfo:
        additionalInfo && typeof additionalInfo === 'string'
          ? truncate(stripHtml(additionalInfo.trim()), 1000) || undefined
          : undefined,
      email: sanitizedEmail,
      contextUrl: contextUrl.trim(),
    },
  };
}

// ---------------------------------------------------------------------------
// GitHub Issue Creation
// ---------------------------------------------------------------------------

/** Format feedback into GitHub issue body (markdown) */
function formatIssueBody(data: FeedbackSubmission): string {
  const datasetSection = data.dataset
    ? `**Dataset**: ${data.dataset}`
    : '**Dataset**: General Feedback (no specific dataset)';

  const feedbackSection = `## Feedback\n\n${data.feedback}`;

  const evidenceSection = data.evidence
    ? `## Evidence Provided\n\n${data.evidence}`
    : '## Evidence Provided\n\n*No evidence provided*';

  const additionalSection = data.additionalInfo
    ? `## Additional Info\n\n${data.additionalInfo}`
    : '';

  const footer = `---\n*Submitted via Scenius feedback form*\n*Context URL: ${data.contextUrl}*`;

  return [datasetSection, feedbackSection, evidenceSection, additionalSection, footer]
    .filter(Boolean)
    .join('\n\n');
}

/** Generate issue title from feedback */
function generateIssueTitle(data: FeedbackSubmission): string {
  const prefix = data.dataset ? `[${data.dataset}]` : '[General]';
  // Take first 60 chars of feedback for title
  const feedbackSummary = data.feedback.slice(0, 60).replace(/\n/g, ' ');
  const ellipsis = data.feedback.length > 60 ? '...' : '';
  return `${prefix} ${feedbackSummary}${ellipsis}`;
}

/** Create GitHub issue via API */
async function createGitHubIssue(
  data: FeedbackSubmission
): Promise<{ success: true; issueUrl: string } | { success: false; error: string }> {
  const token = process.env.GITHUB_PAT;

  if (!token) {
    console.error('[Feedback] GITHUB_PAT environment variable is not set');
    return {
      success: false,
      error: 'Server configuration error. Please try again later.',
    };
  }

  const owner = 'moxious';
  const repo = 'historynet';

  // Determine labels
  const labels = ['feedback'];
  if (data.dataset) {
    labels.push(`dataset:${data.dataset}`);
  } else {
    labels.push('general');
  }

  const body = formatIssueBody(data);
  const title = generateIssueTitle(data);

  try {
    // SECURITY: constructed URL with URL API (F3)
    const url = new URL(`/repos/${owner}/${repo}/issues`, 'https://api.github.com');

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Scenius-Feedback-Bot',
      },
      body: JSON.stringify({
        title,
        body,
        labels,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Feedback] GitHub API error:', response.status, errorText);
      return {
        success: false,
        error: 'Failed to create issue. Please try again later.',
      };
    }

    const result = (await response.json()) as { html_url?: string };

    if (!result.html_url) {
      console.error('[Feedback] GitHub API returned no issue URL');
      return {
        success: false,
        error: 'Unexpected response from GitHub. Please try again.',
      };
    }

    return { success: true, issueUrl: result.html_url };
  } catch (error) {
    console.error('[Feedback] GitHub API request failed:', error);
    return {
      success: false,
      error: 'Network error when creating issue. Please try again.',
    };
  }
}

// ---------------------------------------------------------------------------
// Request Handler
// ---------------------------------------------------------------------------

/** Set CORS headers */
function setCorsHeaders(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> {
  setCorsHeaders(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    } satisfies FeedbackResponse);
  }

  // Check Content-Type
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    return res.status(400).json({
      success: false,
      error: 'Content-Type must be application/json',
    } satisfies FeedbackResponse);
  }

  // Rate limiting
  const clientIp = getRateLimitKey(req);
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: 'Too many submissions. Please wait an hour before trying again.',
    } satisfies FeedbackResponse);
  }

  // Validate and sanitize input
  const validation = sanitizeSubmission(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.error,
    } satisfies FeedbackResponse);
  }

  const data = validation.data;

  // Log submission metadata privately (not in GitHub issue)
  // FB21: IP and email are logged for abuse tracking but NOT exposed publicly
  console.log('[Feedback] Submission received:', {
    ip: clientIp,
    email: data.email || '(not provided)',
    dataset: data.dataset || 'general',
    contextUrl: data.contextUrl,
    timestamp: new Date().toISOString(),
  });

  // Create GitHub issue
  const result = await createGitHubIssue(data);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      error: result.error,
    } satisfies FeedbackResponse);
  }

  return res.status(200).json({
    success: true,
    issueUrl: result.issueUrl,
  } satisfies FeedbackResponse);
}
