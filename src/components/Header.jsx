'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useTheme } from './ThemeContext';
import { MoonSvg, SunSvg, HamburgerSvg, CloseSvg } from './Svg';
import { getRoutes } from './helper';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const PORTFOLIO_HEADER_HEIGHT_PROPERTY = '--portfolio-header-height';

function ThemeToggle({ mounted, theme, toggleTheme }) {
  const { t } = useTranslation();
  const isDarkMode = mounted && theme === 'dark-mode';
  const label = t('theme_toggle');

  return (
    <div className="theme-section">
      <label className="theme-switch" title={label}>
        <SunSvg />
        <span className="sr-only">{label}</span>
        <input
          className="switch"
          type="checkbox"
          disabled={!mounted}
          checked={isDarkMode}
          onChange={(event) => toggleTheme(event.target.checked)}
          aria-label={label}
        />
        <MoonSvg />
      </label>
    </div>
  );
}

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const menuPanelRef = useRef(null);
  const scrollStateRef = useRef(false);

  const isRouteActive = (route) => (
    pathname === `/${route.url}`
    || (route.url === 'projects' && pathname.startsWith('/projects/'))
    || (!route.url && pathname === '/')
  );

  useEffect(() => {
    const handleScroll = () => {
      const nextScrolled = window.scrollY > 18;
      if (scrollStateRef.current !== nextScrolled) {
        scrollStateRef.current = nextScrolled;
        setIsScrolled(nextScrolled);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return undefined;
    }

    const root = document.documentElement;
    let appliedValue = '';
    let frameId = null;

    const measureHeader = () => {
      frameId = null;
      if (!header.isConnected) {
        return;
      }

      const measuredHeight = Math.ceil(header.getBoundingClientRect().height);
      if (measuredHeight <= 0) {
        return;
      }

      const nextValue = `${measuredHeight}px`;
      if (nextValue === appliedValue) {
        return;
      }

      root.style.setProperty(PORTFOLIO_HEADER_HEIGHT_PROPERTY, nextValue);
      appliedValue = nextValue;
    };

    const scheduleMeasurement = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(measureHeader);
      }
    };

    measureHeader();

    let resizeObserver = null;
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(scheduleMeasurement);
      resizeObserver.observe(header);
    } else {
      window.addEventListener('resize', scheduleMeasurement);
    }

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      resizeObserver?.disconnect();
      if (!resizeObserver) {
        window.removeEventListener('resize', scheduleMeasurement);
      }

      // Preserve the last valid measurement during client-side route hand-offs.
      // The next Header instance replaces it as soon as its own size is known.
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const getFocusableItems = () => (
      Array.from(menuPanelRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) || [])
        .filter((element) => !element.hasAttribute('hidden'))
    );

    const focusFrame = window.requestAnimationFrame(() => {
      getFocusableItems()[0]?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMenuOpen(false);
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableItems = getFocusableItems();
      if (!focusableItems.length) {
        event.preventDefault();
        return;
      }

      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === firstItem || !menuPanelRef.current?.contains(activeElement))) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      menuButtonRef.current?.focus();
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header ref={headerRef} className="header" id="top">
      <div className="header-mobile">
        <div className="brand-lockup">
          <Link href="/" className="brand-name">Gaye Dinç</Link>
          <span className="brand-role brand-role-full" lang="en" title={t('nav_role')}>
            {t('nav_role')}
          </span>
        </div>
        <LanguageSwitcher />
        <div className="hamburger-menu">
          <button
            ref={menuButtonRef}
            type="button"
            className="hamburger-btn"
            onClick={() => setIsMenuOpen(true)}
            aria-label={t('open_navigation')}
            aria-controls="mobile-navigation-dialog"
            aria-expanded={isMenuOpen}
          >
            <HamburgerSvg />
          </button>
        </div>
      </div>

      <div
        className={`hamburger-menu-overlay ${isMenuOpen ? 'block' : 'none'}`}
        onClick={closeMenu}
        hidden={!isMenuOpen}
        aria-hidden={!isMenuOpen}
      >
        <div
          ref={menuPanelRef}
          id="mobile-navigation-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-navigation-title"
          onClick={(event) => event.stopPropagation()}
          className={`hamburger-menu-content ${isMenuOpen ? 'block' : 'none'}`}
        >
          <h2 id="mobile-navigation-title" className="sr-only">{t('navigation_menu')}</h2>
          <div className="menu-header">
            <button
              type="button"
              className="close-btn"
              onClick={closeMenu}
              aria-label={t('close_navigation')}
            >
              <CloseSvg />
            </button>
            <div className="brand-lockup">
              <Link
                href="/"
                className="brand-name"
                onClick={closeMenu}
              >
                Gaye Dinç
              </Link>
              <span className="brand-role brand-role-full" lang="en" title={t('nav_role')}>
                {t('nav_role')}
              </span>
            </div>
          </div>
          <nav className="nav-hamburger" aria-label={t('main_navigation')}>
            <ul>
              {getRoutes().map((route) => {
                const active = isRouteActive(route);
                return (
                  <li key={route.url}>
                    <Link
                      href={`/${route.url}`}
                      className={active ? 'active' : ''}
                      aria-current={active ? 'page' : undefined}
                      onClick={closeMenu}
                    >
                      {t(route.titleKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <ThemeToggle
            mounted={mounted}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </div>
      </div>

      <nav
        className={`nav-desktop ${isScrolled ? 'scrolled' : ''}`}
        aria-label={t('main_navigation')}
      >
        <div className="brand-lockup">
          <Link className="brand-name site-title" href="/">
            Gaye Dinç
          </Link>
          <span className="brand-role brand-role-full" lang="en" title={t('nav_role')}>
            {t('nav_role')}
          </span>
        </div>
        <div className="nav-adres">
          <ul>
            {getRoutes().map((route) => {
              const active = isRouteActive(route);
              return (
                <li key={route.url}>
                  <Link
                    href={`/${route.url}`}
                    className={active ? 'active' : ''}
                    aria-current={active ? 'page' : undefined}
                  >
                    {t(route.titleKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="button-area">
          <LanguageSwitcher />
          <ThemeToggle
            mounted={mounted}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </div>
      </nav>
    </header>
  );
}
