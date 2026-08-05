import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import HasarLinkCaseStudy from '../../../components/HasarLinkCaseStudy';
import QRakterCaseStudy from '../../../components/QRakterCaseStudy';

export function generateStaticParams() {
  return [{ slug: 'hasarlink' }, { slug: 'qrakter' }];
}

export default async function DesignProjectPage({ params }) {
  const { slug } = await params;

  if (!['hasarlink', 'qrakter'].includes(slug)) {
    notFound();
  }

  return (
    <>
      <Header />
      {slug === 'qrakter' ? <QRakterCaseStudy /> : <HasarLinkCaseStudy />}
    </>
  );
}
