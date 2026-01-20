import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { speakWithHighlighting, clearAllHighlights } from '@/utils/ttsHighlighting';
import { speak as apiSpeak } from '@/utils/speechUtils';

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
    const [ttsVoiceGender, setTtsVoiceGender] = useState<'male' | 'female' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'>('nova');
    const [ttsReadingSpeed, setTtsReadingSpeed] = useState<number>(1);
    const [ttsReadSelectedText, setTtsReadSelectedText] = useState<boolean>(false);
    const [ttsReadHoveredText, setTtsHoverToSpeak] = useState<boolean>(false);
    const [realTimeTranslation, setRealTimeTranslation] = useState<boolean>(false);
    const [selectionLanguage, setSelectionLanguage] = useState<string>('es');
    const [isPaused, setIsPaused] = useState<boolean>(false);

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

    useEffect(() => localStorage.setItem('accessibility-textToSpeech', textToSpeech.toString()), [textToSpeech]);
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


    useEffect(() => {
        if (!textToSpeech) return;

        const speak = async (text: string) => {
            if (!text) return;
            await apiSpeak(text, ttsVoiceGender, ttsReadingSpeed);
        };

        const handleMouseUp = () => {
            if (!ttsReadSelectedText) return;
            setTimeout(() => {
                const selection = window.getSelection();
                const text = selection?.toString().trim();
                if (text) speak(text);
            }, 50);
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (!ttsAutoPlay) return;
            const target = e.target as HTMLElement;
            if (target && !target.closest('.accessibility-bar')) {
                const text = target.innerText?.trim() || target.textContent?.trim();
                if (text) speak(text);
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            if (!ttsReadHoveredText) return;
            const target = e.target as HTMLElement;
            if (target && !target.closest('.accessibility-bar')) {
                const text = target.innerText?.trim() || target.textContent?.trim();
                if (text) speak(text);
            }
        };

        if (ttsReadWholePage) {
            const content = document.getElementById('accessible-content') || document.body;
            if (content) speak(content.innerText);
        }

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseover', handleMouseOver);
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            clearAllHighlights();
        };
    }, [textToSpeech, ttsAutoPlay, ttsReadWholePage, ttsReadingSpeed, ttsVoiceGender, ttsReadSelectedText, ttsReadHoveredText]);

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
