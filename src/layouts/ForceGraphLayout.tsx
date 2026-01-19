/**
 * Force-directed graph layout using D3.js
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import type { GraphNode, NodeType } from '@types';
import type { LayoutComponentProps } from './types';
import { getNodeColor, getEdgeColor } from '@utils';
import './ForceGraphLayout.css';

/**
 * D3 simulation node type - wraps GraphNode with simulation properties
 */
interface SimulationNode extends d3.SimulationNodeDatum {
  // Required GraphNode properties
  id: string;
  type: NodeType;
  title: string;
  shortDescription?: string;
  // Simulation-managed positions
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
  // Original node reference for accessing all properties
  originalNode: GraphNode;
}

/**
 * D3 simulation link type
 */
interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  id: string;
  relationship: string;
  label?: string;
  evidence?: string;
}

/**
 * Get node shape path based on type
 * Returns a path string for the shape centered at (0, 0)
 */
function getNodeShape(type: NodeType, size: number): string {
  const r = size / 2;
  switch (type) {
    case 'person':
      // Circle - approximated with path for consistency
      return `M 0 ${-r} A ${r} ${r} 0 1 1 0 ${r} A ${r} ${r} 0 1 1 0 ${-r}`;
    case 'object': {
      // Rounded square
      const s = r * 0.85;
      const corner = s * 0.2;
      return `M ${-s + corner} ${-s}
              L ${s - corner} ${-s}
              Q ${s} ${-s} ${s} ${-s + corner}
              L ${s} ${s - corner}
              Q ${s} ${s} ${s - corner} ${s}
              L ${-s + corner} ${s}
              Q ${-s} ${s} ${-s} ${s - corner}
              L ${-s} ${-s + corner}
              Q ${-s} ${-s} ${-s + corner} ${-s}
              Z`;
    }
    case 'location': {
      // Diamond
      const d = r;
      return `M 0 ${-d} L ${d} 0 L 0 ${d} L ${-d} 0 Z`;
    }
    case 'entity': {
      // Hexagon
      const h = r * 0.9;
      const hw = h * 0.866; // cos(30°)
      const hh = h * 0.5; // sin(30°)
      return `M 0 ${-h}
              L ${hw} ${-hh}
              L ${hw} ${hh}
              L 0 ${h}
              L ${-hw} ${hh}
              L ${-hw} ${-hh}
              Z`;
    }
    default:
      return `M 0 ${-r} A ${r} ${r} 0 1 1 0 ${r} A ${r} ${r} 0 1 1 0 ${-r}`;
  }
}

const NODE_SIZE = 40;
const ZOOM_MIN = 0.1;
const ZOOM_MAX = 4;

/**
 * ForceGraphLayout component
 * Renders an interactive force-directed graph visualization
 */
