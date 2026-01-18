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
  /** Minimum height per year in pixels (default: 30) */
  minYearHeight?: number;
  /** Number of events that can fit in a single row (left + right, default: 2) */
  eventsPerRow?: number;
}

/**
 * Per-year height allocation map for density-aware vertical scaling.
 * Each year gets vertical pixels proportional to its event count.
 */
export interface YearHeightMap {
  /** Year to cumulative Y start position */
  yearToYStart: Map<number, number>;
  /** Year to Y end position (start + height) */
  yearToYEnd: Map<number, number>;
  /** Total content height (excluding padding) */
  totalHeight: number;
  /** Get the height allocated to a specific year */
  getYearHeight: (year: number) => number;
}

/**
 * Configuration for per-year height map creation
 */
export interface YearHeightConfig {
  /** Minimum height per year in pixels (for empty or sparse years) */
  minYearHeight: number;
  /** Pixels per row of events (typically LABEL_HEIGHT) */
  pixelsPerEventRow: number;
  /** Number of events that fit side-by-side per row (left + right = 2) */
  eventsPerRow: number;
  /** Top padding before first year */
  topPadding: number;
}

/**
 * Create a per-year height allocation map based on event density.
 * Dense years get more vertical space to accommodate stacked events.
 * 
 * @param yearStart First year to include
 * @param yearEnd Last year to include
 * @param eventsPerYear Map of year to event count
 * @param config Height configuration
 * @returns YearHeightMap with position lookups
 */
export function createPerYearHeightMap(
  yearStart: number,
  yearEnd: number,
  eventsPerYear: Map<number, number>,
  config: YearHeightConfig
): YearHeightMap {
  const yearToYStart = new Map<number, number>();
  const yearToYEnd = new Map<number, number>();
  const yearHeights = new Map<number, number>();

  let currentY = config.topPadding;

  // Calculate height for each year based on event density
  for (let year = yearStart; year <= yearEnd; year++) {
    const eventCount = eventsPerYear.get(year) ?? 0;
    // Calculate rows needed (events distributed left/right)
    const rowsNeeded = Math.ceil(eventCount / config.eventsPerRow);
    // Each year gets at least minYearHeight, or enough for all event rows
    const yearHeight = Math.max(
      config.minYearHeight,
      rowsNeeded * config.pixelsPerEventRow
    );

    yearHeights.set(year, yearHeight);
    yearToYStart.set(year, currentY);
    yearToYEnd.set(year, currentY + yearHeight);
    currentY += yearHeight;
  }

  const totalHeight = currentY - config.topPadding;

  return {
    yearToYStart,
    yearToYEnd,
    totalHeight,
    getYearHeight: (year: number) => yearHeights.get(year) ?? config.minYearHeight,
  };
}

