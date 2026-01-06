'use client';

import { useEffect, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ReadingGuideLine() {
  const { readingGuide, readingGuideColor, readingGuideThickness, toggleReadingGuide } = useAccessibility();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!readingGuide) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingGuide]);

  if (!readingGuide) return null;

  return (
    <>
      {/* Vertical Line */}
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
      {/* Horizontal Line */}
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
      {/* Close Button - positioned to move with the horizontal line */}
      <button
        onClick={toggleReadingGuide}
        className={`fixed right-4 z-[2147483648] w-8 h-8 rounded-full flex items-center justify-center shadow-md pointer-events-auto transition-all border ${(!readingGuideColor || readingGuideColor === '#FF0000' || readingGuideColor === 'rgba(255, 0, 0, 0.4)')
          ? 'bg-yellow-400 hover:bg-yellow-500 border-black/20 text-black'
          : 'bg-red-600 hover:bg-red-700 border-white/20 text-white'
          } hover:scale-110`}
        style={{
          top: position.y,
          transform: 'translateY(-50%)'
        }}
        aria-label="Close Reading Guide"
        title="Close Guide"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </>
  );
}

