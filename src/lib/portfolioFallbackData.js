import 'server-only';

import portfolioData from '../../public/data/data.json';

function createStableId(prefix, value, index) {
  const slug = String(value || index)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${prefix}-${slug || index}`;
}

export function getFallbackProjects() {
  return portfolioData.projects.map((project, index) => ({
    ...project,
    $id: createStableId('frontend', project.title, index),
    projectType: 'frontend',
    // The legacy JSON references image files that are not in this repository.
    // Keep the real project content and links while rendering a safe title card.
    image: null,
    isPlaceholder: true,
  }));
}

export function getFallbackArticles() {
  return portfolioData.articles.map((article, index) => ({
    ...article,
    $id: createStableId('article', article.title, index),
    image: null,
    isPlaceholder: true,
  }));
}

export function getFallbackDesignProjects() {
  return [
    {
      $id: 'design-hasarlink',
      title: 'HasarLink',
      slug: 'hasarlink',
      projectType: 'uiux',
      heroImageUrl: '/images/hasarlink/hero/web-masaustu.png',
    },
    {
      $id: 'design-qrakter',
      title: 'Zayfix QRakter',
      slug: 'qrakter',
      projectType: 'uiux',
      heroImageUrl: '/images/qrakter/zayfix-anasayfa.png',
    },
  ];
}
