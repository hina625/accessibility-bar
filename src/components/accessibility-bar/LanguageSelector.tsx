'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { SUPPORTED_LANGUAGES, Language } from '@/config/languages';

export default function LanguageSelector() {
  const { language, setLanguage, barTheme, isMobile, panelPosition, realTimeTranslation, toggleRealTimeTranslation } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    const handleScroll = (e: Event) => {
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
        return;
      }
      setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('scroll', handleScroll, true); // Use capture to detect modal scroll
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });
    }
  }, [isOpen]);

  const selectedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === language) || SUPPORTED_LANGUAGES[0];

  const handleSelect = (code: string) => {
    console.log('Language selected:', code);
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-3 w-full mx-auto rounded-md text-[16px] font-semibold focus:outline-none focus:ring-2"
        style={{ backgroundColor: theme.active, color: theme.text, border: `1px solid ${theme.border}` }}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <img
          src={`https://flagcdn.com/w40/${selectedLang.countryCode}.png`}
          srcSet={`https://flagcdn.com/w80/${selectedLang.countryCode}.png 2x`}
          width="24"
          height="18"
          alt=""
          className="rounded-sm object-cover"
          style={{ width: '24px', height: '18px' }}
        />
        <span className="flex-1 text-left">{selectedLang.name}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && mounted && createPortal(
        <>
          <div
            className="fixed inset-0 z-[2147483659] pointer-events-auto cursor-default"
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={dropdownRef}
            className="fixed z-[2147483660] mt-1 max-h-60 overflow-y-auto rounded-none shadow-2xl pointer-events-auto custom-scrollbar-hide"
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
              backgroundColor: theme.background,
              border: `1px solid ${theme.border}`,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="py-1">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm focus:outline-none"
                  style={{ backgroundColor: language === lang.code ? theme.active : 'transparent', color: theme.text }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = language === lang.code ? theme.active : 'transparent'}
                >
                  <img
                    src={`https://flagcdn.com/w40/${lang.countryCode}.png`}
                    srcSet={`https://flagcdn.com/w80/${lang.countryCode}.png 2x`}
                    width="24"
                    height="18"
                    alt=""
                    className="rounded-sm object-cover"
                    style={{ width: '24px', height: '18px' }}
                  />
                  <div className="flex-1 text-left">
                    <div className="text-[16px] font-semibold" style={{ color: theme.text }}>{lang.name}</div>
                    <div className="text-[14px] font-semibold" style={{ color: theme.text, opacity: 0.7 }}>{lang.nativeName}</div>
                  </div>
                  {language === lang.code && (
                    <svg className="h-5 w-5" style={{ color: theme.text }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>,
        document.querySelector('.a11y-embed-host')?.shadowRoot?.getElementById('a11y-react-root') ||
        document.getElementById('a11y-react-root') ||
        document.body
      )}
    </div>
  );
}
