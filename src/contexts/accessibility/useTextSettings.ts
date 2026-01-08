import { useState, useEffect } from 'react';
import { FontStyle } from './types';
import {
    DEFAULT_FONT_SIZE,
    MIN_FONT_SIZE,
    MAX_FONT_SIZE,
    isInsideAccessibilityBar
} from './utils';

export function useTextSettings() {
    const [fontSize, setFontSizeState] = useState<number>(DEFAULT_FONT_SIZE);
    const [fontStyle, setFontStyleState] = useState<FontStyle>('default');
    const [textAlign, setTextAlignState] = useState<'left' | 'center' | 'right' | 'justify'>('left');
    const [language, setLanguageState] = useState<string>('en-GB');
    const [lineHeight, setLineHeightState] = useState<number>(1);
    const [characterSpacing, setCharacterSpacingState] = useState<number>(0);
    const [wordSpacing, setWordSpacingState] = useState<number>(0);

    // Initial load from localStorage
    useEffect(() => {
        const savedFontSize = localStorage.getItem('accessibility-fontSize');
        const savedFontStyle = localStorage.getItem('accessibility-fontStyle');
        const savedTextAlign = localStorage.getItem('accessibility-textAlign');
        const savedLanguage = localStorage.getItem('accessibility-language');
        const savedLineHeight = localStorage.getItem('accessibility-lineHeight');
        const savedCharacterSpacing = localStorage.getItem('accessibility-characterSpacing');
        const savedWordSpacing = localStorage.getItem('accessibility-wordSpacing');

        if (savedFontSize) setFontSizeState(Number(savedFontSize));
        if (savedFontStyle) setFontStyleState(savedFontStyle as FontStyle);
        if (savedTextAlign) setTextAlignState(savedTextAlign as any);
        if (savedLanguage) setLanguageState(savedLanguage);
        if (savedLineHeight) setLineHeightState(Number(savedLineHeight));
        if (savedCharacterSpacing) setCharacterSpacingState(Number(savedCharacterSpacing));
        if (savedWordSpacing) setWordSpacingState(Number(savedWordSpacing));
    }, []);

    // Apply effects via CSS variables on document root
    useEffect(() => {
        // Set CSS variables on document root for the host page
        document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
        document.documentElement.style.setProperty('--line-height', `${lineHeight}`);
        document.documentElement.style.setProperty('--letter-spacing', `${characterSpacing}em`);
        document.documentElement.style.setProperty('--word-spacing', `${wordSpacing}em`);
        document.documentElement.style.setProperty('--text-align', textAlign);

        // Apply font style via data attribute
        if (fontStyle === 'default') {
            document.documentElement.removeAttribute('data-font-style');
        } else {
            document.documentElement.setAttribute('data-font-style', fontStyle);
        }

        // Save to localStorage
        localStorage.setItem('accessibility-fontSize', fontSize.toString());
        localStorage.setItem('accessibility-fontStyle', fontStyle);
        localStorage.setItem('accessibility-textAlign', textAlign);
        localStorage.setItem('accessibility-lineHeight', lineHeight.toString());
        localStorage.setItem('accessibility-characterSpacing', characterSpacing.toString());
        localStorage.setItem('accessibility-wordSpacing', wordSpacing.toString());
    }, [fontSize, fontStyle, textAlign, lineHeight, characterSpacing, wordSpacing]);

    return {
        fontSize,
        fontStyle,
        textAlign,
        language,
        lineHeight,
        characterSpacing,
        wordSpacing,
        setFontSize: setFontSizeState,
        setFontStyle: setFontStyleState,
        setTextAlign: setTextAlignState,
        setLanguage: setLanguageState,
        setLineHeight: setLineHeightState,
        setCharacterSpacing: setCharacterSpacingState,
        setWordSpacing: setWordSpacingState,
        increaseFontSize: () => setFontSizeState((prev) => Math.min(prev + 2, MAX_FONT_SIZE)),
        decreaseFontSize: () => setFontSizeState((prev) => Math.max(prev - 2, MIN_FONT_SIZE)),
        resetFontSize: () => setFontSizeState(DEFAULT_FONT_SIZE),
    };
}
