/**
 * SearchableDatasetSelector - Searchable combobox for dataset selection
 *
 * Replaces the dropdown-based DatasetSelector with a searchable combobox
 * that filters datasets by name or description as the user types.
 *
 * Features:
 * - Text input for search/filter
 * - Case-insensitive matching against name and description
 * - Keyboard navigation (arrow keys, Enter, Escape)
 * - ARIA combobox accessibility pattern
 * - Light/dark theme support
 * - Clear button to reset search
 * - Highlight matching text in results
 */

import { useCallback, useEffect, useState, useRef, useMemo, useId } from 'react';
import type { DatasetManifest } from '@types';
import { loadManifest, AVAILABLE_DATASETS } from '@utils';
import './SearchableDatasetSelector.css';

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

interface SearchableDatasetSelectorProps {
  /** Currently selected dataset ID */
  currentDatasetId: string | null;
  /** Callback when a dataset is selected */
  onSelect: (datasetId: string) => void;
  /** Whether dataset is currently loading */
  isLoading?: boolean;
  /** Optional class name */
  className?: string;
}

/**
 * Highlight matching text in a string
 */
function HighlightedText({
  text,
  highlight,
  className,
}: {
  text: string;
  highlight: string;
  className?: string;
}) {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="dataset-search__highlight">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

/**
 * Escape special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function SearchableDatasetSelector({
  currentDatasetId,
  onSelect,
  isLoading = false,
  className = '',
}: SearchableDatasetSelectorProps) {
  // Generate unique IDs for ARIA attributes
  const instanceId = useId();
  const inputId = `dataset-search-input-${instanceId}`;
  const listboxId = `dataset-search-listbox-${instanceId}`;

  // State
  const [datasets, setDatasets] = useState<DatasetOption[]>([]);
  const [loadingManifests, setLoadingManifests] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load all dataset manifests on mount
  useEffect(() => {
    let isMounted = true;

    async function loadAllManifests() {
      setLoadingManifests(true);
      const results: DatasetOption[] = [];

      for (const id of AVAILABLE_DATASETS) {
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

      if (isMounted) {
        setDatasets(results);
        setLoadingManifests(false);
      }
    }

    loadAllManifests();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter datasets based on search term
  const filteredDatasets = useMemo(() => {
    if (!searchTerm.trim()) {
      return datasets;
    }

    const lowerSearch = searchTerm.toLowerCase();
    return datasets.filter(
      (dataset) =>
        dataset.name.toLowerCase().includes(lowerSearch) ||
        dataset.description.toLowerCase().includes(lowerSearch)
    );
  }, [datasets, searchTerm]);

  // Reset active index when filtered results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [filteredDatasets.length, searchTerm]);

  // Scroll active option into view
  useEffect(() => {
    if (activeIndex >= 0 && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

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

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  }, []);

  // Handle clear button
  const handleClear = useCallback(() => {
    setSearchTerm('');
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, []);

  // Handle dataset selection
  const handleSelect = useCallback(
    (datasetId: string) => {
      onSelect(datasetId);
      setIsOpen(false);
      setSearchTerm('');
      setActiveIndex(-1);
    },
    [onSelect]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setActiveIndex((prev) =>
              prev < filteredDatasets.length - 1 ? prev + 1 : prev
            );
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
          }
          break;

        case 'Enter':
          e.preventDefault();
          if (isOpen && activeIndex >= 0 && filteredDatasets[activeIndex]) {
            handleSelect(filteredDatasets[activeIndex].id);
          } else if (!isOpen) {
            setIsOpen(true);
          }
          break;

        case 'Escape':
          e.preventDefault();
          if (isOpen) {
            setIsOpen(false);
            setActiveIndex(-1);
          } else if (searchTerm) {
            setSearchTerm('');
          }
          break;

        case 'Tab':
          // Allow default tab behavior but close dropdown
          setIsOpen(false);
          break;

        case 'Home':
          if (isOpen && filteredDatasets.length > 0) {
            e.preventDefault();
            setActiveIndex(0);
          }
          break;

        case 'End':
          if (isOpen && filteredDatasets.length > 0) {
            e.preventDefault();
            setActiveIndex(filteredDatasets.length - 1);
          }
          break;
      }
    },
    [isOpen, activeIndex, filteredDatasets, handleSelect, searchTerm]
  );

  // Handle option click
  const handleOptionClick = useCallback(
    (datasetId: string) => {
      handleSelect(datasetId);
    },
    [handleSelect]
  );

  // Handle option mouse enter (for hover state)
  const handleOptionMouseEnter = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Get current dataset info for display
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

  // Get option ID for ARIA
  const getOptionId = (index: number) => `${listboxId}-option-${index}`;

  return (
    <div ref={containerRef} className={`dataset-search ${className}`}>
      {/* Search input */}
      <div className="dataset-search__input-wrapper">
        <span className="dataset-search__icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" />
            <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" />
          </svg>
        </span>

        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className="dataset-search__input"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={displayName}
          aria-label="Search datasets"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? getOptionId(activeIndex) : undefined}
          aria-autocomplete="list"
          role="combobox"
          disabled={loadingManifests || isLoading}
          autoComplete="off"
        />

        {/* Clear button */}
        {searchTerm && (
          <button
            type="button"
            className="dataset-search__clear"
            onClick={handleClear}
            aria-label="Clear search"
            tabIndex={-1}
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Loading spinner or chevron */}
        {isLoading ? (
          <span className="dataset-search__spinner" aria-label="Loading" />
        ) : (
          <button
            type="button"
            className={`dataset-search__toggle ${isOpen ? 'dataset-search__toggle--open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
            tabIndex={-1}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown listbox */}
      {isOpen && (
        <div
          ref={listboxRef}
          id={listboxId}
          className="dataset-search__dropdown"
          role="listbox"
          aria-label="Available datasets"
        >
          {loadingManifests ? (
            <div className="dataset-search__loading">Loading datasets...</div>
          ) : filteredDatasets.length === 0 ? (
            <div className="dataset-search__empty">
              {searchTerm ? (
                <>
                  No datasets matching "<strong>{searchTerm}</strong>"
                </>
              ) : (
                'No datasets available'
              )}
            </div>
          ) : (
            <>
              {/* Result count announcement for screen readers */}
              <div className="visually-hidden" role="status" aria-live="polite">
                {filteredDatasets.length} dataset{filteredDatasets.length !== 1 ? 's' : ''} found
              </div>

              {filteredDatasets.map((dataset, index) => (
                <div
                  key={dataset.id}
                  id={getOptionId(index)}
                  ref={(el) => (optionRefs.current[index] = el)}
                  className={`dataset-search__option ${
                    dataset.id === currentDatasetId ? 'dataset-search__option--selected' : ''
                  } ${index === activeIndex ? 'dataset-search__option--active' : ''} ${
                    dataset.error ? 'dataset-search__option--error' : ''
                  }`}
                  role="option"
                  aria-selected={dataset.id === currentDatasetId}
                  onClick={() => handleOptionClick(dataset.id)}
                  onMouseEnter={() => handleOptionMouseEnter(index)}
                >
                  <div className="dataset-search__option-header">
                    <HighlightedText
                      text={dataset.name}
                      highlight={searchTerm}
                      className="dataset-search__option-name"
                    />
                    {dataset.id === currentDatasetId && (
                      <span className="dataset-search__check" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </div>

                  <HighlightedText
                    text={dataset.description}
                    highlight={searchTerm}
                    className="dataset-search__option-description"
                  />

                  <div className="dataset-search__option-meta">
                    {dataset.nodeCount !== undefined && dataset.edgeCount !== undefined && (
                      <span className="dataset-search__option-stats">
                        {dataset.nodeCount} nodes · {dataset.edgeCount} edges
                      </span>
                    )}
                    {dataset.lastUpdated && (
                      <span className="dataset-search__option-date">
                        Updated {formatDate(dataset.lastUpdated)}
                      </span>
                    )}
                  </div>

                  {dataset.error && (
                    <span className="dataset-search__option-error">Error: {dataset.error}</span>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchableDatasetSelector;
