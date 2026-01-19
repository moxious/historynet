/**
 * Radial (ego-network) layout using D3.js
 * Displays a selected node at center with direct connections in a ring around it
 */

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { GraphNode, NodeType, GraphEdge } from '@types';
import type { LayoutComponentProps } from './types';
import { getNodeColor, getEdgeColor, getNodeTypeEmoji } from '@utils';
import './RadialLayout.css';

/**
 * Node positioned in the radial layout
 */
interface RadialNode {
  id: string;
  type: NodeType;
  title: string;
  originalNode: GraphNode;
  x: number;
  y: number;
  isCenter: boolean;
}

/**
 * Edge in the radial layout
 */
interface RadialEdge {
  id: string;
  relationship: string;
  source: RadialNode;
  target: RadialNode;
  originalEdge: GraphEdge;
}

// Layout constants
const NODE_RADIUS = 20;
const CENTER_NODE_RADIUS = 25;
const MIN_RADIUS = 150;
const MAX_RADIUS = 350;
const ZOOM_MIN = 0.3;
const ZOOM_MAX = 4;

/**
 * Calculate optimal radius based on number of connected nodes
 */
function calculateRadius(nodeCount: number): number {
  if (nodeCount <= 4) return MIN_RADIUS;
  if (nodeCount >= 20) return MAX_RADIUS;
  // Linear interpolation between min and max
  const ratio = (nodeCount - 4) / (20 - 4);
  return MIN_RADIUS + ratio * (MAX_RADIUS - MIN_RADIUS);
}

/**
 * RadialLayout component
 * Renders an ego-network visualization centered on the selected node
 */
