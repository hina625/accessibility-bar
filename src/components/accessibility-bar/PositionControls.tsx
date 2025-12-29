'use client';

import { useAccessibility, ButtonPosition, PanelPosition } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

export default function PositionControls() {
    const { buttonPosition, setButtonPosition, panelPosition, setPanelPosition, barTheme } = useAccessibility();
    const theme = BAR_THEMES[barTheme];

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
        { id: 'top', label: 'Top Bar' },
        { id: 'bottom', label: 'Bottom Bar' },
    ];

    return (
        <div className="space-y-6">
            <section>
                <h3 className="text-[18px] font-bold mb-4" style={{ color: theme.text }}>Button Position</h3>
                <div className="grid grid-cols-2 gap-2">
                    {buttonPositions.map((pos) => (
                        <button
                            key={pos.id}
                            onClick={() => setButtonPosition(pos.id)}
                            className={`p-2 rounded border transition-all whitespace-nowrap text-[15px] ${buttonPosition === pos.id ? 'font-bold' : ''
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
                </div>
            </section>

            <section>
                <h3 className="text-[18px] font-bold mb-4" style={{ color: theme.text }}>Panel Position</h3>
                <div className="grid grid-cols-2 gap-2">
                    {panelPositions.map((pos) => (
                        <button
                            key={pos.id}
                            onClick={() => setPanelPosition(pos.id)}
                            className={`p-2 rounded border transition-all whitespace-nowrap text-[15px] ${panelPosition === pos.id ? 'font-bold' : ''
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
