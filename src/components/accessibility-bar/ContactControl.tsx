'use client';

import { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { API_ENDPOINTS } from '@/config/api';

export default function ContactControl() {
    const { barTheme } = useAccessibility();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(API_ENDPOINTS.CONTACT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message
                }),
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    // Reset form
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                }, 5000);
            } else {
                console.error('Failed to submit contact form');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        Message Sent!
                    </h3>
                    <p className="text-[16px] opacity-70" style={{ color: theme.text }}>
                        We'll get back to you soon.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[16px] font-semibold uppercase tracking-wide block" style={{ color: theme.text }}>
                            Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 text-[16px] border-2 rounded-md focus:outline-none focus:ring-0 focus:border-current transition-all"
                            style={{
                                backgroundColor: 'transparent',
                                borderColor: theme.active === '#9b87f5' || theme.active.includes('87f5') ? '#FFFFFF' : theme.active === '#FFD700' || theme.active.includes('D700') ? '#000000' : theme.text,
                                color: theme.text
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[16px] font-semibold uppercase tracking-wide block" style={{ color: theme.text }}>
                            Email *
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 text-[16px] border-2 rounded-md focus:outline-none focus:ring-0 focus:border-current transition-all"
                            style={{
                                backgroundColor: 'transparent',
                                borderColor: theme.active === '#9b87f5' || theme.active.includes('87f5') ? '#FFFFFF' : theme.active === '#FFD700' || theme.active.includes('D700') ? '#000000' : theme.text,
                                color: theme.text
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[16px] font-semibold uppercase tracking-wide block" style={{ color: theme.text }}>
                            Subject
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-4 py-2.5 text-[16px] border-2 rounded-md focus:outline-none focus:ring-0 focus:border-current transition-all"
                            style={{
                                backgroundColor: 'transparent',
                                borderColor: theme.active === '#9b87f5' || theme.active.includes('87f5') ? '#FFFFFF' : theme.active === '#FFD700' || theme.active.includes('D700') ? '#000000' : theme.text,
                                color: theme.text
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[16px] font-semibold uppercase tracking-wide block" style={{ color: theme.text }}>
                            Message *
                        </label>
                        <textarea
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full h-32 px-4 py-3 text-[16px] border-2 rounded-md resize-none focus:outline-none focus:ring-0 focus:border-current transition-all"
                            style={{
                                backgroundColor: 'transparent',
                                borderColor: theme.active === '#9b87f5' || theme.active.includes('87f5') ? '#FFFFFF' : theme.active === '#FFD700' || theme.active.includes('D700') ? '#000000' : theme.text,
                                color: theme.text
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-6 rounded-md text-[16px] font-bold uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.98] flex items-center justify-center text-center border-2"
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
                        ) : 'Send Message'}
                    </button>
                </form>
            )}
        </div>
    );
}
