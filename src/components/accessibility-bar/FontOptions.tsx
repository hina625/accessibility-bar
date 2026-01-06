'use client';

import { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import FontFeaturesInfo from './FontFeaturesInfo';
import infoIcon from '@/assets/icons/info.png?inline';


export default function FontOptions() {
    const {
        lineHeight, setLineHeight,
        characterSpacing, setCharacterSpacing,
        wordSpacing, setWordSpacing,
        fontStyle, setFontStyle,
        language, barTheme
    } = useAccessibility();

    const [showInfo, setShowInfo] = useState(false);

    const t = translations[language] || translations['en'];
    const currentTheme = BAR_THEMES[barTheme];

    const allFonts = [
        { name: t.controls.default, value: 'default' },
        { name: 'Arial', value: 'sans' },
        { name: 'Verdana', value: 'verdana' }, // Note: verdana needs CSS rule if not added yet, wait, I added tahoma/trebuchet/etc.
        { name: 'Times New Roman', value: 'serif' },
        { name: 'Georgia', value: 'readable' },
        { name: 'Tahoma', value: 'tahoma' },
        { name: 'Trebuchet MS', value: 'trebuchet' },
        { name: 'Monospace', value: 'mono' },
    ];

    const dyslexiaFonts = [
        { name: 'Lexend', value: 'lexend' },
        { name: 'Open Dyslexic', value: 'dyslexic' },
        { name: 'Comic Sans MS', value: 'comic-sans' },
        { name: 'Andika', value: 'andika' },
        { name: 'APHont', value: 'aphont' },
    ];

    const handleLineHeight = (delta: number) => {
        setLineHeight(Math.max(0.5, Math.min(2.5, lineHeight + delta)));
    };

    const handleCharacterSpacing = (delta: number) => {
        setCharacterSpacing(Math.max(0, Math.min(1, characterSpacing + delta)));
    };

    const handleWordSpacing = (delta: number) => {
        setWordSpacing(Math.max(0, Math.min(1, wordSpacing + delta)));
    };

    const currentFontName = [...allFonts, ...dyslexiaFonts].find(f => f.value === fontStyle)?.name || t.controls.default;

    return (
        <div className="flex flex-col w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6 gap-6 relative border-r-[6px] border-[#e11d48]">
            {showInfo && <FontFeaturesInfo onClose={() => setShowInfo(false)} />}

            <div className="flex items-center justify-between mb-2">
                <h2 className="text-[18px] font-normal text-black dark:text-white">Font Options</h2>
                <button
                    onClick={() => setShowInfo(true)}
                    className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    title="Font Features Info"
                >
                    <img
                        src={typeof infoIcon === 'string' ? infoIcon : (infoIcon as any).src}
                        alt="Info"
                        className="w-6 h-6"
                        style={{ filter: currentTheme.text === '#FFFFFF' ? 'invert(1)' : 'none' }}
                    />
                </button>
            </div>

            {/* Line Height */}
            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Line Height
                </label>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 px-4 shadow-inner">
                    <button
                        onClick={() => handleLineHeight(-0.1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-gray-700 dark:text-white shadow-sm"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                    </button>

                    <span className="text-[18px] font-normal text-black dark:text-white">
                        {Math.abs(lineHeight - 1) < 0.05 ? 'Default' : `${lineHeight.toFixed(1)}x`}
                    </span>

                    <button
                        onClick={() => handleLineHeight(0.1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-all text-white shadow-md shadow-blue-500/20"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Character Spacing */}
            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Character Spacing
                </label>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 px-4 shadow-inner">
                    <button
                        onClick={() => handleCharacterSpacing(-0.02)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-gray-700 dark:text-white shadow-sm"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                    </button>

                    <span className="text-[18px] font-normal text-black dark:text-white">
                        {Math.abs(characterSpacing) < 0.005 ? 'Default' : `${characterSpacing.toFixed(2)}em`}
                    </span>

                    <button
                        onClick={() => handleCharacterSpacing(0.02)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-all text-white shadow-md shadow-blue-500/20"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Word Spacing */}
            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Word Spacing
                </label>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 px-4 shadow-inner">
                    <button
                        onClick={() => handleWordSpacing(-0.05)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-gray-700 dark:text-white shadow-sm"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                    </button>

                    <span className="text-[18px] font-normal text-black dark:text-white">
                        {Math.abs(wordSpacing) < 0.005 ? 'Default' : `${wordSpacing.toFixed(2)}em`}
                    </span>

                    <button
                        onClick={() => handleWordSpacing(0.05)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-all text-white shadow-md shadow-blue-500/20"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* All Fonts Dropdown */}
            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    {t.controls.allFonts}
                </label>
                <select
                    value={allFonts.some(f => f.value === fontStyle) ? fontStyle : ''}
                    onChange={(e) => setFontStyle(e.target.value as any)}
                    className="w-full bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl p-3 px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                >
                    <option value="" disabled>{t.controls.allFonts}</option>
                    {allFonts.map((f) => (
                        <option key={f.value} value={f.value}>{f.name}</option>
                    ))}
                </select>
            </div>

            {/* Dyslexia Friendly Fonts Dropdown */}
            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    {t.controls.dyslexiaFonts}
                </label>
                <select
                    value={dyslexiaFonts.some(f => f.value === fontStyle) ? fontStyle : ''}
                    onChange={(e) => setFontStyle(e.target.value as any)}
                    className="w-full bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl p-3 px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                >
                    <option value="" disabled>{t.controls.dyslexiaFonts}</option>
                    {dyslexiaFonts.map((f) => (
                        <option key={f.value} value={f.value}>{f.name}</option>
                    ))}
                </select>
            </div>

            <p className="text-[14px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-2 px-3 rounded-lg border border-blue-100 dark:border-blue-800/50">
                {t.controls.currentSelection}: <span className="font-bold">{currentFontName}</span>
            </p>
        </div>
    );
}
