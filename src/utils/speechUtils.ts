export const speak = (text: string, voiceGender?: 'male' | 'female' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer') => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
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
                        // Male voices
                        selectedVoice = voices.find(v =>
                            v.name.toLowerCase().includes('male') || 
                            v.name.toLowerCase().includes('david') || 
                            v.name.toLowerCase().includes('guy') || 
                            v.name.toLowerCase().includes('microsoft david') || 
                            v.name.toLowerCase().includes('daniel') || 
                            v.name.toLowerCase().includes('thomas') ||
                            v.name.toLowerCase().includes('alex')
                        );
                        break;
                    case 'nova':
                    case 'shimmer':
                        // Female voices
                        selectedVoice = voices.find(v =>
                            v.name.toLowerCase().includes('female') || 
                            v.name.toLowerCase().includes('zira') || 
                            v.name.toLowerCase().includes('samantha') || 
                            v.name.toLowerCase().includes('microsoft zira') || 
                            v.name.toLowerCase().includes('hazel') || 
                            v.name.toLowerCase().includes('susan') ||
                            v.name.toLowerCase().includes('karen')
                        );
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
