'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowSvg } from './Svg';
import CaseStudyMedia from './CaseStudyMedia';
import { MaskedHeading } from './Motion';
import { hasarlinkMedia } from '../data/hasarlinkMedia';
import { useRevealHydrationBoundary } from './useRevealHydration';

export default function HasarLinkCaseStudy() {
  const { t } = useTranslation();
  const content = t('hasarlink_case', { returnObjects: true });
  const [project, setProject] = useState(null);
  const revealBoundaryRef = useRevealHydrationBoundary();

  useEffect(() => {
    let active = true;

    fetch('/api/design-projects')
      .then((response) => {
        if (!response.ok) throw new Error('Design project could not be loaded');
        return response.json();
      })
      .then((projects) => {
        if (active) setProject(projects.find((item) => item.slug === 'hasarlink') || null);
      })
      .catch((error) => console.error('HasarLink case study:', error));

    return () => {
      active = false;
    };
  }, []);

  const title = project?.title || 'HasarLink';
  const platforms = project?.platforms?.join(' · ') || content.hero.platforms;
  const tools = project?.tools?.join(' · ') || content.hero.tools;
  const decisionItems = [
    content.decisions.items[0],
    content.decisions.items[1],
    t('hasarlink_file_overview_decision', { returnObjects: true }),
    t('hasarlink_file_detail_decision', { returnObjects: true }),
  ];
  const media = (item, overrides = {}) => {
    const translatedImages = (overrides.images || item.images)?.map((image) => ({
      ...image,
      alt: image.altKey ? t(image.altKey) : image.alt,
      label: image.labelKey ? t(image.labelKey) : image.label,
      placeholderLabel: image.placeholderKey ? t(image.placeholderKey) : undefined,
    }));
    return (
      <CaseStudyMedia
        {...item}
        {...overrides}
        images={translatedImages}
        alt={item.altKey ? t(item.altKey) : undefined}
        caption={item.captionKey ? t(item.captionKey) : undefined}
        placeholderLabel={item.placeholderKey ? t(item.placeholderKey) : undefined}
        previousLabel={t('hasarlink_slider_previous')}
        nextLabel={t('hasarlink_slider_next')}
        slideLabel={t('hasarlink_slider_slide')}
      />
    );
  };

  return (
    <main
      ref={revealBoundaryRef}
      className="case-study section-surface surface-case-study"
      data-reveal-boundary="true"
    >
      <Link href="/projects#uiux-projects-heading" className="case-study-back" data-reveal="item">
        <span className="arrow-icon case-study-back-arrow"><ArrowSvg /></span>
        {content.back}
      </Link>

      <header className="case-study-hero" data-reveal="section">
        <div className="case-study-hero-copy">
          <span className="project-meta">{t('design_project_case_study_label')}</span>
          <p className="case-study-product-name">{title}</p>
          <MaskedHeading as="h1">{content.hero.title}</MaskedHeading>
          <p className="case-study-lead">{content.hero.summary}</p>
          <dl className="case-study-meta-grid" data-reveal="stagger">
            <div><dt>{content.hero.roleLabel}</dt><dd>{content.hero.role}</dd></div>
            <div><dt>{content.hero.platformsLabel}</dt><dd>{platforms}</dd></div>
            <div><dt>{content.hero.toolsLabel}</dt><dd>{tools}</dd></div>
            <div><dt>{content.hero.audienceLabel}</dt><dd>{content.hero.audience}</dd></div>
          </dl>
        </div>
        <div className="case-study-hero-visual" data-reveal="media">{media(hasarlinkMedia.hero)}</div>
      </header>

      <CaseSection
        title={content.problem.title}
        intro={content.problem.intro}
        className="case-study-overview-section surface-soft-pink section-overlap case-study-overlap"
      >
        <div className="case-study-overview">
          {content.problem.items.map((item, index) => (
            <OverviewCard key={item.title} number={index + 1} {...item} />
          ))}
          <OverviewCard
            number={3}
            title={t('hasarlink_approach_label')}
            text={content.role.quote}
          />
        </div>
      </CaseSection>

      <CaseSection title={content.decisions.title} intro={content.decisions.intro} className="surface-default">
        <div className="case-study-decisions case-study-decisions-with-media">
          {decisionItems.map((item, index) => (
            <DecisionFeature
              key={item.title}
              item={item}
              index={index}
              content={content}
              t={t}
              mediaContent={
                index === 0 ? media(hasarlinkMedia.decisions.commonFlow) :
                index === 1 ? media(hasarlinkMedia.decisions.guidedForm) :
                index === 2 ? media(hasarlinkMedia.decisions.fileOverview) :
                media(hasarlinkMedia.decisions.fileDetail)
              }
            />
          ))}
        </div>
      </CaseSection>

      <CaseSection title={content.collaboration.title} intro={content.collaboration.intro} className="surface-claret case-study-emphasis">
        <div className="case-study-collaboration">
          <div className="case-study-collaboration-copy"><p>{content.collaboration.text}</p><strong>{t('hasarlink_collaboration_highlight')}</strong></div>
          <ul>{content.collaboration.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </CaseSection>

      <CaseSection title={content.learnings.title} intro={content.learnings.intro} quote={content.learnings.quote} className="surface-warm">
        <div className="case-study-grid case-study-grid-two">
          {content.learnings.items.map((item) => <InfoCard key={item.title} {...item} />)}
        </div>
      </CaseSection>

      <nav className="case-study-footer surface-contact section-overlap" aria-label={t('hasarlink_footer_label')} data-reveal="section">
        <div><span>{t('hasarlink_footer_eyebrow')}</span><h2>{t('hasarlink_footer_title')}</h2></div>
        <div className="case-study-footer-actions">
          <Link href="/contact" className="project-inspect-link project-inspect-link-primary">
            {t('contact')}<span className="arrow-icon"><ArrowSvg /></span>
          </Link>
          <Link href="/projects#uiux-projects-heading" className="project-inspect-link">
            {t('hasarlink_footer_action')}<span className="arrow-icon"><ArrowSvg /></span>
          </Link>
        </div>
      </nav>
    </main>
  );
}

function CaseSection({ title, intro, quote, children, className = '' }) {
  return (
    <section className={`case-study-section section-surface ${className}`.trim()} data-reveal="section">
      <div className="case-study-section-heading"><MaskedHeading as="h2">{title}</MaskedHeading>{intro && <p>{intro}</p>}</div>
      {quote && <blockquote>{quote}</blockquote>}
      {children}
    </section>
  );
}

function OverviewCard({ number, title, text }) {
  return (
    <article className="case-study-overview-card" data-reveal="card">
      <span>{String(number).padStart(2, '0')}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function InfoCard({ title, text }) {
  return <article className="case-study-card" data-reveal="card"><h3>{title}</h3><p>{text}</p></article>;
}

function DecisionRow({ label, text }) {
  return <div className="case-study-decision-row"><strong>{label}</strong><p>{text}</p></div>;
}

function DecisionCard({ item, index, content, t }) {
  return (
    <article className="case-study-decision">
      <span className="about-order">{String(index + 1).padStart(2, '0')}</span>
      <h3>{item.title}</h3>
      <DecisionRow label={content.decisions.problemLabel} text={item.problem} />
      <DecisionRow label={t('hasarlink_decision_reason_label')} text={item.reason || item.decision} />
      <DecisionRow label={content.decisions.applicationLabel} text={item.application} />
      <DecisionRow label={content.decisions.structureLabel} text={item.structure} />
    </article>
  );
}

function DecisionFeature({ item, index, content, t, mediaContent }) {
  return (
    <article
      className={`case-study-decision-feature case-study-decision-feature-${index + 1} ${index % 2 ? 'case-study-decision-feature-reverse' : ''}`}
      data-reveal="sequence"
    >
      <div className="case-study-decision-copy-wrap">
        <DecisionCard item={item} index={index} content={content} t={t} />
      </div>
      <div className="case-study-decision-media">{mediaContent}</div>
    </article>
  );
}
