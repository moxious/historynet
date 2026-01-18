/**
 * Timeline layout using D3.js
 * Displays nodes chronologically on a vertical timeline
 */

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { GraphNode, NodeType, PersonNode } from '@types';
import type { LayoutComponentProps } from './types';
import { isPersonNode } from '@types';
import { getNodeColor, getEdgeColor, parseYear } from '@utils';
import './TimelineLayout.css';

/**
 * Node positioned on the timeline with computed coordinates
 */
interface TimelineNode {
  id: string;
  type: NodeType;
  title: string;
  originalNode: GraphNode;
  /** Year value for positioning (from dateStart) */
  year: number | null;
  /** End year for persons (death date) */
  yearEnd: number | null;
  /** Computed x position (lane) */
  x?: number;
  /** Computed y position (based on year) */
  y?: number;
  /** Lane assignment for horizontal spreading */
  lane?: number;
}

/**
 * Edge on the timeline
 */
interface TimelineEdge {
  id: string;
  relationship: string;
  source: TimelineNode;
  target: TimelineNode;
}

const NODE_SIZE = 32;
const LANE_WIDTH = 180;
const AXIS_WIDTH = 80;
const MIN_YEAR_HEIGHT = 30; // Minimum pixels per year
const UNDATED_SECTION_HEIGHT = 150;
const ZOOM_MIN = 0.3;
const ZOOM_MAX = 5;

/**
 * TimelineLayout component
 * Renders nodes on a vertical timeline with zoom/pan interactions
 */
