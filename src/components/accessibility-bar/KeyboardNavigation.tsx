'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

export default function KeyboardNavigation() {
  const { keyboardNavigation, toggleKeyboardNavigation, barTheme } = useAccessibility();
  const theme = BAR_THEMES[barTheme];

  return (
    <div className="space-y-4">
      {/* Main Toggle */}
      <div
        className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
        style={{ backgroundColor: theme.hover }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
        onClick={() => toggleKeyboardNavigation()}
      >
        <span className="text-[15px] font-medium" style={{ color: theme.text }}>Keyboard Navigation</span>
        <div
          className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
          style={{
            backgroundColor: keyboardNavigation ? theme.active : 'rgba(255, 255, 255, 0.9)',
            border: keyboardNavigation ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          {keyboardNavigation && (
            <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      {keyboardNavigation && (
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.hover, borderColor: theme.border }}>
          <p className="text-[14px] font-bold mb-3 uppercase tracking-wide" style={{ color: theme.text }}>Keyboard Shortcuts</p>
          <ul className="space-y-3 text-[13px]" style={{ color: theme.text }}>
            <li className="flex justify-between items-center">
              <span className="font-medium opacity-80">Open/Close Bar</span>
              <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[11px]" style={{ backgroundColor: theme.background, color: theme.active, borderColor: theme.border }}>Alt+A</kbd>
            </li>
            <li className="flex justify-between items-center">
              <span className="font-medium opacity-80">High Contrast</span>
              <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[11px]" style={{ backgroundColor: theme.background, color: theme.active, borderColor: theme.border }}>Alt+C</kbd>
            </li>
            <li className="flex justify-between items-center">
              <span className="font-medium opacity-80">Increase Font</span>
              <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[11px]" style={{ backgroundColor: theme.background, color: theme.active, borderColor: theme.border }}>Alt+F</kbd>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
