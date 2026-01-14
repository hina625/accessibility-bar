import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import { translations } from '@/contexts/accessibility/translations';
import { playAudioPing } from '@/utils/audioPingUtils';
import InfoPopupButton from './InfoPopupButton';

export default function MagnifierToggle() {
    const { magnifier, toggleMagnifier, barTheme, language, audioPingEnabled } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
    const t = translations[language] || translations['en'];

    return (
        <div
            className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
            style={{ backgroundColor: theme.hover }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
            onClick={() => {
                if (audioPingEnabled) playAudioPing(magnifier ? 'deselect' : 'select');
                toggleMagnifier();
            }}
        >
            <div className="flex items-center">
                <span 
                    className="text-[16px] font-medium relative inline" 
                    style={{ color: theme.text }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline';
                        e.currentTarget.style.textDecorationThickness = '2px';
                        e.currentTarget.style.textUnderlineOffset = '2px';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none';
                    }}
                >
                    Magnifier
                </span>
                <div onClick={(e) => e.stopPropagation()}>
                    <InfoPopupButton
                        title="Magnifier"
                        description={t.info?.reading?.features?.["Magnifier"] || "Zoom in on specific parts of the screen."}
                    />
                </div>
            </div>

            <div
                className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
                style={{
                    backgroundColor: magnifier ? theme.active : 'rgba(255, 255, 255, 0.9)',
                    border: magnifier ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                }}
            >
                {magnifier && (
                    <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        </div>
    );
}
