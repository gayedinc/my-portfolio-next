import 'server-only';

import {
  getAppwriteStorageFileUrl,
  getArticles,
  getDesignProjects,
  getProjects,
} from '../appwrite';

export async function loadInitialArticles() {
  try {
    return await getArticles();
  } catch (error) {
    console.error('Initial articles could not be loaded:', error);
    return [];
  }
}

export async function loadInitialProjects() {
  const [projectsResult, designProjectsResult] = await Promise.allSettled([
    getProjects(),
    getDesignProjects(),
  ]);

  if (projectsResult.status === 'rejected') {
    console.error('Initial frontend projects could not be loaded:', projectsResult.reason);
  }

  if (designProjectsResult.status === 'rejected') {
    console.error('Initial design projects could not be loaded:', designProjectsResult.reason);
  }

  const designProjects = designProjectsResult.status === 'fulfilled'
    ? designProjectsResult.value.map((project) => ({
        ...project,
        heroImageUrl: getAppwriteStorageFileUrl(project.heroImageId),
      }))
    : [];

  return {
    projects: projectsResult.status === 'fulfilled' ? projectsResult.value : [],
    designProjects,
  };
}
