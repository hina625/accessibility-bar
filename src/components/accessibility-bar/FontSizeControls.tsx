'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

export default function FontSizeControls() {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize, language, barTheme } = useAccessibility();
  const t = translations[language] || translations['en'];
  const theme = BAR_THEMES[barTheme];

  return (
    <div className="space-y-2">
      <label className="block text-[16px] font-normal" style={{ color: theme.text }}>
        {t.controls.fontSize}
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={decreaseFontSize}
          className="flex h-9 w-9 items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2"
          style={{ backgroundColor: theme.active, color: theme.text }}
          aria-label={`${t.common.reset} ${t.controls.fontSize}`}
          disabled={fontSize <= 12}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="flex-1 text-center text-[16px] font-normal" style={{ color: theme.text }}>
          {fontSize}px
        </span>
        <button
          onClick={increaseFontSize}
          className="flex h-9 w-9 items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2"
          style={{ backgroundColor: theme.active, color: theme.text }}
          aria-label={`${t.common.reset} ${t.controls.fontSize}`}
          disabled={fontSize >= 32}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        <button
          onClick={resetFontSize}
          className="px-3 py-1.5 text-[16px] font-normal rounded-md transition-colors focus:outline-none focus:ring-2"
          style={{ backgroundColor: theme.active, color: theme.text }}
          aria-label={t.common.reset}
        >
          {t.common.reset}
        </button>
      </div>
    </div>
  );
}
