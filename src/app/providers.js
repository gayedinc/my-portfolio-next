'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '../components/ThemeContext';
import { Toaster } from 'react-hot-toast';
import '../i18n';

export function Providers({ children }) {
  const pathname = usePathname();

  // React Strict Mode'da çift yüklemeyi önlemek için
  useEffect(() => {
    // i18n başlatılması client tarafında
  }, []);

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

    scanSections(document);
    revealPendingInViewport();

    const onScrollOrResize = () => {
      revealPendingInViewport();
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

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

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      pending.clear();
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <ThemeProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      {children}
    </ThemeProvider>
  );
}