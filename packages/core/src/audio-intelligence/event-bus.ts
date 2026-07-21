import type { AIntEvent } from "./types.js";

export class AIntAudioEventBus {
  private listeners = new Map<string, Set<(event: AIntEvent) => void>>();

  on(eventType: AIntEvent["type"], handler: (event: AIntEvent) => void): void {
    if (!this.listeners.has(eventType)) this.listeners.set(eventType, new Set());
    this.listeners.get(eventType)!.add(handler);
  }

  off(eventType: AIntEvent["type"], handler: (event: AIntEvent) => void): void {
    this.listeners.get(eventType)?.delete(handler);
  }

  emit(event: AIntEvent): void {
    const handlers = this.listeners.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        handler(event);
      }
    }
  }

  wordStarted(word: string, timestamp: number): void {
    this.emit({ type: "WordStarted", timestamp, data: { word } });
  }

  phraseStarted(phrase: string, timestamp: number): void {
    this.emit({ type: "PhraseStarted", timestamp, data: { phrase } });
  }

  sentenceStarted(sentence: string, timestamp: number): void {
    this.emit({ type: "SentenceStarted", timestamp, data: { sentence } });
  }

  pauseStarted(duration: number, timestamp: number): void {
    this.emit({ type: "PauseStarted", timestamp, data: { duration } });
  }

  emphasisDetected(word: string, score: number, timestamp: number): void {
    this.emit({ type: "EmphasisDetected", timestamp, data: { word, score } });
  }

  emotionChanged(emotion: string, timestamp: number): void {
    this.emit({ type: "EmotionChanged", timestamp, data: { emotion } });
  }

  sentenceEnded(sentence: string, timestamp: number): void {
    this.emit({ type: "SentenceEnded", timestamp, data: { sentence } });
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }
}