export function TimelineLayout({
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

  // Process nodes and calculate timeline positions
  const { timelineNodes, timelineEdges, yearRange, undatedNodes } = useMemo(() => {
    const datedNodes: TimelineNode[] = [];
    const undated: TimelineNode[] = [];
    let minYear = Infinity;
    let maxYear = -Infinity;

    // Convert GraphNodes to TimelineNodes
    for (const node of data.nodes) {
      const year = parseYear(node.dateStart);
      let yearEnd: number | null = null;

      if (isPersonNode(node)) {
        yearEnd = parseYear((node as PersonNode).dateEnd);
      } else {
        yearEnd = parseYear(node.dateEnd);
      }

      const timelineNode: TimelineNode = {
        id: node.id,
        type: node.type,
        title: node.title,
        originalNode: node,
        year,
        yearEnd,
      };

      if (year !== null) {
        datedNodes.push(timelineNode);
        minYear = Math.min(minYear, year);
        maxYear = Math.max(maxYear, yearEnd ?? year);
      } else {
        undated.push(timelineNode);
      }
    }

    // Sort dated nodes by year
    datedNodes.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

    // Create node map for edge lookup
    const nodeMap = new Map<string, TimelineNode>();
    for (const node of [...datedNodes, ...undated]) {
      nodeMap.set(node.id, node);
    }

    // Convert edges
    const edges: TimelineEdge[] = [];
    for (const edge of data.edges) {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);
      if (source && target) {
        edges.push({
          id: edge.id,
          relationship: edge.relationship,
          source,
          target,
        });
      }
    }

    return {
      timelineNodes: datedNodes,
      timelineEdges: edges,
      yearRange:
        minYear !== Infinity ? { min: minYear, max: maxYear } : { min: 1600, max: 2000 },
      undatedNodes: undated,
    };
  }, [data]);

  // Assign lanes to prevent overlapping
  const assignedNodes = useMemo(() => {
    if (timelineNodes.length === 0) return [];

    // Calculate lanes for overlapping lifespans
    const lanes: { end: number }[] = [];
    const assigned: TimelineNode[] = [];

    for (const node of timelineNodes) {
      const start = node.year ?? yearRange.min;
      const end = node.yearEnd ?? node.year ?? yearRange.min;

      // Find first available lane
      let laneIndex = 0;
      while (laneIndex < lanes.length && lanes[laneIndex].end >= start - 5) {
        laneIndex++;
      }

      if (laneIndex >= lanes.length) {
        lanes.push({ end });
      } else {
        lanes[laneIndex].end = end;
      }

      assigned.push({
        ...node,
        lane: laneIndex,
      });
    }

    return assigned;
  }, [timelineNodes, yearRange]);

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

  // Initialize and render the timeline
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Clear previous content
    svg.selectAll('*').remove();

    // Calculate content dimensions
    const yearSpan = yearRange.max - yearRange.min + 1;
    const contentHeight = Math.max(yearSpan * MIN_YEAR_HEIGHT, height);
    const laneCount = Math.max(...assignedNodes.map((n) => n.lane ?? 0), 0) + 1;
    const contentWidth = AXIS_WIDTH + laneCount * LANE_WIDTH + 100;

    // Create scales
    const yScale = d3
      .scaleLinear()
      .domain([yearRange.min, yearRange.max])
      .range([50, contentHeight - UNDATED_SECTION_HEIGHT - 50]);

    // Create container group for zoom/pan
    const g = svg.append('g').attr('class', 'timeline-container');

    // Create background
    g.append('rect')
      .attr('class', 'timeline-background')
      .attr('width', contentWidth)
      .attr('height', contentHeight)
      .attr('fill', 'transparent');

    // Create time axis
    const axisGroup = g.append('g').attr('class', 'timeline-axis');

    // Draw decade markers
    const startDecade = Math.floor(yearRange.min / 10) * 10;
    const endDecade = Math.ceil(yearRange.max / 10) * 10;

    for (let year = startDecade; year <= endDecade; year += 10) {
      if (year >= yearRange.min && year <= yearRange.max) {
        const y = yScale(year);
        const isCentury = year % 100 === 0;

        // Draw horizontal grid line
        axisGroup
          .append('line')
          .attr('class', isCentury ? 'timeline-grid-century' : 'timeline-grid-decade')
          .attr('x1', AXIS_WIDTH - 5)
          .attr('x2', contentWidth)
          .attr('y1', y)
          .attr('y2', y)
          .attr('stroke', isCentury ? '#cbd5e1' : '#e2e8f0')
          .attr('stroke-width', isCentury ? 1.5 : 0.5)
          .attr('stroke-dasharray', isCentury ? 'none' : '2,4');

        // Draw year label
        axisGroup
          .append('text')
          .attr('class', 'timeline-year-label')
          .attr('x', AXIS_WIDTH - 10)
          .attr('y', y)
          .attr('text-anchor', 'end')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', isCentury ? '12px' : '10px')
          .attr('font-weight', isCentury ? '600' : '400')
          .attr('fill', isCentury ? '#1e293b' : '#64748b')
          .text(year);
      }
    }

    // Draw axis line
    axisGroup
      .append('line')
      .attr('class', 'timeline-axis-line')
      .attr('x1', AXIS_WIDTH)
      .attr('x2', AXIS_WIDTH)
      .attr('y1', yScale(yearRange.min) - 20)
      .attr('y2', yScale(yearRange.max) + 20)
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2);

    // Create groups for edges and nodes
    const edgeGroup = g.append('g').attr('class', 'timeline-edges');
    const nodeGroup = g.append('g').attr('class', 'timeline-nodes');

    // Position nodes
    for (const node of assignedNodes) {
      node.x = AXIS_WIDTH + 50 + (node.lane ?? 0) * LANE_WIDTH;
      node.y = yScale(node.year ?? yearRange.min);
    }

    // Draw edges as curved paths
    edgeGroup
      .selectAll<SVGPathElement, TimelineEdge>('path')
      .data(timelineEdges.filter((e) => e.source.year !== null && e.target.year !== null))
      .enter()
      .append('path')
      .attr('class', 'timeline-edge')
      .attr('d', (d) => {
        const sourceX = d.source.x ?? 0;
        const sourceY = d.source.y ?? 0;
        const targetX = d.target.x ?? 0;
        const targetY = d.target.y ?? 0;
        const midX = (sourceX + targetX) / 2;

        // Bezier curve
        return `M ${sourceX} ${sourceY} Q ${midX} ${(sourceY + targetY) / 2} ${targetX} ${targetY}`;
      })
      .attr('fill', 'none')
      .attr('stroke', (d) => getEdgeColor(d.relationship))
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.4)
      .attr('data-id', (d) => d.id)
      .on('click', (event, d) => {
        event.stopPropagation();
        const edge = data.edges.find((e) => e.id === d.id);
        if (edge && onEdgeClick) {
          onEdgeClick(edge);
        }
      })
      .on('mouseenter', function () {
        d3.select(this).attr('stroke-opacity', 0.8).attr('stroke-width', 2.5);
      })
      .on('mouseleave', function (_event, d) {
        const isSelected = selectedEdgeId === d.id;
        d3.select(this)
          .attr('stroke-opacity', isSelected ? 0.8 : 0.4)
          .attr('stroke-width', isSelected ? 2.5 : 1.5);
      });

    // Draw lifespan bars for persons
    nodeGroup
      .selectAll<SVGRectElement, TimelineNode>('.timeline-lifespan')
      .data(assignedNodes.filter((n) => n.type === 'person' && n.yearEnd !== null))
      .enter()
      .append('rect')
      .attr('class', 'timeline-lifespan')
      .attr('x', (d) => (d.x ?? 0) - NODE_SIZE / 4)
      .attr('y', (d) => yScale(d.year ?? yearRange.min))
      .attr('width', NODE_SIZE / 2)
      .attr('height', (d) => {
        const startY = yScale(d.year ?? yearRange.min);
        const endY = yScale(d.yearEnd ?? d.year ?? yearRange.min);
        return Math.max(endY - startY, 4);
      })
      .attr('fill', (d) => getNodeColor(d.type))
      .attr('fill-opacity', 0.2)
      .attr('rx', 4);

    // Draw nodes
    const nodeElements = nodeGroup
      .selectAll<SVGGElement, TimelineNode>('.timeline-node')
      .data(assignedNodes)
      .enter()
      .append('g')
      .attr('class', 'timeline-node')
      .attr('transform', (d) => `translate(${d.x ?? 0}, ${d.y ?? 0})`)
      .attr('data-id', (d) => d.id)
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onNodeClick) {
          onNodeClick(d.originalNode);
        }
      });

    // Add node circles
    nodeElements
      .append('circle')
      .attr('class', 'timeline-node-shape')
      .attr('r', NODE_SIZE / 2)
      .attr('fill', (d) => getNodeColor(d.type))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add node labels
    nodeElements
      .append('text')
      .attr('class', 'timeline-node-label')
      .attr('x', NODE_SIZE / 2 + 8)
      .attr('y', 0)
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#1e293b')
      .text((d) => d.title);

    // Draw death markers for persons
    nodeGroup
      .selectAll<SVGCircleElement, TimelineNode>('.timeline-death-marker')
      .data(assignedNodes.filter((n) => n.type === 'person' && n.yearEnd !== null))
      .enter()
      .append('circle')
      .attr('class', 'timeline-death-marker')
      .attr('cx', (d) => d.x ?? 0)
      .attr('cy', (d) => yScale(d.yearEnd ?? yearRange.max))
      .attr('r', NODE_SIZE / 4)
      .attr('fill', 'none')
      .attr('stroke', (d) => getNodeColor(d.type))
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '2,2');

    // Draw undated section if there are undated nodes
    if (undatedNodes.length > 0) {
      const undatedY = contentHeight - UNDATED_SECTION_HEIGHT + 30;

      // Separator line
      g.append('line')
        .attr('class', 'timeline-undated-separator')
        .attr('x1', 0)
        .attr('x2', contentWidth)
        .attr('y1', undatedY - 20)
        .attr('y2', undatedY - 20)
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '8,4');

      // Label
      g.append('text')
        .attr('class', 'timeline-undated-label')
        .attr('x', AXIS_WIDTH - 10)
        .attr('y', undatedY)
        .attr('text-anchor', 'end')
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('fill', '#64748b')
        .text('Undated');

      // Position undated nodes in a row
      const undatedGroup = g.append('g').attr('class', 'timeline-undated-nodes');

      undatedNodes.forEach((node, i) => {
        node.x = AXIS_WIDTH + 50 + i * (NODE_SIZE + 60);
        node.y = undatedY;
      });

      const undatedNodeElements = undatedGroup
        .selectAll<SVGGElement, TimelineNode>('.timeline-node')
        .data(undatedNodes)
        .enter()
        .append('g')
        .attr('class', 'timeline-node')
        .attr('transform', (d) => `translate(${d.x ?? 0}, ${d.y ?? 0})`)
        .attr('data-id', (d) => d.id)
        .on('click', (event, d) => {
          event.stopPropagation();
          if (onNodeClick) {
            onNodeClick(d.originalNode);
          }
        });

      undatedNodeElements
        .append('circle')
        .attr('class', 'timeline-node-shape')
        .attr('r', NODE_SIZE / 2)
        .attr('fill', (d) => getNodeColor(d.type))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

      undatedNodeElements
        .append('text')
        .attr('class', 'timeline-node-label')
        .attr('x', NODE_SIZE / 2 + 8)
        .attr('y', 0)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#1e293b')
        .text((d) => d.title);
    }

    // Setup zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([ZOOM_MIN, ZOOM_MAX])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    // Initial zoom to fit content
    const initialScale = Math.min(
      width / contentWidth,
      height / contentHeight,
      1
    );
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(0, 0).scale(Math.max(initialScale, ZOOM_MIN))
    );

    // Cleanup
    return () => {
      // No cleanup needed
    };
  }, [
    data,
    dimensions,
    assignedNodes,
    timelineEdges,
    yearRange,
    undatedNodes,
    onNodeClick,
    onEdgeClick,
    selectedEdgeId,
  ]);

  // Update selection highlighting
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Update node selection state
    svg.selectAll('.timeline-node').each(function () {
      const el = d3.select(this);
      const nodeId = el.attr('data-id');
      const isSelected = nodeId === selectedNodeId;

      el.select('.timeline-node-shape')
        .attr('stroke', isSelected ? '#1e293b' : '#fff')
        .attr('stroke-width', isSelected ? 3 : 2);

      el.classed('selected', isSelected);
    });

    // Update edge selection state
    svg.selectAll('.timeline-edge').each(function () {
      const el = d3.select(this);
      const edgeId = el.attr('data-id');
      const isSelected = edgeId === selectedEdgeId;

      el.attr('stroke-opacity', isSelected ? 0.8 : 0.4).attr(
        'stroke-width',
        isSelected ? 2.5 : 1.5
      );

      el.classed('selected', isSelected);
    });
  }, [selectedNodeId, selectedEdgeId]);

  // Update search highlighting
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const term = searchTerm?.toLowerCase() ?? '';

    // Highlight nodes matching search
    svg.selectAll<SVGGElement, TimelineNode>('.timeline-node').each(function (d) {
      const el = d3.select(this);
      const isMatch = term && d.title.toLowerCase().includes(term);

      el.classed('search-match', !!isMatch);
      el.select('.timeline-node-shape').attr('filter', isMatch ? 'url(#timeline-glow)' : null);
    });

    // Dim non-matching elements when searching
    svg.selectAll<SVGGElement, TimelineNode>('.timeline-node').attr('opacity', (d) => {
      if (!term) return 1;
      return d.title.toLowerCase().includes(term) ? 1 : 0.3;
    });

    svg.selectAll<SVGTextElement, TimelineNode>('.timeline-node-label').attr('opacity', (d) => {
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
    const { width, height } = dimensions;

    // Calculate content dimensions
    const yearSpan = yearRange.max - yearRange.min + 1;
    const contentHeight = Math.max(yearSpan * MIN_YEAR_HEIGHT, height);
    const laneCount = Math.max(...assignedNodes.map((n) => n.lane ?? 0), 0) + 1;
    const contentWidth = AXIS_WIDTH + laneCount * LANE_WIDTH + 100;

    const initialScale = Math.min(width / contentWidth, height / contentHeight, 1);
    svg
      .transition()
      .duration(500)
      .call(
        zoomRef.current.transform,
        d3.zoomIdentity.translate(0, 0).scale(Math.max(initialScale, ZOOM_MIN))
      );
  }, [dimensions, yearRange, assignedNodes]);

  return (
    <div ref={containerRef} className={`timeline-layout ${className}`}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}>
        <defs>
          {/* Glow filter for search highlighting */}
          <filter id="timeline-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Zoom controls */}
      <div className="timeline-layout__controls">
        <button
          className="timeline-layout__control-btn"
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
          className="timeline-layout__control-btn"
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
          className="timeline-layout__control-btn"
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
      <div className="timeline-layout__legend">
        <div className="timeline-layout__legend-title">Timeline</div>
        <div className="timeline-layout__legend-item">
          <div className="timeline-layout__legend-circle" style={{ backgroundColor: '#3b82f6' }} />
          <span>Birth</span>
        </div>
        <div className="timeline-layout__legend-item">
          <div
            className="timeline-layout__legend-circle timeline-layout__legend-circle--hollow"
            style={{ borderColor: '#3b82f6' }}
          />
          <span>Death</span>
        </div>
        <div className="timeline-layout__legend-item">
          <div className="timeline-layout__legend-bar" style={{ backgroundColor: '#3b82f6' }} />
          <span>Lifespan</span>
        </div>
      </div>
    </div>
  );
}

export default TimelineLayout;
