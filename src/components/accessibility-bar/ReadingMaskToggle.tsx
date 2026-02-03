'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import InfoPopupButton from './InfoPopupButton';
import { translations } from '@/contexts/accessibility/translations';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function ReadingMaskToggle() {
  const { readingMask, toggleReadingMask, readingMaskColor, setReadingMaskColor, readingMaskSize, setReadingMaskSize, barTheme, language, audioPingEnabled } = useAccessibility();
  const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
  const t = translations[language] || translations['en'];

  const handleToggle = () => {
    if (audioPingEnabled) playAudioPing(readingMask ? 'deselect' : 'select');
    toggleReadingMask();
  };

  const colors = [
    { name: 'Black', value: 'rgba(0, 0, 0, 1)' },
    { name: 'Dark Gray', value: 'rgba(50, 50, 50, 1)' },
    { name: 'Purple', value: 'rgba(75, 0, 130, 1)' },
    { name: 'Blue', value: 'rgba(37, 99, 235, 1)' },
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
          <div className="flex items-center relative group">
            <span
              className="text-[16px] font-medium relative inline"
              style={{ color: theme.text }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
                e.currentTarget.style.textDecorationThickness = '2px';
                e.currentTarget.style.textUnderlineOffset = '2px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Reading Mask
            </span>
            <div onClick={(e) => e.stopPropagation()}>
              <InfoPopupButton
                title="Reading Mask"
                description={t.info?.reading?.features?.["Reading Mask"] || "Dims the screen except for a reading strip."}
              />
            </div>
          </div>
          <div
            className="w-[28px] h-[28px] rounded flex items-center justify-center transition-all ml-3"
            style={{
              backgroundColor: readingMask ? theme.active : 'rgba(255, 255, 255, 0.9)',
              border: readingMask ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            {readingMask && (
              <svg className="w-5 h-5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {readingMask && (
        <div className="space-y-4 pl-2">
          {/* Colors */}
          <div className="space-y-2">
            <label className="text-[14px] font-bold" style={{ color: theme.text }}>Colour</label>
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

          <div className="space-y-2">
            <label className="text-[14px] font-bold" style={{ color: theme.text }}>Size</label>
            <div className="flex space-x-2">
              {[
                { label: 'XL', value: 140 },
                { label: 'XLL', value: 240 }
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() => setReadingMaskSize(size.value)}
                  className={`flex-1 py-1 px-2 rounded border text-base font-bold transition-all`}
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
