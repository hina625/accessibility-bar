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
    const initRef = useRef(false);

    useEffect(() => {
        console.log('GoogleTranslate component mounted');

        let container = document.getElementById('google_translate_element');
        if (!container) {
            console.log('Creating google_translate_element container');
            container = document.createElement('div');
            container.id = 'google_translate_element';

            container.style.position = 'fixed';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            container.style.opacity = '0';
            document.body.appendChild(container);
        }


        window.googleTranslateElementInit = () => {
            console.log('googleTranslateElementInit callback triggered!');
            let attempts = 0;
            const maxAttempts = 20;

            const checkAndInit = () => {
                try {
                    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
                        const translateOptions: { pageLanguage: string; autoDisplay: boolean; layout?: any } = {
                            pageLanguage: 'en',
                            autoDisplay: false,
                        };

                        if (window.google.translate.TranslateElement.InlineLayout) {
                            translateOptions.layout = window.google.translate.TranslateElement.InlineLayout.HORIZONTAL;
                        }

                        new window.google.translate.TranslateElement(
                            translateOptions,
                            'google_translate_element'
                        );
                        initRef.current = true;
                        console.log('TranslateElement initialized');
                    } else {
                        attempts++;
                        if (attempts < maxAttempts) {
                            setTimeout(checkAndInit, 100);
                        } else {
                            console.error('google.translate not found after retries');
                        }
                    }
                } catch (err) {
                    console.error('Error in googleTranslateElementInit:', err);
                }
            };

            checkAndInit();
        };


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

    const { language: accessibilityLanguage, realTimeTranslation } = useAccessibility();

    useEffect(() => {
        const translateTo = accessibilityLanguage;
        if (!translateTo) return;

        const translatePage = () => {
            console.log('Trying to translate to:', translateTo);

            // Set cookies for Google Translate
            document.cookie = `googtrans=/en/${translateTo}; path=/`;
            document.cookie = `googtrans=/en/${translateTo}; path=/; domain=${window.location.hostname}`;

            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;

            if (select) {
                if (select.value !== translateTo) {
                    select.value = translateTo;
                    select.dispatchEvent(new Event('change'));
                }
            } else if (translateTo !== 'en') {
                if (window.google && window.google.translate && !initRef.current) {
                    window.googleTranslateElementInit();
                }
                setTimeout(translatePage, 1500);
            }
        };

        const timer = setTimeout(translatePage, 1000);
        return () => clearTimeout(timer);
    }, [accessibilityLanguage]);

    return null;
}
