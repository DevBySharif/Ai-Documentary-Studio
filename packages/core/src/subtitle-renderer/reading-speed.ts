import type { SRReadingSpeedResult } from "./types.js";

export class SRReadingSpeedAnalyzer {
  analyze(text: string, duration: number): SRReadingSpeedResult {
    const charCount = text.length;
    const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
    const durationSec = duration / 1000;

    const cps = charCount / durationSec;
    const wps = wordCount / durationSec;
    const readingTime = charCount / 15;

    return {
      charsPerSecond: Math.round(cps * 100) / 100,
      wordsPerSecond: Math.round(wps * 100) / 100,
      estimatedReadingTime: Math.round(readingTime * 100) / 100,
      isComfortable: cps <= 20 && wps <= 4
    };
  }

  adjustDuration(text: string, currentDuration: number): number {
    const result = this.analyze(text, currentDuration);
    if (result.isComfortable) return currentDuration;
    const neededMs = (text.length / 15) * 1000;
    return Math.max(currentDuration, neededMs);
  }
}
