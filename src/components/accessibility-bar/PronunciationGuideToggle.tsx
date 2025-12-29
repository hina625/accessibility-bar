'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';

export default function PronunciationGuideToggle() {
    const { pronunciationGuide, togglePronunciationGuide } = useAccessibility();

    return (
        <ToggleCheckbox
            id="pronunciation-guide-toggle"
            label="Pronunciation Guide"
            description="Get pronunciation help for words"
            checked={pronunciationGuide}
            onChange={togglePronunciationGuide}
        />
    );
}
