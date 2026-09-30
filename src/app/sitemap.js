import { SITE_URL } from '../lib/siteMetadata';

// Date of the latest site content/metadata revision, not the crawl time.
const lastModified = '2026-09-30';

export default function sitemap() {
  return [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/projects', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/articles', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/projects/hasarlink', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/projects/qrakter', changeFrequency: 'monthly', priority: 0.8 },
  ].map(({ path, ...entry }) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified,
    ...entry,
  }));
}
