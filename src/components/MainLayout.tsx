import { useState, useCallback, useEffect, useRef } from 'react';
import { useGraph } from '@contexts';
import type { GraphNode, GraphEdge } from '@types';
import { ForceGraphLayout, TimelineLayout } from '@layouts';
import InfoboxPanel from './InfoboxPanel';
import FilterPanel from './FilterPanel';
import LayoutSwitcher from './LayoutSwitcher';
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
    searchTerm,
    currentLayout,
    setCurrentLayout,
  } = useGraph();

  // Filter panel collapse state - collapsed by default (UX26)
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);

  const handleToggleFilterCollapse = useCallback(() => {
    setIsFilterCollapsed((prev) => !prev);
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
        <InfoboxPanel />
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
        <InfoboxPanel />
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
      case 'force-graph':
      default:
        return <ForceGraphLayout {...layoutProps} />;
    }
  };

  return (
    <main className="main-layout">
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
            <div className="main-layout__view-controls">
              <LayoutSwitcher
                currentLayout={currentLayout}
                onLayoutChange={setCurrentLayout}
                className="main-layout__layout-switcher"
              />
              {/* Interaction hint for discoverability (GI12-GI16) */}
              <div className="main-layout__interaction-hint" aria-label="Interaction hint">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>Scroll to zoom</span>
                <span className="main-layout__interaction-hint-separator">•</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 9l-3 3l3 3M9 5l3-3l3 3M15 19l3 3l-3 3M19 9l3 3l-3 3M2 12h20M12 2v20" />
                </svg>
                <span>Drag to pan</span>
              </div>
            </div>
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              stats={filterStats ?? undefined}
              dateRange={dateRange ?? undefined}
              nodeTypeCounts={nodeTypeCounts ?? undefined}
              isCollapsed={isFilterCollapsed}
              onToggleCollapse={handleToggleFilterCollapse}
            />
          </>
        ) : (
          <div className="main-layout__placeholder">
            <p>No dataset loaded</p>
            <p className="main-layout__hint">Select a dataset to begin exploring</p>
          </div>
        )}
      </section>
      <InfoboxPanel />
    </main>
  );
}

export default MainLayout;
