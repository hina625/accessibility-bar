
import React from 'react';
import { useAccessibility } from '@/contexts/accessibility';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

interface FeedbackPopupProps {
    onClose: () => void;
    onSubmit?: () => void;
}

export default function FeedbackPopup({ onClose, onSubmit }: FeedbackPopupProps) {
    const { barTheme } = useAccessibility();
    const currentTheme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
    const [submitted, setSubmitted] = React.useState(false);
    const [rating, setRating] = React.useState<number | null>(null);

    const handleSubmit = () => {
        if (rating !== null) {
            setSubmitted(true);
            setTimeout(() => {
                if (onSubmit) {
                    onSubmit();
                } else {
                    onClose();
                }
            }, 2000);
        }
    };

    if (submitted) {
        return (
            <div className="accessibility-bar pointer-events-auto fixed inset-0 z-[2147483648] flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                <div
                    className="relative rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center m-4 animate-scale-up z-10"
                    style={{
                        backgroundColor: currentTheme.background,
                        color: currentTheme.text,
                        border: `2px solid ${currentTheme.border}`
                    }}
                >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${currentTheme.border}20`, color: currentTheme.active }}>
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-black mb-2">Thank You!</h3>
                    <p className="opacity-90 font-medium text-base" style={{ color: currentTheme.text }}>Your feedback helps us improve.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="accessibility-bar pointer-events-auto fixed inset-0 z-[2147483648] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className="relative rounded-3xl p-4 sm:p-8 shadow-2xl max-w-4xl w-full m-4 z-10 animate-scale-up border-[4px] sm:border-[6px]"
                style={{
                    backgroundColor: currentTheme.background,
                    color: currentTheme.text,
                    borderColor: currentTheme.border
                }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                    style={{ color: 'white' }}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center w-full">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-6 sm:mb-10 px-4 leading-tight">
                        How likely are you to recommend our Accessibility Bar to a friend?
                    </h2>

                    <div
                        className="flex justify-center gap-2 md:gap-3 mb-4 overflow-x-auto pb-4 px-2"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        <style jsx>{`
                            div::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        {Array.from({ length: 11 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setRating(i)}
                                className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl text-lg md:text-2xl font-black transition-all duration-200 border-[3px] ${rating === i
                                    ? 'shadow-xl z-10'
                                    : 'hover:shadow-md'
                                    }`}
                                style={{
                                    backgroundColor: rating === i ? currentTheme.text : 'transparent',
                                    color: rating === i ? currentTheme.background : currentTheme.text,
                                    borderColor: currentTheme.border
                                }}
                            >
                                {i}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between px-2 sm:px-10 mb-8 sm:mb-10 text-base sm:text-lg font-bold">
                        <button
                            onClick={() => setRating(0)}
                            className="hover:underline transition-opacity text-left"
                            style={{ color: currentTheme.text }}
                        >
                            Not likely
                        </button>
                        <button
                            onClick={() => setRating(10)}
                            className="hover:underline transition-opacity text-right"
                            style={{ color: currentTheme.text }}
                        >
                            Very likely
                        </button>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={rating === null}
                        className="w-full sm:w-auto px-10 sm:px-16 py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-lg sm:text-xl transition-all shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none bg-black text-white"
                        style={{
                            backgroundColor: currentTheme.text,
                            color: currentTheme.background
                        }}
                    >
                        Submit Feedback
                    </button>
                </div>
            </div>
        </div>
    );
}
