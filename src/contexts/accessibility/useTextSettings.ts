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
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [userHasModified, setUserHasModified] = useState<boolean>(false);


    useEffect(() => {
        // Don't load from localStorage on initial mount - start with defaults
        // Styles will only be applied when user explicitly selects options
        const savedLanguage = localStorage.getItem('accessibility-language');
        if (savedLanguage) {
            setLanguageState(savedLanguage);
        }
        setIsInitialized(true);
    }, []);


    useEffect(() => {
        if (!isInitialized) return;

        // Check if any value differs from default
        const hasNonDefaultValues = fontSize !== DEFAULT_FONT_SIZE ||
            fontStyle !== 'default' ||
            textAlign !== 'left' ||
            lineHeight !== 1 ||
            characterSpacing !== 0 ||
            wordSpacing !== 0 ||
            language !== 'en-GB';

        // Only apply styles if user has explicitly modified settings or values are non-default
        if (userHasModified || hasNonDefaultValues) {
            if (fontSize !== DEFAULT_FONT_SIZE) {
                document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
            } else {
                document.documentElement.style.removeProperty('--font-size');
            }

            if (lineHeight !== 1) {
                document.documentElement.style.setProperty('--line-height', `${lineHeight}`);
            } else {
                document.documentElement.style.removeProperty('--line-height');
            }

            if (characterSpacing !== 0) {
                document.documentElement.style.setProperty('--letter-spacing', `${characterSpacing}em`);
            } else {
                document.documentElement.style.removeProperty('--letter-spacing');
            }

            if (wordSpacing !== 0) {
                document.documentElement.style.setProperty('--word-spacing', `${wordSpacing}em`);
            } else {
                document.documentElement.style.removeProperty('--word-spacing');
            }

            if (textAlign !== 'left') {
                document.documentElement.style.setProperty('--text-align', textAlign);
            } else {
                document.documentElement.style.removeProperty('--text-align');
            }

            if (fontStyle === 'default') {
                document.documentElement.removeAttribute('data-font-style');
            } else {
                document.documentElement.setAttribute('data-font-style', fontStyle);
            }
        } else {
            // Remove all styles if not modified by user
            document.documentElement.style.removeProperty('--font-size');
            document.documentElement.style.removeProperty('--line-height');
            document.documentElement.style.removeProperty('--letter-spacing');
            document.documentElement.style.removeProperty('--word-spacing');
            document.documentElement.style.removeProperty('--text-align');
            document.documentElement.removeAttribute('data-font-style');
        }

        localStorage.setItem('accessibility-fontSize', fontSize.toString());
        localStorage.setItem('accessibility-fontStyle', fontStyle);
        localStorage.setItem('accessibility-textAlign', textAlign);
        localStorage.setItem('accessibility-lineHeight', lineHeight.toString());
        localStorage.setItem('accessibility-characterSpacing', characterSpacing.toString());
        localStorage.setItem('accessibility-wordSpacing', wordSpacing.toString());
        localStorage.setItem('accessibility-language', language);
    }, [fontSize, fontStyle, textAlign, lineHeight, characterSpacing, wordSpacing, language, isInitialized, userHasModified]);

    return {
        fontSize,
        fontStyle,
        textAlign,
        language,
        lineHeight,
        characterSpacing,
        wordSpacing,
        setFontSize: (val: number) => {
            setFontSizeState(val);
            setUserHasModified(true);
        },
        setFontStyle: (val: FontStyle) => {
            setFontStyleState(val);
            setUserHasModified(true);
        },
        setTextAlign: (val: 'left' | 'center' | 'right' | 'justify') => {
            setTextAlignState(val);
            setUserHasModified(true);
        },
        setLanguage: (val: string) => {
            setLanguageState(val);
            setUserHasModified(true);
        },
        setLineHeight: (val: number) => {
            setLineHeightState(val);
            setUserHasModified(true);
        },
        setCharacterSpacing: (val: number) => {
            setCharacterSpacingState(val);
            setUserHasModified(true);
        },
        setWordSpacing: (val: number) => {
            setWordSpacingState(val);
            setUserHasModified(true);
        },
        increaseFontSize: () => {
            setFontSizeState((prev) => {
                const newVal = Math.min(prev + 2, MAX_FONT_SIZE);
                if (newVal !== prev) setUserHasModified(true);
                return newVal;
            });
        },
        decreaseFontSize: () => {
            setFontSizeState((prev) => {
                const newVal = Math.max(prev - 2, MIN_FONT_SIZE);
                if (newVal !== prev) setUserHasModified(true);
                return newVal;
            });
        },
        resetFontSize: () => {
            setFontSizeState(DEFAULT_FONT_SIZE);
            setUserHasModified(false);
        },
    };
}
