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


    useEffect(() => {
        const saved = {
            keyboardNavigation: localStorage.getItem('accessibility-keyboardNavigation'),
            onPageDictionary: localStorage.getItem('accessibility-onPageDictionary'),
            ttsAutoPlay: localStorage.getItem('accessibility-ttsAutoPlay'),
            ttsReadWholePage: localStorage.getItem('accessibility-ttsReadWholePage'),
            ttsMovableControls: localStorage.getItem('accessibility-ttsMovableControls'),
            ttsVoiceGender: localStorage.getItem('accessibility-ttsVoiceGender'),
            ttsReadingSpeed: localStorage.getItem('accessibility-ttsReadingSpeed'),
            ttsReadSelectedText: localStorage.getItem('accessibility-ttsReadSelectedText'),
            pronunciationGuide: localStorage.getItem('accessibility-pronunciationGuide'),
            smartSuggestions: localStorage.getItem('accessibility-smartSuggestions'),
        };

        if (saved.keyboardNavigation === 'true') setKeyboardNavigation(true);
        if (saved.onPageDictionary === 'true') setOnPageDictionary(true);
        if (saved.ttsAutoPlay === 'true') setTtsAutoPlay(true);
        if (saved.ttsReadWholePage === 'true') setTtsReadWholePage(true);
        if (saved.ttsMovableControls === 'true') setTtsMovableControls(true);
        if (saved.ttsVoiceGender) setTtsVoiceGender(saved.ttsVoiceGender as any);
        if (saved.ttsReadingSpeed) setTtsReadingSpeed(Number(saved.ttsReadingSpeed));
        if (saved.ttsReadSelectedText === 'true') setTtsReadSelectedText(true);
        if (saved.pronunciationGuide === 'true') setPronunciationGuide(true);
        if (saved.smartSuggestions === 'false') setSmartSuggestions(false); // Default logic inverted because default is true
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
    }, [pageSummary]);

    useEffect(() => localStorage.setItem('accessibility-ttsAutoPlay', ttsAutoPlay.toString()), [ttsAutoPlay]);
    useEffect(() => localStorage.setItem('accessibility-ttsReadWholePage', ttsReadWholePage.toString()), [ttsReadWholePage]);
    useEffect(() => localStorage.setItem('accessibility-ttsMovableControls', ttsMovableControls.toString()), [ttsMovableControls]);
    useEffect(() => localStorage.setItem('accessibility-ttsVoiceGender', ttsVoiceGender), [ttsVoiceGender]);
    useEffect(() => localStorage.setItem('accessibility-ttsReadingSpeed', ttsReadingSpeed.toString()), [ttsReadingSpeed]);
    useEffect(() => localStorage.setItem('accessibility-ttsReadSelectedText', ttsReadSelectedText.toString()), [ttsReadSelectedText]);

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
        pronunciationGuide, setPronunciationGuide,
        smartSuggestions, setSmartSuggestions,
    };
}
