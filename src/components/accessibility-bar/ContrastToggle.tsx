import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function ContrastToggle() {
  const { highContrast, toggleHighContrast, audioPingEnabled } = useAccessibility();

  const handleChange = () => {
    if (audioPingEnabled) playAudioPing(highContrast ? 'deselect' : 'select');
    toggleHighContrast();
  };

  return (
    <ToggleCheckbox
      id="contrast-toggle"
      label="High Contrast"
      checked={highContrast}
      onChange={handleChange}
    />
  );
}
