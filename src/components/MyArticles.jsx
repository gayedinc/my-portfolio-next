'use client';
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowSvg } from "./Svg";
import { MaskedHeading } from './Motion';
import { useRevealHydrationBoundary } from './useRevealHydration';

export default function MyArticles({ initialArticles = null }) {
  const { t } = useTranslation();
  const hasInitialArticles = Array.isArray(initialArticles);
  const [articles, setArticles] = useState(() => sortByNewest(initialArticles || []));
  const [loading, setLoading] = useState(!hasInitialArticles);
  const revealBoundaryRef = useRevealHydrationBoundary();

  function sortByNewest(items = []) {
    return [...items].sort((a, b) => {
      const aDate = Date.parse(a?.$createdAt || a?.createdAt || a?.date || 0);
      const bDate = Date.parse(b?.$createdAt || b?.createdAt || b?.date || 0);
      return bDate - aDate;
    });
  }

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) throw new Error('Makaleler yüklenemedi');
        const data = await response.json();
        setArticles(sortByNewest(data));
      } catch (error) {
        console.error("Makaleler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const headingBlock = (
    <div className="section-heading-shell" data-reveal="copy">
      <div className="headtext">
        <MaskedHeading as="h1" id="articles-heading" className="section-title">
          {t('articles')}
        </MaskedHeading>
      </div>
      <p className="section-intro">{t('articles_intro')}</p>
    </div>
  );

  if (loading) {
    return (
      <main
        ref={revealBoundaryRef}
        className="myarticlespage reveal-section section-surface surface-neutral"
        aria-labelledby="articles-heading"
        data-reveal="section"
        data-reveal-boundary="true"
      >
        {headingBlock}
        <div className="loading">Makaleler yükleniyor...</div>
      </main>
    );
  }

  return (
    <main
      ref={revealBoundaryRef}
      className="myarticlespage reveal-section section-surface surface-neutral"
      aria-labelledby="articles-heading"
      data-reveal="section"
      data-reveal-boundary="true"
    >
      {headingBlock}
      <div className="articles-page">
        {articles.map((article, index) => (
          <article className="articles-item-page" key={article.$id} data-reveal="card">
            <div className="articles-item-link">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={article.title}
              >
                <img
                  src={article.image}
                  alt={`${article.title} Photo`}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>
            <div className="articles-card-body">
              <span className="article-chip">{String(index + 1).padStart(2, '0')}</span>
              <h2>{article.title}</h2>
              <a
                className="articles-arrow-link"
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${article.title} article link`}
              >
                <ArrowSvg />
              </a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
