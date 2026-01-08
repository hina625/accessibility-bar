'use client';

import { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations } from '@/contexts/accessibility/translations';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import { API_ENDPOINTS } from '@/config/api';

export default function FeedbackControl() {
    const { language, barTheme } = useAccessibility();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [rating, setRating] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<string, boolean | null>>({
        q1: null, q2: null, q5: null
    });
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const t = translations[language] || translations['en'];
    const theme = BAR_THEMES[barTheme];



    const wordCount = comment.trim() === '' ? 0 : comment.trim().split(/\s+/).length;
    const WORD_LIMIT = 50;

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        const words = text.trim().split(/\s+/);
        if (words.length <= WORD_LIMIT || text.length < comment.length) {
            setComment(text);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(API_ENDPOINTS.FEEDBACK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    rating,
                    answers,
                    comment
                }),
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    // Reset form
                    setName('');
                    setEmail('');
                    setRating(0);
                    setAnswers({
                        q1: null, q2: null, q5: null
                    });
                    setComment('');
                }, 5000);
            } else {
                console.error('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const Checkbox = ({ label, isSelected, onClick }: { label: string, isSelected: boolean, onClick: () => void }) => (
        <label className="flex items-center justify-between gap-4 cursor-pointer group p-2 rounded-lg transition-colors hover:bg-black/5" style={{ color: theme.text }}>
            <span className="text-[16px] font-medium">
                {label}
            </span>
            <div className="relative flex-shrink-0">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onClick}
                    className="appearance-none w-5 h-5 border-2 rounded transition-all cursor-pointer"
                    style={{
                        borderColor: isSelected ? theme.active : theme.border,
                        backgroundColor: isSelected ? theme.active : 'transparent'
                    }}
                />
                {isSelected && (
                    <svg
                        className="absolute top-0 left-0 w-5 h-5 text-white pointer-events-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        </label>
    );

    const ratingLabels = ['Very Poor', 'Poor', 'OK', 'Good', 'Very Good'];

    return (
        <div className="w-full max-w-md mx-auto p-2 animate-fade-in">
            {submitted ? (
                <div
                    className="flex flex-col items-center justify-center p-6 text-center rounded-lg border-2"
                    style={{
                        backgroundColor: `${theme.active}10`,
                        borderColor: `${theme.active}40`
                    }}
                >
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                        style={{
                            backgroundColor: theme.active,
                            boxShadow: 'none'
                        }}
                    >
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-[16px] font-bold mb-2" style={{ color: theme.text }}>
                        Thank You!
                    </h3>
                    <p className="text-[16px] opacity-70" style={{ color: theme.text }}>
                        Your feedback has been submitted successfully.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Yes/No Questions - Simplified list (q1, q2, q5) with numbering */}
                    {[1, 2, 5].map((num, index) => (
                        <div
                            key={num}
                            className="py-3 border-b last:border-b-0"
                            style={{ borderColor: theme.border }}
                        >
                            <div className="space-y-3">
                                <span className="text-[16px] font-bold tracking-tight block" style={{ color: theme.text }}>
                                    {index + 1}. {(t.controls as any)[`q${num}`]}
                                </span>
                                <div className="flex flex-col gap-1">
                                    <Checkbox
                                        label={t.controls.yes}
                                        isSelected={answers[`q${num}`] === true}
                                        onClick={() => setAnswers(prev => ({ ...prev, [`q${num}`]: true }))}
                                    />
                                    <Checkbox
                                        label={t.controls.no}
                                        isSelected={answers[`q${num}`] === false}
                                        onClick={() => setAnswers(prev => ({ ...prev, [`q${num}`]: false }))}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Rating - Question 7 */}
                    <div className="space-y-3 pt-2">
                        <label className="text-[16px] font-bold tracking-tight block" style={{ color: theme.text }}>
                            4. {t.controls.rating}
                        </label>
                        <div className="flex flex-nowrap items-start justify-between gap-0.5 px-0 w-full overflow-hidden">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                                    <button
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="transition-all focus:outline-none"
                                    >
                                        <svg
                                            className="w-10 h-10"
                                            viewBox="0 0 24 24"
                                            fill={rating >= star ? '#FFD700' : 'none'}
                                            stroke={rating >= star ? '#FFD700' : theme.border}
                                            strokeWidth={rating >= star ? 0 : 1.5}
                                        >
                                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </button>
                                    <span
                                        className="text-[9px] font-bold text-center leading-tight opacity-70 whitespace-normal break-words w-full px-0.5"
                                        style={{ color: theme.text }}
                                    >
                                        {ratingLabels[star - 1]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Comment - Question 8 */}
                    <div className="space-y-3 pt-2">
                        <label className="text-[16px] font-bold tracking-tight block" style={{ color: theme.text }}>
                            {t.controls.otherFeedback}
                        </label>
                        <div className="relative">
                            <textarea
                                value={comment}
                                onChange={handleCommentChange}
                                placeholder={t.controls.feedbackPlaceholder}
                                className="w-full h-32 px-4 py-3 text-[16px] border-2 rounded-md resize-none focus:outline-none focus:ring-0 focus:border-current transition-all"
                                style={{
                                    backgroundColor: `${theme.text}08`,
                                    borderColor: theme.border,
                                    color: theme.text
                                }}
                            />
                            <div className="absolute bottom-2 right-3">
                                <span
                                    className="text-[16px] font-medium"
                                    style={{
                                        color: wordCount >= WORD_LIMIT ? '#ef4444' : `${theme.text}60`
                                    }}
                                >
                                    {wordCount}/{WORD_LIMIT}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Optional Section - Name and Email */}
                    <div className="border-t-2 pt-6 mt-6" style={{ borderColor: theme.border }}>
                        <h3 className="text-[16px] font-bold mb-4 uppercase tracking-wide" style={{ color: theme.text }}>
                            Optional
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[16px] font-semibold uppercase tracking-wide block" style={{ color: theme.text }}>
                                    {t.controls.nameLabel}
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 text-[16px] border-2 rounded-md focus:outline-none focus:ring-0 focus:border-current transition-all"
                                    style={{
                                        backgroundColor: `${theme.text}08`,
                                        borderColor: theme.border,
                                        color: theme.text
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[16px] font-semibold uppercase tracking-wide block" style={{ color: theme.text }}>
                                    {t.controls.emailLabel}
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 text-[16px] border-2 rounded-md focus:outline-none focus:ring-0 focus:border-current transition-all"
                                    style={{
                                        backgroundColor: `${theme.text}08`,
                                        borderColor: theme.border,
                                        color: theme.text
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={rating === 0 || Object.values(answers).some(val => val === null) || isSubmitting}
                        className="w-full py-3 px-6 rounded-md text-[16px] font-bold uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg flex items-center justify-center text-center border-2"
                        style={{
                            backgroundColor: theme.active,
                            color: theme.text === '#FFFFFF' ? '#FFFFFF' : theme.text,
                            borderColor: theme.text,
                            boxShadow: 'none'
                        }}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" style={{ color: theme.text }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </div>
                        ) : t.controls.submitFeedback}
                    </button>
                </form>
            )}
        </div>
    );
}
