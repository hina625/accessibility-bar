import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import { translations } from '@/contexts/accessibility/translations';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function InvertColorsToggle() {
  const { invertColors, toggleInvertColors, language, audioPingEnabled } = useAccessibility();
  const t = translations[language] || translations['en'];

  const handleChange = () => {
    if (audioPingEnabled) playAudioPing(invertColors ? 'deselect' : 'select');
    toggleInvertColors();
  };

  return (
    <ToggleCheckbox
      id="invert-colors-toggle"
      label={t.controls.invert}
      checked={invertColors}
      onChange={handleChange}
    />
  );
}
