'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function TextAlignControl() {
  const { textAlign, setTextAlign } = useAccessibility();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Align Text
      </label>
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setTextAlign('left')}
          className={`px-3 py-2 text-xs rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            textAlign === 'left'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
          aria-label="Left align text"
        >
          Left
        </button>
        <button
          onClick={() => setTextAlign('center')}
          className={`px-3 py-2 text-xs rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            textAlign === 'center'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
          aria-label="Center align text"
        >
          Center
        </button>
        <button
          onClick={() => setTextAlign('right')}
          className={`px-3 py-2 text-xs rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            textAlign === 'right'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
          aria-label="Right align text"
        >
          Right
        </button>
        <button
          onClick={() => setTextAlign('justify')}
          className={`px-3 py-2 text-xs rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            textAlign === 'justify'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
          aria-label="Justify text"
        >
          Justify
        </button>
      </div>
    </div>
  );
}

