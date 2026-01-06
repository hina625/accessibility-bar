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
    const [textColor, setTextColor] = useState<string>('#000000');
    const [headingColor, setHeadingColor] = useState<string>('#000000');
    const [magnifier, setMagnifier] = useState<boolean>(false);
    const [magnifierScale, setMagnifierScale] = useState<number>(2);

    useEffect(() => {
        const saved = {
            highContrast: localStorage.getItem('accessibility-highContrast'),
            grayscale: localStorage.getItem('accessibility-grayscale'),
            invertColors: localStorage.getItem('accessibility-invertColors'),
            darkMode: localStorage.getItem('accessibility-darkMode'),
            colorBlindFilter: localStorage.getItem('accessibility-colorBlindFilter'),
            pageZoom: localStorage.getItem('accessibility-pageZoom'),
            backgroundColor: localStorage.getItem('accessibility-backgroundColor'),
            textColor: localStorage.getItem('accessibility-textColor'),
            headingColor: localStorage.getItem('accessibility-headingColor'),
        };

        if (saved.highContrast === 'true') setHighContrast(true);
        if (saved.grayscale === 'true') setGrayscale(true);
        if (saved.invertColors === 'true') setInvertColors(true);
        if (saved.darkMode === 'true') setDarkMode(true);
        if (saved.colorBlindFilter) setColorBlindFilter(saved.colorBlindFilter as ColorBlindFilter);
        if (saved.pageZoom) setPageZoom(Number(saved.pageZoom));
        if (saved.backgroundColor) setBackgroundColor(saved.backgroundColor);
        if (saved.textColor) setTextColor(saved.textColor);
        if (saved.headingColor) setHeadingColor(saved.headingColor);
        if (localStorage.getItem('accessibility-magnifier') === 'true') setMagnifier(true);
        if (localStorage.getItem('accessibility-magnifierScale')) setMagnifierScale(Number(localStorage.getItem('accessibility-magnifierScale')));
    }, []);

    useEffect(() => {
        localStorage.setItem('accessibility-magnifier', magnifier.toString());
        localStorage.setItem('accessibility-magnifierScale', magnifierScale.toString());
    }, [magnifier, magnifierScale]);


    // Unified effect for class-based filters
    useEffect(() => {
        const syncStates = () => {
            const host = document.getElementById('a11y-embed-host-react');
            const roots = [document.documentElement];
            if (host) roots.push(host);

            roots.forEach(root => {
                // High Contrast
                if (highContrast) root.classList.add('high-contrast');
                else root.classList.remove('high-contrast');

                // Grayscale
                if (grayscale) root.classList.add('grayscale-mode');
                else root.classList.remove('grayscale-mode');

                // Invert Colors
                if (invertColors) root.classList.add('invert-colors');
                else root.classList.remove('invert-colors');

                // Dark Mode
                if (darkMode) root.classList.add('dark-mode');
                else root.classList.remove('dark-mode');

                // Color Blind
                root.setAttribute('data-color-blind', colorBlindFilter);

                // Custom Colors
                if (backgroundColor) {
                    root.style.setProperty('--page-bg-color', backgroundColor, 'important');
                    if (root === document.documentElement) document.body.style.setProperty('background-color', backgroundColor, 'important');
                } else {
                    root.style.removeProperty('--page-bg-color');
                    if (root === document.documentElement) document.body.style.removeProperty('background-color');
                }
                root.style.setProperty('--text-color', textColor, 'important');
                root.style.setProperty('--heading-color', headingColor, 'important');
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
        if (content) {
            content.style.zoom = `${pageZoom}%`;
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
