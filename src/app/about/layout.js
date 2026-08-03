import { buildPageMetadata, getServerLocale } from '../../lib/siteMetadata';

export async function generateMetadata() {
  return buildPageMetadata({ locale: await getServerLocale(), page: 'about' });
}

export default function AboutLayout({ children }) {
  return children;
}
