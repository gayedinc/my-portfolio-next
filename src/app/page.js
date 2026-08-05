import HomePageClient from '../components/HomePageClient';
import { loadInitialArticles, loadInitialProjects } from '../lib/serverPortfolioData';

export const revalidate = 60;

export default async function HomePage() {
  const [{ projects, designProjects }, articles] = await Promise.all([
    loadInitialProjects(),
    loadInitialArticles(),
  ]);

  return (
    <HomePageClient
      initialArticles={articles}
      initialProjects={projects}
      initialDesignProjects={designProjects}
    />
  );
}
