'use client';

import React from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

interface ToggleCheckboxProps {
    id: string;
    label: string | React.ReactNode;
    checked: boolean;
    onChange: () => void;
    description?: string;
    labelClassName?: string;
}

export default function ToggleCheckbox({ id, label, checked, onChange, description, labelClassName }: ToggleCheckboxProps) {
    const { barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    return (
        <div
            className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
            style={{ backgroundColor: theme.hover }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
            onClick={(e) => { e.stopPropagation(); onChange(); }}
        >
            <div className="flex flex-col flex-1">
                <span
                    className={labelClassName || "text-[16px] font-semibold relative inline"}
                    style={{ color: theme.text }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline';
                        e.currentTarget.style.textDecorationThickness = '2px';
                        e.currentTarget.style.textUnderlineOffset = '2px';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none';
                    }}
                >
                    {label}
                </span>
            </div>
            <div
                className="w-[28px] h-[28px] rounded flex items-center justify-center transition-all ml-3"
                style={{
                    backgroundColor: checked ? theme.active : 'rgba(255, 255, 255, 0.9)',
                    border: checked ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                    transform: checked ? 'scale(1.2)' : 'scale(1)'
                }}
            >
                {checked && (
                    <svg className="w-5 h-5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        </div>
    );
}
