'use client';

import { useEffect, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ReadingGuideLine() {
  const { readingGuide, readingGuideColor, readingGuideThickness, toggleReadingGuide } = useAccessibility();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!readingGuide) return;

    const updatePosition = (x: number, y: number) => {
      setPosition({ x, y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling while using reading guide
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [readingGuide]);

  if (!readingGuide) return null;

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 2147483646,
          borderLeft: `${readingGuideThickness}px solid ${readingGuideColor}`,
          top: 0,
          bottom: 0,
          left: position.x,
          width: `${readingGuideThickness}px`,
          transform: 'translateX(-50%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 2147483646,
          borderTop: `${readingGuideThickness}px solid ${readingGuideColor}`,
          left: 0,
          right: 0,
          top: position.y,
          height: `${readingGuideThickness}px`,
          transform: 'translateY(-50%)',
        }}
      />    
      <div
        className="fixed right-4 z-[2147483648] flex items-center gap-2"
        style={{
          top: position.y,
          transform: 'translateY(-50%)'
        }}
      >
        <button
          onClick={toggleReadingGuide}
          className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md pointer-events-auto transition-all border touch-manipulation ${(!readingGuideColor || readingGuideColor === '#FF0000' || readingGuideColor === 'rgba(255, 0, 0, 0.4)')
            ? 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 border-black/20 text-black'
            : 'bg-red-600 hover:bg-red-700 active:bg-red-800 border-white/20 text-white'
            } hover:scale-110 active:scale-95`}
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Close Reading Guide"
          title="Close Guide"
        >
          <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </>
  );
}

