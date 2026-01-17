'use client';

import { useAccessibility, PanelPosition } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { translations } from '@/contexts/accessibility/translations';
import moveUiIcon from '@/assets/icons/move_ui.png?inline';

interface PositionControlsProps {
    hideLanguage?: boolean;
    hideProgressBar?: boolean;
    hideIndicators?: boolean;
    hidePositioning?: boolean;
}

export default function PositionControls({
    hideLanguage = false,
    hideProgressBar = false,
    hideIndicators = false,
    hidePositioning = false
}: PositionControlsProps) {
    const {
        panelPosition, setPanelPosition,
        barTheme,
        language
    } = useAccessibility();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const t = translations[language] || translations['en'];
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    const panelPositions: { id: PanelPosition; label: string }[] = [
        { id: 'left', label: 'Left Sidebar' },
        { id: 'right', label: 'Right Sidebar' },
        { id: 'top', label: 'Top Sidebar' },
        { id: 'bottom', label: 'Bottom Sidebar' },
    ];

    return (
        <div className="space-y-4">
            <section className="pb-0">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[18px] font-bold" style={{ color: theme.text }}>Sidebar Position</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {panelPositions.map((pos) => (
                        <button
                            key={pos.id}
                            onClick={() => setPanelPosition(pos.id)}
                            className={`px-1 py-3 rounded-md border transition-all duration-300 flex items-center justify-center text-center leading-tight ${pos.id === panelPosition ? 'font-black' : 'font-bold'} hover:scale-105 active:scale-95`}
                            style={{
                                borderColor: panelPosition === pos.id ? theme.text : theme.border,
                                backgroundColor: panelPosition === pos.id ? `${theme.active}40` : `${theme.text}08`,
                                color: theme.text,
                                fontSize: '16px',
                                minHeight: '52px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {pos.label.replace(' Sidebar', '')}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
