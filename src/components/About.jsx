'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { MaskedHeading } from './Motion';
import { ArrowSvg } from './Svg';

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
        <li
          id={headingHref ? undefined : 'career'}
          tabIndex={headingHref ? undefined : -1}
          className={`about-item bg-career ${headingHref ? 'about-item-preview' : 'about-item-detail'}`}
          data-reveal="card"
        >
          <span className="about-order">01</span>
          <CardHeading>{t('career')}</CardHeading>
          <p className={`about-card-copy ${headingHref ? 'about-card-copy-preview' : 'about-card-copy-full'}`}>
            {t('career_text')}
          </p>
          {headingHref && (
            <Link
              href="/about#career"
              className="about-read-more project-inspect-link"
              aria-label={`${t('read_more')}: ${t('career')}`}
            >
              {t('read_more')}
              <span className="arrow-icon"><ArrowSvg /></span>
            </Link>
          )}
        </li>
        <li
          id={headingHref ? undefined : 'design-development'}
          tabIndex={headingHref ? undefined : -1}
          className={`about-item bg-projects ${headingHref ? 'about-item-preview' : 'about-item-detail'}`}
          data-reveal="card"
        >
          <span className="about-order">02</span>
          <CardHeading>{t('projects_teamwork')}</CardHeading>
          <p className={`about-card-copy ${headingHref ? 'about-card-copy-preview' : 'about-card-copy-full'}`}>
            {t('projects_teamwork_text')}
          </p>
          {headingHref && (
            <Link
              href="/about#design-development"
              className="about-read-more project-inspect-link"
              aria-label={`${t('read_more')}: ${t('projects_teamwork')}`}
            >
              {t('read_more')}
              <span className="arrow-icon"><ArrowSvg /></span>
            </Link>
          )}
        </li>
        <li
          id={headingHref ? undefined : 'continuous-learning'}
          tabIndex={headingHref ? undefined : -1}
          className={`about-item bg-learning ${headingHref ? 'about-item-preview' : 'about-item-detail'}`}
          data-reveal="card"
        >
          <span className="about-order">03</span>
          <CardHeading>{t('learning_sharing')}</CardHeading>
          <p className={`about-card-copy ${headingHref ? 'about-card-copy-preview' : 'about-card-copy-full'}`}>
            {t('learning_sharing_text')}
          </p>
          {headingHref && (
            <Link
              href="/about#continuous-learning"
              className="about-read-more project-inspect-link"
              aria-label={`${t('read_more')}: ${t('learning_sharing')}`}
            >
              {t('read_more')}
              <span className="arrow-icon"><ArrowSvg /></span>
            </Link>
          )}
        </li>
        <li
          id={headingHref ? undefined : 'future'}
          tabIndex={headingHref ? undefined : -1}
          className={`about-item bg-future ${headingHref ? 'about-item-preview' : 'about-item-detail'}`}
          data-reveal="card"
        >
          <span className="about-order">04</span>
          <CardHeading>{t('future_vision')}</CardHeading>
          <p className={`about-card-copy ${headingHref ? 'about-card-copy-preview' : 'about-card-copy-full'}`}>
            {t('future_vision_text')}
          </p>
          {headingHref && (
            <Link
              href="/about#future"
              className="about-read-more project-inspect-link"
              aria-label={`${t('read_more')}: ${t('future_vision')}`}
            >
              {t('read_more')}
              <span className="arrow-icon"><ArrowSvg /></span>
            </Link>
          )}
        </li>
      </ul>
    </RootElement>
  );
}
