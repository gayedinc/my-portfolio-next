'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, p, span, h1, h2, h3, h4, h5, h6, strong, em, small, label, [data-cursor="hover"]';

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

    const stopAnimation = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const setExpanded = (isExpanded) => {
      cursorNode.style.width = isExpanded ? '52px' : '38px';
      cursorNode.style.height = isExpanded ? '52px' : '38px';
    };

    const hideCursor = () => {
      stopAnimation();
      hasPosition = false;
      cursorNode.style.opacity = '0';
      spotlightNode.style.opacity = '0';
      setExpanded(false);
    };

    const renderCursor = () => {
      frameId = null;
      const deltaX = target.x - rendered.x;
      const deltaY = target.y - rendered.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < 0.12) {
        rendered.x = target.x;
        rendered.y = target.y;
        cursorNode.style.transform = `translate(${rendered.x}px, ${rendered.y}px) translate(-50%, -50%)`;
        return;
      }

      rendered.x += deltaX * 0.2;
      rendered.y += deltaY * 0.2;

      const velocity = Math.min(distance, 36);
      const stretchX = 1 + velocity / 170;
      const stretchY = 1 - velocity / 300;
      cursorNode.style.transform = `translate(${rendered.x}px, ${rendered.y}px) translate(-50%, -50%) scale(${stretchX}, ${stretchY})`;
      frameId = window.requestAnimationFrame(renderCursor);
    };

    const scheduleAnimation = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(renderCursor);
      }
    };

    const handlePointerMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);

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
      setExpanded(false);
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
