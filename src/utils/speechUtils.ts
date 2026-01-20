import { API_ENDPOINTS } from '@/config/api';


const isMobileDevice = (): boolean => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
};


const OPENAI_VOICES = [
    'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer',
    // ElevenLabs User-Specific Voices
    'jfIS2w2yJi0grJZPyEsk', // Oliver
    'dAcds2QMcvmv86jQMC3Y', // Joyce (jyce)
    'G17SuINrv2H9FC6nvetn', // Christopher
    'BpjGufoPiobT79j2vtj4', // Priyanka
    'ZF6FPAbjXT4488VcRRnw', // Ameela
    'jB2lPb5DhAX6l1TLkKXy'  // Sophia
];

// Track current audio playback to allow cancellation
let currentAudio: HTMLAudioElement | null = null;
let currentAbortController: AbortController | null = null;

export const speak = async (text: string, voiceGender?: 'male' | 'female' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer', speed: number = 1.0) => {
    if (typeof window === 'undefined') return;

    // Abort any ongoing fetch/process
    if (currentAbortController) {
        currentAbortController.abort();
    }
    currentAbortController = new AbortController();
    const signal = currentAbortController.signal;

    // Map generic voices to specific OpenAI voices
    let selectedVoice = voiceGender;
    if (selectedVoice === 'male') selectedVoice = 'onyx';
    if (selectedVoice === 'female') selectedVoice = 'nova';

    // Stop any ongoing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
        currentAudio = null;
    }

    // Cancel any ongoing browser speech
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    if (selectedVoice && OPENAI_VOICES.includes(selectedVoice)) {
        try {
            const isLocal = API_ENDPOINTS.TTS.includes('localhost');

            if (isLocal && text.length < 1000) {
                const url = `${API_ENDPOINTS.TTS}?text=${encodeURIComponent(text)}&voice=${selectedVoice}&speed=${speed}`;
                currentAudio = new Audio(url);
                await currentAudio.play();
                return;
            }

            const response = await fetch(API_ENDPOINTS.TTS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, voice: selectedVoice, speed }),
                signal: signal
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`TTS API Error: ${response.status} - ${errorText}`);
                throw new Error(`TTS API failed: ${response.status} ${errorText}`);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            currentAudio = new Audio(url);

            await currentAudio.play();
            return;
        } catch (error) {
            console.error('OpenAI TTS Error:', error);
        }
    }
};
