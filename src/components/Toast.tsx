/**
 * Toast - Lightweight toast notification component
 * 
 * Features:
 * - Auto-dismiss after configurable duration
 * - Fixed position at bottom center
 * - Success/info variants
 * - Accessible with ARIA live region
 */

import { useEffect, useState, useCallback } from 'react';
import './Toast.css';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info';
}

interface ToastProps {
  /** Array of toast messages to display */
  messages: ToastMessage[];
  /** Callback to remove a toast by ID */
  onDismiss: (id: string) => void;
  /** Auto-dismiss duration in ms (default: 2000) */
  duration?: number;
}

function Toast({ messages, onDismiss, duration = 2000 }: ToastProps) {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {messages.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          duration={duration}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  duration: number;
}

function ToastItem({ toast, onDismiss, duration }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    // Wait for exit animation before removing
    setTimeout(() => onDismiss(toast.id), 200);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    const timer = setTimeout(handleDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, handleDismiss]);

  const typeClass = toast.type === 'success' ? 'toast-item--success' : 'toast-item--info';
  const exitClass = isExiting ? 'toast-item--exiting' : '';

  return (
    <div className={`toast-item ${typeClass} ${exitClass}`} role="status">
      {toast.type === 'success' && (
        <svg
          className="toast-item__icon"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )}
      <span className="toast-item__message">{toast.message}</span>
    </div>
  );
}

/**
 * Hook for managing toast state
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}

export default Toast;
