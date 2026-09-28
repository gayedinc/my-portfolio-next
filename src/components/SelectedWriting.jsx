'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { selectHomeArticles } from '../lib/selectedWriting';
import { MaskedHeading } from './Motion';
import { ArrowSvg } from './Svg';
import WritingCard from './WritingCard';
import { useRevealHydrationBoundary } from './useRevealHydration';
import styles from './SelectedWriting.module.css';

export default function SelectedWriting({ initialArticles = [] }) {
  const { t } = useTranslation();
  const [articles, setArticles] = useState(() => selectHomeArticles(initialArticles));
  const [loading, setLoading] = useState(initialArticles.length === 0);
  const revealBoundaryRef = useRevealHydrationBoundary();

  useEffect(() => {
    const controller = new AbortController();

    async function refreshArticles() {
      try {
        const response = await fetch('/api/articles', { signal: controller.signal });
        if (!response.ok) throw new Error(`Articles API: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid articles response');
        setArticles(selectHomeArticles(data));
      } catch (error) {
        if (error.name !== 'AbortError') console.error('Articles could not be loaded:', error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    refreshArticles();
    return () => controller.abort();
  }, []);

  return (
    <section
      ref={revealBoundaryRef}
      className={`selected-writing section-surface ${styles.section}`}
      aria-labelledby="home-articles-heading"
      data-reveal="section"
      data-reveal-boundary="true"
    >
      <div className={`section-heading-shell ${styles.heading}`} data-reveal="copy">
        <span className={styles.eyebrow}>{t('selected_writing.eyebrow')}</span>
        <MaskedHeading as="h2" id="home-articles-heading" className={styles.title}>
          {t('selected_writing.heading')}
        </MaskedHeading>
        <p className={styles.description}>{t('selected_writing.intro')}</p>
      </div>

      {loading ? (
        <p className={styles.description} role="status">{t('articles_loading')}</p>
      ) : articles.length ? (
        <div className={styles.articles}>
          {articles.map((article) => (
            <WritingCard article={article} key={article.$id} />
          ))}
        </div>
      ) : (
        <p className={styles.description} role="status">{t('selected_writing.unavailable')}</p>
      )}

      <div className={styles.allWriting} data-reveal="controls">
        <Link href="/articles" className={`project-inspect-link ${styles.allLink}`}>
          {t('selected_writing.all_cta')}
          <span className="arrow-icon" aria-hidden="true"><ArrowSvg /></span>
        </Link>
      </div>
    </section>
  );
}
