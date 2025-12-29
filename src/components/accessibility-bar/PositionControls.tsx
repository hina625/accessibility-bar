'use client';

import { useState } from 'react';
import { useAccessibility, ButtonPosition, PanelPosition } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

export default function PositionControls() {
    const { buttonPosition, setButtonPosition, panelPosition, setPanelPosition, barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme];
    const [page, setPage] = useState(0);

    const buttonPositions: { id: ButtonPosition; label: string }[] = [
        { id: 'top-left', label: 'Top Left' },
        { id: 'top-right', label: 'Top Right' },
        { id: 'bottom-left', label: 'Bottom Left' },
        { id: 'bottom-right', label: 'Bottom Right' },
        { id: 'top', label: 'Top' },
        { id: 'bottom', label: 'Bottom' },
        { id: 'left', label: 'Left' },
        { id: 'right', label: 'Right' },
    ];

    const panelPositions: { id: PanelPosition; label: string }[] = [
        { id: 'left', label: 'Left Sidebar' },
        { id: 'right', label: 'Right Sidebar' },
        { id: 'top', label: 'Top Sidebar' },
        { id: 'bottom', label: 'Bottom Sidebar' },
    ];

    return (
        <div className="space-y-6">
            <section>
                <h3 className="text-[14px] font-bold mb-4" style={{ color: theme.text }}>Button Position</h3>
                <div className="grid grid-cols-2 gap-2">
                    {buttonPositions.slice(page * 4, (page + 1) * 4).map((pos) => (
                        <button
                            key={pos.id}
                            onClick={() => setButtonPosition(pos.id)}
                            className={`p-1.5 rounded border transition-all whitespace-nowrap text-[14px] ${pos.id === buttonPosition || pos.id === panelPosition ? 'font-bold' : ''
                                }`}
                            style={{
                                borderColor: buttonPosition === pos.id ? theme.text : `${theme.text}33`,
                                backgroundColor: buttonPosition === pos.id ? 'rgba(0,0,0,0.15)' : 'transparent',
                                color: theme.text
                            }}
                        >
                            {pos.label}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(p => p === 0 ? 1 : 0)}
                        className="col-span-2 p-1.5 rounded border transition-all flex items-center justify-center hover:bg-black/5"
                        style={{
                            borderColor: `${theme.text}33`,
                            color: theme.text
                        }}
                        aria-label={page === 0 ? "Show more" : "Show less"}
                    >
                        {page === 0 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        )}
                    </button>
                </div>
            </section>

            <section>
                <h3 className="text-[14px] font-bold mb-4" style={{ color: theme.text }}>Sidebar Position</h3>
                <div className="grid grid-cols-2 gap-2">
                    {panelPositions.map((pos) => (
                        <button
                            key={pos.id}
                            onClick={() => setPanelPosition(pos.id)}
                            className={`p-1.5 rounded border transition-all whitespace-nowrap text-[14px] ${panelPosition === pos.id ? 'font-bold' : ''
                                }`}
                            style={{
                                borderColor: panelPosition === pos.id ? theme.text : `${theme.text}33`,
                                backgroundColor: panelPosition === pos.id ? 'rgba(0,0,0,0.15)' : 'transparent',
                                color: theme.text
                            }}
                        >
                            {pos.label}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
