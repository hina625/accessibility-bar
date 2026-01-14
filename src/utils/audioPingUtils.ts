

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
}

export type AudioPingType = 'menu' | 'select' | 'deselect';

export function playAudioPing(type: AudioPingType = 'menu'): void {
    try {
        const context = getAudioContext();

        const play = () => {
            const now = context.currentTime;

                    
            const masterGain = context.createGain();
            masterGain.connect(context.destination);

            if (type === 'menu') {
               
                const osc = context.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);

                const gain = context.createGain();
                osc.connect(gain);
                gain.connect(masterGain);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.15, now + 0.005);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05); 

                osc.start(now);
                osc.stop(now + 0.06);

            } else if (type === 'select') {
                const osc = context.createOscillator();
                osc.type = 'triangle'; 
                osc.frequency.setValueAtTime(880, now); 

                const gain = context.createGain();
                osc.connect(gain);
                gain.connect(masterGain);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

                osc.start(now);
                osc.stop(now + 0.45);

                const osc2 = context.createOscillator();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(1760, now); 
                const gain2 = context.createGain();
                osc2.connect(gain2);
                gain2.connect(masterGain);

                gain2.gain.setValueAtTime(0, now);
                gain2.gain.linearRampToValueAtTime(0.05, now + 0.02);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

                osc2.start(now);
                osc2.stop(now + 0.35);

            } else if (type === 'deselect') {
                const osc = context.createOscillator();
                osc.type = 'sine'; 
                osc.frequency.setValueAtTime(220, now); 
                osc.frequency.exponentialRampToValueAtTime(110, now + 0.2); 

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
