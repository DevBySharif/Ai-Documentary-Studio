import type { AIntWord, AIntSentence, AIntSpeechRate } from "./types.js";

export class AIntSpeechRateAnalyzer {
  analyze(words: AIntWord[], sentences: AIntSentence[]): AIntSpeechRate {
    const totalDuration = words.length > 0 ? words[words.length - 1].end - words[0].start : 1;
    const wpm = (words.length / totalDuration) * 60;
    const syllPerSec = words.reduce((sum, w) => sum + this.countSyllables(w.text), 0) / totalDuration;
    const sentenceSpeed = sentences.length > 0
      ? sentences.reduce((sum, s) => sum + s.text.split(/\s+/).length / (s.duration || 0.01), 0) / sentences.length
      : 0;

    return {
      wordsPerMinute: Math.round(wpm),
      syllablesPerSecond: Math.round(syllPerSec * 100) / 100,
      sentenceSpeed: Math.round(sentenceSpeed * 100) / 100,
      informationDensity: Math.round((words.reduce((sum, w) => sum + w.text.length, 0) / totalDuration) * 100) / 100
    };
  }

  needsLongerHold(rate: AIntSpeechRate, threshold = 160): number {
    const extra = rate.wordsPerMinute > threshold ? (rate.wordsPerMinute - threshold) / threshold : 0;
    return Math.min(extra, 0.5);
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, "");
    if (word.length <= 3) return 1;
    const vowels = word.match(/[aeiouy]{1,2}/g);
    return vowels ? vowels.length : 1;
  }
}
