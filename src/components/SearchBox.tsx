/**
 * SearchBox - Search input component for highlighting nodes
 *
 * Features:
 * - Search-as-you-type with debounced input
 * - Clear button when text is present
 * - Keyboard shortcut support (Cmd/Ctrl+K to focus)
 * - Accessible with proper ARIA labels
 *
 * Note: This highlights matching nodes without hiding others.
 * Use the Filter panel to hide non-matching nodes.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from '@hooks';
import './SearchBox.css';

/** Debounce delay in milliseconds */
const DEBOUNCE_DELAY = 300;

interface SearchBoxProps {
  /** Current search value */
  value: string;
  /** Callback when search value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Optional class name */
  className?: string;
  /** Number of matching results (for display) */
  resultCount?: number;
}

function SearchBox({
  value,
  onChange,
  placeholder = 'Highlight nodes...',
  className = '',
  resultCount,
}: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Local state for immediate input updates
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, DEBOUNCE_DELAY);

  // Apply debounced value to parent
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, value, onChange]);

  // Sync local state when parent value changes (e.g., clear)
  // REACT: Only depend on parent value, not local state (R2 - stale closure fix)
  // Including localValue would cause reset on every keystroke because the effect
  // runs before debounce fires while value is still ''
  useEffect(() => {
    if (value === '') {
      setLocalValue('');
    }
     
  }, [value]);

  // Handle keyboard shortcut (Cmd/Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }

      // Escape to blur and clear
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        if (localValue) {
          setLocalValue('');
          onChange('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localValue, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  // Detect platform for shortcut hint
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutHint = isMac ? '⌘K' : 'Ctrl+K';

  return (
    <div
      className={`search-box ${isFocused ? 'search-box--focused' : ''} ${className}`}
      title="Highlights matching nodes without hiding others"
    >
      <div className="search-box__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Highlight indicator */}
      <span className="search-box__highlight-indicator" aria-hidden="true" title="Highlight mode">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <circle cx="12" cy="12" r="5" />
        </svg>
      </span>

      <input
        ref={inputRef}
        type="text"
        className="search-box__input"
        value={localValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        aria-label="Highlight nodes in graph"
        aria-describedby="search-hint"
        title="Highlights matching nodes without hiding others"
      />

      {localValue ? (
        <button
          className="search-box__clear"
          onClick={handleClear}
          aria-label="Clear search"
          title="Clear search"
          type="button"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <span className="search-box__shortcut" aria-hidden="true" title={`Press ${shortcutHint} to search`}>
          {shortcutHint}
        </span>
      )}

      {/* Result count indicator */}
      {localValue && resultCount !== undefined && (
        <span className="search-box__results" aria-live="polite">
          {resultCount === 0 ? 'No matches' : `${resultCount} match${resultCount !== 1 ? 'es' : ''}`}
        </span>
      )}

      <span id="search-hint" className="visually-hidden">
        Press {shortcutHint} to focus search. Press Escape to clear. Highlights matching nodes without hiding.
      </span>
    </div>
  );
}

export default SearchBox;
