/**
 * Multi-Image Sequencer & Duration Calculator (Vol 04 Part 05 - Section 8, Section 9).
 * Evaluates semantic complexity to allow multiple image changes per sentence and calculates duration.
 */
export class MultiImageSequencer {
  public calculateRecommendedDuration(text: string, readingWpm = 140): number {
    const words = text.trim().split(/\s+/).length;
    const duration = (words / readingWpm) * 60;
    return Math.max(2.5, Math.round(duration * 10) / 10);
  }

  public determineImageCount(text: string): number {
    // Longer complex sentences (over 25 words) produce multiple sequential images
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > 30) return 3;
    if (wordCount > 18) return 2;
    return 1;
  }
}
