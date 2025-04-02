import { useState, useEffect, useCallback } from 'react';
import { initPolyfills } from '@/utils/polyfills';

// Initialize polyfills at the module level, but don't change any functionality
if (typeof window !== 'undefined') {
  initPolyfills();
}

type SpeechOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
};

// Custom hook for text-to-speech functionality
export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  // Initialize and check for browser support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      
      // Get available voices
      const updateVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      
      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = updateVoices;
      updateVoices();

      // Cleanup
      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  // Get a friendlier, child-like voice
  const getEnglishVoice = useCallback(() => {
    if (voices.length === 0) return null;
    
    // Define preferred voices - these typically sound more child-like
    // Common child-like voice names across platforms
    const preferredVoiceNames = [
      'Samantha', // Female voice on macOS/iOS that sounds friendly
      'Google UK English Female', // Higher pitched Google voice
      'Microsoft Zira', // Young-sounding Microsoft voice
      'Alex', // Friendly voice on some systems
      'Karen', // Australian female voice that sounds younger
      'Moira', // Irish female voice (typically higher pitched)
    ];
    
    // Try to find one of our preferred voices
    for (const name of preferredVoiceNames) {
      const preferredVoice = voices.find(voice => 
        voice.name.includes(name)
      );
      if (preferredVoice) return preferredVoice;
    }
    
    // Otherwise, try to find any English female voice (typically higher pitched)
    const femaleVoice = voices.find(voice => 
      voice.lang.includes('en-') && 
      (voice.name.includes('Female') || voice.name.includes('Girl'))
    );
    
    // Fallback to any English voice
    const englishVoice = voices.find(voice => 
      voice.lang.includes('en-')
    );
    
    // Last resort - any available voice
    return femaleVoice || englishVoice || voices[0];
  }, [voices]);

  // Function to speak text with child-like settings
  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!supported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set options with child-like defaults - SLOWER rate for more clarity
    utterance.rate = options.rate || 0.85; // Slower speech rate (less than 1.0 is slower)
    utterance.pitch = options.pitch || 1.3; // Slightly less high pitch to sound more natural
    utterance.volume = options.volume || 0.9;
    
    if (options.voice) {
      utterance.voice = options.voice;
    }

    // Events
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    // Start speaking
    window.speechSynthesis.speak(utterance);
  }, [supported]);

  // Function to speak in a casual, conversational way
  const speakCasually = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!text) return;
    
    // Add casual phrases before the main text
    const casualIntros = [
      "I see ",
      "That's ",
      "Looks like ",
      "Oh, that's ",
      "I think that's ",
      "Cool! That's "
    ];
    
    // Random casual intro
    const casualIntro = casualIntros[Math.floor(Math.random() * casualIntros.length)];
    
    // Call the regular speak function with casual phrasing
    speak(casualIntro + text, options);
  }, [speak]);

  // Function to stop speaking
  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return {
    supported,
    speaking,
    voices,
    speak,
    speakCasually,
    cancel,
    getEnglishVoice
  };
}; 