'use client';

import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

interface FeatureWrapperProps {
    children: React.ReactNode;
    featureId: string;
    highlightedFeature: string | null;
    className?: string;
}

export default function FeatureWrapper({
    children,
    featureId,
    highlightedFeature,
    className = ''
}: FeatureWrapperProps) {
    const { barTheme } = useAccessibility();
    const currentTheme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
    const elementRef = useRef<HTMLDivElement>(null);
    const isHighlighted = featureId === highlightedFeature;

    useEffect(() => {
        if (isHighlighted && elementRef.current) {
            // Slight delay to ensure the panel has rendered and opened
            setTimeout(() => {
                elementRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        }
    }, [isHighlighted]);

    return (
        <div
            ref={elementRef}
            className={`transition-all duration-500 rounded-xl ${className} ${isHighlighted ? 'ring-4 ring-offset-2 z-10' : ''
                }`}
            style={{
                borderColor: isHighlighted ? currentTheme.active : 'transparent',
                boxShadow: isHighlighted ? `0 0 0 4px ${currentTheme.active}40` : 'none',
                // We use inline style for the ring color because tailwind ring color classes might not match our dynamic theme
                ['--tw-ring-color' as any]: isHighlighted ? currentTheme.active : 'transparent',
                ['--tw-ring-offset-color' as any]: currentTheme.background,
                backgroundColor: isHighlighted ? `${currentTheme.active}15` : 'transparent'
            }}
        >
            {children}
        </div>
    );
}
