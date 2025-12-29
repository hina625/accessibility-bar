'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

export default function TextAlignControl() {
  const { textAlign, setTextAlign, language, barTheme } = useAccessibility();
  const t = translations[language] || translations['en'];
  const theme = BAR_THEMES[barTheme];

  const getButtonStyle = (align: string) => ({
    backgroundColor: textAlign === align ? theme.active : theme.hover,
    color: theme.text,
  });

  return (
    <div className="space-y-2">
      <label className="block text-[16px] font-normal" style={{ color: theme.text }}>
        {t.controls.textAlign}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setTextAlign('left')}
          className="px-3 py-2 text-[16px] font-bold rounded-md transition-colors whitespace-nowrap focus:outline-none focus:ring-2"
          style={getButtonStyle('left')}
          aria-label={`${t.controls.alignLeft} ${t.controls.textAlign}`}
        >
          {t.controls.alignLeft}
        </button>
        <button
          onClick={() => setTextAlign('center')}
          className="px-3 py-2 text-[16px] font-bold rounded-md transition-colors whitespace-nowrap focus:outline-none focus:ring-2"
          style={getButtonStyle('center')}
          aria-label={`${t.controls.alignCentre} ${t.controls.textAlign}`}
        >
          {t.controls.alignCentre}
        </button>
        <button
          onClick={() => setTextAlign('right')}
          className="px-3 py-2 text-[16px] font-bold rounded-md transition-colors whitespace-nowrap focus:outline-none focus:ring-2"
          style={getButtonStyle('right')}
          aria-label={`${t.controls.alignRight} ${t.controls.textAlign}`}
        >
          {t.controls.alignRight}
        </button>
        <button
          onClick={() => setTextAlign('justify')}
          className="px-3 py-2 text-[16px] font-bold rounded-md transition-colors whitespace-nowrap focus:outline-none focus:ring-2"
          style={getButtonStyle('justify')}
          aria-label={`${t.controls.alignJustify} ${t.controls.textAlign}`}
        >
          {t.controls.alignJustify}
        </button>
      </div>
    </div>
  );
}
