'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';

export default function ReduceMotionToggle() {
  const { reduceMotion, toggleReduceMotion } = useAccessibility();

  return (
    <ToggleCheckbox
      id="reduce-motion-toggle"
      label="Reduce Motion"
      checked={reduceMotion}
      onChange={toggleReduceMotion}
    />
  );
}
