'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { AccessibilityState, FontStyle, ColorBlindFilter, ButtonPosition, PanelPosition } from './types';
import { useTextSettings } from './useTextSettings';
import { useVisualSettings } from './useVisualSettings';
import { useReadingSettings } from './useReadingSettings';
import { useContentSettings } from './useContentSettings';
import { useToolsSettings } from './useToolsSettings';
import { useUISettings } from './useUISettings';
import { isInsideAccessibilityBar } from './utils';

interface AccessibilityContextType extends AccessibilityState {
    increaseFontSize: () => void;
    decreaseFontSize: () => void;
    resetFontSize: () => void;
    setFontStyle: (style: FontStyle) => void;
    toggleHighContrast: () => void;
    toggleGrayscale: () => void;
    toggleInvertColors: () => void;
    toggleReadingGuide: () => void;
    setReadingGuideColor: (color: string) => void;
    setReadingGuideThickness: (thickness: number) => void;
    toggleReadingRuler: () => void;
    setReadingRulerColor: (color: string) => void;
    setReadingRulerWidth: (width: number) => void;
    toggleReadingMask: () => void;
    setReadingMaskColor: (color: string) => void;
    toggleReadingSpotlight: () => void;
    toggleReduceMotion: () => void;
    toggleDarkMode: () => void;
    toggleHighlightLinks: () => void;
    toggleHighlightHeadings: () => void;
    setTextSpacing: (spacing: number) => void;
    setCursorSize: (size: number) => void;
    setCursorColor: (color: string) => void;
    setPageZoom: (zoom: number) => void;
    setColorBlindFilter: (filter: ColorBlindFilter) => void;
    toggleLargeButtons: () => void;
    toggleTextToSpeech: () => void;
    toggleSpeechToText: () => void;
    toggleKeyboardNavigation: () => void;
    toggleOnPageDictionary: () => void;
    togglePronunciationGuide: () => void;
    setTextAlign: (align: 'left' | 'center' | 'right' | 'justify') => void;
    setLanguage: (lang: string) => void;
    setTextColor: (color: string) => void;
    setHeadingColor: (color: string) => void;
    setBackgroundColor: (color: string) => void;
    setLineHeight: (spacing: number) => void;
    setCharacterSpacing: (spacing: number) => void;
    setButtonPosition: (position: ButtonPosition) => void;
    setPanelPosition: (position: PanelPosition) => void;
    toggleHideImages: () => void;
    toggleShowImageDescriptions: () => void;
    togglePlainTextMode: () => void;
    toggleSimplifiedLayout: () => void;
    setPlainTextSize: (size: 'small' | 'medium' | 'large') => void;
    togglePauseAnimations: () => void;
    toggleStopVideos: () => void;
    togglePageSummary: () => void;
    setSummaryContent: (content: string) => void;
    toggleTtsAutoPlay: () => void;
    toggleTtsReadWholePage: () => void;
    toggleTtsMovableControls: () => void;
    setTtsVoiceGender: (gender: 'male' | 'female') => void;
    setTtsReadingSpeed: (speed: number) => void;
    toggleTtsReadSelectedText: () => void;
    fetchSummarizationHistory: () => Promise<void>;
    deleteHistoryItem: (id: string) => Promise<void>;
    resetAll: () => void;
    toggleMagnifier: () => void;
    toggleSmartSuggestions: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const text = useTextSettings();
    const visual = useVisualSettings();
    const reading = useReadingSettings();
    const content = useContentSettings();
    const tools = useToolsSettings();
    const ui = useUISettings();

    const resetAll = () => {

        localStorage.clear();
        window.location.reload();
    };

