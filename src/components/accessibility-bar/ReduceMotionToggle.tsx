'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ReduceMotionToggle() {
  const { reduceMotion, toggleReduceMotion } = useAccessibility();

  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor="reduce-motion-toggle"
        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
      >
        Reduce Motion
      </label>
      <button
        id="reduce-motion-toggle"
        onClick={toggleReduceMotion}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          reduceMotion ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        role="switch"
        aria-checked={reduceMotion}
        aria-label="Toggle reduce motion"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            reduceMotion ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

