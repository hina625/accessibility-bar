'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { API_ENDPOINTS } from '@/config/api';
import { translations } from '@/contexts/accessibility/translations';

interface PronunciationData {
    ipa: string;
    syllables: string[];
    simple_pronunciation: string;
    translation?: string;
}

export default function PronunciationGuidePopup() {
    const { pronunciationGuide, language } = useAccessibility();
    const t = translations[language] || translations['en'];

    const [selectedText, setSelectedText] = useState<string>('');
    const [data, setData] = useState<PronunciationData | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!pronunciationGuide) {
            setIsVisible(false);
            setData(null);
            return;
        }

        const handleMouseUp = (e: MouseEvent) => {
            // Don't trigger if clicking inside the tooltip or the accessibility bar
            if (tooltipRef.current?.contains(e.target as Node) ||
                (e.target as HTMLElement).closest('.accessibility-bar')) {
                return;
            }

            // Short delay to let selection settle
            setTimeout(() => {
                const selection = window.getSelection();
                const text = selection?.toString().trim();

                // Allow up to 10 words or 100 characters to support phrases
                if (text && text.length > 0 && text.length < 100 && text.split(/\s+/).length <= 10) {

                    // Get selection coordinates
                    const range = selection!.getRangeAt(0);
                    const rect = range.getBoundingClientRect();

                    // Calculate center of selection
                    const x = rect.left + (rect.width / 2);
                    const y = rect.top + window.scrollY - 10; // 10px above selection

                    setSelectedText(text);
                    setPosition({ x, y });
                    setIsVisible(true);
                    fetchPronunciation(text);
                } else if (!tooltipRef.current?.contains(e.target as Node)) {
                    setIsVisible(false);
                }
            }, 10);
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node) &&
                !(e.target as HTMLElement).closest('.accessibility-bar')) {
                setIsVisible(false);
            }
        };

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousedown', handleMouseDown);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, [pronunciationGuide]);

    const fetchPronunciation = async (text: string) => {
        setIsLoading(true);
        setData(null);
        try {
            const response = await fetch(API_ENDPOINTS.PRONUNCIATION, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, language }) // Pass current UI language for context/translation
            });

            if (response.ok) {
                const result = await response.json();
                setData(result);
            } else {
                const errText = await response.text();
                console.error('Failed to fetch pronunciation. Status:', response.status, 'Error:', errText);
            }
        } catch (error) {
            console.error('Error fetching pronunciation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const playAudio = () => {
        if (!selectedText) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(selectedText);
        // Try to match the voice to the language
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(language));
        if (voice) utterance.voice = voice;

        window.speechSynthesis.speak(utterance);
    };

    const speakPhonetics = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        // Slow down for phonetics
        utterance.rate = 0.7;
        window.speechSynthesis.speak(utterance);
    };

    if (!pronunciationGuide || !isVisible) return null;

    return (
        <div
            ref={tooltipRef}
            className="fixed z-[2147483647] min-w-[280px] max-w-[320px] bg-white dark:bg-gray-900 shadow-2xl rounded-xl border border-blue-100 dark:border-blue-800 overflow-hidden transform -translate-x-1/2 -translate-y-full animate-in fade-in zoom-in-95 duration-200"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
        >
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-start">
                <div>
                    <h3 className="text-[18px] font-bold leading-tight line-clamp-2">{selectedText}</h3>
                    {data?.translation && (
                        <p className="text-indigo-100 text-sm mt-1">{data.translation}</p>
                    )}
                </div>
                <button
                    onClick={playAudio}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors flex-shrink-0 ml-2"
                    aria-label={t.controls.play || "Play"}
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                </button>
            </div>

            <div className="p-4 space-y-4">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 py-2">
                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[14px]">{t.common.loading || 'Loading...'}</span>
                    </div>
                ) : data ? (
                    <>
                        {/* Phonetics Section */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t.controls.phonetics || "Phonetics"} (IPA)
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-mono text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                                    {data.ipa}
                                </span>
                            </div>
                        </div>

                        {/* Syllables Section */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Syllables
                            </label>
                            <div className="flex flex-wrap gap-1">
                                {data.syllables.map((syl, i) => (
                                    <span key={i} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-sm font-medium">
                                        {syl}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Simple Pronunciation (Sounds Like) */}
                        <div className="space-y-1 pt-2 border-t border-gray-100 dark:border-gray-800">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t.controls.soundsLike || "Sounds like"}
                            </label>
                            <div className="flex items-center justify-between">
                                <span className="text-[16px] font-medium text-gray-900 dark:text-white">
                                    {data.simple_pronunciation}
                                </span>
                                <button
                                    onClick={() => speakPhonetics(data.simple_pronunciation)}
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Slow
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-sm text-red-500">Failed to load data.</div>
                )}
            </div>
        </div>
    );
}