    const value: AccessibilityContextType = {
        fontSize: text.fontSize,
        fontStyle: text.fontStyle,
        textAlign: text.textAlign,
        language: text.language,
        lineHeight: text.lineHeight,
        characterSpacing: text.characterSpacing,
        textSpacing: text.lineHeight,

        highContrast: visual.highContrast,
        grayscale: visual.grayscale,
        invertColors: visual.invertColors,
        darkMode: visual.darkMode,
        colorBlindFilter: visual.colorBlindFilter,
        pageZoom: visual.pageZoom,
        backgroundColor: visual.backgroundColor,
        textColor: visual.textColor,
        headingColor: visual.headingColor,
        magnifier: visual.magnifier,

        readingGuide: reading.readingGuide,
        readingGuideColor: reading.readingGuideColor,
        readingGuideThickness: reading.readingGuideThickness,
        readingRuler: reading.readingRuler,
        readingRulerColor: reading.readingRulerColor,
        readingRulerWidth: reading.readingRulerWidth,
        readingMask: reading.readingMask,
        readingMaskColor: reading.readingMaskColor,
        readingSpotlight: reading.readingSpotlight,
        highlightLinks: reading.highlightLinks,
        highlightHeadings: reading.highlightHeadings,
        largeButtons: reading.largeButtons,

        hideImages: content.hideImages,
        showImageDescriptions: content.showImageDescriptions,
        plainTextMode: content.plainTextMode,
        simplifiedLayout: content.simplifiedLayout,
        plainTextSize: content.plainTextSize,
        pauseAnimations: content.pauseAnimations,
        stopVideos: content.stopVideos,
        reduceMotion: content.reduceMotion,

        textToSpeech: tools.textToSpeech,
        speechToText: tools.speechToText,
        onPageDictionary: tools.onPageDictionary,
        pronunciationGuide: tools.pronunciationGuide,
        keyboardNavigation: tools.keyboardNavigation,
        pageSummary: tools.pageSummary,
        summaryContent: tools.summaryContent,
        summarizationHistory: tools.summarizationHistory,
        smartSuggestions: tools.smartSuggestions,
        ttsAutoPlay: tools.ttsAutoPlay,
        ttsReadWholePage: tools.ttsReadWholePage,
        ttsMovableControls: tools.ttsMovableControls,
        ttsVoiceGender: tools.ttsVoiceGender,
        ttsReadingSpeed: tools.ttsReadingSpeed,
        ttsReadSelectedText: tools.ttsReadSelectedText,

        cursorSize: ui.cursorSize,
        cursorColor: ui.cursorColor,
        buttonPosition: ui.buttonPosition,
        panelPosition: ui.panelPosition,


        increaseFontSize: text.increaseFontSize,
        decreaseFontSize: text.decreaseFontSize,
        resetFontSize: text.resetFontSize,
        setFontStyle: text.setFontStyle,
        setTextAlign: text.setTextAlign,
        setLanguage: text.setLanguage,
        setLineHeight: text.setLineHeight,
        setTextSpacing: text.setLineHeight,
        setCharacterSpacing: text.setCharacterSpacing,

        toggleHighContrast: () => visual.setHighContrast(prev => !prev),
        toggleGrayscale: () => visual.setGrayscale(prev => !prev),
        toggleInvertColors: () => visual.setInvertColors(prev => !prev),
        toggleDarkMode: () => visual.setDarkMode(prev => !prev),
        setColorBlindFilter: visual.setColorBlindFilter,
        setPageZoom: visual.setPageZoom,
        setBackgroundColor: visual.setBackgroundColor,
        setTextColor: visual.setTextColor,
        setHeadingColor: visual.setHeadingColor,
        toggleMagnifier: () => visual.setMagnifier(prev => !prev),

        toggleReadingGuide: () => reading.setReadingGuide(prev => !prev),
        setReadingGuideColor: reading.setReadingGuideColor,
        setReadingGuideThickness: reading.setReadingGuideThickness,
        toggleReadingRuler: () => reading.setReadingRuler(prev => !prev),
        setReadingRulerColor: reading.setReadingRulerColor,
        setReadingRulerWidth: reading.setReadingRulerWidth,
        toggleReadingMask: () => reading.setReadingMask(prev => !prev),
        setReadingMaskColor: reading.setReadingMaskColor,
        toggleReadingSpotlight: () => reading.setReadingSpotlight(prev => !prev),
        toggleHighlightLinks: () => reading.setHighlightLinks(prev => !prev),
        toggleHighlightHeadings: () => reading.setHighlightHeadings(prev => !prev),
        toggleLargeButtons: () => reading.setLargeButtons(prev => !prev),

        toggleHideImages: () => content.setHideImages(prev => !prev),
        toggleShowImageDescriptions: () => content.setShowImageDescriptions(prev => !prev),
        togglePlainTextMode: () => content.setPlainTextMode(prev => !prev),
        toggleSimplifiedLayout: () => content.setSimplifiedLayout(prev => !prev),
        setPlainTextSize: content.setPlainTextSize,
        togglePauseAnimations: () => content.setPauseAnimations(prev => !prev),
        toggleStopVideos: () => content.setStopVideos(prev => !prev),
        toggleReduceMotion: () => content.setReduceMotion(prev => !prev),

        toggleTextToSpeech: () => tools.setTextToSpeech(prev => !prev),
        toggleSpeechToText: () => tools.setSpeechToText(prev => !prev),
        toggleOnPageDictionary: () => tools.setOnPageDictionary(prev => !prev),
        togglePronunciationGuide: () => tools.setPronunciationGuide(prev => !prev),
        toggleKeyboardNavigation: () => tools.setKeyboardNavigation(prev => !prev),
        togglePageSummary: () => tools.setPageSummary(prev => !prev),
        setSummaryContent: tools.setSummaryContent,
        toggleSmartSuggestions: () => tools.setSmartSuggestions(prev => !prev),
        toggleTtsAutoPlay: () => tools.setTtsAutoPlay(prev => !prev),
        toggleTtsReadWholePage: () => tools.setTtsReadWholePage(prev => !prev),
        toggleTtsMovableControls: () => tools.setTtsMovableControls(prev => !prev),
        setTtsVoiceGender: tools.setTtsVoiceGender,
        setTtsReadingSpeed: tools.setTtsReadingSpeed,
        toggleTtsReadSelectedText: () => tools.setTtsReadSelectedText(prev => !prev),
        fetchSummarizationHistory: tools.fetchSummarizationHistory,
        deleteHistoryItem: tools.deleteHistoryItem,

        setCursorSize: ui.setCursorSize,
        setCursorColor: ui.setCursorColor,
        setButtonPosition: ui.setButtonPosition,
        setPanelPosition: ui.setPanelPosition,

        resetAll,
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
}
