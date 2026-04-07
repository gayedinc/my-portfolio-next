'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StarSvg } from './Svg';

export default function About({ onHeadingClick }) {
  const { t } = useTranslation();

  return (
    <div className="about-container reveal-section">
      <div className="section-heading-shell">
        <div
          className={`headtext ${onHeadingClick ? 'interactive-heading' : ''}`}
          onClick={onHeadingClick}
        >
          <h1>{t('aboutme')}</h1>
          <div className="star-icon">
            <StarSvg />
          </div>
        </div>
        <p className="section-intro">{t('about_intro')}</p>
      </div>
      <ul className="about-list">
        <li className="about-item bg-career">
          <span className="about-order">01</span>
          <h2>{t('career')}</h2>
          <p>{t('career_text')}</p>
        </li>
        <li className="about-item bg-projects">
          <span className="about-order">02</span>
          <h2>{t('projects_teamwork')}</h2>
          <p>{t('projects_teamwork_text')}</p>
        </li>
        <li className="about-item bg-learning">
          <span className="about-order">03</span>
          <h2>{t('learning_sharing')}</h2>
          <p>{t('learning_sharing_text')}</p>
        </li>
        <li className="about-item bg-future">
          <span className="about-order">04</span>
          <h2>{t('future_vision')}</h2>
          <p>{t('future_vision_text')}</p>
        </li>
      </ul>
    </div>
  );
}