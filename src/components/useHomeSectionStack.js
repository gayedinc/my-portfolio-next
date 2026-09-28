'use client';

import { useEffect } from 'react';

// Native sticky keeps each panel's full height in document flow. Only its
// resting position is measured; scrolling and stacking stay browser-managed.
export function useHomeSectionStack(mainRef) {
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return undefined;

    const panels = [...main.querySelectorAll('[data-stack-panel]')];
    const header = document.querySelector('.header');
    let frameId = null;

    const measure = () => {
      frameId = null;
      const viewportHeight = document.documentElement.clientHeight;
      const headerHeight = header?.getBoundingClientRect().height || 0;
      const positions = panels.map((panel) => (
        Math.min(headerHeight, viewportHeight - panel.getBoundingClientRect().height)
      ));

      panels.forEach((panel, index) => {
        // Tall panels scroll until their bottom reaches the viewport bottom.
        // Short panels can rest below the header once all content is visible.
        const value = `${positions[index]}px`;
        if (panel.style.getPropertyValue('--stack-top') !== value) {
          panel.style.setProperty('--stack-top', value);
        }
      });
      main.dataset.stackReady = 'true';
    };

    const scheduleMeasurement = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(measure);
    };

    const observer = new ResizeObserver(scheduleMeasurement);
    panels.forEach((panel) => observer.observe(panel));
    if (header) observer.observe(header);
    window.addEventListener('resize', scheduleMeasurement);
    measure();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', scheduleMeasurement);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      delete main.dataset.stackReady;
      panels.forEach((panel) => panel.style.removeProperty('--stack-top'));
    };
  }, [mainRef]);
}
