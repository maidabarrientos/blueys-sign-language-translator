// Add missing type declarations for browser APIs

// Add timeout method to AbortSignal interface
interface AbortSignal {
  static timeout?(ms: number): AbortSignal;
}

// Ensure SpeechSynthesis types are properly defined
interface SpeechSynthesisUtterance {
  voice: SpeechSynthesisVoice | null;
  volume: number;
  rate: number;
  pitch: number;
  text: string;
  lang: string;
  onstart: (ev: Event) => void;
  onend: (ev: Event) => void;
  onerror: (ev: Event) => void;
  onpause: (ev: Event) => void;
  onresume: (ev: Event) => void;
  onmark: (ev: Event) => void;
  onboundary: (ev: Event) => void;
}

// Ensure SpeechSynthesis global is properly typed
interface SpeechSynthesis {
  speaking: boolean;
  pending: boolean;
  paused: boolean;
  onvoiceschanged: ((ev: Event) => void) | null;
  getVoices(): SpeechSynthesisVoice[];
  speak(utterance: SpeechSynthesisUtterance): void;
  cancel(): void;
  pause(): void;
  resume(): void;
} 