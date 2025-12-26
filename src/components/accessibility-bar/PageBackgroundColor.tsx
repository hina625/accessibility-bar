'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

interface BackgroundColor {
  color: string;
  name: string;
  textColor: string;
}

const darkColors: BackgroundColor[] = [
  { color: '#000000', name: 'Black', textColor: '#FFFFFF' },
  { color: '#1a1a1a', name: 'Dark Gray', textColor: '#FFFF00' },
  { color: '#0d2818', name: 'Dark Green', textColor: '#FFFFFF' },
  { color: '#003366', name: 'Dark Blue', textColor: '#FFFFFF' },
  { color: '#8B4513', name: 'Brown', textColor: '#FFFFFF' },
  { color: '#000080', name: 'Navy', textColor: '#FFFF00' },
  { color: '#2d2d2d', name: 'Charcoal', textColor: '#FFFFFF' },
  { color: '#1a1a2e', name: 'Dark Slate', textColor: '#FFFFFF' },
  { color: '#4a148c', name: 'Purple', textColor: '#FFFFFF' },
  { color: '#800020', name: 'Maroon', textColor: '#FFFFFF' },
];

const lightColors: BackgroundColor[] = [
  { color: '#FFF8DC', name: 'Cream', textColor: '#000000' },
  { color: '#D3D3D3', name: 'Light Gray', textColor: '#000000' },
  { color: '#F5F5DC', name: 'Beige', textColor: '#000000' },
  { color: '#FFFF00', name: 'Yellow', textColor: '#000000' },
  { color: '#FFEB3B', name: 'Bright Yellow', textColor: '#0000FF' },
  { color: '#FFFFFF', name: 'White', textColor: '#FF0000' },
  { color: '#FFFFFF', name: 'White', textColor: '#8B4513' },
  { color: '#FFFFFF', name: 'White', textColor: '#008000' },
  { color: '#FFFFFF', name: 'White', textColor: '#0000FF' },
  { color: '#FFFFFF', name: 'White', textColor: '#000000' },
];

const getContrastColor = (bgColor: string): string => {
  if (!bgColor) return '#000000';
  
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

export default function PageBackgroundColor() {
  const { backgroundColor, setBackgroundColor, setTextColor, setHeadingColor, colorBlindFilter, setColorBlindFilter } = useAccessibility();

  const handleBackgroundColorChange = (bgColor: BackgroundColor) => {
    if (colorBlindFilter !== 'none') {
      setColorBlindFilter('none');
    }
    setBackgroundColor(bgColor.color);
    setTextColor(bgColor.textColor);
    setHeadingColor(bgColor.textColor);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Page Background
      </label>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
            Dark
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {darkColors.map((bgColor, index) => {
              const isActive = backgroundColor === bgColor.color;
              return (
                <button
                  key={index}
                  onClick={() => handleBackgroundColorChange(bgColor)}
                  className={`group relative flex items-center justify-center w-full aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                    isActive
                      ? 'border-blue-500 shadow-lg ring-2 ring-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: bgColor.color }}
                  title={bgColor.name}
                  aria-label={`Select ${bgColor.name} background`}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: bgColor.textColor }}
                  >
                    A
                  </span>
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-3 h-3 text-white"
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
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
            Light
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {lightColors.map((bgColor, index) => {
              const isActive = backgroundColor === bgColor.color;
              return (
                <button
                  key={index}
                  onClick={() => handleBackgroundColorChange(bgColor)}
                  className={`group relative flex items-center justify-center w-full aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                    isActive
                      ? 'border-blue-500 shadow-lg ring-2 ring-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: bgColor.color }}
                  title={bgColor.name}
                  aria-label={`Select ${bgColor.name} background`}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: bgColor.textColor }}
                  >
                    A
                  </span>
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-3 h-3 text-white"
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
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
          Custom Background Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={backgroundColor || '#FFFFFF'}
            onChange={(e) => {
              if (colorBlindFilter !== 'none') {
                setColorBlindFilter('none');
              }
              const color = e.target.value;
              setBackgroundColor(color);
              const autoTextColor = getContrastColor(color);
              setTextColor(autoTextColor);
              setHeadingColor(autoTextColor);
            }}
            className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            aria-label="Background color picker"
          />
          <input
            type="text"
            value={backgroundColor || '#FFFFFF'}
            onChange={(e) => {
              if (colorBlindFilter !== 'none') {
                setColorBlindFilter('none');
              }
              const color = e.target.value;
              setBackgroundColor(color);
              const autoTextColor = getContrastColor(color);
              setTextColor(autoTextColor);
              setHeadingColor(autoTextColor);
            }}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="#FFFFFF"
          />
          <button
            onClick={() => {
              setBackgroundColor('');
              setTextColor('#000000');
              setHeadingColor('#000000');
            }}
            className="px-3 py-2 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Reset background color"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

