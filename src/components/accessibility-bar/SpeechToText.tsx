'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';
import { translations } from '@/contexts/accessibility/translations';

export default function SpeechToText() {
  const { speechToText, toggleSpeechToText, barTheme, language } = useAccessibility();
  const theme = BAR_THEMES[barTheme];
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
        const error = event.error?.toString() || '';
        if (error === 'no-speech' || error === 'aborted') return;
        console.error('Speech recognition error:', error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        try { recognitionRef.current.stop(); } catch (e) { }
      }
    };
  }, [speechToText]);

  const t = translations[language] || translations['en'];

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
    <div className="space-y-3">
      {/* Main Toggle */}
      <div
        className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all"
        style={{ backgroundColor: theme.hover }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
        onClick={() => toggleSpeechToText()}
      >
        <span className="text-[15px] font-medium" style={{ color: theme.text }}>{t.controls.speechToText}</span>
        <div
          className="w-5 h-5 rounded flex items-center justify-center transition-all ml-3"
          style={{
            backgroundColor: speechToText ? theme.active : 'rgba(255, 255, 255, 0.9)',
            border: speechToText ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          {speechToText && (
            <svg className="w-3.5 h-3.5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      {speechToText && (
        <div className="space-y-2 pl-2">
          <button
            onClick={handleToggle}
            className="w-full rounded-lg px-3 py-2 text-[14px] font-medium transition-colors"
            style={{
              backgroundColor: isListening ? '#dc2626' : theme.active,
              color: theme.text
            }}
          >
            {isListening ? t.controls.stopListening : t.controls.startListening}
          </button>
          {transcript && (
            <div className="p-2 rounded text-[14px] max-h-32 overflow-y-auto" style={{ backgroundColor: theme.active, color: theme.text }}>
              {transcript}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
