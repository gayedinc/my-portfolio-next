'use client';
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StarSvg, ArrowSvg } from "./Svg";

export default function MyArticles() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const sortByNewest = (items = []) => {
    return [...items].sort((a, b) => {
      const aDate = Date.parse(a?.$createdAt || a?.createdAt || a?.date || 0);
      const bDate = Date.parse(b?.$createdAt || b?.createdAt || b?.date || 0);
      return bDate - aDate;
    });
  };

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

  if (loading) {
    return (
      <div className="myarticlespage reveal-section">
        <div className="section-heading-shell">
          <div className="headtext">
            <h1>{t("articles")}</h1>
            <div className="star-icon">
              <StarSvg />
            </div>
          </div>
          <p className="section-intro">{t('articles_intro')}</p>
        </div>
        <div className="loading">Makaleler yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="myarticlespage reveal-section">
      <div className="section-heading-shell">
        <div className="headtext">
          <h1>{t("articles")}</h1>
          <div className="star-icon">
            <StarSvg />
          </div>
        </div>
        <p className="section-intro">{t('articles_intro')}</p>
      </div>
      <div className="articles-page">
        {articles.map((article, index) => (
          <div className="articles-item-page" key={article.$id}>
            <div className="articles-item-link">
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                <img src={article.image} alt={`${article.title} Photo`} />
              </a>
            </div>
            <div className="articles-card-body">
              <span className="article-chip">{String(index + 1).padStart(2, '0')}</span>
              <h3>{article.title}</h3>
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
          </div>
        ))}
      </div>
    </div>
  );
}