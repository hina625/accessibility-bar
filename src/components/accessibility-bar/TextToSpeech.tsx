'use client';

import { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import { speak } from '@/utils/speechUtils';
import { translations } from '@/contexts/accessibility/translations';

export default function TextToSpeech() {
    const {
        textToSpeech, toggleTextToSpeech,
        ttsAutoPlay, toggleTtsAutoPlay,
        ttsReadWholePage, toggleTtsReadWholePage,
        ttsMovableControls, toggleTtsMovableControls,
        ttsVoiceGender, setTtsVoiceGender,
        ttsReadingSpeed, setTtsReadingSpeed,
        ttsHoverToSpeak, toggleTtsHoverToSpeak,
        barTheme,
        language
    } = useAccessibility();
    const theme = BAR_THEMES[barTheme];
    const t = translations[language] || translations['en'];

    return (
        <div className="space-y-4">
            {/* Main Toggle: Text to Speech (On/Off) */}
            <div
                className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
                style={{ backgroundColor: theme.hover }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                onClick={toggleTextToSpeech}
            >
                <div className="flex flex-col">
                    <span className="text-[15px] font-medium" style={{ color: theme.text }}>{t.controls.tts} (On/Off)</span>
                </div>
                <div
                    className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
                    style={{
                        backgroundColor: textToSpeech ? theme.active : 'rgba(255, 255, 255, 0.9)',
                        border: textToSpeech ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                >
                    {textToSpeech && (
                        <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>

            {textToSpeech && (
                <>
                    {/* Play Automatically */}
                    <div
                        className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
                        style={{ backgroundColor: theme.hover }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                        onClick={toggleTtsAutoPlay}
                    >
                        <span className="text-[14px]" style={{ color: theme.text }}>{t.controls.autoPlay}</span>
                        <div
                            className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
                            style={{
                                backgroundColor: ttsAutoPlay ? theme.active : 'rgba(255, 255, 255, 0.9)',
                                border: ttsAutoPlay ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        >
                            {ttsAutoPlay && (
                                <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Read whole page of content */}
                    <div
                        className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
                        style={{ backgroundColor: theme.hover }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                        onClick={toggleTtsReadWholePage}
                    >
                        <span className="text-[14px]" style={{ color: theme.text }}>{t.controls.readPageContent}</span>
                        <div
                            className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
                            style={{
                                backgroundColor: ttsReadWholePage ? theme.active : 'rgba(255, 255, 255, 0.9)',
                                border: ttsReadWholePage ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        >
                            {ttsReadWholePage && (
                                <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Hover to Speak */}
                    <div
                        className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
                        style={{ backgroundColor: theme.hover }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                        onClick={toggleTtsHoverToSpeak}
                    >
                        <div className="flex flex-col">
                            <span className="text-[14px] font-medium" style={{ color: theme.text }}>{t.controls.hoverToSpeak}</span>
                            <span className="text-[11px]" style={{ color: theme.text, opacity: 0.7 }}>{t.controls.hoverToSpeakDesc}</span>
                        </div>
                        <div
                            className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
                            style={{
                                backgroundColor: ttsHoverToSpeak ? theme.active : 'rgba(255, 255, 255, 0.9)',
                                border: ttsHoverToSpeak ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        >
                            {ttsHoverToSpeak && (
                                <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
                        <span className="text-[14px]" style={{ color: theme.text }}>{t.controls.movableControls}</span>
                        <div
                            className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
                            style={{
                                backgroundColor: ttsMovableControls ? theme.active : 'rgba(255, 255, 255, 0.9)',
                                border: ttsMovableControls ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        >
                            {ttsMovableControls && (
                                <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>

                    <div className="border-t opacity-20 my-2" style={{ borderColor: theme.text }} />

                    {/* Voice Gender Selection */}
                    <div className="px-4 space-y-3">
                        <span className="text-[15px] font-bold block" style={{ color: theme.text }}>{t.controls.voice}</span>

                        <div className="space-y-2">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => setTtsVoiceGender('male')}
                            >
                                <span className="text-[14px]" style={{ color: theme.text }}>{t.controls.male}</span>
                                <div
                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                                    style={{
                                        borderColor: ttsVoiceGender === 'male' ? theme.active : `${theme.text}44`,
                                        backgroundColor: ttsVoiceGender === 'male' ? theme.active : 'transparent'
                                    }}
                                >
                                    {ttsVoiceGender === 'male' && (
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.text }} />
                                    )}
                                </div>
                            </div>

                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => setTtsVoiceGender('female')}
                            >
                                <span className="text-[14px]" style={{ color: theme.text }}>{t.controls.female}</span>
                                <div
                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                                    style={{
                                        borderColor: ttsVoiceGender === 'female' ? theme.active : `${theme.text}44`,
                                        backgroundColor: ttsVoiceGender === 'female' ? theme.active : 'transparent'
                                    }}
                                >
                                    {ttsVoiceGender === 'female' && (
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.text }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t opacity-20 my-2" style={{ borderColor: theme.text }} />

                    {/* Reading Speed */}
                    <div className="px-4 space-y-3 pb-2">
                        <span className="text-[15px] font-bold block" style={{ color: theme.text }}>{t.controls.readingSpeed}:</span>

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

                            <span className="text-[18px] font-bold" style={{ color: theme.text }}>
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
                </>
            )}
        </div>
    );
}
