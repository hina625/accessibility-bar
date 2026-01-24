import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import ToggleCheckbox from './ToggleCheckbox';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function SmartSuggestionsToggle() {
    const { smartSuggestions, toggleSmartSuggestions, audioPingEnabled, barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    const handleChange = () => {
        if (audioPingEnabled) playAudioPing(smartSuggestions ? 'deselect' : 'select');
        toggleSmartSuggestions();
    };

    return (
        <div className="space-y-2">
            <ToggleCheckbox
                id="smart-suggestions-toggle"
                label="Smart Suggestions"
                description="Get AI-powered accessibility suggestions based on your browsing needs"
                checked={smartSuggestions}
                onChange={handleChange}
            />
            <p className="text-[14px] px-4" style={{ color: theme.text, opacity: 0.7 }}>
                Get AI-powered accessibility suggestions based on your browsing needs
            </p>
        </div>
    );
}
