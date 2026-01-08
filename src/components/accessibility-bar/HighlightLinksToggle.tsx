import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function HighlightLinksToggle() {
  const { highlightLinks, toggleHighlightLinks, audioPingEnabled } = useAccessibility();

  const handleChange = () => {
    if (audioPingEnabled) playAudioPing(highlightLinks ? 'deselect' : 'select');
    toggleHighlightLinks();
  };

  return (
    <ToggleCheckbox
      id="highlight-links-toggle"
      label="Highlight Links"
      checked={highlightLinks}
      onChange={handleChange}
    />
  );
}
