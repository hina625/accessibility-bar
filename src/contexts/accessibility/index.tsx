'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { AccessibilityState, FontStyle, ColorBlindFilter, ButtonPosition, PanelPosition, CursorStyle } from './types';
export type { AccessibilityState, FontStyle, ColorBlindFilter, ButtonPosition, PanelPosition, CursorStyle };
export type { BarTheme } from './theme';
export { BAR_THEMES } from './theme';
import type { BarTheme } from './theme';
import { useTextSettings } from './useTextSettings';
import { useVisualSettings } from './useVisualSettings';
import { useReadingSettings } from './useReadingSettings';
import { useContentSettings } from './useContentSettings';
import { playAudioPing } from '@/utils/audioPingUtils';
import { useToolsSettings } from './useToolsSettings';
import { useUISettings } from './useUISettings';
import { translations } from './translations';
export { isInsideAccessibilityBar } from './utils';

export interface AccessibilityContextType extends AccessibilityState {
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
    setReadingMaskSize: (size: number) => void;
    toggleReadingSpotlight: () => void;
    setReadingSpotlightBrightness: (brightness: number) => void;
    toggleReduceMotion: () => void;
    toggleDarkMode: () => void;
    toggleHighlightLinks: () => void;
    toggleHighlightHeadings: () => void;
    setTextSpacing: (spacing: number) => void;
    setCursorSize: (size: number) => void;
    setCursorStyle: (style: CursorStyle) => void;
    setCursorColor: (color: string) => void;
    setPrimaryButton: (button: 'left' | 'right') => void;
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
    setWordSpacing: (spacing: number) => void;
    setButtonPosition: (position: ButtonPosition) => void;
    setPanelPosition: (position: PanelPosition) => void;
    setBarTheme: (theme: BarTheme) => void;
    toggleHideImages: () => void;
    toggleShowImageDescriptions: () => void;
    togglePlainTextMode: () => void;
    toggleSimplifiedLayout: () => void;
    togglePageStructure: () => void;
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
    toggleTtsHoverToSpeak: () => void;
    fetchSummarizationHistory: () => Promise<void>;
    deleteHistoryItem: (id: string) => Promise<void>;
    resetAll: () => void;
    toggleMagnifier: () => void;
    toggleSmartSuggestions: () => void;
    isMobile: boolean;
    toggleRealTimeTranslation: () => void;
    setSelectionLanguage: (lang: string) => void;
    setMagnifierScale: (scale: number) => void;
    toggleShowActiveIndicators: () => void;
    audioPingEnabled: boolean;
    toggleAudioPing: () => void;
    getActiveFeatures: (categoryId: string) => string[];
    getActiveFeaturesWithActions: (categoryId: string) => { label: string; onRemove: () => void }[];
    toggleReadingProgressBar: () => void;
    setReadingProgressBarColor: (color: string) => void;
    isPaused: boolean;
    pauseTts: () => void;
    resumeTts: () => void;
    stopTts: () => void;
    isPanelPinned: boolean;
    togglePanelPin: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const text = useTextSettings() as any;
    const visual = useVisualSettings() as any;
    const reading = useReadingSettings() as any;
    const content = useContentSettings() as any;
    const tools = useToolsSettings() as any;
    const ui = useUISettings() as any;

    const withAudioPing = (fn: any) => {
        return (...args: any[]) => {
            console.log('Toggle called, audioPingEnabled:', ui.audioPingEnabled);
            if (ui.audioPingEnabled) {
                playAudioPing();
            }
            return fn(...args);
        };
    };

    const resetAll = () => {
        localStorage.clear();
        window.location.reload();
    };

    // Triple Click Zoom Feature
    React.useEffect(() => {
        let clickCount = 0;
        let lastClickTime = 0;

        const handleTripleClick = (e: MouseEvent) => {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastClickTime;

            if (timeDiff < 500) {
                clickCount++;
            } else {
                clickCount = 1;
            }

            lastClickTime = currentTime;

            if (clickCount === 3) {
                visual.setPageZoom((prev: number) => prev === 100 ? 150 : 100);
                clickCount = 0;
            }
        };

        document.addEventListener('click', handleTripleClick);
        return () => document.removeEventListener('click', handleTripleClick);
    }, [visual.setPageZoom]);

