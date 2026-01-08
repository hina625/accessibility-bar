'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

export default function TextSpacingControls() {
    const {
        lineHeight, setLineHeight,
        characterSpacing, setCharacterSpacing,
        wordSpacing, setWordSpacing,
        language, barTheme
    } = useAccessibility();

    const t = translations[language] || translations['en'];
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    const controls = [
        {
            label: t.controls.lineHeight,
            value: lineHeight,
            setter: setLineHeight,
            resetValue: 1,
            min: 0.5,
            max: 2.5,
            step: 0.1,
            unit: 'x',
            isMin: lineHeight <= 0.5,
            isMax: lineHeight >= 2.5
        },
        {
            label: t.controls.charSpacing,
            value: characterSpacing,
            setter: setCharacterSpacing,
            resetValue: 0,
            min: 0,
            max: 1,
            step: 0.02,
            unit: '',
            isMin: characterSpacing <= 0,
            isMax: characterSpacing >= 1
        },
        {
            label: t.controls.wordSpacing,
            value: wordSpacing,
            setter: setWordSpacing,
            resetValue: 0,
            min: 0,
            max: 1,
            step: 0.05,
            unit: '',
            isMin: wordSpacing <= 0,
            isMax: wordSpacing >= 1
        }
    ];

    const handleAdjust = (setter: (v: number) => void, current: number, delta: number, min: number, max: number) => {
        setter(Number(Math.max(min, Math.min(max, current + delta)).toFixed(2)));
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {controls.map((control) => (
                <div key={control.label} className="space-y-2">
                    <label className="block text-[16px] font-normal mb-2" style={{ color: theme.text }}>
                        {control.label}
                    </label>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleAdjust(control.setter, control.value, -control.step, control.min, control.max)}
                            className="flex h-9 w-9 items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2"
                            style={{ backgroundColor: theme.active, color: theme.text }}
                            aria-label={`Decrease ${control.label}`}
                            disabled={control.isMin}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>
                        <span className="flex-1 text-center text-[16px] font-normal" style={{ color: theme.text }}>
                            {control.value.toFixed(1)}
                        </span>
                        <button
                            onClick={() => handleAdjust(control.setter, control.value, control.step, control.min, control.max)}
                            className="flex h-9 w-9 items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2"
                            style={{ backgroundColor: theme.active, color: theme.text }}
                            aria-label={`Increase ${control.label}`}
                            disabled={control.isMax}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                        <button
                            onClick={() => control.setter(control.resetValue)}
                            className="px-3 py-1.5 text-[16px] font-normal rounded-md transition-colors focus:outline-none focus:ring-2"
                            style={{ backgroundColor: theme.active, color: theme.text }}
                            aria-label={`Reset ${control.label}`}
                        >
                            {t.common.reset}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
