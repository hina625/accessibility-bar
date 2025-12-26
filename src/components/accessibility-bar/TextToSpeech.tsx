'use client';

import { useState, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function TextToSpeech() {
  const { textToSpeech, toggleTextToSpeech } = useAccessibility();
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!textToSpeech) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, [textToSpeech]);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    const text = document.body.innerText;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="text-to-speech-toggle"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          Text to Speech
        </label>
        <button
          id="text-to-speech-toggle"
          onClick={toggleTextToSpeech}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            textToSpeech ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          role="switch"
          aria-checked={textToSpeech}
          aria-label="Toggle text to speech"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              textToSpeech ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      {textToSpeech && (
        <button
          onClick={handleSpeak}
          className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isSpeaking ? 'Stop speaking' : 'Start speaking'}
        >
          {isSpeaking ? 'Stop Speaking' : 'Speak Page Content'}
        </button>
      )}
    </div>
  );
}

