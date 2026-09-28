'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import React from 'react';
import HomeAbout from './HomeAbout';
import SelectedWork from './SelectedWork';
import DesignApproach from './DesignApproach';
import SelectedWriting from './SelectedWriting';
import Contact from './Contact';
import Header from './Header';
import { MaskedHeading } from './Motion';
import DesignBlueprintBackground from './DesignBlueprintBackground';
import { useRevealHydrationBoundary } from './useRevealHydration';
import HeroStarField from './HeroStarField';
import { useHomeSectionStack } from './useHomeSectionStack';

export default function HomePageClient({
  initialArticles = [],
}) {
  const { t } = useTranslation();
  const revealBoundaryRef = useRevealHydrationBoundary();
  useHomeSectionStack(revealBoundaryRef);

  return (
    <>
      <Header />
      <main
        ref={revealBoundaryRef}
        className="site-main"
        id="main-content"
        data-reveal-boundary="true"
      >
        <DesignBlueprintBackground className="design-blueprint-background-home" />
        <section
          className="hero-section section-surface surface-gradient"
          data-stack-panel
          aria-labelledby="hero-heading"
          data-reveal="section"
        >
          <div className="hero-backdrop" aria-hidden="true">
            <span className="hero-backdrop-orb hero-backdrop-orb-one" />
            <span className="hero-backdrop-orb hero-backdrop-orb-two" />
            <span className="hero-backdrop-grid" />
          </div>
          <HeroStarField />
          <div className="main-content">
            <div className="hero-copy-shell">
              <div className="hero-kicker" data-reveal="eyebrow">
                {t('nav_role')}
              </div>
              <div className="name hero-heading-row">
                <MaskedHeading as="h1" id="hero-heading" className="hero-title">
                  {t('greeting')}
                </MaskedHeading>
              </div>
              <div className="hero-intro-card" data-reveal="copy">
                <p className="hero-value-proposition">{t('hero_headline')}</p>
                <p className="hero-intro">{t('intro')}</p>
                <div className="hero-actions" data-reveal="controls">
                  <Link
                    className="hero-action hero-action-primary"
                    href="/projects#uiux-projects-heading"
                  >
                    <span>{t('hero_primary_cta')}</span>
                  </Link>
                  <Link
                    className="hero-action hero-action-secondary"
                    href="/contact"
                  >
                    <span>{t('hero_secondary_cta')}</span>
                  </Link>
                </div>
                <div className="hero-metrics" aria-label="Portfolio highlights">
                  <div className="hero-metric" data-reveal="card">
                    <strong>01</strong>
                    <span>{t('hero_metric_strategy')}</span>
                  </div>
                  <div className="hero-metric" data-reveal="card">
                    <strong>02</strong>
                    <span>{t('hero_metric_motion')}</span>
                  </div>
                  <div className="hero-metric" data-reveal="card">
                    <strong>03</strong>
                    <span>{t('hero_metric_build')}</span>
                  </div>
                </div>
                <a className="hero-scroll-cue" href="#about-heading">
                  <span>{t('scroll_label')}</span>
                  <span className="hero-scroll-line" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="hero-visual" data-reveal="media">
              <div className="hero-photo-frame">
                <div className="hero-orbit" aria-hidden="true" />
                <div className="my-photo hero-photo">
                  <Image
                    src="/img/my-photo.jpg"
                    alt="Gaye Dinç portrait"
                    width={900}
                    height={1600}
                    sizes="(max-width: 767px) 86vw, (max-width: 1179px) 48vw, 36vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="home-panel-stack">
          <div
            className="home-stack-panel home-stack-panel--about"
            data-stack-panel
            style={{ '--panel-index': 0 }}
          >
            <div className="home-stack-panel__surface">
              <HomeAbout />
            </div>
          </div>

          <div
            className="home-stack-panel home-stack-panel--projects"
            data-stack-panel
            style={{ '--panel-index': 1 }}
          >
            <div className="home-stack-panel__surface">
              <SelectedWork />
            </div>
          </div>

          <div
            className="home-stack-panel home-stack-panel--approach"
            data-stack-panel
            style={{ '--panel-index': 2 }}
          >
            <div className="home-stack-panel__surface">
              <DesignApproach />
            </div>
          </div>

          <div
            className="home-stack-panel home-stack-panel--articles"
            data-stack-panel
            style={{ '--panel-index': 3 }}
          >
            <div className="home-stack-panel__surface">
              <SelectedWriting initialArticles={initialArticles} />
            </div>
          </div>

          <div
            className="home-stack-panel home-stack-panel--contact"
            data-stack-panel
            style={{ '--panel-index': 4 }}
          >
            <div className="home-stack-panel__surface">
              <Contact headingHref="/contact" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
