'use client';

import { useEffect, useState, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ReadingSpotlightOverlay() {
    const { readingSpotlight } = useAccessibility();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const rafRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!readingSpotlight) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);

            rafRef.current = requestAnimationFrame(() => {
                setMousePos({ x: e.clientX, y: e.clientY });
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [readingSpotlight]);

    if (!readingSpotlight) return null;

    return (
        <div
            className="fixed inset-0 z-[2147483645] pointer-events-none"
            style={{
                background: `radial-gradient(circle 140px at ${mousePos.x}px ${mousePos.y}px, transparent 0, rgba(0, 0, 0, 0.7) 100%)`
            }}
            aria-hidden="true"
        />
    );
}
