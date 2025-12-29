'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';

export default function MagnifierToggle() {
    const { magnifier, toggleMagnifier } = useAccessibility();

    return (
        <ToggleCheckbox
            id="magnifier-toggle"
            label="Magnifier"
            description="Zoom in on page content"
            checked={magnifier}
            onChange={toggleMagnifier}
        />
    );
}
