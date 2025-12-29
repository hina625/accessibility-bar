import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';

export default function PageSummaryControl() {
    const {
        pageSummary,
        togglePageSummary,
        summaryContent
    } = useAccessibility();

    // Use a wrapper to handle the "generate on open" logic implicitly
    // Since PageSummaryOverlay will generate content when pageSummary becomes true and content is empty
    const handleToggle = () => {
        togglePageSummary();
    };

    return (
        <ToggleCheckbox
            id="page-summary-toggle"
            label="Page Summary"
            description="AI-powered page condensation"
            checked={pageSummary}
            onChange={handleToggle}
        />
    );
}
