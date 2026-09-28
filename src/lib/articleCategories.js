export const articleCategories = ['ux-product', 'frontend', 'react', 'javascript'];
export const articleFilters = ['all', ...articleCategories];
export const defaultArticleCategory = 'ux-product';

// Appwrite currently has no category field. Keep the editorial classification
// keyed by immutable document ID; titles, links and images stay in Appwrite.
const categoriesById = {
  '6849e0aa002850bbea46': 'frontend', // Creating a Next.js project
  '6849e0b9000d98a5cb86': 'frontend', // Next.js overview
  '6849e0c70023cad8bef2': 'frontend', // Git / GitHub project workflow
  '6849e0d600117387c194': 'javascript', // EventTarget / dispatchEvent
  '6849e0e000348515c91f': 'react', // useContext
  '6849e0ed001302c0e6e6': 'react', // React pagination
  '6849e0f8001426731459': 'react', // useEffect
  '6849e103003cff348412': 'react', // useRef
  '6849e1140014cb5b61b5': 'react', // React keys
  '6849e11e00167e6c746a': 'frontend', // Optimistic UI in SPAs
  '6849e1270028ce093748': 'react', // React modal / form handling
  '6849e131002dc439357c': 'react', // Prop drilling
  '6849e13f001b05201344': 'javascript', // Spread operator
  '6849e1500005a44cb007': 'javascript', // Method chaining
  '6849e15a000dea347d31': 'javascript', // JavaScript modules
  '6849e165001053f988f8': 'frontend', // HTML form elements
  '6849e170002e704db0bd': 'javascript', // Value / reference types
  '6849e17c002ba6bad05b': 'javascript', // Arrow functions
  '6849e18700082dd470be': 'javascript', // Loops
  '69d55e600036f3383d57': 'ux-product', // Introduction to UX
  '69d6a194002fc4843322': 'ux-product', // Design Thinking
  '69df71b5002d8ca54b93': 'ux-product', // Color, hierarchy and contrast
  '69df71ef0027357a3bad': 'ux-product', // UX Laws
  '69df7238002c735246e0': 'ux-product', // Empathy in UX
  '6a70a4bc00396cc7d199': 'ux-product', // Prototyping and user flows
};

export function getArticleCategory(article) {
  // A future explicit category in the source takes precedence over this map.
  return articleCategories.includes(article.category)
    ? article.category
    : categoriesById[article.$id] || null;
}

export function normalizeArticleFilter(value) {
  return articleFilters.includes(value) ? value : defaultArticleCategory;
}

export function filterArticles(articles, category) {
  const filter = normalizeArticleFilter(category);
  // Unclassified new articles remain accessible under All.
  return filter === 'all' ? articles : articles.filter((article) => getArticleCategory(article) === filter);
}
