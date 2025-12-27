'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function FontStyleSelector() {
  const { fontStyle, setFontStyle, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  return (
    <div className="space-y-2">
      <label className="block text-[18px] font-normal text-black dark:text-gray-300">
        {t.controls.fontStyle}
      </label>
      <select
        id="font-style-select"
        value={fontStyle}
        onChange={(e) => setFontStyle(e.target.value as 'default' | 'dyslexic' | 'readable' | 'serif' | 'sans' | 'mono')}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[18px] font-normal text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
      <p id="font-style-help" className="text-[18px] font-normal text-black dark:text-gray-400">
        {t.controls.currentSelection}: {fontStyle}
      </p>
      {/* <div className="mt-2 p-2 border rounded bg-white dark:bg-gray-800">
        <p style={{ fontFamily: (fontStyle === 'readable' ? 'Georgia, Times New Roman, serif' : fontStyle === 'dyslexic' ? "'Comic Sans MS', 'Comic Sans', 'OpenDyslexic', sans-serif" : fontStyle === 'serif' ? 'Times New Roman, Georgia, serif' : fontStyle === 'sans' ? 'Arial, Helvetica, sans-serif' : fontStyle === 'mono' ? "'Courier New', Courier, monospace" : 'inherit') }}>
         checked 
        </p> 
      </div> */}
    </div>
  );
}

