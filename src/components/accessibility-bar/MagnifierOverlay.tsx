'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function MagnifierOverlay() {
    const { magnifier } = useAccessibility();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [content, setContent] = useState<string>('');
    const [isVisible, setIsVisible] = useState(false);
    const rafRef = useRef<number>(null);

    useEffect(() => {
        if (!magnifier) {
            setIsVisible(false);
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            // Throttle slightly with RAF
            if (rafRef.current) cancelAnimationFrame(rafRef.current);

            rafRef.current = requestAnimationFrame(() => {
                setPosition({ x: e.clientX, y: e.clientY });

                const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
                if (target && !target.closest('.magnifier-lens') && !target.closest('.accessibility-bar')) {
                    let extractedText = '';

                    // Try to get text at exact cursor position
                    try {
                        let range: Range | null = null;

                        // Try modern API first
                        if (document.caretRangeFromPoint) {
                            range = document.caretRangeFromPoint(e.clientX, e.clientY);
                        } else if ((document as any).caretPositionFromPoint) {
                            const position = (document as any).caretPositionFromPoint(e.clientX, e.clientY);
                            if (position) {
                                range = document.createRange();
                                range.setStart(position.offsetNode, position.offset);
                                range.setEnd(position.offsetNode, position.offset);
                            }
                        }

                        if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
                            const textNode = range.startContainer;
                            const text = textNode.textContent || '';
                            const offset = range.startOffset;

                            // Find word boundaries around cursor
                            let start = offset;
                            let end = offset;

                            // Find start of word
                            while (start > 0 && !/\s/.test(text[start - 1])) {
                                start--;
                            }

                            // Find end of word
                            while (end < text.length && !/\s/.test(text[end])) {
                                end++;
                            }

                            // If we found a single word, try to get surrounding context (sentence)
                            let sentenceStart = start;
                            let sentenceEnd = end;

                            // Expand to sentence boundaries (. ! ? or newline)
                            while (sentenceStart > 0 && !/[.!?\n]/.test(text[sentenceStart - 1])) {
                                sentenceStart--;
                            }
                            while (sentenceEnd < text.length && !/[.!?\n]/.test(text[sentenceEnd])) {
                                sentenceEnd++;
                            }

                            // Get the sentence or phrase
                            extractedText = text.substring(sentenceStart, sentenceEnd).trim();

                            // Limit length
                            if (extractedText.length > 100) {
                                extractedText = extractedText.substring(0, 100) + '...';
                            }
                        }
                    } catch (err) {
                        console.error('Magnifier text extraction error:', err);
                    }

                    // Fallback to element text if exact position failed
                    if (!extractedText) {
                        const text = target.innerText || target.textContent || target.getAttribute('aria-label') || target.getAttribute('alt') || '';
                        extractedText = text.trim().substring(0, 100);
                    }

                    // Only show if meaningful text
                    if (extractedText.length > 0) {
                        if (content !== extractedText) {
                            setContent(extractedText);
                        }
                        setIsVisible(true);
                    } else {
                        setIsVisible(false);
                    }
                }
            });
        };

        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [magnifier, content]);

    if (!magnifier || !isVisible || !content) return null;

    return (
        <div
            className="magnifier-lens fixed z-[2147483647] pointer-events-none flex items-center justify-center"
            style={{
                left: `${position.x}px`,
                top: `${position.y - 150}px`, // Float above cursor
                transform: 'translate(-50%, -50%)', // Center on coordinates
            }}
        >
            {/* Handle */}
            <div
                className="absolute bg-neutral-800 border-2 border-neutral-600 shadow-md"
                style={{
                    width: '20px',
                    height: '100px',
                    bottom: '-60px',
                    right: '-20px',
                    transform: 'rotate(-45deg)',
                    borderRadius: '10px',
                    zIndex: -1
                }}
            />

            {/* Lens Frame (Outer Ring) */}
            <div
                className="relative bg-white dark:bg-gray-900 border-[12px] border-neutral-800 shadow-2xl flex items-center justify-center overflow-hidden"
                style={{
                    width: '220px',
                    height: '220px',
                    borderRadius: '50%',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.2)'
                }}
            >
                {/* Text Content */}
                <div className="p-6 text-center w-full h-full flex items-center justify-center">
                    <p className="text-[20px] font-bold text-black dark:text-white leading-tight line-clamp-5">
                        {content}
                    </p>
                </div>

                {/* Glass Reflection/Gloss */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/10 pointer-events-none rounded-full" />
            </div>
        </div>
    );
}