export function RadialLayout({
  data,
  onNodeClick,
  onEdgeClick,
  selectedNodeId,
  selectedEdgeId,
  searchTerm,
  className = '',
}: LayoutComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(container);
    // REACT: cleanup subscription (R1)
    return () => resizeObserver.disconnect();
  }, []);

  // Process data to extract center node and connected nodes
  const { centerNode, connectedNodes, edges, hasValidSelection } = useMemo(() => {
    // If no node is selected, return empty state
    if (!selectedNodeId) {
      return { centerNode: null, connectedNodes: [], edges: [], hasValidSelection: false };
    }

    // Find the center node
    const center = data.nodes.find((n) => n.id === selectedNodeId);
    if (!center) {
      return { centerNode: null, connectedNodes: [], edges: [], hasValidSelection: false };
    }

    // Find all edges connected to the center node
    const connectedEdges = data.edges.filter(
      (e) => e.source === selectedNodeId || e.target === selectedNodeId
    );

    // Extract connected node IDs
    const connectedNodeIds = new Set<string>();
    for (const edge of connectedEdges) {
      if (edge.source === selectedNodeId) {
        connectedNodeIds.add(edge.target);
      } else {
        connectedNodeIds.add(edge.source);
      }
    }

    // Get connected node objects (only those in the filtered data)
    const nodeMap = new Map(data.nodes.map((n) => [n.id, n]));
    const connected = Array.from(connectedNodeIds)
      .map((id) => nodeMap.get(id))
      .filter((n): n is GraphNode => n !== undefined);

    return {
      centerNode: center,
      connectedNodes: connected,
      edges: connectedEdges,
      hasValidSelection: true,
    };
  }, [data, selectedNodeId]);

  // Initialize and render the radial graph
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Clear previous content
    svg.selectAll('*').remove();

    // If no valid selection, don't render
    if (!hasValidSelection || !centerNode) return;

    // Create container group for zoom/pan
    const g = svg.append('g').attr('class', 'radial-container');

    // Create groups for edges and nodes (edges first so nodes appear on top)
    const edgeGroup = g.append('g').attr('class', 'radial-edges');
    const nodeGroup = g.append('g').attr('class', 'radial-nodes');
    const labelGroup = g.append('g').attr('class', 'radial-labels');

    // Center position
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate radius based on number of connected nodes
    const radius = calculateRadius(connectedNodes.length);

    // Position nodes
    const radialNodes: RadialNode[] = [];

    // Center node
    const centerRadialNode: RadialNode = {
      id: centerNode.id,
      type: centerNode.type,
      title: centerNode.title,
      originalNode: centerNode,
      x: centerX,
      y: centerY,
      isCenter: true,
    };
    radialNodes.push(centerRadialNode);

    // Position connected nodes in a circle
    const angleStep = (2 * Math.PI) / Math.max(connectedNodes.length, 1);
    const startAngle = -Math.PI / 2; // Start at top

    connectedNodes.forEach((node, index) => {
      const angle = startAngle + index * angleStep;
      radialNodes.push({
        id: node.id,
        type: node.type,
        title: node.title,
        originalNode: node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        isCenter: false,
      });
    });

    // Create node map for edge lookups
    const radialNodeMap = new Map(radialNodes.map((n) => [n.id, n]));

    // Create radial edges
    const radialEdges: RadialEdge[] = edges
      .map((edge) => {
        const source = radialNodeMap.get(edge.source);
        const target = radialNodeMap.get(edge.target);
        if (!source || !target) return null;
        return {
          id: edge.id,
          relationship: edge.relationship,
          source,
          target,
          originalEdge: edge,
        };
      })
      .filter((e): e is RadialEdge => e !== null);

    // Get theme-aware colors from CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    const graphTextColor = computedStyle.getPropertyValue('--color-graph-text').trim() || '#374151';

    // Draw curved edges
    edgeGroup
      .selectAll<SVGPathElement, RadialEdge>('path')
      .data(radialEdges)
      .enter()
      .append('path')
      .attr('class', 'radial-edge')
      .attr('d', (d) => {
        // Create a curved path from source to target through center
        return `M ${d.source.x} ${d.source.y} Q ${centerX} ${centerY} ${d.target.x} ${d.target.y}`;
      })
      .attr('fill', 'none')
      .attr('stroke', (d) => getEdgeColor(d.relationship))
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.5)
      .attr('data-id', (d) => d.id)
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onEdgeClick) {
          onEdgeClick(d.originalEdge);
        }
      })
      .on('mouseenter', function () {
        d3.select(this).attr('stroke-opacity', 0.9).attr('stroke-width', 3);
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke-opacity', 0.5).attr('stroke-width', 2);
      });

    // Draw nodes
    const nodeElements = nodeGroup
      .selectAll<SVGGElement, RadialNode>('g')
      .data(radialNodes)
      .enter()
      .append('g')
      .attr('class', (d) => `radial-node ${d.isCenter ? 'radial-node--center' : ''}`)
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
      .attr('data-id', (d) => d.id)
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onNodeClick) {
          onNodeClick(d.originalNode);
        }
      });

    // Add circular background for each node
    nodeElements
      .append('circle')
      .attr('r', (d) => (d.isCenter ? CENTER_NODE_RADIUS : NODE_RADIUS))
      .attr('fill', (d) => getNodeColor(d.type))
      .attr('fill-opacity', 0.2)
      .attr('stroke', (d) => getNodeColor(d.type))
      .attr('stroke-width', (d) => (d.isCenter ? 3 : 2))
      .attr('class', 'node-background');

    // Add emoji text for each node
    nodeElements
      .append('text')
      .attr('class', 'node-emoji')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', (d) => (d.isCenter ? '20px' : '16px'))
      .attr('pointer-events', 'none')
      .text((d) => getNodeTypeEmoji(d.type));

    // Add labels
    labelGroup
      .selectAll<SVGTextElement, RadialNode>('text')
      .data(radialNodes)
      .enter()
      .append('text')
      .attr('class', 'radial-label')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y + (d.isCenter ? CENTER_NODE_RADIUS : NODE_RADIUS) + 16)
      .attr('text-anchor', 'middle')
      .text((d) => d.title)
      .attr('font-size', (d) => (d.isCenter ? '13px' : '11px'))
      .attr('font-weight', (d) => (d.isCenter ? '600' : '500'))
      .attr('fill', graphTextColor)
      .attr('pointer-events', 'none');

    // Setup zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([ZOOM_MIN, ZOOM_MAX])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    // Clear selection when clicking on background
    svg.on('click', () => {
      // Background click - could clear selection if desired
    });

    // No cleanup needed
    return () => {};
  }, [data, dimensions, centerNode, connectedNodes, edges, hasValidSelection, onNodeClick, onEdgeClick]);

  // Update selection highlighting
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Update node selection state
    svg.selectAll('.radial-node').each(function () {
      const el = d3.select(this);
      const nodeId = el.attr('data-id');
      const isSelected = nodeId === selectedNodeId;
      const isCenter = el.classed('radial-node--center');

      el.select('.node-background')
        .attr('stroke-width', isSelected ? 4 : isCenter ? 3 : 2)
        .attr('fill-opacity', isSelected ? 0.4 : 0.2);

      el.classed('selected', isSelected);
    });

    // Update edge selection state
    svg.selectAll('.radial-edge').each(function () {
      const el = d3.select(this);
      const edgeId = el.attr('data-id');
      const isSelected = edgeId === selectedEdgeId;

      el.attr('stroke-opacity', isSelected ? 0.9 : 0.5).attr('stroke-width', isSelected ? 3 : 2);

      el.classed('selected', isSelected);
    });
  }, [selectedNodeId, selectedEdgeId]);

  // Update search highlighting
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const term = searchTerm?.toLowerCase() ?? '';

    // Highlight nodes matching search
    svg.selectAll<SVGGElement, RadialNode>('.radial-node').each(function (d) {
      const el = d3.select(this);
      const isMatch = term && d.title.toLowerCase().includes(term);

      el.classed('search-match', !!isMatch);
      el.select('.node-background').attr('filter', isMatch ? 'url(#radial-glow)' : null);
    });

    // Dim non-matching elements when searching
    svg.selectAll<SVGGElement, RadialNode>('.radial-node').attr('opacity', (d) => {
      if (!term) return 1;
      return d.title.toLowerCase().includes(term) ? 1 : 0.3;
    });

    svg.selectAll<SVGTextElement, RadialNode>('.radial-label').attr('opacity', (d) => {
      if (!term) return 1;
      return d.title.toLowerCase().includes(term) ? 1 : 0.3;
    });
  }, [searchTerm]);

  // Zoom control handlers
  const handleZoomIn = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(zoomRef.current.scaleBy, 1.5);
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(zoomRef.current.scaleBy, 0.67);
  }, []);

  const handleResetView = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(zoomRef.current.transform, d3.zoomIdentity);
  }, []);

  // Render empty state if no valid selection
  if (!hasValidSelection || !centerNode) {
    return (
      <div ref={containerRef} className={`radial-layout ${className}`}>
        <div className="radial-layout__empty-state">
          <div className="radial-layout__empty-icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="32" cy="32" r="8" />
              <circle cx="32" cy="32" r="20" strokeDasharray="4 4" />
              <circle cx="32" cy="32" r="28" strokeDasharray="2 4" opacity="0.5" />
              <circle cx="32" cy="8" r="4" fill="currentColor" opacity="0.3" />
              <circle cx="56" cy="32" r="4" fill="currentColor" opacity="0.3" />
              <circle cx="32" cy="56" r="4" fill="currentColor" opacity="0.3" />
              <circle cx="8" cy="32" r="4" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <p className="radial-layout__empty-title">Select a node to explore its connections</p>
          <p className="radial-layout__empty-hint">
            Click on any node in the Graph or Timeline view, then switch to Radial view
          </p>
        </div>
      </div>
    );
  }

  // Render empty connections state
  if (connectedNodes.length === 0) {
    return (
      <div ref={containerRef} className={`radial-layout ${className}`}>
        <div className="radial-layout__empty-state">
          <div className="radial-layout__empty-icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="32" cy="32" r="12" fill="currentColor" fillOpacity="0.1" />
              <circle cx="32" cy="32" r="20" strokeDasharray="4 4" opacity="0.3" />
            </svg>
          </div>
          <p className="radial-layout__empty-title">{centerNode.title}</p>
          <p className="radial-layout__empty-hint">
            This node has no visible connections
            {data.nodes.length !== data.edges.length ? ' with current filters' : ''}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`radial-layout ${className}`}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}>
        <defs>
          {/* Glow filter for search highlighting */}
          <filter id="radial-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Zoom controls */}
      <div className="radial-layout__controls">
        <button
          className="radial-layout__control-btn"
          onClick={handleZoomIn}
          aria-label="Zoom in"
          title="Zoom in"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <button
          className="radial-layout__control-btn"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          title="Zoom out"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <button
          className="radial-layout__control-btn"
          onClick={handleResetView}
          aria-label="Reset view"
          title="Reset view"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>

      {/* Connection count indicator */}
      <div className="radial-layout__info">
        <span className="radial-layout__center-title">{centerNode.title}</span>
        <span className="radial-layout__connection-count">
          {connectedNodes.length} connection{connectedNodes.length !== 1 ? 's' : ''}
        </span>
      </div>

    </div>
  );
}

export default RadialLayout;
