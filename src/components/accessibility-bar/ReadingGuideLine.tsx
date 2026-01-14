'use client';

import { useEffect, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import Image from 'next/image';
import pinIcon from '@/assets/icons/office-push-pin.png';

export default function ReadingGuideLine() {
  const { readingGuide, readingGuideColor, readingGuideThickness, toggleReadingGuide } = useAccessibility();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (!readingGuide || isPinned) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingGuide, isPinned]);

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
          onClick={() => setIsPinned(!isPinned)}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md pointer-events-auto transition-all border ${isPinned
              ? (!readingGuideColor || readingGuideColor === '#FF0000' || readingGuideColor === 'rgba(255, 0, 0, 0.4)')
                  ? 'bg-green-500 hover:bg-green-600 border-black/20'
                  : 'bg-green-600 hover:bg-green-700 border-white/20'
              : (!readingGuideColor || readingGuideColor === '#FF0000' || readingGuideColor === 'rgba(255, 0, 0, 0.4)')
                  ? 'bg-yellow-400 hover:bg-yellow-500 border-black/20'
                  : 'bg-red-600 hover:bg-red-700 border-white/20'
              } hover:scale-110`}
          aria-label={isPinned ? "Unpin Reading Guide" : "Pin Reading Guide"}
          title={isPinned ? "Unpin Guide" : "Pin Guide"}
        >
          <Image src={pinIcon} alt="Pin" width={16} height={16} style={{ opacity: isPinned ? 1 : 0.8 }} />
        </button>
        <button
          onClick={toggleReadingGuide}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md pointer-events-auto transition-all border ${(!readingGuideColor || readingGuideColor === '#FF0000' || readingGuideColor === 'rgba(255, 0, 0, 0.4)')
            ? 'bg-yellow-400 hover:bg-yellow-500 border-black/20 text-black'
            : 'bg-red-600 hover:bg-red-700 border-white/20 text-white'
            } hover:scale-110`}
          aria-label="Close Reading Guide"
          title="Close Guide"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </>
  );
}

