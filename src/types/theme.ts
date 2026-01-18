/**
 * Theme type definitions
 */

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  /** Current theme */
  theme: Theme;
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
  /** Set a specific theme */
  setTheme: (theme: Theme) => void;
  /** Whether the current theme is dark */
  isDark: boolean;
}
