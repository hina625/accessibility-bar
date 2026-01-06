'use client';

import { useState, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

// Helper to track usage
const trackFeatureUsage = (feature: string) => {
    try {
        const usage = JSON.parse(localStorage.getItem('accessibility-usage') || '{}');
        usage[feature] = (usage[feature] || 0) + 1;
        localStorage.setItem('accessibility-usage', JSON.stringify(usage));
        return usage[feature];
    } catch (e) {
        return 0;
    }
};

interface Suggestion {
    id: string;
    message: string;
    shortcut: string;
    featureTrigger: string; // The flag to watch
}

const SUGGESTIONS: Suggestion[] = [
    { id: 'contrast', message: 'Toggle High Contrast quickly?', shortcut: 'Alt + C', featureTrigger: 'highContrast' },
    { id: 'font', message: 'Adjust Font Size instantly?', shortcut: 'Alt + F', featureTrigger: 'fontSize' },
    { id: 'menu', message: 'Open/Close menu faster?', shortcut: 'Ctrl + Shift + A', featureTrigger: 'isOpen' } // special case
];

export default function SmartSuggestions() {
    const { smartSuggestions, highContrast, fontSize, barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme];
    const [toast, setToast] = useState<{ message: string, shortcut: string } | null>(null);

    // Watch High Contrast
    useEffect(() => {
        if (!smartSuggestions) return;
        const count = trackFeatureUsage('highContrast');
        if (count % 3 === 0) { // Show on every 3rd usage
            showToast('Toggle High Contrast quickly', 'Alt + C');
        }
    }, [highContrast, smartSuggestions]);

    // Watch Font Size
    useEffect(() => {
        if (!smartSuggestions) return;
        const count = trackFeatureUsage('fontSize');
        if (count % 3 === 0) {
            showToast('Adjust Font Size instantly', 'Alt + F');
        }
    }, [fontSize, smartSuggestions]);


    const showToast = (message: string, shortcut: string) => {
        setToast({ message, shortcut });
        setTimeout(() => setToast(null), 5000); // Hide after 5s
    };

    if (!toast) return null;

    return (
        <div
            className="fixed bottom-24 right-6 z-[2147483647] p-4 rounded-xl shadow-2xl border animate-in slide-in-from-right duration-300 max-w-sm flex items-center gap-4"
            style={{
                backgroundColor: theme.background,
                color: theme.text,
                borderColor: theme.border,
                pointerEvents: 'auto'
            }}
        >
            <div className="p-2 rounded-full" style={{ backgroundColor: theme.active }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <div>
                <p className="text-sm font-semibold">{toast.message}</p>
                <p className="text-xs mt-0.5" style={{ color: theme.text, opacity: 0.6 }}>
                    Press <kbd className="px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: theme.hover, color: theme.text }}>{toast.shortcut}</kbd>
                </p>
            </div>
            <button
                onClick={() => setToast(null)}
                className="ml-auto transition-colors flex items-center gap-1 opacity-40 hover:opacity-100"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-tight">Close</span>
            </button>
        </div>
    );
}
