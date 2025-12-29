'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import ToggleCheckbox from './ToggleCheckbox';

export default function ReadingSpotlightToggle() {
    const { readingSpotlight, toggleReadingSpotlight, readingSpotlightBrightness, setReadingSpotlightBrightness, barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme];

    const brightnessOptions = [
        { label: 'Normal', value: 1.0 },
        { label: 'Bright', value: 1.25 },
        { label: 'Extra', value: 1.5 },
    ];

    return (
        <div className="space-y-4">
            <ToggleCheckbox
                id="reading-spotlight-toggle"
                label="Reading Spotlight"
                checked={readingSpotlight}
                onChange={toggleReadingSpotlight}
            />

            {readingSpotlight && (
                <div className="space-y-2 pl-2">
                    <label className="text-xs font-normal" style={{ color: theme.text, opacity: 0.7 }}>Brightness</label>
                    <div className="grid grid-cols-3 gap-2">
                        {brightnessOptions.map((option) => (
                            <button
                                key={option.label}
                                onClick={() => setReadingSpotlightBrightness(option.value)}
                                className={`p-1.5 rounded border transition-all text-[14px] ${readingSpotlightBrightness === option.value ? 'font-bold' : ''}`}
                                style={{
                                    borderColor: readingSpotlightBrightness === option.value ? theme.text : `${theme.text}33`,
                                    backgroundColor: readingSpotlightBrightness === option.value ? 'rgba(0,0,0,0.15)' : 'transparent',
                                    color: theme.text
                                }}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
