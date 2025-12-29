'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

const THEME_OPTIONS: { id: BarTheme; label: string }[] = [
    { id: 'white', label: 'White' },
    { id: 'black', label: 'Black' },
    { id: 'purple', label: 'Purple' },
    { id: 'yellow', label: 'Yellow' },
    { id: 'orange', label: 'Orange' },
    { id: 'deepBlue', label: 'Navy' },
];

export default function ThemeSelector() {
    const { barTheme, setBarTheme } = useAccessibility();
    const currentTheme = BAR_THEMES[barTheme];

    return (
        <div className="space-y-4">
            <h3 className="text-[14px] font-bold uppercase tracking-tight" style={{ color: currentTheme.text }}>
                Colour Theme
            </h3>
            <div className="grid grid-cols-3 gap-3">
                {THEME_OPTIONS.map((themeOption) => {
                    const optionTheme = BAR_THEMES[themeOption.id];
                    const isSelected = barTheme === themeOption.id;
                    return (
                        <button
                            key={themeOption.id}
                            onClick={() => setBarTheme(themeOption.id)}
                            className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-300
                                ${isSelected ? 'scale-110 shadow-lg' : 'hover:scale-105'}
                            `}
                            style={{
                                borderColor: isSelected ? currentTheme.active : 'transparent',
                                backgroundColor: isSelected ? `${currentTheme.active}22` : currentTheme.hover,
                            }}
                            title={themeOption.label}
                        >
                            <div
                                className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transform transition-transform group-hover:rotate-12"
                                style={{
                                    backgroundColor: optionTheme.background,
                                    borderColor: optionTheme.border,
                                    color: optionTheme.text
                                }}
                            >
                                <span className="text-sm font-bold">A</span>

                                {isSelected && (
                                    <div
                                        className="absolute inset-0 rounded-full flex items-center justify-center bg-black/10 animate-in fade-in duration-300"
                                    >
                                        <svg className="w-5 h-5 text-white filter drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <span className="text-[14px] mt-1.5 font-bold uppercase tracking-tight" style={{ color: currentTheme.text, opacity: isSelected ? 1 : 0.8 }}>
                                {themeOption.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
