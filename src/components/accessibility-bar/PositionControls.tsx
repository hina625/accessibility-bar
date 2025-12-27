'use client';

import { useAccessibility, ButtonPosition, PanelPosition } from '@/contexts/AccessibilityContext';

export default function PositionControls() {
    const { buttonPosition, setButtonPosition, panelPosition, setPanelPosition } = useAccessibility();

    const buttonPositions: { id: ButtonPosition; label: string }[] = [
        { id: 'top-left', label: 'Top Left' },
        { id: 'top-right', label: 'Top Right' },
        { id: 'bottom-left', label: 'Bottom Left' },
        { id: 'bottom-right', label: 'Bottom Right' },
    ];

    const panelPositions: { id: PanelPosition; label: string }[] = [
        { id: 'left', label: 'Left Sidebar' },
        { id: 'right', label: 'Right Sidebar' },
        { id: 'top', label: 'Top Bar' },
        { id: 'bottom', label: 'Bottom Bar' },
    ];

    return (
        <div className="space-y-6">
            <section>
                <h3 className="text-[18px] font-normal text-black dark:text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Floating Button Position
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {buttonPositions.map((pos) => (
                        <button
                            key={pos.id}
                            onClick={() => setButtonPosition(pos.id)}
                            className={`px-3 py-2 text-[18px] font-normal rounded-lg border transition-all ${buttonPosition === pos.id
                                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                                : 'border-gray-200 bg-white text-black dark:border-gray-700 dark:bg-gray-800'
                                }`}
                        >
                            {pos.label}
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-[18px] font-normal text-black dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    Menu Sidebar Position
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {panelPositions.map((pos) => (
                        <button
                            key={pos.id}
                            onClick={() => setPanelPosition(pos.id)}
                            className={`px-3 py-2 text-[18px] font-normal rounded-lg border transition-all ${panelPosition === pos.id
                                ? 'bg-purple-500 text-white border-purple-500 shadow-md'
                                : 'bg-white dark:bg-gray-800 text-black dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-400'
                                }`}
                        >
                            {pos.label}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
