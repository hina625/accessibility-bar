import { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { ShadowPortal } from '@/embed/ShadowPortal';

export default function KeyboardNavigation() {
  const { barTheme, isPanelPinned, togglePanelPin, panelPosition } = useAccessibility();
  const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
  const isTopOrBottom = panelPosition === 'top' || panelPosition === 'bottom';
  const [showPinPopup, setShowPinPopup] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border-2" style={{ backgroundColor: theme.hover, borderColor: theme.border }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[16px] font-black tracking-wide" style={{ color: theme.text }}>Pin Keyboard</span>
          </div>
          <button
            ref={buttonRef}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setPopupPos({
                x: rect.right - 266, // 256 width + buffer
                y: rect.bottom + 10
              });
              togglePanelPin();
              setShowPinPopup(true);
            }}
            className="p-2 rounded-xl transition-all hover:scale-105 active:scale-95 z-10 flex items-center justify-center shadow-md relative group"
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

          {showPinPopup && mounted && (
            <ShadowPortal>
              <div className="fixed inset-0 z-[2147483667] flex items-center justify-center p-4 animate-in fade-in duration-300 pointer-events-auto">
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowPinPopup(false)}
                />
                <div
                  className="relative rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center m-4 animate-scale-up z-10 border-[4px]"
                  style={{
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.border
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2"
                    style={{
                      backgroundColor: theme.active,
                      color: theme.background,
                      borderColor: theme.active
                    }}
                  >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <h3 className="text-xl font-black mb-2 tracking-wide">Panel Pinned</h3>
                  <p className="opacity-90 font-medium text-base leading-relaxed mb-6">
                    When Pin is selected, any open panels will close on pressing 'X Exit'. Unselect 'Pin' for any open panels to close automatically when any part of the screen is clicked.
                  </p>

                  <button
                    onClick={() => setShowPinPopup(false)}
                    className="w-full py-3.5 rounded-2xl font-black tracking-widest text-lg transition-all shadow-xl hover:shadow-2xl active:scale-95 border-2"
                    style={{
                      backgroundColor: theme.text,
                      color: theme.background,
                      borderColor: theme.border
                    }}
                  >
                    Okay
                  </button>

                  <button
                    onClick={() => setShowPinPopup(false)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl z-20"
                    aria-label="Close"
                    style={{ color: 'white' }}
                  >
                    <svg className="w-5 h-5 opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </ShadowPortal>
          )}
        </div>
      </div>
      <div className="p-4 rounded-xl border-2" style={{ backgroundColor: theme.hover, borderColor: theme.border }}>
        <p className={`${isTopOrBottom ? 'text-[16px]' : 'text-[14px]'} font-bold mb-4 tracking-wide text-center`} style={{ color: theme.text }}>Keyboard Shortcuts</p>
        <ul className={`space-y-3.5 ${isTopOrBottom ? 'text-[16px]' : 'text-[14px]'}`} style={{ color: theme.text }}>
          {/* Bar Control */}
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Open/Close Bar</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+A</kbd>
          </li>

          {/* Font & Text */}
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Increase Font</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+F</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Decrease Font</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+Shift+F</kbd>
          </li>

          {/* Contrast & Display */}
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>High Contrast</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+C</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Dark Mode</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+D</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Grayscale</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+G</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Invert Colors</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+I</kbd>
          </li>

          {/* Reading Tools */}
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Reading Guide</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+R</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Reading Ruler</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+U</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Reading Mask</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+M</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Highlight Links</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+L</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Highlight Headings</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+H</kbd>
          </li>

          {/* Speech & Language */}
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Text to Speech</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+T</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Voice Navigation</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+V</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Dictionary</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+Shift+D</kbd>
          </li>

          {/* Layout & Navigation */}
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Simplify Layout</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+S</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Page Structure</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+P</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Magnifier</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+Shift+M</kbd>
          </li>

          {/* Zoom */}
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Zoom In</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt + +</kbd>
          </li>
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Zoom Out</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt + -</kbd>
          </li>

          {/* Reset */}
          <li className="flex justify-between items-center">
            <span className={`font-bold ${isTopOrBottom ? 'text-[15px]' : 'text-[13px]'}`}>Reset All</span>
            <kbd className={`px-2 py-1 rounded shadow-sm border font-mono ${isTopOrBottom ? 'text-[14px]' : 'text-[12px]'}`} style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.border }}>Alt+0</kbd>
          </li>
        </ul>
      </div>
    </div >
  );
}
