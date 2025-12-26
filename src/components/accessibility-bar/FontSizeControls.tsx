'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function FontSizeControls() {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useAccessibility();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Font Size
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={decreaseFontSize}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label="Decrease font size"
          disabled={fontSize <= 12}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <span className="flex-1 text-center text-sm text-gray-600 dark:text-gray-400">
          {fontSize}px
        </span>

        <button
          onClick={increaseFontSize}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label="Increase font size"
          disabled={fontSize >= 24}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        <button
          onClick={resetFontSize}
          className="px-3 py-1.5 text-xs rounded-md bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label="Reset font size to default"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

