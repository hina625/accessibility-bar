'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function TextAlignControl() {
  const { textAlign, setTextAlign, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[14px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
        <span className="w-1 h-3.5 bg-gray-900 dark:bg-gray-100 rounded-full"></span>
        {t.controls.textAlign}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setTextAlign('left')}
          className={`px-3 py-2 text-[14px] font-bold rounded-md transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 ${textAlign === 'left'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            }`}
          aria-label={`${t.controls.alignLeft} ${t.controls.textAlign}`}
        >
          {t.controls.alignLeft}
        </button>
        <button
          onClick={() => setTextAlign('center')}
          className={`px-3 py-2 text-[14px] font-bold rounded-md transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 ${textAlign === 'center'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            }`}
          aria-label={`${t.controls.alignCenter} ${t.controls.textAlign}`}
        >
          {t.controls.alignCenter}
        </button>
        <button
          onClick={() => setTextAlign('right')}
          className={`px-3 py-2 text-[14px] font-bold rounded-md transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 ${textAlign === 'right'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            }`}
          aria-label={`${t.controls.alignRight} ${t.controls.textAlign}`}
        >
          {t.controls.alignRight}
        </button>
        <button
          onClick={() => setTextAlign('justify')}
          className={`px-3 py-2 text-[14px] font-bold rounded-md transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 ${textAlign === 'justify'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            }`}
          aria-label={`${t.controls.alignJustify} ${t.controls.textAlign}`}
        >
          {t.controls.alignJustify}
        </button>
      </div>
    </div>
  );
}

