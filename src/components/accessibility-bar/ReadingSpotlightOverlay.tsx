'use client';

import { useEffect, useState, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ReadingSpotlightOverlay() {
    const { readingSpotlight, readingSpotlightBrightness, toggleReadingSpotlight } = useAccessibility();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const rafRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!readingSpotlight) return;

        const updatePosition = (x: number, y: number) => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);

            rafRef.current = requestAnimationFrame(() => {
                setMousePos({ x, y });
            });
        };

        const handleMouseMove = (e: MouseEvent) => {
            updatePosition(e.clientX, e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault(); // Prevent scrolling while using spotlight
            if (e.touches.length > 0) {
                updatePosition(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
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
                className="fixed top-4 right-4 z-[2147483648] w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md pointer-events-auto transition-all border bg-red-600 hover:bg-red-700 active:bg-red-800 border-white/20 text-white hover:scale-110 active:scale-95 touch-manipulation"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label="Close Spotlight"
                title="Close Spotlight"
            >
                <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </>
    );
}
