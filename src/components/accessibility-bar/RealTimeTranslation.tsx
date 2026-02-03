'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { translations } from '@/contexts/accessibility/translations';
import { API_ENDPOINTS } from '@/config/api';
import { SUPPORTED_LANGUAGES } from '@/config/languages';
import ToggleCheckbox from './ToggleCheckbox';


export default function RealTimeTranslation() {
    const { barTheme, realTimeTranslation, toggleRealTimeTranslation, language, selectionLanguage, setSelectionLanguage } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
    const t = translations[language] || translations.en;
    // const [targetLanguage, setTargetLanguage] = useState(language || 'es'); // Removed local state preference
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        const handleScroll = (e: Event) => {
            if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
                return;
            }
            setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleEsc);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom,
                left: rect.left,
                width: rect.width
            });
        }
    }, [isOpen]);

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
                    targetLanguage: SUPPORTED_LANGUAGES.find(l => l.code === selectionLanguage)?.name || 'Spanish'
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
    }, [inputText, selectionLanguage]);

    return (
        <div className="space-y-4">
            <ToggleCheckbox
                id="enable-translation-toggle"
                label={t.controls.translateSelection || "Translate Selection"}
                description={t.controls.translateSelectionDesc || "Translate selections on the page"}
                checked={realTimeTranslation}
                onChange={toggleRealTimeTranslation}
            />

            <p className="text-[14px] px-4" style={{ color: theme.text, opacity: 0.7 }}>
                {t.controls.translateSelectionDesc}
            </p>

            {realTimeTranslation && (
                <>
                    {/* Language Selection */}
                    <div>
                        <label className="text-[14px] font-medium mb-1 block" style={{ color: theme.text, opacity: 0.6 }}>
                            {t.controls.translateInputLabel || "Translation Language"}
                        </label>
                        <div className="relative group">
                            <button
                                ref={buttonRef}
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-full px-3 py-3 rounded-lg border-[3px] text-[16px] font-semibold focus:outline-none transition-all flex items-center justify-between gap-2"
                                style={{
                                    backgroundColor: theme.hover,
                                    borderColor: theme.border,
                                    color: theme.text
                                }}
                                aria-label="Select translation language"
                                aria-expanded={isOpen}
                            >
                                <span className="flex-1 text-left">{SUPPORTED_LANGUAGES.find(l => l.code === selectionLanguage)?.name || 'Select Language'}</span>
                                <svg
                                    className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                    style={{ color: theme.text }}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isOpen && mounted && createPortal(
                                <>
                                    <div
                                        className="fixed inset-0 z-[2147483659] pointer-events-auto cursor-default"
                                        onClick={() => setIsOpen(false)}
                                    />
                                    <div
                                        ref={dropdownRef}
                                        className="fixed z-[2147483660] mt-1 max-h-60 overflow-y-auto rounded-none shadow-2xl pointer-events-auto custom-scrollbar-hide"
                                        style={{
                                            top: coords.top,
                                            left: coords.left,
                                            width: coords.width,
                                            backgroundColor: theme.background,
                                            border: `1px solid ${theme.border}`,
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none'
                                        }}
                                    >
                                        <div className="py-1">
                                            {SUPPORTED_LANGUAGES.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => {
                                                        setSelectionLanguage(lang.code);
                                                        setIsOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-[16px] font-semibold focus:outline-none"
                                                    style={{
                                                        backgroundColor: selectionLanguage === lang.code ? theme.active : 'transparent',
                                                        color: theme.text
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectionLanguage === lang.code ? theme.active : 'transparent'}
                                                >
                                                    <img
                                                        src={`https://flagcdn.com/w40/${lang.countryCode || 'un'}.png`}
                                                        srcSet={`https://flagcdn.com/w80/${lang.countryCode || 'un'}.png 2x`}
                                                        width="24"
                                                        height="18"
                                                        alt=""
                                                        className="rounded-sm object-cover"
                                                        style={{ width: '24px', height: '18px' }}
                                                    />
                                                    <div className="flex-1 text-left">
                                                        <div className="text-[16px] font-semibold">{lang.name}</div>
                                                        <div className="text-[14px] font-semibold opacity-70">{lang.nativeName}</div>
                                                    </div>
                                                    {selectionLanguage === lang.code && (
                                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>,
                                document.querySelector('.a11y-embed-host')?.shadowRoot?.getElementById('a11y-react-root') ||
                                document.getElementById('a11y-react-root') ||
                                document.body
                            )}
                        </div>
                    </div>

                    {/* Text Input */}
                    <div>
                        <label className="text-[14px] font-medium mb-1 block" style={{ color: theme.text, opacity: 0.6 }}>
                            {t.controls.translateTextLabel || "Text to Translate"}
                        </label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={t.controls.translatePlaceholder || "Type or paste text here..."}
                            className="w-full p-3 rounded-lg border text-[16px] resize-none focus:outline-none transition-all"
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
                                {t.controls.translating || "Translating..."}
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                                {t.controls.translateTo || "Translate to"} {SUPPORTED_LANGUAGES.find(l => l.code === selectionLanguage)?.name}
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
                                <span className="text-[14px] font-bold" style={{ color: theme.active }}>
                                    {SUPPORTED_LANGUAGES.find(l => l.code === selectionLanguage)?.name}
                                </span>
                            </div>
                            <p className="text-[16px] leading-relaxed" style={{ color: theme.text }}>
                                {translatedText}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
