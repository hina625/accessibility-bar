'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

export default function ReadingMaskToggle() {
  const { readingMask, toggleReadingMask, readingMaskColor, setReadingMaskColor, readingMaskSize, setReadingMaskSize, barTheme } = useAccessibility();
  const theme = BAR_THEMES[barTheme];

  const colors = [
    { name: 'Black', value: 'rgba(0, 0, 0, 1)' },
    { name: 'Dark Gray', value: 'rgba(50, 50, 50, 1)' },
    { name: 'Purple', value: 'rgba(75, 0, 130, 1)' },
    { name: 'Blue', value: 'rgba(37, 99, 235, 1)' },
  ];

  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
        style={{ backgroundColor: theme.hover }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
        onClick={() => toggleReadingMask()}
      >
        <span className="text-[16px] font-medium" style={{ color: theme.text }}>Reading Mask</span>
        <div
          className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
          style={{
            backgroundColor: readingMask ? theme.active : 'rgba(255, 255, 255, 0.9)',
            border: readingMask ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          {readingMask && (
            <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      {readingMask && (
        <div className="space-y-4 pl-2">
          {/* Colors */}
          <div className="space-y-2">
            <label className="text-xs font-normal" style={{ color: theme.text, opacity: 0.7 }}>Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setReadingMaskColor(color.value)}
                  className={`w-full aspect-square rounded border-2 ${readingMaskColor === color.value ? 'ring-2' : ''}`}
                  style={{
                    backgroundColor: color.value,
                    borderColor: readingMaskColor === color.value ? theme.text : theme.border
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <label className="text-xs font-normal" style={{ color: theme.text, opacity: 0.7 }}>Size</label>
            <div className="flex space-x-2">
              {[
                { label: '1x', value: 140 },
                { label: '2x', value: 240 }
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() => setReadingMaskSize(size.value)}
                  className={`flex-1 py-1 px-2 rounded border text-sm transition-all ${readingMaskSize === size.value ? 'font-bold' : ''}`}
                  style={{
                    backgroundColor: readingMaskSize === size.value ? theme.active : 'transparent',
                    color: readingMaskSize === size.value ? '#FFF' : theme.text,
                    borderColor: theme.border
                  }}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
