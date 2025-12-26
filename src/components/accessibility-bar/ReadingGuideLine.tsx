'use client';

import { useEffect, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ReadingGuideLine() {
  const { readingGuide } = useAccessibility();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  
  useEffect(() => {
    if (typeof document === 'undefined') return;
    let vert: HTMLDivElement | null = null;
    let horz: HTMLDivElement | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (vert) vert.style.left = `${e.clientX}px`;
      if (horz) horz.style.top = `${e.clientY}px`;
    };

    if (readingGuide) {
      vert = document.createElement('div');
      horz = document.createElement('div');
      vert.setAttribute('aria-hidden', 'true');
      horz.setAttribute('aria-hidden', 'true');
      Object.assign(vert.style, {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: '2147483646',
        borderLeft: '2px solid rgba(59,130,246,0.5)',
        top: '0',
        bottom: '0',
        width: '2px',
        transform: 'translateX(-50%)',
      });
      Object.assign(horz.style, {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: '2147483646',
        borderTop: '2px solid rgba(59,130,246,0.5)',
        left: '0',
        right: '0',
        height: '2px',
        transform: 'translateY(-50%)',
      });
      document.body.appendChild(vert);
      document.body.appendChild(horz);
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (vert && vert.parentNode) vert.parentNode.removeChild(vert);
      if (horz && horz.parentNode) horz.parentNode.removeChild(horz);
    };
  }, [readingGuide]);

  return null;
}

