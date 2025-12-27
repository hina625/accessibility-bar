'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function SelectToReadToggle() {
    const { ttsSelectAndRead, toggleTtsSelectAndRead } = useAccessibility();

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                <label
                    htmlFor="select-to-read-toggle"
                    className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
                >
                    Select to Read
                </label>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 -mt-1">
                    Click & Highlight nodes to hear them
                </span>
            </div>
            <button
                id="select-to-read-toggle"
                onClick={toggleTtsSelectAndRead}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${ttsSelectAndRead ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                role="switch"
                aria-checked={ttsSelectAndRead}
                aria-label="Toggle select to read mode"
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ttsSelectAndRead ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );
}
