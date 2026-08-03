import { buildPageMetadata, getServerLocale } from '../../lib/siteMetadata';

export async function generateMetadata() {
  return buildPageMetadata({ locale: await getServerLocale(), page: 'articles' });
}

export default function ArticlesLayout({ children }) {
  return children;
}
