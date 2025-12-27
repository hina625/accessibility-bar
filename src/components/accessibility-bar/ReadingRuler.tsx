'use client';

import { useEffect, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ReadingRuler() {
    const { readingRuler, readingRulerColor, readingRulerWidth } = useAccessibility();
    const [top, setTop] = useState(0);

    useEffect(() => {
        if (!readingRuler) return;

        const handleMouseMove = (e: MouseEvent) => {
            setTop(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [readingRuler]);

    if (!readingRuler) return null;

    return (
        <div
            aria-hidden="true"
            className="fixed left-0 right-0 pointer-events-none z-[2147483646] transition-transform duration-75 ease-out shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
            style={{
                top: 0,
                height: `${readingRulerWidth}px`,
                transform: `translateY(${top - readingRulerWidth / 2}px)`,
                backgroundColor: readingRulerColor,
                backgroundImage: `
          linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
        `,
                backgroundSize: '100px 30px, 50px 20px, 10px 10px',
                backgroundPosition: '0 bottom, 0 bottom, 0 bottom',
                backgroundRepeat: 'repeat-x',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                borderBottom: '2px solid rgba(0,0,0,0.3)',
            }}
        />
    );
}
