// ALPHA TRECKER - Theme Context

import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'alpha_tracker_theme';
const LEGACY_THEME_KEY = 'alpha_trecker_theme';
const DEFAULT_THEME: Theme = 'dark';

const readStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const stored = localStorage.getItem(THEME_KEY) || localStorage.getItem(LEGACY_THEME_KEY);
  return stored === 'light' || stored === 'dark' ? stored : DEFAULT_THEME;
};

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
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const switchTimeoutRef = useRef<number | null>(null);

  const beginThemeSwitch = () => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    root.classList.add('theme-switching');

    if (switchTimeoutRef.current !== null) {
      window.clearTimeout(switchTimeoutRef.current);
    }

    switchTimeoutRef.current = window.setTimeout(() => {
      root.classList.remove('theme-switching');
      switchTimeoutRef.current = null;
    }, 90);
  };

  useLayoutEffect(() => {
    applyThemeToDocument(theme);
    persistTheme(theme);
  }, [theme]);

  const setTheme = (nextTheme: Theme) => {
    beginThemeSwitch();
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    beginThemeSwitch();
    setThemeState((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme,
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
