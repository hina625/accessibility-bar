'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { translations } from '@/contexts/accessibility/translations';

export default function TtsPlayer() {
    const {
        textToSpeech,
        ttsMovableControls,
        toggleTtsMovableControls,
        barTheme,
        language,
        ttsReadingSpeed,
        ttsVoiceGender,
        isPaused,
        pauseTts,
        resumeTts,
        stopTts,
        muteAudio,
        toggleMuteAudio
    } = useAccessibility();

    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<{ startX: number; startY: number; startPos: { x: number; y: number } } | null>(null);

    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
    const t = translations[language] || translations['en'];

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startPos: { ...position }
        };
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 0) return;
        setIsDragging(true);
        dragRef.current = {
            startX: e.touches[0].clientX,
            startY: e.touches[0].clientY,
            startPos: { ...position }
        };
    };

    const handleStop = () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!dragRef.current) return;
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

            const deltaX = clientX - dragRef.current.startX;
            const deltaY = clientY - dragRef.current.startY;

            setPosition({
                x: Math.max(0, Math.min(window.innerWidth - 220, dragRef.current.startPos.x + deltaX)),
                y: Math.max(0, Math.min(window.innerHeight - 120, dragRef.current.startPos.y + deltaY))
            });
        };

        const handleEnd = () => {
            setIsDragging(false);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleEnd);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging]);

    // Only render if TTS is on and movable controls are enabled
    if (!textToSpeech || !ttsMovableControls) return null;

    return (
        <div
            className="fixed z-[9999] shadow-2xl rounded-xl p-4 flex flex-col gap-3 min-w-[200px] select-none cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                backgroundColor: theme.background,
                border: `2px solid ${theme.active}`,
                cursor: isDragging ? 'grabbing' : 'grab',
                pointerEvents: 'auto'
            }}
        >
            {/* Header / Drag Handle */}
            <div
                className="relative flex items-center justify-between border-b pb-2 mb-1"
                style={{ borderColor: `${theme.text}22` }}
            >
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.active }} />
                    <span className="text-[14px] font-bold tracking-wider" style={{ color: theme.text }}>TTS Player</span>
                </div>
                {/* Close Button - "X Exit" */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleTtsMovableControls();
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all hover:scale-105 active:scale-95 border"
                    style={{
                        backgroundColor: theme.active,
                        color: (() => {
                            const hex = theme.active.replace('#', '');
                            const r = parseInt(hex.substring(0, 2), 16);
                            const g = parseInt(hex.substring(2, 4), 16);
                            const b = parseInt(hex.substring(4, 6), 16);
                            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                            return (yiq >= 128) ? '#000000' : '#FFFFFF';
                        })(),
                        borderColor: 'rgba(0,0,0,0.1)'
                    }}
                    aria-label={t.common.close}
                >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span className="text-[10px] font-black tracking-wide">Exit</span>
                </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 py-2">
                <button
                    onClick={isPaused ? resumeTts : pauseTts}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    style={{ backgroundColor: `${theme.text}11`, color: theme.text }}
                    title={isPaused ? (t.controls.play || "Play") : (t.controls.pause || "Pause")}
                >
                    {isPaused ? (
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    )}
                </button>

                <button
                    onClick={stopTts}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    style={{ backgroundColor: `${theme.text}11`, color: theme.text }}
                    title={t.controls.stopReading || "Stop"}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 6h12v12H6z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
