'use client';
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StarSvg, ArrowSvg } from "./Svg";
import databases from "../appwrite";

export default function MyArticles() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const articlesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_ARTICLES_COLLECTION_ID;

    if (databaseId && articlesCollectionId) {
      databases.listDocuments(databaseId, articlesCollectionId)
        .then(response => {
          setArticles(response.documents);
          setLoading(false);
        })
        .catch(error => {
          console.error("Makaleler yüklenirken hata oluştu:", error);
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return (
      <div className="myarticlespage">
        <div className="headtext">
          <h1>{t("articles")}</h1>
          <div className="star-icon">
            <StarSvg />
          </div>
        </div>
        <div className="loading">Makaleler yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="myarticlespage">
      <div className="headtext">
        <h1>{t("articles")}</h1>
        <div className="star-icon">
          <StarSvg />
        </div>
      </div>
      <div className="articles-page">
        {articles.map((article) => (
          <div className="articles-item-page" key={article.$id}>
            <div className="articles-item-link">
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                <img src={article.image} alt={`${article.title} Photo`} />
              </a>
            </div>
            <div className="articles-info">
              <h3>{article.title}</h3>
              <div className="arrow-icon">
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                  <ArrowSvg />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}