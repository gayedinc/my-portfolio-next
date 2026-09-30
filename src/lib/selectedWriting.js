export function selectHomeArticles(articles = []) {
  // Appwrite already returns articles newest first by $createdAt.
  return articles.slice(0, 3);
}
