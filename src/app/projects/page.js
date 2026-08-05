import React, { Suspense } from 'react';
import Header from '../../components/Header';
import Project from '../../components/Project';
import { loadInitialProjects } from '../../lib/serverPortfolioData';

export const revalidate = 60;

export default async function ProjectsPage() {
  const { projects, designProjects } = await loadInitialProjects();

  return (
    <>
      <Header />
      <Suspense fallback={<div className="loading" aria-live="polite" />}>
        <Project
          variant="editorial"
          initialProjects={projects}
          initialDesignProjects={designProjects}
        />
      </Suspense>
    </>
  );
}
