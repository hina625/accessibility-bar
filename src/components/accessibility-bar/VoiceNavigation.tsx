'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import { API_ENDPOINTS } from '@/config/api';
import { translations } from '@/contexts/accessibility/translations';
import InfoPopupButton from './InfoPopupButton';

export default function VoiceNavigation() {
    const { toggleDarkMode, toggleHighContrast, increaseFontSize, decreaseFontSize, barTheme, language } = useAccessibility();
    const theme = BAR_THEMES[barTheme];
    const t = translations[language] || translations['en'];

    const [isEnabled, setIsEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [lastHeard, setLastHeard] = useState('');
    const [feedback, setFeedback] = useState('');
    const [recognitionRef, recognitionRefCurrent] = [useRef<any>(null), null]; // Using dummy for consistency in thought
    const recognition = useRef<any>(null);
    const isListeningRef = useRef(false);
    const focusedLinkIndex = useRef(0);
    const focusedButtonIndex = useRef(0);

    const LANGUAGES = [
        { code: 'en-GB', name: 'English (UK)' },
        { code: 'ur-PK', name: 'Urdu (اردو)' },
        { code: 'hi-IN', name: 'Hindi (हिंदी)' },
        { code: 'ar-SA', name: 'Arabic (العربية)' },
        { code: 'es-ES', name: 'Spanish' },
        { code: 'fr-FR', name: 'French' },
        { code: 'de-DE', name: 'German' },
    ];

    const [voiceLang, setVoiceLang] = useState('en-GB');

    // Execute action based on AI-parsed command
    const executeAction = useCallback((action: string) => {
        let feedbackMessage = '';

        switch (action) {
            case 'scroll_down':
                window.scrollBy({ top: 300, behavior: 'smooth' });
                feedbackMessage = '⬇️ Scrolling down';
                break;
            case 'scroll_up':
                window.scrollBy({ top: -300, behavior: 'smooth' });
                feedbackMessage = '⬆️ Scrolling up';
                break;
            case 'go_top':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                feedbackMessage = '⬆️ Going to top';
                break;
            case 'go_bottom':
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                feedbackMessage = '⬇️ Going to bottom';
                break;
            case 'go_back':
                window.history.back();
                feedbackMessage = '◀️ Going back';
                break;
            case 'go_forward':
                window.history.forward();
                feedbackMessage = '▶️ Going forward';
                break;
            case 'refresh':
                window.location.reload();
                feedbackMessage = '🔄 Refreshing';
                break;
            case 'click':
                const activeElement = document.activeElement as HTMLElement;
                if (activeElement && activeElement !== document.body) {
                    activeElement.click();
                    feedbackMessage = '👆 Clicked!';
                } else {
                    feedbackMessage = '❌ No element focused';
                }
                break;
            case 'next_link':
                const links = Array.from(document.querySelectorAll('a[href]')) as HTMLElement[];
                if (links.length > 0) {
                    focusedLinkIndex.current = (focusedLinkIndex.current + 1) % links.length;
                    links[focusedLinkIndex.current].focus();
                    links[focusedLinkIndex.current].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    feedbackMessage = `🔗 Link ${focusedLinkIndex.current + 1}/${links.length}`;
                }
                break;
            case 'next_button':
                const buttons = Array.from(document.querySelectorAll('button')) as HTMLElement[];
                if (buttons.length > 0) {
                    focusedButtonIndex.current = (focusedButtonIndex.current + 1) % buttons.length;
                    buttons[focusedButtonIndex.current].focus();
                    buttons[focusedButtonIndex.current].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    feedbackMessage = `🔘 Button ${focusedButtonIndex.current + 1}/${buttons.length}`;
                }
                break;
            case 'increase_font':
                increaseFontSize();
                feedbackMessage = '🔠 Font increased';
                break;
            case 'decrease_font':
                decreaseFontSize();
                feedbackMessage = '🔡 Font decreased';
                break;
            case 'dark_mode':
                toggleDarkMode();
                feedbackMessage = '🌙 Dark mode toggled';
                break;
            case 'high_contrast':
                toggleHighContrast();
                feedbackMessage = '⚡ Contrast toggled';
                break;
            default:
                feedbackMessage = '🎯 Listening...';
        }

        if (feedbackMessage) {
            setFeedback(feedbackMessage);
            setTimeout(() => setFeedback('🎤 Listening...'), 2000);
        }
    }, [increaseFontSize, decreaseFontSize, toggleDarkMode, toggleHighContrast]);

    // Parse voice command using AI
    const parseCommand = useCallback(async (text: string) => {
        setLastHeard(text);

        try {
            const response = await fetch(API_ENDPOINTS.VOICE_COMMAND, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('AI parsed action:', data.action);
                executeAction(data.action);
            }
        } catch (error) {
            console.error('Voice command parse error:', error);
        }
    }, [executeAction]);

    // Initialize speech recognition
    useEffect(() => {
        if (!isEnabled) {
            if (recognition.current) {
                recognition.current.stop();
            }
            setIsListening(false);
            isListeningRef.current = false;
            return;
        }

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = true;
            recognition.current.interimResults = false;
            recognition.current.lang = voiceLang;

            recognition.current.onresult = (event: any) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                console.log('Heard:', transcript);
                parseCommand(transcript);
            };

            recognition.current.onerror = (event: any) => {
                const error = event.error?.toString() || '';
                // Ignore common expected events
                if (error === 'aborted' || error === 'no-speech') return;
                console.error('Speech recognition error:', error);

                if (isEnabled && isListeningRef.current) {
                    setTimeout(() => {
                        try { recognition.current?.start(); } catch (e) { }
                    }, 500);
                }
            };

            recognition.current.onend = () => {
                if (isEnabled && isListeningRef.current) {
                    setTimeout(() => {
                        try {
                            recognition.current?.start();
                        } catch (e) { }
                    }, 100);
                }
            };

            try {
                recognition.current.start();
                setIsListening(true);
                isListeningRef.current = true;
                setFeedback('🎤 Listening...');
            } catch (e) { }
        }

        return () => {
            if (recognition.current) {
                recognition.current.onresult = null;
                recognition.current.onerror = null;
                recognition.current.onend = null;
                try { recognition.current.stop(); } catch (e) { }
            }
        };
    }, [isEnabled, voiceLang, parseCommand]);

    const startListening = () => {
        if (recognition.current) {
            try {
                isListeningRef.current = true;
                recognition.current.start();
                setIsListening(true);
                setFeedback('🎤 Listening...');
            } catch (e) { }
        }
    };

    const stopListening = () => {
        if (recognition.current) {
            isListeningRef.current = false;
            recognition.current.stop();
            setIsListening(false);
            setFeedback('');
        }
    };

    return (
        <div className="space-y-4">
            {/* Enable Toggle */}
            <div
                className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
                style={{ backgroundColor: theme.hover }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                onClick={() => setIsEnabled(!isEnabled)}
            >
                <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[16px] font-medium" style={{ color: theme.text }}>{t.controls.voiceControl}</span>
                        <div onClick={(e) => e.stopPropagation()}>
                            <InfoPopupButton
                                title={t.controls.voiceControl}
                                description={t.info?.speech?.features?.["Voice Navigation"] || "Control the website using voice commands."}
                            />
                        </div>
                    </div>
                    <span className="text-[14px]" style={{ color: theme.text, opacity: 0.7 }}>{t.controls.voiceControlDesc}</span>
                </div>
                <div
                    className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
                    style={{
                        backgroundColor: isEnabled ? theme.active : 'rgba(255, 255, 255, 0.9)',
                        border: isEnabled ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                >
                    {isEnabled && (
                        <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>

            {isEnabled && (
                <>
                    {/* Language Selection */}
                    <div>
                        <label className="text-[16px] font-medium mb-1 block" style={{ color: theme.text }}>
                            {t.common.language || 'Language'}
                        </label>
                        <select
                            value={voiceLang}
                            onChange={(e) => setVoiceLang(e.target.value)}
                            className="w-full px-3 py-3 rounded-lg text-[16px] appearance-none bg-no-repeat"
                            style={{ backgroundColor: theme.active, color: theme.text, border: `1px solid ${theme.border}` }}
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Start/Stop Listening Button */}
                    <button
                        onClick={isListening ? stopListening : startListening}
                        className="w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                        style={{ backgroundColor: isListening ? '#DC2626' : theme.hover, color: theme.text }}
                    >
                        {isListening ? (
                            <>
                                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: theme.text }} />
                                {t.controls.stopListening}
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                                {t.controls.startListening}
                            </>
                        )}
                    </button>

                    {/* Feedback Display */}
                    {feedback && (
                        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: theme.active }}>
                            <p className="text-[16px] font-medium" style={{ color: theme.text }}>{feedback}</p>
                        </div>
                    )}

                    {/* Last Heard */}
                    {lastHeard && (
                        <div className="text-[14px] text-center bg-transparent rounded-lg p-2" style={{ color: theme.text, opacity: 0.7 }}>
                            Heard: "{lastHeard}"
                        </div>
                    )}

                    {/* Example Command */}
                    <div className="text-[12px] text-center mt-3 opacity-60 space-y-1 px-4 leading-relaxed" style={{ color: theme.text }}>
                        <p className="font-bold uppercase tracking-wider mb-1 opacity-80">Try commands like:</p>
                        <p>"Dark Mode", "Increase Text"</p>
                        <p>"Go to Top", "Refresh Page", "Next Link"</p>
                    </div>
                </>
            )}
        </div>
    );
}
