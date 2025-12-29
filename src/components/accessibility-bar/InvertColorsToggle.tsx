'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import { translations } from '@/contexts/accessibility/translations';

export default function InvertColorsToggle() {
  const { invertColors, toggleInvertColors, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  return (
    <ToggleCheckbox
      id="invert-colors-toggle"
      label={t.controls.invert}
      checked={invertColors}
      onChange={toggleInvertColors}
    />
  );
}
