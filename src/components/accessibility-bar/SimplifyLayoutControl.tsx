'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';

export default function SimplifyLayoutControl() {
    const { simplifiedLayout, toggleSimplifiedLayout } = useAccessibility();

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
                <p className="text-[12px] text-gray-500 dark:text-gray-400 italic pl-2">
                    Layout has been simplified for easier reading.
                </p>
            )}
        </div>
    );
}
