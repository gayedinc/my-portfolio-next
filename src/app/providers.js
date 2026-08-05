'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../components/ThemeContext';
import { createI18nInstance, supportedLocales } from '../i18n';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function Providers({
  children,
  initialLocale = 'tr',
  initialTheme = 'light',
}) {
  const pathname = usePathname();
  const router = useRouter();
  const i18nInstance = useMemo(
    () => createI18nInstance(initialLocale),
    [initialLocale]
  );
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollTopVisibilityRef = useRef(false);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem('portfolio_locale');
    const cookieEntry = document.cookie
      .split('; ')
      .find((entry) => entry.startsWith('portfolio_locale='));
    const cookieLocale = cookieEntry?.split('=')[1];
    const hasValidCookie = supportedLocales.includes(cookieLocale);
    const hasValidStoredLocale = supportedLocales.includes(storedLocale);

    if (!cookieEntry && hasValidStoredLocale && storedLocale !== initialLocale) {
      document.cookie = `portfolio_locale=${storedLocale}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = storedLocale;
      i18nInstance.changeLanguage(storedLocale);
      router.refresh();
      return;
    }

    const locale = hasValidCookie ? cookieLocale : initialLocale;
    window.localStorage.setItem('portfolio_locale', locale);
    document.cookie = `portfolio_locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = locale;
    if (i18nInstance.resolvedLanguage !== locale) {
      i18nInstance.changeLanguage(locale);
    }
  }, [initialLocale, i18nInstance, router]);

  useEffect(() => {
    let frameId = null;

    const updateScrollProgress = () => {
      frameId = null;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
      document.documentElement.style.setProperty(
        '--scroll-progress',
        progress.toFixed(4)
      );

      const shouldShowScrollTop = scrollTop > 300;
      if (scrollTopVisibilityRef.current !== shouldShowScrollTop) {
        scrollTopVisibilityRef.current = shouldShowScrollTop;
        setShowScrollTop(shouldShowScrollTop);
      }
    };

    const scheduleUpdate = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateScrollProgress);
      }
    };

    updateScrollProgress();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [pathname]);

  useEffect(() => {
    const motionPreference = window.matchMedia(REDUCED_MOTION_QUERY);
    const tracked = new WeakSet();
    const pending = new Set();
    const fallbackTimers = new Map();
    const canObserve = 'IntersectionObserver' in window;
    let observer = null;

    const reveal = (element) => {
      const fallbackTimer = fallbackTimers.get(element);
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
        fallbackTimers.delete(element);
      }

      element.classList.remove('reveal-pending');
      element.classList.add('is-visible');
      pending.delete(element);
      observer?.unobserve(element);
    };

    if (canObserve) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
      );
    }

    const prepare = (element) => {
      if (tracked.has(element)) {
        return;
      }

      tracked.add(element);

      if (motionPreference.matches || !observer) {
        reveal(element);
        return;
      }

      element.classList.remove('is-visible');
      element.classList.add('reveal-pending');
      pending.add(element);
      observer.observe(element);

      const fallbackTimer = window.setTimeout(() => {
        fallbackTimers.delete(element);
        if (!element.isConnected) {
          pending.delete(element);
          observer?.unobserve(element);
          return;
        }

        const bounds = element.getBoundingClientRect();
        const isNearViewport = bounds.top < window.innerHeight * 1.25
          && bounds.bottom > window.innerHeight * -0.25;
        if (isNearViewport) {
          reveal(element);
        }
      }, 1800);
      fallbackTimers.set(element, fallbackTimer);
    };

    const scan = (root) => {
      if (!root?.querySelectorAll) {
        return;
      }

      if (root instanceof Element && root.matches('[data-reveal]')) {
        prepare(root);
      }

      root.querySelectorAll('[data-reveal]').forEach(prepare);
    };

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            scan(node);
          }
        });
      });
    });

    const revealAllPending = () => {
      [...pending].forEach(reveal);
    };

    const handleMotionPreferenceChange = (event) => {
      if (event.matches) {
        revealAllPending();
      }
    };

    scan(document);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    motionPreference.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      motionPreference.removeEventListener('change', handleMotionPreferenceChange);
      mutationObserver.disconnect();
      revealAllPending();
      observer?.disconnect();
      fallbackTimers.forEach((timer) => window.clearTimeout(timer));
      fallbackTimers.clear();
    };
  }, [pathname]);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <I18nextProvider i18n={i18nInstance}>
      <ThemeProvider initialTheme={initialTheme}>
        <span className="global-scroll-progress" aria-hidden="true" />
        <button
          className={`scroll-to-top${showScrollTop ? ' visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          aria-hidden={!showScrollTop}
          tabIndex={showScrollTop ? 0 : -1}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        {children}
      </ThemeProvider>
    </I18nextProvider>
  );
}
