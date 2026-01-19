/**
 * HamburgerButton - Accessible hamburger menu toggle button
 * 
 * A 44×44px touch-friendly button that displays the classic three-line
 * hamburger icon. When the menu is open, it transforms to an X icon.
 * 
 * Features:
 * - 44px minimum touch target (Apple HIG compliance)
 * - Animated icon transition
 * - Accessible with proper ARIA attributes
 */

import './HamburgerButton.css';

interface HamburgerButtonProps {
  /** Whether the menu is currently open */
  isOpen: boolean;
  /** Callback when button is clicked */
  onClick: () => void;
  /** Optional CSS class name */
  className?: string;
}

function HamburgerButton({ isOpen, onClick, className = '' }: HamburgerButtonProps) {
  return (
    <button
      className={`hamburger-button ${isOpen ? 'hamburger-button--open' : ''} ${className}`}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      type="button"
    >
      <span className="hamburger-button__line hamburger-button__line--1" />
      <span className="hamburger-button__line hamburger-button__line--2" />
      <span className="hamburger-button__line hamburger-button__line--3" />
    </button>
  );
}

export default HamburgerButton;
