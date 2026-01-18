/**
 * Timeline segmentation utilities for gap detection and piecewise scaling
 * 
 * When timeline data has large gaps (e.g., one node at 1378, most data 1489-1652),
 * this module detects those gaps and creates a segmented scale that compresses
 * empty periods while preserving proportional spacing within active periods.
 */

/**
 * A segment of the timeline containing continuous data
 */
export interface TimelineSegment {
  /** First year in the segment */
  yearStart: number;
  /** Last year in the segment */
  yearEnd: number;
  /** Number of data points (nodes) in this segment */
  dataPoints: number;
  /** Pixel Y position where this segment starts */
  yStart?: number;
  /** Pixel Y position where this segment ends */
  yEnd?: number;
}

/**
 * Result of creating a segmented timeline scale
 */
export interface SegmentedScale {
  /** The detected segments */
  segments: TimelineSegment[];
  /** Threshold used for gap detection */
  gapThreshold: number;
  /** Convert a year to a Y pixel position */
  toY: (year: number) => number;
  /** Convert a Y pixel position back to a year (approximate) */
  fromY: (y: number) => number;
  /** Get Y positions of break indicators between segments */
  getSegmentBreaks: () => Array<{ y: number; gapYears: number; yearBefore: number; yearAfter: number }>;
  /** Get the segment with the most data points */
  getDensestSegment: () => TimelineSegment;
  /** Check if a single linear scale would be more appropriate */
  isSingleSegment: boolean;
}

/**
 * Configuration for segmented scale creation
 */
export interface SegmentConfig {
  /** Years without data to trigger a segment break (default: 40) */
  gapThreshold?: number;
  /** Minimum pixel height per segment (default: 100) */
  minSegmentHeight?: number;
  /** Height reserved for break indicators (default: 30) */
  breakIndicatorHeight?: number;
  /** Top padding in pixels (default: 50) */
  topPadding?: number;
  /** Bottom padding in pixels (default: 50) */
  bottomPadding?: number;
  /** Map of year to event count for density-aware height allocation */
  eventsPerYear?: Map<number, number>;
  /** Pixels per event when calculating density-based height (default: 24) */
  pixelsPerEvent?: number;
}

const DEFAULT_CONFIG: Required<Omit<SegmentConfig, 'eventsPerYear'>> & { eventsPerYear?: Map<number, number> } = {
  gapThreshold: 40,
  minSegmentHeight: 100,
  breakIndicatorHeight: 30,
  topPadding: 50,
  bottomPadding: 50,
  pixelsPerEvent: 24,
};

/**
 * Detect segments in a list of years based on gap threshold
 * 
 * @param years Array of years (will be sorted internally)
 * @param gapThreshold Minimum gap to trigger a new segment
 * @returns Array of segments with year ranges and data point counts
 */
export function detectSegments(
  years: number[],
  gapThreshold: number = DEFAULT_CONFIG.gapThreshold
): TimelineSegment[] {
  if (years.length === 0) {
    return [];
  }

  // Sort years and count occurrences
  const sortedYears = [...years].sort((a, b) => a - b);
  
  const segments: TimelineSegment[] = [];
  let currentSegment: TimelineSegment = {
    yearStart: sortedYears[0],
    yearEnd: sortedYears[0],
    dataPoints: 1,
  };

  for (let i = 1; i < sortedYears.length; i++) {
    const year = sortedYears[i];
    const gap = year - currentSegment.yearEnd;

    if (gap > gapThreshold) {
      // Gap detected - close current segment and start new one
      segments.push(currentSegment);
      currentSegment = {
        yearStart: year,
        yearEnd: year,
        dataPoints: 1,
      };
    } else {
      // Extend current segment
      currentSegment.yearEnd = year;
      currentSegment.dataPoints++;
    }
  }

  // Don't forget the last segment
  segments.push(currentSegment);

  return segments;
}

/**
 * Find the segment with the most data points
 */
export function findDensestSegment(segments: TimelineSegment[]): TimelineSegment {
  if (segments.length === 0) {
    throw new Error('Cannot find densest segment from empty array');
  }

  return segments.reduce((densest, segment) => 
    segment.dataPoints > densest.dataPoints ? segment : densest
  );
}

/**
 * Calculate the minimum height required for a segment based on event density.
 * This ensures years with many events have enough vertical space for stacked events.
 * 
 * @param segment The timeline segment
 * @param eventsPerYear Map of year to event count
 * @param pixelsPerEvent Pixels required per event for stacking
 * @returns Minimum height in pixels based on the densest year in the segment
 */
