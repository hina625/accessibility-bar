'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function ReadingMaskToggle() {
  const { readingMask, toggleReadingMask, readingMaskColor, setReadingMaskColor, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  const colors = [
    { name: language === 'ur' ? 'سیاہ' : language === 'ar' ? 'أسود' : 'Black', value: 'rgba(0, 0, 0, 1)' },
    { name: language === 'ur' ? 'نیوی بلو' : language === 'ar' ? 'كحلي' : 'Navy', value: 'rgba(15, 23, 4 slate, 1)' }, // Modified to avoid conflict with blue
    { name: language === 'ur' ? 'گہرا سرمئی' : language === 'ar' ? 'رمادي غامق' : 'Deep Gray', value: 'rgba(31, 41, 55, 1)' },
    { name: language === 'ur' ? 'عنابی' : language === 'ar' ? 'ماروني' : 'Maroon', value: 'rgba(69, 10, 10, 1)' },
    { name: language === 'ur' ? 'گہرا بنفشی' : language === 'ar' ? 'أرجواني غامق' : 'Deep Purple', value: 'rgba(56, 18, 114, 1)' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label
          htmlFor="reading-mask-toggle"
          className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
        >
          {t.controls.mask}
        </label>
        <button
          id="reading-mask-toggle"
          onClick={toggleReadingMask}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${readingMask ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          role="switch"
          aria-checked={readingMask}
          aria-label={`${t.controls.mask} ${readingMask ? t.controls.on : t.controls.off}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${readingMask ? 'translate-x-6' : 'translate-x-1'
              }`}
          />
        </button>
      </div>

      {readingMask && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">{t.common.color}</span>
            <div className="flex flex-wrap gap-3 mt-1">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setReadingMaskColor(color.value)}
                  title={color.name}
                  aria-label={`${t.common.color}: ${color.name}`}
                  className={`w-8 h-8 rounded-full transition-all border-2 flex items-center justify-center ${readingMaskColor === color.value
                    ? 'border-blue-500 scale-110 shadow-md'
                    : 'border-transparent hover:scale-105'
                    }`}
                >
                  <div
                    className="w-full h-full rounded-full border border-black/10 shadow-inner"
                    style={{ backgroundColor: color.value }}
                  />
                  {readingMaskColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

