import { useState, useEffect } from 'react';
import { isInsideAccessibilityBar } from './utils';

export function useContentSettings() {
    const [hideImages, setHideImages] = useState<boolean>(false);
    const [showImageDescriptions, setShowImageDescriptions] = useState<boolean>(false);
    const [plainTextMode, setPlainTextMode] = useState<boolean>(false);
    const [plainTextSize, setPlainTextSize] = useState<'small' | 'medium' | 'large'>('medium');
    const [pauseAnimations, setPauseAnimations] = useState<boolean>(false);
    const [stopVideos, setStopVideos] = useState<boolean>(false);
    const [reduceMotion, setReduceMotion] = useState<boolean>(false);
    const [simplifiedLayout, setSimplifiedLayout] = useState<boolean>(false);


    useEffect(() => {
        const saved = {
            hideImages: localStorage.getItem('accessibility-hideImages'),
            showImageDescriptions: localStorage.getItem('accessibility-showImageDescriptions'),
            plainTextMode: localStorage.getItem('accessibility-plainTextMode'),
            plainTextSize: localStorage.getItem('accessibility-plainTextSize'),
            pauseAnimations: localStorage.getItem('accessibility-pauseAnimations'),
            stopVideos: localStorage.getItem('accessibility-stopVideos'),
            reduceMotion: localStorage.getItem('accessibility-reduceMotion'),
        };

        if (saved.hideImages === 'true') setHideImages(true);
        if (saved.showImageDescriptions === 'true') setShowImageDescriptions(true);
        if (saved.plainTextMode === 'true') setPlainTextMode(true);
        if (saved.plainTextSize) setPlainTextSize(saved.plainTextSize as any);
        if (saved.pauseAnimations === 'true') setPauseAnimations(true);
        if (saved.stopVideos === 'true') setStopVideos(true);
        if (saved.reduceMotion === 'true') setReduceMotion(true);
    }, []);


    useEffect(() => {
        if (hideImages) document.documentElement.classList.add('hide-images');
        else document.documentElement.classList.remove('hide-images');
        localStorage.setItem('accessibility-hideImages', hideImages.toString());
    }, [hideImages]);

    useEffect(() => {
        if (showImageDescriptions) {
            document.documentElement.classList.add('show-image-descriptions');
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.alt && !isInsideAccessibilityBar(img)) {
                    img.setAttribute('data-alt', img.alt);
                }
            });
        } else {
            document.documentElement.classList.remove('show-image-descriptions');
            document.querySelectorAll('[data-alt]').forEach(el => el.removeAttribute('data-alt'));
        }
        localStorage.setItem('accessibility-showImageDescriptions', showImageDescriptions.toString());
    }, [showImageDescriptions]);

    useEffect(() => {
        if (plainTextMode) {
            document.documentElement.classList.add('plain-text-mode');
            document.documentElement.setAttribute('data-plain-text-size', plainTextSize);
        } else {
            document.documentElement.classList.remove('plain-text-mode');
            document.documentElement.removeAttribute('data-plain-text-size');
        }
        localStorage.setItem('accessibility-plainTextMode', plainTextMode.toString());
        localStorage.setItem('accessibility-plainTextSize', plainTextSize);
    }, [plainTextMode, plainTextSize]);

    useEffect(() => {
        if (pauseAnimations) document.documentElement.classList.add('pause-animations');
        else document.documentElement.classList.remove('pause-animations');
        localStorage.setItem('accessibility-pauseAnimations', pauseAnimations.toString());
    }, [pauseAnimations]);

    useEffect(() => {
        if (stopVideos) {
            document.documentElement.classList.add('stop-videos');
        } else {
            document.documentElement.classList.remove('stop-videos');
        }
        localStorage.setItem('accessibility-stopVideos', stopVideos.toString());
    }, [stopVideos]);

    useEffect(() => {
        if (reduceMotion) document.documentElement.classList.add('reduce-motion');
        else document.documentElement.classList.remove('reduce-motion');
        localStorage.setItem('accessibility-reduceMotion', reduceMotion.toString());
    }, [reduceMotion]);

    return {
        hideImages, setHideImages,
        showImageDescriptions, setShowImageDescriptions,
        plainTextMode, setPlainTextMode,
        plainTextSize, setPlainTextSize,
        pauseAnimations, setPauseAnimations,
        stopVideos, setStopVideos,
        reduceMotion, setReduceMotion,
        simplifiedLayout, setSimplifiedLayout,
    };
}
