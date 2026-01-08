'use client';

import { useEffect, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

export default function ReadingProgressBar() {
    const { readingProgressBar, readingProgressBarColor, barTheme } = useAccessibility();
    const [progress, setProgress] = useState(0);
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    useEffect(() => {
        if (!readingProgressBar) return;

        const updateProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                setProgress((window.scrollY / scrollHeight) * 100);
            }
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial check

        return () => window.removeEventListener('scroll', updateProgress);
    }, [readingProgressBar]);

    if (!readingProgressBar) return null;

    return (
        <div
            className="fixed top-0 left-0 h-1.5 z-[99999] transition-all duration-100 ease-out"
            style={{
                width: `${progress}%`,
                backgroundColor: readingProgressBarColor || '#000000',
                boxShadow: 'none'
            }}
        />
    );
}
