'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function PageZoomControl() {
  const { pageZoom, setPageZoom } = useAccessibility();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Page Zoom: {pageZoom}%
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPageZoom(pageZoom - 10)}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label="Decrease page zoom"
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
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          aria-label="Adjust page zoom"
        />
        <button
          onClick={() => setPageZoom(pageZoom + 10)}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label="Increase page zoom"
          disabled={pageZoom >= 200}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={() => setPageZoom(100)}
          className="px-3 py-1.5 text-xs rounded-md bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label="Reset page zoom"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

