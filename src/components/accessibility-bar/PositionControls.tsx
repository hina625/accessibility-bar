'use client';

import { useState } from 'react';
import { useAccessibility, ButtonPosition, PanelPosition } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import ToggleCheckbox from './ToggleCheckbox';
import LanguageSelector from './LanguageSelector';
import InfoPopupButton from './InfoPopupButton';
import { translations } from '@/contexts/accessibility/translations';
import Image from 'next/image';
import accessibilityIcon from '../../assets/icons/first_icon_accessibility.png';
import { playAudioPing } from '@/utils/audioPingUtils';

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
        buttonPosition, setButtonPosition,
        panelPosition, setPanelPosition,
        barTheme,
        showActiveIndicators, toggleShowActiveIndicators,
        getActiveFeatures,
        readingProgressBar, toggleReadingProgressBar,
        readingProgressBarColor, setReadingProgressBarColor,
        language,
        getActiveFeaturesWithActions,
        audioPingEnabled, toggleAudioPing
    } = useAccessibility();
    const t = translations[language] || translations['en'];
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
            {!hideLanguage && (
                <section>
                    <h3 className="text-[18px] font-bold mb-4" style={{ color: theme.text }}>Language</h3>
                    <LanguageSelector />
                </section>
            )}

            {!hidePositioning && (
                <>
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src={accessibilityIcon}
                                alt=""
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                            <h3 className="text-[18px] font-bold" style={{ color: theme.text }}>Accessibility Button Position</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {buttonPositions.slice(page * 4, (page + 1) * 4).map((pos) => (
                                <button
                                    key={pos.id}
                                    onClick={() => setButtonPosition(pos.id)}
                                    className={`px-1 py-3 rounded-md border transition-all duration-300 flex items-center justify-center text-center leading-tight ${pos.id === buttonPosition || pos.id === panelPosition ? 'font-black' : 'font-bold'} hover:scale-105 active:scale-95`}
                                    style={{
                                        borderColor: buttonPosition === pos.id ? theme.text : `${theme.text}33`,
                                        backgroundColor: buttonPosition === pos.id ? 'rgba(0,0,0,0.15)' : 'transparent',
                                        color: theme.text,
                                        fontSize: '14px',
                                        minHeight: '52px',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {pos.label}
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    if (audioPingEnabled) playAudioPing();
                                    setPage(p => p === 0 ? 1 : 0);
                                }}
                                className="col-span-2 p-2 rounded-md border transition-all duration-300 flex items-center justify-center hover:bg-black/5 hover:scale-[1.02] active:scale-95"
                                style={{
                                    borderColor: `${theme.text}33`,
                                    color: theme.text,
                                    minHeight: '44px'
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
                </>
            )}

            {!hideProgressBar && (
                <section>
                    <h3 className="text-[18px] font-bold mb-4" style={{ color: theme.text }}>Scrolling Progress Bar (Horizontal)</h3>
                    <ToggleCheckbox
                        id="reading-progress-bar"
                        label="Active on Scrolling"
                        checked={readingProgressBar}
                        onChange={toggleReadingProgressBar}
                    />

                    {readingProgressBar && (
                        <div className="mt-4 space-y-2">
                            <label className="text-[16px] font-bold block mb-3" style={{ color: theme.text }}>Colour</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { name: 'Black', value: '#000000' },
                                    { name: 'Red', value: '#FF0000' },
                                    { name: 'Yellow', value: '#FFFF00' },
                                    { name: 'Green', value: '#00FF00' },
                                    { name: 'Blue', value: '#0000FF' },
                                    { name: 'Gold', value: '#FFD700' },
                                ].map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setReadingProgressBarColor(color.value)}
                                        className={`w-full aspect-square rounded border-2 ${readingProgressBarColor === color.value ? 'ring-2' : ''}`}
                                        style={{
                                            backgroundColor: color.value,
                                            borderColor: readingProgressBarColor === color.value ? theme.text : theme.border
                                        }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}



            {!hideIndicators && (
                <section>
                    <div className="flex items-center mb-4">
                        <h3 className="text-[18px] font-bold" style={{ color: theme.text }}>Feature Indicators</h3>
                        <InfoPopupButton
                            title="Feature Indicators"
                            description={t.info?.position?.features?.["Feature Indicators"] || "Displays small red circles (dots) on category icons to show which features are currently active."}
                        />
                    </div>
                    <ToggleCheckbox
                        id="show-active-indicators"
                        label="Show Active Feature Circles (Red Dots)"
                        checked={showActiveIndicators}
                        onChange={toggleShowActiveIndicators}
                    />

                    {showActiveIndicators && (
                        <div className="mt-4 space-y-2">
                            {['font', 'contrast', 'reading', 'layout', 'cursor', 'images', 'speech', 'language', 'navigation'].map((catId) => {
                                const features = getActiveFeaturesWithActions(catId);
                                if (features.length === 0) return null;
                                return (
                                    <div key={catId} className="flex flex-wrap gap-1.5">
                                        {features.map((feature, idx) => (
                                            <div
                                                key={`${catId}-${idx}`}
                                                className="px-2 py-1.5 rounded shadow-sm border font-bold text-[14px] whitespace-nowrap flex items-center gap-2"
                                                style={{
                                                    backgroundColor: theme.background,
                                                    color: theme.text,
                                                    borderColor: theme.border
                                                }}
                                            >
                                                <span>{feature.label}</span>
                                                <button
                                                    onClick={() => {
                                                        if (audioPingEnabled) playAudioPing();
                                                        feature.onRemove();
                                                    }}
                                                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
                                                    style={{ backgroundColor: '#EF4444', color: 'white' }}
                                                    aria-label={`Remove ${feature.label}`}
                                                    title="Remove"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            <section>
                <div className="flex items-center mb-4">
                    <h3 className="text-[18px] font-bold" style={{ color: theme.text }}>Audio Ping</h3>
                    <InfoPopupButton
                        title="Audio Ping"
                        description="Play a short confirmation sound when you toggle accessibility features. Helps you know when a feature has been activated or deactivated."
                    />
                </div>
                <ToggleCheckbox
                    id="audio-ping-enabled"
                    label="Audio ping when a feature is selected"
                    checked={audioPingEnabled}
                    onChange={toggleAudioPing}
                />
            </section>
        </div>
    );
}
