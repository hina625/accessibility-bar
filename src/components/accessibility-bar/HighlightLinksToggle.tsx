'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function HighlightLinksToggle() {
  const { highlightLinks, toggleHighlightLinks, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor="highlight-links-toggle"
        className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
      >
        {t.controls.links}
      </label>
      <button
        id="highlight-links-toggle"
        onClick={toggleHighlightLinks}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${highlightLinks ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        role="switch"
        aria-checked={highlightLinks}
        aria-label={`${t.controls.links} ${highlightLinks ? t.controls.on : t.controls.off}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${highlightLinks ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );
}

