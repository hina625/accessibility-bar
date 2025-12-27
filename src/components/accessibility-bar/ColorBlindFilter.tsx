'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ColorBlindFilter() {
  const { colorBlindFilter, setColorBlindFilter, setBackgroundColor, setTextColor, setHeadingColor } = useAccessibility();

  return (
    <div className="space-y-2">
      <label className="block text-[18px] font-normal text-black dark:text-gray-300">
        Colour Blind Filter
      </label>
      <select
        value={colorBlindFilter}
        onChange={(e) => {
          const filter = e.target.value as 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
          setColorBlindFilter(filter);
          if (filter !== 'none') {
            setBackgroundColor('');
            setTextColor('#000000');
            setHeadingColor('#000000');
          }
        }}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[18px] font-normal text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        aria-label="Select colour blind filter"
      >
        <option value="none">None</option>
        <option value="protanopia">Protanopia</option>
        <option value="deuteranopia">Deuteranopia</option>
        <option value="tritanopia">Tritanopia</option>
      </select>
    </div>
  );
}

