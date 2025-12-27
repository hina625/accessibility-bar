'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function ReadingGuideToggle() {
  const { readingGuide, toggleReadingGuide, readingGuideColor, setReadingGuideColor, readingGuideThickness, setReadingGuideThickness, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  const colors = [
    { name: language === 'ur' ? 'سرخ' : language === 'ar' ? 'أحمر' : 'Red', value: '#ef4444' },
    { name: language === 'ur' ? 'پیلا' : language === 'ar' ? 'أصفر' : 'Yellow', value: '#eab308' },
    { name: language === 'ur' ? 'سبز' : language === 'ar' ? 'أخضر' : 'Green', value: '#22c55e' },
    { name: language === 'ur' ? 'نیلا' : language === 'ar' ? 'أزرق' : 'Blue', value: '#3b82f6' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor="reading-guide-toggle"
          className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
        >
          {t.controls.guide}
        </label>
        <button
          id="reading-guide-toggle"
          onClick={toggleReadingGuide}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${readingGuide ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          role="switch"
          aria-checked={readingGuide}
          aria-label={`${t.controls.guide} ${readingGuide ? t.controls.on : t.controls.off}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${readingGuide ? 'translate-x-6' : 'translate-x-1'
              }`}
          />
        </button>
      </div>

      {readingGuide && (
        <>
          <div className="space-y-2 pl-2">
            <label className="text-xs font-normal text-gray-500 dark:text-gray-400">{t.common.color}</label>
            <div className="flex space-x-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setReadingGuideColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${readingGuideColor === color.value
                    ? 'border-blue-500 scale-110 shadow-md'
                    : 'border-transparent hover:scale-105'
                    }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  aria-label={`${t.common.color}: ${color.name}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2 pl-2">
            <label className="text-xs font-normal text-gray-500 dark:text-gray-400">{t.common.thickness}</label>
            <div className="grid grid-cols-5 gap-1">
              {[2, 4, 6, 8, 10].map((th) => (
                <button
                  key={th}
                  onClick={() => setReadingGuideThickness(th)}
                  className={`py-1.5 text-xs rounded border transition-all ${readingGuideThickness === th
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400'
                    }`}
                  aria-label={`${t.common.thickness}: ${th}px`}
                >
                  {th}px
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

