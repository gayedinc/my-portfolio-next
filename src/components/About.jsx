'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { MaskedHeading } from './Motion';

export default function About({ headingHref }) {
  const { t } = useTranslation();
  const RootElement = headingHref ? 'section' : 'main';
  const CardHeading = headingHref ? 'h3' : 'h2';
  const heading = (
    <MaskedHeading
      as={headingHref ? 'h2' : 'h1'}
      id="about-heading"
      className="section-title"
    >
      {t('aboutme')}
    </MaskedHeading>
  );

  return (
    <RootElement
      className="about-container reveal-section section-surface surface-warm"
      aria-labelledby="about-heading"
      data-reveal="section"
    >
      <div className="section-heading-shell" data-reveal="copy">
        {headingHref ? (
          <Link href={headingHref} className="headtext interactive-heading section-heading-link">
            {heading}
          </Link>
        ) : (
          <div className="headtext">{heading}</div>
        )}
        <p className="section-intro">{t('about_intro')}</p>
      </div>
      <ul className="about-list">
        <li className="about-item bg-career" data-reveal="card">
          <span className="about-order">01</span>
          <CardHeading>{t('career')}</CardHeading>
          <p>{t('career_text')}</p>
        </li>
        <li className="about-item bg-projects" data-reveal="card">
          <span className="about-order">02</span>
          <CardHeading>{t('projects_teamwork')}</CardHeading>
          <p>{t('projects_teamwork_text')}</p>
        </li>
        <li className="about-item bg-learning" data-reveal="card">
          <span className="about-order">03</span>
          <CardHeading>{t('learning_sharing')}</CardHeading>
          <p>{t('learning_sharing_text')}</p>
        </li>
        <li className="about-item bg-future" data-reveal="card">
          <span className="about-order">04</span>
          <CardHeading>{t('future_vision')}</CardHeading>
          <p>{t('future_vision_text')}</p>
        </li>
      </ul>
    </RootElement>
  );
}
