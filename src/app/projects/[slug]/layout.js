import { buildProjectMetadata, getServerLocale } from '../../../lib/siteMetadata';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const projectName = slug === 'qrakter' ? 'QRakter' : 'HasarLink';

  return buildProjectMetadata({ locale: await getServerLocale(), projectName });
}

export default function DesignProjectLayout({ children }) {
  return children;
}
