'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type ThemeMode = 'light' | 'dark' | 'auto';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'metromitra-theme-mode';

function getTimeBasedTheme(): ResolvedTheme {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');

  // On mount, read stored preference
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') {
      setModeState(stored);
      setResolvedTheme(stored);
    } else {
      setModeState('auto');
      setResolvedTheme(getTimeBasedTheme());
    }
  }, []);

  // Re-check time every minute when in auto mode
  useEffect(() => {
    if (mode !== 'auto') return;
    const interval = setInterval(() => {
      setResolvedTheme(getTimeBasedTheme());
    }, 60000);
    return () => clearInterval(interval);
  }, [mode]);

  // Apply resolvedTheme to <html> whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    if (newMode === 'auto') {
      localStorage.removeItem(STORAGE_KEY);
      setResolvedTheme(getTimeBasedTheme());
    } else {
      localStorage.setItem(STORAGE_KEY, newMode);
      setResolvedTheme(newMode);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
