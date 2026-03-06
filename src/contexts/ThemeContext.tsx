// ALPHA TRECKER - Theme Context

import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'alpha_trecker_theme';
const THEME_SWITCH_GUARD_CLASS = 'theme-switching';

const applyThemeToDocument = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.classList.toggle('light', theme === 'light');
  document.documentElement.style.colorScheme = theme;
};

const guardThemeSwitch = () => {
  document.documentElement.classList.add(THEME_SWITCH_GUARD_CLASS);
  window.setTimeout(() => {
    document.documentElement.classList.remove(THEME_SWITCH_GUARD_CLASS);
  }, 140);
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem(THEME_KEY) as Theme | null) ?? 'dark';
  });

  useEffect(() => {
    applyThemeToDocument(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    guardThemeSwitch();
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    guardThemeSwitch();
    setThemeState((prev) => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    setTheme,
  }), [setTheme, theme, toggleTheme]);

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
