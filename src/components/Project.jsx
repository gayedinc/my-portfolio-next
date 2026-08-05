'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from "react-i18next";
import { ArrowSvg } from "./Svg";
import { MaskedHeading } from './Motion';

const getProjectType = (project) => project.projectType || 'frontend';

export default function Project({
  headingHref,
  variant = 'folder',
  limit,
  initialProjects = null,
  initialDesignProjects = null,
}) {
  const { t } = useTranslation();
  const hasInitialData = Array.isArray(initialProjects) && Array.isArray(initialDesignProjects);
  const [projectsData, setProjectsData] = useState(initialProjects || []);
  const [designProjects, setDesignProjects] = useState(initialDesignProjects || []);
  const [loading, setLoading] = useState(!hasInitialData);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectCardsRef = useRef({});
  const isFolderView = variant === 'folder';
  const isProjectsPage = pathname === '/projects';
  const OverviewHeading = headingHref ? 'h3' : 'h2';
  const projectIdToFocus = searchParams.get('projectId');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [projectsResponse, designProjectsResponse] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/design-projects'),
        ]);
        if (!projectsResponse.ok) throw new Error('Projeler yüklenemedi');
        if (!designProjectsResponse.ok) throw new Error('UI/UX projeleri yüklenemedi');
        const [projects, uiuxProjects] = await Promise.all([
          projectsResponse.json(),
          designProjectsResponse.json(),
        ]);
        setProjectsData(projects);
        setDesignProjects(uiuxProjects);
      } catch (error) {
        console.error("Projeler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (loading || !isProjectsPage || !projectIdToFocus) {
      return undefined;
    }

    const targetCard = projectCardsRef.current[projectIdToFocus];
    if (!targetCard) {
      return undefined;
    }

    let removeFocusTimeoutId;
    const timeoutId = window.setTimeout(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      targetCard.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center',
      });
      targetCard.classList.add('project-card-focus');

      removeFocusTimeoutId = window.setTimeout(() => {
        targetCard.classList.remove('project-card-focus');
      }, 2200);
    }, 260);

    return () => {
      window.clearTimeout(timeoutId);
      if (removeFocusTimeoutId) {
        window.clearTimeout(removeFocusTimeoutId);
      }
      targetCard.classList.remove('project-card-focus');
    };
  }, [loading, isProjectsPage, projectIdToFocus, projectsData]);

  useEffect(() => {
    if (loading || !isProjectsPage) {
      return;
    }

    const sectionId = window.location.hash.slice(1);
    if (sectionId === 'uiux-projects-heading' || sectionId === 'frontend-projects-heading') {
      document.getElementById(sectionId)?.scrollIntoView({ block: 'start' });
    }
  }, [loading, isProjectsPage]);

  const visibleProjects = useMemo(() => {
    if (!limit) {
      return projectsData;
    }
    return projectsData.slice(0, limit);
  }, [projectsData, limit]);

  const frontendProjects = useMemo(
    () => visibleProjects.filter((project) => getProjectType(project) === 'frontend'),
    [visibleProjects]
  );

  const renderProjectCards = (projects) => projects.map((project, index) => {
    const isUiUxProject = getProjectType(project) === 'uiux';
    const descriptionKey = isUiUxProject ? `${project.slug}_card_description` : project.descriptionKey;
    const hasCaseStudy = isUiUxProject && ['hasarlink', 'qrakter'].includes(project.slug);
    const imageSource = isUiUxProject ? project.heroImageUrl : project.image;
    const isPlaceholder = Boolean(project.isPlaceholder || !imageSource);
    const caseStudyLabel = project.slug === 'qrakter'
      ? t('qrakter_view_case_study')
      : t('view_case_study');
    const placeholderVisual = (
      <div className="project-placeholder-visual" aria-hidden="true">
        <span>{project.title}</span>
      </div>
    );
    const projectVisual = isPlaceholder ? (
      hasCaseStudy ? (
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`${caseStudyLabel}: ${project.title}`}
        >
          {placeholderVisual}
        </Link>
      ) : placeholderVisual
    ) : hasCaseStudy ? (
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`${caseStudyLabel}: ${project.title}`}
      >
        <img src={imageSource} alt={project.title} loading="lazy" decoding="async" />
      </Link>
    ) : isUiUxProject ? (
      <img src={imageSource} alt={project.title} loading="lazy" decoding="async" />
    ) : (
      <a
        href={project.liveLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title}: ${t('link')}`}
      >
        <img
          src={imageSource}
          alt={`${project.title} Photo`}
          loading="lazy"
          decoding="async"
        />
      </a>
    );

    return (
      <li
        ref={(element) => {
          if (element) {
            projectCardsRef.current[project.$id] = element;
          } else {
            delete projectCardsRef.current[project.$id];
          }
        }}
        data-project-id={project.$id}
        data-project-group={isUiUxProject ? 'uiux' : 'frontend'}
        data-project-index={index}
        data-project-slug={project.slug || ''}
        data-reveal="card"
        className={isFolderView
          ? 'project-item project-item-folder'
          : `project-item project-item-editorial ${index % 2 === 1 ? 'project-item-reverse' : ''}`}
        key={project.$id}
      >
        <div className={`project-img ${isPlaceholder ? 'project-img-placeholder' : ''}`}>
          <span className="project-image-glow" aria-hidden="true" />
          {projectVisual}
        </div>
        <div className="project-info">
          <div className="project-meta">
            <span>{isUiUxProject ? t('design_project_case_study_label') : 'FRONTEND DEVELOPMENT'}</span>
          </div>
          <h3>{project.title}</h3>
          <p className={isFolderView ? 'project-description-clamp' : ''}>{t(descriptionKey, { defaultValue: '' })}</p>
          {hasCaseStudy ? (
            <div className="project-folder-actions">
              <Link
                href={`/projects/${project.slug}`}
                className="project-inspect-link"
                aria-label={`${caseStudyLabel}: ${project.title}`}
              >
                {caseStudyLabel}
                <span className="arrow-icon"><ArrowSvg /></span>
              </Link>
            </div>
          ) : isFolderView ? (
            !isPlaceholder && (
              <div className="project-folder-actions">
                <Link
                  href={`/projects?projectId=${encodeURIComponent(project.$id)}`}
                  className="project-inspect-link"
                  aria-label={`${t('inspect_project')}: ${project.title}`}
                >
                  {t('inspect_project')}
                  <span className="arrow-icon">
                    <ArrowSvg />
                  </span>
                </Link>
              </div>
            )
          ) : (
            !isPlaceholder && (
              <div className="link-area">
                <div className="github-link">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GitHub: ${project.title}`}
                  >
                    GITHUB
                    <span className="arrow-icon"><ArrowSvg /></span>
                  </a>
                </div>
                <div className="live-link">
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('link')}: ${project.title}`}
                  >
                    {t("link")}
                    <span className="arrow-icon"><ArrowSvg /></span>
                  </a>
                </div>
              </div>
            )
          )}
        </div>
      </li>
    );
  });

  const surfaceClasses = isFolderView
    ? 'section-surface surface-soft-pink'
    : 'section-surface surface-default';
  const projectHeading = (
    <MaskedHeading
      as={headingHref ? 'h2' : 'h1'}
      id="projects-heading"
      className="section-title"
    >
      {t('projects')}
    </MaskedHeading>
  );
  const headingBlock = (
    <div className="section-heading-shell" data-reveal="copy">
      {headingHref ? (
        <Link href={headingHref} className="headtext interactive-heading section-heading-link">
          {projectHeading}
        </Link>
      ) : (
        <div className="headtext">{projectHeading}</div>
      )}
      <p className="section-intro">
        {t(isProjectsPage ? 'projects_intro' : 'home_work_intro')}
      </p>
    </div>
  );
  const RootElement = isProjectsPage ? 'main' : 'section';

  if (loading && isProjectsPage) {
    return (
      <RootElement
        className={`myprojects reveal-section ${isFolderView ? 'myprojects-folder' : ''} ${surfaceClasses}`}
        aria-labelledby="projects-heading"
        data-reveal="section"
      >
        {headingBlock}
        <div className="loading">{t('projects_loading')}</div>
      </RootElement>
    );
  }

  return (
    <RootElement
      className={`myprojects reveal-section ${isFolderView ? 'myprojects-folder' : ''} ${surfaceClasses}`}
      aria-labelledby="projects-heading"
      data-reveal="section"
    >
      {headingBlock}
      {isProjectsPage ? (
        <div className="project-groups">
          <section className="project-group" aria-labelledby="uiux-projects-heading" data-reveal="group">
            <MaskedHeading as="h2" id="uiux-projects-heading" className="project-group-title">
              {t('uiux_projects')}
            </MaskedHeading>
            <p className="section-intro">{t('uiux_projects_intro')}</p>
            <ul className="projectlist projectlist-editorial">
              {renderProjectCards(designProjects)}
            </ul>
          </section>
          <section className="project-group" aria-labelledby="frontend-projects-heading" data-reveal="group">
            <MaskedHeading as="h2" id="frontend-projects-heading" className="project-group-title">
              {t('frontend_projects')}
            </MaskedHeading>
            <p className="section-intro">{t('frontend_projects_intro')}</p>
            <ul className="projectlist projectlist-editorial">
              {renderProjectCards(frontendProjects)}
            </ul>
          </section>
        </div>
      ) : (
        <ul className="work-overview">
          <li className="about-item work-overview-card" data-reveal="card">
            <div className="work-overview-header">
              <span className="project-meta">UI/UX</span>
              <strong>{designProjects.length} {t('case_study_count_label')}</strong>
            </div>
            <OverviewHeading>{t('uiux_projects')}</OverviewHeading>
            <p>{t('uiux_overview_description')}</p>
            <ul className="work-overview-tags" aria-label={t('uiux_projects')}>
              {designProjects.map((project) => <li key={project.$id}>{project.title}</li>)}
            </ul>
            <Link href="/projects#uiux-projects-heading" className="project-inspect-link">
              {t('view_case_studies')}
              <span className="arrow-icon"><ArrowSvg /></span>
            </Link>
          </li>
          <li className="about-item work-overview-card" data-reveal="card">
            <div className="work-overview-header">
              <span className="project-meta">FRONTEND</span>
              <strong>{t('frontend_project_count')}</strong>
            </div>
            <OverviewHeading>{t('frontend_projects')}</OverviewHeading>
            <p>{t('frontend_overview_description')}</p>
            <ul className="work-overview-tags" aria-label={t('frontend_technologies')}>
              <li>React</li>
              <li>Next.js</li>
              <li>JavaScript</li>
              <li>REST API</li>
              <li>Responsive Web</li>
            </ul>
            <Link href="/projects#frontend-projects-heading" className="project-inspect-link">
              {t('view_all_projects')}
              <span className="arrow-icon"><ArrowSvg /></span>
            </Link>
          </li>
        </ul>
      )}
    </RootElement>
  );
}
