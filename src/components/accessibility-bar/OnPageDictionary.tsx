'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

export default function OnPageDictionary() {
  const { onPageDictionary, toggleOnPageDictionary, barTheme } = useAccessibility();
  const theme = BAR_THEMES[barTheme];
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [definition, setDefinition] = useState<string>('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onPageDictionary) {
      setIsVisible(false);
      return;
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (tooltipRef.current?.contains(e.target as Node) ||
        (e.target as HTMLElement).closest('.accessibility-bar')) {
        return;
      }

      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 1 && text.split(/\s+/).length === 1) {
        const rect = selection!.getRangeAt(0).getBoundingClientRect();

        setSelectedWord(text);
        setPosition({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY - 10
        });
        setIsVisible(true);
        fetchDefinition(text);
      } else {
        setIsVisible(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!tooltipRef.current?.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('.accessibility-bar')) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onPageDictionary]);

  const fetchDefinition = async (word: string) => {
    setIsLoading(true);
    setDefinition('');
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      if (response.ok) {
        const data = await response.json();
        const firstDefinition = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;
        setDefinition(firstDefinition || 'Definition not found');
      } else {
        setDefinition('Definition not available');
      }
    } catch (error) {
      setDefinition('Unable to fetch definition');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Toggle */}
      <div
        className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
        style={{ backgroundColor: theme.hover }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
        onClick={() => toggleOnPageDictionary()}
      >
        <span className="text-[15px] font-medium" style={{ color: theme.text }}>Selected Word Dictionary</span>
        <div
          className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
          style={{
            backgroundColor: onPageDictionary ? theme.active : 'rgba(255, 255, 255, 0.9)',
            border: onPageDictionary ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          {onPageDictionary && (
            <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      <p className="text-[12px] italic pl-2" style={{ color: theme.text, opacity: 0.9 }}>
        Select any single word on the page to see its definition.
      </p>

      {onPageDictionary && isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[2147483647] min-w-[200px] max-w-[300px] shadow-2xl rounded-xl overflow-hidden transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            backgroundColor: theme.background
          }}
        >
          <div className="p-3" style={{ backgroundColor: theme.active, color: theme.text }}>
            <div className="text-[16px] font-bold uppercase tracking-tight">{selectedWord}</div>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center gap-2" style={{ color: theme.text }}>
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.text, borderTopColor: 'transparent' }}></div>
                <span className="text-[13px]">Finding definition...</span>
              </div>
            ) : (
              <p className="text-[14px] leading-relaxed" style={{ color: theme.text }}>
                {definition}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
