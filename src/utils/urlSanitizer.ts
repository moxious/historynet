/**
 * URL sanitization utilities for security
 *
 * These functions validate and sanitize URLs before use in href attributes
 * and image sources to prevent XSS attacks via malicious URL schemes.
 *
 * Security rules: F4, F6 (sanitize URLs, reject dangerous schemes)
 */

/**
 * Allowed protocols for external links
 * - http/https: Standard web links
 * - mailto: Email links
 */
const ALLOWED_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:'];

/**
 * Allowed protocols for image sources
 * - Only http/https are safe for images
 */
const ALLOWED_IMAGE_PROTOCOLS = ['http:', 'https:'];

/**
 * Sanitize a URL for use in href attributes
 *
 * Returns the original URL if it uses a safe protocol (http, https, mailto),
 * otherwise returns '#' to neutralize the link.
 *
 * This prevents XSS attacks via javascript:, data:, vbscript:, etc.
 *
 * @param url - The URL to sanitize
 * @returns The original URL if safe, otherwise '#'
 *
 * @example
 * sanitizeUrl('https://example.com')     // 'https://example.com'
 * sanitizeUrl('javascript:alert(1)')     // '#'
 * sanitizeUrl('mailto:user@example.com') // 'mailto:user@example.com'
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '#';
  }

  // Trim whitespace and handle empty strings
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return '#';
  }

  try {
    // Use URL constructor to parse and validate
    // SECURITY: constructed URL with URL API (F3)
    const parsed = new URL(trimmedUrl);

    // Check if protocol is in allowed list
    if (ALLOWED_LINK_PROTOCOLS.includes(parsed.protocol)) {
      return trimmedUrl;
    }

    // Block dangerous protocols
    return '#';
  } catch {
    // If URL parsing fails, it might be a relative URL or invalid
    // For external links, we only accept absolute URLs with known protocols
    return '#';
  }
}

/**
 * Check if a URL is valid for use as an image source
 *
 * Only allows http and https protocols for images.
 * More restrictive than sanitizeUrl since images shouldn't use mailto, etc.
 *
 * @param url - The URL to validate
 * @returns true if the URL is safe to use as an image source
 *
 * @example
 * isValidImageUrl('https://example.com/image.png') // true
 * isValidImageUrl('javascript:alert(1)')           // false
 * isValidImageUrl('data:image/png;base64,...')     // false
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return false;
  }

  try {
    // SECURITY: constructed URL with URL API (F3)
    const parsed = new URL(trimmedUrl);
    return ALLOWED_IMAGE_PROTOCOLS.includes(parsed.protocol);
  } catch {
    // Invalid URL
    return false;
  }
}
