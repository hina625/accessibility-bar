'use client';

import React from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function CharacterSpacingControl() {
  const { characterSpacing, setCharacterSpacing } = useAccessibility();

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[14px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
        <span className="w-1 h-3.5 bg-gray-900 dark:bg-gray-100 rounded-full"></span>
        Character Spacing: {characterSpacing.toFixed(2)}em
      </label>
      <input
        type="range"
        min={0}
        max={0.5}
        step={0.01}
        value={characterSpacing}
        onChange={(e) => setCharacterSpacing(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        aria-label="Character spacing"
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>0em</span>
        <span>0.5em</span>
      </div>
    </div>
  );
}
