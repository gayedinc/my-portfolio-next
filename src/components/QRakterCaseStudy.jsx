'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowSvg } from './Svg';
import CaseStudyMedia from './CaseStudyMedia';
import { MaskedHeading } from './Motion';
import {
  qrakterHeroMedia,
  qrakterDecisionMedia,
} from '../data/qrakterMedia';
import { useRevealHydrationBoundary } from './useRevealHydration';
import ProjectStarsBackground from './ProjectStarsBackground';

export default function QRakterCaseStudy() {
  const { t } = useTranslation();
  const revealBoundaryRef = useRevealHydrationBoundary();

  const content = t('qrakter_case', {
    returnObjects: true,
  });

  const media = (item) => {
    if (!item?.images?.length) {
      return null;
    }

    const translatedImages = item.images.map((image) => ({
      ...image,

      alt: image.altKey
        ? t(image.altKey)
        : image.alt || '',

      label: image.labelKey
        ? t(image.labelKey)
        : image.label,

      placeholderLabel: image.placeholderKey
        ? t(image.placeholderKey)
        : image.placeholderLabel,
    }));

    return (
      <CaseStudyMedia
        {...item}
        images={translatedImages}
        caption={
          item.captionKey
            ? t(item.captionKey)
            : item.caption
        }
        previousLabel={t('qrakter_slider_previous')}
        nextLabel={t('qrakter_slider_next')}
        slideLabel={t('qrakter_slider_slide')}
      />
    );
  };

  return (
    <main
      ref={revealBoundaryRef}
      className="case-study qrakter-case-study section-surface surface-case-study project-surface-page"
      data-reveal-boundary="true"
    >
      <ProjectStarsBackground />
      {/* ------------------------------------------------ */}
      {/* BACK */}
      {/* ------------------------------------------------ */}

      <Link href="/projects#uiux-projects-heading" className="case-study-back" data-reveal="item">
        <span className="arrow-icon case-study-back-arrow"><ArrowSvg /></span>
        {content.back}
      </Link>

      {/* ------------------------------------------------ */}
      {/* HERO */}
      {/* ------------------------------------------------ */}

      <header
        className="case-study-hero"
        data-reveal="section"
      >
        <div className="case-study-hero-copy">
          <span className="project-meta">
            {content.label} · {content.year}
          </span>

          <p className="case-study-product-name">
            ZAYFIX QRAKTER
          </p>

          <MaskedHeading as="h1">
            {content.hero.title}
          </MaskedHeading>

          <div className="case-study-lead">
            <p>{content.hero.summary1}</p>
            <p>{content.hero.summary2}</p>
          </div>

          <dl
            className="case-study-meta-grid"
            data-reveal="stagger"
          >
            <div>
              <dt>{content.hero.roleLabel}</dt>
              <dd>{content.hero.role}</dd>
            </div>

            <div>
              <dt>{content.hero.platformLabel}</dt>
              <dd>{content.hero.platform}</dd>
            </div>

            <div>
              <dt>{content.hero.toolsLabel}</dt>
              <dd>{content.hero.tools}</dd>
            </div>

            <div>
              <dt>{content.hero.targetLabel}</dt>
              <dd>{content.hero.target}</dd>
            </div>
          </dl>
        </div>

        <div
          className="case-study-hero-visual qrakter-hero-visual"
          data-reveal="media"
        >
          {media(qrakterHeroMedia)}
        </div>
      </header>

      {/* ------------------------------------------------ */}
      {/* PROJE VE PROBLEM */}
      {/* ------------------------------------------------ */}

      <Section
        title={content.problem.title}
        intro={content.problem.intro}
        className="case-study-overview-section surface-soft-pink section-overlap case-study-overlap"
      >
        <div className="case-study-overview">
          {content.problem.items.map((item, index) => (
            <Overview
              key={item.title}
              number={index + 1}
              {...item}
            />
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------ */}
      {/* ÜRÜN YAŞAM DÖNGÜSÜ */}
      {/* ------------------------------------------------ */}

      <Section
        title={content.lifecycle.title}
        intro={content.lifecycle.intro}
        className="surface-default"
      >
        <div className="qrakter-lifecycle">
          {content.lifecycle.items.map((item, index) => (
            <FlowCard
              key={item.title}
              number={index + 1}
              {...item}
            />
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------ */}
      {/* ROL VE KATKILAR */}
      {/* ------------------------------------------------ */}

      <Section
        title={content.role.title}
        intro={content.role.intro}
        className="surface-warm"
      >
        <div className="case-study-grid case-study-grid-two">
          {content.role.items.map((item) => (
            <Card
              key={item.title}
              {...item}
            />
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------ */}
      {/* TASARIM SÜRECİ */}
      {/* ------------------------------------------------ */}

      <Section
        title={content.process.title}
        intro={content.process.intro}
        className="surface-gradient"
      >
        <ol className="case-study-process">
          {content.process.items.map((item, index) => (
            <li
              key={item.title}
              data-reveal="card"
            >
              <span>
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3>{item.title}</h3>

              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ------------------------------------------------ */}
      {/* TEMEL UX KARARLARI */}
      {/* HasarLink ile aynı sistem */}
      {/* ------------------------------------------------ */}

      <Section
        title={content.decisions.title}
        intro={content.decisions.intro}
        className="surface-default"
      >
        <div className="case-study-decisions case-study-decisions-with-media">
          {content.decisions.items.map((item, index) => {
            const mediaContent = media(
              qrakterDecisionMedia[index]
            );

            return (
              <DecisionFeature
                key={item.title}
                item={item}
                index={index}
                labels={content.decisions.labels}
                mediaContent={mediaContent}
              />
            );
          })}
        </div>
      </Section>

      {/* ------------------------------------------------ */}
      {/* GELİŞTİRİCİ EKİPLE ÇALIŞMA */}
      {/* ------------------------------------------------ */}

      <Section
        title={content.collaboration.title}
        intro={content.collaboration.intro}
        className="surface-claret case-study-emphasis"
      >
        <div className="case-study-collaboration">
          <div className="case-study-collaboration-copy">
            <p>
              {content.collaboration.text}
            </p>

            <strong>
              {content.collaboration.outro}
            </strong>
          </div>

          <ul>
            {content.collaboration.items.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ------------------------------------------------ */}
      {/* ÖĞRENDİKLERİM */}
      {/* ------------------------------------------------ */}

      <Section
        title={content.learnings.title}
        intro={content.learnings.intro}
        className="surface-warm"
      >
        <div className="case-study-grid case-study-grid-two qrakter-learnings-grid">
          {content.learnings.items.map((item) => (
            <Card
              key={item.title}
              {...item}
            />
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------ */}
      {/* FOOTER */}
      {/* ------------------------------------------------ */}

      <nav
        className="case-study-footer surface-contact section-overlap"
        aria-label={content.footerLabel}
        data-reveal="section"
      >
        <div>
          <span>
            {content.footerEyebrow}
          </span>

          <h2>
            {content.footerTitle}
          </h2>
        </div>

        <div className="case-study-footer-actions">
          <Link
            href="/contact"
            className="project-inspect-link project-inspect-link-primary"
          >
            {t('contact')}

            <span className="arrow-icon">
              <ArrowSvg />
            </span>
          </Link>

          <Link
            href="/projects#uiux-projects-heading"
            className="project-inspect-link"
          >
            {content.back}

            <span className="arrow-icon">
              <ArrowSvg />
            </span>
          </Link>
        </div>
      </nav>
    </main>
  );
}

/* ====================================================== */
/* SECTION */
/* ====================================================== */

function Section({
  title,
  intro,
  quote,
  children,
  className = '',
}) {
  return (
    <section
      className={`case-study-section section-surface ${className}`.trim()}
      data-reveal="section"
    >
      <div className="case-study-section-heading">
        <MaskedHeading as="h2">
          {title}
        </MaskedHeading>

        {intro && (
          <p>
            {intro}
          </p>
        )}
      </div>

      {quote && (
        <blockquote>
          {quote}
        </blockquote>
      )}

      {children}
    </section>
  );
}

/* ====================================================== */
/* CARD */
/* ====================================================== */

function Card({
  title,
  text,
}) {
  return (
    <article
      className="case-study-card"
      data-reveal="card"
    >
      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>
    </article>
  );
}

/* ====================================================== */
/* OVERVIEW */
/* ====================================================== */

function Overview({
  number,
  title,
  text,
}) {
  return (
    <article
      className="case-study-overview-card"
      data-reveal="card"
    >
      <span>
        {String(number).padStart(2, '0')}
      </span>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>
    </article>
  );
}

/* ====================================================== */
/* LIFECYCLE CARD */
/* ====================================================== */

function FlowCard({
  number,
  title,
  text,
  features = [],
}) {
  return (
    <article
      className="case-study-card qrakter-flow-card"
      data-reveal="card"
    >
      <span className="about-order">
        {String(number).padStart(2, '0')}
      </span>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

      <ul className="case-study-chip-list">
        {features.map((feature) => (
          <li key={feature}>
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ====================================================== */
/* DECISION */
/* ====================================================== */

function DecisionRow({
  label,
  text,
}) {
  return (
    <div className="case-study-decision-row">
      <strong>
        {label}
      </strong>

      <p>
        {text}
      </p>
    </div>
  );
}

function DecisionCard({
  item,
  index,
  labels,
}) {
  return (
    <article className="case-study-decision">
      <span className="about-order">
        {String(index + 1).padStart(2, '0')}
      </span>

      <h3>
        {item.title}
      </h3>

      <DecisionRow
        label={labels.problem}
        text={item.problem}
      />

      <DecisionRow
        label={labels.reason}
        text={item.reason}
      />

      <DecisionRow
        label={labels.application}
        text={item.application}
      />

      <DecisionRow
        label={labels.result}
        text={item.result}
      />
    </article>
  );
}

/* ====================================================== */
/* DECISION + MEDIA */
/* HasarLink ile aynı alternating sistem */
/* ====================================================== */

function DecisionFeature({
  item,
  index,
  labels,
  mediaContent,
}) {
  const hasMedia = Boolean(mediaContent);

  const classes = [
    'case-study-decision-feature',
    `case-study-decision-feature-${index + 1}`,

    index % 2
      ? 'case-study-decision-feature-reverse'
      : '',

    !hasMedia
      ? 'case-study-decision-feature-text-only'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article
      className={classes}
      data-reveal="sequence"
    >
      <div className="case-study-decision-copy-wrap">
        <DecisionCard
          item={item}
          index={index}
          labels={labels}
        />
      </div>

      {hasMedia && (
        <div className="case-study-decision-media">
          {mediaContent}
        </div>
      )}
    </article>
  );
}