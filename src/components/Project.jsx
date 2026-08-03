'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from "react-i18next";
import { StarSvg, ArrowSvg } from "./Svg";

const getProjectType = (project) => project.projectType || 'frontend';

export default function Project({ onHeadingClick, variant = 'folder', limit }) {
  const { t } = useTranslation();
  const [projectsData, setProjectsData] = useState([]);
  const [designProjects, setDesignProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectCardsRef = useRef({});
  const isFolderView = variant === 'folder';
  const isProjectsPage = pathname === '/projects';
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
    if (loading || !isProjectsPage) {
      return undefined;
    }

    const nodes = Object.values(projectCardsRef.current).filter(Boolean);
    if (!nodes.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('project-card-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px 22% 0px',
      }
    );

    const firstUiUxCard = nodes.find((node) => node.dataset.projectSlug === 'hasarlink')
      || nodes.find(
        (node) => node.dataset.projectGroup === 'uiux' && node.dataset.projectIndex === '0'
      );
    let revealTimeoutId;
    const revealFrameId = window.requestAnimationFrame(() => {
      revealTimeoutId = window.setTimeout(() => {
        firstUiUxCard?.classList.add('project-card-visible');
      }, 80);
    });

    nodes.forEach((node) => {
      if (node !== firstUiUxCard) {
        observer.observe(node);
      }
    });

    return () => {
      window.cancelAnimationFrame(revealFrameId);
      if (revealTimeoutId) {
        window.clearTimeout(revealTimeoutId);
      }
      observer.disconnect();
    };
  }, [loading, isProjectsPage, projectsData, designProjects]);

  useEffect(() => {
    if (loading || !isProjectsPage || !projectIdToFocus) {
      return undefined;
    }

    const targetCard = projectCardsRef.current[projectIdToFocus];
    if (!targetCard) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetCard.classList.add('project-card-focus');

      window.setTimeout(() => {
        targetCard.classList.remove('project-card-focus');
      }, 2200);
    }, 260);

    return () => {
      window.clearTimeout(timeoutId);
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
    const isPlaceholder = isUiUxProject || project.isPlaceholder;
    const hasCaseStudy = isUiUxProject && project.slug === 'hasarlink';
    const placeholderVisual = (
      <div className="project-placeholder-visual" aria-hidden="true">
        <span>{project.title}</span>
      </div>
    );

    return (
      <li
        ref={(element) => {
          projectCardsRef.current[project.$id] = element;
        }}
        data-project-id={project.$id}
        data-project-group={isUiUxProject ? 'uiux' : 'frontend'}
        data-project-index={index}
        data-project-slug={project.slug || ''}
        className={isFolderView
          ? `project-item project-item-folder ${isProjectsPage ? 'project-card-scroll-grow' : ''}`
          : `project-item project-item-editorial project-card-scroll-grow ${index % 2 === 1 ? 'project-item-reverse' : ''}`}
        key={project.$id}
      >
        <div className={`project-img ${isPlaceholder ? 'project-img-placeholder' : ''}`}>
          <span className="project-image-glow" aria-hidden="true" />
          {isPlaceholder ? (
            hasCaseStudy ? <Link href={`/projects/${project.slug}`}>{placeholderVisual}</Link> : placeholderVisual
          ) : (
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
              <img src={project.image} alt={`${project.title} Photo`} />
            </a>
          )}
        </div>
        <div className="project-info">
          <div className="project-meta">
            <span>{isUiUxProject ? t('design_project_case_study_label') : 'FRONTEND DEVELOPMENT'}</span>
          </div>
          <h3>{project.title}</h3>
          <p className={isFolderView ? 'project-description-clamp' : ''}>{t(descriptionKey)}</p>
          {hasCaseStudy ? (
            <div className="project-folder-actions">
              <Link href={`/projects/${project.slug}`} className="project-inspect-link">
                {t('view_case_study')}
                <span className="arrow-icon"><ArrowSvg /></span>
              </Link>
            </div>
          ) : isFolderView ? (
            !isPlaceholder && (
              <div className="project-folder-actions">
                <Link href={`/projects?projectId=${encodeURIComponent(project.$id)}`} className="project-inspect-link">
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
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    GITHUB
                    <div className="arrow-icon"><ArrowSvg /></div>
                  </a>
                </div>
                <div className="live-link">
                  <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                    {t("link")}
                    <div className="arrow-icon"><ArrowSvg /></div>
                  </a>
                </div>
              </div>
            )
          )}
        </div>
      </li>
    );
  });

  if (loading && isProjectsPage) {
    return (
      <div className={`myprojects reveal-section ${isFolderView ? 'myprojects-folder' : ''}`}>
        <div className="section-heading-shell">
          <div className={`headtext ${onHeadingClick ? 'interactive-heading' : ''}`} onClick={onHeadingClick}>
            <h1>{t("projects")}</h1>
            <div className="star-icon">
              <StarSvg />
            </div>
          </div>
          <p className="section-intro">{t('projects_intro')}</p>
        </div>
        <div className="loading">{t('projects_loading')}</div>
      </div>
    );
  }

  return (
    <div className={`myprojects reveal-section ${isFolderView ? 'myprojects-folder' : ''}`}>
      <div className="section-heading-shell">
        <div className={`headtext ${onHeadingClick ? 'interactive-heading' : ''}`} onClick={onHeadingClick}>
          <h1>{t("projects")}</h1>
          <div className="star-icon">
            <StarSvg />
          </div>
        </div>
        <p className="section-intro">{t(isProjectsPage ? 'projects_intro' : 'home_work_intro')}</p>
      </div>
      {isProjectsPage ? (
        <div className="project-groups">
          <section className="project-group" aria-labelledby="uiux-projects-heading">
            <h2 id="uiux-projects-heading" className="project-group-title">{t('uiux_projects')}</h2>
            <p className="section-intro">{t('uiux_projects_intro')}</p>
            <ul className="projectlist projectlist-editorial">
              {renderProjectCards(designProjects)}
            </ul>
          </section>
          <section className="project-group" aria-labelledby="frontend-projects-heading">
            <h2 id="frontend-projects-heading" className="project-group-title">{t('frontend_projects')}</h2>
            <p className="section-intro">{t('frontend_projects_intro')}</p>
            <ul className="projectlist projectlist-editorial">
              {renderProjectCards(frontendProjects)}
            </ul>
          </section>
        </div>
      ) : (
        <ul className="work-overview">
          <li className="about-item work-overview-card">
            <div className="work-overview-header">
              <span className="project-meta">UI/UX</span>
              <strong>{designProjects.length} {t('case_study_count_label')}</strong>
            </div>
            <h2>{t('uiux_projects')}</h2>
            <p>{t('uiux_overview_description')}</p>
            <ul className="work-overview-tags" aria-label={t('uiux_projects')}>
              {designProjects.map((project) => <li key={project.$id}>{project.title}</li>)}
            </ul>
            <Link href="/projects#uiux-projects-heading" className="project-inspect-link">
              {t('view_case_studies')}
              <span className="arrow-icon"><ArrowSvg /></span>
            </Link>
          </li>
          <li className="about-item work-overview-card">
            <div className="work-overview-header">
              <span className="project-meta">FRONTEND</span>
              <strong>{t('frontend_project_count')}</strong>
            </div>
            <h2>{t('frontend_projects')}</h2>
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
    </div>
  );
}
