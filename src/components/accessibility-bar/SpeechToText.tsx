'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function SpeechToText() {
  const { speechToText, toggleSpeechToText } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!speechToText) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [speechToText]);

  const handleToggle = () => {
    if (!speechToText) {
      toggleSpeechToText();
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="speech-to-text-toggle"
          className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
        >
          Speech to Text
        </label>
        <button
          id="speech-to-text-toggle"
          onClick={toggleSpeechToText}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${speechToText ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          role="switch"
          aria-checked={speechToText}
          aria-label="Toggle speech to text"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${speechToText ? 'translate-x-6' : 'translate-x-1'
              }`}
          />
        </button>
      </div>
      {speechToText && (
        <div className="space-y-2">
          <button
            onClick={handleToggle}
            className={`w-full rounded-md px-3 py-2 text-[18px] font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isListening
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          {transcript && (
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-[18px] font-normal text-black dark:text-gray-300 max-h-32 overflow-y-auto">
              {transcript}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

