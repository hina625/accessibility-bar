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
    const [language, setLanguageState] = useState<string>('en');
    const [lineHeight, setLineHeightState] = useState<number>(1);
    const [characterSpacing, setCharacterSpacingState] = useState<number>(0);

    // Initial load from localStorage
    useEffect(() => {
        const savedFontSize = localStorage.getItem('accessibility-fontSize');
        const savedFontStyle = localStorage.getItem('accessibility-fontStyle');
        const savedTextAlign = localStorage.getItem('accessibility-textAlign');
        const savedLanguage = localStorage.getItem('accessibility-language');
        const savedLineHeight = localStorage.getItem('accessibility-lineHeight');
        const savedCharacterSpacing = localStorage.getItem('accessibility-characterSpacing');

        if (savedFontSize) setFontSizeState(Number(savedFontSize));
        if (savedFontStyle) setFontStyleState(savedFontStyle as FontStyle);
        if (savedTextAlign) setTextAlignState(savedTextAlign as any);
        if (savedLanguage) setLanguageState(savedLanguage);
        if (savedLineHeight) setLineHeightState(Number(savedLineHeight));
        if (savedCharacterSpacing) setCharacterSpacingState(Number(savedCharacterSpacing));
    }, []);

    // Apply effects
    useEffect(() => {
        const applyFontSize = () => {
            const contentElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, span, article, section, main, aside, li, td, th, blockquote, a, button, input, textarea, select, label');
            contentElements.forEach((element) => {
                const htmlElement = element as HTMLElement;
                if (!isInsideAccessibilityBar(htmlElement)) {
                    htmlElement.style.fontSize = `${fontSize}px`;
                }
            });
            if (!isInsideAccessibilityBar(document.body)) {
                document.body.style.fontSize = `${fontSize}px`;
            }
        };

        applyFontSize();
        localStorage.setItem('accessibility-fontSize', fontSize.toString());
    }, [fontSize]);

    useEffect(() => {
        document.documentElement.setAttribute('data-font-style', fontStyle);
        localStorage.setItem('accessibility-fontStyle', fontStyle);
    }, [fontStyle]);

    useEffect(() => {
        const applyAlign = () => {
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, span, article, section, main, aside, li, td, th, blockquote');
            textElements.forEach((element) => {
                const htmlElement = element as HTMLElement;
                if (!isInsideAccessibilityBar(htmlElement)) {
                    htmlElement.style.textAlign = textAlign;
                }
            });
        };
        applyAlign();
        localStorage.setItem('accessibility-textAlign', textAlign);
    }, [textAlign]);

    useEffect(() => {
        document.documentElement.setAttribute('lang', language);
        localStorage.setItem('accessibility-language', language);
    }, [language]);

    useEffect(() => {
        const applySpacing = () => {
            const contentElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, span, article, section, main, aside, li, td, th, blockquote, a, button, input, textarea, select, label, header, footer, nav');
            contentElements.forEach((element) => {
                const htmlElement = element as HTMLElement;
                if (!isInsideAccessibilityBar(htmlElement)) {
                    htmlElement.style.lineHeight = `${1.5 * lineHeight}`;
                    htmlElement.style.letterSpacing = `${characterSpacing}em`;
                }
            });
        };
        applySpacing();
        localStorage.setItem('accessibility-lineHeight', lineHeight.toString());
        localStorage.setItem('accessibility-characterSpacing', characterSpacing.toString());
    }, [lineHeight, characterSpacing]);

    return {
        fontSize,
        fontStyle,
        textAlign,
        language,
        lineHeight,
        characterSpacing,
        setFontSize: setFontSizeState,
        setFontStyle: setFontStyleState,
        setTextAlign: setTextAlignState,
        setLanguage: setLanguageState,
        setLineHeight: setLineHeightState,
        setCharacterSpacing: setCharacterSpacingState,
        increaseFontSize: () => setFontSizeState((prev) => Math.min(prev + 2, MAX_FONT_SIZE)),
        decreaseFontSize: () => setFontSizeState((prev) => Math.max(prev - 2, MIN_FONT_SIZE)),
        resetFontSize: () => setFontSizeState(DEFAULT_FONT_SIZE),
    };
}
