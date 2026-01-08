'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import Image from 'next/image';
import spacingIcon from '@/assets/icons/capital-letter.png?inline';
import FeatureWrapper from './FeatureWrapper';

interface SpacingControlProps {
    highlightedFeature?: string | null;
}

export default function SpacingControl({ highlightedFeature }: SpacingControlProps) {
    const {
        characterSpacing, setCharacterSpacing,
        wordSpacing, setWordSpacing,
        language, barTheme
    } = useAccessibility();

    const t = translations[language] || translations['en'];
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    const controls = [
        {
            label: t.controls.wordSpacing,
            value: wordSpacing,
            setter: setWordSpacing,
            resetValue: 0,
            min: 0,
            max: 1,
            step: 0.05,
            isMin: wordSpacing <= 0,
            isMax: wordSpacing >= 1
        },
        {
            label: t.controls.charSpacing,
            value: characterSpacing,
            setter: setCharacterSpacing,
            resetValue: 0,
            min: 0,
            max: 1,
            step: 0.02,
            isMin: characterSpacing <= 0,
            isMax: characterSpacing >= 1
        }
    ];

    const handleAdjust = (setter: (v: number) => void, current: number, delta: number, min: number, max: number) => {
        setter(Number(Math.max(min, Math.min(max, current + delta)).toFixed(2)));
    };

    return (
        <div className="flex flex-col gap-4 w-full">


            {/* Word Spacing Section */}
            <FeatureWrapper featureId="word-spacing" highlightedFeature={highlightedFeature || null}>
                <div className="mt-0">
                    <div className="text-[20px] font-bold opacity-80 mb-6" style={{ color: theme.text }}>
                        {t.controls.wordSpacing}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleAdjust(setWordSpacing, wordSpacing, -0.05, 0, 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
                            style={{
                                backgroundColor: theme.active,
                                color: theme.text,
                                opacity: wordSpacing <= 0 ? 0.5 : 1,
                                cursor: wordSpacing <= 0 ? 'not-allowed' : 'pointer'
                            }}
                            aria-label={`Decrease word spacing`}
                            disabled={wordSpacing <= 0}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                            </svg>
                        </button>
                        <div
                            className="flex-1 text-center py-2 font-bold text-[18px] transition-colors"
                            style={{
                                color: theme.text
                            }}
                        >
                            {wordSpacing.toFixed(2)}
                        </div>
                        <button
                            onClick={() => handleAdjust(setWordSpacing, wordSpacing, 0.05, 0, 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
                            style={{
                                backgroundColor: theme.active,
                                color: theme.text,
                                opacity: wordSpacing >= 1 ? 0.5 : 1,
                                cursor: wordSpacing >= 1 ? 'not-allowed' : 'pointer'
                            }}
                            aria-label={`Increase word spacing`}
                            disabled={wordSpacing >= 1}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setWordSpacing(0)}
                            className="px-4 py-2 text-[16px] font-bold rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
                            style={{ backgroundColor: theme.active, color: theme.text }}
                            aria-label={`Reset word spacing`}
                        >
                            {t.common.reset}
                        </button>
                    </div>
                </div>
            </FeatureWrapper>

            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: theme.border }} />

            {/* Character Spacing Section */}
            <FeatureWrapper featureId="letter-spacing" highlightedFeature={highlightedFeature || null}>
                <div className="mt-0">
                    <div className="text-[20px] font-bold opacity-80 mb-6 whitespace-pre-line" style={{ color: theme.text }}>
                        {t.controls.charSpacing}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleAdjust(setCharacterSpacing, characterSpacing, -0.02, 0, 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
                            style={{
                                backgroundColor: theme.active,
                                color: theme.text,
                                opacity: characterSpacing <= 0 ? 0.5 : 1,
                                cursor: characterSpacing <= 0 ? 'not-allowed' : 'pointer'
                            }}
                            aria-label={`Decrease character spacing`}
                            disabled={characterSpacing <= 0}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                            </svg>
                        </button>
                        <div
                            className="flex-1 text-center py-2 font-bold text-[18px] transition-colors"
                            style={{
                                color: theme.text
                            }}
                        >
                            {characterSpacing.toFixed(2)}
                        </div>
                        <button
                            onClick={() => handleAdjust(setCharacterSpacing, characterSpacing, 0.02, 0, 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
                            style={{
                                backgroundColor: theme.active,
                                color: theme.text,
                                opacity: characterSpacing >= 1 ? 0.5 : 1,
                                cursor: characterSpacing >= 1 ? 'not-allowed' : 'pointer'
                            }}
                            aria-label={`Increase character spacing`}
                            disabled={characterSpacing >= 1}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setCharacterSpacing(0)}
                            className="px-4 py-2 text-[16px] font-bold rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
                            style={{ backgroundColor: theme.active, color: theme.text }}
                            aria-label={`Reset character spacing`}
                        >
                            {t.common.reset}
                        </button>
                    </div>
                </div>
            </FeatureWrapper>
        </div>
    );
}
