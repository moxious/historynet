/**
 * NotFoundPage - Displays a 404-style error for invalid routes
 *
 * Shows when:
 * - Invalid dataset ID
 * - Node/edge not found in dataset
 * - Malformed URLs
 *
 * SEO: Includes noindex meta tag to prevent search engines from indexing error pages.
 */

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './NotFoundPage.css';

interface NotFoundPageProps {
  /** Specific error message to display */
  message?: string;
  /** The dataset ID if available (for navigation) */
  datasetId?: string;
}

function NotFoundPage({ message, datasetId }: NotFoundPageProps) {
  return (
    <div className="not-found-page">
      <Helmet>
        <title>Page Not Found | Scenius</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="not-found-page__content">
        <div className="not-found-page__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
        </div>
        
        <h1 className="not-found-page__title">Page Not Found</h1>
        
        <p className="not-found-page__message">
          {message || "The resource you're looking for doesn't exist or has been moved."}
        </p>
        
        <div className="not-found-page__actions">
          <Link to="/" className="not-found-page__button not-found-page__button--primary">
            Go to Home
          </Link>
          {datasetId && (
            <Link 
              to={`/?dataset=${encodeURIComponent(datasetId)}`} 
              className="not-found-page__button not-found-page__button--secondary"
            >
              View Dataset
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
