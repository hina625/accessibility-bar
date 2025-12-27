'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function SimplifyLayoutControl() {
    const { simplifiedLayout, toggleSimplifiedLayout, language } = useAccessibility();
    const t = translations[language] || translations['en'];

    return (
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
                <label
                    htmlFor="simplify-layout-toggle"
                    className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
                >
                    {t.controls.simplifyLayout}
                </label>
                <button
                    id="simplify-layout-toggle"
                    onClick={toggleSimplifiedLayout}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${simplifiedLayout ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    role="switch"
                    aria-checked={simplifiedLayout}
                    aria-label={`${t.controls.simplifyLayout} ${simplifiedLayout ? t.controls.on : t.controls.off}`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${simplifiedLayout ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>
            {simplifiedLayout && (
                <p className="text-[14px] text-gray-500 dark:text-gray-400 italic animate-in fade-in slide-in-from-top-1">
                    {t.controls.simplifying}
                </p>
            )}
        </div>
    );
}
