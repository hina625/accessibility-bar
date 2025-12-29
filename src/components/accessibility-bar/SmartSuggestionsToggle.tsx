'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';

export default function SmartSuggestionsToggle() {
    const { smartSuggestions, toggleSmartSuggestions } = useAccessibility();

    return (
        <ToggleCheckbox
            id="smart-suggestions-toggle"
            label="Smart Suggestions"
            description="AI-powered suggestions"
            checked={smartSuggestions}
            onChange={toggleSmartSuggestions}
        />
    );
}
