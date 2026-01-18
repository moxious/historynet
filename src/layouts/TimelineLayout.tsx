/**
 * Timeline layout using D3.js
 * Displays events chronologically on a single-column vertical timeline
 * with alternating left/right labels
 */

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { GraphNode, NodeType } from '@types';
import type { LayoutComponentProps } from './types';
import { isPersonNode } from '@types';
import { getNodeColor, getEdgeColor, parseYear, createSegmentedScale, getTickGranularity, generateTicks } from '@utils';
import type { SegmentedScale, TickGranularity } from '@utils';
import './TimelineLayout.css';

/**
 * Event type for timeline display
 */
type EventType = 'birth' | 'death' | 'created' | 'founded';

/**
 * A discrete event on the timeline (birth, death, created, founded)
 */
interface TimelineEvent {
  /** Unique ID for the event (nodeId-eventType) */
  id: string;
  /** Year of the event */
  year: number;
  /** Month (1-12) for sub-year precision, optional */
  month?: number;
  /** Day (1-31) for precise dates, optional */
  day?: number;
  /** Type of event */
  type: EventType;
  /** ID of the node this event belongs to */
  nodeId: string;
  /** Node type (person, object, location, entity) */
  nodeType: NodeType;
  /** Display title */
  title: string;
  /** Reference to the original node */
  originalNode: GraphNode;
  /** Computed Y position */
  y?: number;
  /** Whether label is on the left (true) or right (false) */
  isLeft?: boolean;
  /** Stacking offset for events at the same date */
  stackOffset?: number;
}

/**
 * Edge connecting events on the timeline
 */
interface TimelineEdge {
  id: string;
  relationship: string;
  sourceNodeId: string;
  targetNodeId: string;
}

/**
 * Node reference for edge drawing (maps node to its events)
 */
interface NodeEventMap {
  nodeId: string;
  birthEvent?: TimelineEvent;
  deathEvent?: TimelineEvent;
  primaryEvent?: TimelineEvent; // First event for non-person nodes
}

/**
 * Lane assignment for an event in the swim-lane layout
 */
interface LaneAssignment {
  /** Which lane the event is in (0 = closest to axis) */
  laneIndex: number;
  /** Horizontal offset from axis based on lane */
  xOffset: number;
}

// Layout constants
const EVENT_MARKER_SIZE = 10;
const LABEL_WIDTH = 220;
const LABEL_OFFSET = 20; // Distance from axis to label
// Left margin accounts for filter panel (max 280px) + spacing + left labels
const LEFT_MARGIN = 300;
const AXIS_X = LEFT_MARGIN + LABEL_WIDTH + LABEL_OFFSET + 20;
const UNDATED_SECTION_HEIGHT = 150;
const ZOOM_MIN = 0.3;
const ZOOM_MAX = 8; // Increased for finer granularity
const INITIAL_ZOOM_SCALE = 0.8;

// Swim-lane layout constants
const LABEL_HEIGHT = 55; // Approximate height of label card with padding
const LANE_GAP = 10; // Gap between lanes
const LANE_WIDTH = LABEL_WIDTH + LANE_GAP; // Each lane is label width + gap
const MAX_LANES = 3; // Cap lanes to prevent excessive width

// Timeline segmentation settings
const GAP_THRESHOLD = 40;
const MIN_SEGMENT_HEIGHT = 100;
const BREAK_INDICATOR_HEIGHT = 30;

/**
 * Get the event type label for display
 */
function getEventTypeLabel(type: EventType): string {
  switch (type) {
    case 'birth': return 'Born';
    case 'death': return 'Died';
    case 'created': return 'Created';
    case 'founded': return 'Founded';
  }
}

/**
 * Get event color based on event type
 */
function getEventColor(type: EventType, nodeType: NodeType): string {
  // Use the node's base color but vary by event type
  const baseColor = getNodeColor(nodeType);
  if (type === 'death') {
    // Slightly darker/muted for death events
    return baseColor;
  }
  return baseColor;
}

