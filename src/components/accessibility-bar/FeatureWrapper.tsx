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
            className={`transition-all duration-500 rounded-xl ${className}`}
            style={{
                borderColor: 'transparent',
                boxShadow: 'none',
                backgroundColor: 'transparent'
            }}
        >
            {children}
        </div>
    );
}
