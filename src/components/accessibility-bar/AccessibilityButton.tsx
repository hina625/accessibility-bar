'use client';

import { ReactNode } from 'react';

interface AccessibilityButtonProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  hasSlider?: boolean;
}

export default function AccessibilityButton({
  icon,
  label,
  active = false,
  onClick,
  hasSlider = false,
}: AccessibilityButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`group relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-blue-400 ${active
        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg scale-105'
        : 'bg-white dark:bg-gray-800 text-black hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
    >
      <span className={`flex items-center justify-center w-10 h-10 rounded-md transition-colors ${active ? 'bg-white/10' : 'bg-transparent'
        }`}>{icon}</span>

      <span className="mt-1 text-[11px] font-normal text-black dark:text-gray-300 text-center select-none">
        {label}
      </span>

      {hasSlider && (
        <div className="absolute -bottom-2 flex gap-0.5">
          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
      )}
    </button>
  );
}

