'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { useEffect, useState } from 'react';


export default function VisualConfirmation() {
    const { notification, barTheme, panelPosition } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
    const [hasOpenCategoryPanel, setHasOpenCategoryPanel] = useState(false);
    const [useCenterBottom, setUseCenterBottom] = useState(false);

    // Check if a category panel is open (middle panel) when top bar is active
    useEffect(() => {
        if (panelPosition === 'top' && typeof window !== 'undefined') {
            const checkPanel = () => {
                // Check for fixed category panel - look for elements with fixed positioning and top value > 0
                const allPanels = document.querySelectorAll('.accessibility-bar.fixed');
                let found = false;
                allPanels.forEach((panel) => {
                    const style = window.getComputedStyle(panel);
                    if (style.position === 'fixed' && style.top !== 'auto' && style.top !== '0px') {
                        const topValue = parseInt(style.top);
                        // Category panel is typically at top: 90px or 94px (below the main bar)
                        if (topValue >= 80 && topValue <= 120) {
                            found = true;
                        }
                    }
                });
                setHasOpenCategoryPanel(found);
            };
            
            checkPanel();
            const interval = setInterval(checkPanel, 200);
            return () => clearInterval(interval);
        } else {
            setHasOpenCategoryPanel(false);
        }
    }, [panelPosition, notification.visible]);

    // When top panel is selected and category panel is open, position at bottom right or center bottom
    const isTopPanelWithCategory = panelPosition === 'top' && hasOpenCategoryPanel;
    
    useEffect(() => {
        if (isTopPanelWithCategory && typeof window !== 'undefined') {
            const checkOverlap = () => {
                const panel = document.querySelector('.accessibility-bar.fixed[style*="top"]') as HTMLElement;
                if (panel) {
                    const panelRect = panel.getBoundingClientRect();
                    const panelRight = panelRect.right;
                    const windowWidth = window.innerWidth;
                    // If panel extends too far right, use center bottom instead
                    if (panelRight > windowWidth - 250) { // 250px is approximate notification width
                        setUseCenterBottom(true);
                    } else {
                        setUseCenterBottom(false);
                    }
                }
            };
            checkOverlap();
            const interval = setInterval(checkOverlap, 200);
            return () => clearInterval(interval);
        } else {
            setUseCenterBottom(false);
        }
    }, [isTopPanelWithCategory]);
    
    // Early return AFTER all hooks
    if (!notification.visible || !notification.message) return null;

    const textColor = theme.active === '#FFFFFF' ? '#000000' : '#FFFFFF';
    const isTopOrBottomPanel = panelPosition === 'top' || panelPosition === 'bottom';
    
    const style: React.CSSProperties = isTopPanelWithCategory
        ? useCenterBottom
            ? {
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                right: 'auto',
                top: 'auto',
                transform: 'translateX(-50%)',
                width: 'max-content',
                maxWidth: '90vw',
                zIndex: 2147483650
            }
            : {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                left: 'auto',
                top: 'auto',
                transform: 'none',
                width: 'max-content',
                maxWidth: '90vw',
                zIndex: 2147483650
            }
        : isTopOrBottomPanel
        ? {
            position: 'fixed',
            top: panelPosition === 'top' ? '50%' : 'auto',
            bottom: panelPosition === 'bottom' ? '20px' : 'auto',
            right: '20px',
            transform: panelPosition === 'top' ? 'translateY(-50%)' : 'none',
            left: 'auto',
            width: 'max-content',
            maxWidth: '90vw'
        }
        : {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'max-content',
            maxWidth: '90vw'
        };

    const animationClass = isTopPanelWithCategory 
        ? (useCenterBottom ? 'slide-in-from-bottom-2' : 'slide-in-from-right-2')
        : (isTopOrBottomPanel ? 'slide-in-from-right-2' : 'slide-in-from-bottom-2');

    return (
        <div
            className={`z-[2147483650] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl animate-in fade-in zoom-in-95 ${animationClass} duration-200 pointer-events-none`}
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
