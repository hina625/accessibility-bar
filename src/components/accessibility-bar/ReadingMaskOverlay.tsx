'use client';

import { useEffect, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ReadingMaskOverlay() {
  const { readingMask } = useAccessibility();
  const [maskPosition, setMaskPosition] = useState<{ x: number; y: number; height: number } | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    let maskEl: HTMLDivElement | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const height = element ? (element as HTMLElement).getBoundingClientRect().height : 200;
      if (!maskEl) return;
      const maskY = element ? e.clientY - (height / 2) : e.clientY;
      const size = Math.max(height * 1.5, 100);
      const maskImage = `radial-gradient(ellipse 300px ${size}px at ${e.clientX}px ${maskY}px, transparent 30%, black 60%)`;
      maskEl.style.maskImage = maskImage;
      (maskEl.style as any).WebkitMaskImage = maskImage;
    };

    if (readingMask) {
      maskEl = document.createElement('div');
      maskEl.id = 'a11y-reading-mask-overlay';
      maskEl.setAttribute('aria-hidden', 'true');
    
      Object.assign(maskEl.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        pointerEvents: 'none',
        zIndex: '2147483646',
        backgroundColor: 'rgba(0,0,0,0.5)',
      });
      document.body.appendChild(maskEl);
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (maskEl && maskEl.parentNode) maskEl.parentNode.removeChild(maskEl);
    };
  }, [readingMask]);

  return null;
}

