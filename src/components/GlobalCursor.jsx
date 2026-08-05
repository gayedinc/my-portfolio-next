'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'textarea:not(:disabled)',
  'select:not(:disabled)',
  'summary',
  'label',
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="tab"]',
  '[role="switch"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
  '[data-cursor="hover"]',
].join(', ');

const CURSOR_SCALE_DEFAULT = 1;
const CURSOR_SCALE_EXPANDED = 1.45;

export default function GlobalCursor() {
  const cursorRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    const cursorNode = cursorRef.current;
    const spotlightNode = spotlightRef.current;
    if (!cursorNode || !spotlightNode) {
      return undefined;
    }

    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const target = { x: 0, y: 0 };
    const rendered = { x: 0, y: 0 };
    let hasPosition = false;
    let frameId = null;
    let activeCleanup = null;
    let targetScale = CURSOR_SCALE_DEFAULT;
    let renderedScale = CURSOR_SCALE_DEFAULT;

    const stopAnimation = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const hideCursor = () => {
      stopAnimation();
      hasPosition = false;
      targetScale = CURSOR_SCALE_DEFAULT;
      renderedScale = CURSOR_SCALE_DEFAULT;
      cursorNode.style.opacity = '0';
      spotlightNode.style.opacity = '0';
    };

    const renderCursor = () => {
      frameId = null;
      const deltaX = target.x - rendered.x;
      const deltaY = target.y - rendered.y;
      const distance = Math.hypot(deltaX, deltaY);
      const scaleDelta = targetScale - renderedScale;
      const positionSettled = distance < 0.12;
      const scaleSettled = Math.abs(scaleDelta) < 0.002;

      if (positionSettled) {
        rendered.x = target.x;
        rendered.y = target.y;
      } else {
        rendered.x += deltaX * 0.2;
        rendered.y += deltaY * 0.2;
      }

      if (scaleSettled) {
        renderedScale = targetScale;
      } else {
        renderedScale += scaleDelta * 0.22;
      }

      const velocity = Math.min(distance, 36);
      const stretchX = renderedScale * (1 + velocity / 170);
      const stretchY = renderedScale * (1 - velocity / 300);

      document.documentElement.style.setProperty('--cursor-x', `${rendered.x}px`);
      document.documentElement.style.setProperty('--cursor-y', `${rendered.y}px`);
      cursorNode.style.transform = `translate(${rendered.x}px, ${rendered.y}px) translate(-50%, -50%) scale(${stretchX}, ${stretchY})`;

      if (!positionSettled || !scaleSettled) {
        frameId = window.requestAnimationFrame(renderCursor);
      }
    };

    const scheduleAnimation = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(renderCursor);
      }
    };

    const setExpanded = (isExpanded) => {
      const nextScale = isExpanded ? CURSOR_SCALE_EXPANDED : CURSOR_SCALE_DEFAULT;
      if (targetScale === nextScale) {
        return;
      }

      targetScale = nextScale;
      if (hasPosition) {
        scheduleAnimation();
      }
    };

    const handlePointerMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;

      if (!hasPosition) {
        rendered.x = event.clientX;
        rendered.y = event.clientY;
        hasPosition = true;
      }

      cursorNode.style.opacity = '1';
      spotlightNode.style.opacity = '1';
      scheduleAnimation();
    };

    const handlePointerOver = (event) => {
      const element = event.target instanceof Element ? event.target : null;
      if (element?.closest(INTERACTIVE_SELECTOR)) {
        setExpanded(true);
      }
    };

    const handlePointerOut = (event) => {
      const nextElement = event.relatedTarget instanceof Element
        ? event.relatedTarget
        : null;
      if (!nextElement?.closest(INTERACTIVE_SELECTOR)) {
        setExpanded(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hideCursor();
      }
    };

    const enableCursor = () => {
      targetScale = CURSOR_SCALE_DEFAULT;
      renderedScale = CURSOR_SCALE_DEFAULT;
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('blur', hideCursor);
      document.documentElement.addEventListener('mouseleave', hideCursor);
      document.addEventListener('pointerover', handlePointerOver);
      document.addEventListener('pointerout', handlePointerOut);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        hideCursor();
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('blur', hideCursor);
        document.documentElement.removeEventListener('mouseleave', hideCursor);
        document.removeEventListener('pointerover', handlePointerOver);
        document.removeEventListener('pointerout', handlePointerOut);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    };

    const syncPreferences = () => {
      activeCleanup?.();
      activeCleanup = null;
      hasPosition = false;

      if (finePointer.matches && !reducedMotion.matches) {
        activeCleanup = enableCursor();
      } else {
        hideCursor();
      }
    };

    finePointer.addEventListener('change', syncPreferences);
    reducedMotion.addEventListener('change', syncPreferences);
    syncPreferences();

    return () => {
      finePointer.removeEventListener('change', syncPreferences);
      reducedMotion.removeEventListener('change', syncPreferences);
      activeCleanup?.();
      stopAnimation();
    };
  }, []);

  return (
    <>
      <span ref={spotlightRef} className="global-spotlight" aria-hidden="true" />
      <span ref={cursorRef} className="global-cursor" aria-hidden="true" />
    </>
  );
}
