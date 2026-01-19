/**
 * LayoutSwitcher component
 * Provides tabs to switch between different visualization layouts
 */

import type { LayoutType } from '@hooks/useLayout';
import './LayoutSwitcher.css';

interface LayoutSwitcherProps {
  /** Currently active layout */
  currentLayout: LayoutType;
  /** Callback when layout is changed */
  onLayoutChange: (layout: LayoutType) => void;
  /** Currently selected node ID - radial view requires a node selection */
  selectedNodeId?: string | null;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Layout option with metadata
 */
interface LayoutOption {
  id: LayoutType;
  label: string;
  icon: React.ReactNode;
  /** If true, this option requires a node to be selected */
  requiresSelection?: boolean;
}

const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: 'force-graph',
    label: 'Graph',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="8.5" y1="7.5" x2="15.5" y2="16.5" />
        <line x1="15.5" y1="7.5" x2="8.5" y2="16.5" />
      </svg>
    ),
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="6" y1="3" x2="6" y2="21" />
        <circle cx="6" cy="6" r="2" fill="currentColor" />
        <circle cx="6" cy="12" r="2" fill="currentColor" />
        <circle cx="6" cy="18" r="2" fill="currentColor" />
        <line x1="8" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="8" y1="18" x2="18" y2="18" />
      </svg>
    ),
  },
  {
    id: 'radial',
    label: 'Radial',
    requiresSelection: true,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
        <circle cx="12" cy="4" r="2" fill="currentColor" />
        <circle cx="19" cy="9" r="2" fill="currentColor" />
        <circle cx="19" cy="15" r="2" fill="currentColor" />
        <circle cx="12" cy="20" r="2" fill="currentColor" />
        <circle cx="5" cy="15" r="2" fill="currentColor" />
        <circle cx="5" cy="9" r="2" fill="currentColor" />
      </svg>
    ),
  },
];

/**
 * LayoutSwitcher component renders tabs for switching visualization layouts
 */
export function LayoutSwitcher({
  currentLayout,
  onLayoutChange,
  selectedNodeId,
  className = '',
}: LayoutSwitcherProps) {
  const hasNodeSelected = Boolean(selectedNodeId);

  return (
    <div className={`layout-switcher ${className}`} role="tablist" aria-label="Visualization layout">
      {LAYOUT_OPTIONS.map((option) => {
        const isDisabled = option.requiresSelection && !hasNodeSelected;
        const isActive = currentLayout === option.id;

        return (
          <button
            key={option.id}
            className={`layout-switcher__tab ${isActive ? 'layout-switcher__tab--active' : ''} ${isDisabled ? 'layout-switcher__tab--disabled' : ''}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${option.id}-panel`}
            aria-disabled={isDisabled}
            onClick={() => !isDisabled && onLayoutChange(option.id)}
            disabled={isDisabled}
            title={isDisabled ? 'Select a node to use radial view' : option.label}
            type="button"
          >
            <span className="layout-switcher__tab-icon" aria-hidden="true">
              {option.icon}
            </span>
            <span className="layout-switcher__tab-label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default LayoutSwitcher;
