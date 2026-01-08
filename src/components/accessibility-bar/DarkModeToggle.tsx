import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import { translations } from '@/contexts/accessibility/translations';
import { playAudioPing } from '@/utils/audioPingUtils';

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode, language, audioPingEnabled } = useAccessibility();
  const t = translations[language] || translations['en'];

  const handleChange = () => {
    if (audioPingEnabled) playAudioPing(darkMode ? 'deselect' : 'select');
    toggleDarkMode();
  };

  return (
    <ToggleCheckbox
      id="dark-mode-toggle"
      label={t.controls.darkMode}
      checked={darkMode}
      onChange={handleChange}
    />
  );
}
