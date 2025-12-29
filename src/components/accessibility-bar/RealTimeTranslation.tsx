'use client';

import { useState, useCallback } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import { API_ENDPOINTS } from '@/config/api';

const LANGUAGES = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ar', name: 'Arabic' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ur', name: 'Urdu' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'it', name: 'Italian' },
];

export default function RealTimeTranslation() {
    const { barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme];
    const [isEnabled, setIsEnabled] = useState(false);
    const [targetLanguage, setTargetLanguage] = useState('es');
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);

    const translateText = useCallback(async () => {
        if (!inputText.trim()) return;

        setIsTranslating(true);
        setTranslatedText('');

        try {
            const response = await fetch(API_ENDPOINTS.TRANSLATE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: inputText.trim(),
                    targetLanguage: LANGUAGES.find(l => l.code === targetLanguage)?.name || 'Spanish'
                })
            });

            if (!response.ok) throw new Error('Translation failed');

            const data = await response.json();
            setTranslatedText(data.translatedText);
        } catch (error) {
            console.error('Translation error:', error);
            setTranslatedText('Translation failed. Please try again.');
        } finally {
            setIsTranslating(false);
        }
    }, [inputText, targetLanguage]);

    return (
        <div className="space-y-4">
            <h3 className="text-[18px] font-bold" style={{ color: theme.text }}>Translation</h3>

            {/* Enable Toggle */}
            <div
                className="flex items-center justify-between py-2 cursor-pointer rounded-lg px-2 -mx-2 transition-colors"
                style={{ backgroundColor: isEnabled ? theme.hover : 'transparent' }}
                onClick={() => setIsEnabled(!isEnabled)}
            >
                <span className="text-[16px]" style={{ color: theme.text }}>Enable Translation</span>
                <div
                    className="w-5 h-5 rounded flex items-center justify-center transition-all"
                    style={{
                        backgroundColor: isEnabled ? theme.active : 'rgba(255, 255, 255, 0.9)',
                        border: isEnabled ? 'none' : `1px solid ${theme.border}`
                    }}
                >
                    {isEnabled && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>

            {isEnabled && (
                <>
                    {/* Language Selection */}
                    <div>
                        <label className="text-[14px] font-medium mb-1 block" style={{ color: theme.text, opacity: 0.6 }}>Target Language</label>
                        <select
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                            className="w-full p-2 rounded-lg border text-[14px] focus:outline-none transition-all"
                            style={{
                                backgroundColor: theme.hover,
                                borderColor: theme.border,
                                color: theme.text
                            }}
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code} style={{ backgroundColor: theme.background, color: theme.text }}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Text Input */}
                    <div>
                        <label className="text-[14px] font-medium mb-1 block" style={{ color: theme.text, opacity: 0.6 }}>Text to Translate</label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type or paste text here..."
                            className="w-full p-3 rounded-lg border text-[14px] resize-none focus:outline-none transition-all"
                            style={{
                                backgroundColor: theme.hover,
                                borderColor: theme.border,
                                color: theme.text
                            }}
                            rows={3}
                        />
                    </div>

                    {/* Translate Button */}
                    <button
                        onClick={translateText}
                        disabled={isTranslating || !inputText.trim()}
                        className="w-full py-2 px-4 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        style={{
                            backgroundColor: theme.active,
                        }}
                    >
                        {isTranslating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Translating...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                                Translate to {LANGUAGES.find(l => l.code === targetLanguage)?.name}
                            </>
                        )}
                    </button>

                    {/* Translation Result */}
                    {translatedText && (
                        <div className="rounded-lg p-4 border animate-in fade-in" style={{ backgroundColor: theme.hover, borderColor: theme.border }}>
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4" style={{ color: theme.active }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                                <span className="text-[12px] font-bold uppercase" style={{ color: theme.active }}>
                                    {LANGUAGES.find(l => l.code === targetLanguage)?.name}
                                </span>
                            </div>
                            <p className="text-[14px] leading-relaxed" style={{ color: theme.text }}>
                                {translatedText}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
