/**
 * MobileMenu - Slide-in drawer menu for mobile navigation
 * 
 * Contains controls that are hidden in the mobile header:
 * - Dataset selector
 * - Layout switcher
 * - Theme toggle
 * 
 * Features:
 * - Slides in from the right
 * - Semi-transparent backdrop that closes menu on tap
 * - Focus trap when open
 * - Escape key to close
 * - Safe area inset support for iPhone notches
 */

import { useEffect, useRef, useCallback } from 'react';
import type { LayoutType } from '@hooks/useLayout';
import DatasetSelector from './DatasetSelector';
import LayoutSwitcher from './LayoutSwitcher';
import ThemeToggle from './ThemeToggle';
import './MobileMenu.css';

interface MobileMenuProps {
  /** Whether the menu is open */
  isOpen: boolean;
  /** Callback to close the menu */
  onClose: () => void;
  /** Current dataset ID */
  currentDatasetId: string | null;
  /** Callback when dataset is selected */
  onDatasetSelect: (datasetId: string) => void;
  /** Whether dataset is loading */
  isDatasetLoading: boolean;
  /** Current layout type */
  currentLayout: LayoutType;
  /** Callback when layout changes */
  onLayoutChange: (layout: LayoutType) => void;
  /** Currently selected node ID - radial view requires a node selection */
  selectedNodeId?: string | null;
}

function MobileMenu({
  isOpen,
  onClose,
  currentDatasetId,
  onDatasetSelect,
  isDatasetLoading,
  currentLayout,
  onLayoutChange,
  selectedNodeId,
}: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // REACT: cleanup event listener (R1)
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Focus the close button when menu opens (accessibility)
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      // Small delay to allow animation to start
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Handle dataset selection - close menu after selection
  const handleDatasetSelect = useCallback((datasetId: string) => {
    onDatasetSelect(datasetId);
    onClose();
  }, [onDatasetSelect, onClose]);

  // Handle layout change - close menu after selection
  const handleLayoutChange = useCallback((layout: LayoutType) => {
    onLayoutChange(layout);
    onClose();
  }, [onLayoutChange, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="mobile-menu-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div 
        ref={menuRef}
        className="mobile-menu"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-menu__header">
          <h2 className="mobile-menu__title">Menu</h2>
          <button
            ref={closeButtonRef}
            className="mobile-menu__close"
            onClick={onClose}
            aria-label="Close menu"
            type="button"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mobile-menu__content">
          {/* Dataset Section */}
          <div className="mobile-menu__section">
            <label className="mobile-menu__section-label">Dataset</label>
            <DatasetSelector
              currentDatasetId={currentDatasetId}
              onSelect={handleDatasetSelect}
              isLoading={isDatasetLoading}
              className="mobile-menu__dataset-selector"
            />
          </div>

          {/* Layout Section */}
          <div className="mobile-menu__section">
            <label className="mobile-menu__section-label">View</label>
            <LayoutSwitcher
              currentLayout={currentLayout}
              onLayoutChange={handleLayoutChange}
              selectedNodeId={selectedNodeId}
              className="mobile-menu__layout-switcher"
            />
          </div>

          {/* Theme Section */}
          <div className="mobile-menu__section">
            <label className="mobile-menu__section-label">Theme</label>
            <div className="mobile-menu__theme-row">
              <span className="mobile-menu__theme-label">Toggle dark mode</span>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        <div className="mobile-menu__footer">
          <span className="mobile-menu__brand">Scenius</span>
          <span className="mobile-menu__tagline">Mapping collective genius</span>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
