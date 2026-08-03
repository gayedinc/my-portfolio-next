'use client';

import { useState } from 'react';

const MEDIA_VARIANTS = new Set([
  'phoneSingle',
  'phonePair',
  'phoneTriple',
  'phoneSlider',
  'longPhone',
  'heroDevices',
  'webSingle',
  'flow',
  'comparisonCompact',
]);

export default function CaseStudyMedia({
  src,
  images,
  alt,
  caption,
  variant = 'phoneSingle',
  priority = false,
  className = '',
  placeholderLabel,
  previousLabel = 'Previous image',
  nextLabel = 'Next image',
  slideLabel = 'Image',
}) {
  const safeVariant = MEDIA_VARIANTS.has(variant) ? variant : 'phoneSingle';
  const mediaItems = images?.length
    ? images
    : [{ src, alt, placeholderLabel, type: safeVariant === 'flow' ? 'flow' : safeVariant === 'webSingle' ? 'web' : 'phone' }];
  const classes = [
    'case-study-media',
    `case-study-media-${safeVariant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <figure className={classes}>
      {safeVariant === 'phoneSlider' && mediaItems.length > 1 ? (
        <MediaSlider
          items={mediaItems}
          fallbackAlt={alt}
          fallbackLabel={placeholderLabel}
          priority={priority}
          previousLabel={previousLabel}
          nextLabel={nextLabel}
          slideLabel={slideLabel}
        />
      ) : (
        <div className="case-study-media-items">
          {mediaItems.map((item, index) => (
            <MediaItem
              item={item}
              fallbackAlt={alt}
              fallbackLabel={placeholderLabel}
              priority={priority && index === 0}
              key={item.key || item.src || `${safeVariant}-${index}`}
            />
          ))}
        </div>
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function MediaSlider({ items, fallbackAlt, fallbackLabel, priority, previousLabel, nextLabel, slideLabel }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const showPrevious = () => setActiveIndex((index) => (index - 1 + items.length) % items.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % items.length);
  const activeItem = items[activeIndex];

  return (
    <div className="case-study-media-slider">
      <div className="case-study-media-slider-viewport" aria-live="polite">
        <MediaItem
          item={activeItem}
          fallbackAlt={fallbackAlt}
          fallbackLabel={fallbackLabel}
          priority={priority && activeIndex === 0}
          key={activeItem.key || activeItem.src}
        />
      </div>
      <div className="case-study-media-slider-controls">
        <button type="button" onClick={showPrevious} aria-label={previousLabel} className="case-study-media-slider-arrow">←</button>
        <div className="case-study-media-slider-dots" aria-label={`${activeIndex + 1} / ${items.length}`}>
          {items.map((item, index) => (
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${slideLabel} ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              className={index === activeIndex ? 'is-active' : ''}
              key={item.key || item.src}
            />
          ))}
        </div>
        <button type="button" onClick={showNext} aria-label={nextLabel} className="case-study-media-slider-arrow">→</button>
      </div>
    </div>
  );
}

function MediaItem({ item, fallbackAlt, fallbackLabel, priority }) {
  const [failed, setFailed] = useState(false);
  const itemVariant = item.variant || '';
  const itemClass = [
    'case-study-media-item',
    `case-study-media-item-${item.type || 'phone'}`,
    itemVariant && `case-study-media-item-${itemVariant}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={itemClass}>
      {item.label && <span className="case-study-media-item-label">{item.label}</span>}
      <div className="case-study-media-screen">
        {item.src && !failed ? (
          <img
            src={item.src}
            alt={item.alt || fallbackAlt || ''}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="case-study-media-placeholder" role="img" aria-label={item.alt || fallbackAlt}>
            <span>{item.placeholderLabel || fallbackLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
