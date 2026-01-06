'use client';

import { useEffect, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ReadingGuideLine() {
  const { readingGuide, readingGuideColor, readingGuideThickness } = useAccessibility();
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
    </>
  );
}