function getSegmentDensityHeight(
  segment: TimelineSegment,
  eventsPerYear: Map<number, number> | undefined,
  pixelsPerEvent: number
): number {
  if (!eventsPerYear || eventsPerYear.size === 0) {
    return 0;
  }

  // Find the maximum events in any single year within this segment
  let maxEventsInYear = 0;
  for (let year = segment.yearStart; year <= segment.yearEnd; year++) {
    const eventCount = eventsPerYear.get(year) ?? 0;
    maxEventsInYear = Math.max(maxEventsInYear, eventCount);
  }

  // Calculate minimum height: we need space for max events stacked,
  // multiplied by the number of years (proportionally)
  // But we use a simpler heuristic: ensure the densest year has enough space
  // and scale based on year span
  const yearSpan = Math.max(segment.yearEnd - segment.yearStart, 1);
  
  // Height needed for the densest year's events (stacked in pairs left/right)
  const densestYearHeight = Math.ceil(maxEventsInYear / 2) * pixelsPerEvent;
  
  // Scale by number of years to give proportional space
  // Use at least densestYearHeight * (1 + log2(yearSpan)) to allow spreading
  return densestYearHeight * Math.max(1, Math.ceil(Math.log2(yearSpan + 1)));
}

/**
 * Create a segmented scale for timeline positioning
 * 
 * @param years Array of years with data
 * @param totalHeight Total available pixel height for the timeline
 * @param config Configuration options
 * @returns SegmentedScale object with conversion functions
 */
export function createSegmentedScale(
  years: number[],
  totalHeight: number,
  config: SegmentConfig = {}
): SegmentedScale {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  
  // Detect segments
  const segments = detectSegments(years, cfg.gapThreshold);
  
  // Handle edge cases
  if (segments.length === 0) {
    // No data - return a dummy scale
    return createFallbackScale(1600, 2000, totalHeight, cfg);
  }

  if (segments.length === 1) {
    // Single segment - use simple linear scale (no breaks needed)
    const seg = segments[0];
    return createSingleSegmentScale(seg, totalHeight, cfg, config.eventsPerYear, cfg.pixelsPerEvent);
  }

  // Multiple segments - create piecewise scale
  return createPiecewiseScale(segments, totalHeight, cfg, config.eventsPerYear, cfg.pixelsPerEvent);
}

/**
 * Create a fallback scale when no data exists
 */
function createFallbackScale(
  minYear: number,
  maxYear: number,
  totalHeight: number,
  cfg: Required<Omit<SegmentConfig, 'eventsPerYear'>> & { eventsPerYear?: Map<number, number> }
): SegmentedScale {
  const usableHeight = totalHeight - cfg.topPadding - cfg.bottomPadding;
  const yearSpan = maxYear - minYear;

  const dummySegment: TimelineSegment = {
    yearStart: minYear,
    yearEnd: maxYear,
    dataPoints: 0,
    yStart: cfg.topPadding,
    yEnd: cfg.topPadding + usableHeight,
  };

  return {
    segments: [dummySegment],
    gapThreshold: cfg.gapThreshold,
    toY: (year: number) => {
      const t = (year - minYear) / yearSpan;
      return cfg.topPadding + t * usableHeight;
    },
    fromY: (y: number) => {
      const t = (y - cfg.topPadding) / usableHeight;
      return minYear + t * yearSpan;
    },
    getSegmentBreaks: () => [],
    getDensestSegment: () => dummySegment,
    isSingleSegment: true,
  };
}

/**
 * Create a scale for a single segment (no gaps)
 */
function createSingleSegmentScale(
  segment: TimelineSegment,
  totalHeight: number,
  cfg: Required<Omit<SegmentConfig, 'eventsPerYear'>> & { eventsPerYear?: Map<number, number> },
  eventsPerYear?: Map<number, number>,
  pixelsPerEvent: number = 24
): SegmentedScale {
  // Calculate density-based minimum height
  const densityHeight = getSegmentDensityHeight(segment, eventsPerYear, pixelsPerEvent);
  
  // Use the larger of: available height or density-required height
  const baseUsableHeight = totalHeight - cfg.topPadding - cfg.bottomPadding;
  const usableHeight = Math.max(baseUsableHeight, densityHeight);
  const yearSpan = Math.max(segment.yearEnd - segment.yearStart, 1);

  const positionedSegment: TimelineSegment = {
    ...segment,
    yStart: cfg.topPadding,
    yEnd: cfg.topPadding + usableHeight,
  };

  return {
    segments: [positionedSegment],
    gapThreshold: cfg.gapThreshold,
    toY: (year: number) => {
      const t = (year - segment.yearStart) / yearSpan;
      return cfg.topPadding + t * usableHeight;
    },
    fromY: (y: number) => {
      const t = (y - cfg.topPadding) / usableHeight;
      return segment.yearStart + t * yearSpan;
    },
    getSegmentBreaks: () => [],
    getDensestSegment: () => positionedSegment,
    isSingleSegment: true,
  };
}

