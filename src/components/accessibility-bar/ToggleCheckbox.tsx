'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

interface ToggleCheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
    description?: string;
}

export default function ToggleCheckbox({ id, label, checked, onChange, description }: ToggleCheckboxProps) {
    const { barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme];

    return (
        <div
            className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
            style={{ backgroundColor: theme.hover }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
            onClick={(e) => { e.stopPropagation(); onChange(); }}
        >
            <div className="flex flex-col flex-1">
                <span className="text-[16px] font-medium" style={{ color: theme.text }}>{label}</span>
            </div>
            <div
                className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
                style={{
                    backgroundColor: checked ? theme.active : 'rgba(255, 255, 255, 0.9)',
                    border: checked ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                }}
            >
                {checked && (
                    <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        </div>
    );
}
