'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { articleFilters, filterArticles, normalizeArticleFilter } from '../lib/articleCategories';
import { MaskedHeading } from './Motion';
import WritingCard from './WritingCard';
import { useRevealHydrationBoundary } from './useRevealHydration';
import styles from './MyArticles.module.css';

export default function MyArticles({ initialArticles = null }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = normalizeArticleFilter(searchParams.get('category'));
  const [articles, setArticles] = useState(() => initialArticles || []);
  const [loading, setLoading] = useState(!Array.isArray(initialArticles));
  const revealBoundaryRef = useRevealHydrationBoundary();
  const visibleArticles = filterArticles(articles, activeCategory);

  useEffect(() => {
    const controller = new AbortController();

    async function refreshArticles() {
      try {
        const response = await fetch('/api/articles', { signal: controller.signal });
        if (!response.ok) throw new Error(`Articles API: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid articles response');
        setArticles(data);
      } catch (error) {
        if (error.name !== 'AbortError') console.error('Articles could not be loaded:', error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    refreshArticles();
    return () => controller.abort();
  }, []);

  const selectCategory = (category) => {
    if (category === activeCategory) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', category);
    // Next.js synchronizes native history with useSearchParams. No data reload
    // or scroll reset is needed; browser Back/Forward restores the same filter.
    window.history.pushState(null, '', `${pathname}?${params.toString()}${window.location.hash}`);
  };

  return (
    <main
      ref={revealBoundaryRef}
      className={`myarticlespage section-surface surface-neutral ${styles.page}`}
      aria-labelledby="articles-heading"
      data-reveal="section"
      data-reveal-boundary="true"
    >
      <div className="section-heading-shell" data-reveal="copy">
        <div className="headtext">
          <MaskedHeading as="h1" id="articles-heading" className="section-title">
            {t('articles')}
          </MaskedHeading>
        </div>
        <p className={styles.description}>{t('article_library.intro')}</p>
      </div>

      <div className={styles.filters} role="group" aria-label={t('article_library.filter_label')}>
        {articleFilters.map((category) => (
          <button
            key={category}
            type="button"
            className={styles.filter}
            data-filter={category}
            aria-pressed={category === activeCategory}
            aria-controls="article-results"
            onClick={() => selectCategory(category)}
          >
            {t(`article_library.categories.${category}`)}
          </button>
        ))}
      </div>

      <p className={styles.count} role="status" aria-live="polite" aria-atomic="true">
        {loading ? t('articles_loading') : t('article_library.result_count', { count: visibleArticles.length })}
      </p>
      <div id="article-results" aria-busy={loading}>
        {!loading && (visibleArticles.length ? (
          <div className={styles.grid} key={activeCategory}>
            {visibleArticles.map((article) => (
              <WritingCard article={article} key={article.$id} headingAs="h2" />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>{t('article_library.empty')}</p>
        ))}
      </div>
    </main>
  );
}
