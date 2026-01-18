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
}

const DEFAULT_IMAGE = '/favicon.svg';
const APP_NAME = 'Scenius';

function ResourceMeta({
  title,
  description,
  datasetName,
  imageUrl,
  canonicalUrl,
  ogType = 'article',
}: ResourceMetaProps) {
  const fullTitle = `${title} | ${datasetName} | ${APP_NAME}`;
  const metaDescription = description || `View ${title} in the ${datasetName} network on ${APP_NAME}`;
  const ogImage = imageUrl || DEFAULT_IMAGE;
  
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
      <meta property="og:site_name" content={APP_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
}

export default ResourceMeta;
