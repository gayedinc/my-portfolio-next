'use client';
import { useEffect, useRef, useState } from 'react';

export default function GlobalCursor() {
  const cursorRef = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const renderRef = useRef({ x: 0, y: 0 });

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
      'a, button, p, span, h1, h2, h3, h4, h5, h6, strong, em, small, label';

    const animate = () => {
      const cursorNode = cursorRef.current;
      if (!cursorNode) {
        return;
      }

      const dx = targetRef.current.x - renderRef.current.x;
      const dy = targetRef.current.y - renderRef.current.y;

      renderRef.current.x += dx * 0.2;
      renderRef.current.y += dy * 0.2;

      const velocity = Math.min(Math.hypot(dx, dy), 36);
      const stretchX = 1 + velocity / 170;
      const stretchY = 1 - velocity / 300;

      cursorNode.style.transform = `translate(${renderRef.current.x}px, ${renderRef.current.y}px) translate(-50%, -50%) scale(${stretchX}, ${stretchY})`;

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);

    const onMove = (e) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);

      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;

      if (!renderRef.current.x && !renderRef.current.y) {
        renderRef.current.x = e.clientX;
        renderRef.current.y = e.clientY;
      }

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
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
    };
  }, []);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

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