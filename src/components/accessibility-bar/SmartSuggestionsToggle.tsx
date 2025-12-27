'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import Image from 'next/image';
import { translations } from '@/contexts/accessibility/translations';

export default function SmartSuggestionsToggle() {
    const { smartSuggestions, toggleSmartSuggestions, language } = useAccessibility();
    const t = translations[language] || translations['en'];

    return (
        <button
            onClick={toggleSmartSuggestions}
            className={`flex items-center justify-between w-full p-3 rounded-xl transition-all border ${smartSuggestions
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${smartSuggestions ? 'bg-purple-100 dark:bg-purple-900/40' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <Image
                        src="/tools.png"
                        alt=""
                        width={24}
                        height={24}
                        className={smartSuggestions ? 'opacity-100' : 'opacity-70'}
                    />
                </div>
                <div className="flex flex-col items-start">
                    <span className={`font-medium ${smartSuggestions ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        Smart Suggestions
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Intelligent shortcuts
                    </span>
                </div>
            </div>

            <div className={`w-10 h-6 rounded-full transition-colors relative ${smartSuggestions ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${smartSuggestions ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </button>
    );
}
