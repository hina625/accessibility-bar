'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import { translations } from '@/contexts/accessibility/translations';
import InfoPopupButton from './InfoPopupButton';

export default function ColorBlindFilter() {
  const { colorBlindFilter, setColorBlindFilter, setBackgroundColor, setTextColor, setHeadingColor, barTheme, language } = useAccessibility();
  const theme = BAR_THEMES[barTheme];
  const t = translations[language] || translations['en'];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-[16px] font-normal" style={{ color: theme.text }}>
          {t.controls.colorBlind}
        </label>
        <InfoPopupButton
          title={t.controls.colorBlind}
          description={t.info?.contrast?.features?.["Color Blindness"] || "Filters for Protanopia, Deuteranopia, and Tritanopia."}
        />
      </div>
      <div className="relative group">
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
          className="w-full rounded-md px-3 py-2 text-[16px] font-normal focus:outline-none focus:ring-2 appearance-none cursor-pointer pr-10"
          style={{ backgroundColor: theme.active, color: theme.text, border: `1px solid ${theme.border}` }}
          aria-label={t.controls.colorBlind}
        >
          <option value="none">{t.controls.none}</option>
          <option value="protanopia">{t.controls.protanopia}</option>
          <option value="deuteranopia">{t.controls.deuteranopia}</option>
          <option value="tritanopia">{t.controls.tritanopia}</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-6 h-6 transition-transform group-hover:scale-110"
            style={{ color: theme.text }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
