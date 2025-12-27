export const DEFAULT_FONT_SIZE = 16;
export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 32;
export const DEFAULT_TEXT_SPACING = 1;
export const MIN_TEXT_SPACING = 0.5;
export const MAX_TEXT_SPACING = 2.5;
export const DEFAULT_CURSOR_SIZE = 1;
export const MIN_CURSOR_SIZE = 1;
export const MAX_CURSOR_SIZE = 5;
export const DEFAULT_PAGE_ZOOM = 100;
export const MIN_PAGE_ZOOM = 50;
export const MAX_PAGE_ZOOM = 200;

export const isInsideAccessibilityBar = (element: HTMLElement | null): boolean => {
    if (!element) return false;

    const shadowHost = document.getElementById('a11y-embed-host-react');
    if (shadowHost) {
        if (element === shadowHost || shadowHost.contains(element)) return true;
        const root = element.getRootNode();
        if (root instanceof ShadowRoot && root.host === shadowHost) return true;
    }

    // Also check for the identifying classes
    return !!element.closest('.accessibility-bar') ||
        !!element.closest('.a11y-embed-host') ||
        !!element.closest('[role="dialog"][aria-label="Accessibility options"]');
};
