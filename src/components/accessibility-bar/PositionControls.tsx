'use client';

import { useState } from 'react';
import { useAccessibility, ButtonPosition, PanelPosition, ResetIconStyle } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import ToggleCheckbox from './ToggleCheckbox';
import LanguageSelector from './LanguageSelector';
import InfoPopupButton from './InfoPopupButton';
import { translations } from '@/contexts/accessibility/translations';
// import Image from 'next/image';
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
        audioPingEnabled, toggleAudioPing,
        resetIconStyle, setResetIconStyle
    } = useAccessibility();
    const t = translations[language] || translations['en'];
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
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
                <section className="pb-6 border-b border-gray-200/20">
                    <h3 className="text-[18px] font-bold mb-4" style={{ color: theme.text }}>Language</h3>
                    <LanguageSelector />
                </section>
            )}

            {!hidePositioning && (
                <>
                    <section className="pb-6 border-b border-gray-200/20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[18px] font-bold" style={{ color: theme.text }}>1. Accessibility Position Button</h3>
                            <img
                                src={accessibilityIcon.src}
                                alt=""
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {buttonPositions.slice(page * 4, (page + 1) * 4).map((pos) => (
                                <button
                                    key={pos.id}
                                    onClick={() => setButtonPosition(pos.id)}
                                    className={`px-1 py-3 rounded-md border transition-all duration-300 flex items-center justify-center text-center leading-tight ${pos.id === buttonPosition || pos.id === panelPosition ? 'font-black' : 'font-bold'} hover:scale-105 active:scale-95`}
                                    style={{
                                        borderColor: buttonPosition === pos.id ? theme.text : theme.border,
                                        backgroundColor: buttonPosition === pos.id ? `${theme.active}40` : `${theme.text}08`,
                                        color: theme.text,
                                        fontSize: '16px',
                                        minHeight: '52px',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {pos.label}
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    if (audioPingEnabled) playAudioPing('menu');
                                    setPage(p => p === 0 ? 1 : 0);
                                }}
                                className="col-span-2 p-2 rounded-md border transition-all duration-300 flex items-center justify-center hover:bg-black/5 hover:scale-[1.02] active:scale-95"
                                style={{
                                    borderColor: theme.border,
                                    backgroundColor: `${theme.text}08`,
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
                <section className="pb-6 border-b border-gray-200/20">
                    <h3 className="text-[18px] font-bold mb-4" style={{ color: theme.text }}>2. Scrolling Progress Bar</h3>
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
                                    { name: 'Turquoise', value: '#17D1C6' },
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
            {!hidePositioning && (
                <section className="pb-6 border-b border-gray-200/20">
                    <div className="flex items-center mb-4">
                        <h3 className="text-[20px] font-bold" style={{ color: theme.text }}>3. Reset Icon (Button)</h3>
                        <InfoPopupButton
                            title="Reset Icon (Button)"
                            description="Customize the appearance of the Reset button."
                        />
                    </div>
                    <div className="flex gap-4">
                        {[
                            { id: 'red-black', color: '#FF0000', label: 'Red' },
                            { id: 'white-black', color: '#FFFFFF', label: 'White' },
                            { id: 'black-white', color: '#000000', label: 'Black' },
                            { id: 'turquoise-black', color: '#17D1C6', label: 'Turquoise' }
                        ].map((style) => (
                            <button
                                key={style.id}
                                onClick={() => {
                                    if (audioPingEnabled) playAudioPing('menu');
                                    setResetIconStyle(style.id as ResetIconStyle);
                                }}
                                className={`w-10 h-10 rounded-full transition-all duration-300 relative shadow-sm hover:scale-110 active:scale-95`}
                                style={{
                                    backgroundColor: style.color,
                                    border: style.id === 'white-black' ? '2px solid rgba(0,0,0,0.1)' : 'none',
                                    boxShadow: resetIconStyle === style.id
                                        ? `0 0 0 2px ${theme.background}, 0 0 0 4px ${theme.active}`
                                        : 'none'
                                }}
                                title={style.label}
                                aria-label={style.label}
                            >
                                {resetIconStyle === style.id && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={style.id === 'white-black' || style.id === 'yellow-black' ? '#000000' : '#FFFFFF'} strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {!hideIndicators && (
                <section className="pb-6 border-b border-gray-200/20">
                    <div className="flex items-center mb-4">
                        <h3 className="text-[18px] font-bold" style={{ color: theme.text }}>4. Feature Indicators</h3>
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
                            {['font', 'contrast', 'reading', 'layout', 'cursor', 'images', 'speech', 'language', 'navigation', 'position'].map((catId) => {
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
                                                        if (audioPingEnabled) playAudioPing('deselect'); // Deselect sound for removing feature
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

            <section className="pb-6 border-b border-gray-200/20">
                <div className="flex items-center mb-4">
                    <h3 className="text-[18px] font-bold" style={{ color: theme.text }}>5. Audio Ping</h3>
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
