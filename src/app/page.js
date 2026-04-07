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

  // Başlıklara tıklama özelliği eklemek için style override fonksiyonu
  const addClickableHeading = (selector, path) => {
    useEffect(() => {
      const headings = document.querySelectorAll(selector);
      if (headings.length > 0) {
        headings.forEach(heading => {
          heading.style.cursor = 'pointer';
          heading.addEventListener('click', () => navigateTo(path));
        });
      }

      return () => {
        if (headings.length > 0) {
          headings.forEach(heading => {
            heading.removeEventListener('click', () => navigateTo(path));
          });
        }
      };
    }, []);
  };

  // Her bileşen için başlık selektörlerini tanımlayıp tıklama özelliği ekliyoruz
  addClickableHeading('.about-container .headtext', '/about');
  addClickableHeading('.myprojects .headtext', '/projects');
  addClickableHeading('.myarticles .headtext', '/articles');
  addClickableHeading('.contact-page .contact-text', '/contact');

  return (
    <>
      <Header />
      <main className="hero-section">
        <div className="main-content">
          <div className="hero-copy-shell">
            <div className="hero-kicker">Frontend Developer • UI/UX Designer</div>
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
      <About />
      <Project />
      <div className="myarticles reveal-section">
        <div className="headtext">
          <h1>{t('articles')}</h1>
          <div className="star-icon">
            <StarSvg />
          </div>
        </div>

        {loading ? (
          <div className="loading">Makaleler yükleniyor...</div>
        ) : (
          <div className="slider-container">
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
                  <h3>{article.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Contact />
    </>
  );
}