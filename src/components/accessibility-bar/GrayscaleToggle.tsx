'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function GrayscaleToggle() {
  const { grayscale, toggleGrayscale, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  return (
    <button
      onClick={toggleGrayscale}
      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-[18px] font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${grayscale
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
        }`}
      aria-label={`${t.controls.grayscale} ${grayscale ? t.controls.on : t.controls.off}`}
    >
      <span className="flex items-center gap-2">
        <svg
          className={`h-5 w-5 transition-colors ${grayscale ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        {t.controls.grayscale}
      </span>
      <span className={`text-[13px] font-bold uppercase ${grayscale ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
        {grayscale ? t.controls.on : t.controls.off}
      </span>
    </button>
  );
}
