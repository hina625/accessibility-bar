'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import { translations } from '@/contexts/accessibility/translations';

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode, language } = useAccessibility();
  const t = translations[language] || translations['en'];

  return (
    <ToggleCheckbox
      id="dark-mode-toggle"
      label={t.controls.darkMode}
      checked={darkMode}
      onChange={toggleDarkMode}
    />
  );
}
