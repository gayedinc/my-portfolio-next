import { buildPageMetadata, getServerLocale } from '../../lib/siteMetadata';

export async function generateMetadata() {
  return buildPageMetadata({ locale: await getServerLocale(), page: 'projects' });
}

export default function ProjectsLayout({ children }) {
  return children;
}
