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

                // Use elementsFromPoint to pierce through overlays/backdrops
                const elements = document.elementsFromPoint(e.clientX, e.clientY);

                // Find the first relevant element (not the lens, not the backdrop)
                let target: HTMLElement | null = null;

                for (const el of elements) {
                    const htmlEl = el as HTMLElement;
                    // Skip the lens itself
                    if (htmlEl.closest('.magnifier-lens')) continue;

                    // Skip the backdrop used for closing the menu
                    if (htmlEl.classList.contains('accessibility-backdrop')) continue;

                    // Skip the active indicator lines we added (visual only)
                    if (htmlEl.classList.contains('pointer-events-none')) continue;

                    target = htmlEl;
                    break;
                }

                if (target) {
                    let extractedText = '';

                    // Try to get text at exact cursor position
                    try {
                        let range: Range | null = null;

                        // Temporarily disable pointer events on backdrop to allow piercing
                        const backdrop = document.querySelector('.accessibility-backdrop') as HTMLElement;
                        let originalPointerEvents = '';
                        if (backdrop) {
                            originalPointerEvents = backdrop.style.pointerEvents;
                            backdrop.style.pointerEvents = 'none';
                        }

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

                        // Restore backdrop pointer events
                        if (backdrop) {
                            backdrop.style.pointerEvents = originalPointerEvents;
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

                            // If we found a single word, try to get one more word for "word or two" context
                            let phraseStart = start;
                            let phraseEnd = end;

                            // Look ahead for one more word
                            let nextWordEnd = end;
                            // Skip whitespace
                            while (nextWordEnd < text.length && /\s/.test(text[nextWordEnd])) {
                                nextWordEnd++;
                            }
                            // Find end of next word
                            let hasNextWord = false;
                            while (nextWordEnd < text.length && !/\s/.test(text[nextWordEnd]) && !/[.!?\n]/.test(text[nextWordEnd])) {
                                nextWordEnd++;
                                hasNextWord = true;
                            }

                            if (hasNextWord) {
                                phraseEnd = nextWordEnd;
                            }

                            // Get the phrase (1-2 words)
                            const candidateText = text.substring(phraseStart, phraseEnd).trim();

                            // Geometric check: Ensure mouse is actually OVER this text
                            if (candidateText) {
                                try {
                                    const wordRange = document.createRange();
                                    wordRange.setStart(textNode, phraseStart);
                                    wordRange.setEnd(textNode, phraseEnd);
                                    const rect = wordRange.getBoundingClientRect();

                                    // Check if cursor is near the text rect
                                    // Horizontal padding: 5px (tight to avoid grabbing neighbor words)
                                    // Vertical padding: 15px (loose for line-height)
                                    const hPad = 5;
                                    const vPad = 15;

                                    const isOver =
                                        e.clientX >= rect.left - hPad &&
                                        e.clientX <= rect.right + hPad &&
                                        e.clientY >= rect.top - vPad &&
                                        e.clientY <= rect.bottom + vPad;

                                    if (isOver) {
                                        extractedText = candidateText;
                                    }
                                } catch (rangeErr) {
                                    // Fallback if range creation fails
                                    extractedText = candidateText;
                                }
                            }

                            // Limit length
                            if (extractedText.length > 100) {
                                extractedText = extractedText.substring(0, 100) + '...';
                            }
                        }
                    } catch (err) {
                        console.error('Magnifier text extraction error:', err);
                    }

                    // Fallback to accessibility attributes only (avoid innerText generic capture)
                    if (!extractedText) {
                        const text = target.getAttribute('aria-label') || target.getAttribute('alt') || target.getAttribute('title') || '';
                        extractedText = text.trim().substring(0, 100);
                    }

                    // Always show lens if we are moving mouse (unless disabled)
                    if (content !== extractedText) {
                        setContent(extractedText);
                    }
                    setIsVisible(true);
                }
            });
        };

        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [magnifier, content]);

    if (!magnifier || !isVisible) return null;

    return (
        <div
            className="magnifier-lens fixed z-[2147483647] pointer-events-none flex items-center justify-center p-4"
            style={{
                left: `${position.x}px`,
                top: `${position.y - 120}px`, // Adjusted offset
                transform: 'translate(-50%, -50%)',
            }}
        >
            {/* Handle */}
            <div
                className="absolute bg-neutral-800 border-2 border-neutral-600 shadow-md"
                style={{
                    width: '16px',
                    height: '80px',
                    bottom: '-40px',
                    right: '-20px',
                    transform: 'rotate(-45deg)',
                    borderRadius: '8px',
                    zIndex: -1
                }}
            />

            {/* Lens Frame (Outer Ring) */}
            <div
                className="relative bg-white dark:bg-gray-900 border-[10px] border-neutral-800 shadow-2xl flex items-center justify-center overflow-hidden"
                style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    boxShadow: 'none'
                }}
            >
                {/* Crosshair Target - Added for better precision */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-8 h-[1px] bg-red-600 absolute"></div>
                    <div className="h-8 w-[1px] bg-red-600 absolute"></div>
                    <div className="w-16 h-16 border border-red-600 rounded-full absolute opacity-50"></div>
                </div>

                {/* Content Area */}
                <div
                    className="p-6 text-center w-full h-full flex flex-col items-center justify-center"
                >
                    <span className="text-[20px] font-bold text-black dark:text-white leading-tight break-words max-w-full">
                        {content}
                    </span>
                </div>

                {/* Glass Reflection/Gloss */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/20 pointer-events-none rounded-full" />
            </div>
        </div>
    );
}
