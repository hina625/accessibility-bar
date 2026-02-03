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

export const setAsCurrentAudio = (audio: HTMLAudioElement | null) => {
    currentAudio = audio;
};

export const speak = async (text: string, voiceGender?: string, speed: number = 1.0, options: { autoplay?: boolean } = { autoplay: true }): Promise<HTMLAudioElement | null> => {
    if (typeof window === 'undefined') return null;

    const isForeground = options.autoplay !== false;

    if (isForeground) {
        if (currentAbortController) {
            currentAbortController.abort();
        }
        currentAbortController = new AbortController();

        if (currentAudio) {
            currentAudio.pause();
            currentAudio.src = '';
            currentAudio = null;
        }

        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }

    const localAbortController = isForeground ? currentAbortController! : new AbortController();
    const signal = localAbortController.signal;

    let selectedVoice = voiceGender;
    if (selectedVoice === 'male') selectedVoice = 'onyx';
    if (selectedVoice === 'female') selectedVoice = 'nova';

    if (selectedVoice && OPENAI_VOICES.includes(selectedVoice)) {
        try {
            if (text.length < 1000) {
                // For shorter text, use GET request with direct Audio stream
                const url = `${API_ENDPOINTS.TTS}?text=${encodeURIComponent(text)}&voice=${selectedVoice}&speed=${speed}`;
                const localAudio = new Audio();
                localAudio.crossOrigin = "anonymous";
                localAudio.src = url;

                if (isForeground) {
                    currentAudio = localAudio;
                }

                if (options.autoplay !== false) {
                    try {
                        await localAudio.play();
                    } catch (playError: any) {
                        if (signal.aborted || playError?.name === 'AbortError' || playError?.message?.includes('interrupted')) {
                            return null;
                        }
                        if (playError?.name === 'NotAllowedError') {
                            console.warn('TTS Autoplay blocked: User interaction required.', playError.message);
                        } else {
                            console.error('Audio playback failed, trying fetch fallback:', playError);
                            if (isForeground) currentAudio = null;
                            // Fallback to POST below
                            return null;
                        }
                    }
                }

                return localAudio;
            }

            // Fallback for long text or if POST is preferred
            const response = await fetch(API_ENDPOINTS.TTS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, voice: selectedVoice, speed }),
                signal: signal
            });


            if (signal.aborted) {
                return null;
            }

            if (!response.ok) {
                const textBody = await response.text();
                let errorText;
                try {
                    const errorData = JSON.parse(textBody);
                    errorText = errorData.error || errorData.message || 'Unknown error';
                } catch {
                    errorText = textBody;
                }

                // Handle ElevenLabs custom voice limit error gracefully
                if (errorText.includes('maximum amount of custom voices') || errorText.includes('custom voice limit')) {
                    console.warn(`TTS Voice Limit: ${errorText}. Please check your ElevenLabs account settings or use library voices instead.`);
                    return null;
                }

                // Handle ElevenLabs subscription tier requirement error
                if (errorText.includes('creator tier') || errorText.includes('subscription') || errorText.includes('tier')) {
                    console.warn(`TTS Subscription Required: ${errorText}. This voice requires a paid ElevenLabs plan (Creator tier or above). Please upgrade your subscription or use free-tier compatible voices.`);
                    return null;
                }

                console.error(`TTS API Error: ${response.status} - ${errorText}`);
                return null;
            }

            const blob = await response.blob();


            if (signal.aborted) {
                return null;
            }

            const url = URL.createObjectURL(blob);
            const localAudio = new Audio(url);

            if (isForeground) {
                currentAudio = localAudio;
            }

            if (options.autoplay !== false) {
                try {
                    await localAudio.play();
                } catch (playError: any) {
                    if (signal.aborted || playError?.name === 'AbortError') {
                        URL.revokeObjectURL(url);
                        return null;
                    }
                    if (playError?.name === 'NotAllowedError') {
                        console.warn('TTS Autoplay blocked: User interaction required.');
                    } else {
                        console.error('Audio playback failed:', playError);
                        URL.revokeObjectURL(url);
                        if (isForeground) currentAudio = null;
                        throw playError;
                    }
                }
            }
            return localAudio;
        } catch (error: any) {

            if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
                return null;
            }
            console.error('OpenAI TTS Error:', error);
            return null;
        }
    }
    return null;
};
