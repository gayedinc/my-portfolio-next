'use client';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function hamburgerMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className="header">
      <div className="header-mobile">
        <h1>Gaye Dinç</h1>
        <LanguageSwitcher />
        <div className="hamburger-menu">
          <button
            className={isMenuOpen ? 'hamburger-icon-none' : 'hamburger-btn'}
            onClick={hamburgerMenu}
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
            <button className="close-btn" onClick={hamburgerMenu}>
              <CloseSvg />
            </button>
            <h1>Gaye Dinç</h1>
          </div>
          <nav className="nav-hamburger">
            <ul>
              {getRoutes().map((route) => (
                <li key={route.url}>
                  <a href={`/${route.url}`} onClick={() => setIsMenuOpen(false)}>
                    {t(route.titleKey)}
                  </a>
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
        <h1 className="site-title" onClick={() => (window.location.href = '/')}>
          Gaye Dinç
        </h1>
        <div className="nav-adres">
          <ul>
            {getRoutes().map((route) => (
              <li key={route.url}>
                <a href={`/${route.url}`}>{t(route.titleKey)}</a>
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