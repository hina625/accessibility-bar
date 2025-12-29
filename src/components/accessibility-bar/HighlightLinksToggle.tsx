'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';

export default function HighlightLinksToggle() {
  const { highlightLinks, toggleHighlightLinks } = useAccessibility();

  return (
    <ToggleCheckbox
      id="highlight-links-toggle"
      label="Highlight Links"
      checked={highlightLinks}
      onChange={toggleHighlightLinks}
    />
  );
}
