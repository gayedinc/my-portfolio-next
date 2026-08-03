import { buildPageMetadata, getServerLocale } from '../../lib/siteMetadata';

export async function generateMetadata() {
  return buildPageMetadata({ locale: await getServerLocale(), page: 'contact' });
}

export default function ContactLayout({ children }) {
  return children;
}
