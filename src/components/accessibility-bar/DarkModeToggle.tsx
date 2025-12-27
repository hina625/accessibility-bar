'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  return (
    <button
      onClick={toggleDarkMode}
      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-[18px] font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
        }`}
      aria-label={`${t.controls.darkMode} ${darkMode ? t.controls.on : t.controls.off}`}
    >
      <span className="flex items-center gap-2">
        <svg
          className={`h-5 w-5 transition-colors ${darkMode ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 0 008.354-5.646z"
          />
        </svg>
        {t.controls.darkMode}
      </span>
      <span className={`text-[13px] font-bold uppercase ${darkMode ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
        {darkMode ? t.controls.on : t.controls.off}
      </span>
    </button>
  );
}
