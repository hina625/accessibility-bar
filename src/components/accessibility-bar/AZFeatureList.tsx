'use client';

import React, { useMemo, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { playAudioPing } from '@/utils/audioPingUtils';

interface FeatureItem {
    label: string;
    action?: () => void;
    category?: string;
    isActive?: boolean;
}

interface AZFeatureListProps {
    onNavigate: (category: string) => void;
    onCloseBar: () => void;
    onOpenFeedback: () => void;
    onOpenPosition: () => void;
}

const AZFeatureList: React.FC<AZFeatureListProps> = ({
    onNavigate,
    onCloseBar,
    onOpenFeedback,
    onOpenPosition
}) => {
    const context = useAccessibility();
    const {
        barTheme,
        togglePauseAnimations,
        toggleHighContrast,
        toggleGrayscale,
        toggleInvertColors,
        toggleDarkMode,
        toggleOnPageDictionary,
        toggleShowActiveIndicators,
        increaseFontSize,
        decreaseFontSize,
        setFontStyle,
        toggleHighlightHeadings,
        toggleHideImages,
        toggleHighlightLinks,
        toggleShowImageDescriptions,
        toggleLargeButtons,
        toggleMagnifier,
        toggleSimplifiedLayout,
        togglePageSummary,
        togglePageStructure,
        togglePlainTextMode,
        togglePronunciationGuide,
        toggleReadingGuide,
        toggleReadingMask,
        toggleReadingSpotlight,
        resetAll,
        toggleReadingRuler,
        toggleSmartSuggestions,
        toggleReadingProgressBar,
        toggleTextToSpeech,
        toggleStopVideos,
        toggleSpeechToText,
        // State for indicators
        pauseAnimations,
        highContrast,
        grayscale,
        invertColors,
        darkMode,
        onPageDictionary,
        showActiveIndicators,
        fontSize,
        fontStyle,
        highlightHeadings,
        hideImages,
        highlightLinks,
        showImageDescriptions,
        largeButtons,
        magnifier,
        simplifiedLayout,
        pageSummary,
        pageStructure,
        plainTextMode,
        pronunciationGuide,
        readingGuide,
        readingMask,
        readingSpotlight,
        readingRuler,
        smartSuggestions,
        readingProgressBar,
        textToSpeech,
        stopVideos,
        speechToText,
        audioPingEnabled,
    } = context;

    const currentTheme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
    const [searchQuery, setSearchQuery] = useState('');

    const features: FeatureItem[] = useMemo(() => [
        { label: 'Accessibility Button (Website Position)', category: 'position' },
        { label: 'Alignment (Text- Left, Right, Centre, Justify)', category: 'textSpacing' },
        { label: 'Animations (Pause or Stop)', action: togglePauseAnimations, isActive: pauseAnimations },
        { label: 'Background Page Colours (Dark or Light Options)', category: 'contrast' },
        { label: 'Colour Blind Tools/Options', category: 'contrast' },
        { label: 'Colour Theme (for Sidebar)', category: 'position' },
        { label: 'Contrast Controls (Menu Icon)', action: toggleHighContrast, isActive: highContrast },
        { label: 'Cursor Colours', category: 'cursor' },
        { label: 'Cursor Options (Menu Icon)', category: 'cursor' },
        { label: 'Cursor (Reduce Motion)', category: 'cursor' },
        { label: 'Cursor Size', category: 'cursor' },
        { label: 'Cursor Type/Shape', category: 'cursor' },
        { label: 'Dark Mode', action: toggleDarkMode, isActive: darkMode },
        { label: 'Dictionary', action: toggleOnPageDictionary, isActive: onPageDictionary },
        { label: 'Dyslexia Friendly Fonts', category: 'font' },
        { label: 'Feature Indicators (Red Line Markers)', action: toggleShowActiveIndicators, isActive: showActiveIndicators },
        { label: 'Feedback Options (Menu Icon)', action: onOpenFeedback },
        { label: 'Font Size', category: 'font', isActive: fontSize !== 16 },
        { label: 'Font Increase', action: increaseFontSize },
        { label: 'Font Decrease', action: decreaseFontSize },
        { label: 'Font Styles', category: 'font', isActive: fontStyle !== 'default' },
        { label: 'Font Tools (Menu Icon)', category: 'font' },
        { label: 'Grey Scale', action: toggleGrayscale, isActive: grayscale },
        { label: 'Help Options', action: () => onNavigate('info') },
        { label: 'Highlight Headings', action: toggleHighlightHeadings, isActive: highlightHeadings },
        { label: 'High Contrast', action: toggleHighContrast, isActive: highContrast },
        { label: 'Hide Images', action: toggleHideImages, isActive: hideImages },
        { label: 'Highlight Links', action: toggleHighlightLinks, isActive: highlightLinks },
        { label: 'Images and Animation (Menu Icon)', category: 'images' },
        { label: 'Image Descriptions', action: toggleShowImageDescriptions, isActive: showImageDescriptions },
        { label: 'Information (Icon)', action: () => onNavigate('info') },
        { label: 'Invert Colours', action: toggleInvertColors, isActive: invertColors },
        { label: 'Keyboard Shortcuts (Menu Icon)', category: 'navigation' },
        { label: 'Large buttons', action: toggleLargeButtons, isActive: largeButtons },
        { label: 'Language Selection', category: 'language' },
        { label: 'Letter Spacing (Tracking)', category: 'letterSpacing' },
        { label: 'Line Height', category: 'lineHeight' },
        { label: 'Magnifier', action: toggleMagnifier, isActive: magnifier },
        { label: 'Menu Icon Colours (Customise)', category: 'position' },
        { label: 'More Help', action: () => onNavigate('info') },
        { label: 'Open Dyslexic Font', action: () => setFontStyle('dyslexic'), isActive: fontStyle === 'dyslexic' },
        { label: 'Page Layout (Menu Icon)', category: 'layout' },
        { label: 'Page Simplify', action: toggleSimplifiedLayout, isActive: simplifiedLayout },
        { label: 'Page Summary', action: togglePageSummary, isActive: pageSummary },
        { label: 'Page Structure', action: togglePageStructure, isActive: pageStructure },
        { label: 'Page Background Colour', category: 'contrast' },
        { label: 'Panel Position (Sidebar)', category: 'position' },
        { label: 'Plain Text View', action: togglePlainTextMode, isActive: plainTextMode },
        { label: 'Pointer Size (Cursor)', category: 'cursor' },
        { label: 'Pronunciation Guide', action: togglePronunciationGuide, isActive: pronunciationGuide },
        { label: 'Reading Lines', action: toggleReadingGuide, isActive: readingGuide },
        { label: 'Reading Mask', action: toggleReadingMask, isActive: readingMask },
        { label: 'Reading Spotlight', action: toggleReadingSpotlight, isActive: readingSpotlight },
        { label: 'Reading Tools (Menu Icon)', category: 'reading' },
        { label: 'Reset Button (Menu Icon)', action: resetAll },
        { label: 'Ruler', action: toggleReadingRuler, isActive: readingRuler },
        { label: 'Smart Suggestions', action: toggleSmartSuggestions, isActive: smartSuggestions },
        { label: 'Subtitles (for Videos)', category: 'images' },
        { label: 'Scrolling Progress Bar', action: toggleReadingProgressBar, isActive: readingProgressBar },
        { label: 'Translation', category: 'language' },
        { label: 'Translate Website', category: 'language' },
        { label: 'Text Alignment', category: 'textSpacing' },
        { label: 'Text to Speech (TTS)', action: toggleTextToSpeech, isActive: textToSpeech },
        { label: 'Video Controls (Pause or Stop)', action: toggleStopVideos, isActive: stopVideos },
        { label: 'Voice Control', action: toggleSpeechToText, isActive: speechToText },
        { label: 'Word Spacing (Kerning)', category: 'letterSpacing' },
        { label: 'Zoom In/ Zoom Out', category: 'quick_zoom' },
    ], [
        togglePauseAnimations, pauseAnimations,
        toggleHighContrast, highContrast,
        toggleGrayscale, grayscale,
        toggleInvertColors, invertColors,
        toggleDarkMode, darkMode,
        toggleOnPageDictionary, onPageDictionary,
        toggleShowActiveIndicators, showActiveIndicators,
        increaseFontSize, fontSize,
        decreaseFontSize,
        setFontStyle, fontStyle,
        toggleHighlightHeadings, highlightHeadings,
        toggleHideImages, hideImages,
        toggleHighlightLinks, highlightLinks,
        toggleShowImageDescriptions, showImageDescriptions,
        toggleLargeButtons, largeButtons,
        toggleMagnifier, magnifier,
        toggleSimplifiedLayout, simplifiedLayout,
        togglePageSummary, pageSummary,
        togglePageStructure, pageStructure,
        togglePlainTextMode, plainTextMode,
        togglePronunciationGuide, pronunciationGuide,
        toggleReadingGuide, readingGuide,
        toggleReadingMask, readingMask,
        toggleReadingSpotlight, readingSpotlight,
        resetAll,
        toggleReadingRuler, readingRuler,
        toggleSmartSuggestions, smartSuggestions,
        toggleReadingProgressBar, readingProgressBar,
        toggleTextToSpeech, textToSpeech,
        toggleStopVideos, stopVideos,
        toggleSpeechToText, speechToText,
        onNavigate, onOpenFeedback
    ]);

    const filteredFeatures = useMemo(() => {
        return features
            .filter(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [features, searchQuery]);

    const groupedFeatures = useMemo(() => {
        const groups: Record<string, FeatureItem[]> = {};
        filteredFeatures.forEach(feature => {
            const letter = feature.label[0].toUpperCase();
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(feature);
        });
        return groups;
    }, [filteredFeatures]);

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search features A-Z"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-5 py-4 pl-12 rounded-2xl text-[15px] font-medium transition-all duration-300 border-4 focus:outline-none"
                        style={{
                            backgroundColor: `${currentTheme.background}80`,
                            color: currentTheme.text,
                            borderColor: `${currentTheme.text}20`,
                            backdropFilter: 'blur(10px)',
                        }}
                    />
                    <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50 group-focus-within:opacity-100 transition-opacity"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: currentTheme.text }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchQuery && (
                        <button
                            onClick={() => {
                                if (audioPingEnabled) playAudioPing();
                                setSearchQuery('');
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" style={{ color: currentTheme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Alphabet Navigation */}
            <div className="mb-6 flex flex-col gap-2">
                {/* Row 1: A-I */}
                <div className="flex justify-between px-1">
                    {"ABCDEFGHI".split('').map(letter => (
                        <button
                            key={letter}
                            onClick={() => {
                                if (audioPingEnabled) playAudioPing();
                                const element = document.getElementById(`section-${letter}`);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-[14px] font-bold hover:bg-white/10 transition-all"
                            style={{
                                color: currentTheme.text,
                                cursor: groupedFeatures[letter] ? 'pointer' : 'default',
                                opacity: 1
                            }}
                            disabled={!groupedFeatures[letter]}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
                {/* Row 2: J-R */}
                <div className="flex justify-between px-1">
                    {"JKLMNOPQR".split('').map(letter => (
                        <button
                            key={letter}
                            onClick={() => {
                                if (audioPingEnabled) playAudioPing();
                                const element = document.getElementById(`section-${letter}`);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-[14px] font-bold hover:bg-white/10 transition-all"
                            style={{
                                color: currentTheme.text,
                                cursor: groupedFeatures[letter] ? 'pointer' : 'default',
                                opacity: 1
                            }}
                            disabled={!groupedFeatures[letter]}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
                {/* Row 3: S-Z */}
                <div className="flex justify-between px-1">
                    {"STUVWXYZ".split('').map(letter => (
                        <button
                            key={letter}
                            onClick={() => {
                                if (audioPingEnabled) playAudioPing();
                                const element = document.getElementById(`section-${letter}`);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-[14px] font-bold hover:bg-white/10 transition-all"
                            style={{
                                color: currentTheme.text,
                                cursor: groupedFeatures[letter] ? 'pointer' : 'default',
                                opacity: 1
                            }}
                            disabled={!groupedFeatures[letter]}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feature Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 pb-8 scroll-smooth">
                {Object.keys(groupedFeatures).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white/5 border-4 border-white/10">
                            <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-[16px] font-semibold text-white/40">No features found for "{searchQuery}"</p>
                    </div>
                ) : (
                    Object.entries(groupedFeatures).map(([letter, items]) => (
                        <div key={letter} id={`section-${letter}`} className="space-y-4 scroll-mt-24">
                            <div className="flex items-center gap-4">
                                <span className="text-[28px] font-black px-5 py-2 rounded-2xl border-2 shadow-lg" style={{ backgroundColor: currentTheme.active, borderColor: 'rgba(255,255,255,0.3)', color: currentTheme.text }}>
                                    {letter}
                                </span>
                                <div className="h-[2px] flex-1 bg-white/20 rounded-full" />
                            </div>

                            <div className="flex flex-col gap-2">
                                {items.map((item, idx) => {
                                    const match = item.label.match(/^([^(]+)(\(.*\))$/);
                                    const name = match ? match[1].trim() : item.label;
                                    const properties = match ? match[2].trim() : '';

                                    return (
                                        <button
                                            key={`${letter}-${idx}`}
                                            onClick={() => {
                                                if (audioPingEnabled) playAudioPing();
                                                if (item.action) {
                                                    item.action();
                                                } else if (item.category) {
                                                    onNavigate(item.category);
                                                }
                                            }}
                                            className="relative group flex items-center justify-between p-4 px-1 rounded-xl transition-all duration-300 text-left"
                                            style={{
                                                backgroundColor: 'transparent',
                                            }}
                                        >
                                            <div className="flex flex-col w-full gap-1">
                                                {/* Top Section: Name */}
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300"
                                                        style={{ backgroundColor: item.isActive ? currentTheme.active : `${currentTheme.text}40` }}
                                                    />
                                                    <span
                                                        className="text-[15px] font-black leading-tight transition-all duration-300 uppercase tracking-tight underline decoration-2 decoration-white/50 underline-offset-[6px] group-hover:decoration-white/80"
                                                        style={{ color: currentTheme.text }}
                                                    >
                                                        {name}
                                                    </span>
                                                </div>

                                                {/* Second Line: Properties */}
                                                {properties && (
                                                    <div className="pl-5">
                                                        <span
                                                            className="text-[14px] font-bold transition-colors"
                                                            style={{ color: currentTheme.text, opacity: 1 }}
                                                        >
                                                            {properties}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Status Indicator Glow */}
                                            {item.isActive && (
                                                <div
                                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 rounded-r-full"
                                                    style={{ backgroundColor: currentTheme.active, boxShadow: `0 0 10px ${currentTheme.active}` }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${currentTheme.active}cc;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${currentTheme.active};
                }
            `}</style>
        </div>
    );
};

export default AZFeatureList;
