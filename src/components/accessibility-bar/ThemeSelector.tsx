'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

const DARK_THEMES: { id: BarTheme; label: string }[] = [
    { id: 'black', label: 'Black' },
    { id: 'navy', label: 'Navy' },
    { id: 'grayscale', label: 'Grey Scale' },
    { id: 'purple', label: 'Purple' },
    { id: 'oceanBlue', label: 'Ocean Blue' },
    { id: 'pink', label: 'Pink' },
];

const LIGHT_THEMES: { id: BarTheme; label: string }[] = [
    { id: 'white', label: 'White' },
    { id: 'yellow', label: 'Yellow' },
    { id: 'Turquoise', label: 'Tquoise' },
    { id: 'pink', label: 'Pink' },
];

export default function ThemeSelector() {
    const { barTheme, setBarTheme } = useAccessibility();

    const currentTheme = BAR_THEMES[barTheme] || BAR_THEMES.purple;

    const renderThemeButton = (themeOption: { id: BarTheme; label: string }) => {
        const optionTheme = BAR_THEMES[themeOption.id] || BAR_THEMES.purple;
        const isSelected = barTheme === themeOption.id;
        return (
            <button
                key={themeOption.id}
                onClick={() => setBarTheme(themeOption.id)}
                className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300
                    ${isSelected ? 'scale-110 shadow-lg' : 'hover:scale-[1.03] shadow-sm'}
                `}
                style={{
                    borderColor: isSelected ? optionTheme.active : currentTheme.border,
                    backgroundColor: isSelected ? `${optionTheme.active}30` : `${currentTheme.text}08`,
                }}
                title={themeOption.label}
            >
                <div
                    className="w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-sm transform transition-transform group-hover:rotate-12 mb-2"
                    style={{
                        backgroundColor: optionTheme.background,
                        borderColor: optionTheme.border,
                        color: optionTheme.text
                    }}
                >
                    <span className="text-xl font-bold">A</span>

                    {isSelected && (
                        <div
                            className="absolute inset-0 rounded-full flex items-center justify-center bg-black/10 animate-in fade-in duration-300"
                        >
                            <svg className="w-6 h-6 text-white filter drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>

                <span className="text-[14px] font-bold tracking-tight text-center leading-tight" style={{ color: currentTheme.text, opacity: isSelected ? 1 : 0.9 }}>
                    {themeOption.label}
                </span>
            </button>
        );
    };

    return (
        <div className="space-y-4">
            <h3 className="text-[18px] font-bold tracking-wide mb-2" style={{ color: currentTheme.text }}>
                6. Colour
            </h3>


            <div className="space-y-2">
                <h4 className="text-[16px] font-bold tracking-wide" style={{ color: currentTheme.text }}>
                    Dark
                </h4>
                <div className="grid grid-cols-3 gap-2">
                    {DARK_THEMES.map(renderThemeButton)}
                </div>
            </div>

            {/* Light Themes Section */}
            <div className="space-y-2">
                <h4 className="text-[16px] font-bold tracking-wide" style={{ color: currentTheme.text }}>
                    Light
                </h4>
                <div className="grid grid-cols-3 gap-2">
                    {LIGHT_THEMES.map(renderThemeButton)}
                </div>
            </div>
        </div>
    );
}
