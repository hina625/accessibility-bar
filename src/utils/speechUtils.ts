// Helper function to detect mobile device
const isMobileDevice = (): boolean => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
};

export const speak = (text: string, voiceGender?: 'male' | 'female' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer') => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        const isMobile = isMobileDevice();
        
        // Set voice based on selection
        const setVoice = () => {
            if (voiceGender) {
                const voices = window.speechSynthesis.getVoices();
                let selectedVoice: SpeechSynthesisVoice | undefined;

                // Map OpenAI TTS voices to browser voices
                switch (voiceGender) {
                    case 'alloy':
                        // Neutral voice - try to find a balanced voice
                        selectedVoice = voices.find(v => 
                            v.name.toLowerCase().includes('samantha') || 
                            v.name.toLowerCase().includes('alex') ||
                            v.name.toLowerCase().includes('karen')
                        ) || voices.find(v => v.lang.startsWith('en'));
                        break;
                    case 'echo':
                    case 'fable':
                    case 'onyx':
                        // Male voices - try multiple strategies
                        if (isMobile) {
                            // Mobile-specific voice detection
                            console.log('Mobile detected, available voices:', voices.map(v => v.name));
                            
                            // Strategy 1: Find by name (iOS: Alex, Android: various)
                            selectedVoice = voices.find(v => {
                                const name = v.name.toLowerCase();
                                return name.includes('alex') || 
                                       name.includes('male') ||
                                       name.includes('david') ||
                                       name.includes('guy') ||
                                       name.includes('daniel') ||
                                       name.includes('thomas') ||
                                       name.includes('mark') ||
                                       (name.includes('google') && name.includes('male')) ||
                                       (name.includes('en-gb') && name.includes('male')) ||
                                       (name.includes('en-us') && name.includes('male'));
                            });
                            
                            // Strategy 2: Use voice index (mobile browsers: usually index 1 or 2 is male)
                            if (!selectedVoice && voices.length > 1) {
                                // iOS Safari: Usually index 1 is Alex (male)
                                // Android: Usually index 1 or 2 is male
                                const maleIndices = [1, 2, 3];
                                for (const idx of maleIndices) {
                                    if (idx < voices.length) {
                                        const v = voices[idx];
                                        const name = v.name.toLowerCase();
                                        // Skip if it's clearly a female voice
                                        if (!name.includes('female') && 
                                            !name.includes('zira') && 
                                            !name.includes('samantha') && 
                                            !name.includes('susan') &&
                                            !name.includes('hazel') &&
                                            !name.includes('karen') &&
                                            !name.includes('victoria') &&
                                            !name.includes('kate')) {
                                            selectedVoice = v;
                                            console.log('Selected male voice by index:', v.name, 'at index', idx);
                                            break;
                                        }
                                    }
                                }
                            }
                            
                            // Strategy 3: Find any voice that's not the first one and not clearly female
                            if (!selectedVoice && voices.length > 1) {
                                for (let i = 1; i < Math.min(voices.length, 5); i++) {
                                    const v = voices[i];
                                    const name = v.name.toLowerCase();
                                    if (!name.includes('female') && 
                                        !name.includes('zira') && 
                                        !name.includes('samantha') && 
                                        !name.includes('susan') &&
                                        !name.includes('hazel') &&
                                        !name.includes('karen') &&
                                        !name.includes('victoria') &&
                                        !name.includes('kate')) {
                                        selectedVoice = v;
                                        console.log('Selected male voice by exclusion:', v.name, 'at index', i);
                                        break;
                                    }
                                }
                            }
                            
                            // Strategy 4: Force use index 1 (most common male voice position on mobile)
                            if (!selectedVoice && voices.length > 1) {
                                selectedVoice = voices[1];
                                console.log('Force selected voice at index 1:', selectedVoice.name);
                            }
                            
                            // Adjust pitch significantly for better male voice on mobile
                            if (selectedVoice) {
                                utterance.pitch = 0.7; // Much lower pitch for male voice (0.7 = very low, more male-like)
                                console.log('Using male voice:', selectedVoice.name, 'with pitch:', utterance.pitch);
                            } else {
                                console.warn('No male voice found, using default');
                            }
                        } else {
                            // Desktop voice detection
                            selectedVoice = voices.find(v =>
                                v.name.toLowerCase().includes('male') || 
                                v.name.toLowerCase().includes('david') || 
                                v.name.toLowerCase().includes('guy') || 
                                v.name.toLowerCase().includes('microsoft david') || 
                                v.name.toLowerCase().includes('daniel') || 
                                v.name.toLowerCase().includes('thomas') ||
                                v.name.toLowerCase().includes('alex') ||
                                v.name.toLowerCase().includes('mark') ||
                                v.name.toLowerCase().includes('google uk english male') ||
                                v.name.toLowerCase().includes('google us english male')
                            );
                            // Fallback: try to find any male voice by checking if it's not female
                            if (!selectedVoice) {
                                selectedVoice = voices.find(v => {
                                    const name = v.name.toLowerCase();
                                    return !name.includes('female') && 
                                           !name.includes('zira') && 
                                           !name.includes('samantha') && 
                                           !name.includes('susan') &&
                                           !name.includes('hazel') &&
                                           !name.includes('karen') &&
                                           (name.includes('male') || name.includes('david') || name.includes('guy') || name.includes('alex') || name.includes('mark'));
                                });
                            }
                            // Final fallback: use first English voice if no male voice found
                            if (!selectedVoice) {
                                selectedVoice = voices.find(v => v.lang.startsWith('en'));
                            }
                        }
                        break;
                    case 'nova':
                    case 'shimmer':
                        // Female voices
                        if (isMobile) {
                            // Mobile-specific: iOS has "Samantha", Android has various female voices
                            selectedVoice = voices.find(v => {
                                const name = v.name.toLowerCase();
                                return name.includes('samantha') ||
                                       name.includes('female') ||
                                       name.includes('zira') ||
                                       name.includes('susan') ||
                                       name.includes('hazel') ||
                                       name.includes('karen') ||
                                       name.includes('google') && name.includes('female') ||
                                       name.includes('en-gb') && name.includes('female') ||
                                       name.includes('en-us') && name.includes('female');
                            });
                            // Fallback: use first voice (often female on mobile)
                            if (!selectedVoice && voices.length > 0) {
                                selectedVoice = voices[0];
                            }
                        } else {
                            selectedVoice = voices.find(v =>
                                v.name.toLowerCase().includes('female') || 
                                v.name.toLowerCase().includes('zira') || 
                                v.name.toLowerCase().includes('samantha') || 
                                v.name.toLowerCase().includes('microsoft zira') || 
                                v.name.toLowerCase().includes('hazel') || 
                                v.name.toLowerCase().includes('susan') ||
                                v.name.toLowerCase().includes('karen')
                            );
                        }
                        break;
                    case 'male':
                        // Legacy male option
                        selectedVoice = voices.find(v =>
                            v.name.toLowerCase().includes('male') || 
                            v.name.toLowerCase().includes('david') || 
                            v.name.toLowerCase().includes('guy') || 
                            v.name.toLowerCase().includes('microsoft david') || 
                            v.name.toLowerCase().includes('daniel') || 
                            v.name.toLowerCase().includes('thomas')
                        );
                        break;
                    case 'female':
                        // Legacy female option
                        selectedVoice = voices.find(v =>
                            v.name.toLowerCase().includes('female') || 
                            v.name.toLowerCase().includes('zira') || 
                            v.name.toLowerCase().includes('samantha') || 
                            v.name.toLowerCase().includes('microsoft zira') || 
                            v.name.toLowerCase().includes('hazel') || 
                            v.name.toLowerCase().includes('susan')
                        );
                        break;
                }

                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
            }
            window.speechSynthesis.speak(utterance);
        };

        // Wait for voices to load if needed
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
                setVoice();
            };
        } else {
            setVoice();
        }
    }
};
