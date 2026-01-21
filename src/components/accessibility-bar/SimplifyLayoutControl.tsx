'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import ToggleCheckbox from './ToggleCheckbox';

export default function SimplifyLayoutControl() {
    const { simplifiedLayout, toggleSimplifiedLayout, barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    return (
        <div className="space-y-4">
            <ToggleCheckbox
                id="simplify-layout-toggle"
                label="Simplify Layout"
                description="Removes complex visual elements"
                checked={simplifiedLayout}
                onChange={toggleSimplifiedLayout}
            />
            {simplifiedLayout && (
                <p
                    className="text-[16px] italic pl-2"
                    style={{ color: theme.text }}
                >
                    Layout has been simplified for easier reading.
                </p>
            )}
        </div>
    );
}
