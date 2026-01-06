'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import { useEffect, useState } from 'react';

export default function VisualConfirmation() {
    const { notification, barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme];
    const [renderPosition, setRenderPosition] = useState<{ top: number, left: number } | null>(null);

    useEffect(() => {
        if (notification.visible && notification.position) {
            // Adjust position to stay on screen
            // If top is too high, move below
            let { top, left } = notification.position;

            // Offset logic
            // Default: 60px above the element
            top = top - 60;

            if (top < 20) {
                // If offscreen top, move below (active element top + height + 20)
                // We'd need element height, but we only have top. 
                // Let's just put it at 80px fixed from top if default logic fails
                top = 80;
            }

            setRenderPosition({ top, left });
        } else if (notification.visible && !notification.position) {
            // Fallback to center screen
            setRenderPosition(null);
        }
    }, [notification]);

    if (!notification.visible || !notification.message) return null;

    const style: React.CSSProperties = renderPosition
        ? {
            position: 'fixed',
            top: `${renderPosition.top}px`,
            left: `${renderPosition.left}px`,
            transform: 'translateX(-50%)',
        }
        : {
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
        };

    return (
        <div
            className="z-[2147483650] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 pointer-events-none"
            style={{
                ...style,
                backgroundColor: theme.active, // Use active theme color
                color: theme.active === '#FFFFFF' ? '#000000' : '#FFFFFF', // Contrast text
                border: `2px solid ${theme.border || 'white'}`,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)'
            }}
        >
            <div className="flex flex-col items-center">
                <span className="text-[16px] font-bold text-center leading-tight whitespace-nowrap">
                    {notification.message}
                </span>
            </div>
        </div>
    );
}
