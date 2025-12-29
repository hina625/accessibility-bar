'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import { translations } from '@/contexts/accessibility/translations';

export default function GrayscaleToggle() {
  const { grayscale, toggleGrayscale, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  return (
    <ToggleCheckbox
      id="grayscale-toggle"
      label={t.controls.grayscale}
      checked={grayscale}
      onChange={toggleGrayscale}
    />
  );
}
