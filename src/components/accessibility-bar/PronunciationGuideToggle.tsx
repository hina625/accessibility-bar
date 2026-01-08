'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function PronunciationGuideToggle() {
    const { pronunciationGuide, togglePronunciationGuide, audioPingEnabled } = useAccessibility();

    const handleToggle = () => {
        if (audioPingEnabled) playAudioPing(pronunciationGuide ? 'deselect' : 'select');
        togglePronunciationGuide();
    };

    return (
        <ToggleCheckbox
            id="pronunciation-guide-toggle"
            label="Pronunciation Guide"
            description="Get pronunciation help for words"
            checked={pronunciationGuide}
            onChange={handleToggle}
        />
    );
}
