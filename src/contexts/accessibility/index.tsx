'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { AccessibilityState, FontStyle, ColorBlindFilter, ButtonPosition, PanelPosition, CursorStyle, NotificationState } from './types';
export type { AccessibilityState, FontStyle, ColorBlindFilter, ButtonPosition, PanelPosition, CursorStyle, NotificationState };
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
    showNotification: (message: string, position?: { top: number, left: number }) => void;
    notification: NotificationState;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const text = useTextSettings() as any;
    const visual = useVisualSettings() as any;
    const reading = useReadingSettings() as any;
    const content = useContentSettings() as any;
    const tools = useToolsSettings() as any;
    const ui = useUISettings() as any;
    const t = (translations as any)[text.language || 'en'] || (translations as any)['en'];
    const [notification, setNotification] = React.useState<NotificationState>({ message: null, visible: false });
    const notificationTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const showNotification = (message: string, position?: { top: number, left: number }) => {
        if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);

        let pos = position;
        if (!pos && typeof document !== 'undefined' && document.activeElement && document.activeElement !== document.body) {
            const rect = document.activeElement.getBoundingClientRect();
            pos = {
                top: rect.top,
                left: rect.left + rect.width / 2
            };
        }

        setNotification({ message, visible: true, position: pos });
        notificationTimeoutRef.current = setTimeout(() => {
            setNotification(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

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

        notification,
        showNotification,


        increaseFontSize: withAudioPing(text.increaseFontSize),
        decreaseFontSize: withAudioPing(text.decreaseFontSize),
        resetFontSize: withAudioPing(text.resetFontSize),
        setFontStyle: withAudioPing(text.setFontStyle),
        setTextAlign: withAudioPing(text.setTextAlign),
        setLanguage: withAudioPing(text.setLanguage),
        setLineHeight: withAudioPing(text.setLineHeight),
        setTextSpacing: withAudioPing(text.setLineHeight),
        setCharacterSpacing: withAudioPing(text.setCharacterSpacing),
        setWordSpacing: withAudioPing(text.setWordSpacing),

        toggleHighContrast: withAudioPing(() => {
            const next = !visual.highContrast;
            visual.setHighContrast(next);
            showNotification(next ? `${t.controls.contrast || "High Contrast"} Enabled` : `${t.controls.contrast || "High Contrast"} Disabled`);
        }),
        toggleGrayscale: withAudioPing(() => {
            const next = !visual.grayscale;
            visual.setGrayscale(next);
            showNotification(next ? `${t.controls.grayscale || "Greyscale"} Enabled` : `${t.controls.grayscale || "Greyscale"} Disabled`);
        }),
        toggleInvertColors: withAudioPing(() => {
            const next = !visual.invertColors;
            visual.setInvertColors(next);
            showNotification(next ? `${t.controls.invert || "Invert Colors"} Enabled` : `${t.controls.invert || "Invert Colors"} Disabled`);
        }),
        toggleDarkMode: withAudioPing(() => {
            const next = !visual.darkMode;
            visual.setDarkMode(next);
            showNotification(next ? `${t.controls.darkMode || "Dark Mode"} Enabled` : `${t.controls.darkMode || "Dark Mode"} Disabled`);
        }),
        setColorBlindFilter: withAudioPing((filter: ColorBlindFilter) => {
            visual.setColorBlindFilter(filter);
            if (filter !== 'none') showNotification(`${t.controls.colorBlind || "Color Blind Mode"}: ${filter}`);
        }),
        setPageZoom: withAudioPing(visual.setPageZoom),
        setBackgroundColor: withAudioPing(visual.setBackgroundColor),
        setTextColor: withAudioPing(visual.setTextColor),
        setHeadingColor: withAudioPing(visual.setHeadingColor),
        toggleMagnifier: withAudioPing(() => {
            const next = !visual.magnifier;
            visual.setMagnifier(next);
            showNotification(next ? `${t.controls.magnifier || "Magnifier"} Selected` : `${t.controls.magnifier || "Magnifier"} Removed`);
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
            showNotification(next ? `${t.controls.guide || "Reading Guide"} Selected` : `${t.controls.guide || "Reading Guide"} Removed`);
            if (next) {
                visual.setMagnifier(false);
                reading.setReadingRuler(false);
                reading.setReadingMask(false);
                reading.setReadingSpotlight(false);
            }
        }),
        setReadingGuideColor: withAudioPing(reading.setReadingGuideColor),
        setReadingGuideThickness: withAudioPing(reading.setReadingGuideThickness),
        toggleReadingRuler: withAudioPing(() => {
            const next = !reading.readingRuler;
            reading.setReadingRuler(next);
            showNotification(next ? `${t.controls.ruler || "Reading Ruler"} Selected` : `${t.controls.ruler || "Reading Ruler"} Removed`);
            if (next) {
                visual.setMagnifier(false);
                reading.setReadingGuide(false);
                reading.setReadingMask(false);
                reading.setReadingSpotlight(false);
            }
        }),
        setReadingRulerColor: withAudioPing(reading.setReadingRulerColor),
        setReadingRulerWidth: withAudioPing(reading.setReadingRulerWidth),
        toggleReadingMask: withAudioPing(() => {
            const next = !reading.readingMask;
            reading.setReadingMask(next);
            showNotification(next ? `${t.controls.mask || "Reading Mask"} Selected` : `${t.controls.mask || "Reading Mask"} Removed`);
            if (next) {
                visual.setMagnifier(false);
                reading.setReadingGuide(false);
                reading.setReadingRuler(false);
                reading.setReadingSpotlight(false);
            }
        }),
        setReadingMaskColor: withAudioPing(reading.setReadingMaskColor),
        setReadingMaskSize: withAudioPing(reading.setReadingMaskSize),
        toggleReadingSpotlight: withAudioPing(() => {
            const next = !reading.readingSpotlight;
            reading.setReadingSpotlight(next);
            showNotification(next ? `${t.controls.spotlight || "Spotlight"} Selected` : `${t.controls.spotlight || "Spotlight"} Removed`);
            if (next) {
                visual.setMagnifier(false);
                reading.setReadingGuide(false);
                reading.setReadingRuler(false);
                reading.setReadingMask(false);
            }
        }),
        setReadingSpotlightBrightness: withAudioPing(reading.setReadingSpotlightBrightness),
        toggleHighlightLinks: withAudioPing(() => {
            const next = !reading.highlightLinks;
            reading.setHighlightLinks(next);
            showNotification(next ? `${t.controls.links || "Highlight Links"} Enabled` : `${t.controls.links || "Highlight Links"} Disabled`);
        }),
        toggleHighlightHeadings: withAudioPing(() => {
            const next = !reading.highlightHeadings;
            reading.setHighlightHeadings(next);
            showNotification(next ? `${t.controls.headings || "Highlight Headings"} Enabled` : `${t.controls.headings || "Highlight Headings"} Disabled`);
        }),
        toggleLargeButtons: withAudioPing(() => {
            const next = !reading.largeButtons;
            reading.setLargeButtons(next);
            showNotification(next ? `${t.controls.buttons || "Large Buttons"} Enabled` : `${t.controls.buttons || "Large Buttons"} Disabled`);
        }),
        toggleReadingProgressBar: withAudioPing(() => {
            const next = !reading.readingProgressBar;
            reading.setReadingProgressBar(next);
            showNotification(next ? `${t.controls.progressBar || "Reading Progress"} Enabled` : `${t.controls.progressBar || "Reading Progress"} Disabled`);
        }),
        setReadingProgressBarColor: withAudioPing(reading.setReadingProgressBarColor),

        toggleHideImages: withAudioPing(() => {
            const next = !content.hideImages;
            content.setHideImages(next);
            showNotification(next ? `${t.controls.hideImages || "Hide Images"} Enabled` : `${t.controls.hideImages || "Hide Images"} Disabled`);
        }),
        toggleShowImageDescriptions: withAudioPing(() => {
            const next = !content.showImageDescriptions;
            content.setShowImageDescriptions(next);
            showNotification(next ? `${t.controls.descriptions || "Image Descriptions"} Enabled` : `${t.controls.descriptions || "Image Descriptions"} Disabled`);
        }),
        togglePlainTextMode: withAudioPing(() => {
            const next = !content.plainTextMode;
            content.setPlainTextMode(next);
            showNotification(next ? `${t.controls.plainText || "Plain Text Mode"} Enabled` : `${t.controls.plainText || "Plain Text Mode"} Disabled`);
        }),
        toggleSimplifiedLayout: withAudioPing(() => {
            const next = !content.simplifiedLayout;
            content.setSimplifiedLayout(next);
            showNotification(next ? `${t.controls.simplifyLayout || "Simplified Layout"} Enabled` : `${t.controls.simplifyLayout || "Simplified Layout"} Disabled`);
        }),
        togglePageStructure: withAudioPing(() => {
            const next = !content.pageStructure;
            content.setPageStructure(next);
            showNotification(next ? `${t.controls.structure || "Page Structure"} Enabled` : `${t.controls.structure || "Page Structure"} Disabled`);
        }),
        setPlainTextSize: withAudioPing(content.setPlainTextSize),
        togglePauseAnimations: withAudioPing(() => {
            const next = !content.pauseAnimations;
            content.setPauseAnimations(next);
            showNotification(next ? `${t.controls.motion || "Pause Animations"} Enabled` : `${t.controls.motion || "Pause Animations"} Disabled`);
        }),
        toggleStopVideos: withAudioPing(() => {
            const next = !content.stopVideos;
            content.setStopVideos(next);
            showNotification(next ? `${t.controls.stopVideos || "Stop Videos"} Enabled` : `${t.controls.stopVideos || "Stop Videos"} Disabled`);
        }),
        toggleReduceMotion: withAudioPing(() => {
            const next = !content.reduceMotion;
            content.setReduceMotion(next);
            showNotification(next ? `${t.controls.motion || "Reduce Motion"} Enabled` : `${t.controls.motion || "Reduce Motion"} Disabled`);
        }),

        toggleTextToSpeech: withAudioPing(() => {
            const next = !tools.textToSpeech;
            tools.setTextToSpeech(next);
            showNotification(next ? `${t.controls.tts || "Text to Speech"} Enabled` : `${t.controls.tts || "Text to Speech"} Disabled`);
        }),
        toggleSpeechToText: withAudioPing(() => {
            const next = !tools.speechToText;
            tools.setSpeechToText(next);
            showNotification(next ? `${t.controls.speechToText || "Voice Control"} Enabled` : `${t.controls.speechToText || "Voice Control"} Disabled`);
        }),
        toggleOnPageDictionary: withAudioPing(() => {
            const next = !tools.onPageDictionary;
            tools.setOnPageDictionary(next);
            showNotification(next ? `${t.controls.dictionary || "Dictionary"} Enabled` : `${t.controls.dictionary || "Dictionary"} Disabled`);
        }),
        togglePronunciationGuide: withAudioPing(() => {
            const next = !tools.pronunciationGuide;
            tools.setPronunciationGuide(next);
            showNotification(next ? `${t.controls.pronunciation || "Pronunciation Guide"} Enabled` : `${t.controls.pronunciation || "Pronunciation Guide"} Disabled`);
        }),
        toggleKeyboardNavigation: withAudioPing(() => {
            const next = !tools.keyboardNavigation;
            tools.setKeyboardNavigation(next);
            showNotification(next ? `${t.controls.keyboardNav || "Keyboard Navigation"} Enabled` : `${t.controls.keyboardNav || "Keyboard Navigation"} Disabled`);
        }),
        togglePageSummary: withAudioPing(() => {
            const next = !tools.pageSummary;
            tools.setPageSummary(next);
            showNotification(next ? `${t.controls.pageSummary || "Page Summary"} Enabled` : `${t.controls.pageSummary || "Page Summary"} Disabled`);
        }),
        setSummaryContent: withAudioPing(tools.setSummaryContent),
        toggleSmartSuggestions: withAudioPing(() => {
            const next = !tools.smartSuggestions;
            tools.setSmartSuggestions(next);
            showNotification(next ? `${t.controls.smartSuggestions || "Smart Suggestions"} Enabled` : `${t.controls.smartSuggestions || "Smart Suggestions"} Disabled`);
        }),
        toggleTtsAutoPlay: withAudioPing(() => {
            const next = !tools.ttsAutoPlay;
            tools.setTtsAutoPlay(next);
            showNotification(next ? `${t.controls.autoPlay || "Auto Play"} Enabled` : `${t.controls.autoPlay || "Auto Play"} Disabled`);
        }),
        toggleTtsReadWholePage: withAudioPing(() => {
            const next = !tools.ttsReadWholePage;
            tools.setTtsReadWholePage(next);
            showNotification(next ? `${t.controls.readPageContent || "Read Page"} Enabled` : `${t.controls.readPageContent || "Read Page"} Disabled`);
        }),
        toggleTtsMovableControls: withAudioPing(() => {
            const next = !tools.ttsMovableControls;
            tools.setTtsMovableControls(next);
            showNotification(next ? `${t.controls.movableControls || "Movable Controls"} Enabled` : `${t.controls.movableControls || "Movable Controls"} Disabled`);
        }),
        setTtsVoiceGender: withAudioPing(tools.setTtsVoiceGender),
        setTtsReadingSpeed: withAudioPing(tools.setTtsReadingSpeed),
        toggleTtsReadSelectedText: withAudioPing(() => {
            const next = !tools.ttsReadSelectedText;
            tools.setTtsReadSelectedText(next);
            showNotification(next ? `${t.controls.readSelected || "Read Selected"} Enabled` : `${t.controls.readSelected || "Read Selected"} Disabled`);
        }),
        toggleTtsHoverToSpeak: withAudioPing(() => {
            const next = !tools.ttsHoverToSpeak;
            tools.setTtsHoverToSpeak(next);
            showNotification(next ? `${t.controls.hoverToSpeak || "Hover to Speak"} Enabled` : `${t.controls.hoverToSpeak || "Hover to Speak"} Disabled`);
        }),
        toggleRealTimeTranslation: withAudioPing(() => {
            const next = !tools.realTimeTranslation;
            tools.setRealTimeTranslation(next);
            showNotification(next ? `${t.controls.realTimeTranslation || "Real-Time Translation"} Enabled` : `${t.controls.realTimeTranslation || "Real-Time Translation"} Disabled`);
        }),
        setSelectionLanguage: withAudioPing(tools.setSelectionLanguage),
        fetchSummarizationHistory: tools.fetchSummarizationHistory,
        deleteHistoryItem: tools.deleteHistoryItem,
        pauseTts: tools.pauseTts,
        resumeTts: tools.resumeTts,
        stopTts: tools.stopTts,

        setCursorSize: withAudioPing(ui.setCursorSize),
        setCursorStyle: withAudioPing(ui.setCursorStyle),
        setCursorColor: withAudioPing(ui.setCursorColor),
        setPrimaryButton: withAudioPing(ui.setPrimaryButton),
        setButtonPosition: withAudioPing(ui.setButtonPosition),
        setPanelPosition: withAudioPing(ui.setPanelPosition),
        setBarTheme: withAudioPing(ui.setBarTheme),
        setMagnifierScale: withAudioPing(visual.setMagnifierScale),
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
                case 'navigation':
                    if (ui.isPanelPinned) list.push({ label: "Panel Pinned", onRemove: () => ui.setIsPanelPinned(false) });
                    break;
            }
            return list;
        },

        resetAll: withAudioPing(resetAll),
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
