'use client';
import { useEffect, useRef, useState } from 'react';

export default function GlobalCursor() {
  const cursorRef = useRef(null);

  const [state, setState] = useState({
    x: 0,
    y: 0,
    visible: false,
    big: false,
  });

  useEffect(() => {
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    const TEXT_SELECTOR =
      'a, p, span, h1, h2, h3, h4, h5, h6, strong, em, small, label';

    const onMove = (e) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);

      setState((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
        visible: true,
      }));
    };

    const onLeave = () => {
      setState((prev) => ({ ...prev, visible: false, big: false }));
    };

    // ✅ Sadece imlecin ALTINDAKİ element yazı/link ise büyüsün
    const onPointerOver = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const isText = target.matches(TEXT_SELECTOR);
      const isForced = target.getAttribute('data-cursor') === 'hover';

      if (isText || isForced) {
        setState((prev) => ({ ...prev, big: true, visible: true }));
      }
    };

    const onPointerOut = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const isText = target.matches(TEXT_SELECTOR);
      const isForced = target.getAttribute('data-cursor') === 'hover';

      if (isText || isForced) {
        setState((prev) => ({ ...prev, big: false }));
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
    };
  }, []);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    el.style.transform = `translate(${state.x}px, ${state.y}px) translate(-50%, -50%)`;
    el.style.opacity = state.visible ? '1' : '0';
    el.style.width = state.big ? '52px' : '38px';
    el.style.height = state.big ? '52px' : '38px';
  }, [state]);

  return (
    <>
      <span className="global-spotlight" aria-hidden="true" />
      <span ref={cursorRef} className="global-cursor" />
    </>
  );
}