/**
 * Polyfills for browser APIs to ensure compatibility
 */

// Polyfill for AbortSignal.timeout
export function setupAbortSignalPolyfill() {
  if (typeof window !== 'undefined' && 'AbortSignal' in window) {
    if (!('timeout' in AbortSignal)) {
      // @ts-ignore - Adding static method to AbortSignal
      AbortSignal.timeout = function timeout(ms: number) {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), ms);
        return controller.signal;
      };
    }
  }
}

// Initialize speech synthesis API safely
export function setupSpeechSynthesis(): { supported: boolean } {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return { supported: true };
  }
  return { supported: false };
}

// Export a function to safely initialize all polyfills
export function initPolyfills() {
  setupAbortSignalPolyfill();
  return setupSpeechSynthesis();
} 