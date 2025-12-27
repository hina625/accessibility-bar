'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function FontSizeControls() {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[14px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
        <span className="w-1 h-3.5 bg-gray-900 dark:bg-gray-100 rounded-full"></span>
        {t.controls.fontSize}
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={decreaseFontSize}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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
        <span className="flex-1 text-center text-[18px] font-normal text-black dark:text-white">
          {fontSize}px
        </span>
        <button
          onClick={increaseFontSize}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-black transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
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
          className="px-3 py-1.5 text-[18px] font-normal rounded-md bg-gray-100 text-black transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          aria-label={t.common.reset}
        >
          {t.common.reset}
        </button>
      </div>
    </div>
  );
}
