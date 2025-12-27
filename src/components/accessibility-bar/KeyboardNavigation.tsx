'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function KeyboardNavigation() {
  const { keyboardNavigation, toggleKeyboardNavigation } = useAccessibility();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label
          htmlFor="keyboard-navigation-toggle"
          className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
        >
          Keyboard Navigation
        </label>
        <button
          id="keyboard-navigation-toggle"
          onClick={toggleKeyboardNavigation}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${keyboardNavigation ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          role="switch"
          aria-checked={keyboardNavigation}
          aria-label="Toggle keyboard navigation"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
              }`}
          />
        </button>
      </div>

      {keyboardNavigation && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 animate-fade-in font-sans">
          <p className="text-[14px] font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase tracking-wide">Keyboard Shortcuts</p>
          <ul className="space-y-2 text-[13px] text-blue-700 dark:text-blue-200">
            <li className="flex justify-between">
              <span className="font-medium">Open/Close Bar</span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded shadow-sm">Alt+A</kbd>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">High Contrast</span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded shadow-sm">Alt+C</kbd>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Increase Font</span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded shadow-sm">Alt+F</kbd>
            </li>
            <li className="flex justify-between border-t border-blue-100 dark:border-blue-800/50 pt-2 mt-2">
              <span className="font-medium">Legacy Shortcut</span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded shadow-sm">Ctrl+Shift+A</kbd>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

