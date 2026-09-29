'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowSvg } from './Svg';
import { MaskedHeading } from './Motion';
import { useRevealHydrationBoundary } from './useRevealHydration';
import styles from './SelectedWork.module.css';

const projects = [
  {
    slug: 'hasarlink',
    images: [
      { src: '/images/hasarlink/hero/web-masaustu.png', width: 1580, height: 1013, altKey: 'hasarlink_web_alt' },
      { src: '/images/hasarlink/mobile/hsrlnk-mobil-anasayfa.png', width: 503, height: 1012, altKey: 'hasarlink_mobile_alt' },
    ],
  },
  {
    slug: 'qrakter',
    images: [
      { src: '/images/qrakter/zayfix-anasayfa.png', width: 503, height: 1012, altKey: 'qrakter_home_alt' },
      { src: '/images/qrakter/qr-kod-ekrani.png', width: 503, height: 1012, altKey: 'qrakter_qr_alt' },
    ],
  },
];

export default function SelectedWork() {
  const { t } = useTranslation();
  const revealBoundaryRef = useRevealHydrationBoundary();

  return (
    <section
      ref={revealBoundaryRef}
      className={`myprojects myprojects-folder section-surface surface-soft-pink ${styles.section}`}
      style={{ backgroundColor: 'var(--background-primary)' }}
      aria-labelledby="projects-heading"
      data-reveal="section"
      data-reveal-boundary="true"
    >
      <div className={`section-heading-shell ${styles.heading}`} data-reveal="copy">
        <span className={styles.eyebrow}>{t('selected_work.eyebrow')}</span>
        <MaskedHeading as="h2" id="projects-heading" className={styles.title}>
          {t('selected_work.heading')}
        </MaskedHeading>
        <p className={`section-intro ${styles.description}`}>{t('selected_work.intro')}</p>
      </div>

      <div className={styles.projects}>
        {projects.map((project, index) => (
          <article
            key={project.slug}
            className={styles.project}
            aria-labelledby={`selected-${project.slug}-heading`}
            data-project-slug={project.slug}
            data-reveal="group"
          >
            <div
              className={`${styles.media} ${project.slug === 'qrakter' ? styles.phonePair : ''}`}
              data-reveal="media"
            >
              {project.images.map((image, imageIndex) => (
                <Image
                  key={image.src}
                  src={image.src}
                  alt={t(`selected_work.${image.altKey}`)}
                  width={image.width}
                  height={image.height}
                  sizes={project.slug === 'qrakter'
                    ? '(max-width: 29.999rem) 14rem, (min-width: 64rem) 16vw, 40vw'
                    : imageIndex === 0
                      ? '(min-width: 64rem) 30vw, (min-width: 48rem) 60vw, 70vw'
                      : '(min-width: 64rem) 16vw, (min-width: 48rem) 30vw, 40vw'}
                />
              ))}
            </div>

            <div className={styles.content} data-reveal="copy">
              <span className={styles.eyebrow}>{t('selected_work.case_study_label', { number: String(index + 1).padStart(2, '0') })}</span>
              <p className={styles.category}>{t(`selected_work.${project.slug}.category`)}</p>
              <h3 id={`selected-${project.slug}-heading`} className={styles.projectName}>{t(`selected_work.${project.slug}.name`)}</h3>
              <p className={styles.description}>{t(`selected_work.${project.slug}_description`)}</p>
              <dl className={styles.metadata}>
                {['role', 'platform', 'focus'].map((field) => (
                  <div key={field}>
                    <dt>{t(`selected_work.labels.${field}`)}</dt>
                    <dd>
                      <ul className={styles.badges}>
                        {t(`selected_work.${project.slug}.${field}`).split('·').map((value) => (
                          <li className={styles.badge} key={value.trim()}>{value.trim()}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
              <Link
                href={`/projects/${project.slug}`}
                className={`project-inspect-link ${styles.caseStudyLink}`}
                aria-label={`${t('selected_work.case_study_cta')}: ${t(`selected_work.${project.slug}.name`)}`}
              >
                {t('selected_work.case_study_cta')}
                <span className="arrow-icon" aria-hidden="true"><ArrowSvg /></span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.allWork}>
        <Link href="/projects" className={`project-inspect-link ${styles.caseStudyLink}`}>
          {t('selected_work.all_work_cta')}
          <span className="arrow-icon" aria-hidden="true"><ArrowSvg /></span>
        </Link>
      </div>
    </section>
  );
}
