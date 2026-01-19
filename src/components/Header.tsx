/**
 * Header component - Responsive header with mobile support
 * 
 * Desktop (≥640px): Shows all controls inline
 * Mobile (<640px): Shows logo, search icon, and hamburger menu
 * 
 * Features:
 * - Responsive layout switching based on viewport
 * - Collapsible search on mobile
 * - Hamburger menu for secondary controls
 * - Safe area inset support for iPhone notches
 * - Brand links to homepage for navigation
 */

import { useState, useCallback } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { useGraphOptional } from '@contexts';
import { useIsMobile } from '@hooks';
import SearchBox from './SearchBox';
import SearchableDatasetSelector from './SearchableDatasetSelector';
import LayoutSwitcher from './LayoutSwitcher';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import HamburgerButton from './HamburgerButton';
import './Header.css';

function Header() {
  // Use optional hook - Header works both inside and outside GraphProvider
  const graphContext = useGraphOptional();

  // Extract values with defaults for when context is unavailable (e.g., on HomePage)
  const currentDatasetId = graphContext?.currentDatasetId ?? null;
  const switchDataset = graphContext?.switchDataset ?? (() => {});
  const loadingState = graphContext?.loadingState ?? 'idle';
  const searchTerm = graphContext?.searchTerm ?? '';
  const setSearchTerm = graphContext?.setSearchTerm ?? (() => {});
  const searchMatchCount = graphContext?.searchMatchCount ?? 0;
  const currentLayout = graphContext?.currentLayout ?? 'force-graph';
  const setCurrentLayout = graphContext?.setCurrentLayout ?? (() => {});
  const selection = graphContext?.selection ?? null;

  // Get selected node ID for radial view availability
  const selectedNodeId = selection?.type === 'node' ? selection.id : null;

  // Detect if we're on the explore route (where visualization controls apply)
  const isExploreRoute = useMatch('/:datasetId/explore');

  // Mobile state
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Menu handlers
  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Search handlers for mobile
  const handleExpandSearch = useCallback(() => {
    setIsSearchExpanded(true);
  }, []);

  const handleCollapseSearch = useCallback(() => {
    setIsSearchExpanded(false);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, [setSearchTerm]);

  // Render mobile header
  if (isMobile) {
    return (
      <>
        <header className="header header--mobile">
          {/* Brand - always visible, links to homepage */}
          <Link to="/" className="header__brand header__brand--mobile header__brand-link">
            <h1 className="header__title">Scenius</h1>
          </Link>

          {/* Mobile controls */}
          <div className="header__mobile-controls">
            {/* Search - expandable, only shown on explore route */}
            {isExploreRoute && (
              isSearchExpanded ? (
                <div className="header__search-expanded">
                  <SearchBox
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Highlight nodes..."
                    resultCount={searchTerm ? searchMatchCount : undefined}
                    className="header__search-box--expanded"
                  />
                  <button
                    className="header__search-close"
                    onClick={handleCollapseSearch}
                    aria-label="Close search"
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  className="header__search-trigger"
                  onClick={handleExpandSearch}
                  aria-label="Open search"
                  type="button"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              )
            )}

            {/* Hamburger menu button */}
            {(!isExploreRoute || !isSearchExpanded) && (
              <HamburgerButton
                isOpen={isMenuOpen}
                onClick={handleToggleMenu}
              />
            )}
          </div>
        </header>

        {/* Mobile menu (slides in from right) */}
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={handleCloseMenu}
          currentDatasetId={currentDatasetId}
          onDatasetSelect={switchDataset}
          isDatasetLoading={loadingState === 'loading'}
          currentLayout={currentLayout}
          onLayoutChange={setCurrentLayout}
          selectedNodeId={selectedNodeId}
          showVisualizationControls={!!isExploreRoute}
        />
      </>
    );
  }

  // Render desktop header
  return (
    <header className="header">
      <Link to="/" className="header__brand header__brand-link">
        <h1 className="header__title">Scenius</h1>
        <span className="header__tagline">Mapping collective genius</span>
      </Link>
      <div className="header__controls">
        {/* Visualization controls - only shown on explore route */}
        {isExploreRoute && (
          <>
            <LayoutSwitcher
              currentLayout={currentLayout}
              onLayoutChange={setCurrentLayout}
              selectedNodeId={selectedNodeId}
              className="header__layout-switcher"
            />
            <div className="header__dataset-group">
              <span className="header__dataset-label">Dataset:</span>
              <SearchableDatasetSelector
                currentDatasetId={currentDatasetId}
                onSelect={switchDataset}
                isLoading={loadingState === 'loading'}
              />
            </div>
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Highlight nodes..."
              resultCount={searchTerm ? searchMatchCount : undefined}
            />
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
