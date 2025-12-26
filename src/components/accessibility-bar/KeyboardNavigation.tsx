'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function KeyboardNavigation() {
  const { keyboardNavigation, toggleKeyboardNavigation } = useAccessibility();

  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor="keyboard-navigation-toggle"
        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
      >
        Keyboard Navigation
      </label>
      <button
        id="keyboard-navigation-toggle"
        onClick={toggleKeyboardNavigation}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          keyboardNavigation ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        role="switch"
        aria-checked={keyboardNavigation}
        aria-label="Toggle keyboard navigation"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

