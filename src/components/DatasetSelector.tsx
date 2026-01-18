/**
 * DatasetSelector - Dropdown for selecting and switching datasets
 *
 * Features:
 * - Dropdown with available datasets
 * - Shows dataset metadata on hover/focus
 * - Loading indicator during dataset switch
 * - Accessible with proper ARIA labels
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import type { DatasetManifest } from '@types';
import { loadManifest, AVAILABLE_DATASETS } from '@utils';
import './DatasetSelector.css';

interface DatasetOption {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  nodeCount?: number;
  edgeCount?: number;
  loading: boolean;
  error?: string;
}

interface DatasetSelectorProps {
  /** Currently selected dataset ID */
  currentDatasetId: string | null;
  /** Callback when a dataset is selected */
  onSelect: (datasetId: string) => void;
  /** Whether dataset is currently loading */
  isLoading?: boolean;
  /** Optional class name */
  className?: string;
}

function DatasetSelector({
  currentDatasetId,
  onSelect,
  isLoading = false,
  className = '',
}: DatasetSelectorProps) {
  const [datasets, setDatasets] = useState<DatasetOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingManifests, setLoadingManifests] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load all dataset manifests on mount
  useEffect(() => {
    // REACT: track mounted state to prevent state updates after unmount (R4)
    let isMounted = true;

    async function loadAllManifests() {
      setLoadingManifests(true);
      const results: DatasetOption[] = [];

      for (const id of AVAILABLE_DATASETS) {
        // REACT: bail early if component unmounted during async loop (R4)
        if (!isMounted) return;

        try {
          const manifest: DatasetManifest = await loadManifest(id);
          results.push({
            id: manifest.id,
            name: manifest.name,
            description: manifest.description,
            lastUpdated: manifest.lastUpdated,
            nodeCount: manifest.nodeCount,
            edgeCount: manifest.edgeCount,
            loading: false,
          });
        } catch (error) {
          results.push({
            id,
            name: id,
            description: 'Failed to load metadata',
            lastUpdated: '',
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      // REACT: only update state if still mounted (R4)
      if (isMounted) {
        setDatasets(results);
        setLoadingManifests(false);
      }
    }

    loadAllManifests();

    // REACT: cleanup sets mounted flag to false (R4)
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (datasetId: string) => {
      if (datasetId !== currentDatasetId) {
        onSelect(datasetId);
      }
      setIsOpen(false);
    },
    [currentDatasetId, onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, datasetId: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect(datasetId);
      }
    },
    [handleSelect]
  );

  // Get current dataset info
  const currentDataset = datasets.find((d) => d.id === currentDatasetId);
  const displayName = currentDataset?.name ?? currentDatasetId ?? 'Select dataset';

  // Format date for display
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div ref={containerRef} className={`dataset-selector ${className}`}>
      <button
        className={`dataset-selector__trigger ${isOpen ? 'dataset-selector__trigger--open' : ''}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select dataset"
        disabled={loadingManifests || isLoading}
      >
        <span className="dataset-selector__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" />
            <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" />
          </svg>
        </span>

        <span className="dataset-selector__label">{displayName}</span>

        {isLoading ? (
          <span className="dataset-selector__spinner" aria-label="Loading" />
        ) : (
          <span className="dataset-selector__chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="dataset-selector__dropdown" role="listbox" aria-label="Available datasets">
          {loadingManifests ? (
            <div className="dataset-selector__loading">Loading datasets...</div>
          ) : datasets.length === 0 ? (
            <div className="dataset-selector__empty">No datasets available</div>
          ) : (
            datasets.map((dataset) => (
              <div
                key={dataset.id}
                className={`dataset-selector__option ${
                  dataset.id === currentDatasetId ? 'dataset-selector__option--selected' : ''
                } ${dataset.error ? 'dataset-selector__option--error' : ''}`}
                role="option"
                aria-selected={dataset.id === currentDatasetId}
                tabIndex={0}
                onClick={() => handleSelect(dataset.id)}
                onKeyDown={(e) => handleKeyDown(e, dataset.id)}
              >
                <div className="dataset-selector__option-header">
                  <span className="dataset-selector__option-name">{dataset.name}</span>
                  {dataset.id === currentDatasetId && (
                    <span className="dataset-selector__check" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </div>

                <p className="dataset-selector__option-description">{dataset.description}</p>

                <div className="dataset-selector__option-meta">
                  {dataset.nodeCount !== undefined && dataset.edgeCount !== undefined && (
                    <span className="dataset-selector__option-stats">
                      {dataset.nodeCount} nodes · {dataset.edgeCount} edges
                    </span>
                  )}
                  {dataset.lastUpdated && (
                    <span className="dataset-selector__option-date">
                      Updated {formatDate(dataset.lastUpdated)}
                    </span>
                  )}
                </div>

                {dataset.error && (
                  <span className="dataset-selector__option-error">Error: {dataset.error}</span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default DatasetSelector;
