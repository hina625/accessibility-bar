'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import Image from 'next/image';
import lineIcon from '@/assets/icons/line.png?inline';

export default function LineHeightControl() {
    const { lineHeight, setLineHeight, language, barTheme } = useAccessibility();
    const t = translations[language] || translations['en'];
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    const control = {
        value: lineHeight,
        setter: setLineHeight,
        resetValue: 1.0,
        min: 0.5,
        max: 2.5,
        step: 0.1,
        isMin: lineHeight <= 0.5,
        isMax: lineHeight >= 2.5
    };

    const handleAdjust = (setter: (v: number) => void, current: number, delta: number, min: number, max: number) => {
        setter(Number(Math.max(min, Math.min(max, current + delta)).toFixed(2)));
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <p className="text-[16px] font-normal leading-relaxed mb-4" style={{ color: theme.text }}>
                Click or tap the minus (-) or plus (+) button signs below to increase the line height of the website page.<br />
                <br /> Click the reset button to clear your selection or to start over again.
            </p>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => handleAdjust(control.setter, control.value, -control.step, control.min, control.max)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
                    style={{
                        backgroundColor: theme.active,
                        color: theme.text,
                        opacity: control.isMin ? 0.5 : 1,
                        cursor: control.isMin ? 'not-allowed' : 'pointer'
                    }}
                    aria-label={`Decrease Line Height`}
                    disabled={control.isMin}
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                    </svg>
                </button>
                <div
                    className="flex-1 text-center py-2 font-bold text-[18px] transition-colors"
                    style={{
                        color: theme.text
                    }}
                >
                    {control.value.toFixed(1)}x
                </div>
                <button
                    onClick={() => handleAdjust(control.setter, control.value, control.step, control.min, control.max)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
                    style={{
                        backgroundColor: theme.active,
                        color: theme.text,
                        opacity: control.isMax ? 0.5 : 1,
                        cursor: control.isMax ? 'not-allowed' : 'pointer'
                    }}
                    aria-label={`Increase Line Height`}
                    disabled={control.isMax}
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
                <button
                    onClick={() => control.setter(control.resetValue)}
                    className="px-4 py-2 text-[16px] font-bold rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
                    style={{ backgroundColor: theme.active, color: theme.text }}
                    aria-label={`Reset Line Height`}
                >
                    {t.common.reset}
                </button>
            </div>
        </div>
    );
}
