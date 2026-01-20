import { useState, useEffect } from 'react';
import { ColorBlindFilter } from './types';
import {
    DEFAULT_PAGE_ZOOM,
    MIN_PAGE_ZOOM,
    MAX_PAGE_ZOOM,
    isInsideAccessibilityBar
} from './utils';

export function useVisualSettings() {
    const [highContrast, setHighContrast] = useState<boolean>(false);
    const [grayscale, setGrayscale] = useState<boolean>(false);
    const [invertColors, setInvertColors] = useState<boolean>(false);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [colorBlindFilter, setColorBlindFilter] = useState<ColorBlindFilter>('none');
    const [pageZoom, setPageZoom] = useState<number>(DEFAULT_PAGE_ZOOM);
    const [backgroundColor, setBackgroundColor] = useState<string>('');
    const [textColor, setTextColor] = useState<string>('');
    const [headingColor, setHeadingColor] = useState<string>('');
    const [magnifier, setMagnifier] = useState<boolean>(false);
    const [magnifierScale, setMagnifierScale] = useState<number>(2);

    useEffect(() => {
        // Don't load from localStorage on initial mount - start with defaults
        // Styles will only be applied when user explicitly selects options
    }, []);

    useEffect(() => {
        localStorage.setItem('accessibility-magnifier', magnifier.toString());
        localStorage.setItem('accessibility-magnifierScale', magnifierScale.toString());
    }, [magnifier, magnifierScale]);

    useEffect(() => {
        const syncStates = () => {
            const host = document.getElementById('a11y-embed-host-react');
            const roots = [document.documentElement];
            if (host) roots.push(host);

            roots.forEach(root => {

                if (highContrast) root.classList.add('high-contrast');
                else root.classList.remove('high-contrast');


                if (grayscale) root.classList.add('grayscale-mode');
                else root.classList.remove('grayscale-mode');

                if (invertColors) root.classList.add('invert-colors');
                else root.classList.remove('invert-colors');


                if (darkMode) root.classList.add('dark-mode');
                else root.classList.remove('dark-mode');


                root.setAttribute('data-color-blind', colorBlindFilter);


                if (backgroundColor) {
                    root.style.setProperty('--page-bg-color', backgroundColor, 'important');
                    if (root === document.documentElement) document.body.style.setProperty('background-color', backgroundColor, 'important');
                } else {
                    root.style.removeProperty('--page-bg-color');
                    if (root === document.documentElement) document.body.style.removeProperty('background-color');
                }
                if (textColor) {
                    root.style.setProperty('--text-color', textColor, 'important');
                } else {
                    root.style.removeProperty('--text-color');
                }

                if (headingColor) {
                    root.style.setProperty('--heading-color', headingColor, 'important');
                } else {
                    root.style.removeProperty('--heading-color');
                }
            });
        };

        syncStates();

        localStorage.setItem('accessibility-highContrast', highContrast.toString());
        localStorage.setItem('accessibility-grayscale', grayscale.toString());
        localStorage.setItem('accessibility-invertColors', invertColors.toString());
        localStorage.setItem('accessibility-darkMode', darkMode.toString());
        localStorage.setItem('accessibility-colorBlindFilter', colorBlindFilter);
        localStorage.setItem('accessibility-backgroundColor', backgroundColor);
        localStorage.setItem('accessibility-textColor', textColor);
        localStorage.setItem('accessibility-headingColor', headingColor);
    }, [highContrast, grayscale, invertColors, darkMode, colorBlindFilter, backgroundColor, textColor, headingColor]);

    useEffect(() => {
        const content = document.getElementById('accessible-content') || document.body;
        const savedPageZoom = localStorage.getItem('accessibility-pageZoom');
        // Only apply zoom if it's not 100% (default) or if user has explicitly set it
        if (content && (pageZoom !== DEFAULT_PAGE_ZOOM || (savedPageZoom && Number(savedPageZoom) !== DEFAULT_PAGE_ZOOM))) {
            content.style.zoom = `${pageZoom}%`;
        } else if (content && pageZoom === DEFAULT_PAGE_ZOOM && (!savedPageZoom || Number(savedPageZoom) === DEFAULT_PAGE_ZOOM)) {
            // Remove zoom if at default
            content.style.zoom = '';
        }
        localStorage.setItem('accessibility-pageZoom', pageZoom.toString());
    }, [pageZoom]);

    return {
        highContrast, setHighContrast,
        grayscale, setGrayscale,
        invertColors, setInvertColors,
        darkMode, setDarkMode,
        colorBlindFilter, setColorBlindFilter,
        pageZoom, setPageZoom,
        backgroundColor, setBackgroundColor,
        textColor, setTextColor,
        headingColor, setHeadingColor,
        magnifier, setMagnifier,
        magnifierScale, setMagnifierScale
    };
}
