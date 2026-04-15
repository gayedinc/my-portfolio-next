'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from "react-i18next";
import { StarSvg, ArrowSvg } from "./Svg";

export default function Project({ onHeadingClick, variant = 'folder', limit }) {
  const { t } = useTranslation();
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectCardsRef = useRef([]);
  const isFolderView = variant === 'folder';
  const isProjectsPage = pathname === '/projects';
  const projectIdToFocus = searchParams.get('projectId');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Projeler yüklenemedi');
        const data = await response.json();
        setProjectsData(data);
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

    const nodes = projectCardsRef.current.filter(Boolean);
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
        threshold: 0.14,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
    };
  }, [loading, isProjectsPage, projectsData]);

  useEffect(() => {
    if (loading || !isProjectsPage || !projectIdToFocus) {
      return undefined;
    }

    const projectIndex = projectsData.findIndex((project) => project.$id === projectIdToFocus);
    if (projectIndex === -1) {
      return undefined;
    }

    const targetCard = projectCardsRef.current[projectIndex];
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

  const visibleProjects = useMemo(() => {
    if (!limit) {
      return projectsData;
    }
    return projectsData.slice(0, limit);
  }, [projectsData, limit]);

  if (loading) {
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
        <div className="loading">Projeler yükleniyor...</div>
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
        <p className="section-intro">{t('projects_intro')}</p>
      </div>
      <div className={isFolderView ? 'project-folder-shell' : ''}>
        <ul className={`projectlist ${isFolderView ? 'projectlist-folder' : 'projectlist-editorial'}`}>
          {visibleProjects.map((project, index) => (
            <li
              ref={(element) => {
                projectCardsRef.current[index] = element;
              }}
              data-project-id={project.$id}
              className={isFolderView
                ? `project-item project-item-folder ${isProjectsPage ? 'project-card-scroll-grow' : ''}`
                : `project-item project-item-editorial project-card-scroll-grow ${index % 2 === 1 ? 'project-item-reverse' : ''}`}
              key={project.$id}
            >
              <div className="project-img">
                <span className="project-image-glow" aria-hidden="true" />
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                  <img src={project.image} alt={`${project.title} Photo`} />
                </a>
              </div>
              <div className="project-info">
                <div className="project-meta">
                  <span>UI/UX + Frontend</span>
                </div>
                <h3>{project.title}</h3>
                <p className={isFolderView ? 'project-description-clamp' : ''}>{t(project.descriptionKey)}</p>
                {isFolderView ? (
                  <div className="project-folder-actions">
                    <Link href={`/projects?projectId=${encodeURIComponent(project.$id)}`} className="project-inspect-link">
                      {t('inspect_project')}
                      <span className="arrow-icon">
                        <ArrowSvg />
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div className="link-area">
                    <div className="github-link">
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                        GITHUB
                        <div className="arrow-icon">
                          <ArrowSvg />
                        </div>
                      </a>
                    </div>
                    <div className="live-link">
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                        {t("link")}
                        <div className="arrow-icon">
                          <ArrowSvg />
                        </div>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}