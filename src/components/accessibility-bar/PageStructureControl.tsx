import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';

export default function PageStructureControl() {
    const { pageStructure, togglePageStructure } = useAccessibility();

    return (
        <ToggleCheckbox
            id="page-structure-toggle"
            label="Page Structure"
            description="View headings, landmarks & links"
            checked={pageStructure}
            onChange={togglePageStructure}
        />
    );
}

