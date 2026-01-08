import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

export default function FontStyleSelector() {
  const { fontStyle, setFontStyle, language, barTheme } = useAccessibility();
  const t = translations[language] || translations['en'];
  const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

  const [allFontsOpen, setAllFontsOpen] = useState(false);
  const [dyslexiaFontsOpen, setDyslexiaFontsOpen] = useState(false);

  const allFontsRef = useRef<HTMLDivElement>(null);
  const dyslexiaFontsRef = useRef<HTMLDivElement>(null);

  const allFonts = [
    { name: t.controls.default, value: 'default' },
    { name: 'Arial', value: 'sans' },
    { name: 'Georgia', value: 'readable' },
    { name: 'Monospace', value: 'mono' },
    { name: 'Tahoma', value: 'tahoma' },
    { name: 'Times New Roman', value: 'serif' },
    { name: 'Trebuchet MS', value: 'trebuchet' },
    { name: 'Verdana', value: 'verdana' },
  ];

  const dyslexiaFonts = [
    { name: 'Andika', value: 'andika' },
    { name: 'Arial', value: 'arial' },
    { name: 'Calibri', value: 'calibri' },
    { name: 'Century Gothic', value: 'century-gothic' },
    { name: 'Comic Sans MS', value: 'comic-sans' },
    { name: 'FS Me', value: 'fs-me' },
    { name: 'Lexend', value: 'lexend' },
    { name: 'Open Sans', value: 'open-sans' },
    { name: 'Open Dyslexic', value: 'dyslexic' },
    { name: 'Tahoma', value: 'tahoma' },
    { name: 'Trebuchet MS', value: 'trebuchet' },
    { name: 'Verdana', value: 'verdana' },
  ];

  const currentFontName = [...allFonts, ...dyslexiaFonts].find(f => f.value === fontStyle)?.name || t.controls.default;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const path = event.composedPath();
      if (allFontsRef.current && !path.includes(allFontsRef.current)) {
        setAllFontsOpen(false);
      }
      if (dyslexiaFontsRef.current && !path.includes(dyslexiaFontsRef.current)) {
        setDyslexiaFontsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const Dropdown = ({ label, options, isOpen, setIsOpen, containerRef, type }: {
    label: string,
    options: { name: string, value: string }[],
    isOpen: boolean,
    setIsOpen: (val: boolean) => void,
    containerRef: React.RefObject<HTMLDivElement | null>,
    type: string
  }) => {
    const isSelectedInCategory = options.some(f => f.value === fontStyle);
    const selectedName = isSelectedInCategory ? options.find(f => f.value === fontStyle)?.name : label;

    return (
      <div className="space-y-2 relative" ref={containerRef}>
        <label className="block text-[16px] font-normal" style={{ color: theme.text }}>
          {label}
        </label>
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (type === 'all') setDyslexiaFontsOpen(false);
            else setAllFontsOpen(false);
          }}
          className="w-full rounded-md px-3 py-3 text-[15px] font-normal flex items-center justify-between transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          style={{
            backgroundColor: theme.active,
            color: theme.text,
            border: `1px solid ${theme.text}33`
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="truncate">{selectedName}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            className="absolute left-0 mt-4 w-full rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden"
            style={{
              backgroundColor: theme.background === 'transparent' ? '#ffffff' : theme.background,
              border: `1px solid ${theme.border}`,
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="p-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFontStyle(option.value as any);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-3 rounded-sm text-[15px] transition-colors ${fontStyle === option.value ? 'font-bold' : 'font-normal hover:bg-black/5 dark:hover:bg-white/10'}`}
                  style={{
                    color: theme.text,
                    backgroundColor: fontStyle === option.value ? `${theme.active}60` : 'transparent'
                  }}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Dropdown
        label={t.controls.allFonts}
        options={allFonts}
        isOpen={allFontsOpen}
        setIsOpen={setAllFontsOpen}
        containerRef={allFontsRef}
        type="all"
      />

      <Dropdown
        label={t.controls.dyslexiaFonts}
        options={dyslexiaFonts}
        isOpen={dyslexiaFontsOpen}
        setIsOpen={setDyslexiaFontsOpen}
        containerRef={dyslexiaFontsRef}
        type="dyslexia"
      />

      <div className="text-[14px] font-medium opacity-90 p-2.5 px-3 rounded-lg flex items-center gap-3 mt-2"
        style={{ color: theme.text, backgroundColor: `${theme.active}44`, border: `1px solid ${theme.text}22` }}>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#FACC15' }}></div>
        <span className="leading-none">{t.controls.currentSelection}: <span className="font-bold underline underline-offset-2">{currentFontName}</span></span>
      </div>
    </div>
  );
}