const DEFAULT_CONFIG: Required<Omit<SegmentConfig, 'eventsPerYear'>> & { eventsPerYear?: Map<number, number> } = {
  gapThreshold: 40,
  minSegmentHeight: 100,
  breakIndicatorHeight: 30,
  topPadding: 50,
  bottomPadding: 50,
  pixelsPerEvent: 24,
  minYearHeight: 30,
  eventsPerRow: 2,
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
 * Create a scale for a single segment (no gaps) using per-year height allocation
 */
function createSingleSegmentScale(
  segment: TimelineSegment,
  _totalHeight: number, // Not used - height is calculated from per-year allocation
  cfg: Required<Omit<SegmentConfig, 'eventsPerYear'>> & { eventsPerYear?: Map<number, number> },
  eventsPerYear?: Map<number, number>,
  pixelsPerEvent: number = 24
): SegmentedScale {
  // Create per-year height map for density-aware vertical spacing
  const yearHeightMap = createPerYearHeightMap(
    segment.yearStart,
    segment.yearEnd,
    eventsPerYear ?? new Map(),
    {
      minYearHeight: cfg.minYearHeight,
      pixelsPerEventRow: pixelsPerEvent,
      eventsPerRow: cfg.eventsPerRow,
      topPadding: cfg.topPadding,
    }
  );

  // Total height is the sum of all year heights plus padding
  const usableHeight = yearHeightMap.totalHeight;

  const positionedSegment: TimelineSegment = {
    ...segment,
    yStart: cfg.topPadding,
    yEnd: cfg.topPadding + usableHeight,
  };

  // Build toY function using per-year height allocation
  const toY = (year: number): number => {
    // Clamp to segment bounds
    if (year < segment.yearStart) {
      return cfg.topPadding;
    }
    if (year > segment.yearEnd) {
      return cfg.topPadding + usableHeight;
    }

    // Get the floor year and interpolate within it for sub-year precision
    const floorYear = Math.floor(year);
    const fraction = year - floorYear;

    // Clamp floor year to valid range
    const clampedFloorYear = Math.max(segment.yearStart, Math.min(segment.yearEnd, floorYear));
    
    const yStart = yearHeightMap.yearToYStart.get(clampedFloorYear) ?? cfg.topPadding;
    const yEnd = yearHeightMap.yearToYEnd.get(clampedFloorYear) ?? yStart;

    // Interpolate within the year's allocated space
    return yStart + fraction * (yEnd - yStart);
  };

  // Build fromY function (approximate inverse)
  const fromY = (y: number): number => {
    // Search through years to find which one contains this Y position
    for (let year = segment.yearStart; year <= segment.yearEnd; year++) {
      const yEnd = yearHeightMap.yearToYEnd.get(year);
      if (yEnd !== undefined && y <= yEnd) {
        const yStart = yearHeightMap.yearToYStart.get(year) ?? cfg.topPadding;
        const yearHeight = yEnd - yStart;
        if (yearHeight > 0) {
          const fraction = (y - yStart) / yearHeight;
          return year + Math.max(0, Math.min(1, fraction));
        }
        return year;
      }
    }
    return segment.yearEnd;
  };

  return {
    segments: [positionedSegment],
    gapThreshold: cfg.gapThreshold,
    toY,
    fromY,
    getSegmentBreaks: () => [],
    getDensestSegment: () => positionedSegment,
    isSingleSegment: true,
  };
}

/**
 * Create a piecewise scale for multiple segments with gaps, using per-year height allocation
 */
function createPiecewiseScale(
  segments: TimelineSegment[],
  _totalHeight: number, // Not used - height is calculated from per-year allocation
  cfg: Required<Omit<SegmentConfig, 'eventsPerYear'>> & { eventsPerYear?: Map<number, number> },
  eventsPerYear?: Map<number, number>,
  pixelsPerEvent: number = 24
): SegmentedScale {
  // Create per-year height maps for each segment
  const segmentYearMaps: YearHeightMap[] = [];
  
  let currentY = cfg.topPadding;

  // Build positioned segments with per-year height allocation
  const positionedSegments: TimelineSegment[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    
    // Create per-year height map for this segment, starting at currentY
    const yearHeightMap = createPerYearHeightMap(
      segment.yearStart,
      segment.yearEnd,
      eventsPerYear ?? new Map(),
      {
        minYearHeight: cfg.minYearHeight,
        pixelsPerEventRow: pixelsPerEvent,
        eventsPerRow: cfg.eventsPerRow,
        topPadding: currentY,
      }
    );

    segmentYearMaps.push(yearHeightMap);

    // Ensure minimum segment height
    const segmentHeight = Math.max(yearHeightMap.totalHeight, cfg.minSegmentHeight);

    positionedSegments.push({
      ...segment,
      yStart: currentY,
      yEnd: currentY + segmentHeight,
    });

    currentY += segmentHeight;
    
    // Add break space after each segment except the last
    if (i < segments.length - 1) {
      currentY += cfg.breakIndicatorHeight;
    }
  }

  // Build the toY function using per-year height allocation
  const toY = (year: number): number => {
    // Find which segment this year belongs to
    for (let i = 0; i < positionedSegments.length; i++) {
      const seg = positionedSegments[i];
      const yearMap = segmentYearMaps[i];

      if (year <= seg.yearEnd) {
        // Year is in or before this segment
        if (year < seg.yearStart) {
          // Year is before this segment - clamp to segment start
          return seg.yStart!;
        }

        // Year is within this segment - use per-year positioning
        const floorYear = Math.floor(year);
        const fraction = year - floorYear;

        // Clamp floor year to segment bounds
        const clampedFloorYear = Math.max(seg.yearStart, Math.min(seg.yearEnd, floorYear));
        
        const yStart = yearMap.yearToYStart.get(clampedFloorYear) ?? seg.yStart!;
        const yEnd = yearMap.yearToYEnd.get(clampedFloorYear) ?? yStart;

        // Interpolate within the year's allocated space
        return yStart + fraction * (yEnd - yStart);
      }
    }
    // Year is after all segments - return end of last segment
    const lastSeg = positionedSegments[positionedSegments.length - 1];
    return lastSeg.yEnd!;
  };

  // Build the fromY function (approximate inverse)
  const fromY = (y: number): number => {
    for (let i = 0; i < positionedSegments.length; i++) {
      const seg = positionedSegments[i];
      const yearMap = segmentYearMaps[i];

      if (y <= seg.yEnd!) {
        if (y < seg.yStart!) {
          return seg.yearStart;
        }

        // Search through years in this segment
        for (let year = seg.yearStart; year <= seg.yearEnd; year++) {
          const yEnd = yearMap.yearToYEnd.get(year);
          if (yEnd !== undefined && y <= yEnd) {
            const yStart = yearMap.yearToYStart.get(year) ?? seg.yStart!;
            const yearHeight = yEnd - yStart;
            if (yearHeight > 0) {
              const fraction = (y - yStart) / yearHeight;
              return year + Math.max(0, Math.min(1, fraction));
            }
            return year;
          }
        }
        return seg.yearEnd;
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
