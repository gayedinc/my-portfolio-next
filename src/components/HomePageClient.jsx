'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import About from './About';
import Project from './Project';
import Contact from './Contact';
import Header from './Header';
import { MaskedHeading } from './Motion';
import DesignBlueprintBackground from './DesignBlueprintBackground';

export default function HomePageClient({
  initialArticles = [],
  initialProjects = [],
  initialDesignProjects = [],
}) {
  const { t } = useTranslation();
  const [articles, setArticles] = useState(initialArticles);
  const [loading, setLoading] = useState(initialArticles.length === 0);
  const sliderTrackRef = useRef(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) throw new Error('Makaleler yüklenemedi');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Makaleler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const pauseSlider = () => {
    if (sliderTrackRef.current) {
      sliderTrackRef.current.style.animationPlayState = 'paused';
    }
  };

  const makeSliderKeyboardStatic = () => {
    if (sliderTrackRef.current) {
      sliderTrackRef.current.classList.add('keyboard-static');
      sliderTrackRef.current.style.animationPlayState = 'paused';
    }
  };

  const resumeSlider = () => {
    if (sliderTrackRef.current) {
      sliderTrackRef.current.style.animationPlayState = 'running';
    }
  };

  const handleSliderBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      sliderTrackRef.current?.classList.remove('keyboard-static');
      resumeSlider();
    }
  };

  return (
    <>
      <Header />
      <main className="site-main" id="main-content">
        <DesignBlueprintBackground className="design-blueprint-background-home" />
        <section
          className="hero-section section-surface surface-gradient"
          aria-labelledby="hero-heading"
          data-reveal="section"
        >
          <div className="hero-backdrop" aria-hidden="true">
            <span className="hero-backdrop-orb hero-backdrop-orb-one" />
            <span className="hero-backdrop-orb hero-backdrop-orb-two" />
            <span className="hero-backdrop-grid" />
          </div>
          <div className="main-content">
            <div className="hero-copy-shell">
              <div className="hero-kicker" data-reveal="eyebrow">
                UI/UX DESIGNER • FRONTEND DEVELOPER
              </div>
              <div className="name hero-heading-row">
                <MaskedHeading as="h1" id="hero-heading" className="hero-title">
                  {t('greeting')}
                </MaskedHeading>
              </div>
              <div className="hero-intro-card" data-reveal="copy">
                <p className="hero-intro">{t('intro')}</p>
                <div className="hero-actions" data-reveal="controls">
                  <Link
                    className="hero-action hero-action-primary"
                    href="/projects#uiux-projects-heading"
                  >
                    <span>{t('uiux_work_button')}</span>
                  </Link>
                  <Link
                    className="hero-action hero-action-secondary"
                    href="/contact"
                  >
                    <span>{t('contact')}</span>
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
                <div className="hero-tech-stack" aria-hidden="true">
                  <span>React</span>
                  <span>Next.js</span>
                  <span>Figma</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="home-panel-stack">
          <div
            className="home-stack-panel home-stack-panel--about"
            style={{ '--panel-index': 0 }}
          >
            <div className="home-stack-panel__surface">
              <About headingHref="/about" />
            </div>
          </div>

          <div
            className="home-stack-panel home-stack-panel--projects"
            style={{ '--panel-index': 1 }}
          >
            <div className="home-stack-panel__surface">
              <Suspense fallback={<div className="loading">{t('projects_loading')}</div>}>
                <Project
                  headingHref="/projects"
                  variant="folder"
                  initialProjects={initialProjects}
                  initialDesignProjects={initialDesignProjects}
                />
              </Suspense>
            </div>
          </div>

          <div
            className="home-stack-panel home-stack-panel--articles"
            style={{ '--panel-index': 2 }}
          >
            <div className="home-stack-panel__surface">
              <section
                className="myarticles reveal-section section-surface surface-neutral"
                aria-labelledby="home-articles-heading"
                data-reveal="section"
              >
                <div className="section-heading-shell" data-reveal="copy">
                  <Link href="/articles" className="headtext interactive-heading section-heading-link">
                    <MaskedHeading as="h2" id="home-articles-heading" className="section-title">
                      {t('articles')}
                    </MaskedHeading>
                  </Link>
                  <p className="section-intro">{t('articles_intro')}</p>
                </div>

                {loading ? (
                  <div className="loading">{t('articles_loading')}</div>
                ) : (
                  <div className="slider-container slider-container-home">
                    <div
                      className="slider-track"
                      ref={sliderTrackRef}
                      onMouseEnter={pauseSlider}
                      onMouseLeave={resumeSlider}
                      onFocusCapture={makeSliderKeyboardStatic}
                      onBlurCapture={handleSliderBlur}
                    >
                      {[...articles, ...articles].map((article, index) => {
                        const isClone = index >= articles.length;
                        const articleIndex = index % articles.length;

                        return (
                          <article
                            className="articles-item"
                            key={`${article.$id}-${index}`}
                            aria-hidden={isClone ? 'true' : undefined}
                            data-reveal={isClone ? undefined : 'card'}
                          >
                            <a
                              href={article.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              tabIndex={isClone ? -1 : undefined}
                              aria-label={article.title}
                            >
                              <img
                                src={article.image}
                                alt={`${article.title} Photo`}
                                loading="lazy"
                                decoding="async"
                              />
                            </a>
                            <div className="articles-item-meta-row">
                              <span className="article-chip">Medium</span>
                              <span className="articles-seq">
                                #{String(articleIndex + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <h3>{article.title}</h3>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>

          <div
            className="home-stack-panel home-stack-panel--contact"
            style={{ '--panel-index': 3 }}
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
