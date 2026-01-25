'use client';

import { useEffect, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import Image from 'next/image';
import pinIcon from '@/assets/icons/office-push-pin.png';

export default function ReadingRuler() {
    const { readingRuler, readingRulerColor, readingRulerWidth, toggleReadingRuler } = useAccessibility();
    const [top, setTop] = useState(0);
    const [isPinned, setIsPinned] = useState(false);

    useEffect(() => {
        if (!readingRuler || isPinned) return;

        const updatePosition = (y: number) => {
            setTop(y);
        };

        const handleMouseMove = (e: MouseEvent) => {
            updatePosition(e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault(); // Prevent scrolling while using reading ruler
            if (e.touches.length > 0) {
                updatePosition(e.touches[0].clientY);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [readingRuler, isPinned]);

    if (!readingRuler) return null;

    const isDark = () => {
        if (!readingRulerColor) return true;
        try {
            if (readingRulerColor.startsWith('rgba') || readingRulerColor.startsWith('rgb')) {
                const matches = readingRulerColor.match(/\d+/g);
                if (matches && matches.length >= 3) {
                    const r = parseInt(matches[0]);
                    const g = parseInt(matches[1]);
                    const b = parseInt(matches[2]);
                    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
                }
            }
            if (readingRulerColor.startsWith('#')) {
                const hex = readingRulerColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return (r * 299 + g * 587 + b * 114) / 1000 < 128;
            }
        } catch (e) {
            return true;
        }
        return true;
    };

    const contrastColor = isDark() ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
    const textColor = isDark() ? 'white' : 'black';

    return (
        <div
            aria-hidden="true"
            className="fixed left-0 right-0 pointer-events-none z-[2147483646] transition-transform duration-75 ease-out shadow-[0_8px_24px_rgba(0,0,0,0.3)] flex items-center overflow-hidden"
            style={{
                top: 0,
                height: `${readingRulerWidth}px`,
                transform: `translateY(${top - readingRulerWidth / 2}px)`,
                backgroundColor: readingRulerColor,
                borderTop: `1px solid ${isDark() ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                borderBottom: `2px solid ${isDark() ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)'}`,
            }}
        >
            {/* Close Button and Pin Icon */}
            <div className="absolute right-4 z-[2147483648] flex items-center gap-2">
                <button
                    onClick={() => setIsPinned(!isPinned)}
                    className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md pointer-events-auto transition-all border touch-manipulation ${isPinned
                        ? (readingRulerColor === 'rgba(22, 163, 74, 1)')
                            ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 border-white/20'
                            : (!readingRulerColor || readingRulerColor === '#FF0000' || readingRulerColor === 'rgba(255, 0, 0, 0.4)' || readingRulerColor === 'rgba(220, 38, 38, 1)')
                                ? 'bg-green-500 hover:bg-green-600 active:bg-green-700 border-black/20'
                                : 'bg-green-600 hover:bg-green-700 active:bg-green-800 border-white/20'
                        : (!readingRulerColor || readingRulerColor === '#FF0000' || readingRulerColor === 'rgba(255, 0, 0, 0.4)' || readingRulerColor === 'rgba(220, 38, 38, 1)')
                            ? 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 border-black/20'
                            : 'bg-red-600 hover:bg-red-700 active:bg-red-800 border-white/20'
                        } hover:scale-110 active:scale-95`}
                    style={{ minWidth: '44px', minHeight: '44px' }}
                    aria-label={isPinned ? "Unpin Reading Ruler" : "Pin Reading Ruler"}
                    title={isPinned ? "Unpin Ruler" : "Pin Ruler"}
                >
                    <Image src={pinIcon} alt="Pin" width={18} height={18} className="sm:w-4 sm:h-4" style={{ opacity: isPinned ? 1 : 0.8 }} />
                </button>
                <button
                    onClick={toggleReadingRuler}
                    className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md pointer-events-auto transition-all border touch-manipulation ${(!readingRulerColor || readingRulerColor === '#FF0000' || readingRulerColor === 'rgba(255, 0, 0, 0.4)' || readingRulerColor === 'rgba(220, 38, 38, 1)')
                        ? 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 border-black/20 text-black'
                        : 'bg-red-600 hover:bg-red-700 active:bg-red-800 border-white/20 text-white'
                        } hover:scale-110 active:scale-95`}
                    style={{ minWidth: '44px', minHeight: '44px' }}
                    aria-label="Close Reading Ruler"
                    title="Close Ruler"
                >
                    <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            {/* Ruler Ticks Mapping */}
            <div className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `
                        repeating-linear-gradient(90deg, ${contrastColor} 0, ${contrastColor} 1px, transparent 1px, transparent 4px),
                        repeating-linear-gradient(90deg, ${contrastColor} 0, ${contrastColor} 1px, transparent 1px, transparent 20px),
                        repeating-linear-gradient(90deg, ${contrastColor} 0, ${contrastColor} 2px, transparent 2px, transparent 40px)
                    `,
                    backgroundSize: `
                        100% 20%,
                        100% 40%,
                        100% 60%
                    `,
                    backgroundPosition: '0 0, 0 0, 0 0',
                    backgroundRepeat: 'repeat-x'
                }}
            />

            {/* Numeric Markings */}
            <div className="absolute inset-x-0 bottom-1 flex pointer-events-none opacity-60 px-[1px]">
                {Array.from({ length: Math.ceil(typeof window !== 'undefined' ? window.innerWidth / 40 : 50) }).map((_, i) => (
                    <div key={i} className="flex-none" style={{ width: '40px' }}>
                        <span className="text-[10px] font-bold font-mono ml-1 select-none" style={{ color: textColor }}>
                            {i}
                        </span>
                    </div>
                ))}
            </div>

            {/* Subtle Texture Overlay - Removed external URL */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
                style={{
                    backgroundColor: 'rgba(255,255,255,0.05)'
                }}
            />
        </div>
    );
}
