'use client';

import { useTranslation } from 'react-i18next';
import { MaskedHeading } from './Motion';
import { useRevealHydrationBoundary } from './useRevealHydration';
import styles from './DesignApproach.module.css';

const principles = ['complexity', 'systems', 'development'];

export default function DesignApproach() {
  const { t } = useTranslation();
  const revealBoundaryRef = useRevealHydrationBoundary();

  return (
    <section
      ref={revealBoundaryRef}
      className={`design-approach section-surface ${styles.section}`}
      aria-labelledby="design-approach-heading"
      data-reveal="section"
      data-reveal-boundary="true"
    >
      <div className={`section-heading-shell ${styles.heading}`} data-reveal="copy">
        <span className={styles.eyebrow}>{t('design_approach.eyebrow')}</span>
        <MaskedHeading as="h2" id="design-approach-heading" className={styles.title}>
          {t('design_approach.heading')}
        </MaskedHeading>
        <p className={styles.description}>{t('design_approach.intro')}</p>
      </div>

      <ol className={styles.principles} role="list">
        {principles.map((principle) => (
          <li className={styles.principle} key={principle} data-reveal="copy">
            <span className={styles.number} aria-hidden="true">
              {t(`design_approach.principles.${principle}.number`)}
            </span>
            <h3 className={styles.principleTitle}>
              {t(`design_approach.principles.${principle}.heading`)}
            </h3>
            <p className={styles.description}>
              {t(`design_approach.principles.${principle}.description`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
