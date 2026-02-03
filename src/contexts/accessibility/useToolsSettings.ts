import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { speakWithHighlighting, clearAllHighlights, startAIHighlightingSync, stopAIHighlightingSync, highlightSelectedText, injectHighlightStyles } from '@/utils/ttsHighlighting';
import { speak as apiSpeak, setAsCurrentAudio } from '@/utils/speechUtils';

export function useToolsSettings() {
    const [textToSpeech, setTextToSpeech] = useState<boolean>(true); // Default enabled
    const [speechToText, setSpeechToText] = useState<boolean>(false);
    const [onPageDictionary, setOnPageDictionary] = useState<boolean>(false);
    const [keyboardNavigation, setKeyboardNavigation] = useState<boolean>(false);
    const [pronunciationGuide, setPronunciationGuide] = useState<boolean>(false);

    const [pageSummary, setPageSummary] = useState<boolean>(false);
    const [summaryContent, setSummaryContent] = useState<string>('');
    const [summarizationHistory, setSummarizationHistory] = useState<any[]>([]);
    const [smartSuggestions, setSmartSuggestions] = useState<boolean>(false);

    const [ttsAutoPlay, setTtsAutoPlay] = useState<boolean>(false);
    const [ttsReadWholePage, setTtsReadWholePage] = useState<boolean>(false);
    const [ttsMovableControls, setTtsMovableControls] = useState<boolean>(false);
    const [ttsVoiceGender, setTtsVoiceGender] = useState<string>('qJXPML3QGhCJ3NLe2sEw');
    const [ttsReadingSpeed, setTtsReadingSpeed] = useState<number>(1);
    const [ttsReadSelectedText, setTtsReadSelectedText] = useState<boolean>(false);
    const [ttsReadHoveredText, setTtsHoverToSpeak] = useState<boolean>(false);
    const [realTimeTranslation, setRealTimeTranslation] = useState<boolean>(false);
    const [selectionLanguage, setSelectionLanguage] = useState<string>('es');
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        const unlock = () => {
            setHasInteracted(true);
            document.removeEventListener('click', unlock);
            document.removeEventListener('keydown', unlock);
            document.removeEventListener('touchstart', unlock);
        };
        document.addEventListener('click', unlock, { passive: true });
        document.addEventListener('keydown', unlock, { passive: true });
        document.addEventListener('touchstart', unlock, { passive: true });
        return () => {
            document.removeEventListener('click', unlock);
            document.removeEventListener('keydown', unlock);
            document.removeEventListener('touchstart', unlock);
        };
    }, []);

    useEffect(() => {
        const savedSelectionLanguage = localStorage.getItem('accessibility-selectionLanguage');
        if (savedSelectionLanguage) setSelectionLanguage(savedSelectionLanguage);
    }, []);

    useEffect(() => {
        if (keyboardNavigation) document.documentElement.classList.add('keyboard-navigation');
        else document.documentElement.classList.remove('keyboard-navigation');
        localStorage.setItem('accessibility-keyboardNavigation', keyboardNavigation.toString());
    }, [keyboardNavigation]);

    useEffect(() => {
        if (onPageDictionary) document.documentElement.classList.add('on-page-dictionary');
        else document.documentElement.classList.remove('on-page-dictionary');
        localStorage.setItem('accessibility-onPageDictionary', onPageDictionary.toString());
    }, [onPageDictionary]);

    useEffect(() => {
        localStorage.setItem('accessibility-pronunciationGuide', pronunciationGuide.toString());
    }, [pronunciationGuide]);

    useEffect(() => {
        localStorage.setItem('accessibility-smartSuggestions', smartSuggestions.toString());
    }, [smartSuggestions]);

    useEffect(() => {
        if (pageSummary) document.documentElement.classList.add('page-summary-active');
        else document.documentElement.classList.remove('page-summary-active');
        localStorage.setItem('accessibility-pageSummary', pageSummary.toString());
    }, [pageSummary]);

    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    // Initial load for TTS settings
    useEffect(() => {
        injectHighlightStyles(); // Ensure highlights styles are present
        const savedTTS = localStorage.getItem('accessibility-textToSpeech');
        if (savedTTS !== null) {
            setTextToSpeech(savedTTS === 'true');
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('accessibility-textToSpeech', textToSpeech.toString());
        }
    }, [textToSpeech, isLoaded]);
    useEffect(() => localStorage.setItem('accessibility-ttsAutoPlay', ttsAutoPlay.toString()), [ttsAutoPlay]);
    useEffect(() => localStorage.setItem('accessibility-ttsReadWholePage', ttsReadWholePage.toString()), [ttsReadWholePage]);
    useEffect(() => localStorage.setItem('accessibility-ttsMovableControls', ttsMovableControls.toString()), [ttsMovableControls]);
    useEffect(() => localStorage.setItem('accessibility-ttsVoiceGender', ttsVoiceGender), [ttsVoiceGender]);
    useEffect(() => localStorage.setItem('accessibility-ttsReadingSpeed', ttsReadingSpeed.toString()), [ttsReadingSpeed]);
    useEffect(() => localStorage.setItem('accessibility-ttsReadSelectedText', ttsReadSelectedText.toString()), [ttsReadSelectedText]);
    useEffect(() => localStorage.setItem('accessibility-ttsHoverToSpeak', ttsReadHoveredText.toString()), [ttsReadHoveredText]);
    useEffect(() => localStorage.setItem('accessibility-realTimeTranslation', realTimeTranslation.toString()), [realTimeTranslation]);
    useEffect(() => localStorage.setItem('accessibility-selectionLanguage', selectionLanguage), [selectionLanguage]);

    useEffect(() => {
        if (!textToSpeech) {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            clearAllHighlights();
            setTtsAutoPlay(false);
            setTtsReadWholePage(false);
            setTtsHoverToSpeak(false);
            setTtsMovableControls(false);
            setIsPaused(false);
        }
    }, [textToSpeech]);


    const ttsReadWholePageRef = useRef(ttsReadWholePage);
    const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isScrollingRef = useRef(false); // Track scrolling state for mobile

    useEffect(() => {
        ttsReadWholePageRef.current = ttsReadWholePage;
    }, [ttsReadWholePage]);

    useEffect(() => {
        if (!textToSpeech) return;

        // Prevents duplicate loops if effect re-runs rapidly
        let isEffectActive = true;

        const speak = async (text: string, container?: HTMLElement, options: { autoplay?: boolean } = { autoplay: true }): Promise<HTMLAudioElement | null> => {
            if (!text) return null;
            const audio = await apiSpeak(text, ttsVoiceGender as any, ttsReadingSpeed, options);
            if (audio && container && options.autoplay !== false) {
                if (isEffectActive) {
                    startAIHighlightingSync(audio, text, container, ttsReadingSpeed);
                }
            }
            return audio;
        };

        const handleSelection = (e: MouseEvent | TouchEvent) => {
            if (!ttsReadSelectedText && !ttsAutoPlay) return;

            // On mobile, if user was scrolling, ignore the touchend event
            if (e.type === 'touchend' && isScrollingRef.current) {
                return;
            }

            // Clear previous timeout to debounce the event
            if (selectionTimeoutRef.current) {
                clearTimeout(selectionTimeoutRef.current);
            }

            // Use a slightly longer timeout for mobile to ensure selection is complete
            selectionTimeoutRef.current = setTimeout(() => {
                if (!isEffectActive) return;

                const selection = window.getSelection();
                const selectedText = selection?.toString().trim() || '';

                // 1. Priority: If user manually selected any text
                // Check if either 'Read Selected' OR 'Click to Speak' (AutoPlay) is on.
                // This ensures that even if only "Click to Speak" is enabled, manual selections are still read (user request).
                if ((ttsReadSelectedText || ttsAutoPlay) && selectedText.length > 0) {
                    // Start visual highlighting and use it as the context container
                    const selectionSpan = highlightSelectedText();
                    const container = selectionSpan || document.body;
                    speak(selectedText, container);
                    return;
                }

                // 2. Fallback: If it was just a click (no selection) and "Click to Read" is ON
                if (ttsAutoPlay && selectedText.length === 0) {
                    const target = e.target as HTMLElement;
                    if (target && !target.closest('.accessibility-bar')) {
                        const clientX = 'clientX' in e ? e.clientX : (e as TouchEvent).changedTouches[0].clientX;
                        const clientY = 'clientY' in e ? e.clientY : (e as TouchEvent).changedTouches[0].clientY;

                        const wordInfo = getWordAtPoint(clientX, clientY);
                        if (wordInfo) {
                            speak(wordInfo.text, wordInfo.container);
                        } else {
                            // Fallback to element text if word extraction fails
                            const text = target.innerText?.trim() || target.textContent?.trim();
                            if (text) speak(text, target);
                        }
                    }
                }
            }, 150);
        };

        const getWordAtPoint = (clientX: number, clientY: number): { text: string, container: HTMLElement } | null => {
            let range: Range | null = null;
            let textNode: Node | null = null;
            let offset: number = 0;

            if ((document as any).caretRangeFromPoint) {
                range = (document as any).caretRangeFromPoint(clientX, clientY);
                if (range) {
                    textNode = range.startContainer;
                    offset = range.startOffset;
                }
            } else if ((document as any).caretPositionFromPoint) {
                const pos = (document as any).caretPositionFromPoint(clientX, clientY);
                if (pos) {
                    textNode = pos.offsetNode;
                    offset = pos.offset;
                }
            }

            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                const text = textNode.textContent || '';
                const before = text.substring(0, offset).split(/\s+/);
                const after = text.substring(offset).split(/\s+/);

                const wordBefore = before[before.length - 1];
                const wordAfter = after[0];

                // Combine parts to get the full word at cursor
                const word = (wordBefore + wordAfter).replace(/[.,!?;:()\[\]"']/g, '').trim();

                if (word.length > 0) {
                    return { text: word, container: textNode.parentElement as HTMLElement };
                }
            }
            return null;
        };

        const handleTouchMove = () => {
            isScrollingRef.current = true;
        };

        const handleMouseDown = (e: MouseEvent | TouchEvent) => {
            // Speech logic moved to handleSelection (mouseup/touchend) 
            // to allow dragging to select whole lines without immediate word playback.
            isScrollingRef.current = false; // Reset scroll state on new touch/click
        };

        const handleMouseOver = (e: MouseEvent) => {
            if (!ttsReadHoveredText) return;
            const target = e.target as HTMLElement;
            if (target && !target.closest('.accessibility-bar')) {
                const wordInfo = getWordAtPoint(e.clientX, e.clientY);
                if (wordInfo) {
                    speak(wordInfo.text, wordInfo.container);
                } else {
                    const text = target.innerText?.trim() || target.textContent?.trim();
                    if (text) speak(text, target);
                }
            }
        };

        const readWholePageSequentially = async () => {
            if (!hasInteracted) {
                console.log("[TTS] Waiting for user interaction before reading whole page...");
                return;
            }
            const content = document.getElementById('accessible-content') || document.body;
            // In embed mode, we might want to read everything, but let's be smart about it.
            // Exclude scripts, styles, and the accessibility bar itself.
            // Added 'header' to the selector to support standard headers. We remove the :not(:has(...)) from header
            // to ensure we capture "mixed content" headers. We will handle duplicates via runtime nesting checks.
            const blocks = Array.from(content.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, article, header, div:not(:has(p, h1, h2, h3, h4, h5, h6, li, blockquote, article))')) as HTMLElement[];

            let nextAudioPromise: Promise<HTMLAudioElement | null> | null = null;
            let lastPlayedBlock: HTMLElement | null = null;

            for (let i = 0; i < blocks.length; i++) {
                if (!isEffectActive || !ttsReadWholePageRef.current) break; // Terminate if new effect started

                const block = blocks[i];
                if (block.closest('.accessibility-bar')) continue;

                // Skip if this block is inside the last played block (prevents duplicates when we read a parent container like <header>)
                if (lastPlayedBlock && lastPlayedBlock.contains(block)) continue;

                const text = block.innerText?.trim();
                if (!text || text.length === 0) continue;

                // 1. Get audio for current block (either from prefetch or fetch now)
                let audio: HTMLAudioElement | null = null;
                if (nextAudioPromise) {
                    audio = await nextAudioPromise;
                    nextAudioPromise = null;
                } else {
                    audio = await speak(text, block);
                }

                if (!isEffectActive) {
                    if (audio) { audio.pause(); }
                    break;
                }

                // 2. Start pre-fetching the NEXT block in parallel while current one plays
                if (i + 1 < blocks.length && ttsReadWholePageRef.current && isEffectActive) {
                    const nextBlock = blocks[i + 1];
                    const nextText = nextBlock.innerText?.trim();
                    if (nextText && nextText.length > 0) {
                        // Pass autoplay: false so it doesn't start speaking immediately
                        nextAudioPromise = speak(nextText, nextBlock, { autoplay: false });
                    }
                }

                if (audio) {
                    if (audio.paused) {
                        try {
                            setAsCurrentAudio(audio);
                            await audio.play();
                            startAIHighlightingSync(audio, text, block, ttsReadingSpeed);
                        } catch (err) {
                            console.error("Playback error after prefetch:", err);
                        }
                    }

                    await new Promise<void>((resolve) => {
                        audio!.onended = () => resolve();
                        audio!.onerror = () => resolve();
                        const checkInterval = setInterval(() => {
                            if (!ttsReadWholePageRef.current || !isEffectActive) {
                                audio!.pause();
                                clearInterval(checkInterval);
                                resolve();
                            }
                        }, 500);
                        audio!.addEventListener('ended', () => {
                            clearInterval(checkInterval);
                            resolve();
                        }, { once: true });
                    });

                    lastPlayedBlock = block;
                }
            }
        };

        if (ttsReadWholePage) {
            readWholePageSequentially();
        }

        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('touchend', handleSelection);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('touchstart', handleMouseDown, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true }); // New: Track scrolling
        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            isEffectActive = false; // Kill any running loops
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('touchend', handleSelection);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('touchstart', handleMouseDown);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mouseover', handleMouseOver);
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            clearAllHighlights();
            stopAIHighlightingSync();
        };
    }, [textToSpeech, ttsAutoPlay, ttsReadWholePage, ttsReadingSpeed, ttsVoiceGender, ttsReadSelectedText, ttsReadHoveredText, hasInteracted]);

    const fetchSummarizationHistory = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.HISTORY);
            if (response.ok) {
                const data = await response.json();
                setSummarizationHistory(data);
            }
        } catch (error) {
            console.error('Failed to fetch summarization history:', error);
        }
    };

    const deleteHistoryItem = async (id: string) => {
        try {
            const response = await fetch(API_ENDPOINTS.DELETE_HISTORY_ITEM(id), {
                method: 'DELETE',
            });
            if (response.ok) {
                setSummarizationHistory(prev => prev.filter(item => item._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete history item:', error);
        }
    };

    const pauseTts = () => {
        if (window.speechSynthesis?.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const resumeTts = () => {
        if (window.speechSynthesis?.paused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    };

    const stopTts = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsPaused(false);
        }
        clearAllHighlights(false);
    };

    return {
        textToSpeech, setTextToSpeech,
        speechToText, setSpeechToText,
        onPageDictionary, setOnPageDictionary,
        keyboardNavigation, setKeyboardNavigation,
        pageSummary, setPageSummary,
        summaryContent, setSummaryContent,
        summarizationHistory, setSummarizationHistory,
        fetchSummarizationHistory,
        deleteHistoryItem,
        ttsAutoPlay, setTtsAutoPlay,
        ttsReadWholePage, setTtsReadWholePage,
        ttsMovableControls, setTtsMovableControls,
        ttsVoiceGender, setTtsVoiceGender,
        ttsReadingSpeed, setTtsReadingSpeed,
        ttsReadSelectedText, setTtsReadSelectedText,
        ttsHoverToSpeak: ttsReadHoveredText, setTtsHoverToSpeak,
        pronunciationGuide, setPronunciationGuide,
        smartSuggestions, setSmartSuggestions,
        realTimeTranslation, setRealTimeTranslation,
        selectionLanguage, setSelectionLanguage,
        isPaused, pauseTts, resumeTts, stopTts
    };
}
