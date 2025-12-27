'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function LargeButtonsToggle() {
  const { largeButtons, toggleLargeButtons, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor="large-buttons-toggle"
        className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
      >
        {t.controls.buttons}
      </label>
      <button
        id="large-buttons-toggle"
        onClick={toggleLargeButtons}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${largeButtons ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        role="switch"
        aria-checked={largeButtons}
        aria-label={`${t.controls.buttons} ${largeButtons ? t.controls.on : t.controls.off}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${largeButtons ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );
}
