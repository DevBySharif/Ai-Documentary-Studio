import { VocalEmotion } from "./voice-types";

/**
 * Emotion & Emphasis Analyzer (Vol 04 Part 08 - Section 7, Section 9).
 * Analyzes narration text to extract emotional profiles and targeted emphasis words.
 */
export class EmotionEmphasisAnalyzer {
  public analyzeEmotion(text: string): VocalEmotion {
    if (text.includes("tragic") || text.includes("shattered") || text.includes("loss")) {
      return "Sadness";
    }
    if (text.includes("secret") || text.includes("mystery") || text.includes("hidden")) {
      return "Suspense";
    }
    if (text.includes("victory") || text.includes("achieved") || text.includes("triumph")) {
      return "Triumph";
    }
    return "Curiosity";
  }

  public detectEmphasisWords(text: string): ReadonlyArray<string> {
    const words = text.split(/\s+/);
    const emphasis: string[] = [];

    words.forEach((w) => {
      // Emphasize years, capitalized terms, or numbers
      if (/\b(18|19|20)\d{2}\b/.test(w) || /^[A-Z][a-z]{3,}$/.test(w)) {
        emphasis.push(w.replace(/[^a-zA-Z0-9]/g, ""));
      }
    });

    return emphasis.slice(0, 5);
  }
}
