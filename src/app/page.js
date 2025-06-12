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
  const sliderTrackRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/data/data.json')
      .then(response => response.json())
      .then(data => setArticles(data.articles))
      .catch(error => console.error('Error loading data:', error));
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
      <main>
        <div className="name">
          <h1>{t('greeting')}</h1>
          <div className="icon">
            <StarSvg />
          </div>
        </div>
        <div className="main-content">
          <div className="my-photo">
            <img src="/img/my-photo.jpg" alt="" />
          </div>
          <div className="home-intro">
            <p>{t('intro')}</p>
          </div>
        </div>
      </main>
      <About />
      <Project />
      <div className="myarticles">
        <div className="headtext">
          <h1>{t('articles')}</h1>
          <div className="star-icon">
            <StarSvg />
          </div>
        </div>

        <div className="slider-container">
          <div className="slider-track" ref={sliderTrackRef}>
            {[...articles, ...articles].map((article, index) => (
              <div
                className="articles-item"
                key={index}
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
      </div>
      <Contact />
    </>
  );
}