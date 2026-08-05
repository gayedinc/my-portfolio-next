'use client';

import { useEffect, useRef } from 'react';

export const REVEAL_READY_EVENT = 'portfolio:reveal-ready';

export function useRevealHydrationBoundary() {
  const boundaryRef = useRef(null);

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary) {
      return undefined;
    }

    boundary.dataset.revealReady = 'true';
    boundary.dispatchEvent(new CustomEvent(REVEAL_READY_EVENT, { bubbles: true }));

    return () => {
      delete boundary.dataset.revealReady;
    };
  }, []);

  return boundaryRef;
}
