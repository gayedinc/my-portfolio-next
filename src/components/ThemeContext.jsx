'use client';
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  function getSystemThemePref() {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : 'light';
    }
    return 'light';
  }

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme || getSystemThemePref();
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = theme;
    }
  }, [theme]);

  function toggleTheme(e) {
    const changedTheme = e.target.checked ? 'dark-mode' : 'light';
    setTheme(changedTheme);
    if (typeof window !== 'undefined') {
      localStorage.theme = changedTheme;
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}