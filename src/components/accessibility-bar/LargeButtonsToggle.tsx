import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function LargeButtonsToggle() {
  const { largeButtons, toggleLargeButtons, audioPingEnabled } = useAccessibility();

  const handleChange = () => {
    if (audioPingEnabled) playAudioPing(largeButtons ? 'deselect' : 'select');
    toggleLargeButtons();
  };

  return (
    <ToggleCheckbox
      id="large-buttons-toggle"
      label="Large Buttons"
      checked={largeButtons}
      onChange={handleChange}
    />
  );
}
