'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { CV_FILENAME, CV_PATH } from '../lib/cv';
import { StarSvg } from './Svg';
import { MaskedHeading } from './Motion';
import { useRevealHydrationBoundary } from './useRevealHydration';
import styles from './Contact.module.css';

const socialProfiles = [
  { key: 'linkedin', href: 'https://www.linkedin.com/in/gayedinc/' },
  { key: 'github', href: 'https://github.com/gayedinc' },
];

export default function Contacts({ variant = 'home', headingHref }) {
  const { t } = useTranslation();
  const revealBoundaryRef = useRevealHydrationBoundary();
  const RootElement = variant === 'standalone' ? 'main' : 'section';

  return (
    <RootElement
      ref={revealBoundaryRef}
      className={`contact-page contact-page-${variant} reveal-section section-surface surface-contact ${styles.contact}`}
      aria-labelledby="contact-heading"
      data-reveal="section"
      data-reveal-boundary="true"
    >
      <div className="contact-star-field" aria-hidden="true">
        <span className="contact-star-motion">
          <span className="contact-star-layer is-base"><StarSvg /></span>
          <span className="contact-star-layer is-rotated"><StarSvg /></span>
        </span>
      </div>
      <div className="contact-final-grid">
        <div className={`section-heading-shell ${styles.copy}`} data-reveal="copy">
          {headingHref ? (
            <Link href={headingHref} className={styles.eyebrow}>{t('contact')}</Link>
          ) : (
            <span className={styles.eyebrow}>{t('contact')}</span>
          )}
          <MaskedHeading as={variant === 'standalone' ? 'h1' : 'h2'} id="contact-heading" className={styles.headline}>
            {t('contact_headline')}
          </MaskedHeading>
          <p className={`section-intro ${styles.description}`}>{t('contact_intro')}</p>
        </div>
        <div className={`contact-content ${styles.card}`} data-reveal="card">
          <span className="contact-status">{t('contact_status')}</span>
          <div className={styles.actions}>
            <a
              className={`contact-email-cta ${styles.primary}`}
              href="mailto:gayedinc190@gmail.com?subject=UI%2FUX%20%26%20Product%20Design&body=Hello%20Gaye,"
            >
              {t('send_email')}
            </a>
            <a href={CV_PATH} download={CV_FILENAME} className={`project-inspect-link ${styles.secondary}`}>
              {t('download_cv')}
            </a>
          </div>
          <ul className={styles.socials} aria-label={t('contact_social_label')}>
            {socialProfiles.map(({ key, href }) => (
              <li key={key}>
                <a href={href} target="_blank" rel="noopener noreferrer" title={t(`contact_social.${key}`)}>
                  {t(`contact_social.${key}`)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RootElement>
  );
}
