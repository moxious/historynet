/**
 * MainLayout component - Responsive main content area
 * 
 * Desktop (≥768px): Side-by-side graph and infobox panel
 * Mobile (<768px): Full-height graph with bottom sheet infobox
 * 
 * Features:
 * - Responsive layout switching based on viewport
 * - Mobile bottom sheet for InfoboxPanel
 * - Mobile drawer for FilterPanel
 * - Interaction hints for zoom/pan
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useGraph } from '@contexts';
import { useIsTablet } from '@hooks';
import type { GraphNode, GraphEdge } from '@types';
import { ForceGraphLayout, TimelineLayout, RadialLayout } from '@layouts';
import InfoboxPanel from './InfoboxPanel';
import MobileInfoboxPanel from './MobileInfoboxPanel';
import FilterPanel from './FilterPanel';
import Drawer from './Drawer';
import './MainLayout.css';

function MainLayout() {
  const {
    filteredData,
    loadingState,
    error,
    selection,
    selectNode,
    selectEdge,
    filters,
    setFilters,
    clearFilters,
    filterStats,
    dateRange,
    nodeTypeCounts,
    relationshipTypeCounts,
    searchTerm,
    currentLayout,
    setCurrentLayout,
  } = useGraph();

  // Responsive state
  const isTabletOrSmaller = useIsTablet();

  // Filter panel collapse state - expanded by default for discoverability
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  
  // Mobile filter drawer state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const handleToggleFilterCollapse = useCallback(() => {
    if (isTabletOrSmaller) {
      // On mobile, toggle the drawer
      setIsFilterDrawerOpen((prev) => !prev);
    } else {
      // On desktop, toggle the collapse
      setIsFilterCollapsed((prev) => !prev);
    }
  }, [isTabletOrSmaller]);

  const handleCloseFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(false);
  }, []);

  // Handlers for graph interactions - memoized to prevent graph re-layout (GI1-GI3)
  const handleNodeClick = useCallback((node: GraphNode) => {
    selectNode(node.id);
  }, [selectNode]);

  const handleEdgeClick = useCallback((edge: GraphEdge) => {
    selectEdge(edge.id);
  }, [selectEdge]);

  // DEBUG: Track callback stability
  const prevCallbacksRef = useRef<{ selectNode: typeof selectNode; selectEdge: typeof selectEdge; handleNodeClick: typeof handleNodeClick; handleEdgeClick: typeof handleEdgeClick } | null>(null);
  useEffect(() => {
    if (prevCallbacksRef.current) {
      const changes: string[] = [];
      if (prevCallbacksRef.current.selectNode !== selectNode) changes.push('selectNode');
      if (prevCallbacksRef.current.selectEdge !== selectEdge) changes.push('selectEdge');
      if (prevCallbacksRef.current.handleNodeClick !== handleNodeClick) changes.push('handleNodeClick');
      if (prevCallbacksRef.current.handleEdgeClick !== handleEdgeClick) changes.push('handleEdgeClick');
      if (changes.length > 0) {
        console.log('[MainLayout] Callback references changed:', changes);
      }
    }
    prevCallbacksRef.current = { selectNode, selectEdge, handleNodeClick, handleEdgeClick };
  }, [selectNode, selectEdge, handleNodeClick, handleEdgeClick]);

  // Fall back to force-graph when radial is selected but no node is selected (RD11)
  useEffect(() => {
    const hasNodeSelected = selection?.type === 'node';
    if (currentLayout === 'radial' && !hasNodeSelected) {
      setCurrentLayout('force-graph');
    }
  }, [currentLayout, selection, setCurrentLayout]);

  // Loading state
  if (loadingState === 'loading') {
    return (
      <main className="main-layout">
        <section className="main-layout__graph" aria-label="Graph visualization">
          <div className="main-layout__placeholder main-layout__placeholder--loading">
            <div className="main-layout__spinner" aria-hidden="true" />
            <p>Loading dataset...</p>
          </div>
        </section>
        {!isTabletOrSmaller && <InfoboxPanel />}
      </main>
    );
  }

  // Error state
  if (loadingState === 'error' || error) {
    return (
      <main className="main-layout">
        <section className="main-layout__graph" aria-label="Graph visualization">
          <div className="main-layout__placeholder main-layout__placeholder--error">
            <p>Error loading dataset</p>
            <p className="main-layout__error-message">{error?.message ?? 'Unknown error'}</p>
          </div>
        </section>
        {!isTabletOrSmaller && <InfoboxPanel />}
      </main>
    );
  }

  // Check if we have empty results after filtering
  const hasEmptyResults = filteredData && filteredData.nodes.length === 0;

  // Render the appropriate layout based on currentLayout
  const renderLayout = () => {
    if (!filteredData || hasEmptyResults) return null;

    const layoutProps = {
      data: filteredData,
      onNodeClick: handleNodeClick,
      onEdgeClick: handleEdgeClick,
      selectedNodeId: selection?.type === 'node' ? selection.id : null,
      selectedEdgeId: selection?.type === 'edge' ? selection.id : null,
      searchTerm,
    };

    switch (currentLayout) {
      case 'timeline':
        return <TimelineLayout {...layoutProps} />;
      case 'radial':
        return <RadialLayout {...layoutProps} />;
      case 'force-graph':
      default:
        return <ForceGraphLayout {...layoutProps} />;
    }
  };

  // Render FilterPanel - different behavior for mobile vs desktop
  const renderFilterPanel = () => {
    const filterPanelContent = (
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        stats={filterStats ?? undefined}
        dateRange={dateRange ?? undefined}
        nodeTypeCounts={nodeTypeCounts ?? undefined}
        relationshipTypeCounts={relationshipTypeCounts ?? undefined}
        isCollapsed={isTabletOrSmaller ? false : isFilterCollapsed}
        onToggleCollapse={handleToggleFilterCollapse}
      />
    );

    if (isTabletOrSmaller) {
      // Mobile: render inside Drawer
      return (
        <>
          {/* Filter toggle button for mobile */}
          <button
            className="main-layout__filter-toggle"
            onClick={handleToggleFilterCollapse}
            aria-label="Open filters"
            type="button"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
            </svg>
            <span>Filters</span>
          </button>

          {/* Filter drawer */}
          <Drawer
            isOpen={isFilterDrawerOpen}
            onClose={handleCloseFilterDrawer}
            title="Filters"
            width={300}
          >
            <div className="main-layout__drawer-filter">
              {filterPanelContent}
            </div>
          </Drawer>
        </>
      );
    }

    // Desktop: render inline
    return filterPanelContent;
  };

  return (
    <main className={`main-layout ${isTabletOrSmaller ? 'main-layout--mobile' : ''}`}>
      <section className="main-layout__graph" aria-label="Graph visualization">
        {filteredData ? (
          <>
            {hasEmptyResults ? (
              <div className="main-layout__placeholder main-layout__placeholder--empty-results">
                <div className="main-layout__empty-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="8" y1="8" x2="14" y2="14" />
                    <line x1="14" y1="8" x2="8" y2="14" />
                  </svg>
                </div>
                <p>No results found</p>
                <p className="main-layout__hint">
                  Try adjusting your filters or search term
                </p>
                <button
                  className="main-layout__clear-filters-btn"
                  onClick={clearFilters}
                  type="button"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              renderLayout()
            )}
            {/* Interaction hint for discoverability (GI12-GI16) */}
            <div className="main-layout__interaction-hint" aria-label="Interaction hint">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>{isTabletOrSmaller ? 'Pinch to zoom' : 'Scroll to zoom'}</span>
              <span className="main-layout__interaction-hint-separator">•</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 9l-3 3l3 3M9 5l3-3l3 3M15 19l3 3l-3 3M19 9l3 3l-3 3M2 12h20M12 2v20" />
              </svg>
              <span>Drag to pan</span>
            </div>
            {renderFilterPanel()}
          </>
        ) : (
          <div className="main-layout__placeholder">
            <p>No dataset loaded</p>
            <p className="main-layout__hint">Select a dataset to begin exploring</p>
          </div>
        )}
      </section>

      {/* InfoboxPanel - desktop version (side panel) */}
      {!isTabletOrSmaller && <InfoboxPanel />}

      {/* InfoboxPanel - mobile version (bottom sheet) */}
      {isTabletOrSmaller && <MobileInfoboxPanel />}
    </main>
  );
}

export default MainLayout;
