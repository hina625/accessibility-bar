'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function ContrastToggle() {
  const { highContrast, toggleHighContrast, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  return (
    <button
      onClick={toggleHighContrast}
      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-[18px] font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${highContrast
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
        }`}
      aria-label={`${t.controls.contrast} ${highContrast ? t.controls.on : t.controls.off}`}
    >
      <span className="flex items-center gap-2">
        <svg
          className={`h-5 w-5 transition-colors ${highContrast ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
        {t.controls.contrast}
      </span>
      <span className={`text-[13px] font-bold uppercase ${highContrast ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
        {highContrast ? t.controls.on : t.controls.off}
      </span>
    </button>
  );
}
