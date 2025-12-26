'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ContrastToggle() {
  const { highContrast, toggleHighContrast } = useAccessibility();

  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor="contrast-toggle"
        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
      >
        High Contrast
      </label>
      <button
        id="contrast-toggle"
        onClick={toggleHighContrast}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          highContrast ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        role="switch"
        aria-checked={highContrast}
        aria-label="Toggle high contrast mode"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            highContrast ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

