'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function OnPageDictionary() {
  const { onPageDictionary, toggleOnPageDictionary } = useAccessibility();
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
      // Don't trigger if clicking inside the tooltip or the accessibility bar
      if (tooltipRef.current?.contains(e.target as Node) ||
        (e.target as HTMLElement).closest('.accessibility-bar')) {
        return;
      }

      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 1 && text.split(/\s+/).length === 1) {
        // It's a single word
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
      <div className="flex items-center justify-between">
        <label
          htmlFor="dictionary-toggle"
          className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
        >
          Selected Word Dictionary
        </label>
        <button
          id="dictionary-toggle"
          onClick={toggleOnPageDictionary}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${onPageDictionary ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          role="switch"
          aria-checked={onPageDictionary}
          aria-label="Toggle on-page dictionary"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${onPageDictionary ? 'translate-x-6' : 'translate-x-1'
              }`}
          />
        </button>
      </div>

      <p className="text-[14px] text-gray-500 dark:text-gray-400 italic">
        Select any single word on the page to see its definition.
      </p>

      {onPageDictionary && isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[2147483647] min-w-[200px] max-w-[300px] bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-blue-100 dark:border-blue-900 overflow-hidden transform -translate-x-1/2 -translate-y-full animate-in fade-in zoom-in-95 duration-200"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`
          }}
        >
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="text-[16px] font-bold uppercase tracking-tight">{selectedWord}</div>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[13px]">Finding definition...</span>
              </div>
            ) : (
              <p className="text-[14px] leading-relaxed text-gray-700 dark:text-gray-200 font-normal">
                {definition}
              </p>
            )}
          </div>
          <div className="h-1 bg-blue-100 dark:bg-gray-700 w-full overflow-hidden">
            <div className="h-full bg-blue-500 w-full animate-progress-once"></div>
          </div>
        </div>
      )}
    </div>
  );
}

