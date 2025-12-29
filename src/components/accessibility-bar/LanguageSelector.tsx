'use client';

import { useState, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', nativeName: 'اردو' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
];

export default function LanguageSelector() {
  const { language, setLanguage, barTheme, isMobile, panelPosition, realTimeTranslation, toggleRealTimeTranslation } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const theme = BAR_THEMES[barTheme];

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const selectedLang = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 w-full rounded-md text-[16px] font-normal focus:outline-none focus:ring-2"
        style={{ backgroundColor: theme.active, color: theme.text, border: `1px solid ${theme.border}` }}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{selectedLang.flag}</span>
        <span className="flex-1 text-left">{selectedLang.name}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute z-20 mt-1 ${isMobile ? 'min-w-[200px]' : 'w-full'} max-h-60 overflow-auto rounded-none shadow-lg scrollbar-hide [&::-webkit-scrollbar]:hidden`}
            style={{
              backgroundColor: theme.background,
              border: `1px solid ${theme.border}`,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              left: isMobile && (panelPosition === 'right' || panelPosition === 'bottom') ? 'auto' : 0,
              right: isMobile && (panelPosition === 'right' || panelPosition === 'bottom') ? 0 : 'auto'
            }}
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    if (lang.code !== 'en' && !realTimeTranslation) {
                      toggleRealTimeTranslation();
                    }
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm focus:outline-none"
                  style={{ backgroundColor: language === lang.code ? theme.active : 'transparent', color: theme.text }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = language === lang.code ? theme.active : 'transparent'}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="text-[16px] font-normal" style={{ color: theme.text }}>{lang.name}</div>
                    <div className="text-[13px] font-normal" style={{ color: theme.text, opacity: 0.7 }}>{lang.nativeName}</div>
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
        </>
      )}
    </div>
  );
}
