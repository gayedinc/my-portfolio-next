// Curated Appwrite document IDs, in homepage display order:
// prototyping/user flows, Design Thinking, UX Laws.
// Titles and URLs always come from the central articles source.
export const featuredArticleIds = [
  '6a70a4bc00396cc7d199',
  '69d6a194002fc4843322',
  '69df71ef0027357a3bad',
];

export function selectHomeArticles(articles = []) {
  const byId = new Map(articles.map((article) => [article.$id, article]));
  return featuredArticleIds.map((id) => byId.get(id)).filter(Boolean);
}
