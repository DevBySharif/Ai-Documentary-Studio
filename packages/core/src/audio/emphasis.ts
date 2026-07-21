import type { EmphasisWord, WordTimestamp } from "./types.js";

export class EmphasisDetector {
  detect(words: WordTimestamp[]): EmphasisWord[] {
    if (words.length === 0) return [];

    const energies = words.map((w) => w.vocalEnergy || 0.5);
    const avgEnergy = energies.reduce((s, e) => s + e, 0) / energies.length;
    const threshold = avgEnergy * 1.3;

    return words
      .filter((w) => (w.vocalEnergy || 0.5) > threshold && w.word.length > 2)
      .map((w) => ({
        word: w.word,
        start: w.start,
        end: w.end,
        vocalEnergy: w.vocalEnergy || 0.5,
        triggerWordVisual: true,
        triggerPushIn: true,
        triggerSubtitleEmphasis: true,
      }));
  }

  detectByLength(words: WordTimestamp[], importanceConcepts: string[]): EmphasisWord[] {
    const emphasis: EmphasisWord[] = [];

    for (const word of words) {
      const isConcept = importanceConcepts.some(
        (c) => c.toLowerCase() === word.word.toLowerCase()
      );

      if (isConcept || word.word.length > 6) {
        emphasis.push({
          word: word.word,
          start: word.start,
          end: word.end,
          vocalEnergy: word.vocalEnergy || 0.7,
          triggerWordVisual: isConcept,
          triggerPushIn: true,
          triggerSubtitleEmphasis: isConcept,
        });
      }
    }

    return emphasis;
  }
}
