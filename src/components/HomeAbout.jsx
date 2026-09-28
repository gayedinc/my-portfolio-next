'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { MaskedHeading } from './Motion';
import { ArrowSvg } from './Svg';
import { useRevealHydrationBoundary } from './useRevealHydration';
import styles from './HomeAbout.module.css';

const expertise = ['product', 'systems', 'frontend'];

export default function HomeAbout() {
  const { t } = useTranslation();
  const revealBoundaryRef = useRevealHydrationBoundary();

  return (
    <section
      ref={revealBoundaryRef}
      className={`home-about section-surface ${styles.section}`}
      aria-labelledby="about-heading"
      data-reveal="section"
      data-reveal-boundary="true"
    >
      <div className={styles.layout}>
        <div className={styles.intro} data-reveal="copy">
          <span className={styles.eyebrow}>{t('home_about.eyebrow')}</span>
          <MaskedHeading as="h2" id="about-heading" className={styles.title}>
            {t('home_about.heading')}
          </MaskedHeading>
          <p className={styles.description}>{t('home_about.intro')}</p>
        </div>

        <ol className={styles.expertise} role="list">
          {expertise.map((area) => (
            <li className={styles.item} key={area} data-reveal="copy">
              <span className={styles.number} aria-hidden="true">
                {t(`home_about.expertise.${area}.number`)}
              </span>
              <h3 className={styles.itemTitle}>{t(`home_about.expertise.${area}.heading`)}</h3>
              <p className={styles.itemDescription}>{t(`home_about.expertise.${area}.description`)}</p>
            </li>
          ))}
        </ol>

        <div className={styles.action} data-reveal="controls">
          <Link href="/about" className={`project-inspect-link ${styles.link}`}>
            {t('home_about.cta')}
            <span className="arrow-icon" aria-hidden="true"><ArrowSvg /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
