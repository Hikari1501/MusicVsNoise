/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Speech API recognition service for accurate pronunciation evaluation

export interface RecognitionCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean, utteranceId: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

type SpeechRecognitionType = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: unknown) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
};

export class SpeechService {
  private recognition: SpeechRecognitionType | null = null;
  private isListening = false;
  private shouldBeListening = false;
  private sessionCount = 0;
  private callbacks: RecognitionCallbacks = {};

  constructor() {
    this.initRecognition();
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    );
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionType }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionType }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) return;

    try {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks.onStart?.();
      };

      this.recognition.onresult = (event: unknown) => {
        const speechEvent = event as {
          resultIndex: number;
          results: Array<{
            isFinal: boolean;
            [index: number]: { transcript: string; confidence: number };
          }>;
        };

        // Unique utterance identifier for this specific utterance slice
        const utteranceId = `sess_${this.sessionCount}_utt_${speechEvent.resultIndex}`;

        // Extract both latest active segment and accumulated transcript
        let latestSegment = '';
        let isFinal = false;

        for (let i = speechEvent.resultIndex; i < speechEvent.results.length; ++i) {
          latestSegment += ' ' + speechEvent.results[i][0].transcript;
          if (speechEvent.results[i].isFinal) {
            isFinal = true;
          }
        }

        const cleaned = latestSegment.trim();
        if (cleaned) {
          this.callbacks.onResult?.(cleaned, isFinal, utteranceId);
        }
      };

      this.recognition.onerror = (event: unknown) => {
        const errorEvent = event as { error?: string };
        const errType = errorEvent.error || 'speech_recognition_error';
        if (errType === 'not-allowed') {
          this.shouldBeListening = false;
          this.isListening = false;
          this.callbacks.onError?.(errType);
        } else if (errType !== 'no-speech') {
          // Keep shouldBeListening active for non-fatal errors
          console.warn('SpeechRecognition warning:', errType);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        // If the user intends for singing mode to be active, auto-restart immediately!
        // Prevents microphone from silently dying after browser's 3-5s silence timeout.
        if (this.shouldBeListening) {
          setTimeout(() => {
            if (this.shouldBeListening && this.recognition) {
              try {
                this.recognition.start();
              } catch {
                try {
                  this.recognition.abort();
                  setTimeout(() => {
                    if (this.shouldBeListening) this.recognition?.start();
                  }, 80);
                } catch {}
              }
            }
          }, 60);
        } else {
          this.callbacks.onEnd?.();
        }
      };
    } catch (e) {
      console.warn('SpeechRecognition initialization error:', e);
    }
  }

  public start(callbacks: RecognitionCallbacks) {
    this.callbacks = callbacks;
    this.shouldBeListening = true;
    this.sessionCount++;

    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      this.shouldBeListening = false;
      callbacks.onError?.('speech_not_supported');
      return;
    }

    try {
      if (this.isListening) {
        this.recognition.stop();
      }
      this.recognition.start();
    } catch {
      try {
        this.recognition.abort();
        setTimeout(() => {
          if (this.shouldBeListening) this.recognition?.start();
        }, 100);
      } catch {}
    }
  }

  public stop() {
    this.shouldBeListening = false;
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  public getActiveState(): boolean {
    return this.isListening;
  }
}

/**
 * Common numeral-to-word dictionary so "3" translates to "three"
 */
const NUMBER_WORDS: Record<string, string> = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
  '10': 'ten',
  '11': 'eleven',
  '12': 'twelve',
  '13': 'thirteen',
  '14': 'fourteen',
  '15': 'fifteen',
  '16': 'sixteen',
  '17': 'seventeen',
  '18': 'eighteen',
  '19': 'nineteen',
  '20': 'twenty',
  '30': 'thirty',
  '40': 'forty',
  '50': 'fifty',
};

/**
 * Standardize spoken transcript into clean word tokens
 */
export function normalizeSpokenWords(str: string): string[] {
  return str
    .toLowerCase()
    .replace(/[-_‿’'"]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => NUMBER_WORDS[w] || w);
}

/**
 * Standardize target text into clean words
 */
export function normalizeTargetWords(target: string, cleanText?: string): string[] {
  const source = cleanText || target;
  return source
    .toLowerCase()
    .replace(/[-_‿’'"]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => NUMBER_WORDS[w] || w);
}

/**
 * Check if the sequence of target words appears in order in the spoken words
 */
function containsConsecutiveSequence(spoken: string[], target: string[]): boolean {
  if (target.length === 0 || spoken.length < target.length) return false;
  for (let i = 0; i <= spoken.length - target.length; i++) {
    let match = true;
    for (let j = 0; j < target.length; j++) {
      if (spoken[i + j] !== target[j]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  return false;
}

/**
 * Strict pronunciation match verification:
 * - Single words: spoken words must contain the EXACT target word (no substring, no minimal-pair collisions)
 * - Multi-word phrases (2-4 words): consecutive sequence match OR in-order matching of key words
 * - Sentences (5+ words): consecutive sequence match OR at least 60% of words in order
 */
export function checkPronunciationMatch(spoken: string, targetText: string, cleanText?: string): boolean {
  const spokenWords = normalizeSpokenWords(spoken);
  const targetWords = normalizeTargetWords(targetText, cleanText);

  if (spokenWords.length === 0 || targetWords.length === 0) {
    return false;
  }

  // 1. Single word target (e.g. "cat", "bat", "think", "three", "present")
  if (targetWords.length === 1) {
    const targetWord = targetWords[0];
    // Exact word token match only. Does NOT match substrings ("catch" != "cat", "that" != "hat")
    return spokenWords.includes(targetWord);
  }

  // 2. Exact consecutive sequence match (e.g. "fat cat", "have a cake", "this is a book")
  if (containsConsecutiveSequence(spokenWords, targetWords)) {
    return true;
  }

  // 3. Multi-word phrase target (2-4 words)
  if (targetWords.length <= 4) {
    let targetIdx = 0;
    let matches = 0;
    for (const word of spokenWords) {
      if (word === targetWords[targetIdx]) {
        matches++;
        targetIdx++;
        if (targetIdx >= targetWords.length) break;
      }
    }
    // If target has 2 words, both must appear in order
    if (targetWords.length === 2) {
      return matches === 2;
    }
    // If 3 or 4 words (e.g. "have a cake"), allow at most 1 minor elided word (e.g. "have cake")
    return matches >= targetWords.length - 1;
  }

  // 4. Full sentence target (5+ words) (e.g. "The cat sat on the mat.")
  // Count how many target words appear in order
  let targetIdx = 0;
  let matches = 0;
  for (const word of spokenWords) {
    if (word === targetWords[targetIdx]) {
      matches++;
      targetIdx++;
      if (targetIdx >= targetWords.length) break;
    }
  }

  // Require at least 60% of the sentence words in order to account for browser article dropouts
  return matches / targetWords.length >= 0.6;
}

export const speechService = new SpeechService();
