'use client';

import Image from 'next/image';
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

    const getButtonStyle = (posId: string) => {
        const isActive = panelPosition === posId;
        return {
            backgroundColor: isActive ? theme.active : theme.hover,
            color: theme.text,
            border: `2px solid ${theme.text}`
        };
    };

    const panelPositions = [
        { id: 'left', label: 'Left', rotation: '0deg' },
        { id: 'right', label: 'Right', rotation: '180deg' },
        { id: 'top', label: 'Top', rotation: '90deg' },
        { id: 'bottom', label: 'Bottom', rotation: '-90deg' },
    ];

    return (
        <div className="space-y-4">
            <section className="pb-0">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[18px] font-bold text-center w-full" style={{ color: theme.text }}>Sidebar Position</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 px-1">
                    {panelPositions.map((pos) => (
                        <button
                            key={pos.id}
                            onClick={() => setPanelPosition(pos.id as PanelPosition)}
                            className="p-3 flex flex-col items-center justify-center gap-2 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                            style={getButtonStyle(pos.id)}
                            aria-label={`${pos.label} Position`}
                        >
                            <div
                                className="bg-white rounded-lg p-1.5 w-11 h-11 flex items-center justify-center shadow-sm"
                                style={{ transform: `rotate(${pos.rotation})` }}
                            >
                                <Image
                                    src={moveUiIcon}
                                    alt=""
                                    width={28}
                                    height={28}
                                    className="object-contain"
                                    style={{
                                        filter: 'brightness(0)' // Force black icon for visibility on white
                                    }}
                                />
                            </div>
                            <span className="text-[14px] font-bold uppercase">{pos.label}</span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
