'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import { CursorStyle } from '@/contexts/accessibility/types';

export default function CursorSizeControl() {
  const {
    cursorSize, setCursorSize,
    cursorStyle, setCursorStyle,
    cursorColor, setCursorColor,
    language, barTheme
  } = useAccessibility();

  const t = translations[language] || translations['en'];
  const currentTheme = BAR_THEMES[barTheme];

  // Scale factor for the UI preview (matching useUISettings logic)
  const previewScale = cursorSize;
  const baseIconSize = 24;
  const scaledSize = baseIconSize * previewScale;

  const pointerStyles: { id: CursorStyle; label: string; icon: (size: number, color: string) => React.ReactNode }[] = [
    {
      id: 'white',
      label: t.controls.white || 'White',
      icon: (size, _) => (
        <svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
          <path fill="white" stroke="black" strokeWidth="1.5" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
        </svg>
      )
    },
    {
      id: 'black',
      label: t.controls.black || 'Black',
      icon: (size, _) => (
        <svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
          <path fill="black" stroke="white" strokeWidth="1.5" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
        </svg>
      )
    },
    {
      id: 'circle',
      label: t.controls.circle || 'Circle',
      icon: (size, _) => (
        <svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
          <circle cx="12" cy="12" r="9" fill="none" stroke={currentTheme.text === '#FFFFFF' ? 'white' : 'black'} strokeWidth="2" />
          <circle cx="12" cy="12" r="2" fill={currentTheme.text === '#FFFFFF' ? 'white' : 'black'} />
        </svg>
      )
    },
    {
      id: 'inverted',
      label: t.controls.inverted || 'Inverted',
      icon: (size, _) => (
        <div className="relative flex items-center justify-center p-1 rounded" style={{ width: size + 8, height: size + 8, backgroundColor: currentTheme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          <svg viewBox="0 0 24 24" className="relative z-10" style={{ width: size, height: size }}>
            <path fill="black" stroke="white" strokeWidth="2.5" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
          </svg>
        </div>
      )
    },

    {
      id: 'crosshair',
      label: t.controls.crosshair || 'Crosshair',
      icon: (size, color) => {
        const iconColor = color === '#000000' || color === '#000' ? (currentTheme.text === '#FFFFFF' ? '#fff' : '#000') : color;
        return (
          <svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
            <path fill="none" stroke={iconColor} strokeWidth="2" d="M12 2v20M2 12h20" />
            <circle cx="12" cy="12" r="3" fill="none" stroke={iconColor} strokeWidth="1.5" />
          </svg>
        );
      }
    },
    {
      id: 'pointer',
      label: t.controls.pointer || 'Pointer',
      icon: (size, color) => {
        const iconColor = color === '#000000' || color === '#000' ? (currentTheme.text === '#FFFFFF' ? '#fff' : '#000') : color;
        return (
          <svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
            <path fill={iconColor} stroke={iconColor === '#fff' ? '#000' : '#fff'} strokeWidth="1.5" d="M12 2l4.5 9-4.5 9-4.5-9L12 2z" />
          </svg>
        );
      }
    },
    {
      id: 'help',
      label: t.controls.help || 'Help',
      icon: (size, color) => {
        const iconColor = color === '#000000' || color === '#000' ? (currentTheme.text === '#FFFFFF' ? '#fff' : '#000') : color;
        return (
          <svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
            <path fill={iconColor} stroke={iconColor === '#fff' ? '#000' : '#fff'} strokeWidth="1.5" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            <text x="14" y="22" fontFamily="Arial" fontWeight="bold" fontSize="12" fill={iconColor} stroke={iconColor === '#fff' ? '#000' : '#fff'} strokeWidth="0.5">?</text>
          </svg>
        );
      }
    },
    {
      id: 'person',
      label: t.controls.person || 'Person',
      icon: (size, color) => {
        const iconColor = color === '#000000' || color === '#000' ? (currentTheme.text === '#FFFFFF' ? '#fff' : '#000') : color;
        return (
          <svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
            <circle cx="12" cy="6" r="3" fill={iconColor} stroke={iconColor === '#fff' ? '#000' : '#fff'} strokeWidth="1.5" />
            <path fill={iconColor} stroke={iconColor === '#fff' ? '#000' : '#fff'} strokeWidth="1.5" d="M12 10c-3.3 0-6 2.2-6 5v3c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-3c0-2.8-2.7-5-6-5z" />
          </svg>
        );
      }
    },
    {
      id: 'custom',
      label: t.controls.custom || 'Custom',
      icon: (size, color) => (
        <svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
          <path fill={color} stroke={color === '#fff' || color === '#FFFFFF' ? '#000' : '#fff'} strokeWidth="1.5" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
        </svg>
      )
    }
  ];

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#008000', '#800000', '#000080', '#808080', '#A52A2A', '#008080'
  ];

  const { primaryButton, setPrimaryButton } = useAccessibility();

  const currentIcon = pointerStyles.find(s => s.id === cursorStyle) || pointerStyles[0];

  return (
    <div className="space-y-6">
      {/* OS Mouse Settings Style Selection */}
      <div className="space-y-3">
        <label className="block text-[18px] font-bold" style={{ color: currentTheme.text }}>
          {t.controls.pointerStyle || 'Mouse pointer style'}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {pointerStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => {
                setCursorStyle(style.id);
                // Set default colors for specific styles to match their labels
                if (style.id === 'white') setCursorColor('#FFFFFF');
                else if (style.id === 'black') setCursorColor('#000000');
                else if (style.id === 'inverted') setCursorColor('#000000');
              }}
              className="flex flex-col items-center justify-center gap-1.5 p-1.5 rounded-lg border-2 transition-all hover:bg-white/5 h-full min-h-[75px]"
              style={{
                borderColor: cursorStyle === style.id ? currentTheme.active : (currentTheme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                backgroundColor: cursorStyle === style.id ? `${currentTheme.active}22` : 'transparent'
              }}
            >
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <div className="scale-75 origin-center">
                  {style.icon(32, cursorColor)}
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold leading-tight w-full text-center px-0.5 whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ color: currentTheme.text }}>
                {style.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t" style={{ borderColor: currentTheme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
        <label className="block text-[18px] font-bold" style={{ color: currentTheme.text }}>
          {t.controls.cursor}
        </label>

        <div className="px-1 py-1">
          <div className="relative h-12 flex items-center group">
            {/* Visual Track Layer */}
            <div
              className="absolute w-full h-1 rounded-lg"
              style={{ backgroundColor: currentTheme.text === '#FFFFFF' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }}
            />

            {/* Visual Thumb Layer */}
            <div
              className="absolute pointer-events-none transition-all duration-75 flex items-center justify-center translate-y-[-1px]"
              style={{
                left: `calc(${(cursorSize - 1) * 25}% - 14px)`,
                width: '28px',
                height: '28px',
              }}
            >
              <div className="scale-90 origin-center filter drop-shadow-md">
                {currentIcon.icon(32, cursorColor)}
              </div>
            </div>

            {/* Interactive Layer (Topmost) */}
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={cursorSize}
              onChange={(e) => setCursorSize(Number(e.target.value))}
              className="w-full h-full opacity-0 cursor-pointer absolute z-10"
            />

            <div className="absolute top-12 flex justify-between w-full px-0.5">
              <span className="text-[12px] font-bold tracking-tight" style={{ color: currentTheme.text, opacity: 0.6 }}>
                {language === 'ur' ? 'چھوٹا' : 'Small'}
              </span>
              <span className="text-[12px] font-bold tracking-tight" style={{ color: currentTheme.text, opacity: 0.6 }}>
                {language === 'ur' ? 'بڑا' : 'Large'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t" style={{ borderColor: currentTheme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
        <label className="block text-[18px] font-bold" style={{ color: currentTheme.text }}>
          {t.common.colour}
        </label>

        <div className="grid grid-cols-8 gap-1 mb-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => {
                setCursorColor(color);
              }}
              className="w-full aspect-square rounded border-2 transition-all hover:scale-110"
              style={{
                backgroundColor: color,
                borderColor: (cursorColor === color && cursorStyle === 'custom') ? currentTheme.active : (currentTheme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                boxShadow: 'none'
              }}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t" style={{ borderColor: currentTheme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={cursorColor || '#000000'}
            onChange={(e) => {
              setCursorColor(e.target.value);
            }}
            className="w-10 h-10 rounded cursor-pointer border-2 bg-transparent shrink-0"
            style={{ borderColor: currentTheme.border }}
          />
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              value={cursorColor || '#000000'}
              onChange={(e) => {
                setCursorColor(e.target.value);
              }}
              className="w-full px-2 py-2 text-[13px] font-bold rounded border-2 uppercase text-center"
              style={{
                borderColor: currentTheme.border,
                backgroundColor: currentTheme.text === '#FFFFFF' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: currentTheme.text,
              }}
              placeholder="#000000"
            />
          </div>
          <button
            onClick={() => {
              setCursorColor('#FFFFFF');
              setCursorStyle('white');
            }}
            className="px-3 py-2 text-[13px] font-bold rounded-md border-2 transition-all hover:opacity-80 shrink-0"
            style={{
              backgroundColor: currentTheme.background,
              color: currentTheme.text,
              borderColor: currentTheme.border
            }}
          >
            {t.common.reset}
          </button>
        </div>
      </div>

    </div>
  );
}
