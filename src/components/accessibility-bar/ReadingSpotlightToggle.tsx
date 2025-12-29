'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';

export default function ReadingSpotlightToggle() {
    const { readingSpotlight, toggleReadingSpotlight } = useAccessibility();

    return (
        <ToggleCheckbox
            id="reading-spotlight-toggle"
            label="Reading Spotlight"
            checked={readingSpotlight}
            onChange={toggleReadingSpotlight}
        />
    );
}
