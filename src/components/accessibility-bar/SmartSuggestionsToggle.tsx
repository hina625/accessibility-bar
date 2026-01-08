import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function SmartSuggestionsToggle() {
    const { smartSuggestions, toggleSmartSuggestions, audioPingEnabled } = useAccessibility();

    const handleChange = () => {
        if (audioPingEnabled) playAudioPing(smartSuggestions ? 'deselect' : 'select');
        toggleSmartSuggestions();
    };

    return (
        <ToggleCheckbox
            id="smart-suggestions-toggle"
            label="Smart Suggestions"
            description="AI-powered suggestions"
            checked={smartSuggestions}
            onChange={handleChange}
        />
    );
}
