export const speak = (text: string, voiceGender?: 'male' | 'female') => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Set voice gender if provided
        const setVoice = () => {
            if (voiceGender) {
                const voices = window.speechSynthesis.getVoices();
                const selectedVoice = voices.find(v =>
                    voiceGender === 'male'
                        ? (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('microsoft david') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('thomas'))
                        : (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('microsoft zira') || v.name.toLowerCase().includes('hazel') || v.name.toLowerCase().includes('susan'))
                );
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
