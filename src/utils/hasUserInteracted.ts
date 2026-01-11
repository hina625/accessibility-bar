// Track if user has interacted with accessibility bar
// This ensures styles are not applied until user explicitly selects options

const STORAGE_KEY = 'accessibility-hasUserInteracted';
const SESSION_KEY = 'accessibility-hasUserInteractedSession';

export function hasUserInteracted(): boolean {
    // Check session storage first (faster, per-session)
    if (typeof window !== 'undefined') {
        const sessionValue = sessionStorage.getItem(SESSION_KEY);
        if (sessionValue === 'true') {
            return true;
        }
        
        // Also check localStorage (persists across sessions)
        const storageValue = localStorage.getItem(STORAGE_KEY);
        return storageValue === 'true';
    }
    return false;
}

export function setUserInteracted(): void {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(SESSION_KEY, 'true');
        localStorage.setItem(STORAGE_KEY, 'true');
    }
}
