'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import InfoPopupButton from './InfoPopupButton';
import { translations } from '@/contexts/accessibility/translations';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function ReadingRulerToggle() {
    const { readingRuler, toggleReadingRuler, readingRulerColor, setReadingRulerColor, readingRulerWidth, setReadingRulerWidth, barTheme, language, audioPingEnabled } = useAccessibility();
    const theme = BAR_THEMES[barTheme];
    const t = translations[language] || translations['en'];

    const handleToggle = () => {
        if (audioPingEnabled) playAudioPing(readingRuler ? 'deselect' : 'select');
        toggleReadingRuler();
    };

    const colors = [
        { name: 'Red', value: 'rgba(220, 38, 38, 1)' },
        { name: 'Yellow', value: 'rgba(234, 179, 8, 1)' },
        { name: 'Green', value: 'rgba(22, 163, 74, 1)' },
        { name: 'Blue', value: 'rgba(37, 99, 235, 1)' },
        { name: 'Black', value: 'rgba(0, 0, 0, 1)' },
    ];



    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div
                    className="flex-1 flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
                    style={{ backgroundColor: theme.hover }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                    onClick={handleToggle}
                >
                    <div className="flex items-center">
                        <span className="text-[16px] font-medium" style={{ color: theme.text }}>Reading Ruler</span>
                        <div onClick={(e) => e.stopPropagation()}>
                            <InfoPopupButton
                                title="Reading Ruler"
                                description={t.info?.reading?.features?.["Reading Ruler"] || "A horizontal line to help track your reading position."}
                            />
                        </div>
                    </div>
                    <div
                        className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
                        style={{
                            backgroundColor: readingRuler ? theme.active : 'rgba(255, 255, 255, 0.9)',
                            border: readingRuler ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                        }}
                    >
                        {readingRuler && (
                            <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>

            {readingRuler && (
                <>
                    <div className="space-y-2 pl-2">
                        <label className="text-[14px] font-bold" style={{ color: theme.text }}>Colour</label>
                        <div className="grid grid-cols-5 gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => setReadingRulerColor(color.value)}
                                    className={`w-full aspect-square rounded border-2 ${readingRulerColor === color.value ? 'ring-2' : ''}`}
                                    style={{
                                        backgroundColor: color.value.replace('0.8', '1'),
                                        borderColor: readingRulerColor === color.value ? theme.text : theme.border
                                    }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 pl-2">
                        <label className="text-[14px] font-bold" style={{ color: theme.text }}>Size</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Small', value: 40 },
                                { label: 'Medium', value: 60 },
                                { label: 'Large', value: 80 },
                                { label: 'XL', value: 100 },
                                { label: 'XXL', value: 120 }
                            ].map((s) => (
                                <button
                                    key={s.label}
                                    onClick={() => setReadingRulerWidth(s.value)}
                                    className="h-8 flex items-center justify-center text-[12px] font-bold rounded text-center w-full px-1"
                                    style={{
                                        backgroundColor: readingRulerWidth === s.value ? theme.active : theme.hover,
                                        color: theme.text
                                    }}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
