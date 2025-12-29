'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';

export default function ContrastToggle() {
  const { highContrast, toggleHighContrast } = useAccessibility();

  return (
    <ToggleCheckbox
      id="contrast-toggle"
      label="High Contrast"
      checked={highContrast}
      onChange={toggleHighContrast}
    />
  );
}
