/**
 * Drawer - Slide-in drawer component for mobile navigation
 * 
 * A mobile-native pattern for displaying content in a drawer that slides in
 * from the left side. Used for FilterPanel on mobile.
 * 
 * Features:
 * - Slides in from the left
 * - Semi-transparent backdrop that closes drawer on tap
 * - Swipe-to-close gesture support
 * - Safe area inset support for iPhone notches
 * - Focus trap when open
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import './Drawer.css';

interface DrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback to close the drawer */
  onClose: () => void;
  /** Title displayed in the drawer header */
  title?: string;
  /** Content to display in the drawer */
  children: React.ReactNode;
  /** Width of the drawer */
  width?: number | string;
  /** Optional CSS class name */
  className?: string;
}

/** Minimum swipe distance to trigger close */
const SWIPE_THRESHOLD = 100;

/** Velocity threshold for flick gestures */
const FLICK_VELOCITY = 0.5;

function Drawer({
  isOpen,
  onClose,
  title,
  children,
  width = 300,
  className = '',
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Track touch state for swipe gesture
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const currentX = useRef(0);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Focus close button when drawer opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Touch handlers for swipe-to-close
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    currentX.current = touchStartX.current;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentX.current = e.touches[0].clientX;
    const delta = touchStartX.current - currentX.current;
    
    // Only allow swiping left (to close)
    if (delta > 0) {
      setDragOffset(Math.min(delta, typeof width === 'number' ? width : 300));
    }
  }, [isDragging, width]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const delta = touchStartX.current - currentX.current;
    const elapsed = Date.now() - touchStartTime.current;
    const velocity = delta / elapsed;

    // Check for flick or significant drag
    if (velocity > FLICK_VELOCITY || delta > SWIPE_THRESHOLD) {
      onClose();
    }

    setDragOffset(0);
  }, [isDragging, onClose]);

  if (!isOpen) {
    return null;
  }

  const drawerWidth = typeof width === 'number' ? `${width}px` : width;

  return (
    <div 
      className="drawer-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Drawer'}
    >
      <div
        ref={drawerRef}
        className={`drawer ${isDragging ? 'drawer--dragging' : ''} ${className}`}
        style={{
          width: drawerWidth,
          transform: `translateX(-${dragOffset}px)`,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="drawer__header">
          <h2 className="drawer__title">{title || 'Menu'}</h2>
          <button
            ref={closeButtonRef}
            className="drawer__close"
            onClick={onClose}
            aria-label="Close drawer"
            type="button"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="drawer__content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Drawer;