/**
 * Assign events to swim lanes to prevent overlap.
 * Events on the same side that don't vertically overlap share a lane.
 * Overlapping events are pushed to the next lane (further from axis).
 * 
 * This approach allows events that are close in time but don't overlap
 * to share Lane 0, while truly overlapping events get placed in outer lanes.
 * 
 * @param events Array of events with y positions assigned
 * @param labelHeight Height of event labels (for overlap detection)
 * @returns Map of event ID to lane assignment
 */
function assignLanes(
  events: TimelineEvent[],
  labelHeight: number
): Map<string, LaneAssignment> {
  const assignments = new Map<string, LaneAssignment>();

  if (events.length === 0) return assignments;

  // Separate and sort by Y position
  const leftEvents = events.filter(e => e.isLeft).sort((a, b) => (a.y ?? 0) - (b.y ?? 0));
  const rightEvents = events.filter(e => !e.isLeft).sort((a, b) => (a.y ?? 0) - (b.y ?? 0));

  for (const sideEvents of [leftEvents, rightEvents]) {
    if (sideEvents.length === 0) continue;
    
    const isLeft = sideEvents[0].isLeft ?? true;
    const lanes: TimelineEvent[][] = [];

    for (const event of sideEvents) {
      let placed = false;
      const eventY = event.y ?? 0;

      // Try to fit in existing lane (prefer lane 0, closest to axis)
      for (let i = 0; i < lanes.length; i++) {
        const lastInLane = lanes[i][lanes[i].length - 1];
        const lastY = lastInLane.y ?? 0;

        // Check if event fits after last event in this lane
        if (eventY >= lastY + labelHeight) {
          lanes[i].push(event);
          assignments.set(event.id, {
            laneIndex: i,
            xOffset: i * LANE_WIDTH * (isLeft ? -1 : 1),
          });
          placed = true;
          break;
        }
      }

      // Create new lane if needed (up to MAX_LANES)
      if (!placed) {
        const newLaneIndex = Math.min(lanes.length, MAX_LANES - 1);
        
        if (newLaneIndex === lanes.length) {
          // Create a new lane
          lanes.push([event]);
        } else {
          // At max lanes, append to last lane (will overlap, but capped)
          lanes[newLaneIndex].push(event);
        }
        
        assignments.set(event.id, {
          laneIndex: newLaneIndex,
          xOffset: newLaneIndex * LANE_WIDTH * (isLeft ? -1 : 1),
        });
      }
    }
  }

  return assignments;
}

