'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const override = localStorage.getItem('theme-override') as Theme | null;
  if (override === 'light' || override === 'dark') return override;
  return getSystemTheme();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [manual, setManual] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('theme-override') !== null
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#0f0f0f' : '#ededf0');
    }
  }, [theme]);

  useEffect(() => {
    if (manual) return;

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'light' : 'dark');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [manual]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      const isSystem = next === getSystemTheme();

      if (isSystem) {
        localStorage.removeItem('theme-override');
        setManual(false);
      } else {
        localStorage.setItem('theme-override', next);
        setManual(true);
      }

      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
