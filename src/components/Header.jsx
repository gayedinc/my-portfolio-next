'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useTheme } from './ThemeContext';
import { MoonSvg, SunSvg, HamburgerSvg, CloseSvg } from './Svg';
import '../assets/darkMode.css';
import { getRoutes } from './helper';

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  function hamburgerMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className="header">
      <div className="header-mobile">
        <div className="brand-lockup">
          <Link href="/" className="brand-name">Gaye Dinç</Link>
          <span className="brand-role">{t('nav_role')}</span>
        </div>
        <LanguageSwitcher />
        <div className="hamburger-menu">
          <button
            className={isMenuOpen ? 'hamburger-icon-none' : 'hamburger-btn'}
            onClick={hamburgerMenu}
            aria-label="Open navigation menu"
          >
            <HamburgerSvg />
          </button>
        </div>
      </div>

      <div
        onClick={hamburgerMenu}
        className={`hamburger-menu-overlay ${isMenuOpen ? 'block' : 'none'}`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`hamburger-menu-content ${isMenuOpen ? 'block' : 'none'}`}
        >
          <div className="menu-header">
            <button className="close-btn" onClick={hamburgerMenu} aria-label="Close navigation menu">
              <CloseSvg />
            </button>
            <div className="brand-lockup">
              <Link href="/" className="brand-name" onClick={() => setIsMenuOpen(false)}>Gaye Dinç</Link>
              <span className="brand-role">{t('nav_role')}</span>
            </div>
          </div>
          <nav className="nav-hamburger">
            <ul>
              {getRoutes().map((route) => (
                <li key={route.url}>
                  <Link
                    href={`/${route.url}`}
                    className={pathname === `/${route.url}` || (!route.url && pathname === '/') ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t(route.titleKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="theme-section">
            <label className="theme-switch">
              <SunSvg />
              <input
                className="switch"
                type="checkbox"
                disabled={!mounted}
                checked={theme === 'dark-mode'}
                onChange={(event) => toggleTheme(event.target.checked)}
              />
              <MoonSvg />
            </label>
          </div>
        </div>
      </div>

      <nav className={`nav-desktop ${isScrolled ? 'scrolled' : ''}`}>
        <div className="brand-lockup">
          <Link className="brand-name site-title" href="/">
            Gaye Dinç
          </Link>
          <span className="brand-role">{t('nav_role')}</span>
        </div>
        <div className="nav-adres">
          <ul>
            {getRoutes().map((route) => (
              <li key={route.url}>
                <Link
                  href={`/${route.url}`}
                  className={pathname === `/${route.url}` || (!route.url && pathname === '/') ? 'active' : ''}
                >
                  {t(route.titleKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="button-area">
          <LanguageSwitcher />
          <div className="theme-section">
            <label className="theme-switch">
              <SunSvg />
              <input
                className="switch"
                type="checkbox"
                disabled={!mounted}
                checked={theme === 'dark-mode'}
                onChange={(event) => toggleTheme(event.target.checked)}
              />
              <MoonSvg />
            </label>
          </div>
        </div>
      </nav>
    </header>
  );
}