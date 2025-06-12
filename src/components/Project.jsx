'use client';
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StarSvg, ArrowSvg } from "./Svg";

export default function Project() {
  const { t } = useTranslation();
  const [projectsData, setProjectsData] = useState([]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((data) => setProjectsData(data.projects));
  }, []);

  return (
    <div className="myprojects">
      <div className="headtext">
        <h1>{t("projects")}</h1>
        <div className="star-icon">
          <StarSvg />
        </div>
      </div>
      <ul className="projectlist">
        {projectsData.map((project, index) => (
          <li className="project-item" key={index}>
            <div className="project-img">
              <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                <img src={project.image} alt={`${project.title} Photo`} />
              </a>
            </div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{t(project.descriptionKey)}</p>
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}