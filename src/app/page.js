'use client';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState, useEffect } from 'react';
import About from '../components/About';
import Project from '../components/Project';
import Contact from '../components/Contact';
import Header from '../components/Header';
import { StarSvg } from '../components/Svg';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderTrackRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) throw new Error('Makaleler yüklenemedi');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Makaleler yüklenirken hata oluştu:", error);
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

  const resumeSlider = () => {
    if (sliderTrackRef.current) {
      sliderTrackRef.current.style.animationPlayState = 'running';
    }
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  const scrollToSection = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Header />
      <main className="hero-section">
        <div className="hero-backdrop" aria-hidden="true">
          <span className="hero-backdrop-orb hero-backdrop-orb-one" />
          <span className="hero-backdrop-orb hero-backdrop-orb-two" />
          <span className="hero-backdrop-grid" />
        </div>
        <div className="main-content">
          <div className="hero-copy-shell">
            <div className="hero-kicker">FRONTEND DEVELOPER • UI/UX DESIGNER</div>
            <div className="name hero-heading-row">
              <h1 className="hero-title">{t('greeting')}</h1>
              <div className="icon">
                <StarSvg />
              </div>
            </div>
            <div className="hero-intro-card">
              <p className="hero-intro">{t('intro')}</p>
              <div className="hero-actions">
                <button
                  className="hero-action hero-action-primary"
                  onClick={() => navigateTo('/projects')}
                >
                  {t('projects')}
                </button>
                <button
                  className="hero-action hero-action-secondary"
                  onClick={() => navigateTo('/contact')}
                >
                  {t('contact')}
                </button>
              </div>
              <div className="hero-metrics" aria-label="Portfolio highlights">
                <div className="hero-metric">
                  <strong>01</strong>
                  <span>{t('hero_metric_strategy')}</span>
                </div>
                <div className="hero-metric">
                  <strong>02</strong>
                  <span>{t('hero_metric_motion')}</span>
                </div>
                <div className="hero-metric">
                  <strong>03</strong>
                  <span>{t('hero_metric_build')}</span>
                </div>
              </div>
              <button
                type="button"
                className="hero-scroll-cue"
                onClick={() => scrollToSection('.about-container')}
              >
                <span>{t('scroll_label')}</span>
                <span className="hero-scroll-line" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-photo-frame">
              <div className="hero-orbit" aria-hidden="true" />
              <div className="my-photo hero-photo">
                <img src="/img/my-photo.jpg" alt="Gaye Dinç portrait" />
              </div>
              <div className="hero-tech-stack" aria-hidden="true">
                <span>React</span>
                <span>Next.js</span>
                <span>Figma</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <About onHeadingClick={() => navigateTo('/about')} />
      <Project onHeadingClick={() => navigateTo('/projects')} variant="folder" />
      <div className="myarticles reveal-section">
        <div className="section-heading-shell">
          <div className="headtext interactive-heading" onClick={() => navigateTo('/articles')}>
            <h1>{t('articles')}</h1>
            <div className="star-icon">
              <StarSvg />
            </div>
          </div>
          <p className="section-intro">{t('articles_intro')}</p>
        </div>

        {loading ? (
          <div className="loading">Makaleler yükleniyor...</div>
        ) : (
          <div className="slider-container slider-container-home">
            <div className="slider-track" ref={sliderTrackRef}>
              {[...articles, ...articles].map((article, index) => (
                <div
                  className="articles-item"
                  key={`${article.$id}-${index}`}
                  onMouseEnter={pauseSlider}
                  onMouseLeave={resumeSlider}
                >
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    <img src={article.image} alt={`${article.title} Photo`} />
                  </a>
                  <div className="articles-item-meta-row">
                    <span className="article-chip">Medium</span>
                    <span className="articles-seq">#{String((index % (articles.length || 1)) + 1).padStart(2, '0')}</span>
                  </div>
                  <h3>{article.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Contact onHeadingClick={() => navigateTo('/contact')} />
    </>
  );
}