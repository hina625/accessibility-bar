
// Set this to true to use your local backend (http://localhost:5000)
// Set this to false to use the live backend (https://bar-backend-9vfh.onrender.com)
const USE_LOCAL_BACKEND = false;

const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
    (isDevelopment && USE_LOCAL_BACKEND ? 'http://localhost:5000' : 'https://bar-backend-9vfh.onrender.com');


export const API_ENDPOINTS = {
    SUMMARIZE: `${API_BASE_URL}/api/summarize`,
    HISTORY: `${API_BASE_URL}/api/summarize/history`,
    DELETE_HISTORY_ITEM: (id: string) => `${API_BASE_URL}/api/summarize/history/${id}`,
    DICTIONARY: (word: string) => `${API_BASE_URL}/api/dictionary/${word}`,
    PRONUNCIATION: `${API_BASE_URL}/api/pronunciation`,
    SIMPLIFY: `${API_BASE_URL}/api/simplify`,
    TTS: `${API_BASE_URL}/api/tts`,
    TRANSLATE: `${API_BASE_URL}/api/translate`,
    VOICE_COMMAND: `${API_BASE_URL}/api/voice-command`,
    FEEDBACK: `${API_BASE_URL}/api/feedback`,
};
