'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

import { BAR_THEMES } from '@/contexts/accessibility/theme';

export default function CursorSizeControl() {
  const { cursorSize, setCursorSize, cursorColor, setCursorColor, language, barTheme } = useAccessibility();
  const t = translations[language] || translations['en'];
  const currentTheme = BAR_THEMES[barTheme];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-[18px] font-normal text-white">
          {t.controls.cursor}
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((size) => (
            <button
              key={size}
              onClick={() => setCursorSize(size)}
              className="flex h-8 items-center justify-center rounded-md border-2 text-[18px] font-normal transition-all"
              style={cursorSize === size
                ? { borderColor: currentTheme.border, backgroundColor: currentTheme.active, color: currentTheme.text }
                : { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: 'white' }
              }
              aria-label={`${t.common.size}: ${size}x`}
            >
              {size}x
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[18px] font-normal text-white">
          {t.common.colour}
        </label>

        <div className="grid grid-cols-8 gap-1 mb-2">
          {['#000000', '#FF0000', '#0000FF', '#008000', '#FFFF00', '#FFA500', '#800080', '#FF00FF', '#00FFFF', '#FFFFFF', '#808080', '#A52A2A', '#00FF00', '#000080', '#800000', '#008080'].map((color) => (
            <button
              key={color}
              onClick={() => setCursorColor(color)}
              className="w-full aspect-square rounded border-2 transition-all hover:scale-110"
              style={{
                backgroundColor: color,
                borderColor: cursorColor === color ? currentTheme.border : 'rgba(255,255,255,0.2)',
                boxShadow: cursorColor === color ? `0 0 0 2px ${currentTheme.active}` : 'none'
              }}
              title={color}
              aria-label={`${t.common.colour}: ${color}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="color"
            value={cursorColor || '#000000'}
            onChange={(e) => setCursorColor(e.target.value)}
            className="w-9 h-9 rounded cursor-pointer border"
            style={{ borderColor: currentTheme.border }}
            aria-label={`${t.common.colour} picker`}
          />
          <input
            type="text"
            value={cursorColor || '#000000'}
            onChange={(e) => setCursorColor(e.target.value)}
            className="flex-1 px-2 py-1.5 text-[14px] font-normal rounded border"
            style={{
              borderColor: currentTheme.border,
              backgroundColor: currentTheme.background,
              color: currentTheme.text,
              maxWidth: '100px'
            }}
            placeholder="#000000"
          />
          <button
            onClick={() => setCursorColor('#000000')}
            className="px-3 py-1.5 text-[14px] font-bold rounded-md border transition-colors"
            style={{
              backgroundColor: currentTheme.background,
              color: currentTheme.text,
              borderColor: currentTheme.border
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = currentTheme.hover; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = currentTheme.background; }}
            aria-label={t.common.reset}
          >
            {t.common.reset}
          </button>
        </div>
      </div>
    </div>
  );
}
