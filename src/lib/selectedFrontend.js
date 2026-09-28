// These existing source keys identify projects across Appwrite and legacy data.
// The order is editorial; incoming API order and new projects do not change it.
export const selectedFrontendKeys = [
  'entertainment_web_app_text',
  'product_feedback_text',
  'kanban_text',
  'markdown_editor_text',
];

// Stack information is verified against the existing project descriptions and
// repositories. Names, media and destination URLs remain in the central source.
export const frontendPresentation = {
  entertainment_web_app_text: { copyKey: 'entertainment', stack: ['Next.js', 'Supabase'] },
  product_feedback_text: { copyKey: 'feedback', stack: ['React', 'localStorage'] },
  kanban_text: { copyKey: 'kanban', stack: ['React', 'localStorage'] },
  markdown_editor_text: { copyKey: 'markdown', stack: ['React', 'marked-react', 'localStorage'] },
};

export function selectFrontendProjects(projects = []) {
  const byKey = new Map(projects
    .filter((project) => !project.projectType || project.projectType === 'frontend')
    .map((project) => [project.descriptionKey, project]));
  return selectedFrontendKeys.map((key) => byKey.get(key)).filter(Boolean);
}

export function getFrontendGithubProfile(projects = []) {
  // Reuse the personal repository URL already stored for Entertainment.
  // Team repositories belong to an academy organization, not the owner profile.
  const project = projects.find((item) => item.descriptionKey === 'entertainment_web_app_text');
  try {
    const url = new URL(project?.githubLink);
    const [owner, repository] = url.pathname.split('/').filter(Boolean);
    return url.protocol === 'https:' && url.hostname === 'github.com' && owner && repository
      ? `${url.origin}/${owner}`
      : null;
  } catch {
    return null;
  }
}