/**
 * TimelineLayout component
 * Renders events on a single-column vertical timeline with alternating labels
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
  const [currentZoomScale, setCurrentZoomScale] = useState(INITIAL_ZOOM_SCALE);
  const [currentGranularity, setCurrentGranularity] = useState<TickGranularity>('decade');

  // Process nodes into discrete events
  const { events, timelineEdges, yearRange, undatedNodes, datedYears, nodeEventMap, eventsPerYear } = useMemo(() => {
    const allEvents: TimelineEvent[] = [];
    const undated: GraphNode[] = [];
    let minYear = Infinity;
    let maxYear = -Infinity;
    const nodeToEvents = new Map<string, NodeEventMap>();

    // Convert GraphNodes to TimelineEvents
    for (const node of data.nodes) {
      const startYear = parseYear(node.dateStart);
      const endYear = parseYear(node.dateEnd);

      // Track for edges
      const eventMap: NodeEventMap = { nodeId: node.id };

      if (isPersonNode(node)) {
        // Person nodes get birth and death events
        if (startYear !== null) {
          const birthEvent: TimelineEvent = {
            id: `${node.id}-birth`,
            year: startYear,
            type: 'birth',
            nodeId: node.id,
            nodeType: node.type,
            title: node.title,
            originalNode: node,
          };
          allEvents.push(birthEvent);
          eventMap.birthEvent = birthEvent;
          eventMap.primaryEvent = birthEvent;
          minYear = Math.min(minYear, startYear);
          maxYear = Math.max(maxYear, startYear);
        }

        if (endYear !== null) {
          const deathEvent: TimelineEvent = {
            id: `${node.id}-death`,
            year: endYear,
            type: 'death',
            nodeId: node.id,
            nodeType: node.type,
            title: node.title,
            originalNode: node,
          };
          allEvents.push(deathEvent);
          eventMap.deathEvent = deathEvent;
          minYear = Math.min(minYear, endYear);
          maxYear = Math.max(maxYear, endYear);
        }

        if (startYear === null && endYear === null) {
          undated.push(node);
        }
      } else {
        // Object/Location/Entity nodes get a single event
        if (startYear !== null) {
          const eventType: EventType = node.type === 'object' ? 'created' : 'founded';
          const event: TimelineEvent = {
            id: `${node.id}-${eventType}`,
            year: startYear,
            type: eventType,
            nodeId: node.id,
            nodeType: node.type,
            title: node.title,
            originalNode: node,
          };
          allEvents.push(event);
          eventMap.primaryEvent = event;
          minYear = Math.min(minYear, startYear);
          maxYear = Math.max(maxYear, startYear);
        } else {
          undated.push(node);
        }
      }

      nodeToEvents.set(node.id, eventMap);
    }

    // Sort events by year
    allEvents.sort((a, b) => a.year - b.year);

    // Assign alternating left/right positions and handle stacking
    // Group events by year for stacking
    const eventsByYear = new Map<number, TimelineEvent[]>();
    for (const event of allEvents) {
      const yearEvents = eventsByYear.get(event.year) ?? [];
      yearEvents.push(event);
      eventsByYear.set(event.year, yearEvents);
    }

    // Assign left/right sides for events at the same year
    // Alternate left/right WITHIN each year to distribute events on both sides
    // The swim-lane algorithm will handle vertical overlap via horizontal lanes
    for (const yearEvents of eventsByYear.values()) {
      yearEvents.forEach((event, stackIndex) => {
        // Alternate left/right within the year (not globally)
        event.isLeft = stackIndex % 2 === 0;
        // No stackOffset needed - swim lanes handle overlap horizontally
        event.stackOffset = 0;
      });
    }

    // Convert edges (store node IDs, resolve positions at render time)
    const edges: TimelineEdge[] = data.edges.map((edge) => ({
      id: edge.id,
      relationship: edge.relationship,
      sourceNodeId: edge.source,
      targetNodeId: edge.target,
    }));

    // Collect all years for segmentation
    const datedYears = allEvents.map((e) => e.year);

    // Build events per year map for density-aware scale allocation
    const eventsPerYear = new Map<number, number>();
    for (const event of allEvents) {
      eventsPerYear.set(event.year, (eventsPerYear.get(event.year) ?? 0) + 1);
    }

    return {
      events: allEvents,
      timelineEdges: edges,
      yearRange:
        minYear !== Infinity ? { min: minYear, max: maxYear } : { min: 1600, max: 2000 },
      undatedNodes: undated,
      datedYears,
      nodeEventMap: nodeToEvents,
      eventsPerYear,
    };
  }, [data]);

  // Create segmented scale that compresses large gaps in the timeline
  const segmentedScaleRef = useRef<SegmentedScale | null>(null);

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

    // Calculate content dimensions - account for multiple swim lanes on each side
    const contentWidth = AXIS_X + (LANE_WIDTH * MAX_LANES) + 100;

    // Create segmented scale that compresses large gaps in the timeline
    // Pass eventsPerYear for density-aware height allocation
    const segmentedScale = createSegmentedScale(datedYears, height * 3, {
      gapThreshold: GAP_THRESHOLD,
      minSegmentHeight: MIN_SEGMENT_HEIGHT,
      breakIndicatorHeight: BREAK_INDICATOR_HEIGHT,
      topPadding: 50,
      bottomPadding: UNDATED_SECTION_HEIGHT + 50,
      eventsPerYear,
      pixelsPerEvent: LABEL_HEIGHT, // Use label height for density calculations
    });
    
    // Store ref for use in reset view
    segmentedScaleRef.current = segmentedScale;

    // Calculate content height from segments
    const lastSegment = segmentedScale.segments[segmentedScale.segments.length - 1];
    const contentHeight = Math.max(
      (lastSegment?.yEnd ?? 50) + UNDATED_SECTION_HEIGHT + 50,
      height
    );
    
    // Use segmented scale's toY function for positioning
    const yScale = segmentedScale.toY;

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

    // Get theme colors for axis and grid (at render time)
    const axisComputedStyle = getComputedStyle(document.documentElement);
    const axisBorderColor = axisComputedStyle.getPropertyValue('--color-border').trim() || '#94a3b8';

    // Draw axis line segments (static, doesn't change with zoom)
    for (const segment of segmentedScale.segments) {
      axisGroup
        .append('line')
        .attr('class', 'timeline-axis-line')
        .attr('x1', AXIS_X)
        .attr('x2', AXIS_X)
        .attr('y1', (segment.yStart ?? 50) - 10)
        .attr('y2', (segment.yEnd ?? 50) + 10)
        .attr('stroke', axisBorderColor)
        .attr('stroke-width', 3);
    }

    // Create tick container for dynamic tick updates
    const tickGroup = axisGroup.append('g').attr('class', 'timeline-ticks');

    // Function to render ticks at the current granularity
    const renderTicks = (granularity: TickGranularity) => {
      tickGroup.selectAll('*').remove();

      // Get theme colors for ticks
      const tickStyle = getComputedStyle(document.documentElement);
      const gridMajorColor = tickStyle.getPropertyValue('--color-border').trim() || '#cbd5e1';
      const gridMinorColor = tickStyle.getPropertyValue('--color-border-light').trim() || '#e2e8f0';
      const tickTextColor = tickStyle.getPropertyValue('--color-text').trim() || '#0f172a';
      const tickTextMutedColor = tickStyle.getPropertyValue('--color-text-muted').trim() || '#64748b';

      for (const segment of segmentedScale.segments) {
        const ticks = generateTicks(segment.yearStart, segment.yearEnd, granularity);

        for (const tick of ticks) {
          // Skip ticks outside the segment (can happen with month/day granularity)
          if (tick.value < segment.yearStart || tick.value > segment.yearEnd) continue;

          const y = yScale(tick.value);

          // Draw tick line (grid line) - extend to cover all swim lanes
          if (tick.isMajor || granularity === 'decade' || granularity === 'year') {
            tickGroup
              .append('line')
              .attr('class', tick.isMajor ? 'timeline-grid-major' : 'timeline-grid-minor')
              .attr('x1', AXIS_X - (LANE_WIDTH * MAX_LANES))
              .attr('x2', AXIS_X + (LANE_WIDTH * MAX_LANES))
              .attr('y1', y)
              .attr('y2', y)
              .attr('stroke', tick.isMajor ? gridMajorColor : gridMinorColor)
              .attr('stroke-width', tick.isMajor ? 1.5 : 0.5)
              .attr('stroke-dasharray', tick.isMajor ? 'none' : '2,4');
          }

          // Draw label (only for labeled ticks)
          // Position labels to the left of the axis to avoid overlapping event markers
          if (tick.label) {
            tickGroup
              .append('text')
              .attr('class', 'timeline-tick-label')
              .attr('x', AXIS_X - 15)
              .attr('y', y)
              .attr('text-anchor', 'end')
              .attr('dominant-baseline', 'middle')
              .attr('font-size', tick.isMajor ? '12px' : '10px')
              .attr('font-weight', tick.isMajor ? '600' : '400')
              .attr('fill', tick.isMajor ? tickTextColor : tickTextMutedColor)
              .text(tick.label);
          }
        }
      }
    };

    // Initial tick render at the default granularity
    const initialGranularity = getTickGranularity(INITIAL_ZOOM_SCALE);
    renderTicks(initialGranularity);
    setCurrentGranularity(initialGranularity);

    // Draw break indicators between segments
    const breaks = segmentedScale.getSegmentBreaks();
    const breakTextMuted = axisComputedStyle.getPropertyValue('--color-text-muted').trim() || '#64748b';
    for (const breakInfo of breaks) {
      const breakY = breakInfo.y;
      const gapYears = breakInfo.gapYears;

      // Create break indicator group
      const breakGroup = axisGroup.append('g').attr('class', 'timeline-break-indicator');

      // Draw zig-zag pattern on the axis
      const zigzagPath = `
        M ${AXIS_X - 8} ${breakY - 8}
        L ${AXIS_X + 8} ${breakY - 4}
        L ${AXIS_X - 8} ${breakY}
        L ${AXIS_X + 8} ${breakY + 4}
        L ${AXIS_X - 8} ${breakY + 8}
      `;
      breakGroup
        .append('path')
        .attr('class', 'timeline-break-zigzag')
        .attr('d', zigzagPath)
        .attr('fill', 'none')
        .attr('stroke', axisBorderColor)
        .attr('stroke-width', 2);

      // Add gap label showing years skipped
      if (gapYears > 10) {
        breakGroup
          .append('text')
          .attr('class', 'timeline-break-label')
          .attr('x', AXIS_X)
          .attr('y', breakY + 20)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'hanging')
          .attr('font-size', '10px')
          .attr('font-style', 'italic')
          .attr('fill', breakTextMuted)
          .text(`~${gapYears} yrs`);
      }
    }

    // Create groups for edges and events
    // Note: edge group is populated by a separate useEffect to avoid re-rendering on selection
    g.append('g').attr('class', 'timeline-edges');
    const eventGroup = g.append('g').attr('class', 'timeline-events');

    // Position events on the timeline
    for (const event of events) {
      event.y = yScale(event.year) + (event.stackOffset ?? 0);
    }

    // Assign events to swim lanes to prevent label overlap
    const laneAssignments = assignLanes(events, LABEL_HEIGHT);

    // Create a map of event positions for edge drawing
    const eventPositions = new Map<string, { x: number; y: number }>();
    for (const event of events) {
      eventPositions.set(event.id, { x: AXIS_X, y: event.y ?? 0 });
    }

    // Note: Edge rendering is handled by a separate useEffect to avoid
    // re-rendering the entire timeline when selection changes.

    // Draw events with alternating labels
    const eventElements = eventGroup
      .selectAll<SVGGElement, TimelineEvent>('.timeline-event')
      .data(events)
      .enter()
      .append('g')
      .attr('class', 'timeline-event')
      .attr('transform', (d) => `translate(${AXIS_X}, ${d.y ?? 0})`)
      .attr('data-id', (d) => d.id)
      .attr('data-node-id', (d) => d.nodeId)
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onNodeClick) {
          onNodeClick(d.originalNode);
        }
      });

    // Get theme-aware colors from CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    const nodeStrokeColor = computedStyle.getPropertyValue('--color-graph-node-stroke').trim() || '#ffffff';
    const graphTextColor = computedStyle.getPropertyValue('--color-graph-text').trim() || '#374151';
    const borderColor = computedStyle.getPropertyValue('--color-border').trim() || '#cbd5e1';
    const textMutedColor = computedStyle.getPropertyValue('--color-text-muted').trim() || '#64748b';

    // Add event markers on the axis
    eventElements
      .append('circle')
      .attr('class', 'timeline-event-marker')
      .attr('r', EVENT_MARKER_SIZE / 2)
      .attr('fill', (d) => getEventColor(d.type, d.nodeType))
      .attr('stroke', nodeStrokeColor)
      .attr('stroke-width', 2);

    // Add connector lines from marker to label (extended to reach outer lanes)
    eventElements
      .append('line')
      .attr('class', 'timeline-event-connector')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d) => {
        const assignment = laneAssignments.get(d.id);
        const baseOffset = d.isLeft ? -LABEL_OFFSET : LABEL_OFFSET;
        // Extend connector to reach label in outer lanes
        return baseOffset + (assignment?.xOffset ?? 0);
      })
      .attr('y2', 0)
      .attr('stroke', borderColor)
      .attr('stroke-width', 1);

    // Add labels using foreignObject for text wrapping (positioned by lane)
    eventElements
      .append('foreignObject')
      .attr('class', 'timeline-event-label-container')
      .attr('x', (d) => {
        const assignment = laneAssignments.get(d.id);
        const baseX = d.isLeft ? -LABEL_WIDTH - LABEL_OFFSET : LABEL_OFFSET;
        // Apply lane offset to position label in correct lane
        return baseX + (assignment?.xOffset ?? 0);
      })
      .attr('y', -20)
      .attr('width', LABEL_WIDTH)
      .attr('height', 50)
      .append('xhtml:div')
      .attr('class', (d) => `timeline-event-label ${d.isLeft ? 'timeline-event-label--left' : 'timeline-event-label--right'}`)
      .on('click', (event, d) => {
        // Handle clicks on the label card to open info box
        event.stopPropagation();
        if (onNodeClick) {
          onNodeClick(d.originalNode);
        }
      })
      .html((d) => {
        const eventLabel = getEventTypeLabel(d.type);
        const yearStr = d.year.toString();
        // SECURITY: All content is from our data model, not user input
        return `<span class="timeline-event-title">${d.title}</span>
                <span class="timeline-event-meta">${eventLabel} ${yearStr}</span>`;
      });

    // Add special marker for death events (hollow circle)
    eventElements
      .filter((d) => d.type === 'death')
      .select('.timeline-event-marker')
      .attr('fill', computedStyle.getPropertyValue('--color-surface').trim() || '#fff')
      .attr('stroke', (d) => getEventColor(d.type, d.nodeType))
      .attr('stroke-width', 3);

    // Draw undated section if there are undated nodes
    if (undatedNodes.length > 0) {
      const undatedY = contentHeight - UNDATED_SECTION_HEIGHT + 30;

      // Separator line
      g.append('line')
        .attr('class', 'timeline-undated-separator')
        .attr('x1', LEFT_MARGIN)
        .attr('x2', contentWidth)
        .attr('y1', undatedY - 20)
        .attr('y2', undatedY - 20)
        .attr('stroke', borderColor)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '8,4');

      // Label
      g.append('text')
        .attr('class', 'timeline-undated-label')
        .attr('x', AXIS_X)
        .attr('y', undatedY - 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('fill', textMutedColor)
        .text('Undated');

      // Position undated nodes in a row below the separator
      const undatedGroup = g.append('g').attr('class', 'timeline-undated-nodes');
      const nodeSpacing = 100;
      const startX = AXIS_X - ((undatedNodes.length - 1) * nodeSpacing) / 2;

      const undatedElements = undatedGroup
        .selectAll<SVGGElement, GraphNode>('.timeline-undated-event')
        .data(undatedNodes)
        .enter()
        .append('g')
        .attr('class', 'timeline-undated-event')
        .attr('transform', (_, i) => `translate(${startX + i * nodeSpacing}, ${undatedY})`)
        .attr('data-node-id', (d) => d.id)
        .on('click', (event, d) => {
          event.stopPropagation();
          if (onNodeClick) {
            onNodeClick(d);
          }
        });

      undatedElements
        .append('circle')
        .attr('class', 'timeline-event-marker')
        .attr('r', EVENT_MARKER_SIZE / 2)
        .attr('fill', (d) => getNodeColor(d.type))
        .attr('stroke', nodeStrokeColor)
        .attr('stroke-width', 2);

      undatedElements
        .append('text')
        .attr('class', 'timeline-undated-node-label')
        .attr('x', 0)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', graphTextColor)
        .text((d) => d.title.length > 15 ? d.title.slice(0, 12) + '...' : d.title);
    }

    // Setup zoom behavior with dynamic tick updates
    let lastGranularity = initialGranularity;
    
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([ZOOM_MIN, ZOOM_MAX])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
        
        // Update zoom scale state
        const newScale = event.transform.k;
        setCurrentZoomScale(newScale);
        
        // Check if granularity should change
        const newGranularity = getTickGranularity(newScale);
        if (newGranularity !== lastGranularity) {
          lastGranularity = newGranularity;
          setCurrentGranularity(newGranularity);
          renderTicks(newGranularity);
        }
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    // Initial zoom to show content at readable size
    const densestSegment = segmentedScale.getDensestSegment();
    const densestMidY = (densestSegment.yStart ?? 50) + 
      ((densestSegment.yEnd ?? 50) - (densestSegment.yStart ?? 50)) / 2;
    
    // Calculate scale that shows events at readable size
    const segmentHeight = (densestSegment.yEnd ?? 50) - (densestSegment.yStart ?? 50);
    const idealScale = Math.min(
      (width * 0.9) / contentWidth,
      height / Math.max(segmentHeight + 100, 300),
      INITIAL_ZOOM_SCALE
    );
    const actualScale = Math.max(idealScale, ZOOM_MIN);
    
    // Position to center on the densest segment
    const initialX = (width - contentWidth * actualScale) / 2;
    const initialY = -(densestMidY - height / (2 * actualScale)) * actualScale;
    
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(initialX, initialY).scale(actualScale)
    );

    // Cleanup
    return () => {
      // No cleanup needed
    };
    // Note: selectedNodeId and selectedEdgeId are intentionally NOT in dependencies
    // because selection highlighting and edge rendering are handled by separate useEffects.
    // Including them here would cause the timeline to re-render on every selection,
    // resetting zoom/pan state.
  }, [
    data,
    dimensions,
    events,
    timelineEdges,
    yearRange,
    undatedNodes,
    datedYears,
    nodeEventMap,
    eventsPerYear,
    onNodeClick,
    onEdgeClick,
  ]);

  // Update edges when selection changes (without re-rendering the whole timeline)
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const edgeGroup = svg.select<SVGGElement>('.timeline-edges');
    
    if (edgeGroup.empty()) return;
    
    // Clear existing edges
    edgeGroup.selectAll('*').remove();

    // Draw edges only for selected node
    if (selectedNodeId) {
      const relevantEdges = timelineEdges.filter(
        (e) => e.sourceNodeId === selectedNodeId || e.targetNodeId === selectedNodeId
      );

      for (const edge of relevantEdges) {
        const sourceEvents = nodeEventMap.get(edge.sourceNodeId);
        const targetEvents = nodeEventMap.get(edge.targetNodeId);
        
        if (!sourceEvents || !targetEvents) continue;
        
        // Get the primary event for each node (birth for persons, or the only event)
        const sourceEvent = sourceEvents.primaryEvent;
        const targetEvent = targetEvents.primaryEvent;
        
        if (!sourceEvent || !targetEvent) continue;
        
        const sourceY = sourceEvent.y ?? 0;
        const targetY = targetEvent.y ?? 0;
        
        // Draw curved edge
        const controlX = AXIS_X + (sourceEvent.isLeft ? -80 : 80);
        
        edgeGroup
          .append('path')
          .attr('class', 'timeline-edge')
          .attr('d', `M ${AXIS_X} ${sourceY} Q ${controlX} ${(sourceY + targetY) / 2} ${AXIS_X} ${targetY}`)
          .attr('fill', 'none')
          .attr('stroke', getEdgeColor(edge.relationship))
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.6)
          .attr('data-id', edge.id)
          .on('click', (clickEvent) => {
            clickEvent.stopPropagation();
            const originalEdge = data.edges.find((e) => e.id === edge.id);
            if (originalEdge && onEdgeClick) {
              onEdgeClick(originalEdge);
            }
          });
      }
    }
  }, [selectedNodeId, timelineEdges, nodeEventMap, data.edges, onEdgeClick]);

  // Update selection highlighting
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Get theme-aware colors from CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    const nodeStrokeColor = computedStyle.getPropertyValue('--color-graph-node-stroke').trim() || '#ffffff';
    const selectedStrokeColor = computedStyle.getPropertyValue('--color-graph-node-stroke-selected').trim() || '#1e293b';

    // Update event selection state
    svg.selectAll('.timeline-event').each(function () {
      const el = d3.select(this);
      const nodeId = el.attr('data-node-id');
      const isSelected = nodeId === selectedNodeId;

      el.select('.timeline-event-marker')
        .attr('stroke', isSelected ? selectedStrokeColor : nodeStrokeColor)
        .attr('stroke-width', isSelected ? 3 : 2);

      el.classed('selected', isSelected);
    });

    // Update undated nodes selection state
    svg.selectAll('.timeline-undated-event').each(function () {
      const el = d3.select(this);
      const nodeId = el.attr('data-node-id');
      const isSelected = nodeId === selectedNodeId;

      el.select('.timeline-event-marker')
        .attr('stroke', isSelected ? selectedStrokeColor : nodeStrokeColor)
        .attr('stroke-width', isSelected ? 3 : 2);

      el.classed('selected', isSelected);
    });

    // Update edge selection state
    svg.selectAll('.timeline-edge').each(function () {
      const el = d3.select(this);
      const edgeId = el.attr('data-id');
      const isSelected = edgeId === selectedEdgeId;

      el.attr('stroke-opacity', isSelected ? 0.9 : 0.6).attr(
        'stroke-width',
        isSelected ? 3 : 2
      );

      el.classed('selected', isSelected);
    });
  }, [selectedNodeId, selectedEdgeId]);

  // Update search highlighting
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const term = searchTerm?.toLowerCase() ?? '';

    // Highlight events matching search
    svg.selectAll<SVGGElement, TimelineEvent>('.timeline-event').each(function (d) {
      const el = d3.select(this);
      const isMatch = term && d.title.toLowerCase().includes(term);

      el.classed('search-match', !!isMatch);
      el.select('.timeline-event-marker').attr('filter', isMatch ? 'url(#timeline-glow)' : null);
    });

    // Dim non-matching elements when searching
    svg.selectAll<SVGGElement, TimelineEvent>('.timeline-event').attr('opacity', (d) => {
      if (!term) return 1;
      return d.title.toLowerCase().includes(term) ? 1 : 0.3;
    });

    // Also handle undated nodes
    svg.selectAll<SVGGElement, GraphNode>('.timeline-undated-event').attr('opacity', (d) => {
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
    if (!svgRef.current || !zoomRef.current || !segmentedScaleRef.current) return;
    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Use the stored segmented scale
    const segmentedScale = segmentedScaleRef.current;
    const contentWidth = AXIS_X + (LANE_WIDTH * MAX_LANES) + 100;

    // Focus on the densest segment
    const densestSegment = segmentedScale.getDensestSegment();
    const densestMidY = (densestSegment.yStart ?? 50) + 
      ((densestSegment.yEnd ?? 50) - (densestSegment.yStart ?? 50)) / 2;

    // Calculate scale that shows events at readable size
    const segmentHeight = (densestSegment.yEnd ?? 50) - (densestSegment.yStart ?? 50);
    const idealScale = Math.min(
      (width * 0.9) / contentWidth,
      height / Math.max(segmentHeight + 100, 300),
      INITIAL_ZOOM_SCALE
    );
    const actualScale = Math.max(idealScale, ZOOM_MIN);
    
    // Position to center on the densest segment
    const initialX = (width - contentWidth * actualScale) / 2;
    const initialY = -(densestMidY - height / (2 * actualScale)) * actualScale;

    svg
      .transition()
      .duration(500)
      .call(
        zoomRef.current.transform,
        d3.zoomIdentity.translate(initialX, initialY).scale(actualScale)
      );
  }, [dimensions]);

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

      {/* Zoom indicator showing current granularity */}
      <div className="timeline-layout__zoom-indicator">
        {currentZoomScale.toFixed(1)}x &middot; {currentGranularity}s
      </div>

      {/* Legend - Event types and node colors */}
      <div className="timeline-layout__legend">
        <div className="timeline-layout__legend-title">Event Types</div>
        <div className="timeline-layout__legend-item">
          <svg width="16" height="16" viewBox="-10 -10 20 20">
            <circle r="5" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
          </svg>
          <span>Birth (Person)</span>
        </div>
        <div className="timeline-layout__legend-item">
          <svg width="16" height="16" viewBox="-10 -10 20 20">
            <circle r="5" fill="#fff" stroke="#3b82f6" strokeWidth="3" />
          </svg>
          <span>Death (Person)</span>
        </div>
        <div className="timeline-layout__legend-item">
          <svg width="16" height="16" viewBox="-10 -10 20 20">
            <circle r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
          </svg>
          <span>Created (Object)</span>
        </div>
        <div className="timeline-layout__legend-item">
          <svg width="16" height="16" viewBox="-10 -10 20 20">
            <circle r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
          </svg>
          <span>Founded (Location)</span>
        </div>
        <div className="timeline-layout__legend-item">
          <svg width="16" height="16" viewBox="-10 -10 20 20">
            <circle r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
          </svg>
          <span>Founded (Entity)</span>
        </div>
      </div>
    </div>
  );
}

export default TimelineLayout;
