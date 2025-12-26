'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function HighlightHeadingsToggle() {
  const { highlightHeadings, toggleHighlightHeadings } = useAccessibility();

  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor="highlight-headings-toggle"
        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
      >
        Highlight Headings
      </label>
      <button
        id="highlight-headings-toggle"
        onClick={toggleHighlightHeadings}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          highlightHeadings ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        role="switch"
        aria-checked={highlightHeadings}
        aria-label="Toggle highlight headings"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            highlightHeadings ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

