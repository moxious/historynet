/**
 * ResourceMeta - Dynamic meta tags for SEO and social sharing
 *
 * Sets page title and Open Graph meta tags for resource pages.
 *
 * Note: In a pure SPA without server-side rendering, these meta tags
 * update client-side only. Social media crawlers and search engines
 * may not see them unless the app uses SSR or prerendering.
 *
 * For full SEO support, consider migrating to SSR (e.g., Next.js)
 * or using a prerendering service.
 */

import { Helmet } from 'react-helmet-async';

interface ResourceMetaProps {
  /** Page title (will be formatted as "{title} | {datasetName} | Scenius") */
  title: string;
  /** Short description for meta description and og:description */
  description?: string;
  /** Dataset name for title suffix */
  datasetName: string;
  /** Image URL for og:image (falls back to default if not provided) */
  imageUrl?: string;
  /** Canonical URL for this resource */
  canonicalUrl?: string;
  /** Open Graph type (defaults to 'article') */
  ogType?: 'article' | 'website' | 'profile';
  /** Optional date for article:published_time (ISO 8601 or year) */
  publishedDate?: string;
}

const PRODUCTION_BASE_URL = 'https://moxious.github.io/historynet';
const DEFAULT_IMAGE = `${PRODUCTION_BASE_URL}/favicon.svg`;
const APP_NAME = 'Scenius';

/**
 * Ensure image URL is absolute for social sharing
 * Relative URLs don't work for og:image / twitter:image
 */
function ensureAbsoluteImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl) {
    return DEFAULT_IMAGE;
  }

  // Already absolute URL
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Relative URL starting with / - prepend production base
  if (imageUrl.startsWith('/')) {
    return `${PRODUCTION_BASE_URL}${imageUrl}`;
  }

  // Other relative URL - prepend production base with /
  return `${PRODUCTION_BASE_URL}/${imageUrl}`;
}

function ResourceMeta({
  title,
  description,
  datasetName,
  imageUrl,
  canonicalUrl,
  ogType = 'article',
  publishedDate,
}: ResourceMetaProps) {
  const fullTitle = `${title} | ${datasetName} | ${APP_NAME}`;
  const metaDescription =
    description || `View ${title} in the ${datasetName} network on ${APP_NAME}`;
  // SECURITY: Image URLs are sanitized via ensureAbsoluteImageUrl (F4/F6)
  const ogImage = ensureAbsoluteImageUrl(imageUrl);

  // Build canonical URL if not provided
  const canonical = canonicalUrl || window.location.href;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* Article-specific meta (for historical figures, use dates if available) */}
      {publishedDate && <meta property="article:published_time" content={publishedDate} />}
      <meta property="article:author" content="Scenius Contributors" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
}

export default ResourceMeta;
