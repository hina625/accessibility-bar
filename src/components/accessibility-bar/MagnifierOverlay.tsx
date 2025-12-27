'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function MagnifierOverlay() {
    const { magnifier } = useAccessibility();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [content, setContent] = useState<string>('');
    const [isVisible, setIsVisible] = useState(false);
    const rafRef = useRef<number>(null);

    useEffect(() => {
        if (!magnifier) {
            setIsVisible(false);
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            // Throttle slightly with RAF
            if (rafRef.current) cancelAnimationFrame(rafRef.current);

            rafRef.current = requestAnimationFrame(() => {
                setPosition({ x: e.clientX, y: e.clientY });

                const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
                if (target && !target.closest('.magnifier-lens') && !target.closest('.accessibility-bar')) {
                    // Get text content, prioritizing aria-label, alt, then text
                    const text = target.innerText || target.textContent || target.getAttribute('aria-label') || target.getAttribute('alt') || '';

                    // Only show if meaningful text
                    if (text.trim().length > 0) {
                        // Extract relevant chunk (word/sentence under cursor is hard, so show block)
                        // For better UX, we might limit length
                        const cleanText = text.trim().substring(0, 150);
                        if (content !== cleanText) {
                            setContent(cleanText);
                        }
                        setIsVisible(true);
                    } else {
                        setIsVisible(false);
                    }
                }
            });
        };

        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [magnifier]);

    if (!magnifier || !isVisible || !content) return null;

    return (
        <div
            className="magnifier-lens fixed z-[2147483647] pointer-events-none rounded-full border-4 border-blue-500 bg-white dark:bg-gray-900 shadow-2xl flex items-center justify-center overflow-hidden"
            style={{
                left: `${position.x}px`,
                top: `${position.y - 180}px`, // Float above cursor
                width: '300px',
                height: '150px',
                transform: 'translateX(-50%)',
                borderRadius: '20px' // Rectangular lens with rounded corners for text reading
            }}
        >
            <div className="p-4 text-center">
                <p className="text-[24px] font-bold text-black dark:text-white leading-tight">
                    {content}
                </p>
            </div>

            {/* Glossy overlay effect for realism */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none rounded-[16px]" />
        </div>
    );
}
