
const STORAGE_KEY = 'accessibility-hasUserInteracted';
const SESSION_KEY = 'accessibility-hasUserInteractedSession';

export function hasUserInteracted(): boolean {
    if (typeof window !== 'undefined') {
        const sessionValue = sessionStorage.getItem(SESSION_KEY);
        if (sessionValue === 'true') {
            return true;
        }
        
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
