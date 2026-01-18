import { useState, useCallback } from 'react';
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
    searchTerm,
    currentLayout,
    setCurrentLayout,
  } = useGraph();

  // Filter panel collapse state
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  const handleToggleFilterCollapse = useCallback(() => {
    setIsFilterCollapsed((prev) => !prev);
  }, []);

  // Handlers for graph interactions
  const handleNodeClick = (node: GraphNode) => {
    selectNode(node.id);
  };

  const handleEdgeClick = (edge: GraphEdge) => {
    selectEdge(edge.id);
  };

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
            <LayoutSwitcher
              currentLayout={currentLayout}
              onLayoutChange={setCurrentLayout}
              className="main-layout__layout-switcher"
            />
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              stats={filterStats ?? undefined}
              dateRange={dateRange ?? undefined}
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
