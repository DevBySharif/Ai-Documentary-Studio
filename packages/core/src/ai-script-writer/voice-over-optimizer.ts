/**
 * Voice-Over & Pacing Optimizer (Vol 04 Part 03 - Section 9, Section 10).
 * Optimizes narration text for spoken delivery, breathing rhythm, sentence length, and pacing.
 */
export class VoiceOverOptimizer {
  public optimizeNarration(rawText: string): string {
    // Insert natural breathing pauses (ellipses or commas) and break overly long sentences
    const sentences = rawText.split(/(?<=[.!?])\s+/);

    const optimized = sentences.map((s) => {
      if (s.length > 120) {
        // Break long compound sentence into shorter narratable phrases
        return s.replace(/, and /g, ". ").replace(/, which /g, ". This ");
      }
      return s;
    });

    return optimized.join(" ");
  }

  public estimateSpeakingDurationSeconds(narrationText: string, wordsPerMinute = 140): number {
    const wordCount = narrationText.trim().split(/\s+/).length;
    return Math.round((wordCount / wordsPerMinute) * 60);
  }
}
