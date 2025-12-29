'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import { translations } from '@/contexts/accessibility/translations';

export default function ColorBlindFilter() {
  const { colorBlindFilter, setColorBlindFilter, setBackgroundColor, setTextColor, setHeadingColor, barTheme, language } = useAccessibility();
  const theme = BAR_THEMES[barTheme];
  const t = translations[language] || translations['en'];

  return (
    <div className="space-y-2">
      <label className="block text-[18px] font-normal" style={{ color: theme.text }}>
        {t.controls.colorBlind}
      </label>
      <select
        value={colorBlindFilter}
        onChange={(e) => {
          const filter = e.target.value as 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
          setColorBlindFilter(filter);
          if (filter !== 'none') {
            setBackgroundColor('');
            setTextColor('#000000');
            setHeadingColor('#000000');
          }
        }}
        className="w-full rounded-md px-3 py-2 text-[18px] font-normal focus:outline-none focus:ring-2"
        style={{ backgroundColor: theme.active, color: theme.text, border: `1px solid ${theme.border}` }}
        aria-label={t.controls.colorBlind}
      >
        <option value="none">{t.controls.none}</option>
        <option value="protanopia">{t.controls.protanopia}</option>
        <option value="deuteranopia">{t.controls.deuteranopia}</option>
        <option value="tritanopia">{t.controls.tritanopia}</option>
      </select>
    </div>
  );
}
