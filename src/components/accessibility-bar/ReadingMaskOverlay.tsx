'use client';

import { useEffect, useState, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ReadingMaskOverlay() {
  const { readingMask, readingMaskColor, readingMaskSize, toggleReadingMask } = useAccessibility();
  const [mouseY, setMouseY] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!readingMask) return;

    const handleMouseMove = (e: MouseEvent) => {

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

  const gapHeight = readingMaskSize;

  return (
    <>

      <div
        className="fixed inset-x-0 top-0 z-[2147483646] pointer-events-none transition-[height] duration-75 ease-out"
        style={{
          height: `${Math.max(0, mouseY - gapHeight / 2)}px`,
          backgroundColor: readingMaskColor
        }}
        aria-hidden="true"
      />


      <div
        className="fixed inset-x-0 bottom-0 z-[2147483646] pointer-events-none transition-[top] duration-75 ease-out"
        style={{
          top: `${mouseY + gapHeight / 2}px`,
          backgroundColor: readingMaskColor
        }}
        aria-hidden="true"
      />


      <div
        className="fixed inset-x-0 border-y-2 border-blue-500/30 z-[2147483646] pointer-events-none transition-[top,height] duration-75 ease-out shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        style={{
          top: `${mouseY - gapHeight / 2}px`,
          height: `${gapHeight}px`
        }}
        aria-hidden="true"
      />

      <button
        onClick={toggleReadingMask}
        className="fixed right-4 z-[2147483648] w-8 h-8 rounded-full flex items-center justify-center shadow-md pointer-events-auto transition-all border bg-red-600 hover:bg-red-700 border-white/20 text-white hover:scale-110"
        style={{
          top: `${mouseY}px`,
          transform: 'translateY(-50%)'
        }}
        aria-label="Close Reading Mask"
        title="Close Mask"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </>
  );
}
