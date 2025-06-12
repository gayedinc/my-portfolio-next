'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StarSvg } from './Svg';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="about-container">
      <div className="headtext">
        <h1>{t('aboutme')}</h1>
        <div className="star-icon">
          <StarSvg />
        </div>
      </div>
      <ul className="about-list">
        <li className="about-item bg-career">
          <h2>{t('career')}</h2>
          <p>{t('career_text')}</p>
        </li>
        <li className="about-item bg-projects">
          <h2>{t('projects_teamwork')}</h2>
          <p>{t('projects_teamwork_text')}</p>
        </li>
        <li className="about-item bg-learning">
          <h2>{t('learning_sharing')}</h2>
          <p>{t('learning_sharing_text')}</p>
        </li>
        <li className="about-item bg-future">
          <h2>{t('future_vision')}</h2>
          <p>{t('future_vision_text')}</p>
        </li>
      </ul>
    </div>
  );
}