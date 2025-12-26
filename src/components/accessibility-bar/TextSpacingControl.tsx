'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function TextSpacingControl() {
  const { textSpacing, setTextSpacing } = useAccessibility();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Text Spacing: {textSpacing.toFixed(1)}x
      </label>
      <input
        type="range"
        min="0.5"
        max="2.5"
        step="0.1"
        value={textSpacing}
        onChange={(e) => setTextSpacing(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        aria-label="Adjust text spacing"
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>0.5x</span>
        <span>2.5x</span>
      </div>
    </div>
  );
}

