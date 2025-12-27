import { useState, useEffect } from 'react';
import { ButtonPosition, PanelPosition } from './types';
import {
    DEFAULT_CURSOR_SIZE,
    MIN_CURSOR_SIZE,
    MAX_CURSOR_SIZE
} from './utils';

export function useUISettings() {
    const [cursorSize, setCursorSize] = useState<number>(DEFAULT_CURSOR_SIZE);
    const [cursorColor, setCursorColor] = useState<string>('#000000');
    const [buttonPosition, setButtonPosition] = useState<ButtonPosition>('bottom-right');
    const [panelPosition, setPanelPosition] = useState<PanelPosition>('left');

    // Initial load
    useEffect(() => {
        const saved = {
            cursorSize: localStorage.getItem('accessibility-cursorSize'),
            cursorColor: localStorage.getItem('accessibility-cursorColor'),
            buttonPosition: localStorage.getItem('accessibility-buttonPosition'),
            panelPosition: localStorage.getItem('accessibility-panelPosition'),
        };

        if (saved.cursorSize) setCursorSize(Number(saved.cursorSize));
        if (saved.cursorColor) setCursorColor(saved.cursorColor);
        if (saved.buttonPosition) setButtonPosition(saved.buttonPosition as ButtonPosition);
        if (saved.panelPosition) setPanelPosition(saved.panelPosition as PanelPosition);
    }, []);

    // Effects for cursor
    useEffect(() => {
        const baseSize = 24;
        const size = Math.round(baseSize * cursorSize);
        const color = cursorColor || '#000000';

        if (cursorSize > 1 || cursorColor !== '#000000') {
            const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><path fill="${color}" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>`;
            const base64Svg = typeof btoa !== 'undefined' ? btoa(svgContent) : Buffer.from(svgContent).toString('base64');
            const svgCursor = `data:image/svg+xml;base64,${base64Svg}`;

            let styleElement = document.getElementById('a11y-cursor-style') as HTMLStyleElement;
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'a11y-cursor-style';
                document.head.appendChild(styleElement);
            }

            const hotspot = Math.round(3 * (size / 24));

            styleElement.textContent = `
                .large-cursor body *:not(#a11y-embed-host-react):not(#a11y-embed-host-react *):not(.accessibility-bar):not(.accessibility-bar *) {
                cursor: url("${svgCursor}") ${hotspot} ${hotspot}, auto !important;
                }
                #a11y-embed-host-react, #a11y-embed-host-react *, .accessibility-bar, .accessibility-bar * {
                cursor: default !important;
                }
            `;
            document.documentElement.classList.add('large-cursor');
        } else {
            document.documentElement.classList.remove('large-cursor');
            document.getElementById('a11y-cursor-style')?.remove();
        }
        localStorage.setItem('accessibility-cursorSize', cursorSize.toString());
        localStorage.setItem('accessibility-cursorColor', cursorColor);
    }, [cursorSize, cursorColor]);

    useEffect(() => localStorage.setItem('accessibility-buttonPosition', buttonPosition), [buttonPosition]);
    useEffect(() => localStorage.setItem('accessibility-panelPosition', panelPosition), [panelPosition]);

    return {
        cursorSize, setCursorSize,
        cursorColor, setCursorColor,
        buttonPosition, setButtonPosition,
        panelPosition, setPanelPosition,
    };
}
