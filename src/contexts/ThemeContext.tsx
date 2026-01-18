/**
 * Theme Context for managing light/dark mode
 *
 * Provides theme state that syncs with:
 * 1. URL parameters (for shareability)
 * 2. localStorage (for persistence when URL has no theme param)
 */

import { createContext, useContext, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Theme, ThemeContextValue } from '@types';

const THEME_URL_PARAM = 'theme';
const THEME_STORAGE_KEY = 'scenius-theme';
const DEFAULT_THEME: Theme = 'light';

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Validate and parse a theme string
 */
function parseTheme(value: string | null): Theme | null {
  if (value === 'light' || value === 'dark') {
    return value;
  }
  return null;
}

/**
 * Get initial theme from URL, localStorage, or default
 */
function getInitialTheme(urlTheme: string | null): Theme {
  // First priority: URL parameter
  const parsed = parseTheme(urlTheme);
  if (parsed) return parsed;

  // Second priority: localStorage
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const storedParsed = parseTheme(stored);
    if (storedParsed) return storedParsed;
  } catch {
    // localStorage may not be available
  }

  // Default
  return DEFAULT_THEME;
}

/**
 * Provider component that manages theme state
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTheme = searchParams.get(THEME_URL_PARAM);

  // Derive theme from URL or localStorage
  const theme = useMemo(() => getInitialTheme(urlTheme), [urlTheme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    // Also persist to localStorage for when URL doesn't have theme param
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // localStorage may not be available
    }
  }, [theme]);

  // Set theme and update URL
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set(THEME_URL_PARAM, newTheme);
          return newParams;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
      isDark: theme === 'dark',
    }),
    [theme, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context
 * Must be used within a ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
