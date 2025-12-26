'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

interface ColorCombination {
  textColor: string;
  headingColor: string;
  name: string;
}

const colorCombinations: ColorCombination[] = [
  { textColor: '#000000', headingColor: '#000000', name: 'Black on White' },
  { textColor: '#FFFFFF', headingColor: '#FFFFFF', name: 'White on Black' },
  { textColor: '#1a1a1a', headingColor: '#0066cc', name: 'Dark Blue' },
  { textColor: '#2d2d2d', headingColor: '#d32f2f', name: 'Dark Red' },
  { textColor: '#1b4332', headingColor: '#2d5016', name: 'Dark Green' },
  { textColor: '#4a148c', headingColor: '#6a1b9a', name: 'Dark Purple' },
  { textColor: '#004d40', headingColor: '#00695c', name: 'Teal' },
  { textColor: '#e65100', headingColor: '#ff6f00', name: 'Orange' },
  { textColor: '#000000', headingColor: '#1976d2', name: 'Blue Headings' },
  { textColor: '#000000', headingColor: '#c62828', name: 'Red Headings' },
  { textColor: '#424242', headingColor: '#616161', name: 'Gray Scale' },
  { textColor: '#000000', headingColor: '#388e3c', name: 'Green Headings' },
  { textColor: '#1565c0', headingColor: '#0d47a1', name: 'Blue Text' },
  { textColor: '#c62828', headingColor: '#b71c1c', name: 'Red Text' },
  { textColor: '#2e7d32', headingColor: '#1b5e20', name: 'Green Text' },
  { textColor: '#6a1b9a', headingColor: '#4a148c', name: 'Purple Text' },
  { textColor: '#f57c00', headingColor: '#e65100', name: 'Orange Text' },
  { textColor: '#00838f', headingColor: '#006064', name: 'Cyan Text' },
  { textColor: '#5d4037', headingColor: '#3e2723', name: 'Brown Text' },
  { textColor: '#ad1457', headingColor: '#880e4f', name: 'Pink Text' },
  { textColor: '#283593', headingColor: '#1a237e', name: 'Indigo Text' },
  { textColor: '#00695c', headingColor: '#004d40', name: 'Teal Text' },
  { textColor: '#424242', headingColor: '#212121', name: 'Dark Gray' },
  { textColor: '#616161', headingColor: '#424242', name: 'Medium Gray' },
  { textColor: '#1976d2', headingColor: '#0d47a1', name: 'Blue Combo' },
  { textColor: '#c62828', headingColor: '#b71c1c', name: 'Red Combo' },
  { textColor: '#2e7d32', headingColor: '#1b5e20', name: 'Green Combo' },
  { textColor: '#6a1b9a', headingColor: '#4a148c', name: 'Purple Combo' },
  { textColor: '#f57c00', headingColor: '#e65100', name: 'Orange Combo' },
];

export default function ColorPanel() {
  const { textColor, headingColor, setTextColor, setHeadingColor } = useAccessibility();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Text & Heading Colors
      </label>
      
      <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
        {colorCombinations.map((combo, index) => {
          const isActive =
            textColor === combo.textColor && headingColor === combo.headingColor;
          
          return (
            <button
              key={index}
              onClick={() => {
                setTextColor(combo.textColor);
                setHeadingColor(combo.headingColor);
              }}
              className={`group relative flex flex-col items-center p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                isActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              title={combo.name}
              aria-label={`Select ${combo.name} color combination`}
            >
              <div className="flex gap-1 mb-1.5">
                <div
                  className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: combo.textColor }}
                />
                <div
                  className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: combo.headingColor }}
                />
              </div>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 text-center leading-tight">
                {combo.name.split(' ')[0]}
              </span>
              {isActive && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex-1">
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Text Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              aria-label="Text color picker"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              style={{ maxWidth: 120 }}
              placeholder="#000000"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Heading Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="color"
              value={headingColor}
              onChange={(e) => setHeadingColor(e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              aria-label="Heading color picker"
            />
            <input
              type="text"
              value={headingColor}
              onChange={(e) => setHeadingColor(e.target.value)}
              className="px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              style={{ maxWidth: 120 }}
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

