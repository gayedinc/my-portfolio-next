'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '../components/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { createI18nInstance, supportedLocales } from '../i18n';

export function Providers({ children, initialLocale = 'tr' }) {
  const pathname = usePathname();
  const router = useRouter();
  const i18nInstance = useMemo(() => createI18nInstance(initialLocale), [initialLocale]);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  // React Strict Mode'da çift yüklemeyi önlemek için
  useEffect(() => {
    // i18n başlatılması client tarafında
  }, []);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
      setShowScrollTop(scrollTop > 300);
    };

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, [pathname]);


  useEffect(() => {
    const seen = new WeakSet();
    const pending = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            pending.delete(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px -4% 0px' }
    );

    const isInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.96 && rect.bottom > 0;
    };

    const revealPendingInViewport = () => {
      if (!pending.size) {
        return;
      }

      pending.forEach((section) => {
        if (isInViewport(section)) {
          section.classList.add('is-visible');
          observer.unobserve(section);
          pending.delete(section);
        }
      });
    };

    const trackSection = (section) => {
      if (seen.has(section)) {
        return;
      }

      seen.add(section);

      if (isInViewport(section)) {
        section.classList.add('is-visible');
        return;
      }

      pending.add(section);
      observer.observe(section);
    };

    const scanSections = (root = document) => {
      if (!root || !(root instanceof Element || root instanceof Document)) {
        return;
      }
      root.querySelectorAll('.reveal-section').forEach(trackSection);
    };

    const onScrollOrResize = () => {
      revealPendingInViewport();
    };

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) {
            return;
          }

          if (node.matches('.reveal-section')) {
            trackSection(node);
          }

          scanSections(node);
          revealPendingInViewport();
        });
      });
    });

    const startTracking = () => {
      scanSections(document);
      revealPendingInViewport();

      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize);

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    let secondFrameId;
    const firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(startTracking);
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      if (secondFrameId) {
        window.cancelAnimationFrame(secondFrameId);
      }
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      pending.clear();
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <I18nextProvider i18n={i18nInstance}>
      <ThemeProvider>
      <span className="global-scroll-progress" aria-hidden="true" />
      <button
        className={`scroll-to-top${showScrollTop ? ' visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        {children}
      </ThemeProvider>
    </I18nextProvider>
  );
}
