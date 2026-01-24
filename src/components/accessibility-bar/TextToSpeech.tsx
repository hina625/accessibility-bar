'use client';

import { useState, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { speak } from '@/utils/speechUtils';
import { translations } from '@/contexts/accessibility/translations';
import InfoPopupButton from './InfoPopupButton';

interface TextToSpeechProps {
    onClosePanel?: () => void;
}

export default function TextToSpeech({ onClosePanel }: TextToSpeechProps = { onClosePanel: undefined }) {
    const {
        textToSpeech, toggleTextToSpeech,
        ttsAutoPlay, toggleTtsAutoPlay,
        ttsReadWholePage, toggleTtsReadWholePage,
        ttsMovableControls, toggleTtsMovableControls,
        ttsVoiceGender, setTtsVoiceGender,
        ttsReadingSpeed, setTtsReadingSpeed,
        ttsHoverToSpeak, toggleTtsHoverToSpeak,
        stopTts,
        barTheme,
        language
    } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
    const t = translations[language] || translations['en'];

    const [expandedCategory, setExpandedCategory] = useState<'male' | 'female' | null>(null);

    // When "Read whole page" is turned off, stop TTS
    useEffect(() => {
        if (!ttsReadWholePage && textToSpeech) {
            stopTts();
        }
    }, [ttsReadWholePage, textToSpeech, stopTts]);

    const handleToggleReadWholePage = () => {
        const wasEnabled = ttsReadWholePage;
        toggleTtsReadWholePage();
        // If turning off, stop TTS immediately
        if (wasEnabled) {
            stopTts();
        }
    };

    return (
        <div className="space-y-4">
            {/* Main Toggle: Text to Speech (On/Off) */}
            {/* Main Toggle: Text to Speech (On/Off) */}
            <div
                className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
                style={{ backgroundColor: theme.hover }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                onClick={toggleTextToSpeech}
            >
                <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[16px] font-medium" style={{ color: theme.text }}>{t.controls.tts}</span>
                        <div onClick={(e) => e.stopPropagation()}>
                            <InfoPopupButton
                                title={t.controls.tts}
                                description={t.info?.speech?.features?.["Text to Speech"] || "Read the page content aloud."}
                            />
                        </div>
                    </div>
                    <span className="text-[14px]" style={{ color: theme.text, opacity: 0.7 }}>{t.info?.speech?.features?.["Text to Speech"] || "Read the page content aloud."}</span>
                </div>
                <div
                    className="w-[28px] h-[28px] rounded flex items-center justify-center transition-all ml-3"
                    style={{
                        backgroundColor: textToSpeech ? theme.active : 'rgba(255, 255, 255, 0.9)',
                        border: textToSpeech ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                >
                    {textToSpeech && (
                        <svg className="w-5 h-5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>

            {textToSpeech && (
                <>
                    {/* Voice Selection */}
                    <div className="px-4 space-y-3 pt-2">
                        <span className="text-[16px] font-bold block" style={{ color: theme.text }}>{t.controls.voice}</span>

                        {/* Male Category */}
                        <div className="space-y-1">
                            <div
                                className="flex items-center justify-between cursor-pointer py-2 px-3 rounded-lg transition-all"
                                style={{
                                    backgroundColor: expandedCategory === 'male' ? theme.active : theme.hover
                                }}
                                onMouseEnter={(e) => {
                                    if (expandedCategory !== 'male') {
                                        e.currentTarget.style.backgroundColor = theme.active;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (expandedCategory !== 'male') {
                                        e.currentTarget.style.backgroundColor = theme.hover;
                                    }
                                }}
                                onClick={() => setExpandedCategory(expandedCategory === 'male' ? null : 'male')}
                            >
                                <span className="text-[16px] font-semibold" style={{ color: theme.text }}>
                                    {t.controls.male}
                                </span>
                                <svg
                                    className={`w-5 h-5 transition-transform ${expandedCategory === 'male' ? 'rotate-180' : ''}`}
                                    style={{ color: theme.text }}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {expandedCategory === 'male' && (
                                <div className="space-y-1 pl-2 pt-1">
                                    {([
                                        { id: 'qJXPML3QGhCJ3NLe2sEw', name: 'Andrew' },
                                        { id: '2EVscXwJhGYuLiX1PgKA', name: 'David' },
                                        { id: 'Ix8C14HEHgIQkJswik2o', name: 'Peter' },
                                        { id: 'j66dKaoQRV6l59TsWZKv', name: 'Saeed' }
                                    ] as const).map((voice) => (
                                        <div
                                            key={voice.id}
                                            className="flex items-center justify-between cursor-pointer group py-1.5 px-3 rounded transition-all"
                                            style={{
                                                backgroundColor: ttsVoiceGender === voice.id ? theme.hover : 'transparent'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (ttsVoiceGender !== voice.id) {
                                                    e.currentTarget.style.backgroundColor = theme.hover;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (ttsVoiceGender !== voice.id) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }
                                            }}
                                            onClick={() => setTtsVoiceGender(voice.id)}
                                        >
                                            <span className="text-[15px]" style={{ color: theme.text }}>
                                                {voice.name}
                                            </span>
                                            <div
                                                className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                                                style={{
                                                    borderColor: ttsVoiceGender === voice.id ? theme.active : `${theme.text}44`,
                                                    backgroundColor: ttsVoiceGender === voice.id ? theme.active : 'transparent'
                                                }}
                                            >
                                                {ttsVoiceGender === voice.id && (
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.text }} />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Female Category */}
                        <div className="space-y-1">
                            <div
                                className="flex items-center justify-between cursor-pointer py-2 px-3 rounded-lg transition-all"
                                style={{
                                    backgroundColor: expandedCategory === 'female' ? theme.active : theme.hover
                                }}
                                onMouseEnter={(e) => {
                                    if (expandedCategory !== 'female') {
                                        e.currentTarget.style.backgroundColor = theme.active;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (expandedCategory !== 'female') {
                                        e.currentTarget.style.backgroundColor = theme.hover;
                                    }
                                }}
                                onClick={() => setExpandedCategory(expandedCategory === 'female' ? null : 'female')}
                            >
                                <span className="text-[16px] font-semibold" style={{ color: theme.text }}>
                                    {t.controls.female}
                                </span>
                                <svg
                                    className={`w-5 h-5 transition-transform ${expandedCategory === 'female' ? 'rotate-180' : ''}`}
                                    style={{ color: theme.text }}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {expandedCategory === 'female' && (
                                <div className="space-y-1 pl-2 pt-1">
                                    {([
                                        { id: 'LcfcDJNUP1GQjkzn1xUU', name: 'Anika' },
                                        { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Karla' },
                                        { id: 'ThT5KcBeYPX3keUQqHPh', name: 'Sharon' }
                                    ] as const).map((voice) => (
                                        <div
                                            key={voice.id}
                                            className="flex items-center justify-between cursor-pointer group py-1.5 px-3 rounded transition-all"
                                            style={{
                                                backgroundColor: ttsVoiceGender === voice.id ? theme.hover : 'transparent'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (ttsVoiceGender !== voice.id) {
                                                    e.currentTarget.style.backgroundColor = theme.hover;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (ttsVoiceGender !== voice.id) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }
                                            }}
                                            onClick={() => setTtsVoiceGender(voice.id)}
                                        >
                                            <span className="text-[15px]" style={{ color: theme.text }}>
                                                {voice.name}
                                            </span>
                                            <div
                                                className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                                                style={{
                                                    borderColor: ttsVoiceGender === voice.id ? theme.active : `${theme.text}44`,
                                                    backgroundColor: ttsVoiceGender === voice.id ? theme.active : 'transparent'
                                                }}
                                            >
                                                {ttsVoiceGender === voice.id && (
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.text }} />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="border-t opacity-20 my-2" style={{ borderColor: theme.text }} />

                    {/* Reading Speed */}
                    <div className="px-4 space-y-3 pb-2">
                        <span className="text-[16px] font-bold block" style={{ color: theme.text }}>{t.controls.readingSpeed}:</span>

                        <div className="flex items-center justify-between bg-black/10 rounded-lg p-1">
                            <button
                                onClick={() => setTtsReadingSpeed(Math.max(0.5, ttsReadingSpeed - 0.1))}
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:bg-black/20"
                                style={{ color: theme.text }}
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                            </button>

                            <span className="text-[16px] font-bold" style={{ color: theme.text }}>
                                {ttsReadingSpeed.toFixed(1)}
                            </span>

                            <button
                                onClick={() => setTtsReadingSpeed(Math.min(2.0, ttsReadingSpeed + 0.1))}
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:bg-black/20"
                                style={{ color: theme.text }}
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="border-t opacity-20 my-2" style={{ borderColor: theme.text }} />

                    {/* Read whole page of content */}
                    <div
                        className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
                        style={{ backgroundColor: theme.hover }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                        onClick={handleToggleReadWholePage}
                    >
                        <span className="text-[16px]" style={{ color: theme.text }}>{t.controls.readPageContent}</span>
                        <div
                            className="w-[28px] h-[28px] rounded flex items-center justify-center transition-all ml-3"
                            style={{
                                backgroundColor: ttsReadWholePage ? theme.active : 'rgba(255, 255, 255, 0.9)',
                                border: ttsReadWholePage ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        >
                            {ttsReadWholePage && (
                                <svg className="w-5 h-5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Play Automatically (Click to Speak) */}
                    <div
                        className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
                        style={{ backgroundColor: theme.hover }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                        onClick={toggleTtsAutoPlay}
                    >
                        <span className="text-[16px]" style={{ color: theme.text }}>{t.controls.autoPlay}</span>
                        <div
                            className="w-[28px] h-[28px] rounded flex items-center justify-center transition-all ml-3"
                            style={{
                                backgroundColor: ttsAutoPlay ? theme.active : 'rgba(255, 255, 255, 0.9)',
                                border: ttsAutoPlay ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        >
                            {ttsAutoPlay && (
                                <svg className="w-5 h-5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Movable Player Controls */}
                    <div
                        className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
                        style={{ backgroundColor: theme.hover }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                        onClick={toggleTtsMovableControls}
                    >
                        <span className="text-[16px]" style={{ color: theme.text }}>{t.controls.movableControls}</span>
                        <div
                            className="w-[28px] h-[28px] rounded flex items-center justify-center transition-all ml-3"
                            style={{
                                backgroundColor: ttsMovableControls ? theme.active : 'rgba(255, 255, 255, 0.9)',
                                border: ttsMovableControls ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        >
                            {ttsMovableControls && (
                                <svg className="w-5 h-5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
