import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/api';

export function useToolsSettings() {
    const [textToSpeech, setTextToSpeech] = useState<boolean>(false);
    const [speechToText, setSpeechToText] = useState<boolean>(false);
    const [onPageDictionary, setOnPageDictionary] = useState<boolean>(false);
    const [keyboardNavigation, setKeyboardNavigation] = useState<boolean>(false);
    const [pronunciationGuide, setPronunciationGuide] = useState<boolean>(false);

    const [pageSummary, setPageSummary] = useState<boolean>(false);
    const [summaryContent, setSummaryContent] = useState<string>('');
    const [summarizationHistory, setSummarizationHistory] = useState<any[]>([]);
    const [smartSuggestions, setSmartSuggestions] = useState<boolean>(true); // Default to true for "next feature" impact

    const [ttsAutoPlay, setTtsAutoPlay] = useState<boolean>(false);
    const [ttsReadWholePage, setTtsReadWholePage] = useState<boolean>(false);
    const [ttsMovableControls, setTtsMovableControls] = useState<boolean>(false);
    const [ttsVoiceGender, setTtsVoiceGender] = useState<'male' | 'female'>('female');
    const [ttsReadingSpeed, setTtsReadingSpeed] = useState<number>(1);
    const [ttsReadSelectedText, setTtsReadSelectedText] = useState<boolean>(false);
    const [ttsHoverToSpeak, setTtsHoverToSpeak] = useState<boolean>(false);
    const [realTimeTranslation, setRealTimeTranslation] = useState<boolean>(false);
    const [selectionLanguage, setSelectionLanguage] = useState<string>('es');
    const [isPaused, setIsPaused] = useState<boolean>(false);


    useEffect(() => {
        const saved = {
            textToSpeech: localStorage.getItem('accessibility-textToSpeech'),
            keyboardNavigation: localStorage.getItem('accessibility-keyboardNavigation'),
            onPageDictionary: localStorage.getItem('accessibility-onPageDictionary'),
            ttsAutoPlay: localStorage.getItem('accessibility-ttsAutoPlay'),
            ttsReadWholePage: localStorage.getItem('accessibility-ttsReadWholePage'),
            ttsMovableControls: localStorage.getItem('accessibility-ttsMovableControls'),
            ttsVoiceGender: localStorage.getItem('accessibility-ttsVoiceGender'),
            ttsReadingSpeed: localStorage.getItem('accessibility-ttsReadingSpeed'),
            ttsReadSelectedText: localStorage.getItem('accessibility-ttsReadSelectedText'),
            ttsHoverToSpeak: localStorage.getItem('accessibility-ttsHoverToSpeak'),
            pronunciationGuide: localStorage.getItem('accessibility-pronunciationGuide'),
            smartSuggestions: localStorage.getItem('accessibility-smartSuggestions'),
            pageSummary: localStorage.getItem('accessibility-pageSummary'),
            realTimeTranslation: localStorage.getItem('accessibility-realTimeTranslation'),
            selectionLanguage: localStorage.getItem('accessibility-selectionLanguage'),
        };

        if (saved.textToSpeech === 'true') setTextToSpeech(true);
        if (saved.keyboardNavigation === 'true') setKeyboardNavigation(true);
        if (saved.onPageDictionary === 'true') setOnPageDictionary(true);
        if (saved.ttsAutoPlay === 'true') setTtsAutoPlay(true);
        if (saved.ttsReadWholePage === 'true') setTtsReadWholePage(true);
        if (saved.ttsMovableControls === 'true') setTtsMovableControls(true);
        if (saved.ttsVoiceGender) setTtsVoiceGender(saved.ttsVoiceGender as any);
        if (saved.ttsReadingSpeed) setTtsReadingSpeed(Number(saved.ttsReadingSpeed));
        if (saved.ttsReadSelectedText === 'true') setTtsReadSelectedText(true);
        if (saved.ttsHoverToSpeak === 'true') setTtsHoverToSpeak(true);
        if (saved.pronunciationGuide === 'true') setPronunciationGuide(true);
        if (saved.smartSuggestions === 'false') setSmartSuggestions(false); // Default logic inverted because default is true
        if (saved.pageSummary === 'true') setPageSummary(true);
        if (saved.realTimeTranslation === 'true') setRealTimeTranslation(true);
        if (saved.selectionLanguage) setSelectionLanguage(saved.selectionLanguage);
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


    // 1. Sync Logic: When main TTS is turned OFF, turn off all sub-features
    useEffect(() => {
        if (!textToSpeech) {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            setTtsAutoPlay(false);
            setTtsReadWholePage(false);
            setTtsHoverToSpeak(false);
            setTtsMovableControls(false);
            setIsPaused(false);
        }
    }, [textToSpeech]);

    // 2. Reading Logic: Handles actual speech synthesis
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
                // Fallback timeout
                setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
            });
        };

        const speak = async (text: string) => {
            if (!window.speechSynthesis) {
                console.error('Speech synthesis not supported');
                return;
            }

            console.log('Speaking text (length):', text.length);
            window.speechSynthesis.cancel();

            const voices = await getVoices();
            console.log('Available voices:', voices.length);

            // Split text into chunks to avoid browser limits (usually around 200-300 chars)
            const chunks = text.match(/[^.!?]+[.!?]+|[^.!?]+/g) || [text];

            for (const chunk of chunks) {
                if (chunk.trim().length === 0) continue;

                const utterance = new SpeechSynthesisUtterance(chunk.trim());
                utterance.rate = ttsReadingSpeed;

                if (voices.length > 0) {
                    const selectedVoice = voices.find(v =>
                        ttsVoiceGender === 'male'
                            ? (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('microsoft david'))
                            : (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('microsoft zira'))
                    );
                    if (selectedVoice) utterance.voice = selectedVoice;
                }

                // Create a promise to wait for this utterance to finish or error
                await new Promise((resolve) => {
                    utterance.onend = resolve;
                    utterance.onerror = (e) => {
                        console.error('TTS Chunk Error:', e);
                        resolve(null);
                    };
                    window.speechSynthesis.speak(utterance);
                });
            }
        };

        const handleMouseUp = () => {
            setTimeout(() => {
                const selection = window.getSelection();
                const selectedText = selection?.toString().trim();

                if (selectedText && selectedText.length > 0) {
                    console.log('Selected text to speak:', selectedText);
                    speak(selectedText);
                }
            }, 50);
        };

        if (ttsReadWholePage) {
            const content = document.getElementById('accessible-content') || document.body;
            if (content) {
                console.log('Reading whole page content...');
                speak(content.innerText);
            } else {
                console.warn('No content found to read');
            }
        } else {
            // Cancel speech if "Read Whole Page" is turned off
            if (window.speechSynthesis) {
                console.log('Read Whole Page disabled, cancelling synthesis');
                window.speechSynthesis.cancel();
            }
        }

        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            if (window.speechSynthesis) window.speechSynthesis.cancel();
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
                const selectedVoice = voices.find(v =>
                    ttsVoiceGender === 'male'
                        ? (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('microsoft david'))
                        : (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('microsoft zira'))
                );
                if (selectedVoice) utterance.voice = selectedVoice;
            }
            window.speechSynthesis.speak(utterance);
        };

        const handleMouseOver = (e: MouseEvent) => {
            // Use composedPath to find the actual element even through Shadow DOM
            const path = e.composedPath();
            const target = path[0] as HTMLElement;

            if (!target || target === lastElement) return;

            // Stop if we're hovering over the accessibility bar
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

        const speak = (text: string) => {
            if (!window.speechSynthesis) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = ttsReadingSpeed;

            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                const selectedVoice = voices.find(v =>
                    ttsVoiceGender === 'male'
                        ? (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('microsoft david'))
                        : (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('microsoft zira'))
                );
                if (selectedVoice) utterance.voice = selectedVoice;
            }
            window.speechSynthesis.speak(utterance);
        };

        const handleClick = (e: MouseEvent) => {
            const path = e.composedPath();
            const target = path[0] as HTMLElement;
            if (!target) return;

            // Filter elements: stop if we click the bar itself
            const isBarOrTrigger = path.some(node =>
                (node as HTMLElement).classList?.contains('accessibility-bar') ||
                (node as HTMLElement).classList?.contains('accessibility-trigger') ||
                (node as HTMLElement).id === 'a11y-embed-host-react'
            );
            if (isBarOrTrigger) return;

            const text = target.innerText?.trim();
            if (text && text.length > 0) {
                speak(text);
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
