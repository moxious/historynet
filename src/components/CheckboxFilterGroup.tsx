/**
 * Generic checkbox filter group component
 * Reusable for any multi-select filter (node types, etc.)
 */

import { useCallback } from 'react';
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
}

/**
 * CheckboxFilterGroup - A generic multi-select checkbox filter
 * 
 * When `selected` is `null`, all options are considered selected.
 * When the user explicitly selects all options, it converts back to `null`.
 */
function CheckboxFilterGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
  showSelectAll = true,
}: CheckboxFilterGroupProps<T>) {
  // Derived state: is everything selected?
  const allSelected = selected === null;
  const allValues = options.map((o) => o.value);

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

  // Check if a specific value is checked
  const isChecked = (value: T): boolean => {
    return allSelected || (selected?.includes(value) ?? false);
  };

  return (
    <div className="checkbox-filter-group">
      <label className="checkbox-filter-group__label">{label}</label>
      
      <div className="checkbox-filter-group__options">
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
      </div>
    </div>
  );
}

export default CheckboxFilterGroup;
