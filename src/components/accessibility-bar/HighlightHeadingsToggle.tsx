import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function HighlightHeadingsToggle() {
  const { highlightHeadings, toggleHighlightHeadings, audioPingEnabled } = useAccessibility();

  const handleChange = () => {
    if (audioPingEnabled) playAudioPing(highlightHeadings ? 'deselect' : 'select');
    toggleHighlightHeadings();
  };

  return (
    <ToggleCheckbox
      id="highlight-headings-toggle"
      label="Highlight Headings"
      checked={highlightHeadings}
      onChange={handleChange}
    />
  );
}
