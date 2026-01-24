'use client';

import React, { useState, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { API_ENDPOINTS } from '@/config/api';
import { translations } from '@/contexts/accessibility/translations';

export default function SimplifiedLayoutOverlay() {
    const { simplifiedLayout, toggleSimplifiedLayout, language, darkMode } = useAccessibility();
    const t = translations[language] || translations['en'];

    const [htmlContent, setHtmlContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!simplifiedLayout) {
            setHtmlContent('');
            setError(null);
            document.body.style.overflow = ''; // Restore generic scrolling
            return;
        }

        // Lock background scroll
        document.body.style.overflow = 'hidden';

        const fetchSimplifiedLayout = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Heuristic: Get main content or body text
                let contentText = document.body.innerText;

                // If there's a specific 'main' or 'article' tag, prefer that to reduce noise
                const mainElement = document.querySelector('main') || document.querySelector('article');
                if (mainElement) {
                    contentText = mainElement.innerText;
                }

                // If content is very short, fallback to body
                if (contentText.length < 200) {
                    contentText = document.body.innerText;
                }

                const response = await fetch(API_ENDPOINTS.SIMPLIFY, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: contentText })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.html) {
                        setHtmlContent(data.html);
                    } else {
                        throw new Error('No content returned');
                    }
                } else {
                    throw new Error('Failed to simplify layout');
                }
            } catch (err) {
                console.error('Simplification Error:', err);
                setError('Unable to simplify this page. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSimplifiedLayout();

        return () => {
            document.body.style.overflow = '';
        };
    }, [simplifiedLayout]);

    if (!simplifiedLayout) return null;

    return (
        <div
            className="fixed inset-0 z-[2147483647] bg-white dark:bg-gray-950 overflow-y-auto w-full h-full"
            style={{ pointerEvents: 'auto' }}
        >
            <div className={darkMode ? 'dark' : ''}>
                <div className="min-h-full transition-colors duration-300" style={{ backgroundColor: darkMode ? '#030712' : '#ffffff' }}>
                    {/* Toolbar */}
                    <div
                        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b transition-colors duration-300"
                        style={{
                            backgroundColor: darkMode ? 'rgba(3, 7, 18, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            borderColor: darkMode ? 'rgba(31, 41, 55, 1)' : 'rgba(229, 231, 235, 1)'
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold" style={{ color: darkMode ? '#ffffff' : '#111827' }}>
                                    {t.controls.simplifyLayout}
                                </h2>
                                {isLoading && (
                                    <p className="text-xs text-blue-500 animate-pulse font-medium">
                                        {t.controls.simplifying}
                                    </p>
                                )}
                                {!isLoading && !error && (
                                    <p className="text-xs font-medium" style={{ color: darkMode ? '#4ade80' : '#16a34a' }}>
                                        AI Optimized
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {/* Close Button */}
                            <button
                                onClick={toggleSimplifiedLayout}
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                style={{
                                    backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
                                    color: darkMode ? '#e5e7eb' : '#374151'
                                }}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Close
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="max-w-3xl mx-auto px-6 py-12">
                        {isLoading ? (
                            <div className="space-y-8 animate-pulse">
                                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                                </div>
                                <div className="space-y-3 pt-4">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-20">
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mb-4">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: darkMode ? '#ffffff' : '#111827' }}>Simplification Failed</h3>
                                <p style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>{error}</p>
                                <button
                                    onClick={toggleSimplifiedLayout}
                                    className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Return to Original
                                </button>
                            </div>
                        ) : (
                            <div
                                className="max-w-none text-lg leading-relaxed font-sans"
                                style={{ color: darkMode ? '#e5e7eb' : '#374151' }}
                            >
                                <style jsx>{`
                                    .simplified-content h1, .simplified-content h2, .simplified-content h3 {
                                        color: ${darkMode ? '#ffffff' : '#111827'} !important;
                                        font-weight: 700;
                                        margin-top: 1.5em;
                                        margin-bottom: 0.5em;
                                    }
                                    .simplified-content p {
                                        margin-bottom: 1em;
                                    }
                                    .simplified-content strong {
                                        color: ${darkMode ? '#ffffff' : '#111827'} !important;
                                    }
                                `}</style>
                                <div
                                    className="simplified-content"
                                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