    const value: AccessibilityContextType = {
        fontSize: text.fontSize,
        fontStyle: text.fontStyle,
        textAlign: text.textAlign,
        language: text.language,
        lineHeight: text.lineHeight,
        characterSpacing: text.characterSpacing,
        wordSpacing: text.wordSpacing,
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
        magnifierScale: visual.magnifierScale,

        readingGuide: reading.readingGuide,
        readingGuideColor: reading.readingGuideColor,
        readingGuideThickness: reading.readingGuideThickness,
        readingRuler: reading.readingRuler,
        readingRulerColor: reading.readingRulerColor,
        readingRulerWidth: reading.readingRulerWidth,
        readingMask: reading.readingMask,
        readingMaskColor: reading.readingMaskColor,
        readingMaskSize: reading.readingMaskSize,
        readingSpotlight: reading.readingSpotlight,
        readingSpotlightBrightness: reading.readingSpotlightBrightness,
        highlightLinks: reading.highlightLinks,
        highlightHeadings: reading.highlightHeadings,
        largeButtons: reading.largeButtons,
        readingProgressBar: reading.readingProgressBar,
        readingProgressBarColor: reading.readingProgressBarColor,

        hideImages: content.hideImages,
        showImageDescriptions: content.showImageDescriptions,
        plainTextMode: content.plainTextMode,
        simplifiedLayout: content.simplifiedLayout,
        pageStructure: content.pageStructure,
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
        ttsHoverToSpeak: tools.ttsHoverToSpeak,
        realTimeTranslation: tools.realTimeTranslation,
        selectionLanguage: tools.selectionLanguage,
        isPaused: tools.isPaused,

        cursorSize: ui.cursorSize,
        cursorStyle: ui.cursorStyle,
        cursorColor: ui.cursorColor,
        primaryButton: ui.primaryButton,
        buttonPosition: ui.buttonPosition,
        panelPosition: ui.panelPosition,
        barTheme: ui.barTheme,
        isMobile: ui.isMobile,
        showActiveIndicators: ui.showActiveIndicators,
        audioPingEnabled: ui.audioPingEnabled,
        isPanelPinned: ui.isPanelPinned,


        increaseFontSize: withAudioPing(text.increaseFontSize),
        decreaseFontSize: withAudioPing(text.decreaseFontSize),
        resetFontSize: withAudioPing(text.resetFontSize),
        setFontStyle: withAudioPing(text.setFontStyle),
        setTextAlign: withAudioPing(text.setTextAlign),
        setLanguage: withAudioPing(text.setLanguage),
        setLineHeight: withAudioPing(text.setLineHeight),
        setTextSpacing: withAudioPing(text.setLineHeight),
        setCharacterSpacing: text.setCharacterSpacing,
        setWordSpacing: text.setWordSpacing,

        toggleHighContrast: withAudioPing(() => visual.setHighContrast((prev: boolean) => !prev)),
        toggleGrayscale: withAudioPing(() => visual.setGrayscale((prev: boolean) => !prev)),
        toggleInvertColors: withAudioPing(() => visual.setInvertColors((prev: boolean) => !prev)),
        toggleDarkMode: withAudioPing(() => visual.setDarkMode((prev: boolean) => !prev)),
        setColorBlindFilter: visual.setColorBlindFilter,
        setPageZoom: visual.setPageZoom,
        setBackgroundColor: visual.setBackgroundColor,
        setTextColor: visual.setTextColor,
        setHeadingColor: visual.setHeadingColor,
        toggleMagnifier: withAudioPing(() => {
            const next = !visual.magnifier;
            visual.setMagnifier(next);
            if (next) {
                reading.setReadingGuide(false);
                reading.setReadingRuler(false);
                reading.setReadingMask(false);
                reading.setReadingSpotlight(false);
            }
        }),

        toggleReadingGuide: withAudioPing(() => {
            const next = !reading.readingGuide;
            reading.setReadingGuide(next);
            if (next) {
                visual.setMagnifier(false);
                reading.setReadingRuler(false);
                reading.setReadingMask(false);
                reading.setReadingSpotlight(false);
            }
        }),
        setReadingGuideColor: reading.setReadingGuideColor,
        setReadingGuideThickness: reading.setReadingGuideThickness,
        toggleReadingRuler: withAudioPing(() => {
            const next = !reading.readingRuler;
            reading.setReadingRuler(next);
            if (next) {
                visual.setMagnifier(false);
                reading.setReadingGuide(false);
                reading.setReadingMask(false);
                reading.setReadingSpotlight(false);
            }
        }),
        setReadingRulerColor: reading.setReadingRulerColor,
        setReadingRulerWidth: reading.setReadingRulerWidth,
        toggleReadingMask: withAudioPing(() => {
            const next = !reading.readingMask;
            reading.setReadingMask(next);
            if (next) {
                visual.setMagnifier(false);
                reading.setReadingGuide(false);
                reading.setReadingRuler(false);
                reading.setReadingSpotlight(false);
            }
        }),
        setReadingMaskColor: reading.setReadingMaskColor,
        setReadingMaskSize: reading.setReadingMaskSize,
        toggleReadingSpotlight: withAudioPing(() => {
            const next = !reading.readingSpotlight;
            reading.setReadingSpotlight(next);
            if (next) {
                visual.setMagnifier(false);
                reading.setReadingGuide(false);
                reading.setReadingRuler(false);
                reading.setReadingMask(false);
            }
        }),
        setReadingSpotlightBrightness: reading.setReadingSpotlightBrightness,
        toggleHighlightLinks: withAudioPing(() => reading.setHighlightLinks((prev: boolean) => !prev)),
        toggleHighlightHeadings: withAudioPing(() => reading.setHighlightHeadings((prev: boolean) => !prev)),
        toggleLargeButtons: withAudioPing(() => reading.setLargeButtons((prev: boolean) => !prev)),
        toggleReadingProgressBar: withAudioPing(() => reading.setReadingProgressBar((prev: boolean) => !prev)),
        setReadingProgressBarColor: reading.setReadingProgressBarColor,

        toggleHideImages: withAudioPing(() => content.setHideImages((prev: boolean) => !prev)),
        toggleShowImageDescriptions: withAudioPing(() => content.setShowImageDescriptions((prev: boolean) => !prev)),
        togglePlainTextMode: withAudioPing(() => content.setPlainTextMode((prev: boolean) => !prev)),
        toggleSimplifiedLayout: withAudioPing(() => content.setSimplifiedLayout((prev: boolean) => !prev)),
        togglePageStructure: withAudioPing(() => content.setPageStructure((prev: boolean) => !prev)),
        setPlainTextSize: content.setPlainTextSize,
        togglePauseAnimations: withAudioPing(() => content.setPauseAnimations((prev: boolean) => !prev)),
        toggleStopVideos: withAudioPing(() => content.setStopVideos((prev: boolean) => !prev)),
        toggleReduceMotion: withAudioPing(() => content.setReduceMotion((prev: boolean) => !prev)),

        toggleTextToSpeech: withAudioPing(() => tools.setTextToSpeech((prev: boolean) => !prev)),
        toggleSpeechToText: withAudioPing(() => tools.setSpeechToText((prev: boolean) => !prev)),
        toggleOnPageDictionary: withAudioPing(() => tools.setOnPageDictionary((prev: boolean) => !prev)),
        togglePronunciationGuide: withAudioPing(() => tools.setPronunciationGuide((prev: boolean) => !prev)),
        toggleKeyboardNavigation: withAudioPing(() => tools.setKeyboardNavigation((prev: boolean) => !prev)),
        togglePageSummary: withAudioPing(() => tools.setPageSummary((prev: boolean) => !prev)),
        setSummaryContent: tools.setSummaryContent,
        toggleSmartSuggestions: withAudioPing(() => tools.setSmartSuggestions((prev: boolean) => !prev)),
        toggleTtsAutoPlay: withAudioPing(() => tools.setTtsAutoPlay((prev: boolean) => !prev)),
        toggleTtsReadWholePage: withAudioPing(() => tools.setTtsReadWholePage((prev: boolean) => !prev)),
        toggleTtsMovableControls: withAudioPing(() => tools.setTtsMovableControls((prev: boolean) => !prev)),
        setTtsVoiceGender: tools.setTtsVoiceGender,
        setTtsReadingSpeed: tools.setTtsReadingSpeed,
        toggleTtsReadSelectedText: withAudioPing(() => tools.setTtsReadSelectedText((prev: boolean) => !prev)),
        toggleTtsHoverToSpeak: withAudioPing(() => tools.setTtsHoverToSpeak((prev: boolean) => !prev)),
        toggleRealTimeTranslation: withAudioPing(() => tools.setRealTimeTranslation((prev: boolean) => !prev)),
        setSelectionLanguage: tools.setSelectionLanguage,
        fetchSummarizationHistory: tools.fetchSummarizationHistory,
        deleteHistoryItem: tools.deleteHistoryItem,
        pauseTts: tools.pauseTts,
        resumeTts: tools.resumeTts,
        stopTts: tools.stopTts,

        setCursorSize: ui.setCursorSize,
        setCursorStyle: ui.setCursorStyle,
        setCursorColor: ui.setCursorColor,
        setPrimaryButton: ui.setPrimaryButton,
        setButtonPosition: ui.setButtonPosition,
        setPanelPosition: ui.setPanelPosition,
        setBarTheme: ui.setBarTheme,
        setMagnifierScale: visual.setMagnifierScale,
        toggleShowActiveIndicators: withAudioPing(() => ui.setShowActiveIndicators((prev: boolean) => !prev)),
        toggleAudioPing: () => {
            const next = !ui.audioPingEnabled;
            if (next) playAudioPing();
            ui.setAudioPingEnabled(next);
        },
        togglePanelPin: withAudioPing(ui.togglePanelPin),
        getActiveFeatures: (categoryId: string) => {
            const list: string[] = [];
            const t = (translations as any)[text.language || 'en'] || (translations as any)['en'];
            const ct = t.controls;

            switch (categoryId) {
                case 'font':
                    if (text.fontSize && text.fontSize !== 16) list.push(ct.fontSize);
                    if (text.lineHeight && text.lineHeight !== 1) list.push(ct.lineHeight);
                    if (text.characterSpacing && text.characterSpacing !== 0) list.push(ct.charSpacing);
                    if (text.wordSpacing && text.wordSpacing !== 0) list.push(ct.wordSpacing);
                    if (text.fontStyle && text.fontStyle !== 'default') list.push(ct.fontStyle);
                    if (text.textAlign && text.textAlign !== 'left') list.push(ct.textAlign);
                    break;
                case 'contrast':
                    if (visual.highContrast) list.push(ct.contrast || "High Contrast");
                    if (visual.darkMode) list.push(ct.darkMode || "Dark Mode");
                    if (visual.grayscale) list.push(ct.grayscale || "Greyscale");
                    if (visual.invertColors) list.push(ct.invert || "Invert");
                    if (visual.pageZoom && visual.pageZoom !== 100) list.push(ct.zoom || "Zoom");
                    if (visual.colorBlindFilter && visual.colorBlindFilter !== 'none') list.push(ct.colorBlind || "Color Blind");
                    break;
                case 'reading':
                    if (reading.readingRuler) list.push(ct.ruler || "Ruler");
                    if (reading.readingGuide) list.push(ct.guide || "Guide");
                    if (reading.readingMask) list.push(ct.mask || "Mask");
                    if (reading.readingSpotlight) list.push(ct.spotlight || "Spotlight");
                    if (reading.largeButtons) list.push(ct.buttons || "Large Buttons");
                    if (visual.magnifier) list.push(ct.magnifier || "Magnifier");
                    break;
                case 'layout':
                    if (content.pageStructure) list.push(ct.summarization || "Summary");
                    if (content.plainTextMode) list.push(ct.plainText || "Plain Text");
                    if (content.simplifiedLayout) list.push(ct.simplifyLayout || "Simplify");
                    if (reading.highlightLinks) list.push(ct.links || "Highlight Links");
                    if (reading.highlightHeadings) list.push(ct.headings || "Highlight Headings");
                    break;
                case 'cursor':
                    if (ui.cursorSize && ui.cursorSize !== 1) list.push(ct.cursor || "Pointer size");
                    if (ui.cursorStyle && ui.cursorStyle !== 'white') list.push(ct.cursorStyle || "Pointer style");
                    if (ui.cursorColor && ui.cursorColor !== '#000000' && ui.cursorColor !== '#000') list.push(ct.cursorColor || "Pointer colour");
                    if (content.reduceMotion) list.push(ct.motion || "Reduce Motion");
                    break;
                case 'images':
                    if (content.hideImages) list.push(ct.hideImages || "Hide Images");
                    if (content.showImageDescriptions) list.push(ct.descriptions || "Image Desc");
                    if (content.pauseAnimations) list.push(ct.motion || "Reduce Motion");
                    if (content.stopVideos) list.push(ct.stopVideos || "Stop Videos");
                    break;
                case 'speech':
                    if (tools.textToSpeech) list.push(ct.tts || "Speech");
                    if (tools.speechToText) list.push(ct.speechToText || "Voice Control");
                    if (tools.ttsAutoPlay) list.push(ct.autoPlay || "Click to Speak");
                    if (tools.ttsReadWholePage) list.push(ct.readPageContent || "Read Page");
                    if (tools.ttsHoverToSpeak) list.push(ct.hoverToSpeak || "Hover to Speak");
                    break;
                case 'ai':
                    if (tools.pageSummary) list.push(ct.pageSummary || "Page Summary");
                    break;
                case 'language':
                    if (text.language && text.language !== 'en-GB') list.push(ct.translateWebsite || "Translate");
                    if (tools.onPageDictionary) list.push(ct.dictionary || "Dictionary");
                    if (tools.realTimeTranslation) list.push(ct.realTimeTranslation || "Real-Time Translation");
                    if (tools.pronunciationGuide) list.push(ct.pronunciation || "Pronunciation Guide");
                    if (tools.smartSuggestions) list.push(ct.smartSuggestions || "Smart Suggestions");
                    break;
            }
            return list;
        },

        getActiveFeaturesWithActions: (categoryId: string) => {
            const list: { label: string; onRemove: () => void }[] = [];
            const t = (translations as any)[text.language || 'en'] || (translations as any)['en'];
            const ct = t.controls;

            switch (categoryId) {
                case 'font':
                    if (text.fontSize && text.fontSize !== 16) list.push({ label: ct.fontSize, onRemove: text.resetFontSize });
                    if (text.lineHeight && text.lineHeight !== 1) list.push({ label: ct.lineHeight, onRemove: () => text.setLineHeight(1) });
                    if (text.characterSpacing && text.characterSpacing !== 0) list.push({ label: ct.charSpacing, onRemove: () => text.setCharacterSpacing(0) });
                    if (text.wordSpacing && text.wordSpacing !== 0) list.push({ label: ct.wordSpacing, onRemove: () => text.setWordSpacing(0) });
                    if (text.fontStyle && text.fontStyle !== 'default') list.push({ label: ct.fontStyle, onRemove: () => text.setFontStyle('default') });
                    if (text.textAlign && text.textAlign !== 'left') list.push({ label: ct.textAlign, onRemove: () => text.setTextAlign('left') });
                    break;
                case 'contrast':
                    if (visual.highContrast) list.push({ label: ct.contrast || "High Contrast", onRemove: () => visual.setHighContrast(false) });
                    if (visual.darkMode) list.push({ label: ct.darkMode || "Dark Mode", onRemove: () => visual.setDarkMode(false) });
                    if (visual.grayscale) list.push({ label: ct.grayscale || "Greyscale", onRemove: () => visual.setGrayscale(false) });
                    if (visual.invertColors) list.push({ label: ct.invert || "Invert", onRemove: () => visual.setInvertColors(false) });
                    if (visual.pageZoom && visual.pageZoom !== 100) list.push({ label: ct.zoom || "Zoom", onRemove: () => visual.setPageZoom(100) });
                    if (visual.colorBlindFilter && visual.colorBlindFilter !== 'none') list.push({ label: ct.colorBlind || "Color Blind", onRemove: () => visual.setColorBlindFilter('none') });
                    break;
                case 'reading':
                    if (reading.readingRuler) list.push({ label: ct.ruler || "Ruler", onRemove: () => reading.setReadingRuler(false) });
                    if (reading.readingGuide) list.push({ label: ct.guide || "Guide", onRemove: () => reading.setReadingGuide(false) });
                    if (reading.readingMask) list.push({ label: ct.mask || "Mask", onRemove: () => reading.setReadingMask(false) });
                    if (reading.readingSpotlight) list.push({ label: ct.spotlight || "Spotlight", onRemove: () => reading.setReadingSpotlight(false) });
                    if (reading.largeButtons) list.push({ label: ct.buttons || "Large Buttons", onRemove: () => reading.setLargeButtons(false) });
                    if (visual.magnifier) list.push({ label: ct.magnifier || "Magnifier", onRemove: () => visual.setMagnifier(false) });
                    break;
                case 'layout':
                    if (content.pageStructure) list.push({ label: ct.summarization || "Summary", onRemove: () => content.setPageStructure(false) });
                    if (content.plainTextMode) list.push({ label: ct.plainText || "Plain Text", onRemove: () => content.setPlainTextMode(false) });
                    if (content.simplifiedLayout) list.push({ label: ct.simplifyLayout || "Simplify", onRemove: () => content.setSimplifiedLayout(false) });
                    if (reading.highlightLinks) list.push({ label: ct.links || "Highlight Links", onRemove: () => reading.setHighlightLinks(false) });
                    if (reading.highlightHeadings) list.push({ label: ct.headings || "Highlight Headings", onRemove: () => reading.setHighlightHeadings(false) });
                    break;
                case 'cursor':
                    if (ui.cursorSize && ui.cursorSize !== 1) list.push({ label: ct.cursor || "Pointer size", onRemove: () => ui.setCursorSize(1) });
                    if (ui.cursorStyle && ui.cursorStyle !== 'white') list.push({ label: ct.cursorStyle || "Pointer style", onRemove: () => ui.setCursorStyle('white') });
                    if (ui.cursorColor && ui.cursorColor !== '#000000' && ui.cursorColor !== '#000') list.push({ label: ct.cursorColor || "Pointer colour", onRemove: () => ui.setCursorColor('#000000') });
                    if (content.reduceMotion) list.push({ label: ct.motion || "Reduce Motion", onRemove: () => content.setReduceMotion(false) });
                    break;
                case 'images':
                    if (content.hideImages) list.push({ label: ct.hideImages || "Hide Images", onRemove: () => content.setHideImages(false) });
                    if (content.showImageDescriptions) list.push({ label: ct.descriptions || "Image Desc", onRemove: () => content.setShowImageDescriptions(false) });
                    if (content.pauseAnimations) list.push({ label: ct.motion || "Reduce Motion", onRemove: () => content.setPauseAnimations(false) });
                    if (content.stopVideos) list.push({ label: ct.stopVideos || "Stop Videos", onRemove: () => content.setStopVideos(false) });
                    break;
                case 'speech':
                    if (tools.textToSpeech) list.push({ label: ct.tts || "Speech", onRemove: () => tools.setTextToSpeech(false) });
                    if (tools.speechToText) list.push({ label: ct.speechToText || "Voice Control", onRemove: () => tools.setSpeechToText(false) });
                    if (tools.ttsAutoPlay) list.push({ label: ct.autoPlay || "Click to Speak", onRemove: () => tools.setTtsAutoPlay(false) });
                    if (tools.ttsReadWholePage) list.push({ label: ct.readPageContent || "Read Page", onRemove: () => tools.setTtsReadWholePage(false) });
                    if (tools.ttsHoverToSpeak) list.push({ label: ct.hoverToSpeak || "Hover to Speak", onRemove: () => tools.setTtsHoverToSpeak(false) });
                    break;
                case 'ai':
                    if (tools.pageSummary) list.push({ label: ct.pageSummary || "Page Summary", onRemove: () => tools.setPageSummary(false) });
                    break;
                case 'language':
                    if (text.language && text.language !== 'en-GB') list.push({ label: ct.translateWebsite || "Translate", onRemove: () => text.setLanguage('en-GB') });
                    if (tools.onPageDictionary) list.push({ label: ct.dictionary || "Dictionary", onRemove: () => tools.setOnPageDictionary(false) });
                    if (tools.realTimeTranslation) list.push({ label: ct.realTimeTranslation || "Real-Time Translation", onRemove: () => tools.setRealTimeTranslation(false) });
                    if (tools.pronunciationGuide) list.push({ label: ct.pronunciation || "Pronunciation Guide", onRemove: () => tools.setPronunciationGuide(false) });
                    if (tools.smartSuggestions) list.push({ label: ct.smartSuggestions || "Smart Suggestions", onRemove: () => tools.setSmartSuggestions(false) });
                    break;
            }
            return list;
        },

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
