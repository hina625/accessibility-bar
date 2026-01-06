'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import ToggleCheckbox from './ToggleCheckbox';

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

    // Use pointerup/down for better compatibility
    const handleMouseUp = (e: MouseEvent) => {
      // Check if click origin was inside the bar to ignore it
      if (tooltipRef.current?.contains(e.target as Node) ||
        (e.target as HTMLElement).closest('.accessibility-bar') ||
        (e.target as HTMLElement).closest('.a11y-embed-host')) {
        return;
      }

      // Small timeout to let selection settle
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        console.log('[AccessibilityBar] Selection Event:', text);

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
        } else {
          // Only hide if we actually clicked outside and didn't select anything new
          // But we already checked text length.
          setIsVisible(false);
        }
      }, 10);
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Only hide if clicking outside tooltip and outside bar
      // And NOT selecting text (which we can't know yet, but usually mousedown starts selection)
      // Let's rely on mouseup to determine valid selection vs deselect
      if (!tooltipRef.current?.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('.accessibility-bar')) {
        // Don't close immediately on mousedown, wait for mouseup results
        // setIsVisible(false); 
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
