'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type FontStyle = 'default' | 'dyslexic' | 'readable' | 'serif' | 'sans' | 'mono';
export type ColorBlindFilter = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface AccessibilityState {
  fontSize: number;
  fontStyle: FontStyle;
  highContrast: boolean;
  grayscale: boolean;
  invertColors: boolean;
  readingGuide: boolean;
  readingMask: boolean;
  reduceMotion: boolean;
  darkMode: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  textSpacing: number;
  cursorSize: number;
  cursorColor: string;
  pageZoom: number;
  colorBlindFilter: ColorBlindFilter;
  largeButtons: boolean;
  textToSpeech: boolean;
  speechToText: boolean;
  keyboardNavigation: boolean;
  onPageDictionary: boolean;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  language: string;
  textColor: string;
  headingColor: string;
  backgroundColor: string;
}

interface AccessibilityContextType extends AccessibilityState {
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  setFontStyle: (style: FontStyle) => void;
  toggleHighContrast: () => void;
  toggleGrayscale: () => void;
  toggleInvertColors: () => void;
  toggleReadingGuide: () => void;
  toggleReadingMask: () => void;
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
  setTextAlign: (align: 'left' | 'center' | 'right' | 'justify') => void;
  setLanguage: (lang: string) => void;
  setTextColor: (color: string) => void;
  setHeadingColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  resetAll: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 32;
const DEFAULT_TEXT_SPACING = 1;
const MIN_TEXT_SPACING = 0.5;
const MAX_TEXT_SPACING = 2.5;
const DEFAULT_CURSOR_SIZE = 1;
const MIN_CURSOR_SIZE = 1;
const MAX_CURSOR_SIZE = 3;
const DEFAULT_PAGE_ZOOM = 100;
const MIN_PAGE_ZOOM = 50;
const MAX_PAGE_ZOOM = 200;


const isInsideAccessibilityBar = (element: HTMLElement | null): boolean => {
  if (!element) return false;

  const shadowHost = document.getElementById('a11y-embed-host-react');
  if (shadowHost) {
    if (element === shadowHost || shadowHost.contains(element)) return true;
    const root = element.getRootNode();
    if (root instanceof ShadowRoot && root.host === shadowHost) return true;
  }

  // Also check for the identifying classes we added
  return !!element.closest('.accessibility-bar') ||
    !!element.closest('.a11y-embed-host') ||
    !!element.closest('[role="dialog"][aria-label="Accessibility options"]');
};

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<number>(DEFAULT_FONT_SIZE);
  const [fontStyle, setFontStyleState] = useState<FontStyle>('default');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [invertColors, setInvertColors] = useState<boolean>(false);
  const [readingGuide, setReadingGuide] = useState<boolean>(false);
  const [readingMask, setReadingMask] = useState<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [highlightLinks, setHighlightLinks] = useState<boolean>(false);
  const [highlightHeadings, setHighlightHeadings] = useState<boolean>(false);
  const [textSpacing, setTextSpacingState] = useState<number>(DEFAULT_TEXT_SPACING);
  const [cursorSize, setCursorSizeState] = useState<number>(DEFAULT_CURSOR_SIZE);
  const [cursorColor, setCursorColorState] = useState<string>('#000000');
  const [pageZoom, setPageZoomState] = useState<number>(DEFAULT_PAGE_ZOOM);
  const [colorBlindFilter, setColorBlindFilterState] = useState<ColorBlindFilter>('none');
  const [largeButtons, setLargeButtons] = useState<boolean>(false);
  const [textToSpeech, setTextToSpeech] = useState<boolean>(false);
  const [speechToText, setSpeechToText] = useState<boolean>(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState<boolean>(false);
  const [onPageDictionary, setOnPageDictionary] = useState<boolean>(false);
  const [textAlign, setTextAlignState] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [language, setLanguageState] = useState<string>('en');
  const [textColor, setTextColorState] = useState<string>('#000000');
  const [headingColor, setHeadingColorState] = useState<string>('#000000');
  const [backgroundColor, setBackgroundColorState] = useState<string>('');

  useEffect(() => {
    const saved = {
      fontSize: localStorage.getItem('accessibility-fontSize'),
      fontStyle: localStorage.getItem('accessibility-fontStyle'),
      highContrast: localStorage.getItem('accessibility-highContrast'),
      grayscale: localStorage.getItem('accessibility-grayscale'),
      invertColors: localStorage.getItem('accessibility-invertColors'),
      reduceMotion: localStorage.getItem('accessibility-reduceMotion'),
      darkMode: localStorage.getItem('accessibility-darkMode'),
      highlightLinks: localStorage.getItem('accessibility-highlightLinks'),
      highlightHeadings: localStorage.getItem('accessibility-highlightHeadings'),
      textSpacing: localStorage.getItem('accessibility-textSpacing'),
      cursorSize: localStorage.getItem('accessibility-cursorSize'),
      cursorColor: localStorage.getItem('accessibility-cursorColor'),
      pageZoom: localStorage.getItem('accessibility-pageZoom'),
      colorBlindFilter: localStorage.getItem('accessibility-colorBlindFilter'),
      largeButtons: localStorage.getItem('accessibility-largeButtons'),
      keyboardNavigation: localStorage.getItem('accessibility-keyboardNavigation'),
      onPageDictionary: localStorage.getItem('accessibility-onPageDictionary'),
      textAlign: localStorage.getItem('accessibility-textAlign'),
      language: localStorage.getItem('accessibility-language'),
      textColor: localStorage.getItem('accessibility-textColor'),
      headingColor: localStorage.getItem('accessibility-headingColor'),
    };

    if (saved.fontSize) setFontSize(Number(saved.fontSize));
    if (saved.fontStyle) setFontStyleState(saved.fontStyle as FontStyle);
    if (saved.highContrast === 'true') setHighContrast(true);
    if (saved.grayscale === 'true') setGrayscale(true);
    if (saved.invertColors === 'true') setInvertColors(true);
    if (saved.reduceMotion === 'true') setReduceMotion(true);
    if (saved.darkMode === 'true') setDarkMode(true);
    if (saved.highlightLinks === 'true') setHighlightLinks(true);
    if (saved.highlightHeadings === 'true') setHighlightHeadings(true);
    if (saved.textSpacing) setTextSpacingState(Number(saved.textSpacing));
    if (saved.cursorSize) setCursorSizeState(Number(saved.cursorSize));
    if (saved.cursorColor) setCursorColorState(saved.cursorColor);
    if (saved.pageZoom) setPageZoomState(Number(saved.pageZoom));
    if (saved.colorBlindFilter) setColorBlindFilterState(saved.colorBlindFilter as ColorBlindFilter);
    if (saved.largeButtons === 'true') setLargeButtons(true);
    if (saved.keyboardNavigation === 'true') setKeyboardNavigation(true);
    if (saved.onPageDictionary === 'true') setOnPageDictionary(true);
    if (saved.textAlign) setTextAlignState(saved.textAlign as 'left' | 'center' | 'right' | 'justify');
    if (saved.language) setLanguageState(saved.language);
  }, []);

  useEffect(() => {
    const content = document.getElementById('accessible-content');
    if (content) {
      (content as HTMLElement).style.fontSize = `${fontSize}px`;

      // Also apply to children to override potential site-specific styles
      const contentElements = content.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, span, article, section, main, aside, li, td, th, blockquote, a, button, input, textarea, select, label');
      contentElements.forEach((element) => {
        (element as HTMLElement).style.fontSize = `${fontSize}px`;
      });
    } else {
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
    }
    localStorage.setItem('accessibility-fontSize', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-style', fontStyle);
    localStorage.setItem('accessibility-fontStyle', fontStyle);
  }, [fontStyle]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('accessibility-highContrast', highContrast.toString());
  }, [highContrast]);

  useEffect(() => {
    if (grayscale) {
      document.documentElement.classList.add('grayscale-mode');
    } else {
      document.documentElement.classList.remove('grayscale-mode');
    }
    localStorage.setItem('accessibility-grayscale', grayscale.toString());
  }, [grayscale]);

  useEffect(() => {
    if (invertColors) {
      document.documentElement.classList.add('invert-colors');
    } else {
      document.documentElement.classList.remove('invert-colors');
    }
    localStorage.setItem('accessibility-invertColors', invertColors.toString());
  }, [invertColors]);

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('accessibility-reduceMotion', reduceMotion.toString());
  }, [reduceMotion]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      if (!backgroundColor) {
        setTextColorState('#FFFFFF');
        setHeadingColorState('#FFFFFF');
      }
    } else {
      document.documentElement.classList.remove('dark-mode');
      if (!backgroundColor) {
        setTextColorState('#000000');
        setHeadingColorState('#000000');
      }
    }
    localStorage.setItem('accessibility-darkMode', darkMode.toString());
  }, [darkMode, backgroundColor]);

  useEffect(() => {
    if (highlightLinks) {
      document.documentElement.classList.add('highlight-links');
    } else {
      document.documentElement.classList.remove('highlight-links');
    }
    localStorage.setItem('accessibility-highlightLinks', highlightLinks.toString());
  }, [highlightLinks]);

  useEffect(() => {
    if (highlightHeadings) {
      document.documentElement.classList.add('highlight-headings');
    } else {
      document.documentElement.classList.remove('highlight-headings');
    }
    localStorage.setItem('accessibility-highlightHeadings', highlightHeadings.toString());
  }, [highlightHeadings]);

  useEffect(() => {
    document.documentElement.style.setProperty('--text-spacing', `${textSpacing}rem`);

    const applySpacing = (root: HTMLElement | Document) => {
      const contentElements = root.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, span, article, section, main, aside, li, td, th, blockquote, a, button, input, textarea, select, label, header, footer, nav');
      contentElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (!isInsideAccessibilityBar(htmlElement)) {
          htmlElement.style.lineHeight = `${1.5 * textSpacing}`;
          htmlElement.style.letterSpacing = `${0.05 * textSpacing}em`;
          htmlElement.style.wordSpacing = `${0.2 * textSpacing}em`;
        }
      });
    };

    const content = document.getElementById('accessible-content');
    if (content) {
      content.style.lineHeight = `${1.5 * textSpacing}`;
      content.style.letterSpacing = `${0.05 * textSpacing}em`;
      content.style.wordSpacing = `${0.2 * textSpacing}em`;
      applySpacing(content);
    } else {
      applySpacing(document);
      if (!isInsideAccessibilityBar(document.body)) {
        document.body.style.lineHeight = `${1.5 * textSpacing}`;
        document.body.style.letterSpacing = `${0.05 * textSpacing}em`;
        document.body.style.wordSpacing = `${0.2 * textSpacing}em`;
      }
    }

    localStorage.setItem('accessibility-textSpacing', textSpacing.toString());
  }, [textSpacing]);

  useEffect(() => {
    const baseSize = 24;
    const size = Math.round(baseSize * cursorSize);
    const color = cursorColor || '#000000';
    const encodedColor = color.replace('#', '%23');

    if (cursorSize > 1) {
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><path fill="${encodedColor}" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>`;
      const svgCursor = `data:image/svg+xml;utf8,${svgContent}`;

      let styleElement = document.getElementById('a11y-cursor-style') as HTMLStyleElement;
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'a11y-cursor-style';
        document.head.appendChild(styleElement);
      }

      styleElement.textContent = `
        .large-cursor body *:not(#a11y-embed-host-react):not(#a11y-embed-host-react *):not(.accessibility-bar):not(.accessibility-bar *) {
          cursor: url("${svgCursor}") ${Math.round(size / 2)} ${Math.round(size / 2)}, auto !important;
        }
        #a11y-embed-host-react,
        #a11y-embed-host-react *,
        .accessibility-bar,
        .accessibility-bar * {
          cursor: default !important;
        }
      `;
      document.documentElement.classList.add('large-cursor');
    } else {
      document.documentElement.classList.remove('large-cursor');
      const styleElement = document.getElementById('a11y-cursor-style');
      if (styleElement) {
        styleElement.remove();
      }
    }
    localStorage.setItem('accessibility-cursorSize', cursorSize.toString());
    localStorage.setItem('accessibility-cursorColor', cursorColor);
  }, [cursorSize, cursorColor]);

  useEffect(() => {
    const content = document.getElementById('accessible-content');
    if (content) {
      (content as HTMLElement).style.zoom = `${pageZoom}%`;
      document.documentElement.style.removeProperty('zoom');
      document.body.style.removeProperty('zoom');
    } else {
      document.body.style.zoom = `${pageZoom}%`;
      document.documentElement.style.removeProperty('zoom');
    }
    localStorage.setItem('accessibility-pageZoom', pageZoom.toString());
  }, [pageZoom]);

  useEffect(() => {
    document.documentElement.setAttribute('data-color-blind', colorBlindFilter);
    localStorage.setItem('accessibility-colorBlindFilter', colorBlindFilter);

    if (colorBlindFilter !== 'none' && backgroundColor) {
      setBackgroundColorState('');
      setTextColorState('#000000');
      setHeadingColorState('#000000');
    }
  }, [colorBlindFilter, backgroundColor]);

  useEffect(() => {
    if (largeButtons) {
      document.documentElement.classList.add('large-buttons');
    } else {
      document.documentElement.classList.remove('large-buttons');
    }
    localStorage.setItem('accessibility-largeButtons', largeButtons.toString());
  }, [largeButtons]);

  useEffect(() => {
    if (keyboardNavigation) {
      document.documentElement.classList.add('keyboard-navigation');
    } else {
      document.documentElement.classList.remove('keyboard-navigation');
    }
    localStorage.setItem('accessibility-keyboardNavigation', keyboardNavigation.toString());
  }, [keyboardNavigation]);

  useEffect(() => {
    if (onPageDictionary) {
      document.documentElement.classList.add('on-page-dictionary');
    } else {
      document.documentElement.classList.remove('on-page-dictionary');
    }
    localStorage.setItem('accessibility-onPageDictionary', onPageDictionary.toString());
  }, [onPageDictionary]);

  useEffect(() => {
    const content = document.getElementById('accessible-content');
    if (content) {
      (content as HTMLElement).style.textAlign = textAlign;
      const textElements = content.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, span, article, section, main, aside, li, td, th, blockquote');
      textElements.forEach((element) => {
        (element as HTMLElement).style.textAlign = textAlign;
      });
    } else {
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, span, article, section, main, aside, li, td, th, blockquote');
      textElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (!isInsideAccessibilityBar(htmlElement)) {
          htmlElement.style.textAlign = textAlign;
        }
      });
    }
    localStorage.setItem('accessibility-textAlign', textAlign);
  }, [textAlign]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('accessibility-language', language);
  }, [language]);

  useEffect(() => {
    document.documentElement.style.setProperty('--text-color', textColor);

    const applyTextColor = (root: HTMLElement | Document) => {
      const textElements = root.querySelectorAll('p, span, div, li, td, th, label, a, button, input, textarea, select, article, section, aside, main, header, footer, nav, blockquote, cite, em, strong, small, sub, sup, code, pre, kbd, samp, var, mark, del, ins, abbr, dfn, time, address');
      textElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (!isInsideAccessibilityBar(htmlElement)) {
          htmlElement.style.color = textColor;
        }
      });
    };

    const content = document.getElementById('accessible-content');
    if (content) {
      content.style.color = textColor;
      applyTextColor(content);
    } else {
      applyTextColor(document);
      if (!isInsideAccessibilityBar(document.body)) {
        document.body.style.color = textColor;
      }
    }
    localStorage.setItem('accessibility-textColor', textColor);
  }, [textColor]);

  useEffect(() => {
    document.documentElement.style.setProperty('--heading-color', headingColor);

    const applyHeadingColor = (root: HTMLElement | Document) => {
      const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        const htmlHeading = heading as HTMLElement;
        if (!isInsideAccessibilityBar(htmlHeading)) {
          htmlHeading.style.color = headingColor;
        }
      });
    };

    const content = document.getElementById('accessible-content');
    if (content) {
      applyHeadingColor(content);
    } else {
      applyHeadingColor(document);
    }
    localStorage.setItem('accessibility-headingColor', headingColor);
  }, [headingColor]);

  const getContrastColor = (bgColor: string): string => {
    if (!bgColor) return '#000000';

    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  useEffect(() => {
    if (backgroundColor) {
      document.documentElement.style.setProperty('--background-color', backgroundColor);

      const applyBgColor = (root: HTMLElement | Document) => {
        const allElements = root.querySelectorAll('*');
        allElements.forEach((element) => {
          const htmlElement = element as HTMLElement;
          if (!isInsideAccessibilityBar(htmlElement)) {
            const tagName = htmlElement.tagName?.toLowerCase();
            if (tagName && !['script', 'style', 'meta', 'link', 'title', 'noscript'].includes(tagName)) {
              htmlElement.style.backgroundColor = backgroundColor;
            }
          }
        });
      };

      const content = document.getElementById('accessible-content');
      if (content) {
        content.style.backgroundColor = backgroundColor;
        applyBgColor(content);
      } else {
        document.body.style.backgroundColor = backgroundColor;
        applyBgColor(document);
      }
    } else {
      document.documentElement.style.removeProperty('--background-color');

      const removeBgColor = (root: HTMLElement | Document) => {
        const allElements = root.querySelectorAll('*');
        allElements.forEach((element) => {
          const htmlElement = element as HTMLElement;
          if (!isInsideAccessibilityBar(htmlElement)) {
            const tagName = htmlElement.tagName?.toLowerCase();
            if (tagName && !['script', 'style', 'meta', 'link', 'title', 'noscript'].includes(tagName)) {
              htmlElement.style.removeProperty('backgroundColor');
            }
          }
        });
      };

      const content = document.getElementById('accessible-content');
      if (content) {
        content.style.removeProperty('backgroundColor');
        removeBgColor(content);
      } else {
        document.body.style.removeProperty('backgroundColor');
        removeBgColor(document);
      }
    }
    localStorage.setItem('accessibility-backgroundColor', backgroundColor);
  }, [backgroundColor]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, MAX_FONT_SIZE));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, MIN_FONT_SIZE));
  };

  const resetFontSize = () => {
    setFontSize(DEFAULT_FONT_SIZE);
  };

  const setFontStyle = (style: FontStyle) => {
    setFontStyleState(style);
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  const toggleGrayscale = () => {
    setGrayscale((prev) => !prev);
  };

  const toggleInvertColors = () => {
    setInvertColors((prev) => !prev);
  };

  const toggleReadingGuide = () => {
    setReadingGuide((prev) => !prev);
  };

  const toggleReadingMask = () => {
    setReadingMask((prev) => !prev);
  };

  const toggleReduceMotion = () => {
    setReduceMotion((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const toggleHighlightLinks = () => {
    setHighlightLinks((prev) => !prev);
  };

  const toggleHighlightHeadings = () => {
    setHighlightHeadings((prev) => !prev);
  };

  const setTextSpacing = (spacing: number) => {
    setTextSpacingState(Math.max(MIN_TEXT_SPACING, Math.min(MAX_TEXT_SPACING, spacing)));
  };

  const setCursorSize = (size: number) => {
    setCursorSizeState(Math.max(MIN_CURSOR_SIZE, Math.min(MAX_CURSOR_SIZE, size)));
  };

  const setCursorColor = (color: string) => {
    setCursorColorState(color);
  };

  const setPageZoom = (zoom: number) => {
    setPageZoomState(Math.max(MIN_PAGE_ZOOM, Math.min(MAX_PAGE_ZOOM, zoom)));
  };

  const setColorBlindFilter = (filter: ColorBlindFilter) => {
    setColorBlindFilterState(filter);
  };

  const toggleLargeButtons = () => {
    setLargeButtons((prev) => !prev);
  };

  const toggleTextToSpeech = () => {
    setTextToSpeech((prev) => !prev);
  };

  const toggleSpeechToText = () => {
    setSpeechToText((prev) => !prev);
  };

  const toggleKeyboardNavigation = () => {
    setKeyboardNavigation((prev) => !prev);
  };

  const toggleOnPageDictionary = () => {
    setOnPageDictionary((prev) => !prev);
  };

  const setTextAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    setTextAlignState(align);
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
  };

  const setTextColor = (color: string) => {
    setTextColorState(color);
  };

  const setHeadingColor = (color: string) => {
    setHeadingColorState(color);
  };

  const setBackgroundColor = (color: string) => {
    setBackgroundColorState(color);
  };

  const resetAll = () => {
    setFontSize(DEFAULT_FONT_SIZE);
    setFontStyleState('default');
    setHighContrast(false);
    setGrayscale(false);
    setInvertColors(false);
    setReadingGuide(false);
    setReadingMask(false);
    setReduceMotion(false);
    setDarkMode(false);
    setHighlightLinks(false);
    setHighlightHeadings(false);
    setTextSpacingState(DEFAULT_TEXT_SPACING);
    setCursorSizeState(DEFAULT_CURSOR_SIZE);
    setCursorColorState('#000000');
    setPageZoomState(DEFAULT_PAGE_ZOOM);
    setColorBlindFilterState('none');
    setLargeButtons(false);
    setTextToSpeech(false);
    setSpeechToText(false);
    setKeyboardNavigation(false);
    setOnPageDictionary(false);
    setTextAlignState('left');
    setLanguageState('en');
    setBackgroundColorState('');
    setTextColorState('#000000');
    setHeadingColorState('#000000');

    setTimeout(() => {
      const allElements = document.querySelectorAll('*');
      allElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (!isInsideAccessibilityBar(htmlElement)) {
          htmlElement.style.removeProperty('color');
          htmlElement.style.removeProperty('backgroundColor');
          htmlElement.style.removeProperty('zoom');
        }
      });

      document.body.style.removeProperty('color');
      document.body.style.removeProperty('backgroundColor');
      document.body.style.removeProperty('zoom');
      document.documentElement.style.removeProperty('zoom');
      document.documentElement.style.removeProperty('--text-color');
      document.documentElement.style.removeProperty('--heading-color');
      document.documentElement.style.removeProperty('--background-color');

      const doc = document.documentElement;
      doc.classList.remove('high-contrast', 'grayscale-mode', 'invert-colors', 'reduce-motion', 'dark-mode', 'highlight-links', 'highlight-headings', 'large-cursor', 'large-buttons', 'keyboard-navigation', 'on-page-dictionary');
      doc.removeAttribute('data-font-style');
      doc.removeAttribute('data-color-blind');
      doc.removeAttribute('lang');
    }, 100);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('accessibility-')) keysToRemove.push(key);
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      }
    } catch (e) {

    }

    try {
      if (typeof window !== 'undefined') {

        setTimeout(() => {
          window.location.reload();
        }, 250);
      }
    } catch (e) {

    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        fontStyle,
        highContrast,
        grayscale,
        invertColors,
        readingGuide,
        readingMask,
        reduceMotion,
        darkMode,
        highlightLinks,
        highlightHeadings,
        textSpacing,
        cursorSize,
        cursorColor,
        pageZoom,
        colorBlindFilter,
        largeButtons,
        textToSpeech,
        speechToText,
        keyboardNavigation,
        onPageDictionary,
        textAlign,
        language,
        textColor,
        headingColor,
        backgroundColor,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        setFontStyle,
        toggleHighContrast,
        toggleGrayscale,
        toggleInvertColors,
        toggleReadingGuide,
        toggleReadingMask,
        toggleReduceMotion,
        toggleDarkMode,
        toggleHighlightLinks,
        toggleHighlightHeadings,
        setTextSpacing,
        setCursorSize,
        setCursorColor,
        setPageZoom,
        setColorBlindFilter,
        toggleLargeButtons,
        toggleTextToSpeech,
        toggleSpeechToText,
        toggleKeyboardNavigation,
        toggleOnPageDictionary,
        setTextAlign,
        setLanguage,
        setTextColor,
        setHeadingColor,
        setBackgroundColor,
        resetAll,
      }}
    >
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
