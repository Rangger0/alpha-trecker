// ALPHA TRACKER - Theme Context

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type Theme = 'obsidian' | 'slate' | 'graphite' | 'deep-navy' | 'dark' | 'light' | 'ocean' | 'sunset';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'alpha-tracker-theme';
const LEGACY_THEME_KEY = 'alpha_tracker_theme';
const LEGACY_THEME_KEY_2 = 'alpha_trecker_theme';
const DEFAULT_THEME: Theme = 'obsidian';

const themeAliases: Record<string, Theme> = {
  dark: 'obsidian',
  light: 'slate',
  ocean: 'slate',
  sunset: 'deep-navy',
  obsidian: 'obsidian',
  slate: 'slate',
  graphite: 'graphite',
  'deep-navy': 'deep-navy',
  deepNavy: 'deep-navy',
  deep_navy: 'deep-navy',
};

const normalizeTheme = (value: string | null | undefined): Theme => {
  if (!value) return DEFAULT_THEME;
  return themeAliases[value] ?? DEFAULT_THEME;
};

const readStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const stored = localStorage.getItem(THEME_KEY) || localStorage.getItem(LEGACY_THEME_KEY) || localStorage.getItem(LEGACY_THEME_KEY_2);
  return normalizeTheme(stored);
};

const applyThemeToDocument = (theme: Theme) => {
  const root = document.documentElement;
  const canonical = normalizeTheme(theme);

  root.classList.remove('dark', 'light', 'ocean', 'sunset', 'obsidian', 'slate', 'graphite', 'deep-navy', 'deepNavy');
  root.classList.add(canonical);
  root.classList.toggle('dark', canonical !== 'slate');
  root.classList.toggle('light', canonical === 'slate');
  root.dataset.theme = canonical;
  root.style.colorScheme = canonical === 'slate' ? 'light' : 'dark';
};

const persistTheme = (theme: Theme) => {
  const canonical = normalizeTheme(theme);
  localStorage.setItem(THEME_KEY, canonical);
  localStorage.setItem(LEGACY_THEME_KEY, canonical);
  localStorage.removeItem(LEGACY_THEME_KEY_2);
};

const runThemeUpdate = (update: () => void) => {
  const startViewTransition = (document as Document & {
    startViewTransition?: (callback: () => void) => unknown;
  }).startViewTransition;

  if (startViewTransition) {
    startViewTransition.call(document, update);
    return;
  }

  update();
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const switchTimeoutRef = useRef<number | null>(null);

  const beginThemeSwitch = useCallback(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    root.classList.add('theme-switching');

    if (switchTimeoutRef.current !== null) {
      window.clearTimeout(switchTimeoutRef.current);
    }

    switchTimeoutRef.current = window.setTimeout(() => {
      root.classList.remove('theme-switching');
      switchTimeoutRef.current = null;
    }, 220);
  }, []);

  useLayoutEffect(() => {
    applyThemeToDocument(theme);
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      if (switchTimeoutRef.current !== null) {
        window.clearTimeout(switchTimeoutRef.current);
      }
    };
  }, []);

  const setTheme = useCallback((nextTheme: Theme) => {
    beginThemeSwitch();
    const update = () => {
      const canonical = normalizeTheme(nextTheme);
      setThemeState((current) => (normalizeTheme(current) === canonical ? current : canonical));
    };

    runThemeUpdate(update);
  }, [beginThemeSwitch]);

  const toggleTheme = useCallback(() => {
    beginThemeSwitch();
    const update = () => {
      setThemeState((current) => {
        const themes: Theme[] = ['obsidian', 'slate', 'graphite', 'deep-navy'];
        const canonical = normalizeTheme(current);
        const nextIndex = (themes.indexOf(canonical) + 1) % themes.length;
        return themes[nextIndex];
      });
    };

    runThemeUpdate(update);
  }, [beginThemeSwitch]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme,
  }), [setTheme, theme, toggleTheme]);

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
