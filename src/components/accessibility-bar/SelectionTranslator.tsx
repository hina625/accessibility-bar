'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { API_ENDPOINTS } from '@/config/api';
import { SUPPORTED_LANGUAGES } from '@/config/languages';


export default function SelectionTranslator() {
    const { realTimeTranslation, barTheme, selectionLanguage } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
    const [selectedText, setSelectedText] = useState<string>('');
    const [translatedText, setTranslatedText] = useState<string>('');
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only active if realTimeTranslation is enabled
        // Note: User can enable BOTH Dictionary and Translator if they want.
        if (!realTimeTranslation) {
            setIsVisible(false);
            return;
        }

        const handleSelection = (e: MouseEvent | TouchEvent) => {
            if (tooltipRef.current?.contains(e.target as Node) ||
                (e.target as HTMLElement).closest('.accessibility-bar') ||
                (e.target as HTMLElement).closest('.a11y-embed-host')) {
                return;
            }

            // Small timeout to let selection settle (crucial for embed)
            setTimeout(() => {
                const selection = window.getSelection();
                const text = selection?.toString().trim();

                if (text && text.length > 1 && text.split(/\s+/).length <= 50) {
                    if (selection && selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        const rect = range.getBoundingClientRect();

                        if (rect.width === 0 || rect.height === 0) return;

                        setSelectedText(text);
                        setPosition({
                            x: rect.left + (rect.width / 2),
                            y: rect.top - 10
                        });
                        setIsVisible(true);
                        fetchTranslation(text);
                    }
                } else {
                    setIsVisible(false);
                }
            }, 100); // Slightly longer for mobile/embed
        };

        const handleMouseDown = (e: MouseEvent | TouchEvent) => {
            if (!tooltipRef.current?.contains(e.target as Node) &&
                !(e.target as HTMLElement).closest('.accessibility-bar')) {
                // setIsVisible(false); // Rely on mouseup to clear
            }
        };

        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('touchend', handleSelection);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('touchstart', handleMouseDown, { passive: true });

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('touchend', handleSelection);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('touchstart', handleMouseDown);
        };
    }, [realTimeTranslation, selectionLanguage]);

    const fetchTranslation = async (text: string) => {
        setIsLoading(true);
        setTranslatedText('');

        try {
            const targetLangName = SUPPORTED_LANGUAGES.find(l => l.code === selectionLanguage)?.name || 'English';

            const response = await fetch(API_ENDPOINTS.TRANSLATE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    targetLanguage: targetLangName
                })
            });

            if (response.ok) {
                const data = await response.json();
                setTranslatedText(data.translatedText);
            } else {
                setTranslatedText('Translation failed');
            }
        } catch (error) {
            setTranslatedText('Unable to translate');
        } finally {
            setIsLoading(false);
        }
    };

    if (!realTimeTranslation || !isVisible) return null;

    return (
        <div
            ref={tooltipRef}
            className="fixed z-[2147483647] min-w-[200px] max-w-[400px] shadow-2xl rounded-xl overflow-hidden transform -translate-x-1/2 -translate-y-full"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                backgroundColor: theme.background,
                marginTop: '-12px', // Little offset to not overlap exact mouse position
                pointerEvents: 'auto'
            }}
        >
            <div className="p-2 px-3 flex justify-between items-center" style={{ backgroundColor: theme.active, color: theme.text }}>
                <div className="text-[14px] font-bold uppercase tracking-tight truncate max-w-[200px]">{selectedText}</div>
                <div className="text-[10px] opacity-80 uppercase tracking-widest">{SUPPORTED_LANGUAGES.find(l => l.code === selectionLanguage)?.name}</div>
            </div>
            <div className="p-4">
                {isLoading ? (
                    <div className="flex items-center gap-2" style={{ color: theme.text }}>
                        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.text, borderTopColor: 'transparent' }}></div>
                        <span className="text-[13px]">Translating...</span>
                    </div>
                ) : (
                    <div style={{ color: theme.text }}>
                        <p className="text-[16px] font-medium leading-relaxed">
                            {translatedText}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
