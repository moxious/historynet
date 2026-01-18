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
}

const DEFAULT_CONFIG: Required<SegmentConfig> = {
  gapThreshold: 40,
  minSegmentHeight: 100,
  breakIndicatorHeight: 30,
  topPadding: 50,
  bottomPadding: 50,
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
    return createSingleSegmentScale(seg, totalHeight, cfg);
  }

  // Multiple segments - create piecewise scale
  return createPiecewiseScale(segments, totalHeight, cfg);
}

/**
 * Create a fallback scale when no data exists
 */
function createFallbackScale(
  minYear: number,
  maxYear: number,
  totalHeight: number,
  cfg: Required<SegmentConfig>
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
  cfg: Required<SegmentConfig>
): SegmentedScale {
  const usableHeight = totalHeight - cfg.topPadding - cfg.bottomPadding;
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
  cfg: Required<SegmentConfig>
): SegmentedScale {
  const breakCount = segments.length - 1;
  const totalBreakHeight = breakCount * cfg.breakIndicatorHeight;
  const usableHeight = totalHeight - cfg.topPadding - cfg.bottomPadding - totalBreakHeight;

  // Calculate total year span across all segments
  const totalYearSpan = segments.reduce(
    (sum, seg) => sum + Math.max(seg.yearEnd - seg.yearStart, 1),
    0
  );

  // Allocate height to each segment proportionally, with minimum
  const segmentHeights: number[] = [];
  let allocatedHeight = 0;

  for (const segment of segments) {
    const segmentSpan = Math.max(segment.yearEnd - segment.yearStart, 1);
    const proportionalHeight = (segmentSpan / totalYearSpan) * usableHeight;
    const height = Math.max(proportionalHeight, cfg.minSegmentHeight);
    segmentHeights.push(height);
    allocatedHeight += height;
  }

  // If we exceeded available height due to minimums, scale down
  if (allocatedHeight > usableHeight) {
    const scaleFactor = usableHeight / allocatedHeight;
    for (let i = 0; i < segmentHeights.length; i++) {
      segmentHeights[i] *= scaleFactor;
    }
  }

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
