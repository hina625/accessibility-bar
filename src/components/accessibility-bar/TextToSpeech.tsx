'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { API_ENDPOINTS } from '@/config/api';

const OPENAI_VOICES = [
  { name: 'Alloy', id: 'alloy', gender: 'neutral' },
  { name: 'Echo', id: 'echo', gender: 'male' },
  { name: 'Fable', id: 'fable', gender: 'male' },
  { name: 'Onyx', id: 'onyx', gender: 'male' },
  { name: 'Nova', id: 'nova', gender: 'female' },
  { name: 'Shimmer', id: 'shimmer', gender: 'female' },
];

const FloatingPlayer = ({
  isSpeaking,
  isLoading,
  onTogglePlay,
  onStop
}: {
  isSpeaking: boolean,
  isLoading: boolean,
  onTogglePlay: () => void,
  onStop: () => void
}) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number, startY: number, initialX: number, initialY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.initialX + deltaX,
        y: dragRef.current.initialY + deltaY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="fixed z-[99999] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-2xl rounded-xl p-2 flex items-center gap-2 border border-blue-500/20"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center gap-1.5 pr-1.5 border-r border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-spin" />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        )}
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Reader</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-90"
        >
          {isSpeaking ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onStop(); }}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all active:scale-90"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M6 6h12v12H6z" /></svg>
        </button>
      </div>

      <div className="flex flex-col ml-1 pointer-events-none">
        <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          {isLoading ? (
            <div className="h-full bg-yellow-500 animate-[shimmer_1s_infinite]" style={{ width: '100%' }} />
          ) : isSpeaking ? (
            <div className="h-full bg-blue-500 animate-[shimmer_2s_infinite]" style={{ width: '40%' }} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const TtsSwitch = ({ label, checked, onChange, id }: { label: string, checked: boolean, onChange: () => void, id: string }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all">
    <label htmlFor={id} className="text-[16px] font-bold text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
      {label}
    </label>
    <button
      id={id}
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checked ? 'bg-blue-600 shadow-md shadow-blue-500/30' : 'bg-gray-300 dark:bg-gray-600'}`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

export default function TextToSpeech() {
  const {
    textToSpeech,
    toggleTextToSpeech,
    ttsVoiceGender,
    ttsReadingSpeed,
    setTtsReadingSpeed,
  } = useAccessibility();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize selected voice based on preference or default
  useEffect(() => {
    // Optional: could map gender preference to a default voice
    if (ttsVoiceGender === 'male') setSelectedVoice('echo');
    if (ttsVoiceGender === 'female') setSelectedVoice('nova');
  }, [ttsVoiceGender]);


  // Stop function
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  const playText = async (text: string) => {
    stopAudio();
    if (!text) return;

    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.TTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: selectedVoice,
          speed: ttsReadingSpeed
        })
      });

      if (!response.ok) throw new Error('TTS Failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audioRef.current = audio;

      audio.onplay = () => {
        setIsLoading(false);
        setIsSpeaking(true);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };

      audio.onerror = () => {
        setIsLoading(false);
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };

      await audio.play();

    } catch (error) {
      console.error("TTS Error", error);
      setIsLoading(false);
    }
  };


  // Handle Selection - Always active if TextToSpeech is ON
  useEffect(() => {
    if (!textToSpeech) return;

    const handleMouseUp = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.accessibility-bar') || target.closest('.a11y-embed-host')) return;

      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();
        if (text && text.length > 0) {
          playText(text);
        }
      }, 500); // 500ms delay to be safe
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [textToSpeech, selectedVoice, ttsReadingSpeed]);


  // Clean up on unmount
  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  // Toggle Play/Pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isSpeaking) {
      audioRef.current.pause();
      setIsSpeaking(false);
    } else {
      audioRef.current.play();
      setIsSpeaking(true);
    }
  }, [isSpeaking]);

  return (
    <div className="space-y-4 py-2">
      <h3 className="text-[22px] font-bold text-black dark:text-white mb-4">Neural Text to Speech</h3>

      <div className="grid grid-cols-1 gap-2">
        <TtsSwitch id="tts-on-off" label="Enable TTS" checked={textToSpeech} onChange={toggleTextToSpeech} />

        {textToSpeech && (
          <div className="grid grid-cols-1 gap-2 mt-2 animate-fade-in">
            {/* Removed extra toggles for simplification */}

            {/* Voice Selection */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-2">
              <h4 className="text-[18px] font-bold text-black dark:text-white mb-3 text-center">Neural Voice</h4>
              <div className="grid grid-cols-2 gap-2">
                {OPENAI_VOICES.map(voice => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${selectedVoice === voice.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  >
                    {voice.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-2">
              <h4 className="text-[18px] font-bold text-black dark:text-white mb-3 text-center">Speed: {ttsReadingSpeed}x</h4>
              <div className="flex items-center justify-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl">
                <button onClick={() => setTtsReadingSpeed(Math.max(0.25, ttsReadingSpeed - 0.25))} className="p-2 bg-white rounded-lg shadow-sm">-</button>
                <input
                  type="range"
                  min="0.25"
                  max="4.0"
                  step="0.25"
                  value={ttsReadingSpeed}
                  onChange={(e) => setTtsReadingSpeed(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <button onClick={() => setTtsReadingSpeed(Math.min(4.0, ttsReadingSpeed + 0.25))} className="p-2 bg-white rounded-lg shadow-sm">+</button>
              </div>
            </div>

          </div>
        )}
      </div>

      {textToSpeech && (
        <FloatingPlayer
          isSpeaking={isSpeaking}
          isLoading={isLoading}
          onTogglePlay={togglePlay}
          onStop={stopAudio}
        />
      )}
    </div>
  );
}
