/**
 * HomePage - Landing page with browsable dataset tiles
 * 
 * URL: /#/
 * 
 * Displays all available datasets as clickable tiles with:
 * - Search/filter by name or description
 * - Chronological sorting by dataset date range
 * - Responsive grid layout
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import type { DatasetManifest } from '@types';
import { loadManifest, AVAILABLE_DATASETS } from '@utils/dataLoader';
import { useDebounce } from '@hooks';
import DatasetTile, { getStartYear } from '@components/DatasetTile';
import './HomePage.css';

interface DatasetWithManifest {
  id: string;
  manifest: DatasetManifest | null;
  loading: boolean;
  error: string | null;
}

function HomePage() {
  // State for dataset manifests
  const [datasets, setDatasets] = useState<DatasetWithManifest[]>(
    AVAILABLE_DATASETS.map(id => ({
      id,
      manifest: null,
      loading: true,
      error: null,
    }))
  );
  const [loadingAll, setLoadingAll] = useState(true);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  // Load all dataset manifests on mount
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadAllManifests() {
      const results: DatasetWithManifest[] = [];

      for (const id of AVAILABLE_DATASETS) {
        if (!isMounted || controller.signal.aborted) return;

        try {
          const manifest = await loadManifest(id, controller.signal);
          results.push({
            id,
            manifest,
            loading: false,
            error: null,
          });
        } catch (err) {
          // Skip aborted requests
          if (err instanceof Error && err.name === 'AbortError') {
            return;
          }
          results.push({
            id,
            manifest: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load',
          });
        }
      }

      if (isMounted && !controller.signal.aborted) {
        setDatasets(results);
        setLoadingAll(false);
      }
    }

    loadAllManifests();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Filter and sort datasets
  const displayedDatasets = useMemo(() => {
    // Filter out loading/error datasets and those without manifests
    let filtered = datasets.filter(
      (d): d is DatasetWithManifest & { manifest: DatasetManifest } =>
        d.manifest !== null && !d.error
    );

    // Apply search filter
    if (debouncedSearchTerm.trim()) {
      const lowerSearch = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        d =>
          d.manifest.name.toLowerCase().includes(lowerSearch) ||
          d.manifest.description.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort chronologically by start year
    return filtered.sort((a, b) => {
      const yearA = getStartYear(a.manifest);
      const yearB = getStartYear(b.manifest);
      return yearA - yearB;
    });
  }, [datasets, debouncedSearchTerm]);

  // Search handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Calculate loaded count for loading state
  const loadedCount = datasets.filter(d => !d.loading).length;
  const totalCount = datasets.length;

  return (
    <div className="homepage">
      <Helmet>
        <title>Scenius - Explore Collective Genius</title>
        <meta
          name="description"
          content="Discover and explore historical social networks through interactive visualizations. Browse networks of philosophers, scientists, artists, and innovators throughout history."
        />
        <link rel="canonical" href="https://scenius-seven.vercel.app/" />
        <meta property="og:title" content="Scenius - Explore Collective Genius" />
        <meta
          property="og:description"
          content="Discover and explore historical social networks through interactive visualizations. Browse networks of philosophers, scientists, artists, and innovators throughout history."
        />
        <meta property="og:url" content="https://scenius-seven.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Scenius" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Scenius - Explore Collective Genius" />
        <meta
          name="twitter:description"
          content="Discover and explore historical social networks through interactive visualizations."
        />
      </Helmet>

      {/* Main content */}
      <main className="homepage__main">
        {/* Hero section */}
        <section className="homepage__hero">
          <h2 className="homepage__heading">Explore Collective Genius</h2>
          <p className="homepage__intro">
            Discover the connections between great thinkers, artists, and innovators
            throughout history. Select a network below to begin exploring.
          </p>
        </section>

        {/* Search */}
        <div className="homepage__search-container">
          <div className="homepage__search-wrapper">
            <svg
              className="homepage__search-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="homepage__search-input"
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search datasets by name or description"
            />
            {searchTerm && (
              <button
                type="button"
                className="homepage__search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loadingAll && (
          <div className="homepage__loading">
            <div className="homepage__spinner" aria-hidden="true" />
            <p>Loading datasets ({loadedCount}/{totalCount})...</p>
          </div>
        )}

        {/* Empty state */}
        {!loadingAll && displayedDatasets.length === 0 && (
          <div className="homepage__empty">
            {debouncedSearchTerm ? (
              <>
                <p>No datasets matching "<strong>{debouncedSearchTerm}</strong>"</p>
                <button
                  type="button"
                  className="homepage__empty-clear"
                  onClick={handleClearSearch}
                >
                  Clear search
                </button>
              </>
            ) : (
              <p>No datasets available</p>
            )}
          </div>
        )}

        {/* Dataset grid */}
        {!loadingAll && displayedDatasets.length > 0 && (
          <section className="homepage__grid-section">
            <div className="homepage__grid">
              {displayedDatasets.map(({ manifest }) => (
                <DatasetTile key={manifest.id} manifest={manifest} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="homepage__footer">
        <p className="homepage__footer-text">
          Scenius visualizes historical social networks to help understand how ideas spread through communities.
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
