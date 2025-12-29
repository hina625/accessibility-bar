'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import { API_ENDPOINTS } from '@/config/api';
import ToggleCheckbox from './ToggleCheckbox';

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

    const { barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme];

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


    useEffect(() => {
        if (showHistory) {
            fetchSummarizationHistory();
        }
    }, [showHistory]);


    useEffect(() => {
        if (summaryContent) {
            const words = summaryContent.split(/\s+/).length;
            const time = Math.ceil(words / 200);
            setReadingTime(time < 1 ? 1 : time);


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
            className={`fixed z-[2147483650] shadow-2xl flex flex-col animate-in duration-300
                ${(panelPosition === 'left' || panelPosition === 'right')
                    ? `top-0 bottom-0 w-[340px] border-x ${panelPosition === 'left' ? 'left-0 slide-in-from-left' : 'right-0 slide-in-from-right'}`
                    : 'inset-y-0 right-0 w-[400px] border-l slide-in-from-right'
                }
            `}
            style={{
                backgroundColor: theme.background,
                borderColor: `${theme.text}33`,
                color: theme.text
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 border-b"
                style={{
                    backgroundColor: `${theme.hover}`,
                    borderColor: `${theme.text}20`
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="p-1.5 rounded-lg"
                        style={{ backgroundColor: `${theme.active}33` }}
                    >
                        <svg className="w-5 h-5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold">Page Summary</h2>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                            color: theme.text,
                            backgroundColor: showHistory ? `${theme.active}33` : 'transparent'
                        }}
                        onMouseEnter={(e) => !showHistory && (e.currentTarget.style.backgroundColor = `${theme.text}10`)}
                        onMouseLeave={(e) => !showHistory && (e.currentTarget.style.backgroundColor = 'transparent')}
                        title="History"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                    <button
                        onClick={togglePageSummary}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: theme.text }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.text}10`}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>

            {/* Side Panel Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">

                {/* History List Overlay inside Panel */}
                {showHistory && (
                    <div
                        className="absolute inset-0 z-10 p-6 animate-in slide-in-from-right"
                        style={{ backgroundColor: theme.background }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">History</h3>
                            <button
                                onClick={() => setShowHistory(false)}
                                className="text-sm transition-opacity hover:opacity-100 opacity-70"
                                style={{ color: theme.active === theme.background ? theme.text : theme.active }}
                            >
                                Back to Summary
                            </button>
                        </div>
                        <div className="space-y-3">
                            {summarizationHistory.length === 0 && <p className="opacity-50 italic">No history yet.</p>}
                            {summarizationHistory.map((item: any) => (
                                <div
                                    key={item._id}
                                    className="group relative p-4 rounded-none border transition-colors cursor-pointer"
                                    onClick={() => loadHistoryItem(item)}
                                    style={{
                                        backgroundColor: theme.hover,
                                        borderColor: `${theme.text}10`
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.active}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = `${theme.text}10`}
                                >
                                    <p className="text-sm line-clamp-3 mb-2 opacity-90">{item.summaryText}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs opacity-50">{new Date(item.createdAt).toLocaleDateString()}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item._id); }}
                                            className="opacity-0 group-hover:opacity-100 p-1 transition-all"
                                            style={{ color: theme.text }}
                                        >
                                            <svg className="w-4 h-4 hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reading Time */}
                {summaryContent && !isGenerating && (
                    <div className="flex items-center gap-2 mb-6 opacity-90">
                        <svg className="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-bold text-lg">{readingTime} min(s)</span>
                        <span className="text-sm opacity-60">Average Reading Time</span>
                    </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <button
                        onClick={handleSimplifyToggle}
                        disabled={!simplifiedSummary && !isSimplified}
                        className={`px-3 py-2 border rounded-none font-medium text-sm transition-colors flex flex-col items-center gap-1 group`}
                        style={{
                            backgroundColor: isSimplified ? `${theme.active}20` : theme.hover,
                            borderColor: isSimplified ? theme.active : `${theme.text}10`,
                            color: theme.text,
                            opacity: (!simplifiedSummary && !isSimplified) ? 0.4 : 1
                        }}
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
                        className="px-3 py-2 border rounded-none font-medium text-sm transition-colors flex flex-col items-center gap-1 group"
                        style={{
                            backgroundColor: theme.hover,
                            borderColor: `${theme.text}10`,
                            color: theme.text
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                    >
                        <svg className="w-5 h-5 mb-1 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refresh
                    </button>
                    <button
                        onClick={handleCopy}
                        className="px-3 py-2 border rounded-none font-medium text-sm transition-colors flex flex-col items-center gap-1 group"
                        style={{
                            backgroundColor: theme.hover,
                            borderColor: `${theme.text}10`,
                            color: theme.text
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                    >
                        <svg className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copy
                    </button>
                </div>

                {/* Summary Text */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider opacity-40">
                            {isSimplified ? 'Simplified Summary' : 'Summary'}
                        </h3>
                        {isSimplified && (
                            <span
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ backgroundColor: `${theme.active}33`, color: theme.text }}
                            >
                                Simplified
                            </span>
                        )}
                    </div>

                    {isGenerating ? (
                        <div className="space-y-3 animate-pulse">
                            {[1, 0.8, 1, 0.7].map((w, i) => (
                                <div
                                    key={i}
                                    className="h-4 rounded"
                                    style={{ backgroundColor: `${theme.text}10`, width: `${w * 100}%` }}
                                ></div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-[15px] leading-relaxed opacity-80 animate-in fade-in">
                            {summaryContent}
                        </div>
                    )}
                </div>

                {/* Acronyms */}
                {!isGenerating && acronyms && Object.keys(acronyms).length > 0 && (
                    <div
                        className="mt-8 pt-6 border-t"
                        style={{ borderColor: `${theme.text}10` }}
                    >
                        <h3 className="text-sm font-bold uppercase tracking-wider opacity-40 mb-4">Acronyms Detected</h3>
                        <div className="space-y-3">
                            {Object.entries(acronyms).map(([acronym, fullForm]) => (
                                <div
                                    key={acronym}
                                    className="p-3 rounded-none border transition-colors"
                                    style={{
                                        backgroundColor: theme.hover,
                                        borderColor: `${theme.text}10`
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.active}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = `${theme.text}10`}
                                >
                                    <span
                                        className="font-bold block mb-0.5"
                                        style={{ color: theme.active === theme.background ? theme.text : theme.active }}
                                    >
                                        {acronym}
                                    </span>
                                    <span className="text-sm opacity-60">{fullForm}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div
                className="p-3 border-t text-right text-xs font-medium opacity-40"
                style={{ borderColor: `${theme.text}10` }}
            >
                Powered by AI
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <ToggleCheckbox
                id="page-summary-toggle"
                label="Page Summary"
                description="AI-powered page condensation"
                checked={pageSummary}
                onChange={() => {
                    if (!summaryContent) generateSummary();
                    else togglePageSummary();
                }}
            />

            {showHistory && !pageSummary && (
                <div
                    className="mt-4 p-4 rounded-none border max-h-[300px] overflow-y-auto custom-scrollbar"
                    style={{
                        backgroundColor: `${theme.hover}80`,
                        borderColor: `${theme.text}20`,
                        color: theme.text
                    }}
                >
                    <div className="flex items-center justify-between mb-3 border-b pb-2" style={{ borderColor: `${theme.text}10` }}>
                        <h5 className="text-[14px] font-bold uppercase tracking-wider opacity-60">Past Summaries</h5>
                        <button
                            onClick={() => setShowHistory(false)}
                            className="text-xs hover:underline opacity-80"
                            style={{ color: theme.active === theme.background ? theme.text : theme.active }}
                        >
                            Close
                        </button>
                    </div>
                    <div className="space-y-3 mt-3">
                        {summarizationHistory.map((item: any) => (
                            <div
                                key={item._id}
                                className="p-3 rounded-none border transition-colors cursor-pointer"
                                onClick={() => loadHistoryItem(item)}
                                style={{
                                    backgroundColor: theme.background,
                                    borderColor: `${theme.text}10`
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.active}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = `${theme.text}10`}
                            >
                                <p className="text-[13px] line-clamp-2 opacity-90">{item.summaryText}</p>
                                <span className="text-[10px] opacity-40 mt-1 block">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {pageSummary && mounted && createPortal(<Overlay />, document.body)}
        </div>
    );
}
