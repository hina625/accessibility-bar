'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function CursorSizeControl() {
  const { cursorSize, setCursorSize, cursorColor, setCursorColor } = useAccessibility();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
          Cursor Size: {cursorSize}x
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step="0.5"
          value={cursorSize}
          onChange={(e) => setCursorSize(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          aria-label="Adjust cursor size"
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>1x</span>
          <span>5x</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
          Cursor Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={cursorColor}
            onChange={(e) => setCursorColor(e.target.value)}
            className="w-16 h-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            aria-label="Select cursor color"
          />
          <input
            type="text"
            value={cursorColor}
            onChange={(e) => setCursorColor(e.target.value)}
            className="flex-1 px-3 py-2 text-base border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="#000000"
          />
          <button
            onClick={() => setCursorColor('#000000')}
            className="px-4 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Reset cursor color"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
