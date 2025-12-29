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
    }, []);

    useEffect(() => {
        localStorage.setItem('accessibility-magnifier', magnifier.toString());
    }, [magnifier]);


    useEffect(() => {
        if (highContrast) document.documentElement.classList.add('high-contrast');
        else document.documentElement.classList.remove('high-contrast');
        localStorage.setItem('accessibility-highContrast', highContrast.toString());
    }, [highContrast]);

    useEffect(() => {
        if (grayscale) document.documentElement.classList.add('grayscale-mode');
        else document.documentElement.classList.remove('grayscale-mode');
        localStorage.setItem('accessibility-grayscale', grayscale.toString());
    }, [grayscale]);

    useEffect(() => {
        if (invertColors) document.documentElement.classList.add('invert-colors');
        else document.documentElement.classList.remove('invert-colors');
        localStorage.setItem('accessibility-invertColors', invertColors.toString());
    }, [invertColors]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
            if (!backgroundColor) {
                setTextColor('#FFFFFF');
                setHeadingColor('#FFFFFF');
            }
        } else {
            document.documentElement.classList.remove('dark-mode');
            if (!backgroundColor) {
                setTextColor('#000000');
                setHeadingColor('#000000');
            }
        }
        localStorage.setItem('accessibility-darkMode', darkMode.toString());
    }, [darkMode, backgroundColor]);

    useEffect(() => {
        document.documentElement.setAttribute('data-color-blind', colorBlindFilter);
        localStorage.setItem('accessibility-colorBlindFilter', colorBlindFilter);
    }, [colorBlindFilter]);

    useEffect(() => {
        const content = document.getElementById('accessible-content');
        if (content) {
            content.style.zoom = `${pageZoom}%`;
        }
        localStorage.setItem('accessibility-pageZoom', pageZoom.toString());
    }, [pageZoom]);

    useEffect(() => {
        if (backgroundColor) {
            document.documentElement.style.setProperty('--page-bg-color', backgroundColor, 'important');
            document.body.style.setProperty('background-color', backgroundColor, 'important');
        } else {
            document.documentElement.style.removeProperty('--page-bg-color');
            document.body.style.removeProperty('background-color');
        }
        localStorage.setItem('accessibility-backgroundColor', backgroundColor);
    }, [backgroundColor]);

    useEffect(() => {
        document.documentElement.style.setProperty('--text-color', textColor, 'important');
        localStorage.setItem('accessibility-textColor', textColor);
    }, [textColor]);

    useEffect(() => {
        document.documentElement.style.setProperty('--heading-color', headingColor, 'important');
        localStorage.setItem('accessibility-headingColor', headingColor);
    }, [headingColor]);

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
        magnifier, setMagnifier
    };
}
