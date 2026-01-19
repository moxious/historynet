/**
 * Generic checkbox filter group component
 * Reusable for any multi-select filter (node types, etc.)
 * Supports inline (default) and dropdown variants
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import './CheckboxFilterGroup.css';

/**
 * A single option in the checkbox group
 */
export interface CheckboxOption<T extends string> {
  /** The value to use when this option is selected */
  value: T;
  /** Display label for this option */
  label: string;
  /** Optional count to show in parentheses */
  count?: number;
}

interface CheckboxFilterGroupProps<T extends string> {
  /** Section label */
  label: string;
  /** Available options */
  options: CheckboxOption<T>[];
  /** Currently selected values (null = all selected) */
  selected: T[] | null;
  /** Callback when selection changes */
  onChange: (selected: T[] | null) => void;
  /** Whether to show "All" toggle (default: true) */
  showSelectAll?: boolean;
  /** Display variant: 'inline' (default) shows all options, 'dropdown' shows collapsible scrollable list */
  variant?: 'inline' | 'dropdown';
  /** Max height for dropdown content in pixels (default: 200) */
  maxHeight?: number;
}

/**
 * CheckboxFilterGroup - A generic multi-select checkbox filter
 * 
 * When `selected` is `null`, all options are considered selected.
 * When the user explicitly selects all options, it converts back to `null`.
 * 
 * Variants:
 * - 'inline' (default): Shows all options in a flex-wrapped layout
 * - 'dropdown': Shows a collapsible button that opens a scrollable list
 */
function CheckboxFilterGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
  showSelectAll = true,
  variant = 'inline',
  maxHeight = 200,
}: CheckboxFilterGroupProps<T>) {
  // Local state for dropdown open/closed
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Derived state: is everything selected?
  const allSelected = selected === null;
  const allValues = options.map((o) => o.value);

  // Count of selected items for dropdown summary
  const selectedCount = allSelected ? options.length : (selected?.length ?? 0);

  // REACT: Close dropdown when clicking outside (R1 - cleanup)
  useEffect(() => {
    if (variant !== 'dropdown' || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant, isOpen]);

  // Handle individual checkbox toggle
  // REACT: memoized callback (R12)
  const handleToggle = useCallback(
    (value: T) => {
      if (allSelected) {
        // Currently all selected, deselect this one
        // Return all values except the clicked one
        onChange(allValues.filter((v) => v !== value));
      } else if (selected!.includes(value)) {
        // Deselect this option
        const newSelection = selected!.filter((v) => v !== value);
        // If nothing selected, keep at least one? No - allow empty selection
        // Actually, if empty, we should show nothing, which is valid
        onChange(newSelection.length === 0 ? [] : newSelection);
      } else {
        // Select this option
        const newSelection = [...selected!, value];
        // If we selected all, convert to null (all selected state)
        if (newSelection.length === allValues.length) {
          onChange(null);
        } else {
          onChange(newSelection);
        }
      }
    },
    [allSelected, allValues, selected, onChange]
  );

  // Handle "All" toggle
  // REACT: memoized callback (R12)
  const handleSelectAll = useCallback(() => {
    onChange(null); // null = all selected
  }, [onChange]);

  // Toggle dropdown open/closed
  const handleToggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Check if a specific value is checked
  const isChecked = (value: T): boolean => {
    return allSelected || (selected?.includes(value) ?? false);
  };

  // Generate summary text for dropdown button
  const getSummaryText = (): string => {
    if (allSelected) return 'All';
    if (selectedCount === 0) return 'None';
    if (selectedCount === 1 && selected) {
      const opt = options.find((o) => o.value === selected[0]);
      return opt?.label ?? '1 selected';
    }
    return `${selectedCount} selected`;
  };

  // Render options list (shared between variants)
  const renderOptions = () => (
    <>
      {showSelectAll && (
        <label className="checkbox-filter-group__option checkbox-filter-group__option--all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
            aria-label="Select all"
          />
          <span className="checkbox-filter-group__option-text">All</span>
        </label>
      )}
      
      {options.map((option) => (
        <label key={option.value} className="checkbox-filter-group__option">
          <input
            type="checkbox"
            checked={isChecked(option.value)}
            onChange={() => handleToggle(option.value)}
            aria-label={option.label}
          />
          <span className="checkbox-filter-group__option-text">
            {option.label}
            {option.count !== undefined && (
              <span className="checkbox-filter-group__count">({option.count})</span>
            )}
          </span>
        </label>
      ))}
    </>
  );

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className="checkbox-filter-group checkbox-filter-group--dropdown" ref={dropdownRef}>
        <button
          type="button"
          className={`checkbox-filter-group__dropdown-trigger ${isOpen ? 'checkbox-filter-group__dropdown-trigger--open' : ''}`}
          onClick={handleToggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="checkbox-filter-group__dropdown-label">{label}</span>
          <span className="checkbox-filter-group__dropdown-summary">{getSummaryText()}</span>
          <svg
            className="checkbox-filter-group__dropdown-chevron"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        
        {isOpen && (
          <div
            className="checkbox-filter-group__dropdown-content"
            style={{ maxHeight: `${maxHeight}px` }}
            role="listbox"
            aria-label={label}
          >
            {renderOptions()}
          </div>
        )}
      </div>
    );
  }

  // Inline variant (default)
  return (
    <div className="checkbox-filter-group">
      <label className="checkbox-filter-group__label">{label}</label>
      
      <div className="checkbox-filter-group__options">
        {renderOptions()}
      </div>
    </div>
  );
}

export default CheckboxFilterGroup;
