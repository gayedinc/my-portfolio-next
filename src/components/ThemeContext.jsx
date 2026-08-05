'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const THEME_COOKIE = 'portfolio_theme';
const THEME_STORAGE_KEY = 'theme';

const LIGHT_THEME = 'light';
const DARK_THEME = 'dark-mode';

const VALID_THEMES = new Set([
  LIGHT_THEME,
  DARK_THEME,
]);

/*
 * null, ThemeProvider bulunmadığını açıkça temsil eder.
 * createContext() boş bırakıldığında useContext doğrudan
 * undefined döndürür ve Header içindeki destructuring çöker.
 */
const ThemeContext = createContext(null);

ThemeContext.displayName = 'ThemeContext';

function normalizeTheme(value) {
  return VALID_THEMES.has(value)
    ? value
    : null;
}

function readThemeCookie() {
  const cookieEntry = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${THEME_COOKIE}=`));

  if (!cookieEntry) {
    return null;
  }

  const rawValue = cookieEntry
    .slice(THEME_COOKIE.length + 1);

  return normalizeTheme(rawValue);
}

function readStoredTheme() {
  try {
    return normalizeTheme(
      window.localStorage.getItem(THEME_STORAGE_KEY)
    );
  } catch {
    return null;
  }
}

function getSystemTheme() {
  return window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches
    ? DARK_THEME
    : LIGHT_THEME;
}

function applyTheme(theme) {
  const isDarkMode = theme === DARK_THEME;

  document.documentElement.classList.toggle(
    DARK_THEME,
    isDarkMode
  );

  document.body?.classList.toggle(
    DARK_THEME,
    isDarkMode
  );

  document.documentElement.style.colorScheme =
    isDarkMode ? 'dark' : 'light';
}

function persistTheme(theme) {
  try {
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      theme
    );
  } catch {
    // LocalStorage kullanılamasa da cookie tercihi korur.
  }

  document.cookie = [
    `${THEME_COOKIE}=${theme}`,
    'path=/',
    'max-age=31536000',
    'SameSite=Lax',
  ].join('; ');
}

export function ThemeProvider({
  children,
  initialTheme = LIGHT_THEME,
}) {
  const safeInitialTheme =
    normalizeTheme(initialTheme) || LIGHT_THEME;

  const [theme, setTheme] = useState(
    safeInitialTheme
  );

  const [mounted, setMounted] = useState(false);

  /*
   * İlk client renderında daha önce kaydedilen tercihi çözer.
   *
   * Öncelik:
   * 1. Cookie
   * 2. LocalStorage
   * 3. İşletim sistemi tercihi
   * 4. Server tarafından gelen initialTheme
   */
  useEffect(() => {
    const resolvedTheme =
      readThemeCookie()
      || readStoredTheme()
      || getSystemTheme()
      || safeInitialTheme;

    applyTheme(resolvedTheme);
    persistTheme(resolvedTheme);

    setTheme(resolvedTheme);
    setMounted(true);
  }, [safeInitialTheme]);

  /*
   * Kullanıcı temayı değiştirdiğinde class, cookie
   * ve localStorage birlikte güncellenir.
   */
  useEffect(() => {
    if (!mounted) {
      return;
    }

    applyTheme(theme);
    persistTheme(theme);
  }, [mounted, theme]);

  /*
   * Header şu şekilde boolean gönderiyor:
   *
   * toggleTheme(event.target.checked)
   *
   * Parametresiz çağrı desteği de eklendi.
   */
  const toggleTheme = useCallback((nextChecked) => {
    setTheme((currentTheme) => {
      if (typeof nextChecked === 'boolean') {
        return nextChecked
          ? DARK_THEME
          : LIGHT_THEME;
      }

      return currentTheme === DARK_THEME
        ? LIGHT_THEME
        : DARK_THEME;
    });
  }, []);

  /*
   * Her renderda yeni bir context nesnesi oluşmasını önler.
   * Header ve diğer context kullanıcılarının gereksiz
   * render edilmesini azaltır.
   */
  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
      mounted,
    }),
    [theme, toggleTheme, mounted]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  /*
   * Provider bağlantısı gerçekten yoksa artık
   * "Cannot destructure property theme..." yerine
   * sorunun kaynağını doğrudan söyleyen hata çıkar.
   */
  if (context === null) {
    throw new Error(
      'useTheme, ThemeProvider dışında kullanıldı. Header ve diğer tema bileşenleri ThemeProvider içinde render edilmelidir.'
    );
  }

  return context;
}