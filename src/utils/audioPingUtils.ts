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
export type AudioPingType = 'menu' | 'select' | 'deselect';

/**
 * Play a confirmation sound based on interaction type
 */
export function playAudioPing(type: AudioPingType = 'menu'): void {
    try {
        const context = getAudioContext();

        const play = () => {
            const now = context.currentTime;

            // Gain node for master volume
            const masterGain = context.createGain();
            masterGain.connect(context.destination);

            if (type === 'menu') {
                // MENU: Extremely short, high-pitched "tick" (like a clock tick)
                const osc = context.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);

                const gain = context.createGain();
                osc.connect(gain);
                gain.connect(masterGain);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.15, now + 0.005); // Faster attack
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05); // Faster decay

                osc.start(now);
                osc.stop(now + 0.06);

            } else if (type === 'select') {
                // SELECT: Bright "Ding" (High Pitch, Triangle Wave)
                const osc = context.createOscillator();
                osc.type = 'triangle'; // Brighter tone
                osc.frequency.setValueAtTime(880, now); // A5 (High)

                const gain = context.createGain();
                osc.connect(gain);
                gain.connect(masterGain);

                // Sharp attack, steady decay
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

                osc.start(now);
                osc.stop(now + 0.45);

                // Optional: Second faint overtone for "sparkle"
                const osc2 = context.createOscillator();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(1760, now); // A6
                const gain2 = context.createGain();
                osc2.connect(gain2);
                gain2.connect(masterGain);

                gain2.gain.setValueAtTime(0, now);
                gain2.gain.linearRampToValueAtTime(0.05, now + 0.02);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

                osc2.start(now);
                osc2.stop(now + 0.35);

            } else if (type === 'deselect') {
                // DESELECT: Dull "Thud" or "Bloop" (Low Pitch, Sine Wave)
                const osc = context.createOscillator();
                osc.type = 'sine'; // Duller tone
                osc.frequency.setValueAtTime(220, now); // A3 (Low)
                osc.frequency.exponentialRampToValueAtTime(110, now + 0.2); // Slide down an octave

                const gain = context.createGain();
                osc.connect(gain);
                gain.connect(masterGain);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

                osc.start(now);
                osc.stop(now + 0.3);
            }

            console.log(`🔊 Audio ping played: ${type}`);
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
