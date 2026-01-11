import { useState, useEffect } from 'react';
import { ButtonPosition, PanelPosition, ResetIconStyle } from './types';
import { BarTheme } from './theme';
import {
    DEFAULT_CURSOR_SIZE,
    MIN_CURSOR_SIZE,
    MAX_CURSOR_SIZE,
    DEFAULT_CURSOR_STYLE,
    DEFAULT_PRIMARY_BUTTON
} from './utils';
import { CursorStyle } from './types';
import circleImg from '@/assets/icons/circle.png?inline';
import cursor2Img from '@/assets/icons/cursor (2).png?inline';
import cursor3Img from '@/assets/icons/cursor (3).png?inline';
import hangImg from '@/assets/icons/hang.png?inline';
import optionImg from '@/assets/icons/option.png?inline';

export function useUISettings() {
    const [cursorSize, setCursorSize] = useState<number>(DEFAULT_CURSOR_SIZE);
    const [cursorStyle, setCursorStyle] = useState<CursorStyle>(DEFAULT_CURSOR_STYLE);
    const [cursorColor, setCursorColor] = useState<string>('#000000');
    const [primaryButton, setPrimaryButton] = useState<'left' | 'right'>(DEFAULT_PRIMARY_BUTTON);
    const [buttonPosition, setButtonPosition] = useState<ButtonPosition>('bottom-right');
    const [panelPosition, setPanelPosition] = useState<PanelPosition>('left');
    const [barTheme, setBarTheme] = useState<BarTheme>('purple');
    const [isMobile, setIsMobile] = useState(false);
    const [showActiveIndicators, setShowActiveIndicators] = useState<boolean>(false);
    const [audioPingEnabled, setAudioPingEnabled] = useState<boolean>(false);
    const [isPanelPinned, setIsPanelPinned] = useState<boolean>(false);
    const [sidebarIconSize, setSidebarIconSize] = useState<number>(1);
    const [resetIconStyle, setResetIconStyle] = useState<ResetIconStyle>('red-black');

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Initial load
    useEffect(() => {
        // Load UI preferences (bar position, theme, etc.) but not cursor settings
        // Cursor settings affect the website and should only be applied when user explicitly selects
        const saved = {
            primaryButton: localStorage.getItem('accessibility-primaryButton'),
            buttonPosition: localStorage.getItem('accessibility-buttonPosition'),
            panelPosition: localStorage.getItem('accessibility-panelPosition'),
            barTheme: localStorage.getItem('accessibility-barTheme'),
            showActiveIndicators: localStorage.getItem('accessibility-showActiveIndicators'),
            audioPingEnabled: localStorage.getItem('accessibility-audioPingEnabled'),
            isPanelPinned: localStorage.getItem('accessibility-isPanelPinned'),
            sidebarIconSize: localStorage.getItem('accessibility-sidebarIconSize'),
            resetIconStyle: localStorage.getItem('accessibility-resetIconStyle'),
        };

        // Don't load cursor settings - they affect the website
        // if (saved.cursorSize) setCursorSize(Number(saved.cursorSize));
        // if (saved.cursorStyle) setCursorStyle(saved.cursorStyle as CursorStyle);
        // if (saved.cursorColor) setCursorColor(saved.cursorColor);
        
        if (saved.primaryButton) setPrimaryButton(saved.primaryButton as 'left' | 'right');
        if (saved.buttonPosition) setButtonPosition(saved.buttonPosition as ButtonPosition);
        if (saved.panelPosition) setPanelPosition(saved.panelPosition as PanelPosition);
        if (saved.barTheme) {
            // Validate and migrate old theme values
            const validThemes: BarTheme[] = ['white', 'grayscale', 'black', 'oceanBlue', 'Turquoise', 'navy', 'yellow', 'purple'];
            // Check for old 'blue' value before casting to BarTheme
            let themeValue = saved.barTheme as string;
            // Migrate 'blue' to 'Turquoise' if found
            if (themeValue === 'blue') {
                themeValue = 'Turquoise';
                localStorage.setItem('accessibility-barTheme', 'Turquoise');
            }
            // Cast to BarTheme and validate
            let theme = themeValue as BarTheme;
            // Only set if it's a valid theme
            if (validThemes.includes(theme)) {
                setBarTheme(theme);
            }
        }
        if (saved.showActiveIndicators !== null) setShowActiveIndicators(saved.showActiveIndicators === 'true');
        if (saved.audioPingEnabled) setAudioPingEnabled(saved.audioPingEnabled === 'true');
        if (saved.isPanelPinned) setIsPanelPinned(saved.isPanelPinned === 'true');
        if (saved.sidebarIconSize) setSidebarIconSize(Number(saved.sidebarIconSize));
        if (saved.resetIconStyle) setResetIconStyle(saved.resetIconStyle as ResetIconStyle);
    }, []);

    // Effects for cursor
    useEffect(() => {
        const baseSize = 24;
        const size = Math.round(baseSize * cursorSize);

        let color = cursorColor || '#000000';
        // Helper to determine best stroke color
        const getContrastingStroke = (c: string) => {
            if (!c) return '#ffffff';
            // Simple check for white/light colors - if it's white or very light, use black stroke
            if (c.toLowerCase() === '#ffffff' || c.toLowerCase() === '#fff' || c.toLowerCase().includes('255, 255, 255')) {
                return '#000000';
            }
            return '#ffffff';
        };

        let stroke = getContrastingStroke(color);
        let strokeWidth = '1.5';

        if (cursorStyle === 'white') {
            stroke = '#000000';
            strokeWidth = '1.5';
        } else if (cursorStyle === 'black') {
            stroke = '#ffffff';
            strokeWidth = '1.5';
        } else if (cursorStyle === 'inverted') {
            stroke = '#ffffff';
            strokeWidth = '2';
        }

        const isDefault = cursorSize === 1 && cursorStyle === 'white' && (cursorColor === '#000000' || !cursorColor);

        if (!isDefault || cursorSize > 1 || !['white', 'black', 'inverted'].includes(cursorStyle)) {
            let svgCursor = '';
            let hotspotX = Math.round(3 * (size / 24));
            let hotspotY = Math.round(3 * (size / 24));

            if (['circle-img', 'cursor-2', 'cursor-3', 'hang', 'option'].includes(cursorStyle)) {
                const getSrc = (img: any) => typeof img === 'string' ? img : img?.src || img;
                let imgSrc = '';
                let hX = 0;
                let hY = 0;

                if (cursorStyle === 'circle-img') {
                    imgSrc = getSrc(circleImg);
                    hX = Math.round(size / 2);
                    hY = Math.round(size / 2);
                }
                else if (cursorStyle === 'cursor-2') {
                    imgSrc = getSrc(cursor2Img);
                    hX = 0;
                    hY = 0;
                }
                else if (cursorStyle === 'cursor-3') {
                    imgSrc = getSrc(cursor3Img);
                    hX = 0;
                    hY = 0;
                }
                else if (cursorStyle === 'hang') {
                    imgSrc = getSrc(hangImg);
                    hX = Math.round(size / 2);
                    hY = Math.round(size / 2);
                }
                else if (cursorStyle === 'option') {
                    imgSrc = getSrc(optionImg);
                    hX = 0;
                    hY = 0;
                }

                // Wrap image in SVG to force scaling to 'size'
                const svgWrapper = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                    <image href="${imgSrc}" width="${size}" height="${size}" />
                </svg>`;
                const base64Svg = typeof btoa !== 'undefined' ? btoa(svgWrapper) : Buffer.from(svgWrapper).toString('base64');
                svgCursor = `data:image/svg+xml;base64,${base64Svg}`;
                hotspotX = hX;
                hotspotY = hY;

            } else {
                let svgContent = '';
                if (cursorStyle === 'circle') {
                    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="${stroke}" stroke-width="2" />
                        <circle cx="12" cy="12" r="2" fill="${stroke}" />
                    </svg>`;
                    hotspotX = Math.round(size / 2);
                    hotspotY = Math.round(size / 2);

                } else if (cursorStyle === 'person') {
                    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
                        <circle cx="12" cy="6" r="3" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                        <path fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" d="M12 10c-3.3 0-6 2.2-6 5v3c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-3c0-2.8-2.7-5-6-5z"/>
                    </svg>`;
                    hotspotX = Math.round(12 * (size / 24));
                    hotspotY = Math.round(12 * (size / 24));
                } else if (cursorStyle === 'crosshair') {
                    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
                        <path fill="none" stroke="${color}" stroke-width="2" d="M12 2v20M2 12h20"/>
                        <circle cx="12" cy="12" r="3" fill="none" stroke="${color}" stroke-width="2"/>
                    </svg>`;
                    hotspotX = Math.round(size / 2);
                    hotspotY = Math.round(size / 2);
                } else if (cursorStyle === 'help') {
                    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
                        <path fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
                        <text x="14" y="22" font-family="Arial" font-weight="bold" font-size="12" fill="${color}" stroke="${stroke}" stroke-width="0.5">?</text>
                    </svg>`;
                    hotspotX = Math.round(3 * (size / 24));
                    hotspotY = Math.round(3 * (size / 24));
                } else if (cursorStyle === 'pointer') {
                    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
                        <path fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" d="M12 2l4.5 9-4.5 9-4.5-9L12 2z"/>
                    </svg>`;
                    hotspotX = Math.round(12 * (size / 24));
                    hotspotY = Math.round(12 * (size / 24));
                } else if (cursorStyle === 'highlight') {
                    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="11.5" fill="${color}" stroke="${stroke}" stroke-width="1" />
                    </svg>`;
                    hotspotX = Math.round(12 * (size / 24));
                    hotspotY = Math.round(12 * (size / 24));
                } else {
                    // Default arrow for white, black, inverted, custom
                    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
                        <path fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
                    </svg>`;
                    hotspotX = Math.round(3 * (size / 24));
                    hotspotY = Math.round(3 * (size / 24));
                }

                const base64Svg = typeof btoa !== 'undefined' ? btoa(svgContent) : Buffer.from(svgContent).toString('base64');
                svgCursor = `data:image/svg+xml;base64,${base64Svg}`;
            }

            const styleContent = `
                html.large-cursor,
                html.large-cursor body,
                html.large-cursor *:not(#a11y-embed-host-react):not(#a11y-embed-host-react *):not(.accessibility-bar):not(.accessibility-bar *) {
                    cursor: url("${svgCursor}") ${hotspotX} ${hotspotY}, auto !important;
                }
                /* Ensure it still applies inside our elements as well */
                html.large-cursor .accessibility-bar,
                html.large-cursor .accessibility-bar *,
                html.large-cursor .a11y-embed-host,
                html.large-cursor .a11y-embed-host * {
                    cursor: url("${svgCursor}") ${hotspotX} ${hotspotY}, auto !important;
                }
            `;

            const shadowStyleContent = `
                :host, :host *, *, button, a, input, select, textarea, [role="button"] {
                    cursor: url("${svgCursor}") ${hotspotX} ${hotspotY}, auto !important;
                }
            `;

            let styleElement = document.getElementById('a11y-cursor-style') as HTMLStyleElement;
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'a11y-cursor-style';
                document.head.appendChild(styleElement);
            }
            styleElement.textContent = styleContent;

            // Also inject into any shadow roots we can find
            const injectIntoShadow = (root: ShadowRoot) => {
                let s = root.getElementById('a11y-cursor-style') as HTMLStyleElement;
                if (!s) {
                    s = document.createElement('style');
                    s.id = 'a11y-cursor-style';
                    root.appendChild(s);
                }
                s.textContent = shadowStyleContent;
            };

            // Find our hosts
            const hosts = document.querySelectorAll('[id^="a11y-embed-host"], [id^="a11y-shadow-portal"]');
            hosts.forEach(host => {
                if (host.shadowRoot) injectIntoShadow(host.shadowRoot);
            });

            document.documentElement.classList.add('large-cursor');

        } else {
            document.documentElement.classList.remove('large-cursor');
            document.getElementById('a11y-cursor-style')?.remove();

            // Clean up shadow roots
            const hosts = document.querySelectorAll('[id^="a11y-embed-host"], [id^="a11y-shadow-portal"]');
            hosts.forEach(host => {
                host.shadowRoot?.getElementById('a11y-cursor-style')?.remove();
            });
        }
        localStorage.setItem('accessibility-cursorSize', cursorSize.toString());
        localStorage.setItem('accessibility-cursorStyle', cursorStyle);
        localStorage.setItem('accessibility-cursorColor', cursorColor);
    }, [cursorSize, cursorStyle, cursorColor]);

    useEffect(() => localStorage.setItem('accessibility-primaryButton', primaryButton), [primaryButton]);
    useEffect(() => localStorage.setItem('accessibility-buttonPosition', buttonPosition), [buttonPosition]);
    useEffect(() => localStorage.setItem('accessibility-panelPosition', panelPosition), [panelPosition]);
    useEffect(() => localStorage.setItem('accessibility-barTheme', barTheme), [barTheme]);
    useEffect(() => localStorage.setItem('accessibility-showActiveIndicators', showActiveIndicators.toString()), [showActiveIndicators]);
    useEffect(() => localStorage.setItem('accessibility-audioPingEnabled', audioPingEnabled.toString()), [audioPingEnabled]);
    useEffect(() => localStorage.setItem('accessibility-isPanelPinned', isPanelPinned.toString()), [isPanelPinned]);
    useEffect(() => localStorage.setItem('accessibility-sidebarIconSize', sidebarIconSize.toString()), [sidebarIconSize]);
    useEffect(() => localStorage.setItem('accessibility-resetIconStyle', resetIconStyle), [resetIconStyle]);

    const togglePanelPin = () => setIsPanelPinned(prev => !prev);

    return {
        cursorSize, setCursorSize,
        cursorStyle, setCursorStyle,
        cursorColor, setCursorColor,
        primaryButton, setPrimaryButton,
        buttonPosition, setButtonPosition,
        panelPosition, setPanelPosition,
        barTheme, setBarTheme,
        showActiveIndicators, setShowActiveIndicators,
        audioPingEnabled, setAudioPingEnabled,
        isMobile,
        isPanelPinned, setIsPanelPinned, togglePanelPin,
        sidebarIconSize, setSidebarIconSize,
        resetIconStyle, setResetIconStyle,
    };
}
