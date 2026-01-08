'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

export default function PageZoomControl() {
  const { pageZoom, setPageZoom, language, barTheme } = useAccessibility();
  const t = translations[language] || translations['en'];
  const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

  return (
    <div className="space-y-2">

      <p className="text-[15px] font-normal opacity-90 leading-relaxed mb-6" style={{ color: theme.text }}>
        Tap the screen (Mobile or Tablet users) or Click your mouse 3 times in quick succession to Increase <br /> <br /> Or Decrease the website font size. Or use the -/+ buttons below
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPageZoom(pageZoom - 10)}
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
          style={{ backgroundColor: theme.active, color: theme.text }}
          aria-label={`Decrease ${t.controls.zoom}`}
          disabled={pageZoom <= 50}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
          </svg>
        </button>
        <span className="flex-1 text-center text-[18px] font-bold" style={{ color: theme.text }}>
          {pageZoom}%
        </span>
        <button
          onClick={() => setPageZoom(pageZoom + 10)}
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
          style={{ backgroundColor: theme.active, color: theme.text }}
          aria-label={`Increase ${t.controls.zoom}`}
          disabled={pageZoom >= 200}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={() => setPageZoom(100)}
          className="px-4 py-2 text-[16px] font-bold rounded-lg transition-all hover:brightness-110 active:scale-90 shadow-sm"
          style={{ backgroundColor: theme.active, color: theme.text }}
          aria-label={t.common.reset}
        >
          {t.common.reset}
        </button>
      </div>
    </div>
  );
}
