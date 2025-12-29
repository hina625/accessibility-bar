'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

export default function PageZoomControl() {
  const { pageZoom, setPageZoom, language, barTheme } = useAccessibility();
  const t = translations[language] || translations['en'];
  const theme = BAR_THEMES[barTheme];

  return (
    <div className="space-y-2">
      <label className="block text-[18px] font-normal" style={{ color: theme.text }}>
        {t.controls.zoom}: {pageZoom}%
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPageZoom(pageZoom - 10)}
          className="flex h-9 w-9 items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2"
          style={{ backgroundColor: theme.active, color: theme.text }}
          aria-label={`${t.common.reset} ${t.controls.zoom}`}
          disabled={pageZoom <= 50}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <input
          type="range"
          min="50"
          max="200"
          step="10"
          value={pageZoom}
          onChange={(e) => setPageZoom(Number(e.target.value))}
          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
          style={{ backgroundColor: theme.hover, accentColor: theme.active }}
          aria-label={`${t.controls.zoom} ${t.controls.zoom}`}
        />
        <button
          onClick={() => setPageZoom(pageZoom + 10)}
          className="flex h-9 w-9 items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2"
          style={{ backgroundColor: theme.active, color: theme.text }}
          aria-label={`${t.common.reset} ${t.controls.zoom}`}
          disabled={pageZoom >= 200}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={() => setPageZoom(100)}
          className="px-3 py-1.5 text-[18px] font-normal rounded-md transition-colors focus:outline-none focus:ring-2"
          style={{ backgroundColor: theme.active, color: theme.text }}
          aria-label={t.common.reset}
        >
          {t.common.reset}
        </button>
      </div>
    </div>
  );
}
