'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

export default function ReadingRulerToggle() {
    const { readingRuler, toggleReadingRuler, readingRulerColor, setReadingRulerColor, readingRulerWidth, setReadingRulerWidth, barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme];

    const colors = [
        { name: 'Red', value: 'rgba(220, 38, 38, 0.8)' },
        { name: 'Yellow', value: 'rgba(234, 179, 8, 0.8)' },
        { name: 'Green', value: 'rgba(22, 163, 74, 0.8)' },
        { name: 'Blue', value: 'rgba(37, 99, 235, 0.8)' },
    ];

    const widths = [40, 60, 80, 100, 120];

    return (
        <div className="space-y-4">
            <div
                className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
                style={{ backgroundColor: theme.hover }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                onClick={() => toggleReadingRuler()}
            >
                <span className="text-[16px] font-medium" style={{ color: theme.text }}>Reading Ruler</span>
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

            {readingRuler && (
                <>
                    <div className="space-y-2 pl-2">
                        <label className="text-xs font-normal" style={{ color: theme.text, opacity: 0.7 }}>Color</label>
                        <div className="grid grid-cols-4 gap-2">
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
                        <label className="text-xs font-normal" style={{ color: theme.text, opacity: 0.7 }}>Size</label>
                        <div className="grid grid-cols-5 gap-1">
                            {widths.map((w) => (
                                <button
                                    key={w}
                                    onClick={() => setReadingRulerWidth(w)}
                                    className="py-1.5 text-xs rounded"
                                    style={{
                                        backgroundColor: readingRulerWidth === w ? theme.active : theme.hover,
                                        color: theme.text
                                    }}
                                >
                                    {w}px
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
