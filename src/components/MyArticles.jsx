'use client';
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StarSvg, ArrowSvg } from "./Svg";

export default function MyArticles() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((data) => setArticles(data.articles));
  }, []);

  return (
    <div className="myarticlespage">
      <div className="headtext">
        <h1>{t("articles")}</h1>
        <div className="star-icon">
          <StarSvg />
        </div>
      </div>
      <div className="articles-page">
        {articles.map((article, index) => (
          <div className="articles-item-page" key={index}>
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