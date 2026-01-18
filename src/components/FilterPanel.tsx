/**
 * FilterPanel component for filtering graph nodes and edges
 */

import { useState, useCallback, useEffect, type ChangeEvent } from 'react';
import type { FilterState, FilterStats } from '@types';
import { hasActiveFilters } from '@types';
import { useDebounce } from '@hooks';
import './FilterPanel.css';

/** Debounce delay in milliseconds */
const DEBOUNCE_DELAY = 300;

interface FilterPanelProps {
  /** Current filter state */
  filters: FilterState;
  /** Callback to update filters */
  onFiltersChange: (filters: Partial<FilterState>) => void;
  /** Callback to clear all filters */
  onClearFilters: () => void;
  /** Filter statistics (nodes/edges before and after filtering) */
  stats?: FilterStats;
  /** Date range available in the data */
  dateRange?: { minYear: number | null; maxYear: number | null };
  /** Whether the panel is collapsed */
  isCollapsed?: boolean;
  /** Callback when collapse state changes */
  onToggleCollapse?: () => void;
}

/**
 * FilterPanel - UI for filtering graph by date range and text
 */
function FilterPanel({
  filters,
  onFiltersChange,
  onClearFilters,
  stats,
  dateRange,
  isCollapsed = false,
  onToggleCollapse,
}: FilterPanelProps) {
  // Local state for input values (to allow typing before committing)
  const [localDateStart, setLocalDateStart] = useState<string>(
    filters.dateStart !== null ? String(filters.dateStart) : ''
  );
  const [localDateEnd, setLocalDateEnd] = useState<string>(
    filters.dateEnd !== null ? String(filters.dateEnd) : ''
  );

  // Local state for debounced text filters
  const [localNameFilter, setLocalNameFilter] = useState<string>(filters.nameFilter);
  const [localRelationshipFilter, setLocalRelationshipFilter] = useState<string>(
    filters.relationshipFilter
  );

  // Debounce the text filter values
  const debouncedNameFilter = useDebounce(localNameFilter, DEBOUNCE_DELAY);
  const debouncedRelationshipFilter = useDebounce(localRelationshipFilter, DEBOUNCE_DELAY);

  // Apply debounced name filter to parent
  useEffect(() => {
    if (debouncedNameFilter !== filters.nameFilter) {
      onFiltersChange({ nameFilter: debouncedNameFilter });
    }
  }, [debouncedNameFilter, filters.nameFilter, onFiltersChange]);

  // Apply debounced relationship filter to parent
  useEffect(() => {
    if (debouncedRelationshipFilter !== filters.relationshipFilter) {
      onFiltersChange({ relationshipFilter: debouncedRelationshipFilter });
    }
  }, [debouncedRelationshipFilter, filters.relationshipFilter, onFiltersChange]);

  // Sync local state when filters change externally (e.g., clear all)
  // REACT: Only depend on parent filter values, not local state (R2 - stale closure fix)
  // Including localNameFilter/localRelationshipFilter would cause reset on every keystroke
  // because the effect runs before debounce fires while filters.nameFilter is still ''
  useEffect(() => {
    if (filters.nameFilter === '') {
      setLocalNameFilter('');
    }
    if (filters.relationshipFilter === '') {
      setLocalRelationshipFilter('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.nameFilter, filters.relationshipFilter]);

  // REACT: Sync local date state when filters change externally (R14)
  // This replaces the previous inline state sync that violated React rules
  useEffect(() => {
    const isStartFocused = document.activeElement?.id === 'filter-date-start';
    const isEndFocused = document.activeElement?.id === 'filter-date-end';

    if (!isStartFocused) {
      setLocalDateStart(filters.dateStart !== null ? String(filters.dateStart) : '');
    }
    if (!isEndFocused) {
      setLocalDateEnd(filters.dateEnd !== null ? String(filters.dateEnd) : '');
    }
  }, [filters.dateStart, filters.dateEnd]);

  // Check if there are active filters
  const hasFilters = hasActiveFilters(filters);

  // Handle date start change
  const handleDateStartChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLocalDateStart(e.target.value);
  }, []);

  const handleDateStartBlur = useCallback(() => {
    const value = localDateStart.trim();
    if (value === '') {
      onFiltersChange({ dateStart: null });
    } else {
      const year = parseInt(value, 10);
      if (!isNaN(year)) {
        onFiltersChange({ dateStart: year });
      }
    }
  }, [localDateStart, onFiltersChange]);

  // Handle date end change
  const handleDateEndChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLocalDateEnd(e.target.value);
  }, []);

  const handleDateEndBlur = useCallback(() => {
    const value = localDateEnd.trim();
    if (value === '') {
      onFiltersChange({ dateEnd: null });
    } else {
      const year = parseInt(value, 10);
      if (!isNaN(year)) {
        onFiltersChange({ dateEnd: year });
      }
    }
  }, [localDateEnd, onFiltersChange]);

  // Handle name filter change (debounced via local state)
  const handleNameFilterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLocalNameFilter(e.target.value);
  }, []);

  // Handle relationship filter change (debounced via local state)
  const handleRelationshipFilterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLocalRelationshipFilter(e.target.value);
  }, []);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setLocalDateStart('');
    setLocalDateEnd('');
    setLocalNameFilter('');
    setLocalRelationshipFilter('');
    onClearFilters();
  }, [onClearFilters]);

  // Handle Enter key on date inputs
  const handleDateKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, onBlur: () => void) => {
      if (e.key === 'Enter') {
        onBlur();
        e.currentTarget.blur();
      }
    },
    []
  );

  return (
    <div className={`filter-panel ${isCollapsed ? 'filter-panel--collapsed' : ''}`}>
      {/* Toggle button */}
      <button
        className="filter-panel__toggle"
        onClick={onToggleCollapse}
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? 'Expand filters' : 'Collapse filters'}
        title={isCollapsed ? 'Expand filters' : 'Collapse filters'}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="filter-panel__toggle-icon"
        >
          <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
        </svg>
        {!isCollapsed && <span>Filters</span>}
        {hasFilters && <span className="filter-panel__active-badge" aria-label="Filters active" />}
        {/* Chevron indicator (UX27) */}
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`filter-panel__chevron ${isCollapsed ? 'filter-panel__chevron--collapsed' : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Filter content */}
      {!isCollapsed && (
        <div className="filter-panel__content">
          {/* Date Range Section */}
          <div className="filter-panel__section">
            <label className="filter-panel__section-label">Date Range</label>
            {dateRange && (dateRange.minYear !== null || dateRange.maxYear !== null) && (
              <div className="filter-panel__date-hint">
                Data spans {dateRange.minYear ?? '?'} - {dateRange.maxYear ?? '?'}
              </div>
            )}
            <div className="filter-panel__date-inputs">
              <div className="filter-panel__input-group">
                <label htmlFor="filter-date-start" className="filter-panel__input-label">
                  No earlier than
                </label>
                <input
                  id="filter-date-start"
                  type="number"
                  className="filter-panel__input filter-panel__input--year"
                  placeholder="Year"
                  value={localDateStart}
                  onChange={handleDateStartChange}
                  onBlur={handleDateStartBlur}
                  onKeyDown={(e) => handleDateKeyDown(e, handleDateStartBlur)}
                  aria-describedby="date-start-hint"
                />
              </div>
              <div className="filter-panel__input-group">
                <label htmlFor="filter-date-end" className="filter-panel__input-label">
                  No later than
                </label>
                <input
                  id="filter-date-end"
                  type="number"
                  className="filter-panel__input filter-panel__input--year"
                  placeholder="Year"
                  value={localDateEnd}
                  onChange={handleDateEndChange}
                  onBlur={handleDateEndBlur}
                  onKeyDown={(e) => handleDateKeyDown(e, handleDateEndBlur)}
                  aria-describedby="date-end-hint"
                />
              </div>
            </div>
          </div>

          {/* Name Filter Section */}
          <div className="filter-panel__section">
            <div className="filter-panel__input-group">
              <label htmlFor="filter-name" className="filter-panel__section-label">
                <span className="filter-panel__label-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                  </svg>
                </span>
                Name
              </label>
              <input
                id="filter-name"
                type="text"
                className="filter-panel__input"
                placeholder="Filter by name..."
                value={localNameFilter}
                onChange={handleNameFilterChange}
                aria-describedby="name-filter-hint"
                title="Hides nodes that don't match"
              />
              <span id="name-filter-hint" className="filter-panel__hint">
                Hides non-matching nodes
              </span>
            </div>
          </div>

          {/* Relationship Filter Section */}
          <div className="filter-panel__section">
            <div className="filter-panel__input-group">
              <label htmlFor="filter-relationship" className="filter-panel__section-label">
                <span className="filter-panel__label-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                  </svg>
                </span>
                Relationship
              </label>
              <input
                id="filter-relationship"
                type="text"
                className="filter-panel__input"
                placeholder="Filter by relationship..."
                value={localRelationshipFilter}
                onChange={handleRelationshipFilterChange}
                aria-describedby="relationship-filter-hint"
                title="Hides edges that don't match"
              />
              <span id="relationship-filter-hint" className="filter-panel__hint">
                Hides non-matching edges
              </span>
            </div>
          </div>

          {/* Filter Stats */}
          {stats && (
            <div className="filter-panel__stats">
              <div className="filter-panel__stat">
                <span className="filter-panel__stat-label">Nodes:</span>
                <span className="filter-panel__stat-value">
                  {stats.filteredNodes}
                  {stats.filteredNodes !== stats.totalNodes && (
                    <span className="filter-panel__stat-total"> / {stats.totalNodes}</span>
                  )}
                </span>
              </div>
              <div className="filter-panel__stat">
                <span className="filter-panel__stat-label">Edges:</span>
                <span className="filter-panel__stat-value">
                  {stats.filteredEdges}
                  {stats.filteredEdges !== stats.totalEdges && (
                    <span className="filter-panel__stat-total"> / {stats.totalEdges}</span>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Clear Filters Button */}
          {hasFilters && (
            <button className="filter-panel__clear-btn" onClick={handleClearFilters}>
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
