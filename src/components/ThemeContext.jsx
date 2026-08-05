'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
const THEME_COOKIE = 'portfolio_theme';
const THEME_STORAGE_KEY = 'theme';
const VALID_THEMES = new Set(['light', 'dark-mode']);

function normalizeTheme(value) {
  return VALID_THEMES.has(value) ? value : null;
}

function readThemeCookie() {
  const cookieEntry = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${THEME_COOKIE}=`));

  return normalizeTheme(cookieEntry?.split('=')[1]);
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark-mode'
    : 'light';
}

function applyTheme(theme) {
  const isDarkMode = theme === 'dark-mode';
  document.documentElement.classList.toggle('dark-mode', isDarkMode);
  document.body.classList.toggle('dark-mode', isDarkMode);
  document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
}

function persistTheme(theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The cookie still preserves the preference if storage is unavailable.
  }

  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

export function ThemeProvider({ children, initialTheme = 'light' }) {
  const safeInitialTheme = normalizeTheme(initialTheme) || 'light';
  const [theme, setTheme] = useState(safeInitialTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let storedTheme = null;

    try {
      storedTheme = normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
    } catch {
      storedTheme = null;
    }

    const resolvedTheme = readThemeCookie()
      || storedTheme
      || getSystemTheme()
      || safeInitialTheme;

    applyTheme(resolvedTheme);
    persistTheme(resolvedTheme);
    setTheme(resolvedTheme);
    setMounted(true);
  }, [safeInitialTheme]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    applyTheme(theme);
    persistTheme(theme);
  }, [mounted, theme]);

  function toggleTheme(nextChecked) {
    setTheme(nextChecked ? 'dark-mode' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
