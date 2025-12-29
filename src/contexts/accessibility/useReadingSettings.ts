import { useState, useEffect } from 'react';

export function useReadingSettings() {
    const [readingGuide, setReadingGuide] = useState<boolean>(false);
    const [readingGuideColor, setReadingGuideColor] = useState<string>('rgba(59,130,246,0.5)');
    const [readingGuideThickness, setReadingGuideThickness] = useState<number>(4);
    const [readingRuler, setReadingRuler] = useState<boolean>(false);
    const [readingRulerColor, setReadingRulerColor] = useState<string>('rgba(22, 163, 74, 0.8)');
    const [readingRulerWidth, setReadingRulerWidth] = useState<number>(60);
    const [readingMask, setReadingMask] = useState<boolean>(false);
    const [readingMaskColor, setReadingMaskColor] = useState<string>('rgba(0, 0, 0, 1)');
    const [readingMaskSize, setReadingMaskSize] = useState<number>(140);
    const [readingSpotlight, setReadingSpotlight] = useState<boolean>(false);
    const [readingSpotlightBrightness, setReadingSpotlightBrightness] = useState<number>(1.5);
    const [highlightLinks, setHighlightLinks] = useState<boolean>(false);
    const [highlightHeadings, setHighlightHeadings] = useState<boolean>(false);
    const [largeButtons, setLargeButtons] = useState<boolean>(false);

    // Initial load
    useEffect(() => {
        const saved = {
            readingGuide: localStorage.getItem('accessibility-readingGuide'),
            readingGuideColor: localStorage.getItem('accessibility-readingGuideColor'),
            readingGuideThickness: localStorage.getItem('accessibility-readingGuideThickness'),
            readingRuler: localStorage.getItem('accessibility-readingRuler'),
            readingRulerColor: localStorage.getItem('accessibility-readingRulerColor'),
            readingRulerWidth: localStorage.getItem('accessibility-readingRulerWidth'),
            readingMask: localStorage.getItem('accessibility-readingMask'),
            readingMaskColor: localStorage.getItem('accessibility-readingMaskColor'),
            readingMaskSize: localStorage.getItem('accessibility-readingMaskSize'),
            readingSpotlight: localStorage.getItem('accessibility-readingSpotlight'),
            readingSpotlightBrightness: localStorage.getItem('accessibility-readingSpotlightBrightness'),
            highlightLinks: localStorage.getItem('accessibility-highlightLinks'),
            highlightHeadings: localStorage.getItem('accessibility-highlightHeadings'),
            largeButtons: localStorage.getItem('accessibility-largeButtons'),
        };

        if (saved.readingGuide === 'true') setReadingGuide(true);
        if (saved.readingGuideColor) setReadingGuideColor(saved.readingGuideColor);
        if (saved.readingGuideThickness) setReadingGuideThickness(Number(saved.readingGuideThickness));
        if (saved.readingRuler === 'true') setReadingRuler(true);
        if (saved.readingRulerColor) setReadingRulerColor(saved.readingRulerColor);
        if (saved.readingRulerWidth) setReadingRulerWidth(Number(saved.readingRulerWidth));
        if (saved.readingMask === 'true') setReadingMask(true);
        if (saved.readingMaskColor) setReadingMaskColor(saved.readingMaskColor);
        if (saved.readingMaskSize) setReadingMaskSize(Number(saved.readingMaskSize));
        if (saved.readingSpotlight === 'true') setReadingSpotlight(true);
        if (saved.readingSpotlightBrightness) setReadingSpotlightBrightness(Number(saved.readingSpotlightBrightness));
        if (saved.highlightLinks === 'true') setHighlightLinks(true);
        if (saved.highlightHeadings === 'true') setHighlightHeadings(true);
        if (saved.largeButtons === 'true') setLargeButtons(true);
    }, []);

    // Effects
    useEffect(() => {
        localStorage.setItem('accessibility-readingGuide', readingGuide.toString());
        localStorage.setItem('accessibility-readingGuideColor', readingGuideColor);
        localStorage.setItem('accessibility-readingGuideThickness', readingGuideThickness.toString());
    }, [readingGuide, readingGuideColor, readingGuideThickness]);

    useEffect(() => {
        localStorage.setItem('accessibility-readingRuler', readingRuler.toString());
        localStorage.setItem('accessibility-readingRulerColor', readingRulerColor);
        localStorage.setItem('accessibility-readingRulerWidth', readingRulerWidth.toString());
    }, [readingRuler, readingRulerColor, readingRulerWidth]);

    useEffect(() => {
        localStorage.setItem('accessibility-readingMask', readingMask.toString());
        localStorage.setItem('accessibility-readingMaskColor', readingMaskColor);
        localStorage.setItem('accessibility-readingMaskSize', readingMaskSize.toString());
    }, [readingMask, readingMaskColor, readingMaskSize]);

    useEffect(() => {
        localStorage.setItem('accessibility-readingSpotlight', readingSpotlight.toString());
        localStorage.setItem('accessibility-readingSpotlightBrightness', readingSpotlightBrightness.toString());
    }, [readingSpotlight, readingSpotlightBrightness]);

    useEffect(() => {
        if (highlightLinks) document.documentElement.classList.add('highlight-links');
        else document.documentElement.classList.remove('highlight-links');
        localStorage.setItem('accessibility-highlightLinks', highlightLinks.toString());
    }, [highlightLinks]);

    useEffect(() => {
        if (highlightHeadings) document.documentElement.classList.add('highlight-headings');
        else document.documentElement.classList.remove('highlight-headings');
        localStorage.setItem('accessibility-highlightHeadings', highlightHeadings.toString());
    }, [highlightHeadings]);

    useEffect(() => {
        if (largeButtons) document.documentElement.classList.add('large-buttons');
        else document.documentElement.classList.remove('large-buttons');
        localStorage.setItem('accessibility-largeButtons', largeButtons.toString());
    }, [largeButtons]);

    return {
        readingGuide, setReadingGuide,
        readingGuideColor, setReadingGuideColor,
        readingGuideThickness, setReadingGuideThickness,
        readingRuler, setReadingRuler,
        readingRulerColor, setReadingRulerColor,
        readingRulerWidth, setReadingRulerWidth,
        readingMask, setReadingMask,
        readingMaskColor, setReadingMaskColor,
        readingMaskSize, setReadingMaskSize,
        readingSpotlight, setReadingSpotlight,
        readingSpotlightBrightness, setReadingSpotlightBrightness,
        highlightLinks, setHighlightLinks,
        highlightHeadings, setHighlightHeadings,
        largeButtons, setLargeButtons,
    };
}
