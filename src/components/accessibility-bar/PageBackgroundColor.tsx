'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

interface BackgroundColor {
  color: string;
  name: string;
  textColor: string;
}

const darkColors: BackgroundColor[] = [
  { color: '#000000', name: 'Black', textColor: '#FFFFFF' },
  { color: '#1a1a1a', name: 'Dark Grey', textColor: '#FFFF00' },
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
  { color: '#D3D3D3', name: 'Light Grey', textColor: '#000000' },
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

// Calculate contrast ratio (WCAG)
const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = hex.match(/[A-Za-z0-9]{2}/g)?.map((v) => parseInt(v, 16)) || [0, 0, 0];
    const [r, g, b] = rgb.map((val) => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
};

// Get contrast rating badge
const getContrastRating = (ratio: number): { label: string; color: string; level: string } => {
  if (ratio >= 7) {
    return { label: 'AAA', color: '#10b981', level: 'Excellent' };
  } else if (ratio >= 4.5) {
    return { label: 'AA', color: '#3b82f6', level: 'Good' };
  } else if (ratio >= 3) {
    return { label: 'A', color: '#f59e0b', level: 'Fair' };
  } else {
    return { label: 'Fail', color: '#ef4444', level: 'Poor' };
  }
};

export default function PageBackgroundColor() {
  const { backgroundColor, setBackgroundColor, setTextColor, setHeadingColor, colorBlindFilter, setColorBlindFilter, language, barTheme } = useAccessibility();
  const t = translations[language] || translations['en'];
  const currentTheme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

  const handleBackgroundColorChange = (bgColor: BackgroundColor) => {
    if (colorBlindFilter !== 'none') {
      setColorBlindFilter('none');
    }
    setBackgroundColor(bgColor.color);
    setTextColor(bgColor.textColor);
    setHeadingColor(bgColor.textColor);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-[18px] font-bold" style={{ color: currentTheme.text }}>
          {t.controls.bg}
        </label>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-[14px] font-semibold mb-3 uppercase tracking-wide" style={{ color: currentTheme.text, opacity: 0.8 }}>
            {t.common.dark} {t.controls.bg}
          </h4>
          <div className="grid grid-cols-5 gap-3">
            {darkColors.map((bgColor, index) => {
              const isActive = backgroundColor === bgColor.color;
              
              return (
                <button
                  key={index}
                  onClick={() => handleBackgroundColorChange(bgColor)}
                  className={`group relative flex flex-col items-center justify-center w-full aspect-square rounded-xl border-2 transition-all hover:scale-105 active:scale-95 shadow-md ${isActive
                    ? 'ring-4 ring-offset-2'
                    : 'hover:shadow-lg'
                    }`}
                  style={{ 
                    backgroundColor: bgColor.color,
                    borderColor: isActive ? currentTheme.active : currentTheme.border,
                    borderWidth: '3px',
                    ringColor: isActive ? currentTheme.active : 'transparent',
                    ringOffsetColor: currentTheme.background
                  }}
                  title={bgColor.name}
                  aria-label={`${t.common.dark} ${bgColor.name}`}
                >
                  <div className="flex-1 flex items-center justify-center w-full">
                    <span
                      className="text-[20px] font-bold"
                      style={{ color: bgColor.textColor }}
                    >
                      Aa
                    </span>
                  </div>
                  
                  {isActive && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-xl border-2" style={{ 
                      backgroundColor: currentTheme.active,
                      borderColor: currentTheme.text
                    }}>
                      <svg
                        className="w-4 h-4"
                        style={{ color: currentTheme.text }}
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
          <h4 className="text-[14px] font-semibold mb-3 uppercase tracking-wide" style={{ color: currentTheme.text, opacity: 0.8 }}>
            {t.common.light} {t.controls.bg}
          </h4>
          <div className="grid grid-cols-5 gap-3">
            {lightColors.map((bgColor, index) => {
              const isActive = backgroundColor === bgColor.color;
              
              return (
                <button
                  key={index}
                  onClick={() => handleBackgroundColorChange(bgColor)}
                  className={`group relative flex flex-col items-center justify-center w-full aspect-square rounded-xl border-2 transition-all hover:scale-105 active:scale-95 shadow-md ${isActive
                    ? 'ring-4 ring-offset-2'
                    : 'hover:shadow-lg'
                    }`}
                  style={{ 
                    backgroundColor: bgColor.color,
                    borderColor: isActive ? currentTheme.active : currentTheme.border,
                    borderWidth: '3px',
                    ringColor: isActive ? currentTheme.active : 'transparent',
                    ringOffsetColor: currentTheme.background
                  }}
                  title={bgColor.name}
                  aria-label={`${t.common.light} ${bgColor.name}`}
                >
                  <div className="flex-1 flex items-center justify-center w-full">
                    <span
                      className="text-[20px] font-bold"
                      style={{ color: bgColor.textColor }}
                    >
                      Aa
                    </span>
                  </div>
                  
                  {isActive && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-xl border-2" style={{ 
                      backgroundColor: currentTheme.active,
                      borderColor: currentTheme.text
                    }}>
                      <svg
                        className="w-4 h-4"
                        style={{ color: currentTheme.text }}
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

      <div className="pt-4 border-t-2" style={{ borderColor: currentTheme.border }}>
        <label className="block text-[14px] font-semibold mb-3 uppercase tracking-wide" style={{ color: currentTheme.text }}>
          Custom {t.controls.bg}
        </label>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
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
                className="w-12 h-12 rounded-lg border-2 cursor-pointer transition-all hover:scale-105"
                style={{ borderColor: currentTheme.border }}
                aria-label={`${t.controls.bg} picker`}
              />
            </div>
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
              className="w-32 px-3 py-2.5 text-[15px] font-medium rounded-lg border-2 transition-all focus:outline-none focus:ring-2"
              placeholder="#FFFFFF"
              style={{
                background: currentTheme.background,
                color: currentTheme.text,
                borderColor: currentTheme.border,
                focusRingColor: currentTheme.active
              }}
            />
            <button
              onClick={() => {
                setBackgroundColor('');
                setTextColor('#000000');
                setHeadingColor('#000000');
              }}
              className="px-3 py-2.5 text-[15px] font-bold rounded-lg border-2 transition-all hover:scale-105 active:scale-95"
              style={{
                background: currentTheme.active,
                color: currentTheme.text,
                borderColor: currentTheme.border
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = currentTheme.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = currentTheme.active;
              }}
              aria-label={t.common.reset}
            >
              {t.common.reset}
            </button>
          </div>
          
          {/* Live Contrast Preview */}
          {backgroundColor && (
            <div className="p-3 rounded-lg border-2" style={{ 
              backgroundColor: backgroundColor,
              borderColor: currentTheme.border 
            }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-semibold uppercase" style={{ color: getContrastColor(backgroundColor) }}>
                  Preview
                </span>
              </div>
              <p className="text-[14px] font-normal leading-relaxed" style={{ color: getContrastColor(backgroundColor) }}>
                This is how text will appear on your selected background color.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

