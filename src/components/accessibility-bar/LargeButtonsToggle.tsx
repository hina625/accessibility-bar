'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';

export default function LargeButtonsToggle() {
  const { largeButtons, toggleLargeButtons } = useAccessibility();

  return (
    <ToggleCheckbox
      id="large-buttons-toggle"
      label="Large Buttons"
      checked={largeButtons}
      onChange={toggleLargeButtons}
    />
  );
}
