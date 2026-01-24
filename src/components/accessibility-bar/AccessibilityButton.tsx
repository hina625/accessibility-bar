'use client';

import { ReactNode } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

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
  const { showOnBadge } = useAccessibility() as any;
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`group relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-blue-400 px-1 py-1 overflow-visible ${active
        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg scale-105'
        : 'bg-white dark:bg-gray-800 text-black hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
    >
      {active && showOnBadge && (
        <span
          className="absolute -top-1 -left-1 text-[10px] font-black leading-none px-1 py-0.5 rounded-sm shadow-sm z-20 pointer-events-none transform scale-110 origin-top-left"
          style={{
            backgroundColor: '#ef4444',
            color: '#ffffff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}
        >
          On
        </span>
      )}
      <span className={`flex items-center justify-center rounded-md transition-colors ${active ? 'bg-white/10' : 'bg-transparent'
        }`} style={{ paddingTop: '2px' }}>{icon}</span>

      <span className="text-[13px] font-bold text-black dark:text-gray-300 text-center select-none leading-tight break-words" style={{ marginTop: '2px', paddingBottom: '2px' }}>
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

