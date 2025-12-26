'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ReadingGuideToggle() {
  const { readingGuide, toggleReadingGuide } = useAccessibility();

  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor="reading-guide-toggle"
        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
      >
        Reading Guide
      </label>
      <button
        id="reading-guide-toggle"
        onClick={toggleReadingGuide}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          readingGuide ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        role="switch"
        aria-checked={readingGuide}
        aria-label="Toggle reading guide"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            readingGuide ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

