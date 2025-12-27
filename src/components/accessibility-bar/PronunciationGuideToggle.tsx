'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function PronunciationGuideToggle() {
    const { pronunciationGuide, togglePronunciationGuide, language } = useAccessibility();
    const t = translations[language] || translations['en'];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label
                    htmlFor="pronunciation-toggle"
                    className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
                >
                    {t.controls.pronunciation}
                </label>
                <button
                    id="pronunciation-toggle"
                    onClick={togglePronunciationGuide}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${pronunciationGuide ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    role="switch"
                    aria-checked={pronunciationGuide}
                    aria-label={`${t.controls.pronunciation} ${pronunciationGuide ? (t.controls.on || 'ON') : (t.controls.off || 'OFF')}`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pronunciationGuide ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>

            <p className="text-[14px] text-gray-500 dark:text-gray-400 italic">
                {t.controls.selectToRead}
            </p>
        </div>
    );
}
