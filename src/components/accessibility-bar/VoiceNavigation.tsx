'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import { API_ENDPOINTS } from '@/config/api';
import { translations } from '@/contexts/accessibility/translations';
import InfoPopupButton from './InfoPopupButton';

export default function VoiceNavigation() {
    const {
        toggleDarkMode, toggleHighContrast, increaseFontSize, decreaseFontSize,
        setGrayscale, setInvertColors, setReadingGuide,
        setReadingRuler, setReadingMask, setReadingSpotlight, setHighlightLinks,
        setHighlightHeadings, setLargeButtons, setHideImages, setPauseAnimations,
        setTextToSpeech, softReset, setPageZoom, setMagnifier,
        grayscale, invertColors, readingGuide, readingRuler, readingMask,
        readingSpotlight, highlightLinks, highlightHeadings, largeButtons,
        hideImages, pauseAnimations, textToSpeech, magnifier,
        barTheme, language
    } = useAccessibility();
    const theme = BAR_THEMES[barTheme];
    const t = translations[language] || translations['en'];

    const [isEnabled, setIsEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [lastHeard, setLastHeard] = useState('');
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState<string | null>(null);
    const recognition = useRef<any>(null);
    const isListeningRef = useRef(false);
    const focusedLinkIndex = useRef(0);
    const focusedButtonIndex = useRef(0);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                setIsSupported(false);
            }
        }
    }, []);

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

    // Scrape page context for the AI
    const getPageContext = useCallback(() => {
        const interactiveElements: any[] = [];
        let idCounter = 1;

        // Links
        document.querySelectorAll('a').forEach(el => {
            const text = el.innerText?.trim() || el.getAttribute('aria-label') || '';
            if (text && el.offsetParent !== null) { // visible
                const id = el.id || `context-link-${idCounter++}`;
                if (!el.id) el.id = id;
                interactiveElements.push({ type: 'link', text, id, href: el.href });
            }
        });

        // Buttons
        document.querySelectorAll('button').forEach(el => {
            const text = el.innerText?.trim() || el.getAttribute('aria-label') || '';
            if (text && el.offsetParent !== null) {
                const id = el.id || `context-btn-${idCounter++}`;
                if (!el.id) el.id = id;
                interactiveElements.push({ type: 'button', text, id });
            }
        });

        // Inputs
        document.querySelectorAll('input, textarea, select').forEach((el: any) => {
            const label = el.labels?.[0]?.innerText || el.placeholder || el.getAttribute('aria-label') || '';
            if (el.offsetParent !== null) {
                const id = el.id || `context-input-${idCounter++}`;
                if (!el.id) el.id = id;
                interactiveElements.push({ type: 'input', label, id, value: el.value });
            }
        });

        return {
            url: window.location.href,
            title: document.title,
            elements: interactiveElements.slice(0, 50) // Limit to avoid hitting token limits
        };
    }, []);

    // Execute action based on AI-parsed command (Dynamic JSON Support)
    const executeAction = useCallback((actionData: any) => {
        let feedbackMessage = '';

        // Handle legacy string actions (backward compatibility)
        if (typeof actionData === 'string') {
            // ... (keep legacy switch case if needed, or map to new format)
            // For now, we wrap legacy strings into an object for the big switch
            actionData = { action: actionData };
        }

        const { action, selector, value, url } = actionData;

        switch (action) {
            case 'navigate':
                if (url) {
                    window.location.href = url;
                    feedbackMessage = `🌐 Navigating to ${url}`;
                }
                break;
            case 'click_element':
                if (selector) {
                    const el = document.getElementById(selector) || document.querySelector(selector);
                    if (el instanceof HTMLElement) {
                        el.click();
                        el.focus();
                        feedbackMessage = `👆 Clicked "${el.innerText?.substring(0, 20) || 'element'}"`;
                    } else {
                        feedbackMessage = `❌ Element not found`;
                    }
                }
                break;
            case 'type_text':
                if (selector && value) {
                    const el = document.getElementById(selector) || document.querySelector(selector);
                    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                        el.value = value;
                        el.focus();
                        feedbackMessage = `✍️ Typed "${value}"`;
                    }
                }
                break;
            case 'scroll':
                const direction = value || 'down'; // 'up', 'down', 'top', 'bottom'
                if (direction === 'down') window.scrollBy({ top: 400, behavior: 'smooth' });
                else if (direction === 'up') window.scrollBy({ top: -400, behavior: 'smooth' });
                else if (direction === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
                else if (direction === 'bottom') window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                feedbackMessage = `📜 Scrolling ${direction}`;
                break;

            // ... (Accessibility Feature Toggles - Keep existing logic mapped to new "accessibility" action or keep legacy strings) ...
            case 'scroll_down': window.scrollBy({ top: 400, behavior: 'smooth' }); feedbackMessage = '⬇️ Scrolling down'; break;
            case 'scroll_up': window.scrollBy({ top: -400, behavior: 'smooth' }); feedbackMessage = '⬆️ Scrolling up'; break;
            case 'go_top': window.scrollTo({ top: 0, behavior: 'smooth' }); feedbackMessage = '⬆️ Going to top'; break;
            case 'go_bottom': window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); feedbackMessage = '⬇️ Going to bottom'; break;
            case 'go_back': window.history.back(); feedbackMessage = '◀️ Going back'; break;
            case 'go_forward': window.history.forward(); feedbackMessage = '▶️ Going forward'; break;
            case 'refresh': window.location.reload(); feedbackMessage = '🔄 Refreshing'; break;

            case 'increase_font': increaseFontSize(); feedbackMessage = '🔠 Font increased'; break;
            case 'decrease_font': decreaseFontSize(); feedbackMessage = '🔡 Font decreased'; break;
            case 'reset_font': setPageZoom(100); feedbackMessage = '🔡 Font reset'; break;
            case 'dark_mode': toggleDarkMode(); feedbackMessage = '🌙 Dark mode toggled'; break;
            case 'light_mode': toggleDarkMode(); feedbackMessage = '☀️ Light mode toggled'; break;
            case 'high_contrast': toggleHighContrast(); feedbackMessage = '⚡ Contrast toggled'; break;
            case 'grayscale': setGrayscale(!grayscale); feedbackMessage = '⚪ Grayscale toggled'; break;
            case 'invert': setInvertColors(!invertColors); feedbackMessage = '🔄 Colors inverted'; break;
            case 'toggle_ruler': setReadingRuler(!readingRuler); feedbackMessage = '📏 Reading ruler toggled'; break;
            case 'toggle_guide': setReadingGuide(!readingGuide); feedbackMessage = '📖 Reading guide toggled'; break;
            case 'toggle_mask': setReadingMask(!readingMask); feedbackMessage = '🎭 Reading mask toggled'; break;
            case 'toggle_spotlight': setReadingSpotlight(!readingSpotlight); feedbackMessage = '🔦 Spotlight toggled'; break;
            case 'toggle_magnifier': setMagnifier(!magnifier); feedbackMessage = '🔍 Magnifier toggled'; break;
            case 'toggle_links': setHighlightLinks(!highlightLinks); feedbackMessage = '🔗 Links highlighted'; break;
            case 'toggle_headings': setHighlightHeadings(!highlightHeadings); feedbackMessage = '📑 Headings highlighted'; break;
            case 'toggle_buttons': setLargeButtons(!largeButtons); feedbackMessage = '🔘 Buttons enlarged'; break;
            case 'toggle_images': setHideImages(!hideImages); feedbackMessage = '🖼️ Images toggled'; break;
            case 'toggle_animations': setPauseAnimations(!pauseAnimations); feedbackMessage = '⏯️ Animations toggled'; break;
            case 'toggle_tts': setTextToSpeech(!textToSpeech); feedbackMessage = '🗣️ Text to speech toggled'; break;
            case 'reset_all': softReset(); feedbackMessage = '🧹 Everything reset'; break;

            default:
                feedbackMessage = '🎯 Action completed';
        }

        if (feedbackMessage) {
            setFeedback(feedbackMessage);
            setTimeout(() => setFeedback('🎤 Listening...'), 2000);
        }
    }, [
        increaseFontSize, decreaseFontSize, toggleDarkMode, toggleHighContrast,
        setGrayscale, setInvertColors, setReadingRuler, setReadingGuide,
        setReadingMask, setReadingSpotlight, setMagnifier, setHighlightLinks,
        setHighlightHeadings, setLargeButtons, setHideImages, setPauseAnimations,
        setTextToSpeech, softReset, setPageZoom,
        grayscale, invertColors, readingGuide, readingRuler, readingMask,
        readingSpotlight, highlightLinks, highlightHeadings, largeButtons,
        hideImages, pauseAnimations, textToSpeech, magnifier
    ]);

    // Parse voice command using AI
    const parseCommand = useCallback(async (text: string) => {
        setLastHeard(text);
        setIsThinking(true);
        setFeedback('🧠 AI Understanding...');

        const context = getPageContext(); // Get context for the AI

        try {
            const response = await fetch(API_ENDPOINTS.VOICE_COMMAND, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, context }) // Send context
            });

            if (response.ok) {
                const data = await response.json();
                console.log('AI parsed action:', data.action);

                // data.action can now be an object or string
                if (data.action && data.action !== 'none') {
                    executeAction(data.action);
                } else {
                    setFeedback('❌ Sorry, didn\'t catch that');
                    setTimeout(() => setFeedback('🎤 Listening...'), 2000);
                }
            }
        } catch (error) {
            console.error('Voice command parse error:', error);
            setFeedback('❌ Connection error');
            setTimeout(() => setFeedback('🎤 Listening...'), 2000);
        } finally {
            setIsThinking(false);
        }
    }, [executeAction, getPageContext]);

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

            recognition.current.onstart = () => {
                setIsListening(true);
                setError(null);
                setFeedback('🎤 Listening...');
            };

            recognition.current.onresult = (event: any) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                console.log('Heard:', transcript);
                parseCommand(transcript);
            };

            recognition.current.onerror = (event: any) => {
                const err = event.error;
                console.error('Speech recognition error:', err);

                if (err === 'not-allowed') {
                    setError('Microphone access denied. Please allow/unblock microphone permissions.');
                    setIsListening(false);
                    isListeningRef.current = false;
                    return;
                }

                if (err === 'no-speech') {
                    // Just silence, don't show error, will retry via onend
                    return;
                }

                if (err === 'network') {
                    setError('Network error. accurate speech recognition requires internet.');
                }
            };

            recognition.current.onend = () => {
                setIsListening(false);
                if (isEnabled && isListeningRef.current && !error) { // Don't restart if critical error
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
        if (!isSupported) {
            setError('Voice control is not supported in this browser. Please use Chrome, Edge, or Safari.');
            return;
        }
        if (recognition.current) {
            try {
                setError(null);
                isListeningRef.current = true;
                recognition.current.start();
                // State updates will handle in onstart
            } catch (e) {
                console.error('Start listening error:', e);
            }
        }
    };

    const stopListening = () => {
        if (recognition.current) {
            isListeningRef.current = false;
            recognition.current.stop();
            // State updates will handle in onend
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
                onClick={() => {
                    if (!isSupported) {
                        alert('Voice commands are not supported in this browser.');
                        return;
                    }
                    setIsEnabled(!isEnabled);
                }}
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
                    {!isSupported && <span className="text-red-500 text-xs font-bold mt-1">Not supported in this browser</span>}
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
                        <div className="relative group">
                            <select
                                value={voiceLang}
                                onChange={(e) => setVoiceLang(e.target.value)}
                                className="w-full px-3 py-3 rounded-lg text-[16px] appearance-none bg-no-repeat transition-all cursor-pointer pr-10 focus:outline-none focus:ring-2"
                                style={{ backgroundColor: theme.active, color: theme.text, border: `3px solid ${theme.border}` }}
                            >
                                {LANGUAGES.map(lang => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg
                                    className="w-6 h-6 transition-transform group-hover:scale-110"
                                    style={{ color: '#FFFFFF' }}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
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
                    {(feedback || error) && (
                        <div className={`rounded-lg p-3 text-center ${error ? 'bg-red-500/20 border border-red-500/50' : ''}`} style={{ backgroundColor: error ? undefined : theme.active }}>
                            <p className="text-[16px] font-medium" style={{ color: error ? '#ff4d4d' : theme.text }}>
                                {error || feedback}
                            </p>
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
                        <p className="font-bold uppercase tracking-wider mb-1 opacity-80">AI supports natural commands like:</p>
                        <p>"Show me links", "Read this page"</p>
                        <p>"Dark Mode", "Show reading ruler", "Hide images"</p>
                        <p>"Go to Top", "Reset All", "Next Button"</p>
                    </div>
                </>
            )}
        </div>
    );
}
