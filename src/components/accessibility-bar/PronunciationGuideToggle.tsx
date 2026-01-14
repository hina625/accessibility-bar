'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import ToggleCheckbox from './ToggleCheckbox';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function PronunciationGuideToggle() {
    const { pronunciationGuide, togglePronunciationGuide, audioPingEnabled, barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    const handleToggle = () => {
        if (audioPingEnabled) playAudioPing(pronunciationGuide ? 'deselect' : 'select');
        togglePronunciationGuide();
    };

    return (
        <div className="space-y-2">
            <ToggleCheckbox
                id="pronunciation-guide-toggle"
                label="Pronunciation Guide"
                description="Get pronunciation help for words. Highlight any word to hear an audio pronunciation of it"
                checked={pronunciationGuide}
                onChange={handleToggle}
            />
            <p className="text-[14px] px-4" style={{ color: theme.text, opacity: 0.7 }}>
                Highlight any word to hear an audio pronunciation of it
            </p>
        </div>
    );
}