/**
 * Create a piecewise scale for multiple segments with gaps
 */
function createPiecewiseScale(
  segments: TimelineSegment[],
  totalHeight: number,
  cfg: Required<Omit<SegmentConfig, 'eventsPerYear'>> & { eventsPerYear?: Map<number, number> },
  eventsPerYear?: Map<number, number>,
  pixelsPerEvent: number = 24
): SegmentedScale {
  const breakCount = segments.length - 1;
  const totalBreakHeight = breakCount * cfg.breakIndicatorHeight;
  const baseUsableHeight = totalHeight - cfg.topPadding - cfg.bottomPadding - totalBreakHeight;

  // Calculate total year span across all segments
  const totalYearSpan = segments.reduce(
    (sum, seg) => sum + Math.max(seg.yearEnd - seg.yearStart, 1),
    0
  );

  // Allocate height to each segment proportionally, considering both year span AND event density
  const segmentHeights: number[] = [];
  let allocatedHeight = 0;

  for (const segment of segments) {
    const segmentSpan = Math.max(segment.yearEnd - segment.yearStart, 1);
    const proportionalHeight = (segmentSpan / totalYearSpan) * baseUsableHeight;
    
    // Calculate density-based minimum for this segment
    const densityHeight = getSegmentDensityHeight(segment, eventsPerYear, pixelsPerEvent);
    
    // Use the maximum of: proportional height, density height, or config minimum
    const height = Math.max(proportionalHeight, densityHeight, cfg.minSegmentHeight);
    segmentHeights.push(height);
    allocatedHeight += height;
  }

  // Note: We DON'T scale down if we exceed available height - we allow the timeline
  // to be taller than the viewport to accommodate dense years. This is intentional
  // as the user can scroll/pan to navigate.

  // Assign Y positions to segments
  const positionedSegments: TimelineSegment[] = [];
  let currentY = cfg.topPadding;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const height = segmentHeights[i];

    positionedSegments.push({
      ...segment,
      yStart: currentY,
      yEnd: currentY + height,
    });

    currentY += height;
    
    // Add break space after each segment except the last
    if (i < segments.length - 1) {
      currentY += cfg.breakIndicatorHeight;
    }
  }

  // Build the toY function
  const toY = (year: number): number => {
    // Find which segment this year belongs to
    for (const seg of positionedSegments) {
      if (year <= seg.yearEnd) {
        // Year is in or before this segment
        if (year < seg.yearStart) {
          // Year is before this segment - clamp to segment start
          return seg.yStart!;
        }
        // Year is within this segment
        const segmentSpan = Math.max(seg.yearEnd - seg.yearStart, 1);
        const t = (year - seg.yearStart) / segmentSpan;
        return seg.yStart! + t * (seg.yEnd! - seg.yStart!);
      }
    }
    // Year is after all segments - return end of last segment
    const lastSeg = positionedSegments[positionedSegments.length - 1];
    return lastSeg.yEnd!;
  };

  // Build the fromY function (approximate inverse)
  const fromY = (y: number): number => {
    for (const seg of positionedSegments) {
      if (y <= seg.yEnd!) {
        if (y < seg.yStart!) {
          return seg.yearStart;
        }
        const t = (y - seg.yStart!) / (seg.yEnd! - seg.yStart!);
        const segmentSpan = seg.yearEnd - seg.yearStart;
        return seg.yearStart + t * segmentSpan;
      }
    }
    const lastSeg = positionedSegments[positionedSegments.length - 1];
    return lastSeg.yearEnd;
  };

  // Get break positions
  const getSegmentBreaks = () => {
    const breaks: Array<{ y: number; gapYears: number; yearBefore: number; yearAfter: number }> = [];
    
    for (let i = 0; i < positionedSegments.length - 1; i++) {
      const currentSeg = positionedSegments[i];
      const nextSeg = positionedSegments[i + 1];
      
      breaks.push({
        y: currentSeg.yEnd! + cfg.breakIndicatorHeight / 2,
        gapYears: nextSeg.yearStart - currentSeg.yearEnd,
        yearBefore: currentSeg.yearEnd,
        yearAfter: nextSeg.yearStart,
      });
    }
    
    return breaks;
  };

  return {
    segments: positionedSegments,
    gapThreshold: cfg.gapThreshold,
    toY,
    fromY,
    getSegmentBreaks,
    getDensestSegment: () => findDensestSegment(positionedSegments),
    isSingleSegment: false,
  };
}

