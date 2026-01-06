'use client';

import Image from 'next/image';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

import alignLeftIcon from '../../assets/icons/align-left.png';
import alignCenterIcon from '../../assets/icons/align-center.png';
import alignRightIcon from '../../assets/icons/align-right.png';
import alignJustifyIcon from '../../assets/icons/align-justify.png';

export default function TextAlignControl() {
  const { textAlign, setTextAlign, language, barTheme } = useAccessibility();
  const t = translations[language] || translations['en'];
  const theme = BAR_THEMES[barTheme as BarTheme];

  const getButtonStyle = (align: string) => {
    const isActive = textAlign === align;
    return {
      backgroundColor: isActive ? theme.active : theme.hover,
      color: theme.text,
      border: `2px solid ${theme.text}`
    };
  };

  const alignOptions = [
    { id: 'left', label: t.controls.alignLeft, icon: alignLeftIcon },
    { id: 'right', label: t.controls.alignRight, icon: alignRightIcon },
    { id: 'center', label: t.controls.alignCentre, icon: alignCenterIcon },
    { id: 'justify', label: t.controls.alignJustify, icon: alignJustifyIcon },
  ];

  return (
    <div className="space-y-4">
      <label className="block text-[18px] font-bold text-center" style={{ color: theme.text }}>
        Text Alignment
      </label>
      <div className="grid grid-cols-2 gap-3 px-1">
        {alignOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setTextAlign(option.id as any)}
            className="p-3 flex flex-col items-center justify-center gap-2 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            style={getButtonStyle(option.id)}
            aria-label={`${option.label} ${t.controls.textAlign}`}
          >
            <div className="bg-white rounded-lg p-1.5 w-11 h-11 flex items-center justify-center shadow-sm">
              <Image
                src={option.icon}
                alt=""
                width={28}
                height={28}
                className="object-contain"
                style={{
                  filter: 'brightness(0)'
                }}
              />
            </div>
            <span className="text-[14px] font-bold uppercase">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
