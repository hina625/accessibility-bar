'use client';

import { useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: any;
    }
}

export default function GoogleTranslate() {
    const { language } = useAccessibility();
    const initRef = useRef(false);

    useEffect(() => {
        console.log('GoogleTranslate component mounted');

        // 1. Ensure the container div exists in the MAIN document
        let container = document.getElementById('google_translate_element');
        if (!container) {
            console.log('Creating google_translate_element container');
            container = document.createElement('div');
            container.id = 'google_translate_element';
            // Some versions of Google Translate won't init if display is 'none'
            container.style.position = 'fixed';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            container.style.opacity = '0';
            document.body.appendChild(container);
        }

        // 2. Define the callback globally
        window.googleTranslateElementInit = () => {
            console.log('googleTranslateElementInit callback triggered!');
            try {
                if (window.google && window.google.translate) {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: 'en',
                            layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                            autoDisplay: false,
                        },
                        'google_translate_element'
                    );
                    initRef.current = true;
                    console.log('TranslateElement initialized');
                } else {
                    console.error('google.translate not found in callback');
                }
            } catch (err) {
                console.error('Error in googleTranslateElementInit:', err);
            }
        };

        // 3. Load the script
        if (!document.getElementById('google-translate-script')) {
            console.log('Loading Google Translate script...');
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            script.onerror = (e) => console.error('Failed to load Google Translate script', e);
            document.head.appendChild(script);
        } else {
            console.log('Google Translate script already exists');
            // If already loaded but not initialized, try calling it manually if it exists
            if (typeof window.googleTranslateElementInit === 'function' && !initRef.current) {
                window.googleTranslateElementInit();
            }
        }

        // Hide UI styles
        const style = document.createElement('style');
        style.id = 'google-translate-hide-ui';
        style.innerHTML = `
            /* Hide the top banner */
            .goog-te-banner-frame.skiptranslate,
            .goog-te-banner-frame {
                display: none !important;
            }
            body {
                top: 0 !important;
                position: static !important;
            }
            /* Hide the attribution gadget */
            .goog-te-gadget {
                display: none !important;
            }
            .goog-te-gadget-simple {
                display: none !important;
            }
            #google_translate_element {
                display: none !important;
            }
            /* Remove the gap at the top of the body */
            .skiptranslate {
                display: none !important;
            }
            body > .skiptranslate {
                display: none !important;
            }
            #goog-gt-tt {
                display: none !important;
                visibility: hidden !important;
            }
            .goog-tooltip {
                display: none !important;
            }
            .goog-tooltip:hover {
                display: none !important;
            }
            .goog-text-highlight {
                background-color: transparent !important;
                border: none !important;
                box-shadow: none !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            const existingStyle = document.getElementById('google-translate-hide-ui');
            if (existingStyle) existingStyle.remove();
        };
    }, []);

    useEffect(() => {
        if (!language) return;

        const translatePage = () => {
            console.log('Trying to translate to:', language);

            // Try to set the cookie first - Google Translate often uses this
            document.cookie = `googtrans=/en/${language}; path=/`;
            document.cookie = `googtrans=/en/${language}; path=/; domain=${window.location.hostname}`;

            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;

            if (select) {
                console.log('Found .goog-te-combo! Current value:', select.value);
                if (select.value !== language) {
                    select.value = language;
                    select.dispatchEvent(new Event('change'));
                    console.log('Dispatched change event to', language);
                }
            } else {
                console.warn('Still waiting for .goog-te-combo...');
                // If it's taking too long, check if google.translate is even loaded
                if (window.google && window.google.translate && !initRef.current) {
                    console.log('google.translate is here but initRef is false. Retrying manual init.');
                    window.googleTranslateElementInit();
                }
                setTimeout(translatePage, 1500);
            }
        };

        // Immediate attempt with a small delay for DOM
        const timer = setTimeout(translatePage, 1000);
        return () => clearTimeout(timer);
    }, [language]);

    return null;
}
