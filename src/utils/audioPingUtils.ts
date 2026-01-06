/**
 * Audio Ping Utility
 * Plays a short, pleasant confirmation sound similar to WhatsApp message sent
 */

let audioContext: AudioContext | null = null;

/**
 * Initialize audio context (lazy initialization)
 */
function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Mobile browsers and some desktop browsers need resume() on every call or on first user gesture
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
}

/**
 * Play a short confirmation ping sound
 * Similar to WhatsApp message sent sound
 */
export function playAudioPing(): void {
    try {
        const context = getAudioContext();

        const play = () => {
            const osc = context.createOscillator();
            const gain = context.createGain();
            osc.connect(gain);
            gain.connect(context.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, context.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, context.currentTime + 0.1);

            gain.gain.setValueAtTime(0, context.currentTime);
            gain.gain.linearRampToValueAtTime(0.6, context.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);

            osc.start(context.currentTime);
            osc.stop(context.currentTime + 0.15);
            console.log('🔊 Audio ping played!');
        };

        if (context.state === 'suspended') {
            context.resume().then(play).catch(e => console.warn('Resume failed:', e));
        } else {
            play();
        }
    } catch (error) {
        console.warn('Audio ping failed:', error);
    }
}
