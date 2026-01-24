import { useState, useRef, useEffect } from 'react';
// import Image from 'next/image';
import infoIcon from '@/assets/icons/info.png?inline';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

interface InfoPopupButtonProps {
    title: string;
    description: string;
}

export default function InfoPopupButton({ title, description }: InfoPopupButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
    const popupRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

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


    return (
        <div className="relative inline-flex items-center ml-2" ref={popupRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-full transition-colors flex items-center justify-center active:scale-95 duration-200"
                title="More info"
                style={{ width: '32px', height: '32px' }}
                aria-label={`More info about ${title}`}
            >
                <img
                    src={typeof infoIcon === 'string' ? infoIcon : (infoIcon as any).src || infoIcon}
                    alt="Info"
                    width={22}
                    height={22}
                    className="opacity-100"
                    style={{ filter: 'brightness(0) invert(1)' }}
                />
            </button>

            {isOpen && (
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 p-3 rounded-xl shadow-2xl border z-[2147483647] animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                        background: `linear-gradient(135deg, ${theme.background}cc 0%, ${theme.background}dd 100%)`,
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        borderColor: `${theme.border}80`,
                        borderWidth: '1px',
                        color: theme.text,
                        maxHeight: '300px',
                        overflowY: 'auto',
                        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full hover:bg-black/10 transition-colors"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 hover:opacity-100">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <div className="mb-2 p-1.5 rounded-full bg-white/20 backdrop-blur-sm inline-flex items-center justify-center">
                        <img
                            src={typeof infoIcon === 'string' ? infoIcon : (infoIcon as any).src || infoIcon}
                            alt=""
                            width={18}
                            height={18}
                            className="opacity-100"
                            style={{ filter: 'brightness(0)' }}
                        />
                    </div>

                    <h3 className="text-sm font-bold mb-1.5">{title}</h3>
                    <p className="text-xs opacity-90 leading-relaxed font-normal">{description}</p>
                </div>
            )}
        </div>
    );
}
