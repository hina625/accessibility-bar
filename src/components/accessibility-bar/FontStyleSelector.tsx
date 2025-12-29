'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

export default function FontStyleSelector() {
  const { fontStyle, setFontStyle, language, barTheme } = useAccessibility();
  const t = translations[language] || translations['en'];
  const theme = BAR_THEMES[barTheme];

  return (
    <div className="space-y-2">
      <label className="block text-[18px] font-normal" style={{ color: theme.text }}>
        {t.controls.fontStyle}
      </label>
      <select
        id="font-style-select"
        value={fontStyle}
        onChange={(e) => setFontStyle(e.target.value as 'default' | 'dyslexic' | 'readable' | 'serif' | 'sans' | 'mono')}
        className="w-full rounded-md px-3 py-2 text-[18px] font-normal focus:outline-none focus:ring-2"
        style={{ backgroundColor: theme.active, color: theme.text, border: `1px solid ${theme.border}` }}
        aria-label={t.controls.fontStyle}
        aria-describedby="font-style-help"
      >
        <option value="default" style={{ fontFamily: 'inherit' }}>{t.controls.default}</option>
        <option value="readable" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{t.controls.readable}</option>
        <option value="dyslexic" style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', 'OpenDyslexic', sans-serif" }}>{t.controls.dyslexic}</option>
        <option value="serif" style={{ fontFamily: "Times New Roman, Georgia, serif" }}>{t.controls.serif}</option>
        <option value="sans" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>{t.controls.sans}</option>
        <option value="mono" style={{ fontFamily: "'Courier New', Courier, monospace" }}>{t.controls.mono}</option>
      </select>
      <p id="font-style-help" className="text-[18px] font-normal" style={{ color: theme.text, opacity: 0.8 }}>
        {t.controls.currentSelection}: {t.controls[fontStyle]}
      </p>
    </div>
  );
}