/**
 * Tick granularity levels for zoom-dependent axis rendering
 */
export type TickGranularity = 'decade' | 'year' | 'month' | 'day';

/**
 * Information about a single axis tick
 */
export interface TickInfo {
  /** Decimal year value for positioning */
  value: number;
  /** Display label */
  label: string;
  /** Whether this is a major tick (emphasized) */
  isMajor: boolean;
  /** The granularity level of this tick */
  granularity: TickGranularity;
}

/**
 * Determine the appropriate tick granularity based on zoom scale
 * 
 * @param zoomScale Current zoom scale factor
 * @returns The granularity to use for axis ticks
 */
export function getTickGranularity(zoomScale: number): TickGranularity {
  if (zoomScale < 0.8) return 'decade';
  if (zoomScale < 2.0) return 'year';
  if (zoomScale < 4.0) return 'month';
  return 'day';
}

/**
 * Month names for axis labels
 */
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Convert year, month, day to decimal year for precise positioning
 * 
 * @param year Full year
 * @param month Month (1-12), defaults to 1
 * @param day Day (1-31), defaults to 1
 * @returns Decimal year (e.g., 1789.5 for July 1789)
 */
export function dateToDecimalYear(year: number, month: number = 1, day: number = 1): number {
  // Clamp month and day to valid ranges
  const m = Math.max(1, Math.min(12, month));
  const d = Math.max(1, Math.min(31, day));
  
  // Calculate day of year (approximate, ignoring leap years for simplicity)
  const daysInMonths = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const dayOfYear = daysInMonths[m - 1] + d;
  
  return year + (dayOfYear - 1) / 365;
}

/**
 * Generate axis ticks for a year range at the specified granularity
 * 
 * @param yearStart Start year (inclusive)
 * @param yearEnd End year (inclusive)
 * @param granularity Tick granularity level
 * @returns Array of tick information
 */
export function generateTicks(
  yearStart: number,
  yearEnd: number,
  granularity: TickGranularity
): TickInfo[] {
  const ticks: TickInfo[] = [];
  
  switch (granularity) {
    case 'decade': {
      const startDecade = Math.floor(yearStart / 10) * 10;
      const endDecade = Math.ceil(yearEnd / 10) * 10;
      
      for (let year = startDecade; year <= endDecade; year += 10) {
        if (year >= yearStart && year <= yearEnd) {
          ticks.push({
            value: year,
            label: `${year}`,
            isMajor: year % 100 === 0,
            granularity: 'decade',
          });
        }
      }
      break;
    }
    
    case 'year': {
      for (let year = Math.floor(yearStart); year <= Math.ceil(yearEnd); year++) {
        ticks.push({
          value: year,
          label: `${year}`,
          isMajor: year % 10 === 0,
          granularity: 'year',
        });
      }
      break;
    }
    
    case 'month': {
      for (let year = Math.floor(yearStart); year <= Math.ceil(yearEnd); year++) {
        for (let month = 1; month <= 12; month++) {
          const decimalYear = dateToDecimalYear(year, month, 1);
          if (decimalYear >= yearStart && decimalYear <= yearEnd) {
            ticks.push({
              value: decimalYear,
              label: month === 1 ? `${year}` : MONTH_NAMES[month - 1],
              isMajor: month === 1,
              granularity: 'month',
            });
          }
        }
      }
      break;
    }
    
    case 'day': {
      // For day-level, only generate a reasonable subset to avoid performance issues
      // Show every day but only label 1st, 10th, 20th
      const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      
      for (let year = Math.floor(yearStart); year <= Math.ceil(yearEnd); year++) {
        for (let month = 1; month <= 12; month++) {
          const daysInMonth = daysPerMonth[month - 1];
          for (let day = 1; day <= daysInMonth; day++) {
            const decimalYear = dateToDecimalYear(year, month, day);
            if (decimalYear >= yearStart && decimalYear <= yearEnd) {
              const isFirstOfMonth = day === 1;
              const isLabelDay = day === 1 || day === 10 || day === 20;
              
              let label = '';
              if (isFirstOfMonth) {
                label = month === 1 ? `${year}` : MONTH_NAMES[month - 1];
              } else if (isLabelDay) {
                label = `${day}`;
              }
              
              ticks.push({
                value: decimalYear,
                label,
                isMajor: isFirstOfMonth,
                granularity: 'day',
              });
            }
          }
        }
      }
      break;
    }
  }
  
  return ticks;
}
