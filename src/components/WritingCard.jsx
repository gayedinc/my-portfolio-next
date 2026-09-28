'use client';

import { useTranslation } from 'react-i18next';
import { getArticleCategory } from '../lib/articleCategories';
import { ArrowSvg } from './Svg';
import styles from './WritingCard.module.css';

export default function WritingCard({ article, headingAs: Heading = 'h3' }) {
  const { t } = useTranslation();
  const category = getArticleCategory(article);
  const excerpt = article.excerpt || article.description;

  return (
    <article
      className={styles.card}
      data-article-id={article.$id}
      data-category={category || 'uncategorized'}
      aria-labelledby={`writing-${article.$id}`}
    >
      <div className={styles.meta}>
        <span className={styles.category}>{t(`article_library.categories.${category || 'uncategorized'}`)}</span>
        <span className={styles.source}>{t('selected_writing.source')}</span>
      </div>
      <Heading id={`writing-${article.$id}`} className={styles.title} lang="tr">
        {article.title}
      </Heading>
      {excerpt && <p className={styles.excerpt} lang="tr">{excerpt}</p>}
      <div className={styles.footer}>
        <a
          className={styles.readLink}
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-labelledby={`writing-cta-${article.$id} writing-${article.$id}`}
        >
          <span id={`writing-cta-${article.$id}`}>{t('selected_writing.read_cta')}</span>
          <span className={`arrow-icon ${styles.arrow}`} aria-hidden="true"><ArrowSvg /></span>
        </a>
      </div>
    </article>
  );
}
