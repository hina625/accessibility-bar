'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { playAudioPing } from '@/utils/audioPingUtils';

interface FeatureItem {
    label: string;
    action?: () => void;
    category?: string;
    highlightId?: string;
    isActive?: boolean;
    sortLabel?: string;
}

interface AZFeatureListProps {
    onNavigate: (category: string, featureId?: string) => void;
    onCloseBar: () => void;
    onOpenFeedback: () => void;
    onOpenPosition: () => void;
    onOpenSettings: () => void;
}

const AZFeatureList: React.FC<AZFeatureListProps> = ({
    onNavigate,
    onCloseBar,
    onOpenFeedback,
    onOpenPosition,
    onOpenSettings
}) => {
    const { showOnBadge, ttsReadingSpeed, setTtsReadingSpeed, ttsVoiceGender, setTtsVoiceGender } = useAccessibility() as any;
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
        toggleShowOnBadge,

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
        toggleAudioPing
    } = context;

    const currentTheme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
    const [searchQuery, setSearchQuery] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);


    const features: FeatureItem[] = useMemo(() => [
        { label: 'Accessibility Button (Website Position)', category: 'position', highlightId: 'position-controls' },
        { label: 'Alignment (Text- Left, Right, Centre, Justify)', category: 'textSpacing', highlightId: 'text-align' },
        { label: 'Animations (Pause or Stop)', category: 'images', highlightId: 'pause-animations', isActive: pauseAnimations },
        { label: 'Audio Ping (Switch On/Off)', action: onOpenSettings, isActive: audioPingEnabled },
        { label: 'Background Page Colours (Dark or Light Options)', category: 'contrast', highlightId: 'page-background' },
        { label: 'Colour Blind Tools/Options', category: 'contrast', highlightId: 'color-blind' },
        { label: 'Colour Theme (for Sidebar)', action: onOpenSettings },
        { label: 'Contrast Controls (Menu Icon)', category: 'contrast', highlightId: 'contrast-toggle', isActive: highContrast, sortLabel: 'Contrast Controls 1' },
        { label: 'Contact Us Form', action: () => onNavigate('contact'), sortLabel: 'Contrast Controls 2' },
        { label: 'Cursor Colours', category: 'cursor', highlightId: 'cursor-color' },
        { label: 'Cursor Options (Menu Icon)', category: 'cursor' },
        { label: 'Cursor (Reduce Motion)', category: 'cursor', highlightId: 'reduce-motion' },
        { label: 'Cursor Size', category: 'cursor', highlightId: 'cursor-size' },
        { label: 'Cursor Type/Shape', category: 'cursor', highlightId: 'cursor-style' },
        { label: 'Dark Mode', category: 'contrast', highlightId: 'dark-mode', isActive: darkMode },
        { label: 'Dictionary', category: 'language', highlightId: 'dictionary', isActive: onPageDictionary },
        { label: 'Dyslexia Friendly Fonts', category: 'font', highlightId: 'font-style' },
        { label: 'Feature Indicators (Red Dot Markers)', action: toggleShowActiveIndicators, isActive: showActiveIndicators },
        { label: 'More Options Menu (3 Dots)', action: onOpenFeedback },
        { label: 'Font Size', category: 'font', highlightId: 'font-size', isActive: fontSize !== 16 },
        { label: 'Font Increase', category: 'font', highlightId: 'font-size' },
        { label: 'Font Decrease', category: 'font', highlightId: 'font-size' },
        { label: 'Font Styles', category: 'font', highlightId: 'font-style', isActive: fontStyle !== 'default' },
        { label: 'Font Tools (Menu Icon)', category: 'font' },
        { label: 'Grey Scale', category: 'contrast', highlightId: 'grayscale', isActive: grayscale },
        { label: 'Help Options', action: () => onNavigate('info') },
        { label: 'Highlight Headings', category: 'layout', highlightId: 'highlight-headings', isActive: highlightHeadings },
        { label: 'High Contrast', category: 'contrast', highlightId: 'high-contrast', isActive: highContrast },
        { label: 'Hide Website Images', category: 'images', highlightId: 'hide-images', isActive: hideImages },
        { label: 'Highlight Links', category: 'layout', highlightId: 'highlight-links', isActive: highlightLinks },
        { label: 'Images / Animations (Menu Icon)', category: 'images' },
        { label: 'Image Descriptions', category: 'images', highlightId: 'image-descriptions', isActive: showImageDescriptions },
        { label: 'Features Guide (More Options Menu)', action: () => onNavigate('info') },
        { label: 'Invert Colours', category: 'contrast', highlightId: 'invert-colors', isActive: invertColors },
        { label: 'Keyboard Shortcuts (Menu Icon)', category: 'navigation' },
        { label: 'Large buttons', category: 'reading', highlightId: 'large-buttons', isActive: largeButtons },
        { label: 'Language Selection', category: 'language', highlightId: 'language-selector' },
        { label: 'Letter Spacing (Tracking)', category: 'letterSpacing', highlightId: 'letter-spacing' },
        { label: 'Line Height', category: 'lineHeight', isActive: context.lineHeight !== 1 },
        { label: 'Magnifier', category: 'reading', highlightId: 'magnifier', isActive: magnifier },
        { label: 'Menu Icon Colours (Customise)', action: onOpenSettings },
        { label: 'More Help', action: () => onNavigate('info') },
        { label: 'Open Dyslexic Font', category: 'font', highlightId: 'font-style', isActive: fontStyle === 'dyslexic' },
        { label: 'Page Layout (Menu Icon)', category: 'layout' },
        { label: 'Page Simplify', category: 'layout', highlightId: 'simplify-layout', isActive: simplifiedLayout },
        { label: 'Page Summary', category: 'ai', highlightId: 'page-summary', isActive: pageSummary },
        { label: 'Page Structure', category: 'layout', highlightId: 'page-structure', isActive: pageStructure },
        { label: "On Badge (Apply 'On' Label/ Badge to Menu icons)", action: toggleShowOnBadge, isActive: showOnBadge },
        { label: 'Page Background Colour', category: 'contrast', highlightId: 'page-background' },
        { label: 'Panel Position (Sidebar)', category: 'position', highlightId: 'position-controls' },
        { label: 'Plain Text View', category: 'layout', highlightId: 'plain-text', isActive: plainTextMode },
        { label: 'Pointer Size (Cursor)', category: 'cursor', highlightId: 'cursor-size' },
        { label: 'Pronunciation Guide', category: 'language', highlightId: 'pronunciation-guide', isActive: pronunciationGuide },
        { label: 'Reading Lines', category: 'reading', highlightId: 'reading-guide', isActive: readingGuide },
        { label: 'Reading Mask', category: 'reading', highlightId: 'reading-mask', isActive: readingMask },
        { label: 'Reading Spotlight', category: 'reading', highlightId: 'reading-spotlight', isActive: readingSpotlight },
        { label: 'Reading Tools (Menu Icon)', category: 'reading' },
        { label: 'Reset Button (Menu Icon)', action: resetAll, sortLabel: 'Reset Button 1' },
        { label: 'Reset Button (Change Colour)', action: onOpenSettings, sortLabel: 'Reset Button 2' },
        { label: 'Ruler', category: 'reading', highlightId: 'reading-ruler', isActive: readingRuler },
        { label: 'Smart Suggestions', category: 'language', highlightId: 'smart-suggestions', isActive: smartSuggestions },
        { label: 'Subtitles (for Videos)', category: 'images' },
        { label: 'Scrolling Progress Bar', category: 'reading', highlightId: 'reading-progress', isActive: readingProgressBar },
        { label: 'Translation', category: 'language', highlightId: 'real-time-translation' },
        { label: 'Translate Website', category: 'language', highlightId: 'real-time-translation' },
        { label: 'Text Align', category: 'textSpacing' },
        { label: 'Text to Speech (TTS)', category: 'speech', highlightId: 'text-to-speech', isActive: textToSpeech },
        { label: 'Toolbar Feedback (More Options Menu)', action: onOpenFeedback },
        { label: 'Video Controls (Pause or Stop)', category: 'images', highlightId: 'stop-videos', isActive: stopVideos },
        { label: 'Voice Control', category: 'speech', highlightId: 'voice-navigation', isActive: speechToText },
        { label: 'Word Spacing (Kerning)', category: 'letterSpacing', highlightId: 'word-spacing' },
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
        toggleStopVideos, stopVideos,
        toggleSpeechToText, speechToText,
        onNavigate, onOpenFeedback, onOpenSettings
    ]);

    const filteredFeatures = useMemo(() => {
        return features
            .filter(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => {
                const labelA = a.sortLabel || a.label;
                const labelB = b.sortLabel || b.label;
                return labelA.localeCompare(labelB);
            });
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

    const [currentLetter, setCurrentLetter] = useState('A');

    const scrollToSection = (letter: string) => {
        setCurrentLetter(letter);
        if (scrollContainerRef.current) {
            const element = scrollContainerRef.current.querySelector(`#section-${letter}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <div className="flex flex-col sm:flex-row h-full animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden">

            <div
                className="w-full sm:w-1/2 flex flex-col p-6 border-b sm:border-b-0 sm:border-r"
                style={{
                    borderColor: `${currentTheme.border}4D`,
                    background: `${currentTheme.background}0D`
                }}
            >

                <div className="mb-8">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search features A-Z"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 pl-11 rounded-2xl text-[14px] font-bold transition-all duration-300 border-4 focus:outline-none"
                            style={{
                                backgroundColor: `${currentTheme.text}08`,
                                color: currentTheme.text,
                                borderColor: currentTheme.border,
                                backdropFilter: 'blur(10px)',
                            }}
                        />
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60 group-focus-within:opacity-100 transition-opacity"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            style={{ color: currentTheme.text }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>


                <div className="mb-8">
                    <div className="grid grid-cols-9 sm:grid-cols-6 lg:grid-cols-8 gap-y-4 gap-x-2">
                        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(letter => (
                            <button
                                key={letter}
                                onClick={() => {
                                    if (audioPingEnabled) playAudioPing('menu');
                                    scrollToSection(letter);
                                }}
                                className="w-full flex items-center justify-center text-[22px] font-black transition-transform"
                                style={{
                                    color: currentTheme.text,
                                    cursor: groupedFeatures[letter] ? 'pointer' : 'default',
                                    opacity: groupedFeatures[letter] ? (currentLetter === letter ? 1 : 0.6) : 0.2,
                                    transform: currentLetter === letter ? 'scale(1.35)' : 'scale(1.25)'
                                }}
                                disabled={!groupedFeatures[letter]}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>


            <div
                ref={scrollContainerRef}
                className="w-full sm:w-1/2 overflow-y-auto p-4 sm:p-8 pt-6 custom-scrollbar space-y-12 pb-12 scroll-smooth"
                onScroll={(e) => {
                    const container = e.currentTarget;
                    const sections = container.querySelectorAll('[id^="section-"]');
                    for (const section of Array.from(sections)) {
                        const rect = section.getBoundingClientRect();
                        const containerRect = container.getBoundingClientRect();
                        if (rect.top >= containerRect.top - 20 && rect.top <= containerRect.top + 150) {
                            setCurrentLetter(section.id.split('-')[1]);
                            break;
                        }
                    }
                }}
            >
                {Object.keys(groupedFeatures).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/5 border-2 border-white/10">
                            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-[16px] font-semibold text-white/40">No features found</p>
                    </div>
                ) : (
                    Object.entries(groupedFeatures).map(([letter, items]) => (
                        <div key={letter} id={`section-${letter}`} className="space-y-8 scroll-mt-6">

                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-[22px] font-black border-4 shadow-sm"
                                    style={{
                                        backgroundColor: currentTheme.active,
                                        borderColor: `${currentTheme.active}66`,
                                        color: currentTheme.background,
                                    }}
                                >
                                    {letter}
                                </div>
                                <div className="flex-1 border-t-2 opacity-20" style={{ borderColor: currentTheme.text }} />
                            </div>

                            <div className="flex flex-col gap-4 pl-2">
                                {items.map((item, idx) => {
                                    const match = item.label.match(/^([^(]+)(\(.*\))$/);
                                    const name = match ? match[1].trim() : item.label;
                                    const properties = match ? match[2].trim() : '';

                                    return (
                                        <button
                                            key={`${letter}-${idx}`}
                                            onClick={() => {
                                                if (audioPingEnabled) {
                                                    if (item.action) {
                                                        playAudioPing(item.isActive ? 'deselect' : 'select');
                                                    } else {
                                                        playAudioPing('menu');
                                                    }
                                                }
                                                if (item.action) {
                                                    item.action();
                                                } else if (item.category) {
                                                    onNavigate(item.category, item.highlightId);
                                                }
                                            }}
                                            className="group relative flex items-start gap-4 text-left transition-all duration-300"
                                        >
                                            {item.isActive && showOnBadge && (
                                                <span
                                                    className="absolute -top-1 -left-1 text-[10px] font-black leading-none px-1 py-0.5 rounded-full shadow-sm z-10 transform scale-110 origin-top-left"
                                                    style={{
                                                        backgroundColor: barTheme === 'yellow' ? '#FFFFFF' : '#FFD700',
                                                        color: '#000000',
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                                    }}
                                                >
                                                    On
                                                </span>
                                            )}

                                            <div
                                                className="w-2.5 h-2.5 rounded-full mt-2 transition-all duration-300 shadow-sm flex-shrink-0"
                                                style={{
                                                    backgroundColor: item.isActive ? currentTheme.active : `${currentTheme.text}40`,
                                                    boxShadow: item.isActive ? `0 0 10px ${currentTheme.active}` : 'none'
                                                }}
                                            />

                                            <div className="flex flex-col">
                                                <span
                                                    className="text-[16px] sm:text-[18px] font-black leading-tight transition-colors"
                                                    style={{
                                                        color: currentTheme.text,
                                                        opacity: item.isActive ? 1 : 0.85
                                                    }}
                                                >
                                                    {name}
                                                </span>
                                                {properties && (
                                                    <span
                                                        className="text-[13px] sm:text-[14px] font-bold opacity-60"
                                                        style={{ color: currentTheme.text }}
                                                    >
                                                        {properties}
                                                    </span>
                                                )}
                                            </div>
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
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${currentTheme.active}66;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${currentTheme.active};
                }
            `}</style>
        </div >
    );
};

export default AZFeatureList;
