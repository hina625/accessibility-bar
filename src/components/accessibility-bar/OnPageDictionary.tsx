'use client';

import { useState, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function OnPageDictionary() {
  const { onPageDictionary, toggleOnPageDictionary } = useAccessibility();
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [definition, setDefinition] = useState<string>('');

  useEffect(() => {
    if (!onPageDictionary) {
      setSelectedWord('');
      setDefinition('');
      return;
    }

    const handleWordSelect = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const word = selection.toString().trim();
        setSelectedWord(word);
        fetchDefinition(word);
      }
    };

    document.addEventListener('mouseup', handleWordSelect);
    return () => document.removeEventListener('mouseup', handleWordSelect);
  }, [onPageDictionary]);

  const fetchDefinition = async (word: string) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      if (response.ok) {
        const data = await response.json();
        if (data[0]?.meanings?.[0]?.definitions?.[0]?.definition) {
          setDefinition(data[0].meanings[0].definitions[0].definition);
        } else {
          setDefinition('Definition not found');
        }
      } else {
        setDefinition('Definition not available');
      }
    } catch (error) {
      setDefinition('Unable to fetch definition');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="dictionary-toggle"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          On-Page Dictionary
        </label>
        <button
          id="dictionary-toggle"
          onClick={toggleOnPageDictionary}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            onPageDictionary ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          role="switch"
          aria-checked={onPageDictionary}
          aria-label="Toggle on-page dictionary"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              onPageDictionary ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      {onPageDictionary && selectedWord && definition && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">{selectedWord}</div>
          <div className="text-sm text-blue-800 dark:text-blue-200">{definition}</div>
        </div>
      )}
    </div>
  );
}

