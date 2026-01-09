'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';


export default function VisualConfirmation() {
    const { notification, barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
    if (!notification.visible || !notification.message) return null;

    const textColor = theme.active === '#FFFFFF' ? '#000000' : '#FFFFFF';

    const style: React.CSSProperties = {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'max-content',
        maxWidth: '90vw'
    };

    return (
        <div
            className="z-[2147483650] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 pointer-events-none"
            style={{
                ...style,
                backgroundColor: theme.active, // Use active theme color
                color: textColor, // Contrast text
                border: `2px solid ${theme.border || 'white'}`,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)'
            }}
        >
            <div className="flex flex-col items-center">
                <span className="text-[14px] sm:text-[16px] font-bold text-center leading-tight">
                    {notification.message}
                </span>
            </div>
        </div>
    );
}
