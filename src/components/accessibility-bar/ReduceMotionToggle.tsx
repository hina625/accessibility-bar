import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function ReduceMotionToggle() {
  const { reduceMotion, toggleReduceMotion, audioPingEnabled } = useAccessibility();

  const handleChange = () => {
    if (audioPingEnabled) playAudioPing(reduceMotion ? 'deselect' : 'select');
    toggleReduceMotion();
  };

  return (
    <ToggleCheckbox
      id="reduce-motion-toggle"
      label="Reduce Motion"
      checked={reduceMotion}
      onChange={handleChange}
    />
  );
}
