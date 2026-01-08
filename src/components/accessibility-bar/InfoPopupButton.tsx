import { useState, useRef, useEffect } from 'react';
// import Image from 'next/image';
import infoIcon from '@/assets/icons/info.png';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

interface InfoPopupButtonProps {
    title: string;
    description: string;
}

export default function InfoPopupButton({ title, description }: InfoPopupButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<'left' | 'center' | 'right'>('center');
    const { barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme];
    const popupRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Calculate best position to display popup
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const popupWidth = 288; // 18rem = 288px

            // Check if button is near right edge
            if (buttonRect.right + popupWidth / 2 > viewportWidth - 20) {
                setPosition('right');
            }
            // Check if button is near left edge
            else if (buttonRect.left - popupWidth / 2 < 20) {
                setPosition('left');
            }
            else {
                setPosition('center');
            }
        }
    }, [isOpen]);

    // Close popup when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const getPositionClasses = () => {
        switch (position) {
            case 'left':
                return 'left-0';
            case 'right':
                return 'right-0';
            case 'center':
            default:
                return 'left-1/2 -translate-x-1/2';
        }
    };

    return (
        <div className="relative inline-flex items-center ml-2" ref={popupRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center transform hover:scale-110 active:scale-95 duration-200"
                title="More info"
                style={{ width: '24px', height: '24px' }}
                aria-label={`More info about ${title}`}
            >
                <img
                    src={infoIcon.src}
                    alt="Info"
                    width={16}
                    height={16}
                    className="opacity-60 hover:opacity-100"
                    style={{ filter: theme.text === '#FFFFFF' ? 'invert(1)' : 'none' }}
                />
            </button>

            {isOpen && (
                <div
                    className={`absolute ${getPositionClasses()} top-full mt-2 w-72 p-4 rounded-xl shadow-2xl border z-[2147483647] animate-in fade-in slide-in-from-top-2 duration-200`}
                    style={{
                        backgroundColor: `${theme.background}f0`,
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderColor: theme.border,
                        color: theme.text,
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-black/5 transition-colors"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 hover:opacity-100">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <div className="mb-3 p-2 rounded-full bg-blue-100/50 inline-flex items-center justify-center">
                        <img
                            src={infoIcon.src}
                            alt=""
                            width={24}
                            height={24}
                            className="opacity-100"
                            style={{ filter: 'brightness(0)' }}
                        />
                    </div>

                    <h3 className="text-base font-bold mb-2">{title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed font-normal">{description}</p>
                </div>
            )}
        </div>
    );
}
