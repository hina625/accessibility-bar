'use client';

import { useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

export default function PlainTextModeControl() {
    const {
        plainTextMode, togglePlainTextMode,
        plainTextSize, setPlainTextSize,
        barTheme
    } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    const labelRef = useRef<HTMLSpanElement>(null);

    return (
        <div className="space-y-4">
            {/* Main Toggle */}
            <div
                className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
                style={{ backgroundColor: theme.hover }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.active;
                    if (labelRef.current) {
                        labelRef.current.style.textDecoration = 'underline';
                        labelRef.current.style.textDecorationThickness = '2px';
                        labelRef.current.style.textUnderlineOffset = '2px';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.hover;
                    if (labelRef.current) {
                        labelRef.current.style.textDecoration = 'none';
                    }
                }}
                onClick={() => togglePlainTextMode()}
            >
                <span
                    ref={labelRef}
                    className="text-[15px] font-medium relative inline"
                    style={{ color: theme.text }}
                >
                    Plain Text Mode
                </span>
                <div
                    className="w-[28px] h-[28px] rounded flex items-center justify-center transition-all ml-3"
                    style={{
                        backgroundColor: plainTextMode ? theme.active : 'rgba(255, 255, 255, 0.9)',
                        border: plainTextMode ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                >
                    {plainTextMode && (
                        <svg className="w-5 h-5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>

            {plainTextMode && (
                <div className="space-y-2 pl-2">
                    <label className="block text-[12px] font-normal" style={{ color: theme.text, opacity: 0.7 }}>
                        Text Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['small', 'medium', 'large'] as const).map((size) => (
                            <button
                                key={size}
                                onClick={() => setPlainTextSize(size)}
                                className="py-1.5 px-2 rounded-lg text-[14px] font-medium"
                                style={{
                                    backgroundColor: plainTextSize === size ? theme.active : theme.hover,
                                    color: theme.text
                                }}
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
