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
        stopTts
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

    const handleStop = () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!dragRef.current) return;
            const deltaX = e.clientX - dragRef.current.startX;
            const deltaY = e.clientY - dragRef.current.startY;

            setPosition({
                x: Math.max(0, Math.min(window.innerWidth - 220, dragRef.current.startPos.x + deltaX)),
                y: Math.max(0, Math.min(window.innerHeight - 120, dragRef.current.startPos.y + deltaY))
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // Only render if TTS is on and movable controls are enabled
    if (!textToSpeech || !ttsMovableControls) return null;

    return (
        <div
            className="fixed z-[9999] shadow-2xl rounded-xl p-4 flex flex-col gap-3 min-w-[200px] select-none"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                backgroundColor: theme.background,
                border: `2px solid ${theme.active}`,
                cursor: isDragging ? 'grabbing' : 'auto',
                pointerEvents: 'auto'
            }}
        >
            {/* Header / Drag Handle */}
            <div
                className="flex items-center justify-between cursor-grab active:cursor-grabbing border-b pb-2 mb-1"
                onMouseDown={handleMouseDown}
                style={{ borderColor: `${theme.text}22` }}
            >
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.active }} />
                    <span className="text-[14px] font-bold uppercase tracking-wider" style={{ color: theme.text }}>TTS Player</span>
                </div>
                <button
                    onClick={toggleTtsMovableControls}
                    className="p-1 pr-2 rounded-full transition-all hover:bg-black/10 flex items-center gap-1"
                    style={{ color: theme.text }}
                    aria-label={t.common.close}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Close</span>
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

            {/* Status Info */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[16px] font-bold uppercase tracking-tight" style={{ color: theme.text, opacity: 0.8 }}>
                    <span>{ttsReadingSpeed.toFixed(1)}x Speed</span>
                    <span>{ttsVoiceGender}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.text}33` }}>
                    <div className="h-full transition-all duration-300" style={{ width: '100%', backgroundColor: theme.active }} />
                </div>
            </div>
        </div>
    );
}
