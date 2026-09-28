'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { frontendPresentation, getFrontendGithubProfile, selectFrontendProjects } from '../lib/selectedFrontend';
import { MaskedHeading } from './Motion';
import { ArrowSvg } from './Svg';
import styles from './SelectedFrontendWork.module.css';

export default function SelectedFrontendWork({ projects, projectCardsRef }) {
  const { t } = useTranslation();
  const selected = selectFrontendProjects(projects);
  const githubProfile = getFrontendGithubProfile(projects);

  return (
    <section
      className={`project-group ${styles.section}`}
      aria-labelledby="frontend-projects-heading"
      data-reveal="group"
    >
      <div className={styles.heading} data-reveal="copy">
        <MaskedHeading as="h2" id="frontend-projects-heading" className={styles.title}>
          {t('selected_frontend.heading')}
        </MaskedHeading>
        <p className={styles.description}>{t('selected_frontend.intro')}</p>
      </div>

      <ul className={styles.grid} role="list">
        {selected.map((project) => {
          const { copyKey, stack } = frontendPresentation[project.descriptionKey];
          return (
            <li
              key={project.$id}
              ref={(element) => {
                if (element) projectCardsRef.current[project.$id] = element;
                else delete projectCardsRef.current[project.$id];
              }}
              className={styles.card}
              data-project-id={project.$id}
              data-project-group="frontend"
              aria-labelledby={`frontend-${project.$id}`}
              data-reveal="card"
            >
              {project.image && !project.isPlaceholder && (
                <div className={styles.media}>
                  <Image
                    src={project.image}
                    alt={t('selected_frontend.image_alt', { name: project.title })}
                    fill
                    sizes="(min-width: 48rem) 45vw, 90vw"
                    unoptimized
                    className={styles.image}
                  />
                </div>
              )}
              <div className={styles.content}>
                <span className={styles.category}>{t(`selected_frontend.projects.${copyKey}.category`)}</span>
                <h3 id={`frontend-${project.$id}`} className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.description}>{t(`selected_frontend.projects.${copyKey}.description`)}</p>
                <p className={styles.stack}>{stack.join(' · ')}</p>
                <div className={styles.actions}>
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`project-inspect-link ${styles.projectLink}`}
                      aria-label={`${t('selected_frontend.view_project')}: ${project.title}`}
                    >
                      {t('selected_frontend.view_project')}
                      <span className="arrow-icon" aria-hidden="true"><ArrowSvg /></span>
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.repositoryLink}
                      aria-label={t('selected_frontend.repository_label', { name: project.title })}
                    >
                      {t('selected_frontend.repository_cta')}
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {githubProfile && (
        <div className={styles.archive} data-reveal="copy">
          <div>
            <h3 className={styles.archiveTitle}>{t('selected_frontend.archive_heading')}</h3>
            <p className={styles.description}>{t('selected_frontend.archive_intro')}</p>
          </div>
          <a href={githubProfile} target="_blank" rel="noopener noreferrer" className={`project-inspect-link ${styles.projectLink}`}>
            {t('selected_frontend.archive_cta')}
            <span className="arrow-icon" aria-hidden="true"><ArrowSvg /></span>
          </a>
        </div>
      )}
    </section>
  );
}
