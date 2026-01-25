import { API_ENDPOINTS } from '@/config/api';


const isMobileDevice = (): boolean => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
};


const OPENAI_VOICES = [
    'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer',
    // ElevenLabs Male Voices (3 selected - alphabetical order)
    'qJXPML3QGhCJ3NLe2sEw', // Andrew
    '2EVscXwJhGYuLiX1PgKA', // David
    'pNInz6obpgDQGcFmaJgB', // Ovie (mapped to Adam)
    'd6IbhdqAKkXCCVuJjbie', // Peter
    // ElevenLabs Female Voices (3 selected - free tier compatible, alphabetical order)
    'XB0fDUnXU5powFXDhCwa', // Charlotte (British - free tier)
    'EXAVITQu4vr4xnSDxMaL', // Karla (Bella - free tier)
    'ThT5KcBeYPX3keUQqHPh', // Sharon (Dorothy - free tier)
];


let currentAudio: HTMLAudioElement | null = null;
let currentAbortController: AbortController | null = null;

export const speak = async (text: string, voiceGender?: string, speed: number = 1.0) => {
    if (typeof window === 'undefined') return;

    if (currentAbortController) {
        currentAbortController.abort();
    }
    currentAbortController = new AbortController();
    const signal = currentAbortController.signal;

    let selectedVoice = voiceGender;
    if (selectedVoice === 'male') selectedVoice = 'onyx';
    if (selectedVoice === 'female') selectedVoice = 'nova';


    if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
        currentAudio = null;
    }


    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    if (selectedVoice && OPENAI_VOICES.includes(selectedVoice)) {
        try {
            const isLocal = API_ENDPOINTS.TTS.includes('localhost');

            if (isLocal && text.length < 1000) {

                if (signal.aborted) {
                    return;
                }
                const url = `${API_ENDPOINTS.TTS}?text=${encodeURIComponent(text)}&voice=${selectedVoice}&speed=${speed}`;
                currentAudio = new Audio(url);


                if (signal.aborted) {
                    return;
                }

                try {
                    await currentAudio.play();
                } catch (playError: any) {

                    if (signal.aborted || playError?.name === 'AbortError') {
                        return;
                    }


                    console.error('Audio playback failed:', playError);
                    throw playError;
                }
                return;
            }

            const response = await fetch(API_ENDPOINTS.TTS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, voice: selectedVoice, speed }),
                signal: signal
            });


            if (signal.aborted) {
                return;
            }

            if (!response.ok) {
                let errorText;
                try {
                    const errorData = await response.json();
                    errorText = errorData.error || errorData.message || 'Unknown error';
                } catch {
                    errorText = await response.text();
                }

                // Handle ElevenLabs custom voice limit error gracefully
                if (errorText.includes('maximum amount of custom voices') || errorText.includes('custom voice limit')) {
                    console.warn(`TTS Voice Limit: ${errorText}. Please check your ElevenLabs account settings or use library voices instead.`);
                    return;
                }

                // Handle ElevenLabs subscription tier requirement error
                if (errorText.includes('creator tier') || errorText.includes('subscription') || errorText.includes('tier')) {
                    console.warn(`TTS Subscription Required: ${errorText}. This voice requires a paid ElevenLabs plan (Creator tier or above). Please upgrade your subscription or use free-tier compatible voices.`);
                    return;
                }

                console.error(`TTS API Error: ${response.status} - ${errorText}`);
                return;
            }

            const blob = await response.blob();


            if (signal.aborted) {
                return;
            }

            const url = URL.createObjectURL(blob);
            currentAudio = new Audio(url);

            if (signal.aborted) {
                URL.revokeObjectURL(url);
                return;
            }

            try {
                await currentAudio.play();
            } catch (playError: any) {

                if (signal.aborted || playError?.name === 'AbortError') {
                    URL.revokeObjectURL(url);
                    return;
                }


                console.error('Audio playback failed:', playError);
                URL.revokeObjectURL(url);
                throw playError;
            }
            return;
        } catch (error: any) {

            if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
                return;
            }
            console.error('OpenAI TTS Error:', error);
        }
    }
};
