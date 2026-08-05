'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../components/ThemeContext';
import { REVEAL_READY_EVENT } from '../components/useRevealHydration';
import { createI18nInstance, supportedLocales } from '../i18n';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const REVEAL_CONTROLLER_SELECTOR = [
  '[data-reveal="section"]',
  '[data-reveal="group"]',
  '[data-reveal="sequence"]',
  '[data-reveal="item"]',
].join(', ');
const REVEAL_CONTAINER_SELECTOR = [
  '[data-reveal="section"]',
  '[data-reveal="group"]',
  '[data-reveal="sequence"]',
].join(', ');
const STACK_PANEL_SHELL_SELECTOR = [
  '.home-stack-panel',
  '.home-stack-panel__surface',
].join(', ');
const REVEAL_BOUNDARY_SELECTOR = '[data-reveal-boundary="true"]';

export function Providers({
  children,
  initialLocale = 'tr',
  initialTheme = 'light',
}) {
  const pathname = usePathname();
  const i18nInstance = useMemo(
    () => createI18nInstance(initialLocale),
    [initialLocale]
  );
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollTopVisibilityRef = useRef(false);

  const [scrollTopOnContact, setScrollTopOnContact] = useState(false);

  const scrollTopButtonRef = useRef(null);
  const scrollTopContactRef = useRef(false);

  useEffect(() => {
    const locale = supportedLocales.includes(initialLocale) ? initialLocale : 'tr';
    try {
      window.localStorage.setItem('portfolio_locale', locale);
    } catch {
      // The SSR-readable cookie remains the locale source of truth.
    }
    document.cookie = `portfolio_locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = locale;
    if (i18nInstance.resolvedLanguage !== locale) {
      i18nInstance.changeLanguage(locale);
    }
  }, [initialLocale, i18nInstance]);

  useEffect(() => {
    let frameId = null;

    const updateScrollProgress = () => {
      frameId = null;

      const scrollTop =
        window.scrollY || document.documentElement.scrollTop;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        maxScroll > 0
          ? Math.min(scrollTop / maxScroll, 1)
          : 0;

      document.documentElement.style.setProperty(
        '--scroll-progress',
        progress.toFixed(4)
      );

      /* Yukarı çık butonunun görünürlüğü */
      const shouldShowScrollTop = scrollTop > 300;

      if (scrollTopVisibilityRef.current !== shouldShowScrollTop) {
        scrollTopVisibilityRef.current = shouldShowScrollTop;
        setShowScrollTop(shouldShowScrollTop);
      }

      /*
       * Yukarı çık butonunun iletişim paneliyle
       * fiziksel olarak kesişip kesişmediğini kontrol et.
       */
      const scrollTopButton = scrollTopButtonRef.current;
      const contactPanel = document.querySelector(
        '.home-stack-panel--contact'
      );

      let shouldUseContactStyle = false;

      if (
        scrollTopButton instanceof Element &&
        contactPanel instanceof Element
      ) {
        const buttonRect =
          scrollTopButton.getBoundingClientRect();

        const contactRect =
          contactPanel.getBoundingClientRect();

        shouldUseContactStyle =
          buttonRect.bottom > contactRect.top &&
          buttonRect.top < contactRect.bottom &&
          buttonRect.right > contactRect.left &&
          buttonRect.left < contactRect.right;
      }

      /*
       * Sonuç değiştiğinde React state'ini güncelle.
       * Böylece gereksiz her-scroll render'ı oluşmaz.
       */
      if (
        scrollTopContactRef.current !==
        shouldUseContactStyle
      ) {
        scrollTopContactRef.current =
          shouldUseContactStyle;

        setScrollTopOnContact(
          shouldUseContactStyle
        );
      }
    };

    const scheduleUpdate = () => {
      if (frameId === null) {
        frameId =
          window.requestAnimationFrame(
            updateScrollProgress
          );
      }
    };

    updateScrollProgress();

    window.addEventListener(
      'scroll',
      scheduleUpdate,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      scheduleUpdate
    );

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener(
        'scroll',
        scheduleUpdate
      );

      window.removeEventListener(
        'resize',
        scheduleUpdate
      );
    };
  }, [pathname]);

  useEffect(() => {
    const motionPreference = window.matchMedia(REDUCED_MOTION_QUERY);
    const tracked = new WeakSet();
    const pending = new Set();
    const fallbackTimers = new Map();
    const canObserve = 'IntersectionObserver' in window;
    let observer = null;

    const isWithinReadyBoundary = (element) => (
      element.closest(REVEAL_BOUNDARY_SELECTOR)?.dataset.revealReady === 'true'
    );

    const isStackPanelShell = (element) => (
      element.matches(STACK_PANEL_SHELL_SELECTOR)
    );

    const clearRevealStateFromPanelShell = (element) => {
      if (!isWithinReadyBoundary(element)) {
        return;
      }

      const fallbackTimer = fallbackTimers.get(element);
      if (fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer);
        fallbackTimers.delete(element);
      }

      element.classList.remove('reveal-pending', 'is-visible', 'is-revealed');
      pending.delete(element);
      observer?.unobserve(element);
    };

    const reveal = (element) => {
      if (isStackPanelShell(element)) {
        clearRevealStateFromPanelShell(element);
        return;
      }

      const fallbackTimer = fallbackTimers.get(element);
      if (fallbackTimer !== undefined) {
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

    const isController = (element) => {
      if (
        isStackPanelShell(element)
        || !isWithinReadyBoundary(element)
        || !element.matches(REVEAL_CONTROLLER_SELECTOR)
      ) {
        return false;
      }

      if (element.dataset.reveal !== 'item') {
        return true;
      }

      return !element.parentElement?.closest(REVEAL_CONTAINER_SELECTOR);
    };

    const isInViewport = (element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.bottom > 0 && bounds.top < window.innerHeight;
    };

    const prepare = (element) => {
      if (!isController(element) || tracked.has(element)) {
        return;
      }

      tracked.add(element);

      const activeElement = document.activeElement;
      const containsFocus = activeElement instanceof Element
        && element.contains(activeElement);

      if (
        motionPreference.matches
        || !observer
        || isInViewport(element)
        || containsFocus
      ) {
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

    const revealControllerChain = (node) => {
      if (!(node instanceof Element)) {
        return;
      }

      let controller = node.matches(REVEAL_CONTROLLER_SELECTOR)
        ? node
        : node.closest(REVEAL_CONTROLLER_SELECTOR);

      while (controller) {
        if (
          isWithinReadyBoundary(controller)
          && controller.classList.contains('reveal-pending')
        ) {
          reveal(controller);
        }
        controller = controller.parentElement?.closest(REVEAL_CONTROLLER_SELECTOR) || null;
      }
    };

    const getHashTarget = () => {
      if (!window.location.hash || window.location.hash === '#') {
        return null;
      }

      const rawId = window.location.hash.slice(1);
      let targetId = rawId;
      try {
        targetId = decodeURIComponent(rawId);
      } catch {
        // Keep the raw hash when it is not valid URI-encoded text.
      }
      return document.getElementById(targetId);
    };

    const revealCurrentHashTarget = () => {
      const hashTarget = getHashTarget();
      if (hashTarget) {
        revealControllerChain(hashTarget);
      }
    };

    const scan = (root) => {
      if (!root?.querySelectorAll) {
        return;
      }

      if (root instanceof Element && isStackPanelShell(root)) {
        clearRevealStateFromPanelShell(root);
      }
      root.querySelectorAll(STACK_PANEL_SHELL_SELECTOR)
        .forEach(clearRevealStateFromPanelShell);

      if (root instanceof Element && root.matches(REVEAL_CONTROLLER_SELECTOR)) {
        prepare(root);
      }

      root.querySelectorAll(REVEAL_CONTROLLER_SELECTOR).forEach(prepare);
    };

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            scan(node);
          }
        });
      });
      revealCurrentHashTarget();
    });

    const handleRevealBoundaryReady = (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      scan(event.target);
      revealCurrentHashTarget();
    };

    const revealAllPending = () => {
      [...pending].forEach(reveal);
    };

    const handleMotionPreferenceChange = (event) => {
      if (event.matches) {
        revealAllPending();
      }
    };

    const handleFocusIn = (event) => {
      revealControllerChain(event.target);
    };

    document.addEventListener(REVEAL_READY_EVENT, handleRevealBoundaryReady);
    document
      .querySelectorAll(`${REVEAL_BOUNDARY_SELECTOR}[data-reveal-ready="true"]`)
      .forEach(scan);
    revealCurrentHashTarget();
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    motionPreference.addEventListener('change', handleMotionPreferenceChange);
    document.addEventListener('focusin', handleFocusIn);
    window.addEventListener('hashchange', revealCurrentHashTarget);

    return () => {
      motionPreference.removeEventListener('change', handleMotionPreferenceChange);
      document.removeEventListener(REVEAL_READY_EVENT, handleRevealBoundaryReady);
      document.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('hashchange', revealCurrentHashTarget);
      mutationObserver.disconnect();
      revealAllPending();
      observer?.disconnect();
      fallbackTimers.forEach((timer) => window.clearTimeout(timer));
      fallbackTimers.clear();
    };
  }, []);

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
          ref={scrollTopButtonRef}
          className={[
            'scroll-to-top',
            showScrollTop ? 'visible' : '',
            scrollTopOnContact ? 'is-on-contact' : '',
          ]
            .filter(Boolean)
            .join(' ')}
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
