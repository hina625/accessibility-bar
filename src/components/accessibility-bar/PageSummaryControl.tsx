'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { API_ENDPOINTS } from '@/config/api';

export default function PageSummaryControl() {
    const {
        pageSummary,
        togglePageSummary,
        summaryContent,
        setSummaryContent,
        summarizationHistory,
        fetchSummarizationHistory,
        deleteHistoryItem,
        toggleSimplifiedLayout,
        panelPosition
    } = useAccessibility();

    const [acronyms, setAcronyms] = useState<Record<string, string>>({});
    const [originalSummary, setOriginalSummary] = useState<string>('');
    const [simplifiedSummary, setSimplifiedSummary] = useState<string>('');
    const [isSimplified, setIsSimplified] = useState(false);

    const [isGenerating, setIsGenerating] = useState(false);
    const [readingTime, setReadingTime] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Initial load of history
    useEffect(() => {
        if (showHistory) {
            fetchSummarizationHistory();
        }
    }, [showHistory]);

    // Calculate reading time when summary content changes
    useEffect(() => {
        if (summaryContent) {
            const words = summaryContent.split(/\s+/).length;
            const time = Math.ceil(words / 200);
            setReadingTime(time < 1 ? 1 : time);

            // Sync original summary if it's new
            if (!originalSummary || (summaryContent !== originalSummary && summaryContent !== simplifiedSummary)) {
                setOriginalSummary(summaryContent);
                setIsSimplified(false);
            }
        }
    }, [summaryContent]);

    const generateSummary = async () => {
        setIsGenerating(true);
        setError(null);
        setIsSimplified(false);

        try {
            const textContent = Array.from(document.querySelectorAll('p, h1, h2, h3, article, section, li'))
                .map(el => el.textContent?.trim())
                .filter(Boolean)
                .join(' ')
                .slice(0, 10000);

            const response = await fetch(API_ENDPOINTS.SUMMARIZE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textContent }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to generate summary');
            }

            const data = await response.json();

            setOriginalSummary(data.summary);
            setSimplifiedSummary(data.simplifiedSummary);
            setSummaryContent(data.summary);
            setAcronyms(data.acronyms || {});

            if (!pageSummary) togglePageSummary();
        } catch (err: any) {
            console.error('Summary Error:', err);
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSimplifyToggle = () => {
        if (isSimplified) {
            setSummaryContent(originalSummary);
            setIsSimplified(false);
        } else if (simplifiedSummary) {
            setSummaryContent(simplifiedSummary);
            setIsSimplified(true);
        } else {
            setError("No simplified version available. Try regenerating.");
        }
    };

    const handleCopy = () => {
        if (summaryContent) {
            navigator.clipboard.writeText(summaryContent);
        }
    };

    const loadHistoryItem = (item: any) => {
        setOriginalSummary(item.summaryText);
        setSummaryContent(item.summaryText);
        setSimplifiedSummary('');
        setAcronyms({});
        setIsSimplified(false);
        setShowHistory(false);
        if (!pageSummary) togglePageSummary();
    };

    const Overlay = () => (
        <div
            className={`fixed z-[2147483650] bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-in duration-300
                ${(panelPosition === 'left' || panelPosition === 'right')
                    ? `top-0 bottom-0 w-[340px] border-x border-gray-200 dark:border-gray-800 ${panelPosition === 'left' ? 'left-0 slide-in-from-left' : 'right-0 slide-in-from-right'}`
                    : 'inset-y-0 right-0 w-[400px] border-l border-gray-200 dark:border-gray-800 slide-in-from-right'
                }
            `}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Page Summary</h2>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                        title="History"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                    <button
                        onClick={togglePageSummary}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>

            {/* Side Panel Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white dark:bg-gray-900 relative">

                {/* History List Overlay inside Panel */}
                {showHistory && (
                    <div className="absolute inset-0 z-10 bg-white dark:bg-gray-900 p-6 animate-in slide-in-from-right">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">History</h3>
                            <button onClick={() => setShowHistory(false)} className="text-sm text-blue-600">Back to Summary</button>
                        </div>
                        <div className="space-y-3">
                            {summarizationHistory.length === 0 && <p className="text-gray-500 italic">No history yet.</p>}
                            {summarizationHistory.map((item: any) => (
                                <div key={item._id} className="group relative p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-300 cursor-pointer" onClick={() => loadHistoryItem(item)}>
                                    <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3 mb-2">{item.summaryText}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                                        <button onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item._id); }} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reading Time */}
                {summaryContent && !isGenerating && (
                    <div className="flex items-center gap-2 mb-6 text-gray-700 dark:text-gray-300">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-bold text-lg">{readingTime} min(s)</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Average Reading Time</span>
                    </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <button
                        onClick={handleSimplifyToggle}
                        disabled={!simplifiedSummary && !isSimplified}
                        className={`px-3 py-2 border rounded-lg font-medium text-sm transition-colors flex flex-col items-center gap-1 group 
                            ${isSimplified
                                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 dark:border-gray-700 dark:text-gray-300'
                            }`}
                    >
                        {isSimplified ? (
                            <>
                                <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                Undo
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Simplify
                            </>
                        )}
                    </button>
                    <button
                        onClick={generateSummary}
                        className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm transition-colors flex flex-col items-center gap-1 group"
                    >
                        <svg className="w-5 h-5 mb-1 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refresh
                    </button>
                    <button
                        onClick={handleCopy}
                        className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm transition-colors flex flex-col items-center gap-1 group"
                    >
                        <svg className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copy
                    </button>
                </div>

                {/* Summary Text */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            {isSimplified ? 'Simplified Summary' : 'Summary'}
                        </h3>
                        {isSimplified && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Simplified</span>}
                    </div>

                    {isGenerating ? (
                        <div className="space-y-3 animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                        </div>
                    ) : (
                        <div className="prose prosem-sm dark:prose-invert max-w-none text-[15px] leading-relaxed text-gray-600 dark:text-gray-300 animate-in fade-in">
                            {summaryContent}
                        </div>
                    )}
                </div>

                {/* Acronyms */}
                {!isGenerating && acronyms && Object.keys(acronyms).length > 0 && (
                    <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Acronyms Detected</h3>
                        <div className="space-y-3">
                            {Object.entries(acronyms).map(([acronym, fullForm]) => (
                                <div key={acronym} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                                    <span className="font-bold text-blue-600 dark:text-blue-400 block mb-0.5">{acronym}</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{fullForm}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 text-right text-xs text-gray-400 font-medium">
                Powered by AI
            </div>
        </div>
    );

    return (
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            {/* Trigger Button in Accessibility Bar */}
            <div className="flex items-center justify-between">
                <label className="text-[18px] font-normal text-black dark:text-gray-300">
                    Page Summary
                </label>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        title="View History"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                    <button
                        onClick={() => {
                            if (!summaryContent) generateSummary();
                            else togglePageSummary();
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${pageSummary ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pageSummary ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* History Panel (Initial View) */}
            {showHistory && !pageSummary && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 max-h-[300px] overflow-y-auto custom-scrollbar">
                    <h5 className="text-[14px] font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Past Summaries</h5>
                    <div className="space-y-3">
                        {summarizationHistory.map((item: any) => (
                            <div key={item._id} className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-300 cursor-pointer" onClick={() => loadHistoryItem(item)}>
                                <p className="text-[13px] text-gray-800 dark:text-gray-200 line-clamp-2">{item.summaryText}</p>
                                <span className="text-[10px] text-gray-400 mt-1 block">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {pageSummary && mounted && createPortal(<Overlay />, document.body)}
        </div>
    );
}
