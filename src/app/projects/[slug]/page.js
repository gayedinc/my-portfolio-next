import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import HasarLinkCaseStudy from '../../../components/HasarLinkCaseStudy';

export default async function DesignProjectPage({ params }) {
  const { slug } = await params;

  if (slug !== 'hasarlink') {
    notFound();
  }

  return (
    <>
      <Header />
      <HasarLinkCaseStudy />
    </>
  );
}
