export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    SUMMARIZE: `${API_BASE_URL}/api/summarize`,
    HISTORY: `${API_BASE_URL}/api/summarize/history`,
    DELETE_HISTORY_ITEM: (id: string) => `${API_BASE_URL}/api/summarize/history/${id}`,
    DICTIONARY: (word: string) => `${API_BASE_URL}/api/dictionary/${word}`,
    PRONUNCIATION: `${API_BASE_URL}/api/pronunciation`,
    SIMPLIFY: `${API_BASE_URL}/api/simplify`,
    TTS: `${API_BASE_URL}/api/tts`,
};
