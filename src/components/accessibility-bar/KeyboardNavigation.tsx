'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

export default function KeyboardNavigation() {
  const { barTheme, isPanelPinned, togglePanelPin } = useAccessibility();
  const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border-2" style={{ backgroundColor: theme.hover, borderColor: theme.border }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-wide" style={{ color: theme.text }}>Pin Keyboard</span>
          </div>
          <button
            onClick={() => togglePanelPin()}
            className="p-2 rounded-xl transition-all hover:scale-105 active:scale-95 z-10 flex items-center justify-center shadow-md"
            style={{
              backgroundColor: isPanelPinned ? '#FFD700' : '#FFFFFF',
              color: '#000000',
              border: '1px solid rgba(0,0,0,0.1)'
            }}
            title={isPanelPinned ? "Unpin Panel" : "Pin Panel"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`transition-all ${isPanelPinned ? 'opacity-100' : 'opacity-60'}`}
              style={{ transform: 'rotate(45deg)' }}
            >
              <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22H13V16H18V14L16 12Z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4 rounded-xl border-2" style={{ backgroundColor: theme.hover, borderColor: theme.border }}>
        <p className="text-[18px] font-bold mb-4 uppercase tracking-wide text-center" style={{ color: theme.text }}>Keyboard Shortcuts</p>
        <ul className="space-y-3.5 text-[16px]" style={{ color: theme.text }}>
          {/* Bar Control */}
          <li className="flex justify-between items-center">
            <span className="font-bold">Open/Close Bar</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[14px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+A</kbd>
          </li>

          {/* Font & Text */}
          <li className="flex justify-between items-center">
            <span className="font-bold">Increase Font</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+F</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-bold">Decrease Font</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+Shift+F</kbd>
          </li>

          {/* Contrast & Display */}
          <li className="flex justify-between items-center">
            <span className="font-bold">High Contrast</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+C</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-bold">Dark Mode</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+D</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-bold">Grayscale</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+G</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-bold">Invert Colors</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+I</kbd>
          </li>

          {/* Reading Tools */}
          <li className="flex justify-between items-center">
            <span className="font-bold">Reading Guide</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+R</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-bold">Reading Ruler</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+U</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-bold">Reading Mask</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+M</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-bold">Highlight Links</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+L</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-bold">Highlight Headings</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+H</kbd>
          </li>

          {/* Speech & Language */}
          <li className="flex justify-between items-center">
            <span className="font-bold">Text to Speech</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+T</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-bold">Voice Navigation</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+V</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-bold">Dictionary</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+Shift+D</kbd>
          </li>

          {/* Layout & Navigation */}
          <li className="flex justify-between items-center">
            <span className="font-bold">Simplify Layout</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+S</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-bold">Page Structure</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+P</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-bold">Magnifier</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+Shift+M</kbd>
          </li>

          {/* Zoom */}
          <li className="flex justify-between items-center">
            <span className="font-bold">Zoom In</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt + +</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-bold">Zoom Out</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt + -</kbd>
          </li>

          {/* Reset */}
          <li className="flex justify-between items-center">
            <span className="font-bold">Reset All</span>
            <kbd className="px-2 py-1 rounded shadow-sm border font-mono text-[16px]" style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+0</kbd>
          </li>
        </ul>
      </div>
    </div>
  );
}
