'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
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
        barTheme, language,
        ttsVoiceGender, setTtsVoiceGender
    } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
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

    // Local fuzzy command matching (fallback when AI fails)
    const matchCommandLocally = useCallback((text: string): string | null => {
        const normalized = text.toLowerCase().trim();
        
        // Extract keywords
        const keywords = normalized.split(/\s+/);
        
        // Command patterns with fuzzy matching
        const patterns: { keywords: string[]; action: string; priority: number }[] = [
            // Font/Size commands
            { keywords: ['increase', 'font', 'size', 'bigger', 'larger', 'zoom', 'in'], action: 'increase_font', priority: 10 },
            { keywords: ['decrease', 'font', 'size', 'smaller', 'zoom', 'out'], action: 'decrease_font', priority: 10 },
            { keywords: ['reset', 'font', 'normal', 'default'], action: 'reset_font', priority: 8 },
            
            // Mode commands
            { keywords: ['dark', 'mode', 'night'], action: 'dark_mode', priority: 9 },
            { keywords: ['light', 'mode', 'day'], action: 'light_mode', priority: 9 },
            { keywords: ['contrast', 'high'], action: 'high_contrast', priority: 8 },
            { keywords: ['grayscale', 'grey', 'gray'], action: 'grayscale', priority: 7 },
            { keywords: ['invert', 'inverse', 'reverse'], action: 'invert', priority: 7 },
            
            // Reading tools
            { keywords: ['ruler', 'reading', 'ruler'], action: 'toggle_ruler', priority: 8 },
            { keywords: ['guide', 'reading', 'guide'], action: 'toggle_guide', priority: 8 },
            { keywords: ['mask', 'reading', 'mask'], action: 'toggle_mask', priority: 7 },
            { keywords: ['spotlight', 'reading', 'spotlight'], action: 'toggle_spotlight', priority: 7 },
            { keywords: ['magnifier', 'magnify', 'zoom'], action: 'toggle_magnifier', priority: 7 },
            
            // Highlight commands
            { keywords: ['link', 'links', 'highlight'], action: 'toggle_links', priority: 6 },
            { keywords: ['heading', 'headings', 'highlight'], action: 'toggle_headings', priority: 6 },
            
            // UI commands
            { keywords: ['button', 'buttons', 'large', 'big'], action: 'toggle_buttons', priority: 6 },
            { keywords: ['image', 'images', 'hide', 'show'], action: 'toggle_images', priority: 5 },
            { keywords: ['animation', 'animations', 'pause', 'stop'], action: 'toggle_animations', priority: 5 },
            
            // Speech
            { keywords: ['speech', 'text', 'to', 'speech', 'read'], action: 'toggle_tts', priority: 6 },
            
            // Navigation
            { keywords: ['scroll', 'down'], action: 'scroll_down', priority: 8 },
            { keywords: ['scroll', 'up'], action: 'scroll_up', priority: 8 },
            { keywords: ['top', 'go', 'to', 'top'], action: 'go_top', priority: 7 },
            { keywords: ['bottom', 'go', 'to', 'bottom'], action: 'go_bottom', priority: 7 },
            { keywords: ['back', 'go', 'back'], action: 'go_back', priority: 6 },
            { keywords: ['forward', 'go', 'forward'], action: 'go_forward', priority: 6 },
            { keywords: ['refresh', 'reload'], action: 'refresh', priority: 5 },
            
            // Reset
            { keywords: ['reset', 'all', 'everything', 'clear'], action: 'reset_all', priority: 9 },
        ];
        
        // Score each pattern based on keyword matches
        let bestMatch: { action: string; score: number } | null = null;
        
        for (const pattern of patterns) {
            let score = 0;
            let matchedKeywords = 0;
            
            for (const keyword of pattern.keywords) {
                if (normalized.includes(keyword)) {
                    score += pattern.priority;
                    matchedKeywords++;
                }
            }
            
            // Bonus for matching multiple keywords
            if (matchedKeywords >= 2) {
                score *= 1.5;
            }
            
            if (score > 0 && (!bestMatch || score > bestMatch.score)) {
                bestMatch = { action: pattern.action, score };
            }
        }
        
        // If we have a reasonable match (score > 5), return it
        if (bestMatch && bestMatch.score >= 5) {
            return bestMatch.action;
        }
        
        // Fallback: if text contains common action words, try to infer
        if (normalized.includes('increase') || normalized.includes('more') || normalized.includes('bigger')) {
            return 'increase_font';
        }
        if (normalized.includes('decrease') || normalized.includes('less') || normalized.includes('smaller')) {
            return 'decrease_font';
        }
        if (normalized.includes('dark')) {
            return 'dark_mode';
        }
        if (normalized.includes('contrast')) {
            return 'high_contrast';
        }
        
        return null;
    }, []);

    // Parse voice command using AI with local fallback
    const parseCommand = useCallback(async (text: string) => {
        setLastHeard(text);
        setIsThinking(true);
        setFeedback('🧠 Understanding...');

        const context = getPageContext();

        try {
            const response = await fetch(API_ENDPOINTS.VOICE_COMMAND, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, context })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('AI parsed action:', data.action);

                if (data.action && data.action !== 'none') {
                    executeAction(data.action);
                } else {
                    // AI didn't understand, try local fuzzy matching
                    const localMatch = matchCommandLocally(text);
                    if (localMatch) {
                        setFeedback('💡 Understood! Executing...');
                        executeAction(localMatch);
                    } else {
                        setFeedback('❌ Sorry, didn\'t catch that. Try: "increase font", "dark mode", "show links"');
                        setTimeout(() => setFeedback('🎤 Listening...'), 3000);
                    }
                }
            } else {
                // API error, try local matching
                const localMatch = matchCommandLocally(text);
                if (localMatch) {
                    setFeedback('💡 Understood! Executing...');
                    executeAction(localMatch);
                } else {
                    setFeedback('❌ Connection error. Try: "increase font", "dark mode"');
                    setTimeout(() => setFeedback('🎤 Listening...'), 3000);
                }
            }
        } catch (error) {
            console.error('Voice command parse error:', error);
            // Network error, use local matching
            const localMatch = matchCommandLocally(text);
            if (localMatch) {
                setFeedback('💡 Understood! Executing...');
                executeAction(localMatch);
            } else {
                setFeedback('❌ Connection error. Try: "increase font", "dark mode"');
                setTimeout(() => setFeedback('🎤 Listening...'), 3000);
            }
        } finally {
            setIsThinking(false);
        }
    }, [executeAction, getPageContext, matchCommandLocally]);

    // Initialize speech recognition - but don't auto-start
    // Only initialize when enabled, but let user manually start via button
    useEffect(() => {
        if (!isEnabled) {
            if (recognition.current) {
                try {
                recognition.current.stop();
                } catch (e) {
                    // Ignore stop errors
                }
            }
            setIsListening(false);
            isListeningRef.current = false;
            return;
        }

        // Don't auto-start - user must click "Start Listening" button
        // This prevents permission errors on page load
        return () => {
            if (recognition.current) {
                try {
                    recognition.current.stop();
                } catch (e) {
                    // Ignore stop errors
                }
            }
        };
    }, [isEnabled, voiceLang]);

    const startListening = () => {
        if (!isSupported) {
            setError('Voice control is not supported in this browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        // Always create a new recognition instance to ensure clean state
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            
            // Stop and cleanup existing recognition
            if (recognition.current) {
                try {
                    recognition.current.stop();
                } catch (e) {
                    // Ignore errors when stopping
                }
            }

            // Create new recognition instance
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = true;
            recognition.current.interimResults = false;
            recognition.current.lang = voiceLang;

            recognition.current.onstart = () => {
                setIsListening(true);
                setError(null);
                setFeedback('🎤 Listening...');
                console.log('Speech recognition started');
            };

            recognition.current.onresult = (event: any) => {
                if (event.results && event.results.length > 0) {
                    const result = event.results[event.results.length - 1];
                    if (result && result[0]) {
                        const transcript = result[0].transcript;
                console.log('Heard:', transcript);
                        setLastHeard(transcript);
                parseCommand(transcript);
                    }
                }
            };

            recognition.current.onerror = (event: any) => {
                const err = event.error;
                console.error('Speech recognition error:', err);

                if (err === 'not-allowed' || err === 'service-not-allowed') {
                    setIsListening(false);
                    isListeningRef.current = false;
                    setError(null);
                    setFeedback('🎤 Microphone permission required. Please allow access when prompted.');
                    // Don't retry automatically - user needs to grant permission first
                    return;
                }

                if (err === 'no-speech') {
                    return;
                }

                if (err === 'network') {
                    setError('Network error. Accurate speech recognition requires internet.');
                } else if (err === 'aborted') {
                    return;
                }
            };

            recognition.current.onend = () => {
                console.log('Speech recognition ended. isListeningRef:', isListeningRef.current, 'isEnabled:', isEnabled);
                setIsListening(false);
                // Only auto-restart if manually started (isListeningRef is true) and no error
                if (isListeningRef.current && !error) {
                    setTimeout(() => {
                        try {
                            if (isListeningRef.current && recognition.current) {
                                console.log('Auto-restarting recognition...');
                                recognition.current.start();
                            }
                        } catch (e) {
                            console.error('Auto-restart error:', e);
                            setIsListening(false);
                            isListeningRef.current = false;
                        }
                    }, 100);
                } else {
                    // If not auto-restarting, clear the ref
                    isListeningRef.current = false;
                }
            };

            // Start listening immediately
            try {
                setError(null);
                setFeedback('🎤 Starting...');
                isListeningRef.current = true;
                console.log('Attempting to start recognition...');
                recognition.current.start();
                console.log('Recognition start() called successfully');
                // Don't set listening state here - let onstart handle it
            } catch (e: any) {
                console.error('Start listening error:', e);
                setIsListening(false);
                isListeningRef.current = false;
                if (e.message && e.message.includes('already started')) {
                    setIsListening(true);
                    setFeedback('🎤 Listening...');
                } else {
                    setError('Failed to start listening. Please try again.');
                    setFeedback('');
                }
            }
        } else {
            setError('Speech recognition is not supported in this browser.');
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

                    {/* Voice Gender Selection */}
                    <div>
                        <label className="text-[16px] font-medium mb-1 block" style={{ color: theme.text }}>
                            {t.controls.voice || 'Voice'}
                        </label>
                        <div className="space-y-2">
                            <div
                                className="flex items-center justify-between cursor-pointer group px-3 py-2 rounded-lg transition-all"
                                style={{ backgroundColor: ttsVoiceGender === 'male' ? theme.active : theme.hover }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ttsVoiceGender === 'male' ? theme.active : theme.hover}
                                onClick={() => setTtsVoiceGender('male')}
                            >
                                <span className="text-[16px]" style={{ color: theme.text }}>{t.controls.male || 'Male'}</span>
                                <div
                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                                    style={{
                                        borderColor: ttsVoiceGender === 'male' ? theme.text : `${theme.text}44`,
                                        backgroundColor: ttsVoiceGender === 'male' ? theme.text : 'transparent'
                                    }}
                                >
                                    {ttsVoiceGender === 'male' && (
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.active }} />
                                    )}
                                </div>
                            </div>

                            <div
                                className="flex items-center justify-between cursor-pointer group px-3 py-2 rounded-lg transition-all"
                                style={{ backgroundColor: ttsVoiceGender === 'female' ? theme.active : theme.hover }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ttsVoiceGender === 'female' ? theme.active : theme.hover}
                                onClick={() => setTtsVoiceGender('female')}
                            >
                                <span className="text-[16px]" style={{ color: theme.text }}>{t.controls.female || 'Female'}</span>
                                <div
                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                                    style={{
                                        borderColor: ttsVoiceGender === 'female' ? theme.text : `${theme.text}44`,
                                        backgroundColor: ttsVoiceGender === 'female' ? theme.text : 'transparent'
                                    }}
                                >
                                    {ttsVoiceGender === 'female' && (
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.active }} />
                                    )}
                                </div>
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
                        <div className={`rounded-lg p-3 text-center ${error && !error.includes('Click') ? 'bg-red-500/20 border border-red-500/50' : ''}`} style={{ backgroundColor: (error && !error.includes('Click')) ? undefined : theme.active }}>
                            <p className="text-[16px] font-medium" style={{ color: (error && !error.includes('Click')) ? '#ff4d4d' : theme.text }}>
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
