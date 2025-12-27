'use client';

import { useEffect, useState, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ReadingMaskOverlay() {
  const { readingMask, readingMaskColor } = useAccessibility();
  const [mouseY, setMouseY] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!readingMask) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for smoother performance
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        setMouseY(e.clientY);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [readingMask]);

  if (!readingMask) return null;

  const gapHeight = 140; // Height of the clear reading area

  return (
    <>
      {/* Top Mask */}
      <div
        className="fixed inset-x-0 top-0 z-[2147483646] pointer-events-none transition-[height] duration-75 ease-out"
        style={{
          height: `${Math.max(0, mouseY - gapHeight / 2)}px`,
          backgroundColor: readingMaskColor
        }}
        aria-hidden="true"
      />

      {/* Bottom Mask */}
      <div
        className="fixed inset-x-0 bottom-0 z-[2147483646] pointer-events-none transition-[top] duration-75 ease-out"
        style={{
          top: `${mouseY + gapHeight / 2}px`,
          backgroundColor: readingMaskColor
        }}
        aria-hidden="true"
      />

      {/* Focus Borders */}
      <div
        className="fixed inset-x-0 border-y-2 border-blue-500/30 z-[2147483646] pointer-events-none transition-[top,height] duration-75 ease-out shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        style={{
          top: `${mouseY - gapHeight / 2}px`,
          height: `${gapHeight}px`
        }}
        aria-hidden="true"
      />
    </>
  );
}
