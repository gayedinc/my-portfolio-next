'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { StarSvg, GithubSvg, LinkedinSvg } from './Svg';
import { MaskedHeading } from './Motion';

export default function Contacts({ variant = 'home', headingHref }) {
  const { t } = useTranslation();
  const RootElement = variant === 'standalone' ? 'main' : 'section';
  const heading = (
    <MaskedHeading
      as={headingHref ? 'h2' : 'h1'}
      id="contact-heading"
      className="section-title contact-title"
    >
      {t('contact')}
    </MaskedHeading>
  );

  return (
    <RootElement
      className={`contact-page contact-page-${variant} reveal-section section-surface surface-contact section-overlap section-overlap-contact`}
      aria-labelledby="contact-heading"
      data-reveal="section"
    >
      <div className="contact-star-field" aria-hidden="true">
        <StarSvg />
      </div>
      <div className="contact-final-grid">
        <div className="section-heading-shell" data-reveal="copy">
          {headingHref ? (
            <Link href={headingHref} className="contact-text interactive-heading section-heading-link">
              {heading}
            </Link>
          ) : (
            <div className="contact-text">{heading}</div>
          )}
          <p className="section-intro">{t('contact_intro')}</p>
        </div>
        <div className="contact-content" data-reveal="card">
          <div className="contact-lead-card">
            <span className="contact-status">{t('contact_status')}</span>
            <p>{t('contaxt_text')}</p>
          </div>
          <footer className="footer">
            <a
              className="contact-email-cta"
              href="mailto:gayedinc190@gmail.com?subject=Frontend%20Development&body=Hello%20Gaye,"
            >
              {t('send_email')}
            </a>
            <div className="cv">
              <a href="/doc/Gaye-Dinc-CV.pdf" download>
                {t('download_cv')}
              </a>
            </div>
            <div className="profiles">
              <ul>
                <li>
                  <a
                    href="https://github.com/gayedinc"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <GithubSvg />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/gayedinc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <LinkedinSvg />
                  </a>
                </li>
              </ul>
            </div>
            <a className="contact-back-to-top" href="#top">
              <span>{t('home')}</span>
              <span aria-hidden="true">↑</span>
            </a>
          </footer>
        </div>
      </div>
    </RootElement>
  );
}
