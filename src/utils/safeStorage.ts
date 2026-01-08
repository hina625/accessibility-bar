/**
 * Safe storage utility that wraps localStorage with error handling
 * Prevents crashes when localStorage is not available (SSR, private browsing, etc.)
 */

export const safeStorage = {
    getItem: (key: string): string | null => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                return localStorage.getItem(key);
            }
        } catch (error) {
            console.warn('localStorage.getItem failed:', error);
        }
        return null;
    },

    setItem: (key: string, value: string): void => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(key, value);
            }
        } catch (error) {
            console.warn('localStorage.setItem failed:', error);
        }
    },

    removeItem: (key: string): void => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.warn('localStorage.removeItem failed:', error);
        }
    },

    clear: (): void => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.clear();
            }
        } catch (error) {
            console.warn('localStorage.clear failed:', error);
        }
    }
};
