'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

export default function FontSizeControls() {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize, language, barTheme } = useAccessibility();
  const t = translations[language] || translations['en'];
  const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

  return (
    <div className="space-y-2">
      <label className="block text-[16px] font-normal" style={{ color: theme.text }}>
        {t.controls.fontSize}
      </label>
      <div className="flex items-center gap-3">
        <button
          onClick={decreaseFontSize}
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
          style={{ backgroundColor: theme.active, color: theme.text }}
          aria-label={`${t.common.reset} ${t.controls.fontSize}`}
          disabled={fontSize <= 12}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
          </svg>
        </button>

        <span className="flex-1 text-center text-[18px] font-bold" style={{ color: theme.text }}>
          {fontSize}px
        </span>

        <button
          onClick={increaseFontSize}
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
          style={{ backgroundColor: theme.active, color: theme.text }}
          aria-label={`${t.common.reset} ${t.controls.fontSize}`}
          disabled={fontSize >= 32}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <button
          onClick={resetFontSize}
          className="px-4 py-2 text-[16px] font-bold rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
          style={{ backgroundColor: theme.active, color: theme.text }}
          aria-label={t.common.reset}
        >
          {t.common.reset}
        </button>
      </div>
    </div>
  );
}
