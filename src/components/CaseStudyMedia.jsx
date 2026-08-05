'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

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
  const [previousIndex, setPreviousIndex] = useState(null);
  const [direction, setDirection] = useState(1);
  const touchStart = useRef(null);
  const transitionTimer = useRef(null);
  const activeItem = items[activeIndex];

  useEffect(() => () => {
    if (transitionTimer.current) {
      window.clearTimeout(transitionTimer.current);
    }
  }, []);

  const changeSlide = (nextIndex, nextDirection) => {
    if (nextIndex === activeIndex) return;

    if (transitionTimer.current) {
      window.clearTimeout(transitionTimer.current);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPreviousIndex(prefersReducedMotion ? null : activeIndex);
    setDirection(nextDirection);
    setActiveIndex(nextIndex);
    if (!prefersReducedMotion) {
      transitionTimer.current = window.setTimeout(() => setPreviousIndex(null), 420);
    }
  };

  const showPrevious = () => changeSlide((activeIndex - 1 + items.length) % items.length, -1);
  const showNext = () => changeSlide((activeIndex + 1) % items.length, 1);

  return (
    <div
      className="case-study-media-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label={slideLabel}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          showPrevious();
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          showNext();
        }
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
      }}
      onTouchEnd={(event) => {
        if (!touchStart.current) return;
        const touch = event.changedTouches[0];
        const distanceX = (touch?.clientX ?? touchStart.current.x) - touchStart.current.x;
        const distanceY = (touch?.clientY ?? touchStart.current.y) - touchStart.current.y;
        if (Math.abs(distanceX) > 45 && Math.abs(distanceX) > Math.abs(distanceY) * 1.2) {
          distanceX > 0 ? showPrevious() : showNext();
        }
        touchStart.current = null;
      }}
    >
      <div className="case-study-media-slider-viewport" aria-live="polite" aria-atomic="true">
        {previousIndex !== null && (
          <div className={`case-study-media-slide is-outgoing direction-${direction}`} aria-hidden="true">
            <MediaItem
              item={items[previousIndex]}
              fallbackAlt={fallbackAlt}
              fallbackLabel={fallbackLabel}
              priority={false}
            />
          </div>
        )}
        <div
          className={`case-study-media-slide is-active direction-${direction}`}
          role="group"
          aria-label={`${slideLabel} ${activeIndex + 1} / ${items.length}`}
          key={activeItem.key || activeItem.src}
        >
          <MediaItem
            item={activeItem}
            fallbackAlt={fallbackAlt}
            fallbackLabel={fallbackLabel}
            priority={priority && activeIndex === 0}
          />
        </div>
      </div>
      <div className="case-study-media-slider-controls">
        <button type="button" onClick={showPrevious} aria-label={previousLabel} className="case-study-media-slider-arrow">←</button>
        <div className="case-study-media-slider-dots" aria-label={`${activeIndex + 1} / ${items.length}`}>
          {items.map((item, index) => (
            <button
              type="button"
              onClick={() => changeSlide(index, index > activeIndex ? 1 : -1)}
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
  const isWeb = item.type === 'web';
  const width = item.width || (isWeb ? 1580 : 531);
  const height = item.height || (isWeb ? 1013 : 1050);
  const sizes = item.sizes || (isWeb
    ? '(max-width: 767px) 88vw, (max-width: 1199px) 64vw, 44vw'
    : '(max-width: 767px) 62vw, (max-width: 1199px) 32vw, 260px');

  return (
    <div className={itemClass}>
      {item.label && <span className="case-study-media-item-label">{item.label}</span>}
      <div className="case-study-media-screen">
        {item.src && !failed ? (
          <Image
            src={item.src}
            alt={item.alt || fallbackAlt || ''}
            width={width}
            height={height}
            sizes={sizes}
            priority={priority}
            fetchPriority={priority ? 'high' : 'auto'}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="case-study-media-placeholder" role="img" aria-label={item.alt || fallbackAlt || fallbackLabel || 'Media preview'}>
            <span>{item.placeholderLabel || fallbackLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
