'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowSvg } from './Svg';
import CaseStudyMedia from './CaseStudyMedia';
import { MaskedHeading } from './Motion';
import { qrakterDecisionMedia } from '../data/qrakterMedia';
import { useRevealHydrationBoundary } from './useRevealHydration';

export default function QRakterCaseStudy() {
  const { t } = useTranslation();
  const revealBoundaryRef = useRevealHydrationBoundary();
  const content = t('qrakter_case', { returnObjects: true });
  const media = (item) => item?.images?.length ? (
    <CaseStudyMedia
      {...item}
      images={item.images.map((image) => ({ ...image, alt: t(image.altKey), label: image.captionKey ? t(image.captionKey) : undefined }))}
      previousLabel={t('qrakter_slider_previous')}
      nextLabel={t('qrakter_slider_next')}
      slideLabel={t('qrakter_slider_slide')}
    />
  ) : null;

  return (
    <main
      ref={revealBoundaryRef}
      className="case-study qrakter-case-study section-surface surface-case-study"
      data-reveal-boundary="true"
    >
      <Link href="/projects#uiux-projects-heading" className="case-study-back" data-reveal="item"><span className="arrow-icon case-study-back-arrow"><ArrowSvg /></span>{content.back}</Link>
      <header className="case-study-hero" data-reveal="section">
        <div className="case-study-hero-copy">
          <span className="project-meta">{content.label} · {content.year}</span>
          <p className="case-study-product-name">ZAYFIX QRAKTER</p>
          <MaskedHeading as="h1">{content.hero.title}</MaskedHeading>
          <div className="case-study-lead"><p>{content.hero.summary1}</p><p>{content.hero.summary2}</p></div>
          <dl className="case-study-meta-grid" data-reveal="stagger">
            <div><dt>{content.hero.roleLabel}</dt><dd>{content.hero.role}</dd></div>
            <div><dt>{content.hero.platformLabel}</dt><dd>{content.hero.platform}</dd></div>
            <div><dt>{content.hero.toolsLabel}</dt><dd>{content.hero.tools}</dd></div>
            <div><dt>{content.hero.targetLabel}</dt><dd>{content.hero.target}</dd></div>
          </dl>
        </div>
        <div className="case-study-hero-visual qrakter-hero-flow" aria-label={content.lifecycle.title} data-reveal="media">
          {content.lifecycle.items.map((item, index) => <Overview key={item.title} number={index + 1} {...item} />)}
        </div>
      </header>

      <Section title={content.problem.title} intro={content.problem.intro} className="case-study-overview-section surface-soft-pink section-overlap case-study-overlap">
        <div className="case-study-overview">{content.problem.items.map((item, index) => <Overview key={item.title} number={index + 1} {...item} />)}</div>
      </Section>
      <Section title={content.lifecycle.title} intro={content.lifecycle.intro} className="surface-default">
        <div className="qrakter-lifecycle">{content.lifecycle.items.map((item, index) => <FlowCard key={item.title} number={index + 1} {...item} />)}</div>
      </Section>
      <Section title={content.role.title} intro={content.role.intro} className="surface-warm"><div className="case-study-grid case-study-grid-two">{content.role.items.map((item) => <Card key={item.title} {...item} />)}</div></Section>
      <Section title={content.process.title} intro={content.process.intro} className="surface-gradient"><ol className="case-study-process">{content.process.items.map((item, index) => <li key={item.title} data-reveal="card"><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol></Section>
      <Section title={content.decisions.title} intro={content.decisions.intro} className="surface-default">
        <div className="qrakter-decisions-grid">{content.decisions.items.map((item, index) => <Decision key={item.title} item={item} index={index} labels={content.decisions.labels} mediaContent={media(qrakterDecisionMedia[index])} />)}</div>
      </Section>
      <Section title={content.collaboration.title} intro={content.collaboration.intro} className="surface-claret case-study-emphasis"><div className="case-study-collaboration"><div className="case-study-collaboration-copy"><p>{content.collaboration.text}</p><strong>{content.collaboration.outro}</strong></div><ul>{content.collaboration.items.map((item) => <li key={item}>{item}</li>)}</ul></div></Section>
      <Section title={content.learnings.title} intro={content.learnings.intro} className="surface-warm"><div className="case-study-grid case-study-grid-two qrakter-learnings-grid">{content.learnings.items.map((item) => <Card key={item.title} {...item} />)}</div></Section>
      <nav className="case-study-footer surface-contact section-overlap" aria-label={content.footerLabel} data-reveal="section"><div><span>{content.footerEyebrow}</span><h2>{content.footerTitle}</h2></div><div className="case-study-footer-actions"><Link href="/contact" className="project-inspect-link project-inspect-link-primary">{t('contact')}<span className="arrow-icon"><ArrowSvg /></span></Link><Link href="/projects#uiux-projects-heading" className="project-inspect-link">{content.back}<span className="arrow-icon"><ArrowSvg /></span></Link></div></nav>
    </main>
  );
}

function Section({ title, intro, quote, children, className = '' }) { return <section className={`case-study-section section-surface ${className}`.trim()} data-reveal="section"><div className="case-study-section-heading"><MaskedHeading as="h2">{title}</MaskedHeading>{intro && <p>{intro}</p>}</div>{quote && <blockquote>{quote}</blockquote>}{children}</section>; }
function Card({ title, text }) { return <article className="case-study-card" data-reveal="card"><h3>{title}</h3><p>{text}</p></article>; }
function Overview({ number, title, text }) { return <article className="case-study-overview-card" data-reveal="card"><span>{String(number).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>; }
function FlowCard({ number, title, text, features = [] }) { return <article className="case-study-card qrakter-flow-card" data-reveal="card"><span className="about-order">{String(number).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p><ul className="case-study-chip-list">{features.map((feature) => <li key={feature}>{feature}</li>)}</ul></article>; }
function Decision({ item, index, labels, mediaContent }) { return <article className="case-study-decision qrakter-decision-card" data-reveal="sequence"><div className="qrakter-decision-copy"><span className="about-order">{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><Row label={labels.problem} text={item.problem} /><Row label={labels.reason} text={item.reason} /><Row label={labels.application} text={item.application} /><Row label={labels.result} text={item.result} /></div>{mediaContent && <div className="qrakter-decision-media">{mediaContent}</div>}</article>; }
function Row({ label, text }) { return <div className="case-study-decision-row"><strong>{label}</strong><p>{text}</p></div>; }
