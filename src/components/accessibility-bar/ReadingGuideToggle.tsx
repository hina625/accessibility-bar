'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

export default function ReadingGuideToggle() {
  const { readingGuide, toggleReadingGuide, readingGuideColor, setReadingGuideColor, readingGuideThickness, setReadingGuideThickness, barTheme } = useAccessibility();
  const theme = BAR_THEMES[barTheme];

  const colors = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
  ];

  const thicknesses = [2, 4, 6, 8, 10];

  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
        style={{ backgroundColor: theme.hover }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
        onClick={() => toggleReadingGuide()}
      >
        <span className="text-[16px] font-medium" style={{ color: theme.text }}>Reading Lines</span>
        <div
          className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
          style={{
            backgroundColor: readingGuide ? theme.active : 'rgba(255, 255, 255, 0.9)',
            border: readingGuide ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          {readingGuide && (
            <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      {readingGuide && (
        <>
          <div className="space-y-2 pl-2">
            <label className="text-xs font-normal" style={{ color: theme.text, opacity: 0.7 }}>Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setReadingGuideColor(color.value)}
                  className={`w-full aspect-square rounded border-2 ${readingGuideColor === color.value ? 'ring-2' : ''}`}
                  style={{
                    backgroundColor: color.value,
                    borderColor: readingGuideColor === color.value ? theme.text : theme.border
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2 pl-2">
            <label className="text-xs font-normal" style={{ color: theme.text, opacity: 0.7 }}>Thickness</label>
            <div className="grid grid-cols-5 gap-1">
              {thicknesses.map((th) => (
                <button
                  key={th}
                  onClick={() => setReadingGuideThickness(th)}
                  className="py-1.5 text-xs rounded"
                  style={{
                    backgroundColor: readingGuideThickness === th ? theme.active : theme.hover,
                    color: theme.text
                  }}
                >
                  {th}px
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
