'use client';

import { useEffect, useId, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

const LANGUAGE_OPTIONS = [
  { code: 'tr', label: 'TR - Türkçe' },
  { code: 'en', label: 'EN - English' },
  { code: 'de', label: 'DE - Deutsch' },
];

const getLanguageCode = (language) => {
  const normalizedLanguage = language?.split('-')[0];
  return LANGUAGE_OPTIONS.some(({ code }) => code === normalizedLanguage)
    ? normalizedLanguage
    : 'tr';
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const menuId = useId();
  const switcherRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const requestedFocusIndex = useRef(0);
  const [isOpen, setIsOpen] = useState(false);
  const activeCode = getLanguageCode(i18n.resolvedLanguage || i18n.language);
  const activeIndex = LANGUAGE_OPTIONS.findIndex(({ code }) => code === activeCode);
  const activeOption = LANGUAGE_OPTIONS[activeIndex] || LANGUAGE_OPTIONS[0];

  const openMenu = (focusIndex = activeIndex) => {
    requestedFocusIndex.current = Math.max(0, focusIndex);
    setIsOpen(true);
  };

  const closeMenu = (restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const focusFrame = window.requestAnimationFrame(() => {
      optionRefs.current[requestedFocusIndex.current]?.focus();
    });

    const handleOutsidePointer = (event) => {
      if (!switcherRef.current?.contains(event.target)) {
        closeMenu();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointer);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('pointerdown', handleOutsidePointer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLanguageChange = async (languageCode) => {
    window.localStorage.setItem('portfolio_locale', languageCode);
    document.cookie = `portfolio_locale=${languageCode}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = languageCode;
    setIsOpen(false);
    await i18n.changeLanguage(languageCode);
    toast.success(i18n.t('language_changed'));
    router.refresh();
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openMenu(activeIndex);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu(activeIndex > 0 ? activeIndex - 1 : LANGUAGE_OPTIONS.length - 1);
    }
  };

  const handleMenuKeyDown = (event) => {
    const currentIndex = optionRefs.current.indexOf(document.activeElement);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % LANGUAGE_OPTIONS.length;
    } else if (event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + LANGUAGE_OPTIONS.length) % LANGUAGE_OPTIONS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = LANGUAGE_OPTIONS.length - 1;
    } else if (event.key === 'Tab') {
      closeMenu();
      return;
    } else {
      return;
    }

    event.preventDefault();
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="language-switcher" ref={switcherRef}>
      <button
        ref={triggerRef}
        type="button"
        className="dropdown"
        onClick={() => isOpen ? closeMenu() : openMenu()}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={activeOption.label}
      >
        <span>{activeOption.code.toUpperCase()}</span>
        <span className="dropdown-chevron" aria-hidden="true">⌄</span>
      </button>
      <div
        id={menuId}
        className={`dropdown-menu ${isOpen ? 'open' : ''}`}
        role="menu"
        aria-label={activeOption.label}
        onKeyDown={handleMenuKeyDown}
        hidden={!isOpen}
      >
        {LANGUAGE_OPTIONS.map((option, index) => (
          <button
            ref={(element) => {
              optionRefs.current[index] = element;
            }}
            type="button"
            role="menuitemradio"
            aria-checked={option.code === activeCode}
            className="dropdown-item"
            onClick={() => handleLanguageChange(option.code)}
            key={option.code}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
