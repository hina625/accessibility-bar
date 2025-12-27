'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function ReadingRulerToggle() {
    const { readingRuler, toggleReadingRuler, readingRulerColor, setReadingRulerColor, readingRulerWidth, setReadingRulerWidth, language } = useAccessibility();
    const t = translations[language] || translations['en'];

    const colors = [
        { name: language === 'ur' ? 'سرخ' : language === 'ar' ? 'أحمر' : 'Red', value: 'rgba(220, 38, 38, 0.8)' },
        { name: language === 'ur' ? 'پیلا' : language === 'ar' ? 'أصفر' : 'Yellow', value: 'rgba(234, 179, 8, 0.8)' },
        { name: language === 'ur' ? 'سبز' : language === 'ar' ? 'أخضر' : 'Green', value: 'rgba(22, 163, 74, 0.8)' },
        { name: language === 'ur' ? 'نیلا' : language === 'ar' ? 'أزرق' : 'Blue', value: 'rgba(37, 99, 235, 0.8)' },
    ];

    const widths = [40, 60, 80, 100, 120];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label
                    htmlFor="reading-ruler-toggle"
                    className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
                >
                    {t.controls.ruler}
                </label>
                <button
                    id="reading-ruler-toggle"
                    onClick={toggleReadingRuler}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${readingRuler ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    role="switch"
                    aria-checked={readingRuler}
                    aria-label={`${t.controls.ruler} ${readingRuler ? t.controls.on : t.controls.off}`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${readingRuler ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>

            {readingRuler && (
                <>
                    <div className="space-y-2">
                        <label className="text-xs font-normal text-gray-500 dark:text-gray-400">{t.common.color}</label>
                        <div className="grid grid-cols-4 gap-2 pl-1">
                            {colors.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => setReadingRulerColor(color.value)}
                                    className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${readingRulerColor === color.value ? 'border-blue-500 ring-2 ring-blue-300 shadow-sm' : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    style={{ backgroundColor: color.value.replace('0.8', '1') }}
                                    title={color.name}
                                    aria-label={`${t.common.color}: ${color.name}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-normal text-gray-500 dark:text-gray-400">{t.common.size}</label>
                        <div className="grid grid-cols-5 gap-1 pl-1">
                            {widths.map((w) => (
                                <button
                                    key={w}
                                    onClick={() => setReadingRulerWidth(w)}
                                    className={`py-1.5 text-xs rounded border transition-all ${readingRulerWidth === w
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400'
                                        }`}
                                    aria-label={`${t.common.size}: ${w}px`}
                                >
                                    {w}px
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
