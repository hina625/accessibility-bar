'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { API_ENDPOINTS } from '@/config/api';

export default function DictionaryPopup() {
    const { onPageDictionary, toggleOnPageDictionary, panelPosition, barTheme, isMobile } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
    const [definition, setDefinition] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!onPageDictionary) {
            setIsOpen(false);
            // Auto-clear logic
            setSearchQuery('');
            setDefinition(null);
            return;
        }

        const handleSelection = async () => {
            setTimeout(async () => {
                const selection = window.getSelection();
                const selectedText = selection?.toString().trim();
                if (selectedText && selectedText.length > 1 && selectedText.length < 50) {
                    fetchDefinition(selectedText);
                }
            }, 100);
        };

        window.addEventListener('mouseup', handleSelection);
        window.addEventListener('touchend', handleSelection);
        return () => {
            window.removeEventListener('mouseup', handleSelection);
            window.removeEventListener('touchend', handleSelection);
        };
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

    if (!onPageDictionary) return null;

    return (
        <div
            className={`accessibility-bar fixed z-[2147483650] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out
                ${(panelPosition === 'left' || panelPosition === 'right')
                    ? `top-0 bottom-0 ${isMobile ? 'w-full' : 'w-[340px]'} border-x ${panelPosition === 'left' ? 'left-0' : 'right-0'}`
                    : `inset-y-0 right-0 ${isMobile ? 'w-full' : 'w-80'} border-l`
                }
            `}
            style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                transform: onPageDictionary
                    ? 'translateX(0)'
                    : (panelPosition === 'left' ? 'translateX(-100%)' : 'translateX(100%)'),
                display: 'flex',
                pointerEvents: 'auto'
            }}
        >

            <div
                className="p-4 border-b flex items-center justify-between"
                style={{ backgroundColor: theme.hover, borderColor: theme.border }}
            >
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="font-bold" style={{ color: theme.text }}>Dictionary</h3>
                </div>
                <button
                    onClick={toggleOnPageDictionary}
                    className="p-1 pr-3 transition-colors flex items-center gap-1.5"
                    style={{ color: theme.text, opacity: 0.6 }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wide">Close</span>
                </button>
            </div>


            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">


                <form onSubmit={handleSearchSubmit} className="mb-6 relative">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type here to search"
                            className="w-full pl-4 pr-10 py-2 border rounded-lg text-[16px] focus:outline-none transition-all"
                            style={{
                                backgroundColor: theme.hover,
                                borderColor: theme.border,
                                color: theme.text
                            }}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setDefinition(null);
                                }}
                                className="absolute right-8 top-1 bottom-1 p-1.5 rounded text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <button
                            type="submit"
                            className="absolute right-1 top-1 bottom-1 p-1.5 rounded text-white transition-colors"
                            style={{ backgroundColor: theme.active }}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </form>


                {isLoading && (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-6 rounded w-1/3" style={{ backgroundColor: theme.hover }}></div>
                        <div className="h-4 rounded w-full" style={{ backgroundColor: theme.hover }}></div>
                        <div className="h-4 rounded w-5/6" style={{ backgroundColor: theme.hover }}></div>
                    </div>
                )}


                {!isLoading && definition && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5">

                        <div className="border-b pb-4" style={{ borderColor: theme.border }}>
                            <div className="flex items-baseline gap-2 mb-1">
                                <h2 className="text-xl font-bold capitalize" style={{ color: theme.text }}>
                                    {definition.word}
                                </h2>
                                {definition.partOfSpeech && (
                                    <span className="text-[14px] font-semibold capitalize" style={{ color: theme.text, opacity: 0.9 }}>
                                        ({definition.partOfSpeech})
                                    </span>
                                )}
                            </div>


                            <div className="space-y-1">
                                {definition.phonetic && (
                                    <div className="text-[16px] font-mono" style={{ color: theme.text, opacity: 0.9 }}>
                                        {definition.phonetic}
                                    </div>
                                )}
                                {definition.simplePhonetic && (
                                    <div className="text-[16px]" style={{ color: theme.text, opacity: 0.7 }}>
                                        {definition.simplePhonetic}
                                    </div>
                                )}
                            </div>


                            <button
                                onClick={() => playAudio(definition.word)}
                                className="mt-2 flex items-center gap-1.5 text-[14px] font-bold hover:underline"
                                style={{ color: theme.text }}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                                Listen
                            </button>
                        </div>


                        <div>
                            <h4 className="text-[16px] font-bold mb-2" style={{ color: theme.text }}>Definition</h4>
                            <p className="text-[16px] leading-relaxed" style={{ color: theme.text, opacity: 0.9 }}>
                                {definition.meaning}
                            </p>
                        </div>


                        {definition.example && (
                            <div>
                                <h4 className="text-[16px] font-bold mb-2" style={{ color: theme.text }}>Example</h4>
                                <p className="text-[16px] italic border-l-2 pl-3" style={{ color: theme.text, opacity: 0.8, borderColor: theme.active }}>
                                    "{definition.example}"
                                </p>
                            </div>
                        )}


                        {definition.synonyms && definition.synonyms.length > 0 && (
                            <div>
                                <h4 className="text-[16px] font-bold mb-2" style={{ color: theme.text }}>Synonyms</h4>
                                <div className="flex flex-wrap gap-2">
                                    {definition.synonyms.map((syn: string) => (
                                        <span
                                            key={syn}
                                            onClick={() => fetchDefinition(syn)}
                                            className="px-2 py-1 rounded text-xs cursor-pointer transition-all"
                                            style={{
                                                backgroundColor: theme.hover,
                                                color: theme.text
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = theme.active;
                                                e.currentTarget.style.color = theme.text;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = theme.hover;
                                                e.currentTarget.style.color = theme.text;
                                            }}
                                        >
                                            {syn}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                )}

                {!isLoading && !definition && searchQuery && (
                    <div className="mt-8 text-center">
                        <p className="text-sm" style={{ color: theme.text, opacity: 0.9 }}>No definition found for "{searchQuery}"</p>
                    </div>
                )}
            </div>


            <div
                className="p-3 border-t text-right text-xs font-medium"
                style={{ backgroundColor: theme.hover, borderColor: theme.border, color: theme.text, opacity: 0.6 }}
            >
                {definition?.source === 'ai' ? 'Powered by AI' : 'Dictionary Data'}
            </div>
        </div>
    );
}
