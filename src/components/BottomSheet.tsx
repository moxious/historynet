/**
 * BottomSheet - Draggable bottom sheet component for mobile
 * 
 * A mobile-native pattern for displaying content in a sheet that slides up
 * from the bottom. Users can drag to expand, collapse, or dismiss.
 * 
 * Features:
 * - Three snap points: hidden, peek (100px), expanded (60% of viewport)
 * - Touch gesture support with velocity-based momentum
 * - Smooth spring animations between states
 * - Content scrolling when expanded
 * - Safe area inset support for iPhone home indicator
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import './BottomSheet.css';

export type BottomSheetState = 'hidden' | 'peek' | 'expanded';

interface BottomSheetProps {
  /** Whether the sheet should be visible (controls hidden state) */
  isOpen: boolean;
  /** Callback when sheet is dismissed (swiped down from peek) */
  onClose: () => void;
  /** Title displayed in the sheet header */
  title?: string;
  /** Content to display in the sheet */
  children: React.ReactNode;
  /** Initial state when opened */
  initialState?: 'peek' | 'expanded';
  /** Optional CSS class name */
  className?: string;
}

/** Heights for each snap point */
const SNAP_HEIGHTS = {
  hidden: 0,
  peek: 100,
  expanded: 0.6, // 60% of viewport
};

/** Velocity threshold for flick gestures (pixels/ms) */
const FLICK_VELOCITY_THRESHOLD = 0.5;

/** Minimum drag distance to trigger state change */
const DRAG_THRESHOLD = 50;

function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  initialState = 'peek',
  className = '',
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<BottomSheetState>('hidden');
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Track touch/drag state
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);
  const currentY = useRef(0);
  const lastState = useRef<BottomSheetState>('hidden');

  // Calculate the height for current state
  const getHeightForState = useCallback((s: BottomSheetState): number => {
    if (s === 'hidden') return 0;
    if (s === 'peek') return SNAP_HEIGHTS.peek;
    // expanded = 60% of viewport
    return window.innerHeight * SNAP_HEIGHTS.expanded;
  }, []);

  // Update state when isOpen changes
  useEffect(() => {
    if (isOpen && state === 'hidden') {
      setState(initialState);
    } else if (!isOpen && state !== 'hidden') {
      setState('hidden');
    }
  }, [isOpen, initialState, state]);

  // Reset drag offset when state changes
  useEffect(() => {
    setDragOffset(0);
  }, [state]);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Don't capture if scrolling content
    const target = e.target as HTMLElement;
    if (contentRef.current?.contains(target) && state === 'expanded') {
      const scrollTop = contentRef.current.scrollTop;
      // Only allow dragging from top of scrollable content
      if (scrollTop > 0) return;
    }

    dragStartY.current = e.touches[0].clientY;
    dragStartTime.current = Date.now();
    currentY.current = dragStartY.current;
    lastState.current = state;
    setIsDragging(true);
  }, [state]);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;

    currentY.current = e.touches[0].clientY;
    const delta = currentY.current - dragStartY.current;

    // Only allow dragging down from expanded when at top of scroll
    if (state === 'expanded' && contentRef.current) {
      const scrollTop = contentRef.current.scrollTop;
      if (scrollTop > 0 && delta < 0) return;
    }

    setDragOffset(delta);
  }, [isDragging, state]);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const delta = currentY.current - dragStartY.current;
    const elapsed = Date.now() - dragStartTime.current;
    const velocity = delta / elapsed; // pixels per ms

    let nextState: BottomSheetState = state;

    // Check for flick gesture
    if (Math.abs(velocity) > FLICK_VELOCITY_THRESHOLD) {
      if (velocity > 0) {
        // Swiped down
        if (state === 'expanded') {
          nextState = 'peek';
        } else if (state === 'peek') {
          nextState = 'hidden';
          onClose();
        }
      } else {
        // Swiped up
        if (state === 'peek') {
          nextState = 'expanded';
        }
      }
    } else if (Math.abs(delta) > DRAG_THRESHOLD) {
      // Check for significant drag
      if (delta > 0) {
        // Dragged down
        if (state === 'expanded') {
          nextState = 'peek';
        } else if (state === 'peek') {
          nextState = 'hidden';
          onClose();
        }
      } else {
        // Dragged up
        if (state === 'peek') {
          nextState = 'expanded';
        }
      }
    }

    setState(nextState);
    setDragOffset(0);
  }, [isDragging, state, onClose]);

  // Handle close button click
  const handleClose = useCallback(() => {
    setState('hidden');
    onClose();
  }, [onClose]);

  // Calculate current transform
  const currentHeight = getHeightForState(state);
  const translateY = state === 'hidden' ? '100%' : `calc(100% - ${currentHeight + dragOffset}px)`;

  if (state === 'hidden' && !isDragging) {
    return null;
  }

  return (
    <div
      ref={sheetRef}
      className={`bottom-sheet ${state !== 'hidden' ? 'bottom-sheet--visible' : ''} ${isDragging ? 'bottom-sheet--dragging' : ''} ${className}`}
      style={{
        transform: `translateY(${translateY})`,
        height: state === 'expanded' ? `${SNAP_HEIGHTS.expanded * 100}%` : 'auto',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Details'}
    >
      {/* Drag handle */}
      <div className="bottom-sheet__handle-area">
        <div className="bottom-sheet__handle" aria-hidden="true" />
      </div>

      {/* Header */}
      <div className="bottom-sheet__header">
        <h2 className="bottom-sheet__title" title={title}>
          {title || 'Details'}
        </h2>
        <button
          className="bottom-sheet__close"
          onClick={handleClose}
          aria-label="Close"
          type="button"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="bottom-sheet__content"
        style={{
          maxHeight: state === 'expanded' ? `calc(${SNAP_HEIGHTS.expanded * 100}vh - 100px)` : `${SNAP_HEIGHTS.peek - 60}px`,
          overflowY: state === 'expanded' ? 'auto' : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default BottomSheet;
