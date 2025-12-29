'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';

export default function HighlightHeadingsToggle() {
  const { highlightHeadings, toggleHighlightHeadings } = useAccessibility();

  return (
    <ToggleCheckbox
      id="highlight-headings-toggle"
      label="Highlight Headings"
      checked={highlightHeadings}
      onChange={toggleHighlightHeadings}
    />
  );
}
