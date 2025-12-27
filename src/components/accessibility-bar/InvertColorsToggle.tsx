'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function InvertColorsToggle() {
  const { invertColors, toggleInvertColors, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  return (
    <button
      onClick={toggleInvertColors}
      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-[18px] font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${invertColors
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
        }`}
      aria-label={`${t.controls.invert} ${invertColors ? t.controls.on : t.controls.off}`}
    >
      <span className="flex items-center gap-2">
        <svg
          className={`h-5 w-5 transition-colors ${invertColors ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
        {t.controls.invert}
      </span>
      <span className={`text-[13px] font-bold uppercase ${invertColors ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
        {invertColors ? t.controls.on : t.controls.off}
      </span>
    </button>
  );
}
