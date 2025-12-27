'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';

export default function CursorSizeControl() {
  const { cursorSize, setCursorSize, cursorColor, setCursorColor, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-[18px] font-normal text-black dark:text-gray-300">
          {t.controls.cursor}
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((size) => (
            <button
              key={size}
              onClick={() => setCursorSize(size)}
              className={`flex h-8 items-center justify-center rounded-md border-2 text-[18px] font-normal transition-all ${cursorSize === size
                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 shadow-sm'
                : 'border-gray-200 bg-white text-black hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}
              aria-label={`${t.common.size}: ${size}x`}
            >
              {size}x
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[18px] font-normal text-black dark:text-gray-300">
          {t.common.color}
        </label>

        <div className="grid grid-cols-8 gap-1 mb-2">
          {['#000000', '#FF0000', '#0000FF', '#008000', '#FFFF00', '#FFA500', '#800080', '#FF00FF', '#00FFFF', '#FFFFFF', '#808080', '#A52A2A', '#00FF00', '#000080', '#800000', '#008080'].map((color) => (
            <button
              key={color}
              onClick={() => setCursorColor(color)}
              className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${cursorColor === color ? 'border-blue-500 ring-2 ring-blue-300 shadow-sm' : 'border-gray-200 dark:border-gray-700'
                }`}
              style={{ backgroundColor: color }}
              title={color}
              aria-label={`${t.common.color}: ${color}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="color"
            value={cursorColor || '#000000'}
            onChange={(e) => setCursorColor(e.target.value)}
            className="w-9 h-9 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            aria-label={`${t.common.color} picker`}
          />
          <input
            type="text"
            value={cursorColor || '#000000'}
            onChange={(e) => setCursorColor(e.target.value)}
            className="flex-1 px-2 py-1.5 text-[14px] font-normal border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
            placeholder="#000000"
            style={{ maxWidth: '100px' }}
          />
          <button
            onClick={() => setCursorColor('#000000')}
            className="px-3 py-1.5 text-[14px] font-bold rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label={t.common.reset}
          >
            {t.common.reset}
          </button>
        </div>
      </div>
    </div>
  );
}
