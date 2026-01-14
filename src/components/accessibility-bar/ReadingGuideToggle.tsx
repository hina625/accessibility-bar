'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function ReadingGuideToggle() {
  const { readingGuide, toggleReadingGuide, readingGuideColor, setReadingGuideColor, readingGuideThickness, setReadingGuideThickness, barTheme, audioPingEnabled } = useAccessibility();
  const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

  const handleToggle = () => {
    if (audioPingEnabled) playAudioPing(readingGuide ? 'deselect' : 'select');
    toggleReadingGuide();
  };

  const colors = [
    { name: 'Red', value: '#b91c1c' }, // Darker Red
    { name: 'Yellow', value: '#a16207' }, // Darker Yellow
    { name: 'Green', value: '#15803d' }, // Darker Green
    { name: 'Blue', value: '#1d4ed8' }, // Darker Blue
    { name: 'Black', value: '#000000' },
  ];



  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
        style={{ backgroundColor: theme.hover }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
        onClick={handleToggle}
      >
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
          Reading Lines
        </span>
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
            <label className="text-[14px] font-bold" style={{ color: theme.text }}>Colour</label>
            <div className="grid grid-cols-5 gap-2">
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
            <label className="text-[14px] font-bold" style={{ color: theme.text }}>Thickness</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Thin', value: 2 },
                { label: 'Medium', value: 4 },
                { label: 'Large', value: 6 },
                { label: 'XL', value: 8 },
                { label: 'XXL', value: 10 }
              ].map((t) => (
                <button
                  key={t.label}
                  onClick={() => setReadingGuideThickness(t.value)}
                  className="h-8 flex items-center justify-center text-[12px] font-bold rounded text-center w-full px-1"
                  style={{
                    backgroundColor: readingGuideThickness === t.value ? theme.active : theme.hover,
                    color: theme.text
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
