'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function FontStyleSelector() {
  const { fontStyle, setFontStyle } = useAccessibility();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Font Style
      </label>
      <select
        id="font-style-select"
        value={fontStyle}
        onChange={(e) => setFontStyle(e.target.value as 'default' | 'dyslexic' | 'readable' | 'serif' | 'sans' | 'mono')}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        aria-label="Select font style"
        aria-describedby="font-style-help"
      >
        <option value="default" style={{ fontFamily: 'inherit' }}>Default</option>
        <option value="readable" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Readable</option>
        <option value="dyslexic" style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', 'OpenDyslexic', sans-serif" }}>Dyslexic</option>
        <option value="serif" style={{ fontFamily: "Times New Roman, Georgia, serif" }}>Serif</option>
        <option value="sans" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Sans</option>
        <option value="mono" style={{ fontFamily: "'Courier New', Courier, monospace" }}>Monospace</option>
      </select>
      <p id="font-style-help" className="text-xs text-gray-500 dark:text-gray-400">
        Current selection: {fontStyle}
      </p>
      {/* <div className="mt-2 p-2 border rounded bg-white dark:bg-gray-800">
        <p style={{ fontFamily: (fontStyle === 'readable' ? 'Georgia, Times New Roman, serif' : fontStyle === 'dyslexic' ? "'Comic Sans MS', 'Comic Sans', 'OpenDyslexic', sans-serif" : fontStyle === 'serif' ? 'Times New Roman, Georgia, serif' : fontStyle === 'sans' ? 'Arial, Helvetica, sans-serif' : fontStyle === 'mono' ? "'Courier New', Courier, monospace" : 'inherit') }}>
         checked 
        </p> 
      </div> */}
    </div>
  );
}

