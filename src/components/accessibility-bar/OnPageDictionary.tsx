'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import ToggleCheckbox from './ToggleCheckbox';

export default function OnPageDictionary() {
  const { onPageDictionary, toggleOnPageDictionary, barTheme } = useAccessibility();
  const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
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

    // Use pointerup/down for better compatibility
    const handleSelection = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      // Check if click origin was inside the bar to ignore it
      if (tooltipRef.current?.contains(target) ||
        target.closest('.accessibility-bar') ||
        target.closest('.a11y-embed-host')) {
        return;
      }

      // Small timeout to let selection settle
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text && text.length > 1 && text.split(/\s+/).length === 1) {
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            if (rect.width === 0 || rect.height === 0) return;

            setSelectedWord(text);
            // Simple viewport logic
            setPosition({
              x: rect.left + (rect.width / 2),
              y: rect.top - 10
            });
            setIsVisible(true);
            fetchDefinition(text);
          }
        } else if (!text) {
          // Only hide if nothing selected
          setIsVisible(false);
        }
      }, 100); // Slightly longer for mobile
    };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!tooltipRef.current?.contains(target) &&
        !target.closest('.accessibility-bar')) {
        // Prepare for selection
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
      document.removeEventListener('touchstart', handleTouchStart);
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
      <ToggleCheckbox
        id="word-dictionary-toggle"
        label="Word Dictionary"
        checked={onPageDictionary}
        onChange={toggleOnPageDictionary}
      />
      {onPageDictionary && isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[2147483647] min-w-[200px] max-w-[300px] shadow-2xl rounded-xl overflow-hidden transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            backgroundColor: theme.background,
            pointerEvents: 'auto'
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
      )
      }
    </div >
  );
}
