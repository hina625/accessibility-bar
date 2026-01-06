'use client';

import { useEffect, useState, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ReadingSpotlightOverlay() {
    const { readingSpotlight, readingSpotlightBrightness, toggleReadingSpotlight } = useAccessibility();
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
        <>
            {/* Dark Background Overlay */}
            <div
                className="fixed inset-0 z-[2147483645] pointer-events-none"
                style={{
                    background: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, transparent 0, rgba(0, 0, 0, 0.85) 100%)`
                }}
                aria-hidden="true"
            />
            {/* Brightness Boost Overlay */}
            <div
                className="fixed inset-0 z-[2147483645] pointer-events-none"
                style={{
                    backdropFilter: `brightness(${readingSpotlightBrightness})`,
                    WebkitMaskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                    maskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`
                }}
                aria-hidden="true"
            />
            {/* Close Button - fixed at top right since spotlight follows cursor */}
            <button
                onClick={toggleReadingSpotlight}
                className="fixed top-4 right-4 z-[2147483648] w-8 h-8 rounded-full flex items-center justify-center shadow-md pointer-events-auto transition-all border bg-red-600 hover:bg-red-700 border-white/20 text-white hover:scale-110"
                aria-label="Close Spotlight"
                title="Close Spotlight"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </>
    );
}
