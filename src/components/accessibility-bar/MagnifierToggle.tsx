'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import Image from 'next/image';
import { translations } from '@/contexts/accessibility/translations';

export default function MagnifierToggle() {
    const { magnifier, toggleMagnifier, language } = useAccessibility();
    const t = translations[language] || translations['en'];

    return (
        <button
            onClick={toggleMagnifier}
            className={`flex items-center justify-between w-full p-3 rounded-xl transition-all border ${magnifier
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${magnifier ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <Image
                        src="/contrast.png" // Using contrast icon temporarily or generic, ideally needs specific icon
                        alt=""
                        width={24}
                        height={24}
                        className={magnifier ? 'opacity-100' : 'opacity-70'}
                    />
                </div>
                <div className="flex flex-col items-start">
                    <span className={`font-medium ${magnifier ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        Magnify
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Zoom on hover
                    </span>
                </div>
            </div>

            <div className={`w-10 h-6 rounded-full transition-colors relative ${magnifier ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${magnifier ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </button>
    );
}
