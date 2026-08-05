import React from 'react';
import Header from '../../components/Header';
import MyArticles from '../../components/MyArticles';
import { loadInitialArticles } from '../../lib/serverPortfolioData';

export const revalidate = 60;

export default async function ArticlesPage() {
  const articles = await loadInitialArticles();

  return (
    <>
      <Header />
      <MyArticles initialArticles={articles} />
    </>
  );
}