export function ForceGraphLayout({
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
  const simulationRef = useRef<d3.Simulation<SimulationNode, SimulationLink> | null>(null);
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
    return () => resizeObserver.disconnect();
  }, []);

  // DEBUG: Track previous dependency values to identify what triggers re-renders
  const prevDepsRef = useRef<{ data: typeof data; dimensions: typeof dimensions; onNodeClick: typeof onNodeClick; onEdgeClick: typeof onEdgeClick } | null>(null);

  // Initialize and update the graph
  useEffect(() => {
    // DEBUG: Log what dependency changed
    if (prevDepsRef.current) {
      const changes: string[] = [];
      if (prevDepsRef.current.data !== data) changes.push('data');
      if (prevDepsRef.current.dimensions !== dimensions) changes.push('dimensions');
      if (prevDepsRef.current.onNodeClick !== onNodeClick) changes.push('onNodeClick');
      if (prevDepsRef.current.onEdgeClick !== onEdgeClick) changes.push('onEdgeClick');
      console.log('[ForceGraphLayout] Main useEffect triggered. Changed deps:', changes.length > 0 ? changes : 'NONE (initial render or dimensions check)');
    } else {
      console.log('[ForceGraphLayout] Main useEffect triggered. First render.');
    }
    prevDepsRef.current = { data, dimensions, onNodeClick, onEdgeClick };

    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    console.log('[ForceGraphLayout] Rebuilding graph from scratch...');

    // Clear previous content
    svg.selectAll('*').remove();

    // Create container group for zoom/pan
    const g = svg.append('g').attr('class', 'graph-container');

    // Create groups for edges and nodes (edges first so nodes appear on top)
    const edgeGroup = g.append('g').attr('class', 'edges');
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const labelGroup = g.append('g').attr('class', 'labels');

    // Prepare data for simulation - create SimulationNode wrappers
    const nodes: SimulationNode[] = data.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      shortDescription: n.shortDescription,
      originalNode: n,
    }));
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    const links: SimulationLink[] = [];
    for (const e of data.edges) {
      const source = nodeMap.get(e.source);
      const target = nodeMap.get(e.target);
      if (source && target) {
        links.push({
          id: e.id,
          relationship: e.relationship,
          label: e.label,
          evidence: e.evidence,
          source,
          target,
        });
      }
    }

    // Create force simulation with tuned parameters (GI6-GI11)
    // - Charge strength controls repulsion between nodes (more negative = more spacing)
    // - Added forceX/forceY with weak gravity (0.05) to keep disconnected nodes visible
    // - Link distance controls spacing between connected nodes
    const simulation = d3
      .forceSimulation<SimulationNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<SimulationNode, SimulationLink>(links)
          .id((d) => d.id)
          .distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(NODE_SIZE * 0.8))
      // Soft gravity to keep disconnected nodes from drifting too far
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    simulationRef.current = simulation;

    // Create edges
    const edges = edgeGroup
      .selectAll<SVGLineElement, SimulationLink>('line')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'graph-edge')
      .attr('stroke', (d) => getEdgeColor(d.relationship))
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)
      .attr('data-id', (d) => d.id)
      .on('click', (event, d) => {
        event.stopPropagation();
        const edge = data.edges.find((e) => e.id === d.id);
        if (edge && onEdgeClick) {
          onEdgeClick(edge);
        }
      })
      .on('mouseenter', function () {
        d3.select(this).attr('stroke-opacity', 1).attr('stroke-width', 3);
      })
      .on('mouseleave', function () {
        // Reset to default style; selection highlighting effect will re-apply if selected
        d3.select(this).attr('stroke-opacity', 0.6).attr('stroke-width', 2);
      });

    // Create node groups
    const nodeElements = nodeGroup
      .selectAll<SVGGElement, SimulationNode>('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'graph-node')
      .attr('data-id', (d) => d.id)
      .call(
        d3
          .drag<SVGGElement, SimulationNode>()
          .clickDistance(4) // Ignore drags < 4px as clicks to prevent click swallowing
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onNodeClick) {
          onNodeClick(d.originalNode);
        }
      });

    // Add node shapes
    // Get theme-aware colors from CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    const nodeStrokeColor = computedStyle.getPropertyValue('--color-graph-node-stroke').trim() || '#ffffff';
    const graphTextColor = computedStyle.getPropertyValue('--color-graph-text').trim() || '#374151';

    nodeElements
      .append('path')
      .attr('d', (d) => getNodeShape(d.type, NODE_SIZE))
      .attr('fill', (d) => getNodeColor(d.type))
      .attr('stroke', nodeStrokeColor)
      .attr('stroke-width', 2)
      .attr('class', 'node-shape');

    // Create labels
    const labels = labelGroup
      .selectAll<SVGTextElement, SimulationNode>('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'graph-label')
      .attr('text-anchor', 'middle')
      .attr('dy', NODE_SIZE / 2 + 14)
      .text((d) => d.title)
      .attr('font-size', '11px')
      .attr('fill', graphTextColor)
      .attr('pointer-events', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      edges
        .attr('x1', (d) => (d.source as SimulationNode).x ?? 0)
        .attr('y1', (d) => (d.source as SimulationNode).y ?? 0)
        .attr('x2', (d) => (d.target as SimulationNode).x ?? 0)
        .attr('y2', (d) => (d.target as SimulationNode).y ?? 0);

      nodeElements.attr('transform', (d) => `translate(${d.x ?? 0}, ${d.y ?? 0})`);

      labels.attr('x', (d) => d.x ?? 0).attr('y', (d) => d.y ?? 0);
    });

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
      // No-op for now - could clear selection
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
    // Note: selectedEdgeId and selectedNodeId are intentionally NOT in dependencies
    // because selection highlighting is handled by a separate useEffect.
    // Including them here would cause the graph to re-layout on every selection.
  }, [data, dimensions, onNodeClick, onEdgeClick]);

  // Update selection highlighting
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Get theme-aware colors from CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    const nodeStrokeColor = computedStyle.getPropertyValue('--color-graph-node-stroke').trim() || '#ffffff';
    const selectedStrokeColor = computedStyle.getPropertyValue('--color-graph-node-stroke-selected').trim() || '#1e293b';

    // Update node selection state
    svg.selectAll('.graph-node').each(function () {
      const el = d3.select(this);
      const nodeId = el.attr('data-id');
      const isSelected = nodeId === selectedNodeId;

      el.select('.node-shape')
        .attr('stroke', isSelected ? selectedStrokeColor : nodeStrokeColor)
        .attr('stroke-width', isSelected ? 3 : 2);

      el.classed('selected', isSelected);
    });

    // Update edge selection state
    svg.selectAll('.graph-edge').each(function () {
      const el = d3.select(this);
      const edgeId = el.attr('data-id');
      const isSelected = edgeId === selectedEdgeId;

      el.attr('stroke-opacity', isSelected ? 1 : 0.6).attr('stroke-width', isSelected ? 3 : 2);

      el.classed('selected', isSelected);
    });
  }, [selectedNodeId, selectedEdgeId]);

  // Update search highlighting
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const term = searchTerm?.toLowerCase() ?? '';

    // Highlight nodes matching search
    svg.selectAll<SVGGElement, SimulationNode>('.graph-node').each(function (d) {
      const el = d3.select(this);
      const isMatch = term && d.title.toLowerCase().includes(term);

      el.classed('search-match', !!isMatch);
      el.select('.node-shape').attr('filter', isMatch ? 'url(#glow)' : null);
    });

    // Dim non-matching elements when searching
    svg.selectAll<SVGGElement, SimulationNode>('.graph-node').attr('opacity', (d) => {
      if (!term) return 1;
      return d.title.toLowerCase().includes(term) ? 1 : 0.3;
    });

    svg.selectAll<SVGTextElement, SimulationNode>('.graph-label').attr('opacity', (d) => {
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

  return (
    <div ref={containerRef} className={`force-graph-layout ${className}`}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}>
        <defs>
          {/* Glow filter for search highlighting */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Zoom controls */}
      <div className="force-graph-layout__controls">
        <button
          className="force-graph-layout__control-btn"
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
          className="force-graph-layout__control-btn"
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
          className="force-graph-layout__control-btn"
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

      {/* Legend */}
      <div className="force-graph-layout__legend">
        <div className="force-graph-layout__legend-title">Node Types</div>
        <div className="force-graph-layout__legend-item">
          <svg width="16" height="16" viewBox="-10 -10 20 20">
            <circle r="7" fill="#3b82f6" stroke="#fff" strokeWidth="1" />
          </svg>
          <span>Person</span>
        </div>
        <div className="force-graph-layout__legend-item">
          <svg width="16" height="16" viewBox="-10 -10 20 20">
            <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#10b981" stroke="#fff" strokeWidth="1" />
          </svg>
          <span>Object</span>
        </div>
        <div className="force-graph-layout__legend-item">
          <svg width="16" height="16" viewBox="-10 -10 20 20">
            <path d="M 0 -7 L 7 0 L 0 7 L -7 0 Z" fill="#f59e0b" stroke="#fff" strokeWidth="1" />
          </svg>
          <span>Location</span>
        </div>
        <div className="force-graph-layout__legend-item">
          <svg width="16" height="16" viewBox="-10 -10 20 20">
            <path d="M 0 -7 L 6 -3.5 L 6 3.5 L 0 7 L -6 3.5 L -6 -3.5 Z" fill="#8b5cf6" stroke="#fff" strokeWidth="1" />
          </svg>
          <span>Entity</span>
        </div>
      </div>
    </div>
  );
}

export default ForceGraphLayout;
