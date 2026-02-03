'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

interface FontFeaturesInfoProps {
    onClose: () => void;
}

export default function FontFeaturesInfo({ onClose }: FontFeaturesInfoProps) {
    const { barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    const fontInfo = [
        { font: 'Open Dyslexic', features: 'Weighted bottoms, unique letter shapes' },
        { font: 'Comic Sans', features: 'Irregular character shapes, distinct letterforms' },
        { font: 'Arial', features: 'Clean, evenly spaced, sans-serif' },
        { font: 'Verdana', features: 'Wide spacing, clear simplicity, sans-serif' },
        { font: 'Trebuchet MS', features: 'Strong visual contrast, broad characters' },
    ];

    return (
        <div className="absolute inset-0 z-[100] flex flex-col bg-white dark:bg-gray-900 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold" style={{ color: theme.text }}>Font Features</h3>
                <button
                    onClick={onClose}
                    className="p-2 pr-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                    style={{ color: theme.text }}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm font-bold tracking-wide">Exit</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr style={{ color: theme.text }}>
                            <th className="py-2 px-3 font-bold border-b border-gray-200 dark:border-gray-700">Font</th>
                            <th className="py-2 px-3 font-bold border-b border-gray-200 dark:border-gray-700">Features</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fontInfo.map((info, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="py-3 px-3 font-medium text-[16px] border-b border-gray-100 dark:border-gray-800" style={{ color: theme.text }}>
                                    {info.font}
                                </td>
                                <td className="py-3 px-3 text-[15px] border-b border-gray-100 dark:border-gray-800" style={{ color: theme.text, opacity: 0.8 }}>
                                    {info.features}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p className="mt-6 text-[14px] leading-relaxed" style={{ color: theme.text, opacity: 0.7 }}>
                    These fonts are widely supported across various platforms, making them an ideal choice for readability and accessibility needs.
                </p>
            </div>
        </div>
    );
}
