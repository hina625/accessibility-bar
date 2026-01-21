import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ThemeColors } from '@/contexts/accessibility/theme';

interface TooltipProps {
    text: string;
    rect: DOMRect | null;
    visible: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    theme?: ThemeColors;
}

export default function Tooltip({ text, rect, visible, position = 'top', theme }: TooltipProps) {
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Position calculation effect
    useEffect(() => {
        if (visible && rect && tooltipRef.current) {
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let top = 0;
            let left = 0;

            // Base position calculation
            if (position === 'left' || position === 'right') {
                top = rect.top + rect.height / 2;
                left = position === 'left' ? rect.left - 8 : rect.right + 8;
            } else {
                top = position === 'top' ? rect.top - 8 : rect.bottom + 8;
                left = rect.left + rect.width / 2;
            }

            // Adjust to center the tooltip relative to target center
            // If position is top/bottom, we center horizontally
            // If position is left/right, we center vertically
            // Note: We compute top/left as the top-left corner of the tooltip
            let exactLeft = left;
            let exactTop = top;

            if (position === 'top' || position === 'bottom') {
                exactLeft = left - tooltipRect.width / 2;
                if (position === 'top') exactTop = top - tooltipRect.height;
            } else {
                exactTop = top - tooltipRect.height / 2;
                if (position === 'left') exactLeft = left - tooltipRect.width;
            }

            // Clamp to viewport edges with padding
            const padding = 8;

            // Horizontal clamping
            if (exactLeft < padding) exactLeft = padding;
            if (exactLeft + tooltipRect.width > viewportWidth - padding) {
                exactLeft = viewportWidth - tooltipRect.width - padding;
            }

            // Vertical clamping
            if (exactTop < padding) exactTop = padding;
            if (exactTop + tooltipRect.height > viewportHeight - padding) {
                exactTop = viewportHeight - tooltipRect.height - padding;
            }

            setCoords({ top: exactTop, left: exactLeft });
        }
    }, [visible, rect, position, text]);

    if (!visible || !rect || typeof document === 'undefined') return null;

    const mountNode = document.querySelector('.a11y-embed-host')?.shadowRoot?.getElementById('a11y-react-root')
        || document.getElementById('a11y-react-root')
        || document.body;

    const bgColor = theme ? theme.background : 'rgba(0, 0, 0, 0.9)';
    const textColor = theme ? theme.text : '#FFFFFF';
    const borderColor = theme ? theme.border : 'rgba(255, 255, 255, 0.1)';

    const tooltipContent = (
        <div
            ref={tooltipRef}
            className="fixed z-[2147483655] px-4 py-2 rounded-lg pointer-events-none animate-in fade-in zoom-in-95 duration-150"
            style={{
                backgroundColor: bgColor,
                color: textColor,
                fontSize: '16px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                border: `1px solid ${borderColor}`,
                backdropFilter: 'blur(4px)',
                top: coords.top,
                left: coords.left,
                // We handle positioning manually now, so no transform translate needed
            }}
        >
            {text}
            {/* 
          Simplified arrow: We can try to position it, but with clamping it might detach from the trigger.
          For robustness in "More options" edge cases, hiding the arrow or keeping it simple is safer.
          Let's try to render it but it won't be perfectly aligned if clamped heavily. 
          Actually, let's omit the arrow for now if we are clamping, or just keep it centered on the tooltip edge 
          which might look weird if the tooltip is shifted. 
          Better to show a clean tooltip than a broken arrow.
      */}
        </div>
    );

    return createPortal(tooltipContent, mountNode as Element);
}
