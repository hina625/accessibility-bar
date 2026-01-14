import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { speakWithHighlighting, clearAllHighlights } from '@/utils/ttsHighlighting';

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
    const [ttsVoiceGender, setTtsVoiceGender] = useState<'male' | 'female' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'>('female');
    const [ttsReadingSpeed, setTtsReadingSpeed] = useState<number>(1);
    const [ttsReadSelectedText, setTtsReadSelectedText] = useState<boolean>(false);
    const [ttsHoverToSpeak, setTtsHoverToSpeak] = useState<boolean>(false);
    const [realTimeTranslation, setRealTimeTranslation] = useState<boolean>(false);
    const [selectionLanguage, setSelectionLanguage] = useState<string>('es');
    const [isPaused, setIsPaused] = useState<boolean>(false);


    useEffect(() => {
        // Don't load from localStorage on initial mount - start with defaults
        // Styles will only be applied when user explicitly selects options
        // Only load language preference as it doesn't affect page styling
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

    useEffect(() => localStorage.setItem('accessibility-textToSpeech', textToSpeech.toString()), [textToSpeech]);
    useEffect(() => localStorage.setItem('accessibility-ttsAutoPlay', ttsAutoPlay.toString()), [ttsAutoPlay]);
    useEffect(() => localStorage.setItem('accessibility-ttsReadWholePage', ttsReadWholePage.toString()), [ttsReadWholePage]);
    useEffect(() => localStorage.setItem('accessibility-ttsMovableControls', ttsMovableControls.toString()), [ttsMovableControls]);
    useEffect(() => localStorage.setItem('accessibility-ttsVoiceGender', ttsVoiceGender), [ttsVoiceGender]);
    useEffect(() => localStorage.setItem('accessibility-ttsReadingSpeed', ttsReadingSpeed.toString()), [ttsReadingSpeed]);
    useEffect(() => localStorage.setItem('accessibility-ttsReadSelectedText', ttsReadSelectedText.toString()), [ttsReadSelectedText]);
    useEffect(() => localStorage.setItem('accessibility-ttsHoverToSpeak', ttsHoverToSpeak.toString()), [ttsHoverToSpeak]);
    useEffect(() => localStorage.setItem('accessibility-realTimeTranslation', realTimeTranslation.toString()), [realTimeTranslation]);
    useEffect(() => localStorage.setItem('accessibility-selectionLanguage', selectionLanguage), [selectionLanguage]);


    useEffect(() => {
        if (!textToSpeech) {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            clearAllHighlights();
            setTtsAutoPlay(false);
            setTtsReadWholePage(false);
            setTtsHoverToSpeak(false);
            setTtsMovableControls(false);
            setIsPaused(false);
        }
    }, [textToSpeech]);

    useEffect(() => {
        if (!textToSpeech) return;

        const getVoices = () => {
            return new Promise<SpeechSynthesisVoice[]>((resolve) => {
                let voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    resolve(voices);
                    return;
                }
                const handler = () => {
                    window.speechSynthesis.removeEventListener('voiceschanged', handler);
                    resolve(window.speechSynthesis.getVoices());
                };
                window.speechSynthesis.addEventListener('voiceschanged', handler);

                setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
            });
        };

        const speak = async (text: string, container?: HTMLElement, isSelected: boolean = false) => {
            if (!window.speechSynthesis) {
                console.error('Speech synthesis not supported');
                return;
            }

            console.log('Speaking text (length):', text.length);
            window.speechSynthesis.cancel();

            const voices = await getVoices();
            console.log('Available voices:', voices.length);

            const targetContainer = container || document.getElementById('accessible-content') || document.body;

            // Find voice based on selection
            let selectedVoice: SpeechSynthesisVoice | undefined;
            if (voices.length > 0) {
                const voiceName = ttsVoiceGender.toLowerCase();
                switch (voiceName) {
                    case 'alloy':
                        selectedVoice = voices.find(v => 
                            v.name.toLowerCase().includes('samantha') || 
                            v.name.toLowerCase().includes('alex') ||
                            v.name.toLowerCase().includes('karen')
                        ) || voices.find(v => v.lang.startsWith('en'));
                        break;
                    case 'echo':
                    case 'fable':
                    case 'onyx':
                    case 'male':
                        selectedVoice = voices.find(v =>
                            v.name.toLowerCase().includes('male') || 
                            v.name.toLowerCase().includes('david') || 
                            v.name.toLowerCase().includes('guy') || 
                            v.name.toLowerCase().includes('microsoft david') || 
                            v.name.toLowerCase().includes('daniel') || 
                            v.name.toLowerCase().includes('thomas') ||
                            v.name.toLowerCase().includes('alex')
                        );
                        break;
                    case 'nova':
                    case 'shimmer':
                    case 'female':
                        selectedVoice = voices.find(v =>
                            v.name.toLowerCase().includes('female') || 
                            v.name.toLowerCase().includes('zira') || 
                            v.name.toLowerCase().includes('samantha') || 
                            v.name.toLowerCase().includes('microsoft zira') || 
                            v.name.toLowerCase().includes('hazel') || 
                            v.name.toLowerCase().includes('susan') ||
                            v.name.toLowerCase().includes('karen')
                        );
                        break;
                }
            }

            // Use highlighting function
            return speakWithHighlighting(text, targetContainer, {
                rate: ttsReadingSpeed,
                voice: selectedVoice,
                isSelectedText: isSelected,
                onEnd: () => {
                    console.log('Speech ended');
                },
                onError: (error) => {
                    console.error('TTS Error:', error);
                }
            });
        };

        const handleMouseUp = () => {
            setTimeout(() => {
                const selection = window.getSelection();
                const selectedText = selection?.toString().trim();

                if (selectedText && selectedText.length > 0 && selection && selection.rangeCount > 0) {
                    console.log('Selected text to speak:', selectedText);
                    const range = selection.getRangeAt(0);
                    const container = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
                        ? (range.commonAncestorContainer.parentElement as HTMLElement)
                        : (range.commonAncestorContainer as HTMLElement);

                    if (container) {
                        const contentContainer = container.closest('#accessible-content') || document.body;
                        speak(selectedText, contentContainer as HTMLElement, true);
                    } else {
                        speak(selectedText, undefined, true);
                    }
                }
            }, 50);
        };

        if (ttsReadWholePage) {
            let content = document.getElementById('accessible-content') || document.body;

            // Check for embed mode (iframe) - try to access parent document
            try {
                if (window.parent && window.parent !== window) {
                    const parentDoc = window.parent.document;
                    // Try to find specific content container first, then fallback to body
                    content = parentDoc.getElementById('accessible-content') || parentDoc.body;
                }
            } catch (e) {
                // Cross-origin access might fail, fall back to local content
                console.warn('Cannot access parent document for TTS:', e);
            }

            if (content) {
                console.log('Reading whole page content...');
                speak(content.innerText, content as HTMLElement, false);
            } else {
                console.warn('No content found to read');
            }
        } else {

            if (window.speechSynthesis) {
                console.log('Read Whole Page disabled, cancelling synthesis');
                window.speechSynthesis.cancel();
                // Clear highlights smoothly without page refresh
                clearAllHighlights(false);
            }
        }

        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            clearAllHighlights();
        };
    }, [textToSpeech, ttsReadWholePage, ttsReadingSpeed, ttsVoiceGender]);


    useEffect(() => {
        if (!textToSpeech || !ttsHoverToSpeak) {
            return;
        }

        let lastElement: HTMLElement | null = null;
        let speakTimeout: any = null;

        const speak = async (text: string) => {
            if (!window.speechSynthesis) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = ttsReadingSpeed;

            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                const voiceName = ttsVoiceGender.toLowerCase();
                let selectedVoice: SpeechSynthesisVoice | undefined;
                switch (voiceName) {
                    case 'alloy':
                        selectedVoice = voices.find(v => 
                            v.name.toLowerCase().includes('samantha') || 
                            v.name.toLowerCase().includes('alex') ||
                            v.name.toLowerCase().includes('karen')
                        ) || voices.find(v => v.lang.startsWith('en'));
                        break;
                    case 'echo':
                    case 'fable':
                    case 'onyx':
                    case 'male':
                        selectedVoice = voices.find(v =>
                            v.name.toLowerCase().includes('male') || 
                            v.name.toLowerCase().includes('david') || 
                            v.name.toLowerCase().includes('guy') || 
                            v.name.toLowerCase().includes('microsoft david') || 
                            v.name.toLowerCase().includes('daniel') || 
                            v.name.toLowerCase().includes('thomas') ||
                            v.name.toLowerCase().includes('alex')
                        );
                        break;
                    case 'nova':
                    case 'shimmer':
                    case 'female':
                        selectedVoice = voices.find(v =>
                            v.name.toLowerCase().includes('female') || 
                            v.name.toLowerCase().includes('zira') || 
                            v.name.toLowerCase().includes('samantha') || 
                            v.name.toLowerCase().includes('microsoft zira') || 
                            v.name.toLowerCase().includes('hazel') || 
                            v.name.toLowerCase().includes('susan') ||
                            v.name.toLowerCase().includes('karen')
                        );
                        break;
                }
                if (selectedVoice) utterance.voice = selectedVoice;
            }
            window.speechSynthesis.speak(utterance);
        };

        const handleMouseOver = (e: MouseEvent) => {

            const path = e.composedPath();
            const target = path[0] as HTMLElement;

            if (!target || target === lastElement) return;


            const isBar = path.some(node =>
                (node as HTMLElement).classList?.contains('accessibility-bar') ||
                (node as HTMLElement).id === 'a11y-embed-host-react'
            );
            if (isBar) return;

            const text = target.innerText?.trim();
            if (text && text.length > 0) {
                lastElement = target;
                if (speakTimeout) clearTimeout(speakTimeout);

                speakTimeout = setTimeout(() => {
                    speak(text);
                }, 400);
            }
        };

        document.addEventListener('mouseover', handleMouseOver);
        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            if (speakTimeout) clearTimeout(speakTimeout);
        };
    }, [textToSpeech, ttsHoverToSpeak, ttsReadingSpeed, ttsVoiceGender]);


    useEffect(() => {
        if (!textToSpeech || !ttsAutoPlay) return;

        const getVoices = async (): Promise<SpeechSynthesisVoice[]> => {
            return new Promise((resolve) => {
                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    resolve(voices);
                } else {
                    window.speechSynthesis.onvoiceschanged = () => {
                        resolve(window.speechSynthesis.getVoices());
                    };
                }
            });
        };

        const handleClick = (e: MouseEvent) => {
            const path = e.composedPath();
            const target = path[0] as HTMLElement;
            if (!target) return;

            const isBarOrTrigger = path.some(node =>
                (node as HTMLElement).classList?.contains('accessibility-bar') ||
                (node as HTMLElement).classList?.contains('accessibility-trigger') ||
                (node as HTMLElement).id === 'a11y-embed-host-react'
            );
            if (isBarOrTrigger) return;

            // Get text from clicked element and its parent for better context
            let text = target.innerText?.trim() || target.textContent?.trim();
            let container: HTMLElement | undefined = target;

            // Try to find a better container (paragraph, div with text)
            if (!text || text.length === 0) {
                const parent = target.parentElement;
                if (parent) {
                    text = parent.innerText?.trim() || parent.textContent?.trim();
                    container = parent;
                }
            }

            if (text && text.length > 0 && container) {
                // Use highlighting for click text to speech with voice selection
                getVoices().then(voices => {
                    let selectedVoice: SpeechSynthesisVoice | undefined;
                    if (voices.length > 0) {
                        const voiceName = ttsVoiceGender.toLowerCase();
                        switch (voiceName) {
                            case 'alloy':
                                selectedVoice = voices.find(v => 
                                    v.name.toLowerCase().includes('samantha') || 
                                    v.name.toLowerCase().includes('alex') ||
                                    v.name.toLowerCase().includes('karen')
                                ) || voices.find(v => v.lang.startsWith('en'));
                                break;
                            case 'echo':
                            case 'fable':
                            case 'onyx':
                            case 'male':
                                selectedVoice = voices.find(v =>
                                    v.name.toLowerCase().includes('male') || 
                                    v.name.toLowerCase().includes('david') || 
                                    v.name.toLowerCase().includes('guy') || 
                                    v.name.toLowerCase().includes('microsoft david') || 
                                    v.name.toLowerCase().includes('daniel') || 
                                    v.name.toLowerCase().includes('thomas') ||
                                    v.name.toLowerCase().includes('alex')
                                );
                                break;
                            case 'nova':
                            case 'shimmer':
                            case 'female':
                                selectedVoice = voices.find(v =>
                                    v.name.toLowerCase().includes('female') || 
                                    v.name.toLowerCase().includes('zira') || 
                                    v.name.toLowerCase().includes('samantha') || 
                                    v.name.toLowerCase().includes('microsoft zira') || 
                                    v.name.toLowerCase().includes('hazel') || 
                                    v.name.toLowerCase().includes('susan') ||
                                    v.name.toLowerCase().includes('karen')
                                );
                                break;
                        }
                    }

                    const contentContainer = container.closest('#accessible-content') || container || document.body;
                    speakWithHighlighting(text, contentContainer as HTMLElement, {
                        rate: ttsReadingSpeed,
                        voice: selectedVoice,
                        isSelectedText: false, // Treat as whole element text
                        onEnd: () => {
                            console.log('Click TTS ended');
                        },
                        onError: (error) => {
                            console.error('Click TTS Error:', error);
                        }
                    });
                });
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [textToSpeech, ttsAutoPlay, ttsReadingSpeed, ttsVoiceGender]);

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
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete history item');
            }
        } catch (error) {
            console.error('Failed to delete history item:', error);
            throw error;
        }
    };

    const pauseTts = () => {
        if (window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const resumeTts = () => {
        if (window.speechSynthesis && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    };

    const stopTts = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsPaused(false);
        }
        // Clear highlights smoothly
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
        ttsHoverToSpeak, setTtsHoverToSpeak,
        pronunciationGuide, setPronunciationGuide,
        smartSuggestions, setSmartSuggestions,
        realTimeTranslation, setRealTimeTranslation,
        selectionLanguage, setSelectionLanguage,
        isPaused, pauseTts, resumeTts, stopTts
    };
}
