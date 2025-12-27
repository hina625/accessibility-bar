'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { API_ENDPOINTS } from '@/config/api';

export default function DictionaryPopup() {
    const { onPageDictionary, toggleOnPageDictionary, panelPosition } = useAccessibility();
    const [definition, setDefinition] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Handle text selection
    useEffect(() => {
        if (!onPageDictionary) {
            setIsOpen(false);
            return;
        }

        const handleMouseUp = async () => {
            // Basic delay to ensure selection is complete
            setTimeout(async () => {
                const selection = window.getSelection();
                const selectedText = selection?.toString().trim();

                // Allow multi-word selections (e.g. "machine learning") but limit length
                if (selectedText && selectedText.length > 1 && selectedText.length < 50) {
                    fetchDefinition(selectedText);
                }
            }, 10);
        };

        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [onPageDictionary]);

    const fetchDefinition = async (word: string) => {
        setIsOpen(true);
        setIsLoading(true);
        setDefinition(null);
        setSearchQuery(word);

        try {
            const response = await fetch(API_ENDPOINTS.DICTIONARY(word));
            if (response.ok) {
                const data = await response.json();
                setDefinition(data);
            } else {
                setDefinition(null);
            }
        } catch (error) {
            console.error('Dictionary Fetch Error:', error);
            setDefinition(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            fetchDefinition(searchQuery.trim());
        }
    };

    const playAudio = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    if (!onPageDictionary && !isOpen) return null;

    // We render the panel if it's open OR if the feature is enabled (showing an empty state/search bar if nothing selected yet? 
    // Actually the user probably expects it to be hidden until selected OR manually opened.
    // The previous behavior was popup on select. Detailed request says "Dictionary... select a word... or enter in search bar".
    // So it should probably be visible if toggled ON? Or just hidden until interaction?
    // Let's make it visible when `isOpen` is true. `isOpen` is set to true on select. 
    // But how to manually open? The user likely toggles the feature -> panel opens?
    // For now, let's auto-open panel when feature is enabled to show the Search Bar.

    // Correction: If user enables "Dictionary" toggle, the panel should probably appear or at least be accessible.
    // The previous logic only showed on selection. Let's make it show if `onPageDictionary` is active, but maybe simpler state?
    // Let's stick to: If `onPageDictionary` is TRUE, we show the panel permanently? Or minimized?
    // User request: "Select a word... or enter in search bar". This implies the panel is persistent.

    if (!onPageDictionary) return null;

    return (
        <div
            className={`fixed z-[2147483650] bg-white dark:bg-gray-900 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out
                ${(panelPosition === 'left' || panelPosition === 'right')
                    ? `top-0 bottom-0 w-[340px] border-x border-gray-200 dark:border-gray-800 ${panelPosition === 'left' ? 'left-0' : 'right-0'}`
                    : 'inset-y-0 right-0 w-80 border-l border-gray-200 dark:border-gray-800'
                }
            `}
            style={{
                transform: onPageDictionary
                    ? 'translateX(0)'
                    : (panelPosition === 'left' ? 'translateX(-100%)' : 'translateX(100%)'), // Slide out appropriate side
                display: 'flex'
            }}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="font-bold text-gray-900 dark:text-white">Dictionary</h3>
                </div>
                <button
                    onClick={toggleOnPageDictionary}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">

                {/* Intro Text */}
                <p className="text-xs text-gray-500 mb-4 dark:text-gray-400">
                    Select a word on this page or enter it in the search bar to view its definition
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="mb-6 relative">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full pl-4 pr-10 py-2 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-1 top-1 bottom-1 p-1.5 bg-blue-500 hover:bg-blue-600 rounded text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </form>

                {/* Loading State */}
                {isLoading && (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                )}

                {/* Results */}
                {!isLoading && definition && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5">
                        {/* Word Header */}
                        <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                            <div className="flex items-baseline gap-2 mb-1">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                                    {definition.word}
                                </h2>
                                {definition.partOfSpeech && (
                                    <span className="text-xs font-semibold text-gray-500 capitalize">
                                        ({definition.partOfSpeech})
                                    </span>
                                )}
                            </div>

                            {/* Phonetics section */}
                            <div className="space-y-1">
                                {definition.phonetic && (
                                    <div className="text-sm font-mono text-blue-600 dark:text-blue-400">
                                        {definition.phonetic}
                                    </div>
                                )}
                                {definition.simplePhonetic && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {definition.simplePhonetic}
                                    </div>
                                )}
                            </div>

                            {/* Audio Button */}
                            <button
                                onClick={() => playAudio(definition.word)}
                                className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                                Listen
                            </button>
                        </div>

                        {/* Definition */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Definition</h4>
                            <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed">
                                {definition.meaning}
                            </p>
                        </div>

                        {/* Example */}
                        {definition.example && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Example</h4>
                                <p className="text-[14px] text-gray-600 dark:text-gray-400 italic border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                                    "{definition.example}"
                                </p>
                            </div>
                        )}

                        {/* Synonyms */}
                        {definition.synonyms && definition.synonyms.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Synonyms</h4>
                                <div className="flex flex-wrap gap-2">
                                    {definition.synonyms.map((syn: string) => (
                                        <span
                                            key={syn}
                                            onClick={() => fetchDefinition(syn)}
                                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 cursor-pointer transition-colors"
                                        >
                                            {syn}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                )}

                {/* No Data State */}
                {!isLoading && !definition && searchQuery && (
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">No definition found for "{searchQuery}"</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 text-right text-xs text-gray-400 font-medium">
                {definition?.source === 'ai' ? 'Powered by AI' : 'Dictionary Data'}
            </div>
        </div>
    );
}
