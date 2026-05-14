// ALPHA TRECKER - Theme Context

import { createContext, useContext, useLayoutEffect, useMemo, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'alpha_tracker_theme';
const LEGACY_THEME_KEY = 'alpha_trecker_theme';
const DEFAULT_THEME: Theme = 'dark';

const applyThemeToDocument = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
  root.style.colorScheme = theme;
};

const persistTheme = (theme: Theme) => {
  localStorage.setItem(THEME_KEY, theme);
  localStorage.removeItem(LEGACY_THEME_KEY);
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme: Theme = DEFAULT_THEME;

  useLayoutEffect(() => {
    applyThemeToDocument(DEFAULT_THEME);
    persistTheme(DEFAULT_THEME);
  }, []);

  const value = useMemo(() => ({
    theme,
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
