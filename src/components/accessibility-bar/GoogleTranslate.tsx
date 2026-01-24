'use client';

import { useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: any;
    }
}

// Global state to survive re-mounts
const globalState = {
    init: false,
    scriptLoaded: false,
    lastApplied: null as string | null
};

export default function GoogleTranslate() {

    const getGoogleLangCode = (code: string) => {
        if (!code) return 'en';
        if (code === 'en-GB' || code === 'en-US') return 'en';
        if (code === 'zh-CN') return 'zh-CN';
        if (code === 'zh-TW') return 'zh-TW';
        return code.split('-')[0];
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // 1. Ensure Target Div exists in Main DOM body
        let translateDiv = document.getElementById('google_translate_element');
        if (!translateDiv) {
            translateDiv = document.createElement('div');
            translateDiv.id = 'google_translate_element';
            // Use slightly more "real" physical properties for initialization
            Object.assign(translateDiv.style, {
                position: 'fixed',
                left: '-500px',
                top: '-500px',
                width: '100px',
                height: '40px',
                zIndex: '-9999',
                opacity: '0.01',
            });
            document.body.appendChild(translateDiv);
        }

        // 2. The Init Callback
        (window as any).googleTranslateElementInit = () => {
            console.log('HYPER-V3: Callback fired!');
            if (globalState.init) return;

            try {
                if (window.google?.translate?.TranslateElement) {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: 'en',
                            // CHANGED: Removed SIMPLE layout as it hides the combo box
                            // HORIZONTAL provides the .goog-te-combo we need
                            layout: (window as any).google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                            autoDisplay: false,
                        },
                        'google_translate_element'
                    );
                    globalState.init = true;
                    console.log('HYPER-V3: Widget instantiated with HORIZONTAL layout');
                }
            } catch (err) {
                console.error('HYPER-V3: Widget error:', err);
            }
        };

        // 3. Load Script
        const scriptId = 'google-translate-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.head.appendChild(script);
        }

        // 4. Balanced Invisibility CSS
        if (!document.getElementById('google-translate-stealth-styles')) {
            const style = document.createElement('style');
            style.id = 'google-translate-stealth-styles';
            style.innerHTML = `
                .goog-te-banner-frame, .goog-te-balloon-frame, #goog-gt-tt, .goog-te-banner, .skiptranslate, 
                iframe.goog-te-menu-frame, .goog-te-gadget-icon, .goog-logo-link, .goog-te-gadget span {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }
                body { top: 0px !important; position: static !important; }
                .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
                font { background-color: transparent !important; box-shadow: none !important; }
            `;
            document.head.appendChild(style);
        }
    }, []);

    const { language: accessibilityLanguage, selectionLanguage, realTimeTranslation } = useAccessibility();

    // 5. Apply Language logic
    useEffect(() => {
        let activeLang = accessibilityLanguage;
        if (realTimeTranslation && selectionLanguage) {
            activeLang = selectionLanguage;
        }

        if (!activeLang) return;

        const isEnglish = activeLang === 'en-GB' || activeLang === 'en-US' || activeLang === 'en';
        const targetLang = isEnglish ? 'en' : getGoogleLangCode(activeLang);

        if (globalState.lastApplied === targetLang) return;

        console.log('HYPER-V3: Target ->', targetLang);

        const tryApply = () => {
            const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;

            if (combo) {
                console.log('HYPER-V3: Found Combo Box! Current:', combo.value, 'Setting to:', targetLang);
                if (combo.value !== targetLang) {
                    combo.value = targetLang;
                    combo.dispatchEvent(new Event('change', { bubbles: true }));
                    combo.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log('HYPER-V3: SUCCESS - Applied', targetLang);
                }
                globalState.lastApplied = targetLang;

                const domain = window.location.hostname;
                document.cookie = `googtrans=/en/${targetLang}; path=/; domain=${domain}`;
                document.cookie = `googtrans=/en/${targetLang}; path=/;`;
                return true;
            }
            return false;
        };

        if (tryApply()) return;

        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (tryApply() || attempts > 60) {
                clearInterval(interval);
                if (attempts > 60) {
                    const container = document.getElementById('google_translate_element');
                    console.warn('HYPER-V3: Timeout. Container content:', container?.innerHTML || 'EMPTY');
                }
            }
        }, 500);

        return () => clearInterval(interval);
    }, [accessibilityLanguage, selectionLanguage, realTimeTranslation]);

    return null;
}
