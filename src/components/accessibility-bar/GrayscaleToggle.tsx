import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import { translations } from '@/contexts/accessibility/translations';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function GrayscaleToggle() {
  const { grayscale, toggleGrayscale, language, audioPingEnabled } = useAccessibility();
  const t = translations[language] || translations['en'];

  const handleChange = () => {
    if (audioPingEnabled) playAudioPing(grayscale ? 'deselect' : 'select');
    toggleGrayscale();
  };

  return (
    <ToggleCheckbox
      id="grayscale-toggle"
      label={t.controls.grayscale}
      checked={grayscale}
      onChange={handleChange}
    />
  );
}
