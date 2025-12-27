'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function PlainTextModeControl() {
    const {
        plainTextMode, togglePlainTextMode,
        plainTextSize, setPlainTextSize
    } = useAccessibility();

    return (
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
                <label
                    htmlFor="plain-text-toggle"
                    className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
                >
                    Plain Text Mode
                </label>
                <button
                    id="plain-text-toggle"
                    onClick={togglePlainTextMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${plainTextMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    role="switch"
                    aria-checked={plainTextMode}
                    aria-label="Toggle plain text mode"
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${plainTextMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>

            {plainTextMode && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="block text-[14px] font-bold text-gray-700 dark:text-gray-400 uppercase">
                        Text Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['small', 'medium', 'large'] as const).map((size) => (
                            <button
                                key={size}
                                onClick={() => setPlainTextSize(size)}
                                className={`py-1.5 px-2 rounded-lg border text-[14px] font-medium transition-all ${plainTextSize === size
                                        ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                        : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                                    }`}
                            >
                                {size.charAt(0).toUpperCase() + size.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
